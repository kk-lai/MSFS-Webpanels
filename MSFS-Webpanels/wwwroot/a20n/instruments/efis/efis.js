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

    return class A20NEFIS extends Instrument {
        constructor(panel,elm, simvars)
        {
            super(panel,elm, simvars);
            this.adjVal = 0;
            this.tapStartTimeStamp = 0;
            this.adjScaleFactor = 1;
            this.ctlTarget = null;
            this.timerId = null;
            this.a32nxBtnEnum = ["","CSTR","VORD","WPT","NDB","ARPT"];
        }

        init()
        {
            this.aspectRatio = 676/401;
            this.htmlFile="../a20n/instruments/efis/efis-template.html"+window.location.search;
            this.cssFile="../a20n/instruments/efis/efis.css"+window.location.search;
        }

        refreshInstrument()
        {
            super.refreshInstrument();
            var displayData = {
                "baroMode": 1,
                "isPressureSelectedUnitsHPA": 0,
                "pressureValueHg": 29.92,
                "pressureValueMB": 1013,
                "ndMode": 2,
                "ndRange": 2,
                "autoPilotFlightDirectorActive": 1,
                "btnLSActive": 0,
                "btnCSTRActive": 0,
                "btnWPTActive": 0,
                "btnVORDActive": 0,
                "btnNDBActive": 0,
                "btnARPTActive": 0,
                "autoPilotNavAidState1": 0,
                "autoPilotNavAidState2": 0
            };
            this.isInstrumentOff=(!this.localDisplayVal.isCircuitGeneralPanelOn);

            if (this.panel.aircraftFolder=="Asobo_A320_NEO") {
                var ks=Object.keys(displayData);
                for(var ki=0;ki<ks.length;ki++) {
                    var kn=ks[ki];
                    displayData[kn]=this.localDisplayVal[kn];
                }
            } // Asobo_A320_NEO

            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                if (this.localDisplayVal.efisOption>0) {
                    var opt = "btn"+this.a32nxBtnEnum[this.localDisplayVal.efisOption]+"Active";
                    displayData[opt]=1;
                }
                var opts = ["autoPilotFlightDirectorActive","btnLSActive","ndMode", "ndRange", "isPressureSelectedUnitsHPA","baroMode","autoPilotNavAidState1","autoPilotNavAidState2"];
                for(var i=0;i<opts.length;i++) {
                    if (typeof this.localDisplayVal["a32nx"+opts[i]] !== 'undefined') {
                        displayData[opts[i]]=this.localDisplayVal["a32nx"+opts[i]];
                    } else {
                        displayData[opts[i]]=this.localDisplayVal[opts[i]];
                    }
                }
            } // FlyByWire_A320_NEO

            displayData["pressureValueHg"]=this.localDisplayVal["pressureValueHg"].toFixed(2);
            displayData["pressureValueMB"]=this.localDisplayVal["pressureValueMB"].toFixed(0);

            var mapping={
                "knb-qnhsel":{nstates:2, "v": "isPressureSelectedUnitsHPA"},
                "ind-cstr":{nstates:2, "v": "btnCSTRActive"},
                "ind-wpt":{nstates:2, "v": "btnWPTActive"},
                "ind-vor":{nstates:2, "v": "btnVORDActive"},
                "ind-ndb":{nstates:2, "v": "btnNDBActive"},
                "ind-arpt":{nstates:2, "v": "btnARPTActive"},
                "ind-fd":{nstates:2, "v": "autoPilotFlightDirectorActive"},
                "ind-ls":{nstates:2, "v": "btnLSActive"},
                "sw-nav1":{nstates:3, "v": "autoPilotNavAidState1"},
                "sw-nav2":{nstates:3, "v": "autoPilotNavAidState2"}
            };

            var cks=Object.keys(mapping);
            for(var ci=0;ci<cks.length;ci++) {
                var ctl = cks[ci];
                var nstates = mapping[ctl].nstates;
                var datv=  mapping[ctl].v;

                for(var si=0;si<nstates;si++) {
                    jquery(this.rootElm).find("."+ctl).removeClass("state-"+si);
                }

                if (this.isInstrumentOff && ctl.startsWith("ind")) {
                    jquery(this.rootElm).find("."+ctl).addClass("state-0");
                    continue;
                }
                jquery(this.rootElm).find("."+ctl).addClass("state-"+displayData[datv]);
            }

            var sctls = {
                "knb-rosesel":"ndMode",
                "knb-rangesel":"ndRange"
            };

            cks=Object.keys(sctls);
            for(var ci=0;ci<cks.length;ci++) {
                var ctl = cks[ci];
                var datv = sctls[ctl];

                var ang = displayData[datv]*45-90;
                jquery(this.rootElm).find("."+ctl).css("transform","rotate("+ang+"deg)");
            }

            jquery(this.rootElm).find(".ind").removeClass("state-0 state-1");
            if (this.isInstrumentOff) {
                return;
            }
            var txtQNH = null;
            if (displayData.baroMode==0) {
                jquery(this.rootElm).find(".ind-qfe").addClass("state-1");
            } else if (displayData.baroMode==1) {
                jquery(this.rootElm).find(".ind-qnh").addClass("state-1");
            } else {
                txtQNH="5td&nbsp;";
            }
            jquery(this.rootElm).find(".val-qnh").addClass("state-1");

            if (!txtQNH) {
                if (displayData.isPressureSelectedUnitsHPA) {
                    txtQNH=displayData.pressureValueMB;
                } else {
                    txtQNH=displayData.pressureValueHg;
                }
            }
            jquery(this.rootElm).find(".val-qnh").html(txtQNH);
        }

        onFD() {
            var newVal = (this.localDisplayVal["autoPilotFlightDirectorActive"]) ? 0 : 1;
            this.onSimVarChange("autoPilotFlightDirectorActive", newVal);
        }

        onButtonPressed(btnName) {
            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                if (btnName=="LS") {
                    var newVal = (this.localDisplayVal["a32nxbtnLSActive"]) ? 0 : 1;
                    this.onSimVarChange("a32nxbtnLSActive", newVal);
                } else {
                    var oldVal = this.localDisplayVal["efisOption"];
                    var newVal;
                    for(newVal=1;newVal<this.a32nxBtnEnum.length;newVal++) {
                        if (this.a32nxBtnEnum[newVal]==btnName) {
                            break;
                        }
                    }
                    if (newVal==oldVal) {
                        newVal = 0;
                    }
                    this.onSimVarChange("efisOption", newVal);
                }
            } else {
                var newVal = (this.localDisplayVal["btn"+btnName+"Active"]) ? 0 : 1;
                this.onSimVarChange("btn"+btnName+"Active", newVal);
                this.onSimVarChange("pfd"+btnName+"Active", newVal);
            }
        }

        onQNHPushed()
        {
            var oldVal = this.localDisplayVal["baroMode"];
            var newVal ;
            if (oldVal==2) { // STD
                newVal = 0; //
            } else {
                newVal=(1-oldVal);
            }
            this.onSimVarChange("baroMode", newVal);
        }

        onQNHPulled()
        {
            this.onSimVarChange("baroMode", 2); // STD
        }

        onQNHChanged()
        {
            var oldVal,minVal, maxVal, sf,  newVal;
            if (this.localDisplayVal["isPressureSelectedUnitsHPA"]) {
                oldVal = Math.round(this.localDisplayVal["pressureValueMB"]);
                sf=1;
                minVal = 948;
                maxVal = 1084;
            } else {
                oldVal = Math.round(this.localDisplayVal["pressureValueHg"]*100)/100;
                sf=0.01;
                minVal = 27.99;
                maxVal = 32.01;
            }
            newVal = oldVal + this.adjVal*this.adjScaleFactor*sf;
            if (newVal>maxVal) {
                return;
            }
            if (newVal<minVal) {
                return;
            }
            var mb;
            var inhg;

            if (sf==1) {
                mb=newVal;
                inhg=newVal/33.8639;
            } else {
                mb=Math.round(newVal*33.8639);
                inhg=newVal;
            }
            this.onSimVarChange("pressureValueMB", mb,false);
            this.onSimVarChange("pressureValueHg", inhg,false);

            if (sf==1) {
                mb=newVal*16;
            } else {
                mb=Math.round(newVal*33.8639*16);
            }

            this.onSimVarChange("qnh", [mb,1], true);
        }

        onRoseChanged()
        {
            var p= {
                "simvar":this.getPrefix()+"ndMode",
                "min":0,
                "max":4
            };
            this.onInputChanged(p);
        }

        onRangeChanged()
        {
            var p= {
                "simvar":this.getPrefix()+"ndRange",
                "min":0,
                "max":5
            };
            this.onInputChanged(p);
        }

        navConvertFunc(v, isPreProcess) {
            // 1,0,2 =>
            var map = [ 1,0,2 ];
            return map[v];
        }

        onNAV1Changed()
        {
            var p= {
                "simvar":this.getPrefix()+"autoPilotNavAidState1",
                "min":0,
                "max":2,
                "convertFunc": this.navConvertFunc
            };
            this.onInputChanged(p);
        }

        onNAV2Changed()
        {
            var p= {
                "simvar":this.getPrefix()+"autoPilotNavAidState2",
                "min":0,
                "max":2,
                "convertFunc": this.navConvertFunc
            };
            this.onInputChanged(p);
        }

        onBaroUnitChanged()
        {
            var p= {
                "simvar":"isPressureSelectedUnitsHPA",
                "min":0,
                "max":1
            };
            this.onInputChanged(p);
        }

        onTapEvent(elm,e)
        {
            var target = jquery(elm).attr("target");
            if (jquery(elm).hasClass("ip-btn")) {
                if (jquery(elm).hasClass("knob-ctl")) {
                    jquery(elm).addClass("btn-tapped");
                    this["on"+target]();
                } else {
                    jquery(elm).find(".btn").addClass("btn-tapped");
                    if (target=="FD") {
                        this["on"+target]();
                    } else {
                        this.onButtonPressed(target);
                    }
                }
            } else if (jquery(elm).hasClass("ip-inc") || jquery(elm).hasClass("ip-dec")) {
                jquery(elm).addClass("btn-tapped");
                if (target=="QNH" && this.localDisplayVal.baroMode>=2) {
                    return;
                }
                if (this.timerId!=null) {
                    clearInterval(this.timerId);
                    this.timerId=null;
                }
                this.adjVal = 1;
                if (jquery(elm).hasClass("ip-dec")) {
                    this.adjVal = -1;
                }
                if (jquery(elm).hasClass("ip-auto")) {
                    this.ctlTarget=target;
                    this.rotateKnob();
                    var func = "on" + target + "Changed";
                    this["on"+target+"Changed"]();
                    this.tapStartTimeStamp=Date.now();
                    this.timerId=setInterval(jquery.proxy(this.pressAndHoldTimerFunc,this), 250);
                } else {
                    this["on"+target+"Changed"]();
                }
            }
        }

        getPrefix()
        {
            var prefix = "";
            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                prefix="a32nx";
            }
            return prefix;
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

        onInputChanged(p)
        {
            var oldVal = this.localDisplayVal[p.simvar];
            if (p.hasOwnProperty("convertFunc")) {
                oldVal = p.convertFunc(oldVal, true);
            }
            var newVal = oldVal + this.adjVal;
            if (newVal < p.min) {
                newVal = p.min;
                return;
            }
            if (newVal > p.max) {
                newVal = p.max;
                return;
            }
            if (p.hasOwnProperty("convertFunc")) {
                newVal = p.convertFunc(newVal, false);
            }
            this.onSimVarChange(p.simvar, newVal);
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
            var func = "on"+this.ctlTarget +"Changed";
            this[func]();
        }

        rotateKnob()
        {
            var elm = jquery(this.rootElm).find(".img-qnh-knob");
            var angle = parseInt(jquery(elm).attr("angle"));
            angle = angle + this.adjVal * this.adjScaleFactor*10;
            if (angle<0) {
                angle = 360 + angle;
            }
            angle = angle % 360;
            jquery(elm).attr("angle", angle);
            jquery(elm).css("transform", "rotate("+angle+"deg)");
        }
    }
});
