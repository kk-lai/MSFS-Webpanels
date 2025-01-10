require.config({
    baseUrl : '.',
    paths : {
        jquery : '../3rdparty/jquery/jquery-1.11.2.min',
        util: 'util',
        'const' : 'const'
    },
    waitSeconds : 30,
});

require([
         'jquery','util','const'
         ],
function(jquery,util,sysconst) {
    var versionCode = sysconst.versionCode;
    var isOffline = false;
    var isServerAppRunning = false;
    var refreshTimer = null;
    var isPoolingSimVars = false;
    var nextUpdateTime = 0;
    var latestSimData = null;
    var updateQueue = [];
    var offlineData = util.defaultOfflineData;
    var digitPosition = 1;
    var maxDigit = 6;
    var queueTimer = null;
    var vsDisplayTimer = null;
    var isPauseQueue = false;
    var isProcessingQueue = false;
    var dmeSrc = 1;
    var isDebug = false;

    function resizeContainer() {

        var wh=jquery(window).innerHeight();
        var ww=jquery(window).innerWidth();

        var fh = wh;
        var fw = ww;
        var ar = ww / wh;
        var voffset = 0;
        if (ar>sysconst.aspectRatio) {
            fw=Math.floor(wh*sysconst.aspectRatio);
        } else {
            fh=Math.floor(ww/sysconst.aspectRatio);
        }
        var fontSize = Math.ceil(fh/67);
        jquery(".text-container").css("font-size", fontSize + "px");
        jquery(".container").css("width", fw);
        jquery(".container").css("height", fh);
        jquery(".container").removeClass("hide");
        jquery(".container").css("top", wh - fh);
    }

    function displaySimVar(simvar, val, force=true) {
        jquery("."+simvar).each(function(idx,elm) {
            if (!force) {
                var now = Date.now();
                coolDown=util.getAttrInt(elm,"cooldown",now);
                if (now < coolDown) {
                    return;
                }
                jquery(elm).removeAttr("cooldown");
            }
            var func = jquery(elm).attr("func");
            if (typeof func==="undefined") {
                return;
            }
            util[func](elm,val);
        });
    }

    function refreshDisplay(jsonData) {
        latestSimData = jsonData;
        var errMessage = "Webpanel is not started";
        if (jsonData.isDebug) {
            // check query string
            var urlParams = new URLSearchParams(window.location.search);
            if (!urlParams.has('t')) {
                var url = window.location.href+"&t="+Date.now();
                window.location.replace(url);
            }
        }
        isDebug=jsonData.isDebug;

        if (isServerAppRunning) {
            if (!jsonData.isSimConnected) {
                errMessage = "Simulator is not connected";
            } else {
                if (!jsonData.isSimRunning) {
                    errMessage = "Simulation is not started";
                } else if (jsonData.isPaused) {
                    errMessage = "Simulation paused";
                } else {
                    isShowOverlay = false;
                    errMessage="";
                }
            }
        }
        if (!jsonData.isSimConnected || typeof jsonData.simData === "undefined" || jsonData.simData==null) {
            jsonData.simData = util.defaultOfflineData.simData;
        }
        jsonData = util.postProcessSimData(jsonData, dmeSrc);

        for(var key in jsonData.simData) {
            var simvar = "simvar-" + key.toLowerCase();
            displaySimVar(simvar, jsonData.simData[key], false);
        }

        displaySimVar("simvar-pitch", jsonData.simData, false);
        displaySimVar("simvar-hdgbug", jsonData.simData, false);

        var now = Date.now();

        for(var key in jsonData.simData) {
            var ctlvar= "ctl-"+ key.toLowerCase();
            jquery("."+ctlvar).each(function(idx,elm) {
                var coolDown=util.getAttrInt(elm,"cooldown", now);
                if (now < coolDown) {
                    return;
                }
                jquery(elm).attr("state", jsonData.simData[key]);
            });
        }
        jquery("#sys-message").text(errMessage);
        if (errMessage!="") {
            jquery(".error-overlay").removeClass("hide");
        } else {
            jquery(".error-overlay").addClass("hide");
        }
    }

    function timerFunc() {
        if (isOffline) {
            isServerAppRunning=true;
            refreshDisplay(offlineData);
            return;
        }
        if (isPoolingSimVars) {
            return;
        }
        isPoolingSimVars=true;
        jquery.ajax({
            url: sysconst.simVarUrl,
            success: function(jsonData, textStatus, jqXHR ){
                isServerAppRunning=true;
                refreshDisplay(jsonData);
                isPoolingSimVars=false;
            },
            error: function(jqXHR, textStatus, errorThrown ) {
                isServerAppRunning=false;
                var jsonData=offlineData;
                refreshDisplay(jsonData);
                isPoolingSimVars=false;
            },
            type: "get",
            dataType : "json",
            cache: false
        });
    }

    function updateSimVarFreq(simvar, val)
    {
        val=parseInt(val);
        if (simvar!="apaltitude") {
            var bcd = parseInt(val.toString(),16);
            if (simvar.startsWith("nav") || simvar.startsWith("com")) {
                bcd = bcd >> 4;
                bcd &= 0xffff;
            }
            if (simvar.startsWith("adf")) {
                bcd<<=16;
            }
            val=parseInt(bcd);
        }
        updateSimVar("simvar-" + simvar, val);
        if (simvar == "apaltitude") {
            // if not send this event G1000 selected altitude will show "----"
            updateSimVar("simvar-apaltvarset", val);
        }
    }

    jquery(document).ready(function() {

        var head = jquery("head").first();
        var link = document.createElement("link");
        var ev, evMove, evTapEnd, evTapStart;

        link.rel="stylesheet";
        link.type="text/css";
        link.href="css/fpanel.css?v="+sysconst.versionCode;
        head.append(link);

        jquery(".menu-link").attr('href',"../?v="+sysconst.versionCode+"&noRedirect=true");

        var touchDevice = ('ontouchstart' in document.documentElement);
        if (touchDevice) {
            ev='touchstart';
            evTapStart='touchstart';
            evTapEnd='touchend';
            evMove='touchstart touchmove touchend';
        } else {
            ev='click';
            evTapStart='mousedown';
            evTapEnd='mouseup mouseleave';
            evMove='mousedown mousemove mouseup mouseleave';
        }
        resizeContainer();
        jquery(".version-code").text("Version: "+versionCode);
        jquery(".ui-fullscreen").on(ev, function (e) {
            if (!document.fullscreenElement &&    // alternative standard method
                !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {  // current working methods
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    document.documentElement.msRequestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        });

        jquery(".ui-switch").on(ev,function(e) {
            var curState = parseInt(jquery(this).attr('state'));
            var nextState = 1-curState;
            var target= jquery(this).attr("target");
            var atarget = util.getAttrText(this, "atarget", null);

            if (target=="simvar-tx" && nextState==0) {
                // does not disable tx
                e.preventDefault();
                return;
            }

            jquery(this).attr("state",nextState);
            util.setVariableCooldown("."+target);
            displaySimVar(target, nextState);
            if (target=="simvar-tx") {
                target="simvar-pilottx";
                nextState = 0;
                if (atarget.indexOf("com2")>=0) {
                    nextState=1;
                }
            }
            if (target=="simvar-rx") {
                target=atarget;
            }
            updateSimVar(target,nextState);
            e.preventDefault();
        });

        jquery(".ui-rotaryswitch").on(ev,function(e) {
            var npos = parseInt(jquery(this).attr("max"));
            var curState = parseInt(jquery(this).attr('state'));
            var nextState = (curState+1) % npos;

            var target= jquery(this).attr("target");

            jquery(this).attr("state",nextState);
            util.setVariableCooldown("."+target);
            displaySimVar(target, nextState);
            // only used in fuel selector
            var fuelSelectorStates = ["left", "all", "right"];
            updateSimVar(target+fuelSelectorStates[nextState],0);
            e.preventDefault();
        });

        jquery(".ui-button").on(ev,function(e) {
            var ctl=jquery(this).parent();
            var target= jquery(this).attr("target");
            var oldVal = parseInt(jquery(ctl).attr("state"));
            var adj = jquery(this).hasClass("button-inc") ? 1 : -1;
            var newVal=oldVal+adj;
            var modified=true;

            var max = util.getAttrInt(ctl, "max");
            var min = util.getAttrInt(ctl, "min");

            if (max!=null && min!=null) {
                if (newVal > max || newVal<min) {
                    modified=false;
                }
            }

            if (modified) {
                var otarget = target;
                jquery(ctl).attr("state",newVal);
                util.setVariableCooldown(ctl);
                util.setVariableCooldown("."+target);
                displaySimVar(target, newVal);
                if (adj<0) {
                    target=target+"dec";
                } else {
                    target=target+"inc";
                }
                updateSimVar(target,0);
                if (otarget == "simvar-magneto") {
                    var isheld = 0;
                    if (newVal == 4) {
                        isheld = 1;
                    }
                    updateSimVar("simvar-setstarter1held", isheld);
                }
            }
            e.preventDefault();
        });

        jquery(".ui-dial").on(evMove,function(e) {
            var target=util.getAttrText(this,"target");
            var touchPos;
            var sf = util.getAttrFloat(this, "sensitivity", 0.36);

            if ('offsetX' in e) {
                touchPos={
                    x:e.offsetX,
                    y:e.offsetY
                };
            } else {
                var pos=e.currentTarget.getBoundingClientRect();
                var prop="touches";
                if (e.type=="touchend") {
                    prop="changedTouches";
                }
                touchPos={
                    x:e.originalEvent[prop][0].clientX-pos.left,
                    y:e.originalEvent[prop][0].clientY-pos.top
                };
            }

            var xc = jquery(this).width()/2;
            var yc = jquery(this).height()/2;

            var y = yc - touchPos.y;
            var x = touchPos.x - xc;

            var r = Math.sqrt(x*x+y*y);
            if (r>xc) {
                if (jquery(this).hasClass("ui-touched")) {
                    e.type=="touchend";
                } else {
                    e.preventDefault();
                    return;
                }
            }

            var newAng = Math.atan2(y,x)*180/Math.PI;
            var oldAng = newAng;
            var oldState = util.getAttrFloat(this,"state");
            var oldfState = util.getAttrFloat(this,"fstate"); // state in float
            var newState = oldState;
            var newfState = oldfState;
            var param;

            if (e.type=="mousedown" || e.type=="touchstart") {
                jquery(this).addClass("ui-touched");
                jquery(this).attr("fstate", newState);
                jquery(this).attr("pos",newAng);

                if (Math.abs(newAng)>90) {
                    target = util.getAttrText(this, "targetLeft", target);
                    sf = util.getAttrFloat(this,"sensitivityLeft", sf);
                }

                var oldStateVar = ".ctl-"+target.substring(7,target.length);
                var elm = jquery(oldStateVar).first();
                oldState = util.getAttrFloat(elm ,"state",null);
                oldfState=oldState;
                newState=oldState;
                newfState=newState;
                jquery(this).attr("state",oldState);
                jquery(this).attr("fstate",oldState);
                jquery(this).attr("ctarget", target);
                jquery(this).attr("csensitivity", sf);
            } else if ((e.type=="mousemove" || e.type=="touchmove") && jquery(this).hasClass("ui-touched")) {
                oldAng = util.getAttrFloat(this, "pos");
                jquery(this).attr("pos", newAng);
                target = util.getAttrText(this, "ctarget", target);
                sf = util.getAttrFloat(this,"csensitivity",sf);
            } else if ((e.type=="mouseup" || e.type=="mouseleave" || e.type=="touchend") && jquery(this).hasClass("ui-touched")) {
                oldAng = util.getAttrInt(this, "pos");
                target = util.getAttrText(this, "ctarget", target);
                sf = util.getAttrFloat(this,"csensitivity",sf);
                jquery(this).removeAttr("pos");
                jquery(this).removeClass("ui-touched");
                jquery(this).removeAttr("ctarget");
                jquery(this).removeAttr("csensitivity");
            }

            if (newAng!=oldAng) {
                var dif = newAng-oldAng;

                dif = newAng - oldAng;
                if (Math.abs(dif)>180) {
                    dif=-1*Math.sign(dif)*(360-Math.abs(dif));
                }

                dif = dif * sf;

                if (target=="simvar-tasadj") {
                    newfState = (oldfState + dif);
                    var min = util.getAttrFloat(this, "min");
                    var max = util.getAttrFloat(this, "max");

                    if (newfState > max) {
                        newfState = max;
                    }
                    if (newfState < min) {
                        newfState = min;
                    }
                    newState = Math.round(newfState);
                    param=newState;
                } else {
                    newfState = (oldfState + dif);
                    if (target!="simvar-qnh") {
                        newfState = (newfState % 360);
                        newState = util.boundDegree(Math.floor(newfState));
                    } else {
                        var max=util.getAttrInt(this,"max");
                        var min=util.getAttrInt(this,"min");
                        if (newfState > max) {
                            newfState = max;
                        }
                        if (newfState < min) {
                            newfState = min;
                        }
                        newState = Math.round(newfState);
                    }
                    param=newState;
                }

                if (oldState!=newState) {
                    jquery(this).attr("state", newState);
                    jquery(this).attr("fstate", newfState);
                    util.setVariableCooldown(this);
                    util.setVariableCooldown("."+target);

                    if (target=="simvar-heading") {
                        jquery(".ctl-heading").attr("state", newState);
                        displaySimVar("simvar-hdgbug", {
                            heading: newState,
                            headingBug : latestSimData.simData.headingBug
                        });
                    }
                    if (target=="simvar-headingbug") {
                        jquery(".ctl-headingbug").attr("state", newState);
                        util.setVariableCooldown(".simvar-hdgbug");
                        displaySimVar("simvar-hdgbug", {
                            heading: latestSimData.simData.heading,
                            headingBug : newState
                        });
                    }
                    displaySimVar(target, newState);
                    if (target=="simvar-heading") {
                        target="simvar-gyrodrifterrorex";
                    }
                    purgeQueue(target);
                    updateSimVar(target,param);
                } else {
                    if (jquery(this).hasClass("ui-touched")) {
                        jquery(this).attr("pos", oldAng);
                    }
                }
            }

            e.preventDefault();
        });

        jquery(".ui-vshifter").on(evMove,function(e) {
            var sf = util.getAttrFloat(this, "sensitivity", -1);
            var target=util.getAttrText(this,"target");
            var newPos;
            if ('offsetX' in e) {
                newPos=e.offsetY;
            } else {
                var pos=e.currentTarget.getBoundingClientRect();
                var prop="touches";
                if (e.type=="touchend") {
                    prop="changedTouches";
                }
                newPos=e.originalEvent[prop][0].clientY-pos.top;
            }

            var oldPos = newPos;
            var oldState = util.getAttrFloat(this,"state");
            var oldfState = util.getAttrFloat(this,"fstate"); // state in float
            var newState = oldState;
            var newfState = oldfState;

            if (e.type=="mousedown" || e.type=="touchstart") {
                jquery(this).addClass("ui-touched");
                jquery(this).attr("fstate", newState);
                jquery(this).attr("pos",newPos);
            } else if ((e.type=="mousemove" || e.type=="touchmove") && jquery(this).hasClass("ui-touched")) {
                oldPos = util.getAttrInt(this, "pos");
                jquery(this).attr("pos", newPos);
            } else if ((e.type=="mouseup" || e.type=="mouseleave" || e.type=="touchend") && jquery(this).hasClass("ui-touched")) {
                oldPos = util.getAttrInt(this, "pos");
                jquery(this).removeAttr("pos");
                jquery(this).removeClass("ui-touched");
            }

            if (oldPos!=newPos) {
                var dif = (newPos - oldPos)*sf;
                newfState = newfState + dif;
                newState = Math.round(newfState);
                var min = util.getAttrInt(this, "min");
                var max = util.getAttrInt(this, "max");

                if (min!=null && newState<min) {
                    newState=min;
                    newfState=min;
                }

                if (max!=null && newState>max) {
                    newState=max;
                    newfState=max;
                }

                if (newState!=oldState) {
                    jquery(this).attr("state", newState);
                    jquery(this).attr("fstate", newfState);
                    util.setVariableCooldown(this);
                    util.setVariableCooldown("."+target);
                    displaySimVar(target, newState);
                    purgeQueue(target);
                    updateSimVar(target,newState);
                } else {
                    if (jquery(this).hasClass("ui-touched")) {
                        jquery(this).attr("pos", oldPos);
                    }
                }
            }
            e.preventDefault();
        });

        jquery(".num-pad-digit-wrapper").on(ev, function(e) {
            var k=util.getAttrText(this,"val");
            var target = jquery(".radio-panel").first().attr("target");
            var type=target.substring(0,3);
            if (k>='0' && k<='9') {
                var zero="0";
                var v = k.charCodeAt(0) - zero.charCodeAt(0);
                var id = "#digit-pos-"+digitPosition;
                jquery(id).text(v);
                digitPosition++;
                if (digitPosition>maxDigit) {
                    digitPosition=1;
                }
            } else if (k=='b') {
                digitPosition--;
                if (digitPosition<1) {
                    digitPosition=1;
                }
            } else if (k=='s') {
                digitPosition=1;
                var v = util.getNumericPadValue();
                var vname;
                if (target.startsWith("nav")) {
                    v=v+"0";
                }
                if (type=="nav" || type=="com" || type=="adf") {
                    vname=target+"standbyfreq";
                } else if (type=="alt") {
                    vname="ap"+target;
                    v=parseInt(v);
                } else if (type=="xpd") {
                    vname="xpdr";
                }

                jquery("#freq-error").addClass("invisible");
                var freq=parseInt(v);
                if ((type=="com" && (freq<118000 || freq>=137000)) ||
                    (type=="nav" && (freq<108000 || freq>=118000)) ||
                    (type=="adf" && (freq<100 || freq>=1800))) {
                    jquery("#freq-error").removeClass("invisible");
                    return;
                }

                jquery(".ctl-"+vname).attr("state", v);
                util.setVariableCooldown(".simvar-"+vname);
                updateSimVarFreq(vname, v);
                displaySimVar("simvar-"+vname, v);
                if (type=="alt" || type=="xpd") {
                    jquery(".radio-panel").addClass("hide");
                } else {
                    var freq = jquery(".simvar-"+vname).first().text();
                    jquery(".radio-panel").first().find(".freq-standby").text(freq);
                }
            }
            highlightActiveDigit();
            hideNumPadDigits(type);
            e.preventDefault();
        });


        jquery(".radio-panel-close").on(ev, function(e) {
            jquery(".radio-panel").addClass("hide");
            e.preventDefault();
        });

        jquery(".button-swap").on(ev, function(e) {
            var target = jquery(".radio-panel").first().attr("target");

            var activeFreq = jquery(".ctl-" + target + "activefreq").attr("state");
            var v = util.getNumericPadValue();

            if (target.startsWith("nav")) {
                v=v+"0";
            }

            jquery(".ctl-"+target+"activefreq").attr("state", v);
            jquery(".ctl-"+target+"standbyfreq").attr("state", activeFreq);

            util.setVariableCooldown(".simvar-"+target+"activefreq");
            util.setVariableCooldown(".simvar-"+target+"standbyfreq");

            displaySimVar("simvar-"+target+"activefreq", v);
            displaySimVar("simvar-"+target+"standbyfreq", activeFreq);

            updateSimVar("simvar-"+target+"freqswap",0);
            jquery(".radio-panel").addClass("hide");

            e.preventDefault();
        });

        jquery(".ui-popup").on(ev, function(e) {
            var src = jquery(this).attr("target");
            var radioPanel = jquery(".radio-panel").first();

            jquery(radioPanel).attr("target", src);
            jquery(radioPanel).find(".freq-name").text(src.toUpperCase());

            var type = src.substring(0,3);
            var micvar = null;
            var spkrvar = "simvar-"+src+"rx";

            digitPosition = 1;
            maxDigit = 6;

            var isShowDecimal = true;
            var isShowActiveFreq = true;

            switch (type) {
                case "com":
                    micvar = "simvar-"+src+"tx";
                    break;
                case "nav":
                    maxDigit=5;
                    break;
                case "adf":
                    isShowDecimal=false;
                    maxDigit=4;
                    break;
                case "alt":
                    spkrvar=null;
                    isShowActiveFreq=false;
                    isShowDecimal=false;
                    maxDigit=5;
                    break;
                case "xpd":
                    spkrvar=null;
                    isShowActiveFreq=false;
                    isShowDecimal=false;
                    maxDigit=4;
                    break;
            }

            if (isShowDecimal) {
                jquery(".digit-decimal").removeClass("hide");
            } else {
                jquery(".digit-decimal").addClass("hide");
            }

            if (isShowActiveFreq) {
                var freq1 = jquery(this).find(".radio-active-freq").first().text();
                var freq2 = jquery(this).find(".numeric-input-target").first().text();

                jquery(radioPanel).find(".freq-active").text(freq1);
                jquery(radioPanel).find(".freq-standby").text(freq2);
                jquery(".button-swap").removeClass("invisible");
                jquery(".freq-standby-row").removeClass("invisible");
            } else {
                var freq1 = jquery(this).find(".numeric-input-target").first().text();
                jquery(radioPanel).find(".freq-active").text(freq1);
                jquery(".button-swap").addClass("invisible");
                jquery(".freq-standby-row").addClass("invisible");
            }

            var state ;

            if (spkrvar==null) {
                jquery(".radio-spkr-container").addClass("hide");
            } else {
                jquery(".radio-spkr-container").removeClass("hide");
                jquery(".simvar-rx").attr("atarget", spkrvar);
                state = util.getAttrInt("."+spkrvar,"state");
                jquery(".simvar-rx").attr("state", state);
                displaySimVar("simvar-rx", state, true);
            }

            if (micvar==null) {
                jquery(".radio-mic-container").addClass("hide");
            } else {
                jquery(".radio-mic-container").removeClass("hide");
                jquery(".simvar-tx").attr("atarget", micvar);
                state = util.getAttrInt("."+micvar,"state");
                jquery(".simvar-tx").attr("state", state);
                displaySimVar("simvar-tx", state, true);
            }

            var val2 = util.getAttrText(jquery(this).find(".numeric-input-target").first(), "state");

            while (val2.length<maxDigit) {
                val2="0"+val2;
            }

            for(var i=1; i<=6; i++) {
                if (i==1) {
                    jquery("#digit-pos-"+i).addClass("freq-digit-active");
                } else {
                    jquery("#digit-pos-"+i).removeClass("freq-digit-active");
                }
                if (i<=maxDigit) {
                    jquery("#digit-pos-"+i).removeClass("invisible");
                    jquery("#digit-pos-"+i).text(val2.substring(i-1,i));
                } else {
                    jquery("#digit-pos-"+i).addClass("invisible");
                }
            }

            if (type=="alt") {
                maxDigit=3;
            }
            hideNumPadDigits(type);
            jquery("#freq-error").addClass("invisible");
            radioPanel.removeClass("hide");
        });

        jquery(".ui-pbutton").on(evTapStart, function(e) {
            jquery(this).addClass("btn-tapped");
        });

        jquery(".ui-pbutton").on(evTapEnd, function(e) {
            jquery(this).removeClass("btn-tapped");
        });

        jquery(".ui-pbutton").on(ev, function(e) {
            var target=jquery(this).attr("target");
            if (target=="headinggyroset") {
                util.setVariableCooldown(".simvar-gyrodrifterror");
                displaySimVar("simvar-gyrodrifterror", 0);
                var nheading = latestSimData.simData.heading - latestSimData.simData.gyroDriftError;
                displaySimVar("simvar-heading", nheading);
                jquery(".ctl-heading").attr("state", nheading);
            }
            updateSimVar("simvar-" + target, 0);
            var state = util.getAttrText(this, "state", null);
            if (target == "btnalt" && state == "ALT") {
                updateSimVar("simvar-appanelvson", 0);
            }
            if (target.substring(0,5)=="btnvs") {
                if (vsDisplayTimer!=null) {
                    clearTimeout(vsDisplayTimer);
                }
                jquery(".apaltitude-display").addClass("hide");
                jquery(".apvs-display").removeClass("hide");
                vsDisplayTimer=setTimeout(function() {
                    jquery(".apvs-display").addClass("hide");
                    jquery(".apaltitude-display").removeClass("hide");
                }, 3000);
            }
            e.preventDefault();
        });

        jquery(".ui-dmeselector").on(ev, function(e) {
            dmeSrc=(2-dmeSrc)+1;
            e.preventDefault();
        });

        jquery(".ui-xpdrswitch").on(ev, function(e) {
            var cstate = parseInt(jquery(this).attr("state"));
            cstate++;
            if (cstate>=5) {
                cstate=0;
            }
            util.setVariableCooldown(".simvar-xpdrswitch");
            jquery(this).attr("state", cstate);
            updateSimVar("simvar-xpdrswitch", cstate);
        });

        jquery(".ui-reload").on(ev, function(e) {
            location.reload(true);
        });

        jquery(".ui-help").on(ev, function(e) {
            if (jquery("#help-screen-overlay").hasClass("hide")) {
                jquery("#help-screen-overlay").removeClass("hide");
                jquery(".help-overlay").removeClass("hide");
            } else {
                jquery("#help-screen-overlay").addClass("hide");
                jquery(".help-overlay").addClass("hide");
            }
        });

        // disable safari save image pop-up
        jquery("img").on(evMove, function(e) {
            e.preventDefault();
        });

        refreshTimer=setInterval(timerFunc, sysconst.refreshPeriod);
    });

    jquery(window).resize(function() {
        resizeContainer();
    });

    function purgeQueue(simvar)
    {
        isPauseQueue=true;
        var newQueue = [];
        for(var i=0;i<updateQueue.length;i++) {
            var itm=updateQueue[i];
            if (itm.indexOf(simvar+"/")<0) {
                newQueue.push(itm);
            }
        }
        updateQueue=newQueue;
        isPauseQueue=false;
    }

    function processUpdateQueue()
    {
        if (isProcessingQueue) {
            return;
        }
        isProcessingQueue=true;
        var now = Date.now();
        if (now >= nextUpdateTime && !isPauseQueue) {
            if (isServerAppRunning && latestSimData.isSimConnected) {
                nextUpdateTime=now + sysconst.serverUpdateCooldown;
                var itm = updateQueue.shift();

                if (typeof itm !== "undefined" && itm!=null) {
                    var evt = itm.split("/");
                    var arg1 = parseInt(evt[1]);
                    var obj={
                        "eventName": evt[0],
                        "iparams": [ arg1 ]
                    };

                    if (evt[0]=="simvar-attitudebarposition") {
                        obj.iparams= [0, arg1 ];
                    } else
                    if (evt[0] == "simvar-apaltvarset") {
                        obj.iparams = [arg1, 1];
                    }
                    var jsonText=JSON.stringify(obj);
                    jquery.ajax(sysconst.simVarUrl,
                    {
                        data: jsonText,
                        contentType : "application/json",
                        type: "POST",
                        error: function(jqXHR, textStatus, errorThrown ) {
                            isServerAppRunning=false;
                        }
                    });
                }
            }
        }
        if (updateQueue.length>0) {
            var timeDiff = nextUpdateTime-now;
            if (timeDiff <= 0) {
                timeDiff = 10;
            }
            queueTimer = setTimeout(processUpdateQueue, timeDiff);
        }
        isProcessingQueue=false;
    }

    function updateSimVar(simvar, val, bcd=false)
    {
        if (isOffline) {
            for(var key in offlineData.simData) {
                var v = "simvar-" + key.toLowerCase();
                if (v==simvar) {
                    if (simvar.endsWith("freq")) {
                        var s = val.toString(16);
                        var nv = parseInt(s);
                        if (simvar.includes("nav") || simvar.includes("com")) {
                            val=nv*10+100000;
                        } else {
                            val=nv/10000;
                        }
                    }
                    offlineData.simData[key]=val;
                    break;
                }
            }
            if (simvar=="simvar-gyrodrifterror") {
                offlineData.simData.gyroDriftError=offlineData.simData.gyroDriftError + val;
                offlineData.simData.heading=offlineData.simData.heading + val;
            }
        } else {
            if (val < 0) {
                val = Math.pow(2,32) + val;
            }
            var param = encodeURIComponent(val);
            updateQueue.push(simvar+"/"+param);
            processUpdateQueue();
        }
    }

    function highlightActiveDigit()
    {
        var id = "digit-pos-"+digitPosition;
        jquery(".freq-digit").each(function(idx,elm) {
            if (elm.id==id) {
                jquery(elm).addClass("freq-digit-active");
            } else {
                jquery(elm).removeClass("freq-digit-active");
            }
        });
    }

    function hideNumPadDigits(type) {
        jquery(".num-pad-digit-wrapper").removeClass("invisible");
        if (digitPosition==6) {
            jquery(".com-last-digit-hide").addClass("invisible");
        }
        if (digitPosition==5 && type=="nav") {
            jquery(".nav-last-digit-hide").addClass("invisible");
        }
        if (digitPosition==1 && (type=="nav" || type=="com")) {
            jquery(".comnav-first-digit-hide").addClass("invisible");
        }
        if (type=="xpd") {
            jquery(".xpdr-invisible").addClass("invisible");
        }
    }

});