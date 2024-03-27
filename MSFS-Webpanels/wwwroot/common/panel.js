require.config({
    baseUrl : '.',
    paths : {
        jquery : '../3rdparty/jquery/jquery-1.11.2.min',
        'SysParam' : "../common/sysparam"
    },
    waitSeconds : 30,
});

define([
         'jquery','SysParam'
         ],
function(jquery, SysParam) {
    return class Panel {

        constructor(aspectRatio) {
            this.instruments = [];
            this.coolDownTimeout = {};
            this.displayVal = {};
            this.simvarsOrg = {};
            this.isPoolingSimVars = false;
            this.isServerAppRunning = false;
            this.latestSimData=null;
            this.serverUpdateQueue = [];
            this.isPauseQueue = false;
            this.isProcessingQueue = false;
            this.queueTimerId = null;
            this.aspectRatio=aspectRatio;
            this.aircraftFolder = "";
            this.refreshPeriod = SysParam.refreshPeriod;
            this.coolDownTime = SysParam.defaultCoolDown;
            this.logger = {
                info:function(txt) {
                    this._log(1,txt);
                },
                debug:function(txt) {
                    this._log(0,txt);
                },
                error:function(txt) {
                    this._log(3,txt);
                },
                warn: function(txt) {
                    this._log(2,txt);
                },
                _log:function(lvl,txt) {
                    if (lvl>=SysParam.logLevel) {
                        var lvlText = ['DEBUG', 'INFO', 'WARNING', 'ERROR'];
                        var d = new Date().toISOString();
                        var logString = d+" " + lvlText[lvl]+" "+txt;
                        var html = jquery("#log-window").html() + logString + "<br/>";
                        jquery("#log-window").html(html);
                        console.log(logString);
                    }
                }
            }
        }

        postProcessingFunc(jsonData)
        {
            return jsonData;
        }

        resizePanel() {
            var wh=jquery(window).innerHeight();
            var ww=jquery(window).innerWidth();
            var fh = wh;
            var fw = ww;
            var ar = ww / wh;

            if (ar>this.aspectRatio) {
                fw=Math.floor(wh*this.aspectRatio);
                var lw=Math.round((ww-fw)/2);
                var rw=ww-fw-lw;
                jquery(".left-padding").css("width",lw);
                jquery(".right-padding").css("width",rw);
                jquery(".left-padding").removeClass("hide");
                jquery(".right-padding").removeClass("hide");
                jquery(".container").css("top", 0);
            } else {
                fh=Math.floor(ww/this.aspectRatio);
                jquery(".container").css("top", wh - fh);
                jquery(".left-padding").addClass("hide");
                jquery(".right-padding").addClass("hide");
            }
            jquery(".container").css("width", fw);
            jquery(".container").css("height", fh);
            this.logger.debug("resize panel from "+ww+"x"+wh + " to " +fw +"x"+fh);

            for(var i=0;i<this.instruments.length;i++) {
                this.instruments[i].onScreenResize();
            }
        }

        addInstrument(instrument) {
            this.instruments.push(instrument);
        }

        start()
        {
            this.logger.info("Panel Start");
            jquery(".menu-link").attr('href',"../?v="+SysParam.versionCode+"&noRedirect=true");
            jquery(".reload-icon").on(SysParam.tapEvent, function(e) {
                location.reload(true);
            });
            jquery(".help-icon").on(SysParam.tapEvent, function(e) {
                if (jquery("#help-screen-overlay").hasClass("hide")) {
                    jquery("#help-screen-overlay").removeClass("hide");
                    jquery(".help-overlay").removeClass("hide");
                } else {
                    jquery("#help-screen-overlay").addClass("hide");
                    jquery(".help-overlay").addClass("hide");
                }
            });

            jquery(window).resize(jquery.proxy(function() {
                this.resizePanel();
            }, this));

            var that = this;
            this.cssPromise.then(function() {
                jquery(".container").removeClass("hide");
                that.resizePanel();
            })
            
            setInterval(jquery.proxy(this.timerFunc,this), this.refreshPeriod);
        }

        loadCss(url)
        {
            var that = this;
            this.cssPromise = new Promise(function(resolve) {
            var head = jquery("head").first();
            var link = document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css";
            link.href=url + "?v="+SysParam.versionCode;
                link.onload = function() {
                    that.logger.debug("css loaded");
                    resolve();
                };
            head.append(link);
            });
        }

        refreshDisplay(jsonData)
        {
            var errMessage = "Webpanel is not started";

            if (this.isServerAppRunning) {
                this.latestSimData = jsonData;
                if (!jsonData.isSimConnected) {
                    errMessage = "Simulator is not connected";
                } else {
                    if (!jsonData.isSimRunning) {
                        errMessage = "Simulation is not started";
                    } else if (jsonData.isPaused) {
                        errMessage = "Simulation paused";
                    } else {
                        errMessage="";
                    }
                    if (jsonData.hasOwnProperty("simData")) {
                        this.simvarsOrg = JSON.parse(JSON.stringify(jsonData.simData));
                        this.aircraftFolder = jsonData.aircraftFolder;
                        var keys = Object.keys(jsonData.simData);
                        var ct = Date.now();
                        for(var i=0;i<keys.length;i++) {
                            var k = keys[i];
                            if (!this.coolDownTimeout.hasOwnProperty(k) || ct>this.coolDownTimeout[k]) {
                                this.displayVal[k]=jsonData.simData[k];
                            }
                        }
                        for(var i=0;i<this.instruments.length;i++) {
                            this.instruments[i].refreshInstrument();
                        }
                    }
                }
            }

            jquery("#sys-message").text(errMessage);
            if (errMessage!="") {
                jquery(".error-overlay").removeClass("hide");
            } else {
                jquery(".error-overlay").addClass("hide");
            }
        }

        timerFunc() {
            if (this.isPoolingSimVars) {
                return;
            }
            var thisClass = this;
            this.isPoolingSimVars=true;

            jquery.ajax({
                url: SysParam.simVarUrl,
                success: function(jsonData, textStatus, jqXHR ){
                    thisClass.isServerAppRunning=true;
                    if (jsonData.hasOwnProperty("simData")) {
                        thisClass.postProcessingFunc(jsonData);
                    }
                    thisClass.refreshDisplay(jsonData);
                    thisClass.isPoolingSimVars=false;
                },
                error: function(jqXHR, textStatus, errorThrown ) {
                    thisClass.isServerAppRunning=false;
                    thisClass.refreshDisplay(null);
                    thisClass.isPoolingSimVars=false;
                    this.logger.error("Unable to fetch sim data");
                },
                type: "get",
                dataType : "json",
                cache: false,
                timeout: 1000 // ms
            });
        }

        sendEvent(simvar, val) {
            if (val<0) {
                val=Math.pow(2,32)+val;
            }
            var queueItem = {
                simvar: simvar.toLowerCase(),
                param: val
            };
            if (!SysParam.isOfflineTest) {
                this.serverUpdateQueue.push(queueItem);
                this.processUpdateQueue(false);
            }
        }

        purgeUpdateQueue(simvar) {
            this.isPauseQueue=true;
            var newQueue=[];
            for(var i=0;i<this.serverUpdateQueue.length;i++) {
                var itm = this.serverUpdateQueue[i];
                if (itm.simvar!=simvar) {
                    newQueue.push(itm);
                }
            }
            this.serverUpdateQueue=newQueue;
            this.isPauseQueue=false;
        }

        processUpdateQueue(isTimer = true) {
            if (isTimer) {
                this.queueTimerId=null;
            }
            var thisClass=this;
            if (this.isProcessingQueue || this.isPauseQueue) {
                this.setUpdateQueueTimer();
                return;
            }
            if (this.serverUpdateQueue.length==0) {
                this.queueTimerId=null;
                return;
            }
            this.isProcessingQueue=true;
            var itm = this.serverUpdateQueue.shift();
            var param = {
                eventName : "simvar-"+itm.simvar.toLowerCase()
            };
            if (Array.isArray(itm.param)) {
                param.iparams = itm.param;
            } else {
                param.iparams = [itm.param];
            }
            if (itm.simvar=="xpdr") {
                param.iparams=[parseInt(itm.param.toString(),16)]
            }
            if (itm.simvar=="qnh2") {
                param.eventName="simvar-qnh";
                param.iparams=[itm.param,2];
            }
            if (itm.simvar=="autopilotselectedmachholdvalue" || itm.simvar=="autopilotselectedairspeedholdvalue") {
                if (itm.simvar=="autopilotselectedmachholdvalue") {
                    itm.param=Math.round(itm.param*100);
                }
                param.iparams=[itm.param, 1];
            }
            if (param.eventName.endsWith("freq")) {
                var bcd = parseInt(itm.param.toString(),16);
                if (param.eventName.startsWith("simvar-adf")) {
                    bcd<<=16;
                } else {
                    bcd = bcd >> 4;
                    bcd &= 0xffff;
                }
                param.iparams=[bcd];
            }
            for(var i=0;i<param.iparams.length;i++) {
                var v = param.iparams[i];
                if (v<0) {
                    param.iparams[i]=Math.pow(2,32)+v;
                }
            }
            var jsonText=JSON.stringify(param);
            this.logger.debug("Send command "+jsonText);
            jquery.ajax(SysParam.simVarUrl,
            {
                data: jsonText,
                contentType : "application/json",
                type: "POST",
                error: function(jqXHR, textStatus, errorThrown ) {
                    if (jqXHR.status!=400) {
                        thisClass.serverUpdateQueue.unshift(itm);
                        thisClass.isServerAppRunning=false;
                        thisClass.setUpdateQueueTimer();
                    }
                },
                complete: function( jqXHR, textStatus ) {
                    thisClass.isProcessingQueue=false;
                    thisClass.setUpdateQueueTimer();
                }
            });
        }

        setUpdateQueueTimer()
        {
            if (this.queueTimerId==null) {
                this.queueTimerId = setTimeout(jquery.proxy(this.processUpdateQueue,this), SysParam.serverUpdateCooldown);
            }
        }

        onSimVarChange(simVar, val, sendEvent = true) {
            if (this.simvarsOrg.hasOwnProperty(simVar)) {
                var coolDownTime = Date.now() + this.coolDownTime;
                this.displayVal[simVar] = val;
                this.coolDownTimeout[simVar] = coolDownTime;
            }
            if (sendEvent) {
                this.sendEvent(simVar, val);
            }
        }

    }
});