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
       
    Instrument.loadCss("../common/comm-transceiver/kx165/kx165.css");
    var htmlPromise = Instrument.loadTemplate("../common/comm-transceiver/kx165/kx165-template.html");

    return class KX165 extends Instrument {
        
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            jquery(elm).addClass("kx165");
            this.aspectRatio = 1024 / 328;
            this.onScreenResize();
            
            var thisClass=this;

            var i = 0;
            this.IDX_AVIONIC_SW = i++;
            this.IDX_PANEL_ON = i++;
            this.IDX_COM_ACTIVE = i++;
            this.IDX_COM_STANDBY = i++;
            this.IDX_COM_VOLUME = i++;
            this.IDX_NAV_ACTIVE = i++;
            this.IDX_NAV_STANDBY = i++;
            this.IDX_NAV_VOLUME = i++;
            
            htmlPromise.then(function(html) {
               jquery(elm).append(html); 
               thisClass.bindControls();
            });
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".indicators").addClass("hide");
            var freqInds = [".knob-com.knob-volume", ".knob-nav.knob-volume" ];
            var freqIdx = [this.IDX_COM_VOLUME, this.IDX_NAV_VOLUME];
            for(var i = 0;i<freqInds.length;i++) {
                super.showKnob(freqInds[i], this.displayVal[freqIdx[i]], 3.2, -160);
            }

            if (this.isInstrumentOff) {
                return;
            }
            jquery(this.rootElm).find(".indicators").removeClass("hide");
            freqInds= [".com-activefreq", ".com-standbyfreq", ".nav-activefreq", ".nav-standbyfreq"];
            freqIdx = [this.IDX_COM_ACTIVE, this.IDX_COM_STANDBY,this.IDX_NAV_ACTIVE, this.IDX_NAV_STANDBY ];
            for(var i = 0;i<freqInds.length;i++) {
                var html = jquery(this.rootElm).find(freqInds[i]);
                var dValue = this.displayVal[freqIdx[i]];
                var dPoint = 3;                
                if (freqInds[i].startsWith(".nav")) {
                    dPoint = 2;
                }
                dValue = (dValue / 1000).toFixed(dPoint);
                html.text(dValue);
            }
        }

        onTapEvent(elm, ev) {
            if (this.isInstrumentOff) {
                return;
            }
            var idxActive;
            var idxStandby;
            var freqActive;
            var freqStandby;
            var event;
            if (jquery(elm).hasClass("btn-com")) {
                idxActive=this.IDX_COM_ACTIVE;
                idxStandby = this.IDX_COM_STANDBY;                         
            } else if (jquery(elm).hasClass("btn-nav")) {
                idxActive=this.IDX_NAV_ACTIVE;
                idxStandby = this.IDX_NAV_STANDBY;                
            }
            event=this.simvars[idxActive].substring(0,4);
            freqActive=this.displayVal[idxActive];
            freqStandby=this.displayVal[idxStandby];
            super.onInputValChanged(idxActive, freqStandby, false);
            super.onInputValChanged(idxStandby, freqActive, false);
            this.panel.onInputChange(event+"freqswap",0,true);
        }

        onDragEvent(elm, ev, e) {
            if (jquery(elm).hasClass("ctl-com-volume")) {
                super.handleKnobControl(elm, ev, this.IDX_COM_VOLUME,[ {
                    step: 1,
                    stepsPerFullCircle : 3600/32,
                    min: 0,
                    max: 100,
                    divCtl : ".dot-com-volume",
                    nextStep:0,
                    wrapAround: false,
                    carry: false
                }]);
            }
            if (jquery(elm).hasClass("ctl-nav-volume")) {
                super.handleKnobControl(elm, ev, this.IDX_NAV_VOLUME,[ {
                    step: 1,
                    stepsPerFullCircle : 3600/32,
                    min: 0,
                    max: 100,
                    divCtl : ".dot-nav-volume",
                    nextStep:0,
                    wrapAround: false,
                    carry: false
                }]);
            }
            if (this.isInstrumentOff) {
                return;
            }
            if (jquery(elm).hasClass("ctl-com-knob")) {
                super.handleKnobControl(elm, ev, this.IDX_COM_STANDBY,[ 
                    {
                        step: 1000,
                        stepsPerFullCircle : 5,
                        min: 118000,
                        max: 136000,
                        divCtl : ".dot-com-mhz",
                        nextStep:0,
                        wrapAround: true,
                        carry: false
                    },
                    {
                        step: 25,
                        stepsPerFullCircle : 5,
                        min: 0,
                        max: 0,
                        divCtl : ".dot-com-khz",
                        nextStep:1000,
                        wrapAround: true,
                        carry: false
                    }                    
                ]);
            }
            if (jquery(elm).hasClass("ctl-nav-knob")) {
                super.handleKnobControl(elm, ev, this.IDX_NAV_STANDBY,[ 
                    {
                        step: 1000,
                        stepsPerFullCircle : 5,
                        min: 108000,
                        max: 117000,
                        divCtl : ".dot-nav-mhz",
                        nextStep:0,
                        wrapAround: true,
                        carry: false
                    },
                    {
                        step: 50,
                        stepsPerFullCircle : 5,
                        min: 0,
                        max: 0,
                        divCtl : ".dot-nav-khz",
                        nextStep:1000,
                        wrapAround: true,
                        carry: false
                    }                    
                ]);
            }
        }

        updateInstrumentState()
        {
            this.isInstrumentOff=false;
            if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON] || this.displayVal[this.IDX_COM_VOLUME]==0) {
                this.isInstrumentOff=true;
            }
        }
    }
});
