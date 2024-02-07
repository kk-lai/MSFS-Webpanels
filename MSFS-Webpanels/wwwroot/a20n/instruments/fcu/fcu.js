require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument',
        StaticPropertyHelper: "../common/static-property-helper"
    },
    waitSeconds : 30,
});


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
            this.htmlFile="../a20n/instruments/fcu/fcu-template.html"+window.location.search;
            this.cssFile="../a20n/instruments/fcu/fcu.css"+window.location.search;
        }

        preprocessLocalDisplayVal()
        {
            this.localDisplayVal.isSpdManaged = this.localDisplayVal.autoPilotAirspeedSlotIndex==2;
            this.localDisplayVal.showSelectedSpeed = this.localDisplayVal.showSelectedSpeed==1;
            this.localDisplayVal.isHdgManaged = (this.localDisplayVal.autoPilotHeadingSlotIndex==2) || (this.localDisplayVal.autoPilotAPPRHold);
            this.localDisplayVal.showSelectedHeading = this.localDisplayVal.showSelectedHeading && (!this.localDisplayVal.autoPilotGlideslopeHold);
            this.localDisplayVal.isAltManaged = (this.localDisplayVal.autoPilotAltitudeManaged== 2);
            this.localDisplayVal.isVSManaged = (this.localDisplayVal.fcuState==0);
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

            if (this.panel.aircraftFolder=="Asobo_A320_NEO") {
                this.isInstrumentOff=(!this.localDisplayVal.isCircuitGeneralPanelOn);

                if (this.isInstrumentOff) {
                    return;
                }

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

        onTapEvent(elm,e)
        {
            var target = jquery(elm).attr("target");
            if (jquery(elm).hasClass("toggle-switch")) {
                var func = "on" + target + "Toggle";
                this[func]();
            } else if (jquery(elm).hasClass("ip-btn")) {
                var func = "on" + target;
                this[func]();
            } else if (jquery(elm).hasClass("ip-inc") || jquery(elm).hasClass("ip-dec")) {
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
                var func = "on" + target + "Changed";
                this[func]();
                this.tapStartTimeStamp=Date.now();
                this.timerId=setInterval(jquery.proxy(this.pressAndHoldTimerFunc,this), 250);
            }
        }

        onTapEndEvent(elm, e) {
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
            var func = "on"+this.ctlTarget +"Changed";
            this[func]();
        }

        onSpdMachToggle()
        {
            var isMachActive = 1-this.localDisplayVal.isMachActive;
            this.onSimVarChange("isMachActive", isMachActive);
            this.onSimVarChange("varismachactive", isMachActive);
        }

        onTrkFPAToggle()
        {
            var isTRKMode = 1-this.localDisplayVal.isTRKMode;
            this.onSimVarChange("isTRKMode", isTRKMode);
        }

        onSpeedManaged()
        {
            this.panel.sendEvent("a20nairspeedmanaged",1);
        }

        onSpeedSelected()
        {
            this.panel.sendEvent("a20nairspeedselected",1);
        }

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

        setSelectedSpeedToIndicatedSpeed()
        {
            if (this.localDisplayVal.isMachActive) {
                this.onSimVarChange("autoPilotSelectedMachHoldValue", Math.round(this.localDisplayVal.indicatedSpeedMach*100)/100);
            } else {
                this.onSimVarChange("autoPilotSelectedAirspeedHoldValue", Math.round(this.localDisplayVal.indicatedSpeed));
            }
        }

        onHeadingManaged()
        {
            this.panel.sendEvent("a20nheadingmanaged",1);
        }

        onHeadingSelected()
        {
            this.panel.sendEvent("a20nheadingselected",1);
        }

        onHeadingHoldChanged()
        {
            var hdg = Math.round(this.localDisplayVal.autoPilotDisplayedHeadingLockValueDegrees);
            var newHdg = hdg + this.adjVal*this.adjScaleFactor;
            if (newHdg>0) {
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
            }
        }

        onAltSelect100()
        {
            this.onSimVarChange("autoPilotAltInc",100);
        }

        onAltSelect1000()
        {
            this.onSimVarChange("autoPilotAltInc",1000);
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

        onThrottleArm()
        {
            var newState = (this.localDisplayVal.autoPilotThrottleArm) ? 0 : 1;
            this.onSimVarChange("autoPilotThrottleArm",newState);
        }

        onExped()
        {
            this.panel.sendEvent("exped",0);
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
    }

});