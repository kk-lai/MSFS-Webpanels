require.config({
    baseUrl: '.',
    paths: {
        jquery: '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument'
    },
    waitSeconds: 30,
});


define([
    'jquery', 'Instrument'
],
    function (jquery, Instrument) {

        Instrument.loadCss("../common/autopilot-system/kap140/kap140.css");
        var htmlPromise = Instrument.loadTemplate("../common/autopilot-system/kap140/kap140-template.html");

        return class KAP140 extends Instrument {

            constructor(panel, elm, simvars) {
                super(panel, elm, simvars);
                this.aspectRatio = 6.3 / 1.665; // 6.3” W x 1.665” H x 11.35” L

                var i=0;
                this.IDX_AVIONIC_SW = i++;
                this.IDX_PANEL_ON = i++;
                this.IDX_AP_MASTER = i++;
                this.IDX_HEADING_LOCK = i++;
                this.IDX_NAV_LOCK = i++;
                this.IDX_ALT_LOCK = i++;
                this.IDX_VSHOLD = i++;
                this.IDX_VS = i++;
                this.IDX_APR = i++;
                this.IDX_REV = i++;
                this.IDX_GS = i++;
                this.IDX_ALT = i++;
                this.IDX_BARO = i++;

                i=0;

                this.DISPLAY_MODE_ALT = i++;
                this.DISPLAY_MODE_VS = i++;
                this.DISPLAY_MODE_BARO = i++;

                this.defaultInputTimeout = 3000; // ms

                this.inputTimeoutTimer = null;
                this.displayMode = "alt";
                this.isBaroInHg = true;

                jquery(elm).addClass("kap140");
                this.onScreenResize();

                var thisClass = this;

                htmlPromise.then(function (html) {
                    jquery(elm).append(html);
                    thisClass.bindControls();
                });
            }

            refreshInstrument()
            {
                jquery(this.rootElm).find(".indicators").addClass("hide");
                if (this.isInstrumentOff) {
                    return;
                }

                var alt = jquery(this.rootElm).find(".ind-altitude");
                alt.removeClass("hide");

                if (this.displayMode == "alt") {
                    var txt = this.displayVal[this.IDX_ALT].toString().padStart(6,'\u2800');
                    alt.text(txt);
                    jquery(this.rootElm).find(".ind-ft").removeClass("hide");
                }

                if (this.displayMode == "vs") {
                    alt.text(this.displayVal[this.IDX_VS]);
                    jquery(this.rootElm).find(".ind-fpm").removeClass("hide");
                }

                if (this.displayMode == "baro") {
                    var baro = "";
                    var nchar;
                    if (this.isBaroInHg) {
                        nchar=7;
                        baro = 29.92;
                        jquery(this.rootElm).find(".ind-inhg").removeClass("hide");
                    } else {
                        nchar=6;
                        baro = 1013;
                        jquery(this.rootElm).find(".ind-hpa").removeClass("hide");
                    }
                    alt.text(baro.toString().padStart(nchar,'\u2800'));
                }

                if (this.displayVal[this.IDX_AP_MASTER]) {
                    jquery(this.rootElm).find(".ind-ap").removeClass("hide");
                } else {
                    return;
                }

                var status1 = jquery(this.rootElm).find(".ind-status1");
                var status2 = jquery(this.rootElm).find(".ind-status2");
                var status3 = jquery(this.rootElm).find(".ind-status3");
                var status4 = jquery(this.rootElm).find(".ind-status4");

                status1.removeClass("hide");
                status1.text("ROL");

                if (this.displayVal[this.IDX_HEADING_LOCK]) {
                    status1.text("HDG");
                }
                if (this.displayVal[this.IDX_NAV_LOCK]) {
                    status1.text("NAV");
                }
                if (this.displayVal[this.IDX_APR]) {
                    status1.text("APR");
                }
                if (this.displayVal[this.IDX_REV]) {
                    status1.text("REV");
                }

                status2.removeClass("hide");
                status2.text("PIT");
                if (this.displayVal[this.IDX_ALT_LOCK]) {
                    status2.text("ALT");
                }
                if (this.displayVal[this.IDX_VSHOLD]) {
                    status2.text("VS");
                }
                if (this.displayVal[this.IDX_GS]) {
                    status2.text("GS");
                }

            }

            onTapEvent(elm, e) {
                if (this.isInstrumentOff) {
                    e.preventDefault();
                    return;
                }
                var ctl = jquery(elm).attr("value");
                if (ctl == "baro") {
                    this.displayMode = "baro";
                    jquery(elm).addClass("hold");
                    this.setInputTimer();
                } else
                    if (ctl == "alt") {
                        if (this.displayVal[this.IDX_ALT_LOCK]) {
                            this.displayMode = "vs";
                            this.setInputTimer();
                            this.setDisplayVal(this.IDX_ALT_LOCK, 0);
                            this.setDisplayVal(this.IDX_VSHOLD, 1);
                        } else {
                            this.displayMode = "alt";
                            this.setDisplayVal(this.IDX_ALT_LOCK, 1);
                            this.setDisplayVal(this.IDX_VSHOLD, 0);
                            this.setDisplayVal(this.IDX_GS, 0);
                            this.clearInputTimer();
                        }
                    } else if ((ctl == "vsinc" || ctl == "vsdec") && this.displayVal[this.IDX_VSHOLD]) {
                        if (this.displayMode != "vs") {
                            this.displayMode = "vs";
                        } else {
                            var vsadj = (ctl == "vsinc") ? 100 : -100;
                            this.setDisplayVal(this.IDX_VS, this.displayVal[this.IDX_VS] + vsadj);
                        }
                        this.setInputTimer();
                    }

                if (ctl != "arm" && ctl != "baro") {
                    this.panel.onInputChange("btn" + ctl, 0);
                }
            }

            onTapEndEvent(elm, e) {
                var ctl = jquery(elm).attr("value");
                if (ctl == "baro") {
                    jquery(elm).removeClass("hold");
                }
            }

            onDragEvent(elm, ev, e) {
                if (this.isInstrumentOff) {
                    e.preventDefault();
                    return;
                }
                var nAlt = this.handleKnobControl(elm,ev, this.IDX_ALT, 
                    [
                        {
                            startDigit:4,
                            endDigit:5,
                            step:1000,
                            stepsPerFullCircle: 5,
                            min:0,
                            max:90000,
                            divCtl: ".dot-1k",
                            wrapAround: false,
                            carry: false
                        },
                        {
                            startDigit:3,
                            endDigit:3,
                            step:100,
                            stepsPerFullCircle: 5,
                            min:0,
                            max:0,
                            divCtl: ".dot-100",
                            wrapAround: false,
                            carry: true
                        }
                    ]
                    );
            }

            updateInstrumentState() {
                this.isInstrumentOff = false;
                if (!this.displayVal[this.IDX_AVIONIC_SW] || !this.displayVal[this.IDX_PANEL_ON]) {
                    this.isInstrumentOff = true;
                }
            }

            onInputTimeout() {
                var ctl = jquery(this.rootElm).find(".btn-baro").first();
                if (ctl.hasClass("hold")) {
                    ctl.removeClass("hold");
                    this.isBaroInHg = !this.isBaroInHg;
                    this.setInputTimer();
                } else {
                    this.displayMode = "alt";
                    this.inputTimeoutTimer = null;
                }
            }

            setInputTimer() {
                if (this.inputTimeoutTimer != null) {
                    clearTimeout(this.inputTimeoutTimer);
                }
                this.inputTimeoutTimer = setTimeout(jquery.proxy(this.onInputTimeout, this), this.defaultInputTimeout);
            }

            clearInputTimer() {
                if (this.inputTimeoutTimer != null) {
                    clearTimeout(this.inputTimeoutTimer);
                    this.inputTimeoutTimer = null;
                }
            }
        }
    });
