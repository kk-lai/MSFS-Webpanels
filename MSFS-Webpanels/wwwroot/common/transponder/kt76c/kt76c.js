require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument',
        SysParam: '../common/sysparam',
    },
    waitSeconds : 30,
});


define([
         'jquery', 'Instrument', 'SysParam'
         ],
function(jquery, Instrument, SysParam) {

    return class KT76C extends Instrument {
        
        constructor(panel, elm, simvars)
        {
            super(panel, elm, simvars);
            var i=0;
            this.IDX_ALTITUDE = i++;
            this.IDX_XPDR_CODE = i++;
            this.IDX_XPDR_STATE = i++;
            this.IDX_AVIONIC_SW = i++;
            this.IDX_PANEL_ON = i++;
            i=0;
            this.XPDR_STATE_OFF = i++;
            this.XPDR_STATE_SBY = i++;
            this.XPDR_STATE_TST = i++;
            this.XPDR_STATE_ON = i++;
            this.XPDR_STATE_ALT = i++;
            
            this.displayVal = [ 0, "1200", 0, false, false]; // "calibratedAltitude", "xpdr", "xpdrSwitch", "switchAvionics1", "generalPanelOn"
            this.nextToggleTime = 0;
            this.rState = false;
            this.userInput="";
            this.inputTimeoutTimer = null;
            this.defaultInputTimeout = 3000; // ms            
        }

        init()
        {
            this.aspectRatio=6.25 / 1.63;
            this.htmlFile="../common/transponder/kt76c/kt76c-template.html";
            this.cssFile="../common/transponder/kt76c/kt76c.css";
        }

        onTapEvent(elm, e) {
            if (!this.isInstrumentOff) {
                if (jquery(elm).hasClass("btn")) {
                    if (this.displayVal[this.IDX_XPDR_STATE]==this.XPDR_STATE_TST) {
                        e.preventDefault();
                        return;
                    }
                    var val = jquery(elm).attr("value");

                    if (jquery(elm).hasClass("btn-num")) {
                        this.userInput=this.userInput+val;
                        if (this.userInput.length==4) {
                            this.onInputValChanged(this.IDX_XPDR_CODE, this.userInput);
                            this.userInput="";
                            this.clearInputTimer();
                        } else {
                            this.setInputTimer();
                        }
                    } else if (val=="C") {
                        if (this.userInput=="" && this.inputTimeoutTimer==null) {
                            this.onInputValChanged(this.IDX_XPDR_CODE, "0000");
                        } else {
                            if (this.userInput.length>0) {
                                this.userInput=this.userInput.substring(0, this.userInput.length-1);
                            }
                            this.setInputTimer();
                        }
                    } else if (val=="V") {
                        this.onInputValChanged(this.IDX_XPDR_CODE, "1200");
                        this.clearInputTimer();
                    } else if (val=="I") {
                        this.panel.onInputChange("xpdridentset",0);
                    }
                }
                
            }        
            if (jquery(elm).hasClass("kbtn")) {
                super.handleUpDownContrl(elm, this.IDX_XPDR_STATE, "knob-left", this.XPDR_STATE_OFF, this.XPDR_STATE_ALT);                
            }
            e.preventDefault();
        }

        refreshInstrument()
        {
            var rotateAngles = [0, 44, 84,133,180];
            var xpdrCode = "";
            var dfl = "";
            var sign = false;

            switch (this.displayVal[2]) {
                case this.XPDR_STATE_TST: 
                    dfl="888";
                    xpdrCode="8888";
                    sign=true;
                    this.userInput="";
                    this.clearInputTimer();
                    break;
                case this.XPDR_STATE_SBY: // SBY
                case this.XPDR_STATE_ON: // ON
                case this.XPDR_STATE_ALT: // ALT                
                    var altitude = this.displayVal[this.IDX_ALTITUDE];
                    var fl = Math.abs(Math.ceil(altitude/100));
                    dfl = String(fl).padStart(3, '0');
                    sign = (altitude < 0);
                    xpdrCode = this.displayVal[this.IDX_XPDR_CODE];
            }            
            if (this.inputTimeoutTimer!=null) {
                xpdrCode=this.userInput.padEnd(4,'-');
            }            

            jquery(this.rootElm).find(".transponder-code").text(xpdrCode);
            jquery(this.rootElm).find(".transponder-alt").text(dfl);
            super.showKnobSwitch(".knob", this.displayVal[this.IDX_XPDR_STATE],rotateAngles);
            jquery(this.rootElm).find(".ind").addClass("hide");
            if (!this.isInstrumentOff) {
                jquery(this.rootElm).find(".s" + this.displayVal[this.IDX_XPDR_STATE]).removeClass("hide");
                
                if (!sign) {
                    jquery(this.rootElm).find(".transponder-alt-sign").addClass("hide");
                }

                var ct = Date.now();
                if (ct > this.nextToggleTime && this.displayVal[this.IDX_XPDR_STATE]!=this.XPDR_STATE_TST) {
                    this.nextToggleTime = ct + 500;
                    this.rState=!this.rState;
                }

                if (!this.rState && this.displayVal[this.IDX_XPDR_STATE]!=this.XPDR_STATE_TST) {
                    jquery(this.rootElm).find(".label-r").addClass("hide");
                }
            }
        }
        
        updateInstrumentState()
        {
            this.isInstrumentOff=false;
            if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON] || this.displayVal[this.IDX_XPDR_STATE]==this.XPDR_STATE_OFF) {
                this.isInstrumentOff=true;
            }
        }
        
        onInputTimeout() {
            this.userInput="";
            this.inputTimeoutTimer=null;
        }

        setInputTimer()
        {
            if (this.inputTimeoutTimer!=null) {
                clearTimeout(this.inputTimeoutTimer);
            }
            this.inputTimeoutTimer=setTimeout(jquery.proxy(this.onInputTimeout,this), this.defaultInputTimeout);
        }

        clearInputTimer()
        {
            if (this.inputTimeoutTimer!=null) {
                clearTimeout(this.inputTimeoutTimer);
                this.inputTimeoutTimer=null;
            }
        }
    }
});
