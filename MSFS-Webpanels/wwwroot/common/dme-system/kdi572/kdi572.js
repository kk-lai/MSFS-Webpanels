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
    
    return class KDI572 extends Instrument {
        constructor(panel, elm, simvars)
        {            
            super(panel, elm, simvars);
            
            var i = 0;
            this.IDX_AVIONIC_SW = i++;
            this.IDX_PANEL_ON = i++;
            this.IDX_NAV1_DISTANCE = i++;
            this.IDX_NAV1_SPEED = i++;
            this.IDX_NAV1_SIGNAL = i++;
            this.IDX_NAV1_HAS_DME = i++;
            this.IDX_NAV2_DISTANCE = i++;
            this.IDX_NAV2_SPEED = i++;
            this.IDX_NAV2_SIGNAL = i++;
            this.IDX_NAV2_HAS_DME = i++;
            this.IDX_DME_STATE = i++;

            i = 0;
            this.KNOB_OFF = i++;
            this.KNOB_N1 = i++;
            this.KNOB_N2 = i++;

            i = 0;
            this.OFFSET_DISTANCE = i++;
            this.OFFSET_SPEED = i++;
            this.OFFSET_SIGNAL = i++;
            this.OFFSET_HAS_DME = i++;

            this.displayVal.push(this.KNOB_N1);            
        }

        init()
        {
            this.aspectRatio=6.25 / 1.35; // 3.50"W x 1.35"H x 6.47"L;
            this.htmlFile="../common/dme-system/kdi572/kdi572-template.html";
            this.cssFile="../common/dme-system/kdi572/kdi572.css";
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".indicators").addClass("hide");
            
            var knobRotationAngle = [0,41.5,130];     
            super.showKnobSwitch(".knob",this.displayVal[this.IDX_DME_STATE], knobRotationAngle );

            if (this.isInstrumentOff) {
                return;
            }
            var valDistance;
            var valSpeed;
            var valTime;

            var idxOffset;
            jquery(this.rootElm).find(".ind-unit").removeClass("hide");
            jquery(this.rootElm).find(".ind-val").removeClass("hide");

            if (this.displayVal[this.IDX_DME_STATE]==this.KNOB_N1) {
                jquery(this.rootElm).find(".ind-nav1").removeClass("hide");
                idxOffset=this.IDX_NAV1_DISTANCE;
            } else {
                jquery(this.rootElm).find(".ind-nav2").removeClass("hide");
                idxOffset=this.IDX_NAV2_DISTANCE;
            }

            var signal=this.displayVal[idxOffset+this.OFFSET_SIGNAL];
            var hasDme = this.displayVal[idxOffset+this.OFFSET_HAS_DME];

            if (signal>0 && hasDme) {
                var distance = this.displayVal[idxOffset+this.OFFSET_DISTANCE];
                var speed = Math.abs(this.displayVal[idxOffset+this.OFFSET_SPEED]);
                var timeToDme = Math.round(distance * 6 / Math.abs(speed)); 
                valDistance = (distance / 10).toFixed(1);
                var txtLength = 4;
                if (valDistance >=100) {
                    valDistance = Math.round(distance/10).toString();
                    txtLength=3;
                }                
                valDistance=valDistance.toString().padStart(txtLength, '\u2800');
                valSpeed=Math.round(speed);
                if (valSpeed > 199) {
                    valSpeed=199;
                }
                valSpeed=valSpeed.toString().padStart(3,"\u2800");
                if (timeToDme>99) {
                    timeToDme=99;
                }
                valTime=timeToDme.toString().padStart(2,"\u2800");

            } else {
                valDistance="---";
                valSpeed="---";
                valTime="--";
            }

            jquery(this.rootElm).find(".ind-distance").text(valDistance);
            jquery(this.rootElm).find(".ind-speed").text(valSpeed);
            jquery(this.rootElm).find(".ind-time").text(valTime);
        }

        updateInstrumentState()
        {
            this.isInstrumentOff=false;
            if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON] || this.displayVal[this.IDX_DME_STATE]==this.KNOB_OFF) {
                this.isInstrumentOff=true;
            }
        }

        onTapEvent(elm, e) {
            if (jquery(elm).hasClass("pbtn")) {
                super.handleUpDownContrl(elm, this.IDX_DME_STATE, "pbtn-left", this.KNOB_OFF, this.KNOB_N2);
            }
            e.preventDefault();
        }
    }
});
