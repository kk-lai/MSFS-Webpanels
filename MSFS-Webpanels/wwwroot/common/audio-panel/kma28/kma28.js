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
    

    Instrument.loadCss("../common/audio-panel/kma28/kma28.css");
    var htmlPromise = Instrument.loadTemplate("../common/audio-panel/kma28/kma28-template.html");

    return class KMA28 extends Instrument {
        
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            jquery(elm).addClass("kma28");
            this.aspectRatio = 6.25 / 1.3; 
            this.onScreenResize();

            var i=0;            
            this.TX_TYPE_COM1 = i++;
            this.TX_TYPE_COM2 = i++;
            this.TX_TYPE_COM3 = i++;
            this.TX_TYPE_TEL = i++;
            this.TX_TYPE_NONE = i++;

            i=0;
            this.MODE_INTERCOM_ISO = i++;
            this.MODE_INTERCOM_ALL = i++;
            this.MODE_INTERCOM_CREW = i++;

            i=0;
            this.MODE_TX_COM3 = i++;
            this.MODE_TX_COM2 = i++;
            this.MODE_TX_COM1 = i++;
            this.MODE_TX_COM12 = i++;
            this.MODE_TX_COM21 = i++;
            this.MODE_TX_TEL = i++;

            i=0;
            this.MODE_MARKER_TM = i++;
            this.MODE_MARKER_LO = i++;
            this.MODE_MARKER_HI = i++;

            i=0;
            this.IDX_AVIONIC_SW = i++;
            this.IDX_PANEL_ON = i++;
            this.IDX_AUDIO_PANEL_VOLUME = i++;
            this.IDX_MARKER_TEST_MUTE = i++;
            this.IDX_MARKER_IS_HIGH_SENSITIVITY = i++;
            this.IDX_INTERCOM_MODE = i++;
            this.IDX_COM1_RX = i++;
            this.IDX_COM2_RX = i++;
            this.IDX_NAV1_RX = i++;
            this.IDX_NAV2_RX = i++;
            this.IDX_MARKER_SOUND_ON = i++;
            this.IDX_INTERCOM_ACTIVE = i++;
            this.IDX_ADF_RX = i++;
            this.IDX_DME_RX = i++;
            this.IDX_SPEAKER_ACTIVE = i++;
            this.IDX_COM1_TX = i++;
            this.IDX_COM2_TX = i++;
            this.IDX_COM3_TX = i++;
            this.IDX_PILOT_TX_TYPE = i++;
            this.IDX_COPILOT_TX_TYPE = i++;
            this.IDX_PILOT_TXING = i++;
            this.IDX_COPILOT_TXING = i++;
            this.IDX_INSIDE_MARKER_ON = i++;
            this.IDX_MIDDLE_MARKER_ON = i++;
            this.IDX_OUTSIDE_MARKER_ON = i++;

            // local variables
            this.IDX_MARKER_SW = i++;
            this.IDX_TRANSMITTING = i++;
            this.IDX_TX_SW = i++;

            this.displayVal.push(this.MODE_MARKER_LO);
            this.displayVal.push(false);
            this.displayVal.push(this.MODE_TX_COM1);

            this.markerFlash = false //
            this.nextToggleTime = Date.now()+500; // ms
            
            var thisClass=this;
            
            htmlPromise.then(function(html) {
               jquery(elm).append(html); 
               thisClass.bindControls();
            });
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".led").addClass("hide");
            jquery(this.rootElm).find(".dimmer").removeClass("hide");
            if (Date.now() > this.nextToggleTime) {
                this.markerFlash=!this.markerFlash;
            }
            // volume
            super.showKnob(".knob-volume", this.displayVal[this.IDX_AUDIO_PANEL_VOLUME], 2.7, -135);
            
            // tx 
            var swAngles = [ -78, -45, -14, 23, 45, 85];            
            if (this.displayVal[this.IDX_PILOT_TX_TYPE]!=this.displayVal[this.IDX_COPILOT_TX_TYPE]) {                
                if (this.displayVal[this.IDX_PILOT_TX_TYPE]==this.TX_TYPE_COM1) {
                    this.displayVal[this.IDX_TX_SW] = this.MODE_TX_COM12;
                } else if (this.displayVal[this.IDX_PILOT_TX_TYPE]==this.TX_TYPE_COM2) {
                    this.displayVal[this.IDX_TX_SW] = this.MODE_TX_COM21;
                } else {
                    this.displayVal[this.IDX_TX_SW] = this.MODE_TX_TEL;
                }
            } else {
                var states = [this.MODE_TX_COM1, this.MODE_TX_COM2, this.MODE_TX_COM3, this.MODE_TX_TEL, this.MODE_TX_COM1];
                this.displayVal[this.IDX_TX_SW] = states[this.displayVal[this.IDX_PILOT_TX_TYPE]];
            }
            super.showKnobSwitch(".sw-selector",this.displayVal[this.IDX_TX_SW], swAngles );

            this.displayVal[this.IDX_MARKER_SW]=this.MODE_MARKER_LO;
            if (this.displayVal[this.IDX_MARKER_IS_HIGH_SENSITIVITY]) {
                this.displayVal[this.IDX_MARKER_SW]=this.MODE_MARKER_HI;
            } else if (this.displayVal[this.IDX_MARKER_TEST_MUTE]) {
                this.displayVal[this.IDX_MARKER_SW]=this.MODE_MARKER_TM;
            }

            jquery(this.rootElm).find(".switch-marker .switch").addClass("hide");
            jquery(this.rootElm).find(".switch-marker .sw-"+this.displayVal[this.IDX_MARKER_SW]).removeClass("hide");

            jquery(this.rootElm).find(".switch-intercom .switch").addClass("hide");
            jquery(this.rootElm).find(".switch-intercom .sw-"+this.displayVal[this.IDX_INTERCOM_MODE]).removeClass("hide");

            if (this.isInstrumentOff) {
                return;
            }

            // transmit led
            this.displayVal[this.IDX_TRANSMITTING] = this.displayVal[this.IDX_PILOT_TXING] || this.displayVal[this.IDX_COPILOT_TXING];

            // leds
            var ledIdxs = [
                this.IDX_COM1_RX,
                this.IDX_COM2_RX,
                this.IDX_NAV1_RX,
                this.IDX_NAV2_RX,
                this.IDX_MARKER_SOUND_ON,
                this.IDX_INTERCOM_ACTIVE,
                this.IDX_ADF_RX,
                this.IDX_DME_RX,
                this.IDX_SPEAKER_ACTIVE,
                this.IDX_TRANSMITTING
            ];

            var ledDivs = [
                "com1-led",
                "com2-led",
                "nav1-led",
                "nav2-led",
                "mkr-led",
                "ics-led",
                "adf-led",
                "dme-led",
                "spr-led",
                "tx-led"
            ];

            for(var i=0;i<ledIdxs.length;i++) {
                if (this.displayVal[ledIdxs[i]]) {
                    jquery(this.rootElm).find("."+ledDivs[i]).removeClass("hide");
                }
            }

            // dimmer
            var dimmerIdxs = [
                this.IDX_INSIDE_MARKER_ON,
                this.IDX_MIDDLE_MARKER_ON,
                this.IDX_OUTSIDE_MARKER_ON
            ];

            if (this.markerFlash) {
                var dimmerDivs = [
                    "im-dim",
                    "mm-dim",
                    "om-dim"
                ];
    
                for(var i=0;i<dimmerIdxs.length;i++) {
                    if (this.displayVal[dimmerIdxs[i]]) {
                        jquery(this.rootElm).find("."+dimmerDivs[i]).addClass("hide");
                    }
                }
            }
        }

        onTapEvent(elm, e) {
            if (jquery(elm).hasClass("kbtn")) {
                var oldState=this.displayVal[this.IDX_TX_SW];
                super.handleUpDownContrl(elm, this.IDX_TX_SW, "knob-left", this.MODE_TX_COM3, this.MODE_TX_TEL);
                if (this.displayVal[this.IDX_TX_SW]!=oldState) {
                    //
                    var pilotTxType = [2,1,0,0,1,4];
                    var copilotTxType = [2,1,0,1,0,5];
                    super.onInputValChanged(this.IDX_PILOT_TX_TYPE, pilotTxType[this.displayVal[this.IDX_TX_SW]]);
                    super.onInputValChanged(this.IDX_COPILOT_TX_TYPE, copilotTxType[this.displayVal[this.IDX_TX_SW]]);
                }
            }
            if (jquery(elm).hasClass("ctl-marker")) {
                var omflaghi=this.displayVal[this.IDX_MARKER_IS_HIGH_SENSITIVITY];
                var omflagtm=this.displayVal[this.IDX_MARKER_TEST_MUTE];
                super.handleSwitchTap(elm, this.IDX_MARKER_SW, this.MODE_MARKER_TM, this.MODE_MARKER_HI);
                var nmflaghi=(this.displayVal[this.IDX_MARKER_SW]==this.MODE_MARKER_HI) ? 1 : 0;
                var nmflagtm=(this.displayVal[this.IDX_MARKER_SW]==this.MODE_MARKER_TM) ? 1 : 0;
                if (omflaghi!=nmflaghi) {
                    super.onInputValChanged(this.IDX_MARKER_IS_HIGH_SENSITIVITY, nmflaghi);                    
                }
                if (omflagtm!=nmflagtm) {
                    super.onInputValChanged(this.IDX_MARKER_TEST_MUTE, nmflagtm);   
                }
            }
            if (jquery(elm).hasClass("ctl-intercom")) {
                super.handleSwitchTap(elm, this.IDX_INTERCOM_MODE,  this.MODE_INTERCOM_ISO, this.MODE_INTERCOM_CREW);
            }
            if (!this.isInstrumentOff) {
                if (jquery(elm).hasClass("btn")) {
                    var btnDivs = [
                        "btn-com1",
                        "btn-com2",
                        "btn-nav1",
                        "btn-nav2",
                        "btn-mkr",
                        "btn-ics",
                        "btn-adf",
                        //"btn-aux",
                        "btn-dme",
                        "btn-spr"
                    ];
                    var btnIdxs = [
                        this.IDX_COM1_RX,
                        this.IDX_COM2_RX,
                        this.IDX_NAV1_RX,
                        this.IDX_NAV2_RX,
                        this.IDX_MARKER_SOUND_ON,
                        this.IDX_INTERCOM_ACTIVE,
                        this.IDX_ADF_RX,
                        this.IDX_DME_RX,
                        this.IDX_SPEAKER_ACTIVE
                    ];
                    for(var i=0;i<btnDivs.length;i++) {
                        if (jquery(elm).hasClass(btnDivs[i])) {
                            var v = this.displayVal[btnIdxs[i]];
                            v=(v==0) ? 1: 0;
                            super.onInputValChanged(btnIdxs[i], v);
                        }
                    }
                }
            }
            e.preventDefault();
        }

        onDragEvent(elm, ev, e) {
            if (jquery(elm).hasClass("ctl-volume")) {
                super.handleKnobControl(elm, ev, this.IDX_AUDIO_PANEL_VOLUME,[ {
                    step: 1,
                    stepsPerFullCircle : 36000/270,
                    min: 0,
                    max: 100,
                    divCtl : ".dot-volume",
                    nextStep:0,
                    wrapAround: false,
                    carry: false
                }]);
            }
        }

        updateInstrumentState() {
            this.isInstrumentOff = false;
            if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON] || this.displayVal[this.IDX_AUDIO_PANEL_VOLUME]==0) {
                this.isInstrumentOff = true;
            }
        }
    }

});
