require.config({
    baseUrl : '.',
    paths : {
        'Panel' : "../common/panel",       
    },
    waitSeconds : 30,
});

define(['Panel'],function(Panel) {
    class C172Panel extends Panel {
        constructor(aspectRatio) {
            super(aspectRatio);  
        }
        
        postProcessingFunc(jsonData)
        {
            if (!jsonData.isSimConnected) {
                return;
            }
            jsonData.simData.warningVACLeft = 0;
            jsonData.simData.warningVACRight = 0;
            jsonData.simData.warningVAC = 0;
            jsonData.simData.warningVoltage = 0;
            jsonData.simData.warningOilPressure = 0;
            jsonData.simData.warningFuelLeft = 0;
            jsonData.simData.warningFuelRight = 0;
            jsonData.simData.warningFuel = 0;
            
            if (jsonData.simData.electricalBusVoltage>0) {
                if (jsonData.simData.fuelLeftQuantity<8) {
                    jsonData.simData.warningFuelLeft = 1;
                    jsonData.simData.warningFuel = 1;
                }
                if (jsonData.simData.fuelRightQuantity < 8) {
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

            jsonData.simData.xpdr = jsonData.simData.xpdr.toString(16).padStart(4, '0');
            return jsonData;
        }
    }
    
    return C172Panel;


});
