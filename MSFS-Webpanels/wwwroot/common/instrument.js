require.config({
    baseUrl : '.',
    paths : {
        jquery : '3rdparty/jquery/jquery-1.11.2.min',
        'SysParam' : "../common/sysparam"
    },
    waitSeconds : 30,
});


define([
         'jquery', 'SysParam'
         ],
function(jquery, SysParam) {

    return class Instrument {
        
        static loadCss(url) {
            var head = jquery("head").first();
            var link = document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css";
            link.href=url;
            head.append(link);
        }
        
        static loadTemplate(url) {
            return new Promise(function(resolve, reject) {
                jquery.get(url, function(data) {
                    resolve(data);
                }).fail(function() {
                    reject();
                });
            });
        }
                
        constructor(panel, rootElm, simvars) {
            this.aspectRatio=1;
            this.simvars = [];
            this.coolDownTimeout=[];
            this.displayVal=[];
            this.panel = panel;
            this.rootElm = rootElm;
            this.simvars = simvars;
            this.isInstrumentOff = false;
            for(var i=0;i<simvars.length;i++) {
                this.coolDownTimeout.push(0);
                this.displayVal.push("");
            }
        }
        
        bindControls()
        {
            var thisClass=this;
            jquery(this.rootElm).on(SysParam.tapEvent,function(e) {
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-tap").on(SysParam.tapEvent,function(e) {
                thisClass.onTapEvent(this,e);        
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-tap").on(SysParam.tapEndEvent,function(e) {
                thisClass.onTapEndEvent(this,e);        
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-drag").on(SysParam.dragEvent,function(e) {
                var ev;
                if ('offsetX' in e) {
                    ev={
                        x:e.offsetX,
                        y:e.offsetY,
                        width: jquery(this).width(),
                        height: jquery(this).height(),
                        type: ""
                    };
                } else {
                    var pos=e.currentTarget.getBoundingClientRect();
                    var prop="touches";
                    if (e.type=="touchend") {
                        prop="changedTouches";
                    }
                    ev={
                        x:e.originalEvent[prop][0].clientX-pos.left,
                        y:e.originalEvent[prop][0].clientY-pos.top,
                        width: jquery(this).width(),
                        height: jquery(this).height(),
                        type: ""
                    };
                }
                
                if (e.type=="mousedown" || e.type=="touchstart") {
                    jquery(this).addClass("touch");
                    ev.type="touchstart";
                } else if ((e.type=="mousemove" || e.type=="touchmove") && jquery(this).hasClass("touch")) {
                    ev.type="touchmove";
                } else if ((e.type=="mouseup" || e.type=="mouseleave" || e.type=="touchend") && jquery(this).hasClass("touch")) {
                    jquery(this).removeClass("touch");
                    ev.type="touchend";
                }
                if (ev.type!="") {
                    thisClass.onDragEvent(this,ev,e);
                }                
                e.preventDefault();
            });
        }

        onSimVarUpdate(jsonData) {
            var ct = Date.now();
            for(var i=0;i<this.simvars.length;i++) {
                if (ct>this.coolDownTimeout[i]) {
                    this.displayVal[i]=jsonData.simData[this.simvars[i]];
                }
            }
            this.updateInstrumentState();
            this.refreshInstrument();
        }
        
        onSimVarChange(simVar, val) {
            var coolDownTime = Date.now() + SysParam.defaultCoolDown;
            for(var i=0;i<this.simvars.length;i++) {
                if (this.simvars[i]==simVar) {
                    this.displayVal[i]=val;
                    this.coolDownTimeout[i]=coolDownTime;
                }
            }
        }
        
        onInputValChanged(idx, val, sendEvent = true) {
            if (idx<this.simvars.length) {
                this.panel.onInputChange(this.simvars[idx], val, sendEvent);
            }
            this.displayVal[idx]=val;
            this.coolDownTimeout[idx]=Date.now() + SysParam.defaultCoolDown;
        }

        onScreenResize() {
            var elm=this.rootElm;
            var w = jquery(elm).width();
            var h = w / this.aspectRatio;
            jquery(elm).css("height",h);
            jquery(elm).css("font-size", h/7);
        }
        
        setDisplayVal(idx, val) {
            this.displayVal[idx]=val;
            this.coolDownTimeout[idx]=Date.now() + SysParam.defaultCoolDown;
        }

        purgeUpdateQueue(idx) {
            this.panel.purgeUpdateQueue(this.simvars[idx]);
        }

        refreshInstrument()
        {
            // abstract func
        }
        
        updateInstrumentState()
        {
            // abstract func
        }
        
        onDragEvent(elm, ev, e) {
            // abstract func
        }
        
        onTapEvent(elm, e) {
            // abstract func
        }
        
        onTapEndEvent(elm, e) {
            // abstract func
        }

        showKnob(elm, val, sf, offset)
        {
            var knob = jquery(this.rootElm).find(elm);
            var rAngle = val * sf + offset;
            knob.css("transform", "rotate("+rAngle+"deg)");
        }

        showKnobSwitch(elm, val, tbl)
        {
            var knob = jquery(this.rootElm).find(elm);
            var rAngle = tbl[val];
            knob.css("transform", "rotate("+rAngle+"deg)");
        }

        handleUpDownContrl(elm, idx, minusClass,  min, max) {
            var cpos = this.displayVal[idx];
            var npos = cpos;
            if (jquery(elm).hasClass(minusClass)) {
                if (cpos>min) {
                    npos--;
                }
            } else {
                if (cpos<max) {
                    npos++;
                }
            }
            if (cpos!=npos) {
                this.onInputValChanged(idx, npos);
            }
        }

        handleKnobControl(elm, ev, idx, knobs) {
            /*
            {
                divCtl: ".ctl"
                startDigit:
                endDigit: 
                step: 1,
                stepsPerFullCircle:5
                min: 0,
                max: 9,
                carry: true/false
            }
            */
            var angle;
            var xc=ev.width/2;
            var yc=ev.height/2;
            var x=ev.x - xc;
            var y=yc- ev.y;
            var touchZone;

            angle = Math.atan2(y,x) * 180 / Math.PI;
            if (angle<0) {
                angle = 360+angle;
            }

            if (ev.type=="touchstart") {
                jquery(elm).attr("netOffset", 0);
                jquery(elm).attr("lastAngle", angle);
                
                touchZone=0;
                if (knobs.length>1) {
                    var zoneRange = 360/knobs.length;
                    var oangle = angle - (90-180/knobs.length);
                    if (oangle<0) {
                        oangle = oangle + 360;
                    }
                    touchZone = Math.floor(oangle/zoneRange);
                    
                    for(var i=0;i<knobs.length;i++) {
                        if (i!=touchZone) {
                            jquery(this.rootElm).find(knobs[i].divCtl).addClass("hide");
                        }                        
                    }
                }
                jquery(elm).attr("touchZone", touchZone);
                var knob = knobs[touchZone];

                // find non-target digits and target digit(s)
                var sVal = Math.abs(this.displayVal[idx]).toString();
                var baseValue = 0;
                var initValue = 0;
                var sf = 1;
                for(var i=sVal.length-1;i>=0;i--) {
                    var dpos = sVal.length-i;
                    var digit = parseInt(sVal.substring(i,i+1));
                    if (dpos>=knob.startDigit && dpos<=knob.endDigit) {
                        initValue = initValue + digit*sf;
                    } else {
                        baseValue = baseValue + digit*sf;
                    }
                    sf=sf*10;
                }
                initValue=initValue-knob.min;
                baseValue = baseValue * Math.sign(this.displayVal[idx]);
                jquery(elm).attr("currentValue", this.displayVal[idx]);
                jquery(elm).attr("initValue", initValue);
                jquery(elm).attr("baseValue", baseValue);
            } else if (ev.type=="touchmove" || ev.type=="touchend") {
                var lastAngle = parseFloat(jquery(elm).attr("lastAngle"));
                var netOffset = parseFloat(jquery(elm).attr("netOffset"));
                var touchZone = parseInt(jquery(elm).attr("touchZone"));
                var currentValue = parseInt(jquery(elm).attr("currentValue"));
                var baseValue = parseInt(jquery(elm).attr("baseValue"));
                var initValue = parseInt(jquery(elm).attr("initValue"));

                var knob = knobs[touchZone];
                var angDiff = angle - lastAngle;
                var newValue;
                if (Math.abs(angDiff)>180) {
                    angDiff = -1*Math.sign(angDiff)*(360-Math.abs(angDiff));
                }
                if (Math.abs(angDiff)>0) {
                    netOffset = netOffset + angDiff;
                    jquery(this.rootElm).find(knob.divCtl).css("transform","rotate("+(-netOffset-touchZone*360/knobs.length)+"deg)");
                    newValue = -netOffset*knob.step*knob.stepsPerFullCircle/360;
                    newValue = Math.round(newValue);
                    newValue = (newValue + initValue) - (newValue % knob.step);
                    newValue = Math.round(newValue);

                    if (!knob.carry) {
                        if (knob.wrapAround) {
                            newValue = newValue % (knob.max-knob.min+knob.step) + knob.min;
                            if (newValue<0) {
                                newValue = (knob.max-knob.min+knob.step)+newValue + knob.min
                            }
                        } else {
                            newValue=newValue+knob.min;
                            if (newValue<knob.min) {
                                newValue=knob.min;
                            }
                            if (newValue>knob.max) {
                                newValue=knob.max;
                            }
                        }                        
                    }
                    newValue = newValue + baseValue;
                    if (newValue!=currentValue) {                        
                        this.purgeUpdateQueue(idx);
                        this.onInputValChanged(idx,newValue,true);
                        jquery(elm).attr("currentValue",newValue);
                    }
                    jquery(elm).attr("lastAngle",angle);
                    jquery(elm).attr("netOffset",netOffset);
                }

                if (ev.type=="touchend") {
                    jquery(elm).removeAttr("netOffset");
                    jquery(elm).removeAttr("lastAngle");
                    jquery(elm).removeAttr("touchZone");
                    jquery(elm).removeAttr("currentValue");
                    jquery(elm).removeAttr("baseValue");
                    jquery(elm).removeAttr("initValue");
                    var offsetAng = 0;
                    for(var i=0;i<knobs.length;i++) {
                        var divCtl = jquery(this.rootElm).find(knobs[i].divCtl);
                        divCtl.removeClass("hide");
                        divCtl.css("transform","rotate("+(-i*360/knobs.length)+"deg)");
                    }
                }
            }
        }

        handleSwitchTap(elm, idx, min=0, max=1) {
            var cstate = this.displayVal[idx];
            var nstate = cstate;

            nstate++;
            if (nstate>max) {
                nstate=min;
            }
            this.onInputValChanged(idx, nstate);            
        }

        interpolate(val, tbl) {
            var min = tbl[0][0];
            var max = tbl[tbl.length-1][0];
            var idx;
            if (val<min) {
                val=min;
            }
            if (val>max) {
                val=max;
            }

            for(var idx=0;idx<tbl.length-1;idx++) {
                if (val<=tbl[idx+1][0]) {
                    break;
                }
            }
            return (val-tbl[idx][0])*(tbl[idx+1][1]-tbl[idx][1])/(tbl[idx+1][0]-tbl[idx][0]) + tbl[idx][1];
        }
    }

});
