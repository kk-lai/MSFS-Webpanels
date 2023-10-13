require.config({
    baseUrl : '.',
    paths : {
        jquery : '../3rdparty/jquery/jquery-1.11.2.min',
        'const' : 'const'
    },
    waitSeconds : 30,
});

define(['jquery','const'],function(jquery, sysconst) {
    return {
        getAttrText: function(elm, a, defaultVal=null) {
            var attr=jquery(elm).attr(a);
            var o = defaultVal;
            if (typeof attr!=='undefined') {
                o=attr;
            }
            return o;
        },
        getAttrFloat: function (elm, a, defaultVal=null) {
            var attr=this.getAttrText(elm,a);
            var o = defaultVal;
            if (attr!=null) {
                o=parseFloat(attr);
            }
            return o;
        },
        getAttrInt: function (elm, a, defaultVal=null) {
            var attr=this.getAttrText(elm,a);
            var o = defaultVal;
            if (attr!=null) {
                o=parseInt(attr);
            }
            return o;
        },
        getOffsetVal: function(elm) {
            return this.getAttrFloat(elm, "valOffset", 0);
        },
        generic: function(elm, val) {
            var params = {
                rotateScaleFactor : 1,
                rotateOffset : 0,
                htranslateScaleFactor: 0,
                htranslateOffset:0,
                vtranslateScaleFactor:0,
                vtranslateOffset:0,
                max:null,
                min:null
            };
            for(var kp in params) {
                params[kp]=this.getAttrFloat(elm, kp, params[kp]);
            }
            if (params.max!==null && val>params.max) {
                val=params.max;
            }
            if (params.min!==null && val<params.min) {
                val=params.min;
            }

            var rotate = val*params.rotateScaleFactor + params.rotateOffset;
            var htranslate = val*params.htranslateScaleFactor + params.htranslateOffset;
            var vtranslate = val*params.vtranslateScaleFactor + params.vtranslateOffset;

            var cssProp="";
            if (rotate!=0) {
                cssProp = cssProp + " rotate("+rotate+"deg)";
            }
            if (htranslate!=0 || vtranslate!=0) {
                cssProp = cssProp + " translate("+htranslate+"%, "+vtranslate+"%)";
            }

            jquery(elm).css("transform", cssProp);
        },
        showText: function(elm,val) {
            jquery(elm).text(val);
        },
        showLookupText: function (elm, val) {
            var tbl =jquery(elm).attr("tbl");
            var txt = this[tbl][val];
            
            jquery(elm).text(txt);            
        },
        getFreqText: function (val, type) {
            if (type=="adf") {
                tval = val.toString();
                while (tval.length<4) {
                    tval = "0"+tval;
                }
            } else if (type=="nav") {
                val=val/1000;
                tval = val.toFixed(2);
            } else {
                val=val/1000;
                tval = val.toFixed(3);
            }
            return tval;
        },
        showFreq: function(elm, val) {
            var type = this.getAttrText(elm,"type","com");

            jquery(elm).text(this.getFreqText(val, type));
        },
        setVariableCooldown: function(elm, cooldown=sysconst.defaultCoolDown) {
            var cooldownTime = Date.now() + cooldown;
            jquery(elm).attr("cooldown", cooldownTime);
        },
        showAltitude: function(elm, val) {
            var tval = val.toString();
            if (tval.length>3) {
                tval = tval.substring(0,tval.length-3) + " " + tval.substring(tval.length-3, tval.length);
            }
            jquery(elm).text(tval);
        },
        showHideWarning: function(elm,val) {
            var wcolor = jquery(elm).attr("warning");
            if (val) {
                jquery(elm).addClass("warning-"+wcolor+"-on");
            } else {
                jquery(elm).removeClass("warning-"+wcolor+"-on");
            }
        },
        ctlSwitch: function(elm, val) {
            jquery(elm).children(".switch-state-"+val).removeClass("hide");
            jquery(elm).children(".switch-state-"+(1-val)).addClass("hide");
        },
        vtranslateInterpolate: function(elm, val) {
            var valOffset = this.getOffsetVal(elm);
            var mappingTable = jquery(elm).attr("tbl");
            var vtranslate = this.interpolate(val+valOffset, mappingTable);
            jquery(elm).css("transform", "translate(0," + vtranslate + "%)");
        },
        rotateInterpolate : function( elm, val) {
            var valOffset = this.getOffsetVal(elm);
            var mappingTable = jquery(elm).attr("tbl");
            var rotation = this.interpolate(val+valOffset, mappingTable);
            jquery(elm).css("transform", "rotate(" + rotation + "deg)");
        },
        interpolate : function(val, mappingTable) {

            var tbl = this[mappingTable];
            var min = tbl[0][0];
            var max = tbl[tbl.length-1][0];
            var idx;
            if (val<min) {
                val=min;
            }
            if (val>max) {
                val=max;
            }

            for(var idx=0;idx<tbl.length-1;idx++) {
                if (val<=tbl[idx+1][0]) {
                    break;
                }
            }
            return (val-tbl[idx][0])*(tbl[idx+1][1]-tbl[idx][1])/(tbl[idx+1][0]-tbl[idx][0]) + tbl[idx][1];
        },
        atitudePitch : function (elm, val)
        {
            var rotate = val.atitudeBank;
            var pitch = val.atitudePitch;

            if (pitch < -20) {
                pitch = -20;
            }
            if (pitch > 20) {
                pitch = 20;
            }
            var vtranslate = pitch * -0.87890625;

            jquery(elm).css("transform", "rotate("+rotate+"deg) translate(0,"+vtranslate+"%)");
        },
        showHide : function (elm, val){
            var param = parseInt(jquery(elm).attr("param"));
            if (val!=param) {
                jquery(elm).addClass("hide");
            } else {
                jquery(elm).removeClass("hide");
            }
        },
        turnBall: function (elm, val) {
            var htranslate=val*0.1827017717;
            var vtranslate=-val*0.02199187992;

            jquery(elm).css("transform","translate("+htranslate+"%,"+vtranslate+"%)");
        },
        hdgBug: function(elm, val) {
            var hdg=val.heading;
            var hdgBug=val.headingBug;
            var fheading = (hdgBug-hdg);

            jquery(elm).css("transform", "rotate("+fheading+"deg)");
        },
        rotateLookup: function(elm, val) {
            var tblName=jquery(elm).attr("tbl");
            var tbl=this[tblName];

            var rotate=tbl[val];
            jquery(elm).css("transform", "rotate("+rotate+"deg)");
        },
        fuelSelector: function (elm,val) {
            for(var i=0;i<3;i++) {
                if (i==val) {
                    jquery(elm).children(".switch-state-"+i).removeClass("hide");
                } else {
                    jquery(elm).children(".switch-state-"+i).addClass("hide");
                }
            }
        },
        getNumericPadValue: function() {
            var val = "";
            for(var i=1;i<=6;i++) {
                if (jquery("#digit-pos-"+i).hasClass("invisible")) {
                    break;
                }
                val = val + jquery("#digit-pos-"+i).text();
            }
            return val;
        },    
        boundDegree: function(deg) {
            if (deg<0) {
                return 360+deg;
            }
            while (deg>=360) {
                deg-=360;
            }
            return deg;
        },
        asiPositions: [
            [   0,  0.0],
            [  10,  3.0],
            [  40, 31.1],
            [  60, 71.7],
            [  80,118.0],
            [ 100,165.3],
            [ 120,206.6],
            [ 140,238.3],
            [ 160,267.7],
            [ 180,293.1],
            [ 200,319.2],
            [ 210,331.6]
        ],
        rpmPositions: [
            [0,-38.6],
            [0.1,-33.85],
            [500,-2.85],
            [1000,32.9],
            [1500,68.9],
            [2000,105.4],
            [2500,141.4],
            [3000,177.4],
            [3500,213.4]
        ],
        leftFuelPositions: [
            [   0, 56.0],
            [   5, 33.5],
            [  10, 11.0],
            [  15,-11.5],
            [  20,-32.5],
            [  26,-53.0]
        ],
        rightFuelPositions: [
            [   0,124.0],
            [   5,146.5],
            [  10,169.0],
            [  15,191.5],
            [  20,212.5],
            [  26,233.0]
        ],
        vsiPositions: [
            [  -2000.0,-173.5],
            [  -1500.0,-131.5],
            [  -1000.0, -81.5],
            [   -500.0, -35.3],
            [      0.0,   0.0],
            [    500.0,  35.7],
            [   1000.0,  81.5],
            [   1500.0, 131.0],
            [   2000.0, 172.9]
        ],
        fuelFlowPositions:[
            [   0,126.8],
            [   5,134.8],
            [   6,137.4],
            [  10,156.4],
            [  15,191.8],
            [  19,233.0],
            [  20,242.7]
        ],
        oilTempPositions: [
            [  55, 60.0],
            [  75, 55.0],
            [ 100, 45.0],
            [ 150, 13.0],
            [ 200,-26.0],
            [ 245,-56.5],
            [ 260,-66.7]
        ],
        oilPressurePositions: [
            [0,123],
            [20,143],
            [40,161.5],
            [60,181.5],
            [80,201.5],
            [100,221.5],
            [115,235],
            [120,239.5]
        ],
        attittudePlanePositions: [
            [-1, 19],
            [-0.65999997, 13.5],
            [-0.049999997, 0],
            [0.47, -13.5],
            [0.93, -27],
            [1.0, -32.5]
        ],
        magnetoPositions : [-65,-35,0,35,65],
        fuelSelectorStates: [1,0,2],
        xpdrSwitchText:[
            "OFF",
            "SBY",
            "TST",
            "ON",
            "ALT",
            "GND"
        ],
        defaultOfflineData:{
            "simData": {
                "fuelLeftQuantity": 0,
                "fuelRightQuantity": 0,
                "engineEGT": 1.4278486,
                "engineFuelFlow": 0,
                "engineOilTemp": 527.7012,
                "engineOilPressure": 0,
                "vac": 0,
                "batteryAmp": 0,
                "ias": 0,
                "tasAdj": 0,
                "atitudePitch": 0,
                "atitudeBank": 0,
                "atitudeBarPosition": 0,
                "altitude": 0,
                "nav1Obs": 0,
                "nav1ToFrom": 0,
                "nav1GSFlag": 0,
                "nav1CDI": 0,
                "nav1GSI": 0,
                "tcBallPos": -1,
                "tcRate": 0,
                "heading": 0,
                "headingBug": 0,
                "vsi": 0,
                "nav2Obs": 0,
                "nav2ToFrom": 0,
                "nav2GSFlag": 0,
                "nav2CDI": 0,
                "nav2GSI": 0,
                "engineRPM": 0,
                "adfCard": 0,
                "adfRadial": 90,
                "switchBCN": 0,
                "switchLAND": 0,
                "switchTAXI": 0,
                "switchNAV": 0,
                "switchSTROBE": 0,
                "switchPitotHeat": 0,
                "switchAlternator": 0,
                "switchBatteryMaster": 0,
                "switchAvionics1": 0,
                "switchAvionics2": 0,
                "leftMagnetoState": 0,
                "rightMagnetoState": 0,
                "flapsPosition": 0,
                "switchFuelPump": 0,
                "gyroDriftError": 0,
                "qnh": 1013.25,
                "engineStarter": 0,
                "electricalBusVoltage": 0,
                "fuelSelector": 1,
                "parkingBrake": 0,
                "fuelValve": 0,
                "warningVACLeft": 0,
                "warningVACRight": 0,
                "warningVAC": 0,
                "warningVoltage": 0,
                "warningOilPressure": 0,
                "warningFuelLeft": 0,
                "warningFuelRight": 0,
                "warningFuel": 0,
                "atcId": "",
                "com1ActiveFreq": 124850,
                "com1StandbyFreq": 124850,
                "com2ActiveFreq": 124850,
                "com2StandbyFreq": 124850,
                "nav1ActiveFreq": 110500,
                "nav1StandbyFreq": 113900,
                "nav2ActiveFreq": 110500,
                "nav2StandbyFreq": 113900,
                "adfActiveFreq": 890,
                "adfStandbyFreq": 341,
                "apAltitude": 0,
                "apMaster": 0,
                "apHeadingLock": 0,
                "apNavLock": 0,
                "apAltitudeLock": 0,
                "apVerticalHold": 0,
                "apVerticalHoldSpeed": 0,
                "apApproachHold":0,
                "apRevHold":0,
                "apGSHold":0,
                "dmeDistance": 0,
                "xpdr": 4608,
                "xpdrSwitch": 0
            },
            "isPaused": false,
            "isSimRunning": true,
            "isSimConnected": true,
            "aircraftCFGPath": null
        }
    };
});