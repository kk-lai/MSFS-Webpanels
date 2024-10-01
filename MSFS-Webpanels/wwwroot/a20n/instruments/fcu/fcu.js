require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument',
        StaticPropertyHelper: "../common/static-property-helper"
    },
    waitSeconds : 30,
});


/*
A32NX References
VCockpit09 A320_Neo_FCU
fcu/a320neo_fcu.js


*/

define([
         'jquery', 'Instrument','StaticPropertyHelper'
         ],
function(jquery, Instrument, StaticPropertyHelper) {

    return class A20NFCU extends Instrument {
        constructor(panel,elm, simvars)
        {
            super(panel,elm, simvars);

            this.ctlTarget=null;
            this.adjVal = 0;
            this.adjScaleFactor = 1;
            this.maxVal = 0;
            this.minVal = 0;
            this.modVal = 0;
            this.tapStartTimeStamp = 0;
            this.timerId = null;
        }

        init()
        {
            this.aspectRatio = 1120/393;
            this.htmlFile="../a20n/instruments/fcu/fcu-template.html";
            this.cssFile="../a20n/instruments/fcu/fcu.css";
        }

        preprocessLocalDisplayVal()
        {
            if (this.panel.aircraftFolder=="Asobo_A320_NEO") {
                this.localDisplayVal.isSpdManaged = this.localDisplayVal.autoPilotAirspeedSlotIndex==2;
                this.localDisplayVal.showSelectedSpeed = this.localDisplayVal.showSelectedSpeed==1;
                this.localDisplayVal.isHdgManaged = (this.localDisplayVal.autoPilotHeadingSlotIndex==2) || (this.localDisplayVal.autoPilotAPPRHold);
                this.localDisplayVal.showSelectedHeading = this.localDisplayVal.showSelectedHeading && (!this.localDisplayVal.autoPilotGlideslopeHold);
                this.localDisplayVal.isAltManaged = (this.localDisplayVal.autoPilotAltitudeManaged== 2);
                this.localDisplayVal.isVSManaged = (this.localDisplayVal.fcuState==0);
            }
        }

        refreshInstrument()
        {
            super.refreshInstrument();
            jquery(this.rootElm).find(".ind,.ind-btn,.selector-switch").removeClass("state-on state-off").addClass("state-off");

            var displayData = {
                indspd : false,
                indmach: false,
                indspdmanaged: false,
                indhdg: false,
                indtrk: false,
                indlat: true,
                indhdgmanaged: false,
                indhdgc: false,
                indtrkc: false,
                indvsc: false,
                indfpac: false,
                indalt: true,
                indlvlch: true,
                indlvlchleft: true,
                indlvlchright: true,
                indaltmanaged: false,
                indvs: false,
                indfpa: false,
                indloc: false,
                indap1: false,
                indap2: false,
                indathr: false,
                indexped: false,
                indappr: false,
                knbspd: false,
                knbhdg: false,
                knbalt: false,
                knbvs:false,
                knbaltsel: false,
                valspd: "---",
                valhdg: "---",
                valalt:"5000",
                valvs:"---"
            };

            this.isInstrumentOff=(!this.localDisplayVal.isCircuitGeneralPanelOn);

            if (this.isInstrumentOff) {
                return;
            }

            if (this.panel.aircraftFolder=="Asobo_A320_NEO") {
                // Speed
                if (this.localDisplayVal.isMachActive) {
                    displayData.indmach=true;
                    displayData.valspd = this.localDisplayVal.autoPilotSelectedMachHoldValue.toFixed(2);
                } else {
                    displayData.indspd=true;
                    displayData.valspd = this.localDisplayVal.autoPilotSelectedAirspeedHoldValue.toFixed(0).padStart(3, "0");
                }

                if (this.localDisplayVal.isSpdManaged) {
                    if (!this.localDisplayVal.showSelectedSpeed) {
                        displayData.valspd="---";
                    }
                    displayData.indspdmanaged=true;
                }

                // Heading
                if (this.localDisplayVal.isTRKMode) {
                    displayData.indtrk=true;
                    displayData.indtrkc=true;
                    displayData.indfpa=true;
                    displayData.indfpac=true;
                } else {
                    displayData.indhdg=true;
                    displayData.indhdgc=true;
                    displayData.indvs=true;
                    displayData.indvsc=true;
                }

                if (this.localDisplayVal.isLateralModeActive) {
                    displayData.valhdg="000";
                } else {
                    displayData.valhdg = (this.localDisplayVal.autoPilotDisplayedHeadingLockValueDegrees.toFixed(0)).padStart(3, "0");
                }

                if (this.localDisplayVal.isHdgManaged) {
                    if (!this.localDisplayVal.showSelectedHeading) {
                        displayData.valhdg="---";
                    }
                    displayData.indhdgmanaged=true;
                } else {
                    displayData.indhdgmanaged=false;
                }

                // ALT
                if (this.localDisplayVal.isAltManaged) {
                    displayData.indaltmanaged=true;
                } else {
                    displayData.indaltmanaged=false;
                }
                displayData.valalt = (Math.floor(Math.max(100,this.localDisplayVal.autoPilotDisplayedAltitudeLockValueFeet))+'').padStart(5, "0");

                // VS
                // fcuState 0=Idle, 1=Zeroing, 2=Selecting, 3=Flying
                if (this.localDisplayVal.isVSManaged) {
                    displayData.valvs="-----";
                } else {
                    var sgn = (this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue < 0) ? '-' : '+';
                    var vsval = Math.abs(this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue);

                    if (this.localDisplayVal.isTRKMode) {
                        displayData.valvs=sgn+Math.min(vsval/600,9.9).toFixed(1)+'0';
                    } else {
                        if (this.localDisplayVal.fcuState==1) {
                            displayData.valvs="00oo";
                        } else {
                            displayData.valvs=sgn+(Math.floor(vsval/100)+'00').padStart(4,"0");
                        }
                    }
                }

                // Buttons Indicators
                displayData.indloc = (this.localDisplayVal.autoPilotAPPRHold) && (!this.localDisplayVal.autoPilotGlideslopeHold);
                displayData.indap1 = (this.localDisplayVal.autoPilot1Status);
                displayData.indap2 = (this.localDisplayVal.autoPilot2Status);
                displayData.indathr = (this.localDisplayVal.autoPilotThrottleArm);
                displayData.indappr = (this.localDisplayVal.autoPilotAPPRHold) && (this.localDisplayVal.autoPilotGlideslopeHold);
                displayData.indexped = this.localDisplayVal.autoPilotAirspeedSlotIndex==3;
                displayData.knbaltsel = this.localDisplayVal.autoPilotAltInc==1000;
            } // End of Asobo A320Neo

            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                // Speed
                if (this.localDisplayVal.apSelectedSpeed<0) {
                    displayData.valspd ="---";
                } else {
                    if (this.localDisplayVal.isMachActive) {
                        displayData.indmach=true;
                        displayData.valspd = this.localDisplayVal.apSelectedSpeed.toFixed(2);
                    } else {
                        displayData.indspd=true;
                        displayData.valspd = this.localDisplayVal.apSelectedSpeed.toFixed(0).padStart(3, "0");
                    }
                }
                displayData.indspdmanaged=this.localDisplayVal.isSpeedManaged;

                // Heading
                if (this.localDisplayVal.isHeadingDashed) {
                    displayData.valhdg="---";
                } else {
                    displayData.valhdg=this.localDisplayVal.apSelectedHeading.toFixed(0).padStart(3,"0");
                }
                displayData.indhdgmanaged=this.localDisplayVal.isHeadingManaged;

                // Altitude
                displayData.valalt = (Math.floor(Math.max(100,this.localDisplayVal.autoPilotDisplayedAltitudeLockValueFeet))+'').padStart(5, "0");
                displayData.indaltmanaged = this.localDisplayVal.isAltManaged;

                // VS or FPA

                if (this.localDisplayVal.fcuState!=0) { // fcu not idle
                    if (this.localDisplayVal.isA32NXFPAModeActive) {
                        displayData.valvs=(this.localDisplayVal.autoPilotSelectedFPAHoldValue < 0 ? '-' : '+')+Math.abs(this.localDisplayVal.autoPilotSelectedFPAHoldValue).toFixed(1);
                    } else {
                        if (this.localDisplayVal.fcuState==1) {
                            displayData.valvs="00oo";
                        } else {
                            displayData.valvs=(this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue < 0 ? '-' : '+')+
                                Math.abs(this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue/100).toFixed(0).padStart(2, "0") + "oo";
                        }
                    }
                } else {
                    displayData.valvs="---";
                }
                if (this.localDisplayVal.isA32NXFPAModeActive) {
                    displayData.indtrk=true;
                    displayData.indtrkc=true;
                    displayData.indfpac=true;
                    displayData.indfpa=true;
                } else {
                    displayData.indhdg=true;
                    displayData.indhdgc=true;
                    displayData.indvsc=true;
                    displayData.indvs=true;
                }

                displayData.indloc=this.localDisplayVal.autoPilotLocHold;
                displayData.indap1=this.localDisplayVal.autoPilot1Status;
                displayData.indap2=this.localDisplayVal.autoPilot2Status;
                displayData.indathr=this.localDisplayVal.autoPilotThrottleArm;

                displayData.knbaltsel=this.localDisplayVal.autoPilotAltInc==1000;
                displayData.indappr=this.localDisplayVal.autoPilotAPPRHold;
                displayData.indexped=this.localDisplayVal.autoPilotExpediteActive;

            } // End of FlyByWire_A320_NEO

            var ks=Object.keys(displayData);

            for(var i=0;i<ks.length;i++) {
                var k = ks[i];
                var t = k.substring(0,3);
                var n = k.substring(3);
                var v = displayData[k];
                if (t=="ind" || t=="knb") {
                    var oc = v ? "state-on": "state-off";
                    jquery(this.rootElm).find("."+t+"-"+n).removeClass("state-off state-on").addClass(oc);
                } else {
                    jquery(this.rootElm).find(".val-"+n).removeClass("state-off state-on").addClass("state-on").text(v);
                }
            }
        } // refreshInstrument

        // Asobo
        onSpeedHoldChanged()
        {
            this.panel.sendEvent("a20nairspeedchanged",1);

            var maxVal;
            var key;
            var sf ;
            if (this.localDisplayVal.isMachActive) {
                maxVal = 3.0;
                key = "autoPilotSelectedMachHoldValue";
                sf = 0.01;
            } else {
                maxVal = 990;
                key = "autoPilotSelectedAirspeedHoldValue";
                sf = 1;
            }
            var currentVal = this.localDisplayVal[key];
            var newVal;
            newVal = currentVal + this.adjVal*this.adjScaleFactor*sf;
            newVal = Math.round(newVal/sf)*sf;
            if (newVal> maxVal) {
                newVal = maxVal;
            }
            if (newVal< 0) {
                newVal = 0;
            }
            if (newVal!=currentVal) {
                this.onSimVarChange(key, newVal);
            }
        }

        onHeadingHoldChanged()
        {
            var hdg = Math.round(this.localDisplayVal.autoPilotDisplayedHeadingLockValueDegrees);
            var newHdg = hdg + this.adjVal*this.adjScaleFactor;
            if (newHdg<0) {
                newHdg = 360+newHdg;
            }
            newHdg = newHdg % 360;
            this.panel.onSimVarChange("headingbug", [newHdg, 3], true);
            this.onSimVarChange("autoPilotDisplayedHeadingLockValueDegrees", newHdg, false);
            this.panel.sendEvent("a20nheadingchanged",1);
        }

        onAltSelected()
        {
            this.panel.sendEvent("a20naltselected",1);
        }

        onAltManaged()
        {
            this.panel.sendEvent("a20naltmanaged",1);
        }

        onVSHold()
        {
            this.panel.sendEvent("a20nvshold",1);
        }

        onVSZero()
        {
            this.panel.sendEvent("a20nvszero",1);
        }

        onVSHoldChanged()
        {
            var oldVal;
            var sf;
            var max;

            oldVal = Math.round(this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue/100)*100;
            max=6000;

            var newVal = oldVal + this.adjVal*this.adjScaleFactor * 100;
            if (Math.abs(newVal)>max) {
                newVal = Math.sign(newVal)*max;
            }

            this.onSimVarChange("autoPilotSelectedVerticalSpeedHoldValue",newVal,false);
            this.panel.sendEvent("autoPilotSelectedVerticalSpeedHoldValue",[newVal,3]);
            this.panel.sendEvent("a20nvschanged",1);
        }

        onAutoPilot1Status()
        {
            this.onAutoPilotStatus(1);
        }

        onAutoPilot2Status()
        {
            this.onAutoPilotStatus(2);
        }

        onAutoPilotStatus(idx)
        {
            var oldAPMaster = (this.localDisplayVal.autoPilot1Status==0) && (this.localDisplayVal.autoPilot2Status==0) ? 0 : 1;
            var k1 = "autoPilot"+idx+"Status";
            var k2 = "autoPilot"+(2-idx+1)+"Status";
            var oldStatus = this.localDisplayVal[k1];
            var newStatus = (oldStatus==0) ? 1 : 0;
            this.onSimVarChange(k1,newStatus);
            var newAPMaster = (this.localDisplayVal.autoPilot1Status==0) && (this.localDisplayVal.autoPilot2Status==0) ? 0 : 1;
            if (newAPMaster != oldAPMaster) {
                this.panel.sendEvent("btnap",1);
            }
            this.onSimVarChange(k2,1-newStatus);
        }

        onLOCHold()
        {
            var oldState = (this.localDisplayVal.autoPilotAPPRHold) && (!this.localDisplayVal.autoPilotGlideslopeHold);
            var newState = oldState ? 0 : 1;

            if (this.localDisplayVal.autoPilotAPPRHold && this.localDisplayVal.autoPilotGlideslopeHold) {
                this.panel.sendEvent("autoPilotAPPRHold",0);
            }
            this.onSimVarChange("autoPilotAPPRHold",newState);
            this.onSimVarChange("autoPilotGlideslopeHold", 0, false);
        }

        onExped()
        {
            //this.panel.sendEvent("exped",0);
        }

        onAPPRHold()
        {
            var oldState = (this.localDisplayVal.autoPilotAPPRHold) && (this.localDisplayVal.autoPilotGlideslopeHold);
            var newState = oldState ? 0 : 1;
            if ((this.localDisplayVal.autoPilotAPPRHold) && (!this.localDisplayVal.autoPilotGlideslopeHold)) {
                this.panel.sendEvent("autoPilotAPPRHold",0);
            }
            this.panel.sendEvent("btnapr",0);
            this.onSimVarChange("autoPilotGlideslopeHold", newState, false);
        }

        onIsUnitMetricToggle()
        {
            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                var newState = 1- this.localDisplayVal.isUnitMetric;
                this.onSimVarChange("isUnitMetric", newState);
            }
        }

        onThrottleArm()
        {
            var newState = (this.localDisplayVal.autoPilotThrottleArm) ? 0 : 1;
            this.onSimVarChange("autoPilotThrottleArm",newState);
        }

        // A32NX
        onA32NXSpeedHoldChanged()
        {
            var maxVal;
            var minVal;
            var sf ;
            if (this.localDisplayVal.isMachActive) {
                maxVal = 0.99;
                minVal = 0.1;
                sf = 0.01;
            } else {
                maxVal = 399;
                minVal = 100;
                sf = 1;
            }
            var currentVal = this.localDisplayVal.apSelectedSpeed;
            var newVal;
            newVal = currentVal + this.adjVal*this.adjScaleFactor*sf;
            newVal = Math.round(newVal/sf)*sf;
            if (newVal> maxVal) {
                newVal = maxVal;
            }
            if (newVal< minVal) {
                newVal = minVal;
            }
            if (newVal!=currentVal) {
                if (this.localDisplayVal.isMachActive) {
                    this.onSimVarChange("apSelectedSpeed",  Math.round(newVal*100));
                    this.onSimVarChange("apSelectedSpeed",  newVal, false);
                } else {
                    this.onSimVarChange("apSelectedSpeed",  newVal);
                }
                this.onSimVarChange("apSelectedSpeedSet", 1);
            }
        }

        onA32NXHeadingHoldChanged()
        {
            var hdg = this.localDisplayVal.apSelectedHeading;
            var newHdg = hdg + this.adjVal*this.adjScaleFactor;
            if (newHdg<0) {
                newHdg = 360+newHdg;
            }
            newHdg = newHdg % 360;
            this.onSimVarChange("apSelectedHeading", newHdg, true);
            this.panel.sendEvent("a32nxheadingchanged",1);
        }

        onA32NXAltSelected()
        {
            this.panel.sendEvent("a20naltselected",1);
            this.panel.sendEvent("a32nxaltpull",1);
        }

        onA32NXAltManaged()
        {
            this.panel.sendEvent("a20naltmanaged",1);
            this.panel.sendEvent("a32nxaltpush",1);
        }

        onA32NXVSHoldChanged()
        {
            var sf;
            var oldVal;
            var maxVal;
            var osf;

            if (this.localDisplayVal.isA32NXFPAModeActive) {
                sf = 0.1;
                oldVal = this.localDisplayVal.autoPilotSelectedFPAHoldValue;
                maxVal=9.9;
                osf=10;
            } else {
                sf = 100;
                oldVal = this.localDisplayVal.autoPilotSelectedVerticalSpeedHoldValue;
                maxVal=6000;
                osf=1;
            }

            var newVal = oldVal + this.adjVal*this.adjScaleFactor * sf;
            if (Math.abs(newVal)<=maxVal) {
                if (this.localDisplayVal.isA32NXFPAModeActive) {
                    this.onSimVarChange("autoPilotSelectedFPAHoldValue",newVal,false);
                } else {
                    this.onSimVarChange("autoPilotSelectedVerticalSpeedHoldValue",newVal,false);
                }
                newVal = Math.round(newVal * osf);
                this.onSimVarChange("apselectedvs",newVal);
                this.onSimVarChange("a32nxvsfpschanged",1);
                this.onSimVarChange("a32nxcduvs",1);
            }
        }

        onA32NXVSHold()
        {
            this.onSimVarChange("a32nxvspull",1);
            this.onSimVarChange("a32nxcduvs",1);
        }

        onA32NXVSZero()
        {
            this.onSimVarChange("a32nxvspush",1);
            this.onSimVarChange("a32nxcduvs",1);
        }

        onA32NXLOCHold()
        {
            this.onSimVarChange("a32nxlocpush",1);
        }

        onA32NXAPPRHold()
        {
            this.onSimVarChange("a32nxapprpush",1);
        }

        onA32NXExped()
        {
            this.onSimVarChange("a32nxexpedpush",1);
        }

        onA32NXAutoPilot1Status()
        {
            this.onA32NXAutoPilotStatus(1);
        }

        onA32NXAutoPilot2Status()
        {
            this.onA32NXAutoPilotStatus(2);
        }

        onA32NXAutoPilotStatus(idx)
        {
            this.onSimVarChange("a32nxap"+idx+"push",1);
        }

        onA32NXThrottleArm()
        {
            var newState = (this.localDisplayVal.autoPilotThrottleArm) ? 0 : 1;
            this.onSimVarChange("autoPilotThrottleArm",newState,false);
            this.onSimVarChange("a32nxathrpush",1);
        }

        // Generic
        onSpdMachToggle()
        {
            var isMachActive = 1-this.localDisplayVal.isMachActive;
            this.onSimVarChange("isMachActive", isMachActive);
            this.onSimVarChange("varismachactive", isMachActive);
        }

        onTrkFPAToggle()
        {
            var vname;

            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                vname="isA32NXFPAModeActive";
            } else {
                vname="isTRKMode";
            }
            var newState = 1-this.localDisplayVal[vname];
            this.onSimVarChange(vname, newState);
        }

        onSpeedManaged()
        {
            this.onGenericEvent("airspeedmanaged");
        }

        onSpeedSelected()
        {
            this.onGenericEvent("airspeedselected");
        }

        onHeadingManaged()
        {
            this.onGenericEvent("headingmanaged");
        }

        onHeadingSelected()
        {
            this.onGenericEvent("headingselected");
        }

        onAltHoldChanged()
        {
            var alt = Math.round(this.localDisplayVal.autoPilotDisplayedAltitudeLockValueFeet);
            var sf = this.localDisplayVal.autoPilotAltInc;
            var newAlt = alt + this.adjVal * this.adjScaleFactor * sf;
            if (newAlt<100) {
                newAlt=100;
            }
            if (newAlt>49000) {
                newAlt=49000;
            }
            if (newAlt!=alt) {
                this.panel.sendEvent("apaltvarset", [newAlt, 3]);
                this.onSimVarChange("autoPilotDisplayedAltitudeLockValueFeet", newAlt, false);
                this.panel.sendEvent("a20naltchanged",1);
                return true;
            }
            return false;
        }

        onAltSelect100()
        {
            this.onSimVarChange("autoPilotAltInc",100);
        }

        onAltSelect1000()
        {
            this.onSimVarChange("autoPilotAltInc",1000);
        }

        onTapEvent(elm,e)
        {
            var target = jquery(elm).attr("target");
            if (jquery(elm).hasClass("toggle-switch")) {
                this.callFunction("on", target, "Toggle");
            } else if (jquery(elm).hasClass("ip-btn")) {
                if (jquery(elm).hasClass("knob-ctl")) {
                    jquery(elm).addClass("btn-tapped");
                } else {
                    jquery(elm).find(".btn").addClass("btn-tapped");
                }
                this.callFunction("on", target, "");
            } else if (jquery(elm).hasClass("ip-inc") || jquery(elm).hasClass("ip-dec")) {
                jquery(elm).addClass("btn-tapped");
                if (this.timerId!=null) {
                    clearInterval(this.timerId);
                    this.timerId=null;
                }
                this.adjVal = 1;
                if (jquery(elm).hasClass("ip-dec")) {
                    this.adjVal = -1;
                }
                this.adjScaleFactor = 1;
                this.ctlTarget = target;
                this.rotateKnob();
                this.callFunction("on", target, "Changed");
                this.tapStartTimeStamp=Date.now();
                this.timerId=setInterval(jquery.proxy(this.pressAndHoldTimerFunc,this), 250);
            }
        }

        callFunction(p,f,s)
        {
            var prefix = "";
            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                prefix="A32NX";
            }
            var funcName = p+prefix+f+s;
            if (typeof this[funcName] === 'function') {
                this[funcName]();
            } else {
                this[p+f+s]();
            }
        }

        onTapEndEvent(elm, e) {
            if (jquery(elm).hasClass("knob-ctl")) {
                jquery(elm).removeClass("btn-tapped");
            } else {
                jquery(elm).find(".btn").removeClass("btn-tapped");
            }
            if (this.timerId!=null) {
                clearInterval(this.timerId);
                this.timerId=null;
            }
            this.ctlTarget=null;
            this.adjVal = 0;
            this.adjScaleFactor = 1;
            this.tapStartTimeStamp = 0;
        }

        pressAndHoldTimerFunc() {
            var ct = Date.now();
            if (this.adjScaleFactor == 1 && ct - this.tapStartTimeStamp > 500) {
                this.adjScaleFactor = 2;
            }
            if (this.adjScaleFactor == 2 && ct - this.tapStartTimeStamp > 3000) {
                this.adjScaleFactor = 5;
            }
            this.rotateKnob();
            this.callFunction("on", this.ctlTarget, "Changed");
        }

        rotateKnob()
        {
            var map = {
                "SpeedHold": "spd",
                "HeadingHold": "hdg",
                "AltHold": "alt",
                "VSHold": "vs"
            };
            var elmClass = map[this.ctlTarget];
            var elm = jquery(this.rootElm).find(".knb-"+elmClass+" .knob-img");
            var angle = parseInt(jquery(elm).attr("angle"));
            angle = angle + this.adjVal * this.adjScaleFactor*10;
            if (angle<0) {
                angle = 360 + angle;
            }
            angle = angle % 360;
            jquery(elm).attr("angle", angle);
            jquery(elm).css("transform", "rotate("+angle+"deg)");
        }

        onGenericEvent(ev) {
            var prefix="a20n";
            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                prefix="a32nx";
            }
            this.panel.sendEvent(prefix+ev,1);
        }
    }

});