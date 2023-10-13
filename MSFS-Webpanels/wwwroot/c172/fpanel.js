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

    function resizeContainer() {

        var wh=jquery(window).innerHeight();
        var ww=jquery(window).innerWidth();

        var fh = wh;
        var fw = ww;
        var ar = ww / wh;
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
        if (!jsonData.isSimConnected) {
            jsonData.simData = util.defaultOfflineData.simData;
        }
        if (jsonData.simData.electricalBusVoltage>=20) {
            jsonData.simData.tconoff = 1;
        } else {
            jsonData.simData.tconoff = 0;
        }
        jsonData.simData.magneto = 0;
        if (jsonData.simData.engineStarter==1) {
            jsonData.simData.magneto = 4;
        } else {
            if (jsonData.simData.leftMagnetoState==1) {
                jsonData.simData.magneto+=2;
            }
            if (jsonData.simData.rightMagnetoState==1) {
                jsonData.simData.magneto++;
            }
        }
        jsonData.simData.attitudeGyroOff = 1;
        if (jsonData.simData.vac>4.0) {
            jsonData.simData.attitudeGyroOff = 0;
        }
        jsonData.simData.qnhmb = Math.round(jsonData.simData.qnh*16);
        jsonData.simData.dmeDistance = (jsonData.simData.dmeDistance / 10).toFixed(1);
        jsonData.simData.xpdr = jsonData.simData.xpdr.toString(16);

        var apStatus1="";
        var apStatus2="";

        if (jsonData.simData.apMaster!=0) {
            apStatus1="ROL";
            if (jsonData.simData.apHeadingLock!=0) {
                apStatus1="HDG";
            } else if (jsonData.simData.apNavLock!=0) {
                apStatus1="NAV";
            } else if (jsonData.simData.apApproachHold!=0) {
                apStatus1="APR";
            } else if (jsonData.simData.apRevHold!=0) {
                apStatus1="REV";
            }
            apStatus2="PIT";
            if (jsonData.simData.apVerticalHold!=0) {
                apStatus2="VS";
            } else if (jsonData.simData.apAltitudeLock!=0) {
                apStatus2="ALT";
            } else if (jsonData.simData.apGSHold!=0) {
                apStatus2="GS";
            }
        }

        jsonData.simData.apStatus1=apStatus1;
        jsonData.simData.apStatus2=apStatus2;

        jsonData.simData.fuelSelectorUI = util.fuelSelectorStates[jsonData.simData.fuelSelector-1];

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
        jQuery.get(sysconst.getSimVarUrl,function(jsonData) {
            isServerAppRunning=true;
            refreshDisplay(jsonData);
            isPoolingSimVars=false;
        }, "json").fail(function() {
            isServerAppRunning=false;
            var jsonData=offlineData;
            refreshDisplay(jsonData);
            isPoolingSimVars=false;
        });
    }
    
    function updateSimVarFreq(simvar, val) 
    {
        var inc = false;
        val=parseInt(val);
        if (simvar!="apaltitude") {            
            if (simvar.startsWith("com") && (val % 10)!=0) {
                inc=true;                
            }
            
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
        updateSimVar("simvar-"+simvar, val);
        if (inc) {
            updateSimVar("simvar-"+simvar+"inc", 0);
        }
    }

    jquery(document).ready(function() {
        var touchDevice = ('ontouchstart' in document.documentElement);
        if (touchDevice) {
            ev='touchstart';
            evMove='touchstart touchmove touchend';
        } else {
            ev='click';
            evMove='mousedown mousemove mouseup mouseleave';
        }
        resizeContainer();
        jquery(".ui-switch").on(ev,function(e) {
            var curState = parseInt(jquery(this).attr('state'));
            var nextState = 1-curState;
            var target= jquery(this).attr("target");

            jquery(this).attr("state",nextState);
            util.setVariableCooldown("."+target);
            displaySimVar(target, nextState);
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
            updateSimVar(target,nextState);
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
                jquery(ctl).attr("state",newVal);
                util.setVariableCooldown(ctl);
                util.setVariableCooldown("."+target);
                displaySimVar(target, newVal);
                if (adj<0) {
                    adj=0;
                }
                updateSimVar(target,adj);
            }
            e.preventDefault();
        });

        jquery(".ui-slider").on(evMove,function(e) {
            var sf = util.getAttrFloat(this, "sensitivity", 0.36);
            var ctldir = "y";
            var target=util.getAttrText(this,"target");

            if (jquery(this).hasClass("ui-hslider")) {
                ctldir= "x";
            }
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

            var newPos = touchPos[ctldir];
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

            if (newPos!=oldPos) {
                var vartype=jquery(this).attr("vartype");
                var dif = newPos-oldPos;
                var difVal = dif * sf;

                var param;
                if (target=="simvar-gyrodrifterror") {
                    param = Math.sign(difVal)*Math.floor(Math.abs(difVal));
                    newState = oldState + param;
                    param=util.boundDegree(param);
                } else {
                    newfState = oldfState + difVal;
                    newState = Math.round(newfState);
                    if (vartype=="degree") {
                        newfState=util.boundDegree(newfState);
                        newState=util.boundDegree(newState);
                    }
                    param = newState;
                }

                jquery(this).attr("state", newState);
                jquery(this).attr("fstate", newfState);

                util.setVariableCooldown(this);
                util.setVariableCooldown("."+target);


                if (target=="simvar-headingbug") {
                    util.setVariableCooldown(".simvar-hdgbug");
                    displaySimVar("simvar-hdgbug", {
                        heading: latestSimData.simData.heading,
                        headingBug : newState
                    });
                }
                displaySimVar(target, newState);

                if (oldState!=newState) {
                    updateSimVar(target,param);
                }

                if (jquery(this).hasClass("ui-touched")) {
                    if (target=="simvar-gyrodrifterror") {
                        var adj = (param-difVal)/sf;
                        newPos=newPos-adj;
                    }
                    jquery(this).attr("pos",newPos);
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
                jquery(".ctl-"+vname).attr("state", v);
                util.setVariableCooldown(".simvar-"+vname);
                updateSimVarFreq(vname, v);
                displaySimVar("simvar-"+vname, v);
                if (type=="alt" || type=="xpd") {
                    jquery(".radio-panel").addClass("hide");
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

            digitPosition = 1;
            maxDigit = 6;

            var isShowDecimal = true;
            var isShowActiveFreq = true;

            jquery(".xpdr-invisible").removeClass("invisible");
            
            if (type=="nav") {
                maxDigit=5;
            } else if (type=="adf") {
                isShowDecimal=false;
                maxDigit=4;
            } else if (type=="alt") {
                isShowActiveFreq=false;
                isShowDecimal=false;
                maxDigit=5;
            } else if (type=="xpd") {
                isShowActiveFreq=false;
                isShowDecimal=false;
                maxDigit=4;
                jquery(".xpdr-invisible").addClass("invisible");
            } 

            if (isShowDecimal) {
                jquery(".digit-decimal").removeClass("hide");
            } else {
                jquery(".digit-decimal").addClass("hide");
            }

            if (isShowActiveFreq) {
                var freq1 = util.getAttrInt(jquery(this).find(".radio-active-freq").first(), "state");
                var val1 = util.getFreqText(freq1, type);
                jquery(radioPanel).find(".freq-active").text(tval);
                jquery(".button-swap").removeClass("invisible");
                jquery(".active-freq-row").removeClass("invisible");
                jquery(".freq-standby-label").removeClass("invisible");
            } else {
                jquery(".button-swap").addClass("invisible");
                jquery(".active-freq-row").addClass("invisible");
                jquery(".freq-standby-label").addClass("invisible");
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
            radioPanel.removeClass("hide");
        });

        jquery(".ui-pbutton").on(ev, function(e) {
            var target=jquery(this).attr("target");
            updateSimVar("simvar-"+target,1);
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

        // disable safari save image pop-up
        jquery("img").on(evMove, function(e) {
            e.preventDefault();
        });

        refreshTimer=setInterval(timerFunc, sysconst.refreshPeriod);
    });

    jquery(window).resize(function() {
        resizeContainer();
    });

    function processUpdateQueue()
    {
        var now = Date.now();
        if (now >= nextUpdateTime) {
            if (isServerAppRunning && latestSimData.isSimConnected) {
                nextUpdateTime=now + sysconst.serverUpdateCooldown;
                var itm = updateQueue.shift();
                jQuery.get(sysconst.setSimVarUrl+itm, function(data) {
                    // success
                }).fail(function() {
                    isServerAppRunning=false;
                });
            }
        }
        if (updateQueue.length>0) {
            queueTimer = setTimeout(processUpdateQueue, nextUpdateTime-now);
        }
    }

    function updateSimVar(simvar, val, bcd=false)
    {
        if (isOffline) {
            for(var key in offlineData.simData) {
                var v = "simvar-" + key.toLowerCase();
                if (v==simvar) {
                    offlineData.simData[key]=val;
                    break;
                }
            }
            if (simvar=="simvar-qnhmb") {
                offlineData.simData.qnh=val/16;
            }
        } else {
            if (simvar=="simvar-qnhmb") {
                simvar="simvar-qnh";
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
        if (digitPosition==1 && (type=="nav" || type=="com")) {
            jquery(".comnav-first-digit-hide").addClass("invisible");
        } 
    }
 
});