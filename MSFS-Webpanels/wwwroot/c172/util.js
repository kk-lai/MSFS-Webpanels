require.config({
    baseUrl : '.',
    paths : {
        jquery : '../3rdparty/jquery/jquery-1.11.2.min',
        'const' : 'const'
    },
    waitSeconds : 30,
});

// Version: 1.2.0

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
        attitudePitch : function (elm, val)
        {
            var rotate = val.attitudeBank;
            var pitch = val.attitudePitch;

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
            var vtranslate=-Math.abs(val)*0.02199187992;

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
        postProcessSimData: function (jsonData, dmeSrc) {
            jsonData.simData.warningVACLeft = 0;
            jsonData.simData.warningVACRight = 0;
            jsonData.simData.warningVAC = 0;
            jsonData.simData.warningVoltage = 0;
            jsonData.simData.warningOilPressure = 0;
            jsonData.simData.warningFuelLeft = 0;
            jsonData.simData.warningFuelRight = 0;
            jsonData.simData.warningFuel = 0;

            jsonData.simData.simulationRate = jsonData.simulationRate;
            if (jsonData.simulationRate < 1) {
                var idx = Math.abs(Math.log(jsonData.simulationRate) / Math.log(2));
                var tbl = ["½", "¼", "⅛", "1/16"];
                jsonData.simData.simulationRate = tbl[idx - 1];
            }
            jsonData.simData.simulationRate = "x" + jsonData.simData.simulationRate;

            if (jsonData.simData.electricalBusVoltage>0) {
                if (jsonData.simData.fuelLeftQuantity<5) {
                    jsonData.simData.warningFuelLeft = 1;
                    jsonData.simData.warningFuel = 1;
                }
                if (jsonData.simData.fuelRightQuantity < 5) {
                    jsonData.simData.warningFuelRight = 1;
                    jsonData.simData.warningFuel = 1;
                }

                if (jsonData.simData.engineOilPressure*144 < 2880) {
                    jsonData.simData.warningOilPressure = 1;
                }

                if (jsonData.simData.electricalBusVoltage < 25.5) {
                    jsonData.simData.warningVoltage = 1;
                }

                if (jsonData.simData.vac < 3) {
                    jsonData.simData.warningVACLeft = 1;
                    jsonData.simData.warningVACRight = 1;
                    jsonData.simData.warningVAC = 1;
                }
            }

            if (jsonData.simData.generalPanelOn) {
                jsonData.simData.tconoff = 1;
            } else {
                jsonData.simData.tconoff = 0;
            }
            jsonData.simData.magneto = 0;
            if (jsonData.simData.engineStarter == 1) {
                jsonData.simData.magneto = 4;
            } else {
                if (jsonData.simData.leftMagnetoState == 1) {
                    jsonData.simData.magneto += 2;
                }
                if (jsonData.simData.rightMagnetoState == 1) {
                    jsonData.simData.magneto++;
                }
            }
            jsonData.simData.attitudeGyroOff = 1;
            if (jsonData.simData.vac > 2.3) {
                jsonData.simData.attitudeGyroOff = 0;
            }

            if (!jsonData.simData.hsiCDINeedleValid) {
                jsonData.simData.hsiCDINeedle=0;
            }
            if (!jsonData.simData.hsiGSINeedleValid) {
                jsonData.simData.hsiGSINeedle=0;
            }

            var dmePrefix = "dme";
            if (dmeSrc!=1) {
                dmePrefix="dme2";
            }

            var dmeDistance = "";
            if (dmeSrc==1 && jsonData.simData.gpsDriveNav1) {
                jsonData.simData.dmesrc = "GPS";
                dmeDistance = (jsonData.simData.hsiDistance / 10).toFixed(1);
            } else {
                jsonData.simData.dmesrc = "DME"+dmeSrc;
                if (jsonData.simData[dmePrefix+"IsAvailable"] && jsonData.simData[dmePrefix+"Signal"]>0) {
                    dmeDistance = (jsonData.simData[dmePrefix+"Distance"] / 10).toFixed(1);
                }
            }
            jsonData.simData.dmeDistance=dmeDistance;

            jsonData.simData.xpdr = jsonData.simData.xpdr.toString(16).padStart(4, '0');

            var engineHour = jsonData.simData.engineElapsedTime.toString().padStart(5, "0");

            jsonData.simData.engineHour = engineHour.substring(0,4);
            jsonData.simData.engineHour10 = engineHour.substring(4,5);

            var apStatus1 = "";
            var apStatus2 = "";

            if (jsonData.simData.apMaster != 0) {
                apStatus1 = "ROL";
                if (jsonData.simData.apHeadingLock != 0) {
                    apStatus1 = "HDG";
                } else if (jsonData.simData.apNavLock != 0) {
                    if (jsonData.simData.gpsDriveNav1) {
                        apStatus1 = "GPS";
                    } else {
                        apStatus1 = "NAV";
                    }
                } else if (jsonData.simData.apApproachHold != 0) {
                    apStatus1 = "APR";
                } else if (jsonData.simData.apRevHold != 0) {
                    apStatus1 = "REV";
                }
                apStatus2 = "PIT";
                if (jsonData.simData.apVerticalHold != 0) {
                    apStatus2 = "VS";
                } else if (jsonData.simData.apAltitudeLock != 0) {
                    apStatus2 = "ALT";
                } else if (jsonData.simData.apGSHold != 0) {
                    apStatus2 = "GS";
                }
            }

            jsonData.simData.apStatus1 = apStatus1;
            jsonData.simData.apStatus2 = apStatus2;

            jsonData.simData.fuelSelector = this.fuelSelectorStates[jsonData.simData.fuelSelector - 1];

            return jsonData;
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
            [-100, 19],
            [-66, 13.5],
            [-5, 0],
            [47, -13.5],
            [93, -27],
            [100, -32.5]
        ],
        magnetoPositions: [-65, -35, 0, 35, 65],        
        fuelSelectorStates: [1, 0, 2],
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
                "fuelLeftQuantity": 8.314525,
                "fuelRightQuantity": 8.314525,
                "engineEGT": 999.73083,
                "engineFuelFlow": 0.28339642,
                "engineOilTemp": 592.5059,
                "engineOilPressure": 40.906788,
                "vac": 4.2493258,
                "batteryAmp": 2.9471688,
                "ias": 0.000015874195,
                "tasAdj": 0,
                "attitudePitch": 1.7488129,
                "attitudeBank": -0.0148600275,
                "attitudeBarPosition": 0,
                "altitude": 994.72656,
                "nav1Obs": 0,
                "nav1ToFrom": 0,
                "nav1GSFlag": 0,
                "nav1CDI": 0,
                "nav1GSI": 0,
                "tcBallPos": -5,
                "tcRate": 0.5249859,
                "heading": 324,
                "headingBug": 0,
                "vsi": -13.162168,
                "nav2Obs": 0,
                "nav2ToFrom": 0,
                "nav2GSFlag": 0,
                "nav2CDI": 0,
                "nav2GSI": 0,
                "engineRPM": 631,
                "adfCard": 0,
                "adfRadial": 90,
                "switchBCN": 1,
                "switchLAND": 1,
                "switchTAXI": 0,
                "switchNAV": 1,
                "switchSTROBE": 1,
                "switchPitotHeat": 0,
                "switchAlternator": 1,
                "switchBatteryMaster": 1,
                "switchAvionics1": 1,
                "switchAvionics2": 1,
                "leftMagnetoState": 1,
                "rightMagnetoState": 1,
                "flapsPosition": 0,
                "switchFuelPump": 0,
                "gyroDriftError": 0,
                "qnh": 16212,
                "engineStarter": 0,
                "electricalBusVoltage": 28,
                "fuelSelector": 1,
                "parkingBrake": 0,
                "fuelValve": 1,
                "atcId": "9H-AHS",
                "com1ActiveFreq": 127850,
                "com1StandbyFreq": 124850,
                "com2ActiveFreq": 124850,
                "com2StandbyFreq": 124850,
                "nav1ActiveFreq": 110500,
                "nav1StandbyFreq": 113900,
                "nav2ActiveFreq": 110500,
                "nav2StandbyFreq": 113900,
                "adfActiveFreq": 890,
                "adfStandbyFreq": 1400,
                "apAltitude": 0,
                "apMaster": 0,
                "apHeadingLock": 0,
                "apNavLock": 0,
                "apAltitudeLock": 0,
                "apVerticalHold": 0,
                "apVerticalHoldSpeed": 0,
                "apApproachHold": 0,
                "apRevHold": 0,
                "apGSHold": 0,
                "dmeDistance": -0.005399568,
                "xpdrSwitch": 4,
                "xpdr": 0,
                "refEGT": 0,
                "generalPanelOn": 1,
                "com1tx": 1,
                "com1rx": 1,
                "com2tx": 0,
                "com2rx": 0,
                "nav1rx": 0,
                "nav2rx": 0,
                "adfrx": 0,
                "gpsDriveNav1": 1,
                "dmeSpeed": -1.9438444,
                "dmeSignal": 0,
                "dmeIsAvailable": 0,
                "dme2Distance": -0.005399568,
                "dme2Speed": -1.9438444,
                "dme2Signal": 0,
                "dme2IsAvailable": 0,
                "pressureAltitude": 994.72656,
                "adfVolume": 100,
                "simulationTime": 173,
                "com1Volume": 100,
                "nav1Volume": 100,
                "com2Volume": 100,
                "nav2Volume": 100,
                "qnh2": 16212,
                "audioPanelVolume": 100,
                "markerTestMute": 0,
                "markerIsHighSensitivity": 0,
                "intercomMode": 2,
                "markerSoundOn": 1,
                "intercomActive": 0,
                "dmeSoundOn": 0,
                "speakerActive": 0,
                "com3tx": 0,
                "pilotTx": 0,
                "copilotTxType": 0,
                "insideMarkerOn": 0,
                "middleMarkerOn": 0,
                "outsideMarkerOn": 0,
                "pilotTxing": 0,
                "copilotTxing": 0,
                "isGearRetractable": 0,
                "gearHandlePosition": 0,
                "engineElapsedTime": 673,
                "hsiCDINeedle": 0,
                "hsiGSINeedle": 0,
                "hsiCDINeedleValid": 0,
                "hsiGSINeedleValid": 0,
                "hsiDistance": -10
            },
            "isPaused": false,
            "isSimRunning": true,
            "isSimConnected": true,
            "aircraftFolder": "Asobo_C172sp_classic"
        }
    };
});