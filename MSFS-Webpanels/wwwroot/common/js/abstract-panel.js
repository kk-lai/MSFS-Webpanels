require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.12.4.min'
    },
    waitSeconds: 30,
});


define([
    'jquery'
],
    function (jquery) {
        return class AbstractPanel {
            constructor(panelId) {
                //this.debugUI = true;
                this.debugUI = false;
                this.panelId = panelId;
                this.apiRoot = "/api/webpanel";
                this.aspectRatio = 1024 / 748;
                this.coolDown = 1000; // 1sec
                this.refreshTime = 200;
                this.appTimer = null;
                this.isConnected = true;
                this.urlArgs = ""
                this.requestDef = {};
                this.cmdDef = {};
                this.queue = [];
                this._lock = Promise.resolve();
                this.isProcessing = false;
                this.page = 1;
                this.step = 0;
                this.repeatTimer = null;
                this.repeatTriggerTime = null;
                this.repeatStage1Time = 500; 
                this.repeatStage2Time = 2000;
                this.repeatStage3Time = 5000;
                this.repeatTimeRecurring = 100; //

                this.touchDevice = ('ontouchstart' in document.documentElement);
                if (this.touchDevice) {
                    this.ev = 'touchstart';
                    this.evTapStart = 'touchstart';
                    this.evTapEnd = 'touchend';
                    this.evMove = 'touchstart touchmove touchend';
                } else {
                    this.ev = 'click';
                    this.evTapStart = 'mousedown';
                    this.evTapEnd = 'mouseup mouseleave';
                    this.evMove = 'mousedown mousemove mouseup mouseleave';
                }
            }

            start() {
                var urlParams = new URLSearchParams(window.location.search);
                this.urlArgs = "";
                if (urlParams.has('v')) {
                    this.urlArgs = "v=" + urlParams.get('v');
                } else {
                    this.urlArgs = "t=" + Date.now();
                }
                if (urlParams.has('page')) {
                    this.page = parseInt(urlParams.get('page'))
                }

                var self = this;
                jquery(document).ready(function () {
                    jquery.get(self.panelId + '.svg?' + self.urlArgs, function (data) {
                        var svg = jquery(data).find('svg');
                        jquery("#svg-container").html(svg);

                        self.resizeContainer();
                        jquery(window).resize(function () {
                            self.resizeContainer();                            
                        });
                        jquery(".panel").attr("style", "display:inline;");
                        self.changePage(self.page);

                        jquery(".ctl.ctl-sw-toggle .tap,.ctl.ctl-knob-toggle .tap").on(self.ev, function (ev) {
                            self.onToggleSwitch(self, ev);
                        });
                        jquery(".ctl.ctl-sw-select .tap,.ctl.ctl-knob-select .tap").on(self.ev, function (ev) {
                            var inc = 1;
                            if (jquery(this).hasClass("tap-dec")) {
                                inc = -1;
                            }
                            self.onSwitchSelect(self, ev, inc);
                        });
                        jquery(".ctl.ctl-knob-rotate .tap").on(self.evTapStart, function (ev) {
                            var ctl = jquery(this).parent();
                            var dir = (jquery(this).hasClass("tap-inc")) ? 1 : -1;
                            self.repeatTriggerTime = Date.now();
                            self.onKnobRotate(self, ctl, dir);

                        });
                        jquery(".ctl.ctl-knob-rotate .tap").on(self.evTapEnd, function (ev) {
                            if (self.repeatTimer != null) {
                                clearTimeout(self.repeatTimer);
                                self.repeatTimer = null;
                            }
                        });
                        jquery(".ctl.ctl-btn .tap").on(self.ev, function (ev) {
                            self.onButtonTapped(self, ev);
                        });
                        jquery(".panel-icon").on(self.ev, function (ev) {
                            var val = jquery(this).attr("value");
                            self.changePage(val);
                        });
                        jquery(".tap").on(self.evTapStart, function(ev) {
                            jquery(this).removeClass("tap-hide");
                            jquery(this).addClass("tap-show");
                        });
                        jquery(".tap").on(self.evTapEnd, function(ev) {
                            jquery(this).addClass("tap-hide");
                            jquery(this).removeClass("tap-show");
                        });
                        self.setConnectionState(false);
                        self.appTimer = setInterval(self.timerFunc, self.refreshTime, self);           
                        
                    });                    
                });
            }

            changePage(pgNo) {
                jquery(".ctl.ctl-knob .knob-img").attr("style", "display: inline;")
                jquery(".panel").addClass("panel-hide");
                var pg = jquery(".panel-" + pgNo).first();

                pg.removeClass("panel-hide");
                var title = pg.attr("value");
                document.title = title;
                var url = new URL(window.location);
                url.searchParams.set('page', pgNo);
                window.history.pushState({}, '', url);
            }

            updatePanel(self,json) {
                for (const [key, value] of Object.entries(json)) {
                    self.updateUI(self,key, value);
                }
            }

            updateUI(self, ui, value, skipHot = true) {
                var cts = Date.now();
                jquery("[ctl='" + ui + "']").each(function (idx, item) {
                    if (skipHot) {
                        var ctlCoolDown = cts;
                        var attr = jquery(item).attr("cooldown");
                        if (typeof attr !== 'undefined' && attr !== false) {
                            ctlCoolDown = jquery(item).attr("cooldown");
                        }
                        if (cts < ctlCoolDown) {
                            return;
                        }
                    } else {
                        jquery(item).attr("cooldown", cts + self.coolDown);
                    }
                    jquery(item).attr("value", value);
                    value=self.preUpdateUI(self, ui, item, value);
                    if (jquery(item).hasClass("ctl-sw")) {
                        jquery(item).find(".sw-img").addClass("ctl-hide");
                        jquery(item).find(".sw-state-" + value).removeClass("ctl-hide");
                    }
                    if (jquery(item).hasClass("ctl-knob")) {
                        var angle = parseInt(jquery(item).attr("angle"));
                        var offset = parseInt(jquery(item).attr("offset"));
                        var fangle = offset + value * angle;
                        jquery(item).find(".knob-img").css({
                            "transform": "rotate(" + fangle + "deg)",
                            "transform-origin": "center",
                            "transform-box": "fill-box" // for SVG elements
                        });
                    }
                    if (jquery(item).hasClass("ind")) {
                        var inda = (value == 0) ? "ind-off" : "ind-on";
                        var indr = (value == 0) ? "ind-on" : "ind-off";
                        jquery(item).find(".ind-mask").addClass(inda);
                        jquery(item).find(".ind-mask").removeClass(indr);
                    }
                    if (jquery(item).hasClass("lbl")) {
                        var type = jquery(item).attr("type");
                        var svalue = value;
                        if (type == "decimal") {
                            svalue = value;
                            var dp = parseInt(jquery(item).attr("dp"));
                            svalue = svalue.toFixed(dp);
                        } else if (type == "integer") {
                            var attr = jquery(item).attr("leadingzeros");
                            svalue = value.toString();
                            if (typeof attr !== 'undefined' && attr !== false) {
                                var leadingZeros = parseInt(attr);
                                svalue = svalue.padStart(leadingZeros, "0");
                            }                            
                        }
                        jquery(item).find(".lbl-value tspan").text(svalue);                       
                    }
                });
            }

            preUpdateUI(self, ui, item, value) {
                return value;
            }

            setConnectionState(newState) {
                if (this.isConnected != newState) {
                    if (newState) {
                        jquery("#error-overlay").addClass("overlay-hide");
                    } else {
                        jquery("#error-overlay").removeClass("overlay-hide");
                    }
                    this.isConnected = newState;
                }
            }

            timerFunc(self) {
                if (self.debugUI) {                    
                    jquery.ajax({
                        url: "b38m.json",
                        method: "GET",
                        success: function (jsonData, textStatus, jqXHR) {
                            self.setConnectionState(true);
                            self.updatePanel(self,jsonData);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            self.setConnectionState(false);
                        },
                        dataType: "json",
                        cache: false
                    });
                } else {
                    if (self.isConnected) {
                        jquery.ajax({
                            url: self.apiRoot + "/get-data/" + self.panelId,
                            method: "GET",
                            success: function (jsonData, textStatus, jqXHR) {
                                self.setConnectionState(true);
                                self.updatePanel(self,jsonData);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                self.setConnectionState(false);
                            },
                            dataType: "json",
                            cache: false
                        });
                    } else {
                        jquery.ajax({
                            url: self.apiRoot + "/register/" + self.panelId,
                            data: JSON.stringify(self.requestDef),
                            contentType: "application/json",
                            method: "POST",
                            success: function (jsonData, textStatus, jqXHR) {
                                self.setConnectionState(true);
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                self.setConnectionState(false);
                            },
                            cache: false
                        });
                    }
                }
            }

            resizeContainer() {
                var wh = jquery(window).innerHeight();
                var ww = jquery(window).innerWidth();

                var fh = wh;
                var fw = ww;
                var ar = ww / wh;
                var voffset = 0;
                var hoffset = 0;
                if (ar > this.aspectRatio) {
                    fw = Math.floor(wh * this.aspectRatio);
                    hoffset = (ww - fw) / 2;
                } else {
                    fh = Math.floor(ww / this.aspectRatio);
                    voffset = (wh - fh);
                }
                jquery("#svg-container").css("width", fw);
                jquery("#svg-container").css("height", fh);
                jquery("#svg-container").css("padding-top", voffset);
                jquery("#svg-container").css("padding-left", hoffset);

                jquery("#svg-container svg").attr("width", fw);
                jquery("#svg-container svg").attr("height", fh);
            }

            runSingleInstance(task) {
                var release;
                const nextLock = new Promise(function (resolve) {
                    release = resolve;
                });

                const previousLock = this._lock;
                this._lock = nextLock;

                return previousLock
                    .then(function () {
                        return task();
                    })
                    .finally(function () {
                        release();
                    });
            }

            sendCommand(self, ui, val, removeDuplicate = false) {
                console.log("sendCommand:" + ui + ":" + val);
                if (self.debugUI) {
                    return;
                }
                var cmd = self.cmdDef[ui].replace("?", val.toString());
                var itm = {
                    "ui": ui,
                    "cmd": cmd,
                    "isSkip": false
                };
                if (removeDuplicate) {
                    self.queue.forEach(function (itm) {
                        if (itm.ui == ui) {
                            itm.isSkip = true;
                        }
                    });
                }
                self.queue.push(itm);
                self.processSendQueue();
            }


            async processSendQueue() {
                if (this.queue.length === 0) return;

                var self = this;

                await this.runSingleInstance(async function() {
                    self.isProcessing = true;
                    var qitm = null;
                    while (self.queue.length > 0) {
                        qitm = self.queue.shift();
                        if (!qitm.isSkip) {
                            break;
                        }
                        console.log("skip:" + qitm.cmd);
                    }
                    if (qitm != null && !qitm.isSkip) {
                        console.log("ajax:" + self.apiRoot + "/exec-code => " + qitm.cmd);
                        return new Promise(function (resolve, reject) {
                            jquery.ajax({
                                url: self.apiRoot + "/exec-code",
                                method: "POST",
                                data: { cmd: qitm.cmd },
                                success: function (response) {
                                    self.setConnectionState(true);
                                    self.isProcessing = false;
                                    resolve();
                                },
                                error: function (xhr, status, error) {
                                    self.setConnectionState(false);
                                    self.isProcessing = false;
                                    resolve();
                                },
                                cache: false
                            });
                        }).then(function () {
                            if (self.queue.length > 0) {
                                self.processSendQueue();
                            }

                        });
                    }                    
                });
            }

            // 
            onToggleSwitch(self, ev) {
                var ctl = jquery(ev.target).parent();
                var ui = ctl.attr("ctl");
                var val = parseInt(ctl.attr("value"));

                val = (1 - val);
                self.sendCommand(self, ui, val);
                self.updateUI(self, ui, val, false);
            }

            onSwitchSelect(self, ev, inc) {
                var ctl = jquery(ev.target).parent();
                var ui = ctl.attr("ctl");
                var val = parseInt(ctl.attr("value"));
                var max = parseInt(ctl.attr("max"));
                var min = parseInt(ctl.attr("min"));
                var nval = val + inc;

                if (nval >= min && nval <= max) {
                    self.sendCommand(self, ui, nval);
                    self.updateUI(self, ui, nval, false);
                }
            }

            onKnobRotate(self, ctl, dir) {
                var ui = jquery(ctl).attr("ctl");
                var minVal = parseFloat(jquery(ctl).attr("min"));
                var maxVal = parseFloat(jquery(ctl).attr("max"));
                var dt = Date.now() - self.repeatTriggerTime;
                var oVal = parseFloat(jquery(ctl).attr("value"));
                var step = parseFloat(jquery(ctl).attr("step"));

                if (dt > self.repeatStage2Time) {
                    var step2 = jquery(ctl).attr("step2");
                    if (typeof step2 !== "undefined" && step2 !== false) {
                        step = step2;
                    }
                }

                if (dt > self.repeatStage3Time) {
                    var step3 = jquery(ctl).attr("step3");
                    if (typeof step3 !== "undefined" && step3 !== false) {
                        step = step3;
                    }
                }

                var adj = dir * step;
                console.log("Adj:" + adj+",val:"+oVal);
                var nVal = oVal + adj;
                var isCircular = jquery(ctl).hasClass("ctl-knob-circular");

                if (isCircular) {
                    if (nVal < minVal) {
                        nVal = maxVal+1 - minVal + nVal;
                    }
                    if (nVal > maxVal) {
                        nVal = (nVal - maxVal) + minVal - 1;
                    }
                } else {
                    if (nVal < minVal) {
                        nVal = minVal;
                    }
                    if (nVal > maxVal) {
                        nVal = maxVal;
                    }
                }
                
                if (nVal != oVal) {
                    self.sendCommand(self, ui, nVal, true);
                    self.updateUI(self, ui, nVal, false);
                    var rtime = self.repeatTimeRecurring;
                    if (dt < self.repeatStage1Time) {
                        rtime = self.repeatStage1Time;
                    }
                    self.repeatTimer = setTimeout(self.onKnobRotate, rtime, self, ctl, dir);
                }
            }

            onButtonTapped(self, ev) {                
                var ctl = jquery(ev.target).parent();
                var ui = ctl.attr("ctl");
                if (jquery(ctl).hasClass("btn-internal")) {
                    self.onInternalButtonTapped(self,ui, ev);
                    return;
                }
                self.sendCommand(self, ui, 1, false);
            }

            onInternalButtonTapped(self, ui, ev) {

            }
        }
    });
