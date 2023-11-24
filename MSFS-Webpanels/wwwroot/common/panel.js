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
            this.isPoolingSimVars = false;
            this.isServerAppRunning = false;
            this.latestSimData=null;
            this.serverUpdateQueue = [];
            this.isPauseQueue = false;
            this.isProcessingQueue = false;
            this.nextUpdateTime = 0;
            this.aspectRatio=aspectRatio;
            this.resizeContainer();            
        }
        
        postProcessingFunc(jsonData)
        {
            return jsonData;
        }
        
        resizeContainer() {
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
            jquery(".container").removeClass("hide");
        }
        
        addInstrument(instrument) {
            this.instruments.push(instrument);
        }
        
        start()
        {
            jquery(window).resize(jquery.proxy(function() {
                this.resizeContainer();
                for(var i=0;i<this.instruments.length;i++) {
                    this.instruments[i].onScreenResize();
                }
            }, this));
            setInterval(jquery.proxy(this.timerFunc,this), SysParam.refreshPeriod);
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
                    for(var i=0;i<this.instruments.length;i++) {
                        this.instruments[i].onSimVarUpdate(jsonData);
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
                    thisClass.postProcessingFunc(jsonData);
                    thisClass.refreshDisplay(jsonData);
                    thisClass.isPoolingSimVars=false;
                },
                error: function(jqXHR, textStatus, errorThrown ) {
                    thisClass.isServerAppRunning=false;
                    thisClass.refreshDisplay(null);
                    thisClass.isPoolingSimVars=false;
                },
                type: "get",
                dataType : "json",
                cache: false,
                timeout: 1000 // ms
            });
        }
        
        onInputChange(simvar, val, sendEvent = true) {
            for(var i=0;i<this.instruments.length;i++) {
                this.instruments[i].onSimVarChange(simvar,val);
            }
            var queueItem = {
                simvar: simvar,
                param: val
            };
            if (!SysParam.isOfflineTest && sendEvent) {
                this.serverUpdateQueue.push(queueItem);
                this.processUpdateQueue();
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
        
        processUpdateQueue() {
            var thisClass=this;
            if (this.isProcessingQueue || this.isPauseQueue) {
                return;
            }
            var ct = Date.now();
            if (ct>this.nextUpdateTime) {
                this.isProcessingQueue=true;
                this.nextUpdateTime=ct + SysParam.serverUpdateCooldown;
                var itm = this.serverUpdateQueue.shift();
                var param = {
                    eventName : "simvar-"+itm.simvar.toLowerCase(),
                    iparams: [itm.param]
                };
                if (itm.simvar=="xpdr") {
                    param.iparams=[parseInt(itm.param.toString(),16)]
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
                var jsonText=JSON.stringify(param);             
                console.log(Date.now()+":"+jsonText);   
                jquery.ajax(SysParam.simVarUrl,
                {
                    data: jsonText,
                    contentType : "application/json",
                    type: "POST",
                    error: function(jqXHR, textStatus, errorThrown ) {
                        if (jqXHR.status!=400) {
                            thisClass.serverUpdateQueue.unshift(itm);
                            thisClass.isServerAppRunning=false;
                        }
                    },
                    complete: function( jqXHR, textStatus ) {
                        thisClass.isProcessingQueue=false;
                        thisClass.setUpdateQueueTimer();
                    }                    
                });  
            }
        }
        
        setUpdateQueueTimer()
        {
            if (this.serverUpdateQueue.length>0) {
                var timeDiff = this.nextUpdateTime-Date.now();
                if (timeDiff<=0) {
                    timeDiff=10;
                }
                setTimeout(jquery.proxy(this.processUpdateQueue,this), timeDiff);
            }
        }
        
         
    }
});