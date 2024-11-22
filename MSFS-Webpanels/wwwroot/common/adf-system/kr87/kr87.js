require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument'
    },
    waitSeconds : 30,
});


define([
         'jquery', 'Instrument'    
         ],
function(jquery, Instrument) {

    return class KR87 extends Instrument {
        
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;
            this.IDX_AVIONIC_SW = i++;
            this.IDX_PANEL_ON = i++;
            this.IDX_ACTIVE_FREQ = i++;
            this.IDX_STBY_FREQ = i++;
            this.IDX_VOLUME = i++;
            this.IDX_SIMULATION_TIME = i++;
            this.IDX_TIMER_INIT_TIME = i++;
            this.displayVal.push(1500); // 15 minutes

            i=0;
            this.MODE_ADF = i++;
            this.MODE_FLT = i++;
            this.MODE_ET = i++;

            i=0;
            this.TIMER_RESET = i++;
            this.TIMER_START = i++;
            this.TIMER_STOP = i++;

            i=0;
            this.COUNT_DOWN = i++;
            this.COUNT_UP = i++;
            
            this.IS_ANT = 0;
            this.IS_ADF = 1;

            this.BFO_DISABLED= 0;
            this.BFO_ENABLED = 1;

            // local variables
            this.deviceMode = this.MODE_ADF;
            this.isAdf = this.IS_ADF;
            this.isBFO = this.BFO_DISABLED;

            this.flashOn = false;
            this.nextToggleTime = Date.now()+500;

            this.timerStartTime = 0; 
            this.timerStopTime = 0;
            
            this.timerState = this.TIMER_RESET;
            this.timerMode = this.COUNT_UP;

            this.inputTimeoutTimer=null;            
        }

        init()
        {
            this.aspectRatio = 6.32 / 1.35;
            this.htmlFile="../common/adf-system/kr87/kr87-template.html";
            this.cssFile="../common/adf-system/kr87/kr87.css";
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".indicators").addClass("hide");
            jquery(this.rootElm).find(".dot-et").addClass("hide");
            super.showKnob(".knob-volume", this.displayVal[this.IDX_VOLUME], 2.84, -152);            
            if (this.isInstrumentOff) {
                return;
            }            
            jquery(this.rootElm).find(".dot-knob").addClass("hide");
            if (this.isAdf) {
                jquery(this.rootElm).find(".ind-adf").removeClass("hide");
            } else {
                jquery(this.rootElm).find(".ind-ant").removeClass("hide");
            }
            if (this.isBFO) {
                jquery(this.rootElm).find(".ind-bfo").removeClass("hide");
            }
            var num1 = jquery(this.rootElm).find(".ind-num1");
            var num2 = jquery(this.rootElm).find(".ind-num2");
            num1.text(this.displayVal[this.IDX_ACTIVE_FREQ]);
            num1.removeClass("hide");

            if (Date.now() > this.nextToggleTime) {
                this.flashOn=!this.flashOn;
                this.nextToggleTime = Date.now() + 500;
            }

            switch (this.deviceMode) {
                case this.MODE_ADF:
                    jquery(this.rootElm).find(".dot-freq").removeClass("hide");
                    jquery(this.rootElm).find(".ind-frq").removeClass("hide");
                    num2.text(this.displayVal[this.IDX_STBY_FREQ].toString().padStart(4,'\u2800'));
                    break;
                case this.MODE_ET:                             
                    if (this.timerState==this.TIMER_START) {
                        this.timerStopTime=this.displayVal[this.IDX_SIMULATION_TIME];
                    }
                    if (this.timerState==this.TIMER_RESET) {
                        if (this.timerMode==this.COUNT_DOWN) {           
                            jquery(this.rootElm).find(".dot-et").removeClass("hide");     
                        }       
                        this.timerStartTime=this.timerStopTime;
                    }
                    jquery(this.rootElm).find(".ind-et").removeClass("hide");
                    var displayTime = this.timerStopTime - this.timerStartTime;
                    if (this.timerMode==this.COUNT_DOWN) {
                        var initTime = this.displayVal[this.IDX_TIMER_INIT_TIME];
                        var sec = initTime % 100;
                        var min = (initTime-sec)/100;

                        displayTime = min*60+sec - displayTime;
                        if (displayTime<0) {
                            displayTime=0;
                        }
                        if (!this.flashOn) {
                            jquery(this.rootElm).find(".ind-et").addClass("hide");
                        }
                    }
                    if (displayTime > 3599) {
                        displayTime=3599;
                    }
                    num2.text(Math.floor(displayTime/60).toString().padStart(2,"0")+":"+(displayTime%60).toString().padStart(2,"0"));

                    break;
                case this.MODE_FLT:
                    jquery(this.rootElm).find(".ind-flt").removeClass("hide");
                    var displayTime = this.displayVal[this.IDX_SIMULATION_TIME];
                    num2.text(Math.floor(displayTime/3600).toString().padStart(2,"0")+":"+Math.floor((displayTime % 3600)/60).toString().padStart(2,"0"));
                    break;
            }

            num2.removeClass("hide");
        }

        updateInstrumentState()
        {
            this.isInstrumentOff=false;
            if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON] || this.displayVal[this.IDX_VOLUME]==0) {
                this.isInstrumentOff=true;
            }
        }

        onDragEvent(elm, ev, e) {            
            if (jquery(elm).hasClass("ctl-volume")) {
                super.handleKnobControl(elm, ev, this.IDX_VOLUME,[ {
                    startDigit: 1,
                    endDigit:3,
                    step: 1,
                    stepsPerFullCircle : 36000/284,
                    min: 0,
                    max: 100,
                    divCtl : ".dot-volume",
                    wrapAround: false,
                    carry: false
                }]);
            }
            if (this.isInstrumentOff) {
                e.preventDefault();
                return;
            }
            if (jquery(elm).hasClass("ctl-freq-et")) {               
                if (this.deviceMode==this.MODE_ADF) {
                    super.handleKnobControl(elm, ev, this.IDX_STBY_FREQ,[ 
                        {
                            startDigit: 3,
                            endDigit:4,
                            step: 100,
                            stepsPerFullCircle : 5,
                            min: 100,
                            max: 1700,
                            divCtl : ".dot-freq-high",
                            wrapAround: true,
                            carry: false
                        },
                        {
                            startDigit: 2,
                            endDigit:2,
                            step: 10,
                            stepsPerFullCircle : 5,
                            min: 0,
                            max: 90,
                            divCtl : ".dot-freq-mid",
                            wrapAround: true,
                            carry: false
                        },
                        {
                            startDigit: 1,
                            endDigit:1,
                            step: 1,
                            stepsPerFullCircle : 5,
                            min: 0,
                            max: 9,
                            divCtl : ".dot-freq-low",
                            wrapAround: true,
                            carry: false
                        }
                    ]);
                } else {
                    super.handleKnobControl(elm, ev, this.IDX_TIMER_INIT_TIME,[ 
                        {
                            startDigit: 3,
                            endDigit:4,
                            step: 100,
                            stepsPerFullCircle : 20,
                            min: 0,
                            max: 5900,
                            divCtl : ".dot-et-high",
                            wrapAround: false,
                            carry: false
                        },
                        {
                            startDigit: 1,
                            endDigit:2,
                            step: 1,
                            stepsPerFullCircle : 20,
                            min: 0,
                            max: 59,
                            divCtl : ".dot-et-low",
                            wrapAround: true,
                            carry: false
                        }                       
                    ]);
                }
                
            }
        }

        onTapEvent(elm,e) {
            if (!this.isInstrumentOff) {
                if (jquery(elm).hasClass("btn-adf")) {
                    this.isAdf = !this.isAdf;                  
                } else if (jquery(elm).hasClass("btn-bfo")) {
                    this.isBFO = !this.isBFO;
                } else if (jquery(elm).hasClass("btn-frq")) {
                    if (this.deviceMode==this.MODE_ADF) {
                        // swap freq
                        var activeFreq = this.displayVal[this.IDX_ACTIVE_FREQ];
                        var standbyFreq = this.displayVal[this.IDX_STBY_FREQ];
                        super.setDisplayVal(this.IDX_ACTIVE_FREQ, standbyFreq);
                        super.setDisplayVal(this.IDX_STBY_FREQ, activeFreq);
                        this.panel.onInputChange("adffreqswap", 0); 
                    } else {
                        this.deviceMode=this.MODE_ADF;
                    }
                } else if (jquery(elm).hasClass("btn-flt")) {
                    var nextMode = [this.MODE_FLT, this.MODE_ET, this.MODE_FLT];
                    this.deviceMode = nextMode[this.deviceMode];
                } else if (jquery(elm).hasClass("btn-set") && this.deviceMode==this.MODE_ET) {
                    if (this.timerState==this.TIMER_START) {
                        this.timerState=this.TIMER_STOP;
                        this.timerStopTime=this.displayVal[this.IDX_SIMULATION_TIME];
                    } else {
                        // stop or reset
                        jquery(elm).addClass("pressed");
                        this.setInputTimer();
                    }
                }

            }
            e.preventDefault();
        }

        onTapEndEvent(elm, e) {
            if (!this.isInstrumentOff && jquery(elm).hasClass("btn-set") && jquery(elm).hasClass("pressed")) {
                jquery(elm).removeClass("pressed");
                this.clearInputTimer();
                if (this.timerState==this.TIMER_RESET) {
                    if (this.timerMode==this.COUNT_UP || this.displayVal[this.IDX_TIMER_INIT_TIME]>0) {
                        this.timerState=this.TIMER_START;
                        this.timerStartTime = this.displayVal[this.IDX_SIMULATION_TIME];
                    }
                } else {
                    this.timerState=this.TIMER_RESET;
                }
            }
            e.preventDefault();
        }

        onInputTimeout() {
            this.inputTimeoutTimer=null;
            if (jquery(this.rootElm).find(".btn-set").hasClass("pressed")) {
                jquery(this.rootElm).find(".btn-set").removeClass("pressed");
                this.timerMode = 1-this.timerMode;
            }            
        }

        setInputTimer()
        {
            if (this.inputTimeoutTimer!=null) {
                clearTimeout(this.inputTimeoutTimer);
            }
            this.inputTimeoutTimer=setTimeout(jquery.proxy(this.onInputTimeout,this), 2000); // 2 seconds
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
