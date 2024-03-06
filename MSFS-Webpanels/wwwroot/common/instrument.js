require.config({
    baseUrl : '.',
    paths : {
        jquery : '3rdparty/jquery/jquery-1.11.2.min',
        'SysParam' : "../common/sysparam",
        StaticPropertyHelper: "../common/static-property-helper"
    },
    waitSeconds : 30,
});


define([
         'jquery', 'SysParam','StaticPropertyHelper'
         ],
function(jquery, SysParam, StaticPropertyHelper) {

    return class Instrument {

        loadCss(url) {
            var head = jquery("head").first();
            var link = document.createElement("link");
            link.rel="stylesheet";
            link.type="text/css";
            link.href=url;
            head.append(link);
        }

        loadTemplate(url) {
            return new Promise(function(resolve, reject) {
                jquery.get(url, function(data) {
                    resolve(data);
                }).fail(function() {
                    reject();
                });
            });
        }

        init()
        {
            // abstract func
        }

        constructor(panel, rootElm) {
            this.init();
            this.panel = panel;
            this.rootElm = rootElm;
            this.isInstrumentOff = false;
            this.localDisplayVal = {};

            var htmlPromise;
            if (!StaticPropertyHelper.getProperty(this.constructor.name,"htmlPromise")) {
                this.loadCss(this.cssFile);
                htmlPromise = this.loadTemplate(this.htmlFile);
                StaticPropertyHelper.setProperty(this.constructor.name, "htmlPromise", htmlPromise);
            } else {
                htmlPromise = StaticPropertyHelper.getProperty(this.constructor.name,"htmlPromise");
            }

            var thisClass=this;
            htmlPromise.then(function(html) {
               jquery(rootElm).append(html);
               thisClass.bindControls();
               thisClass.onScreenResize();
            });
        }

        bindControls()
        {
            var thisClass=this;
            jquery(this.rootElm).on(SysParam.tapEvent,function(e) {
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-tap").on(SysParam.tapEvent,function(e) {
                thisClass.onTapEvent(this,e);
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-tap").on(SysParam.tapEndEvent,function(e) {
                thisClass.onTapEndEvent(this,e);
                e.preventDefault();
            });
            jquery(this.rootElm).find(".ctl-drag").on(SysParam.dragEvent,function(e) {
                var ev;
                if ('offsetX' in e) {
                    ev={
                        x:e.offsetX,
                        y:e.offsetY,
                        width: jquery(this).width(),
                        height: jquery(this).height(),
                        type: ""
                    };
                } else {
                    var pos=e.currentTarget.getBoundingClientRect();
                    var prop="touches";
                    if (e.type=="touchend") {
                        prop="changedTouches";
                    }
                    ev={
                        x:e.originalEvent[prop][0].clientX-pos.left,
                        y:e.originalEvent[prop][0].clientY-pos.top,
                        width: jquery(this).width(),
                        height: jquery(this).height(),
                        type: ""
                    };
                }

                if (e.type=="mousedown" || e.type=="touchstart") {
                    jquery(this).addClass("touch");
                    ev.type="touchstart";
                } else if ((e.type=="mousemove" || e.type=="touchmove") && jquery(this).hasClass("touch")) {
                    ev.type="touchmove";
                } else if ((e.type=="mouseup" || e.type=="mouseleave" || e.type=="touchend") && jquery(this).hasClass("touch")) {
                    jquery(this).removeClass("touch");
                    ev.type="touchend";
                }
                if (ev.type!="") {
                    thisClass.onDragEvent(this,ev,e);
                }
                e.preventDefault();
            });
        }

        onScreenResize() {
            var elm=this.rootElm;
            var w = jquery(elm).width();
            var h = w / this.aspectRatio;
            jquery(elm).css("height",h);
            jquery(elm).css("font-size", h/7);
        }

        refreshInstrument()
        {
            this.localDisplayVal = JSON.parse(JSON.stringify(this.panel.displayVal));
            this.preprocessLocalDisplayVal();
        }

        preprocessLocalDisplayVal()
        {
            // abstract func
        }

        onDragEvent(elm, ev, e) {
            // abstract func
        }

        onTapEvent(elm, e) {
            // abstract func
        }

        onTapEndEvent(elm, e) {
            // abstract func
        }

        onSimVarChange(simVar, val, sendEvent = true) {
            this.localDisplayVal[simVar]=val;
            this.preprocessLocalDisplayVal();
            this.panel.onSimVarChange(simVar, val, sendEvent);
        }
    }

});
