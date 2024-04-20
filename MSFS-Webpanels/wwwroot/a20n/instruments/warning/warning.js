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

    return class A20NWarning extends Instrument {
        constructor(panel,elm, simvars)
        {
            super(panel,elm, simvars);
        }

        init()
        {
            this.aspectRatio = 436.1932012/348.6842105;
            this.htmlFile="../a20n/instruments/warning/warning-template.html"+window.location.search;
            this.cssFile="../a20n/instruments/warning/warning.css"+window.location.search;
        }

        refreshInstrument()
        {
            super.refreshInstrument();
            var displayData = {
                "captss": false,
                "warn": false,
                "caution": false,
                "autoland": false,
                "atcmsg":false
            };

            var lightTest = false;

            if (this.panel.aircraftFolder=="Asobo_A320_NEO") {
                lightTest = this.localDisplayVal.lightTestActive;
                displayData.warn = (this.localDisplayVal.masterWarningActive) && (!this.localDisplayVal.masterWarningAck);
                displayData.caution = (this.localDisplayVal.masterCautionActive) && (!this.localDisplayVal.masterCautionAck);
            } // End of Asobo A320Neo

            if (this.panel.aircraftFolder=="FlyByWire_A320_NEO") {
                lightTest = this.localDisplayVal.lightTestMode==0;
                var mapping = {
                    "warn": "masterWarningActive",
                    "caution": "masterCautionActive",
                    "autoland": "autoPilotAutoLandWarning",
                    "captss": "captainGreenOn",
                    "atcmsg": "isATCMsgWaiting"
                };
                var ks=Object.keys(mapping);
                for(var i=0;i<ks.length;i++) {
                    var k = ks[i];
                    displayData[k]=this.localDisplayVal[mapping[k]];
                }
            }

            var ks=Object.keys(displayData);
            for(var i=0;i<ks.length;i++) {
                var k = ks[i];
                var v = displayData[k] || lightTest;
                var oc = v ? "ind-on": "ind-off";
                jquery(this.rootElm).find(".btn-"+k).removeClass("ind-off ind-on").addClass(oc);
            }
        } // refreshInstrument

        onTapEvent(elm,e)
        {
            jquery(elm).find(".btn").addClass("btn-tapped");
            if (jquery(elm).hasClass("inop")) {
                return;
            }
            var target=jquery(elm).attr("target");
            this.onSimVarChange(target, 0);
        }

        onTapEndEvent(elm, e) {
            jquery(elm).find(".btn").removeClass("btn-tapped");
        }
    }

});