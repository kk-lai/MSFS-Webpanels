require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.12.4.min',
        "AbstractPanel": "../common/js/abstract-panel"
    },
    waitSeconds: 30,
});

require([
    'jquery', "AbstractPanel"
],
    function (jquery, AbstractPanel) {

    class B38MPanel extends AbstractPanel {
        constructor() {
            super('b38m');
            this.isInitNav = false;
            this.NavMode = {
                "ILS": 0,
                "VOR": 1
            };
            this.NavModeLbl = ["ILS", "VOR"];            
            this.navActFreq = ['110.50', '110.50'];
            this.navStbyFreq = ['110.70', '110.70'];
            this.navInputFreq = ['110.70', '110.70'];
            this.navActNavMode = [this.NavMode.ILS, this.NavMode.ILS];
            this.navStbyNavMode = [this.NavMode.ILS, this.NavMode.ILS];
            this.navCursorLocation = [0, 0];
            this.navEditMode = [false, false];
            this.navInputNavMode = [this.NavMode.ILS, this.NavMode.ILS];

            this.requestDef = {
                "seatbeltsSwitch": { "Cmd": "(B:PASSENGER_FASTEN_BELTS, Number)", "Delta": 0, "Type": "Integer" },
                "noSmokingSwitch": { "Cmd": "(B:PASSENGER_NO_SMOKING, Number)", "Delta": 0, "Type": "Integer" },
                "groundPowerSwitch": { "Cmd": "(B:ELECTRICAL_EXTERNAL_POWER, Number)", "Delta": 0, "Type": "Integer" },
                "gen1Switch": { "Cmd": "(B:ELECTRICAL_GENERATOR_1, Number)", "Delta": 0, "Type": "Integer" },
                "apuGen1Switch": { "Cmd": "(B:ELECTRICAL_APU_GENERATOR_1, Number)", "Delta": 0, "Type": "Integer" },
                "apuGen2Switch": { "Cmd": "(B:ELECTRICAL_APU_GENERATOR_2, Number)", "Delta": 0, "Type": "Integer" },
                "gen2Switch": { "Cmd": "(B:ELECTRICAL_GENERATOR_2, Number)", "Delta": 0, "Type": "Integer" },
                "fuelPumpCtrLeftSwitch": { "Cmd": "(B:FUEL_PUMP_CTR_L)", "Delta": 0, "Type": "Integer" },
                "fuelPumpCtrRightSwitch": { "Cmd": "(B:FUEL_PUMP_CTR_R)", "Delta": 0, "Type": "Integer" },
                "fuelPumpLeftAftSwitch": { "Cmd": "(B:FUEL_PUMP_AFT_1)", "Delta": 0, "Type": "Integer" },
                "fuelPumpLeftFwdSwitch": { "Cmd": "(B:FUEL_PUMP_FWD_1)", "Delta": 0, "Type": "Integer" },
                "fuelPumpRightFwdSwitch": { "Cmd": "(B:FUEL_PUMP_FWD_2)", "Delta": 0, "Type": "Integer" },
                "fuelPumpRightAftSwitch": { "Cmd": "(B:FUEL_PUMP_AFT_2)", "Delta": 0, "Type": "Integer" },
                "apuSwitch": { "Cmd": "(B:ENGINE_APU, Number)", "Delta": 0, "Type": "Integer" },
                "cabutilSwitch": { "Cmd": "(B:ELECTRICAL_CAB_UTIL)", "Delta": 0, "Type": "Integer" },
                "ifeSwitch": { "Cmd": "(B:ELECTRICAL_IFE_PASS)", "Delta": 0, "Type": "Integer" },
                "dcmainSwitch": { "Cmd": "(B:ELECTRICAL_BATTERY)", "Delta": 0, "Type": "Integer" },
                "electBusTransferSwitch": { "Cmd": "(B:ELECTRICAL_BUS_TRANSFER)", "Delta": 0, "Type": "Integer" },
                "crossFeedKnob": { "Cmd": "(B:FUEL_VALVE_CROSSFEED)", "Delta": 0, "Type": "Integer" },
                "engineStartIgnitionSwitch": { "Cmd": "(B:ENGINE_IGNITION_SELECT, NUMBER)", "Delta": 0, "Type": "Integer" },
                "engine1StartKnob": { "Cmd": "(B:ENGINE_IGNITION_1, Number)", "Delta": 0, "Type": "Integer" },
                "engine2StartKnob": { "Cmd": "(B:ENGINE_IGNITION_2, Number)", "Delta": 0, "Type": "Integer" },
                "leverEngineStart1Switch": { "Cmd": "(B:ENGINE_STARTER_1)", "Delta": 0, "Type": "Integer" },
                "leverEngineStart2Switch": { "Cmd": "(B:ENGINE_STARTER_2)", "Delta": 0, "Type": "Integer" },
                "LRecircFanSwitch": { "Cmd": "(B:PNEUMATICS_RECIRC_FAN_1)", "Delta": 0, "Type": "Integer" },
                "RRecircFanSwitch": { "Cmd": "(B:PNEUMATICS_RECIRC_FAN_2)", "Delta": 0, "Type": "Integer" },
                "LPackSwitch": { "Cmd": "(B:PNEUMATICS_L_PACK, Number)", "Delta": 0, "Type": "Integer" },
                "RPackSwitch": { "Cmd": "(B:PNEUMATICS_R_PACK, Number)", "Delta": 0, "Type": "Integer" },
                "isolationValveSwitch": { "Cmd": "(B:PNEUMATICS_ISOLATION_VALVE, Number)", "Delta": 0, "Type": "Integer" },
                "engineBleedAir1Switch": { "Cmd": "(B:PNEUMATICS_ENGINE_BLEED_1)", "Delta": 0, "Type": "Integer" },
                "engineBleedAir2Switch": { "Cmd": "(B:PNEUMATICS_ENGINE_BLEED_2)", "Delta": 0, "Type": "Integer" },
                "apuBleedAirSwitch": { "Cmd": "(B:PNEUMATICS_APU_BLEED)", "Delta": 0, "Type": "Integer" },
                "engine1HydPumpSwitch": { "Cmd": "(B:HYD_ENG_1_PUMP)", "Delta": 0, "Type": "Integer" },
                "engine2HydPumpSwitch": { "Cmd": "(B:HYD_ENG_2_PUMP)", "Delta": 0, "Type": "Integer" },
                "electricHydPump1Switch": { "Cmd": "(B:HYD_ELEC_1_PUMP)", "Delta": 0, "Type": "Integer" },
                "electricHydPump2Switch": { "Cmd": "(B:HYD_ELEC_2_PUMP)", "Delta": 0, "Type": "Integer" },
                "engine1AntiIceSwitch": { "Cmd": "(B:ANTI_ICE_ENG_1)", "Delta": 0, "Type": "Integer" },
                "engine2AntiIceSwitch": { "Cmd": "(B:ANTI_ICE_ENG_2)", "Delta": 0, "Type": "Integer" },
                "wingAntiIceSwitch": { "Cmd": "(B:ANTI_ICE_WING)", "Delta": 0, "Type": "Integer" },
                "windowHeatLSideSwitch": { "Cmd": "(B:WINDOW_HEAT_L_SIDE)", "Delta": 0, "Type": "Integer" },
                "windowHeatLFwdSwitch": { "Cmd": "(B:WINDOW_HEAT_L_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatOverheatTestSwitch": { "Cmd": "(B:WINDOW_HEAT_OVHT_TEST, Number)", "Delta": 0, "Type": "Integer" },
                "windowHeatRFwdSwitch": { "Cmd": "(B:WINDOW_HEAT_R_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatRSideSwitch": { "Cmd": "(B:WINDOW_HEAT_R_SIDE)", "Delta": 0, "Type": "Integer" },
                "probeHeatASwitch": { "Cmd": "(B:PROBE_HEAT_A)", "Delta": 0, "Type": "Integer" },
                "probeHeatBSwitch": { "Cmd": "(B:PROBE_HEAT_B)", "Delta": 0, "Type": "Integer" },
                "voiceRecorderSwitch": { "Cmd": "(B:VOICE_RECORDER)", "Delta": 0, "Type": "Integer" },
                "landingLightLSwitch": { "Cmd": "(B:LIGHTING_LANDING_LIGHT_FIXED_L)", "Delta": 0, "Type": "Integer" },
                "landingLightRSwitch": { "Cmd": "(B:LIGHTING_LANDING_LIGHT_FIXED_R)", "Delta": 0, "Type": "Integer" },
                "runwayTurnoffLightLSwitch": { "Cmd": "(B:LIGHTING_RUNWAY_TURNOFF_LIGHT_L)", "Delta": 0, "Type": "Integer" },
                "runwayTurnoffLightRSwitch": { "Cmd": "(B:LIGHTING_RUNWAY_TURNOFF_LIGHT_R)", "Delta": 0, "Type": "Integer" },
                "taxiLightSwitch": { "Cmd": "(B:LIGHTING_TAXI_LIGHT_GEAR)", "Delta": 0, "Type": "Integer" },
                "emerLightSwitch": { "Cmd": "(B:PASSENGER_EXIT_LIGHTS, Number)", "Delta": 0, "Type": "Integer" },
                "logoLightSwitch": { "Cmd": "(B:LIGHTING_LOGO_LIGHT)", "Delta": 0, "Type": "Integer" },
                "positionLightSwitch": { "Cmd": "(B:LIGHTING_POSITION_LIGHT, Number)", "Delta": 0, "Type": "Integer" },
                "antiCollisionLightSwitch": { "Cmd": "(B:LIGHTING_ANTI_COLLISION_LIGHT)", "Delta": 0, "Type": "Integer" },
                "wingLightSwitch": { "Cmd": "(B:LIGHTING_WING_LIGHT)", "Delta": 0, "Type": "Integer" },
                "taxiLightWheelSwitch": { "Cmd": "(B:LIGHTING_TAXI_LIGHT_WHEEL_WELL)", "Delta": 0, "Type": "Integer" },

                "cabinPressureModeKnob": { "Cmd": "(B:PNEUMATICS_PRESS_SELEC, Number)", "Delta": 0, "Type": "Integer" },
                "cabinPressureValveSwitch": { "Cmd": "(B:PNEUMATICS_VALVE, Number)", "Delta": 0, "Type": "Integer" },
                "lWiperKnob": { "Cmd": "(B:WINDSHIELD_L_WIPER, Number)", "Delta": 0, "Type": "Integer" },
                "rWiperKnob": { "Cmd": "(B:WINDSHIELD_R_WIPER, Number)", "Delta": 0, "Type": "Integer" },
                "yawDamperSwitch": { "Cmd": "(B:FLT_CONTROLS_PANEL_YAW_DAMPER)", "Delta": 0, "Type": "Integer" },
                "irsModeSelector1Switch": { "Cmd": "(B:AFT_OVHD_L_IRS, Number)", "Delta": 0, "Type": "Integer" },
                "irsModeSelector2Switch": { "Cmd": "(B:AFT_OVHD_R_IRS, Number)", "Delta": 0, "Type": "Integer" },
                                
                "flightDirectorSwitch": { "Cmd": "(B:FCC_FD_1, Number)", "Delta": 0, "Type": "Integer" },
                "autoThrottleSwitch": { "Cmd": "(B:FCC_AUTOTHROTTLE, Number)", "Delta": 0, "Type": "Integer" },
                "bankAngleSelectorKnob": { "Cmd": "(B:FCC_BANK_ANGLE_SEL, Enum)", "Delta": 0, "Type": "Integer" },

                "apCmd1Btn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_CMD_1, Enum)", "Delta": 0, "Type": "Integer" },
                "apCmd2Btn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_CMD_2, Enum)", "Delta": 0, "Type": "Integer" },
                "apCws1Btn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_CWS_1, Enum)", "Delta": 0, "Type": "Integer" },
                "apCws2Btn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_CWS_2, Enum)", "Delta": 0, "Type": "Integer" },
                "apVSBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_VS, Enum)", "Delta": 0, "Type": "Integer" },                
                "apAltHldBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_ALT_HLD, Enum)", "Delta": 0, "Type": "Integer" },
                "apAppBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_APP, Enum)", "Delta": 0, "Type": "Integer" },
                "apVORLOCBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_VOR_LOC, Enum)", "Delta": 0, "Type": "Integer" },
                "apLNavBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_LNAV, Enum)", "Delta": 0, "Type": "Integer" },
                "apHdgSelectBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_HDG_SEL, Enum)", "Delta": 0, "Type": "Integer" },
                "apVNavBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_VNAV, Enum)", "Delta": 0, "Type": "Integer" },
                "apLvlChgBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_LVL_CHG, Enum)", "Delta": 0, "Type": "Integer" },
                "apSpeedBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_SPEED, Enum)", "Delta": 0, "Type": "Integer" },
                "apN1Btn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_AP_N1, Enum)", "Delta": 0, "Type": "Integer" },

                "efisMinRefSelectorKnob": { "Cmd": "(B:EFIS_MINS_REF_1, Enum)", "Delta": 0, "Type": "Integer" },
                "efisBaroUnitSelectorKnob": { "Cmd": "(B:EFIS_BARO_UNIT_1, Enum)", "Delta": 0, "Type": "Integer" },
                "efisMFDModeSelectorKnob": { "Cmd": "(B:EFIS_MODE_1, Number)", "Delta": 0, "Type": "Integer" },
                "efisMFDRangeSelectorKnob": { "Cmd": "(B:EFIS_RANGE_1, Number)", "Delta": 0, "Type": "Integer" },

                "fireWarnBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Warning_FIRE_WARN)", "Delta": 0, "Type": "Integer" },
                "masterCautionBtn": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_Master_Caution_1)", "Delta": 0, "Type": "Integer" },
                "vorAdfSelector1Switch": { "Cmd": "(B:EFIS_VOR_ADF_1_1, Number)", "Delta": 0, "Type": "Integer" },
                "vorAdfSelector2Switch": { "Cmd": "(B:EFIS_VOR_ADF_2_1, Number)", "Delta": 0, "Type": "Integer" },
                "fuelFlowSwitch": { "Cmd": "(B:FWD_PDSTL_FUEL_FLOW, Number)", "Delta": 0, "Type": "Integer" },
                "autobrakeKnob": { "Cmd": "(B:FWD_PDSTL_AUTOBRAKE, Number)", "Delta": 0, "Type": "Integer" },

                "xpndrSysSelecKnob": { "Cmd": "(B:XPDR_PANEL_SYS_SELEC, Number)", "Delta": 0, "Type": "Integer" },
                "xpndrAltSrcKnob": { "Cmd": "(B:XPDR_PANEL_ALT_SOURCE, Number)", "Delta": 0, "Type": "Integer" },
                "xpndrModeKnob": { "Cmd": "(B:XPDR_PANEL_XPDR_MODE, Number)", "Delta": 0, "Type": "Integer" },
                "xpndrOperModeKnob": { "Cmd": "(B:XPDR_PANEL_XPDR_OPERATING_MODE, Number)", "Delta": 0, "Type": "Integer" },
                "tcasTrafficSelecSwitch": { "Cmd": "(B:XPDR_PANEL_ORIENTATION, Number)", "Delta": 0, "Type": "Integer" },

                // indicators
                "groundPowerInd": { "Cmd": "(A:EXTERNAL POWER AVAILABLE:1, Bool)", "Delta": 0, "Type": "Integer" },
                "electSourceOff1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ELEC_SOURCE_1_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "electSourceOff2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ELEC_SOURCE_2_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "electBusTransferOff1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ELEC_TRANSFER_BUS_1_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "electBusTransferOff2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ELEC_TRANSFER_BUS_2_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "apuGenOffBusInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_APU_GEN_OFF_BUS_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "gen1OffBusInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_GEN_OFF_BUS_1_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "gen2OffBusInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_GEN_OFF_BUS_2_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelCtrLLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_CTR_L_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelCtrRLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_CTR_R_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelLeftAftLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_MAIN_1_AFT_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelLeftFwdLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_MAIN_1_FWD_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelRightFwdLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_MAIN_2_FWD_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "fuelRightAftLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_LOW_PRESS_MAIN_2_AFT_Active, Bool)", "Delta": 0, "Type": "Integer" },
                "doorInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_APU_DOOR_Active)", "Delta": 0, "Type": "Integer" },
                "lowOilPressureInd": { "Cmd": "(L:1:XMLVAR_APU_LOW_OIL_PRESSURE)", "Delta": 0, "Type": "Integer" },
                "faultInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_APU_FAULT_Active)", "Delta": 0, "Type": "Integer" },
                "overspeedInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_APU_OVERSPEED_Active)", "Delta": 0, "Type": "Integer" },
                "engValveClosed1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_HP_VALVE_CLOSED_1)", "Delta": 0, "Type": "Integer" },
                "engValveClosed2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_HP_VALVE_CLOSED_2)", "Delta": 0, "Type": "Integer" },
                "sparValveClosed1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_SPARE_VALVE_CLOSED_1)", "Delta": 0, "Type": "Integer" },
                "sparValveClosed2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_SPARE_VALVE_CLOSED_2)", "Delta": 0, "Type": "Integer" },
                "filterByPass1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_FILTER_BYPASS_MAIN_1)", "Delta": 0, "Type": "Integer" },
                "filterByPass2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_FILTER_BYPASS_MAIN_1)", "Delta": 0, "Type": "Integer" },
                "valveOpenInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_VALVE_OPEN)", "Delta": 0, "Type": "Integer" },
                "engine1HydPumpLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ENG_1_LOW_PRESSURE_Active)", "Delta": 0, "Type": "Integer" },
                "elect2HydPumpLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ELEC_2_LOW_PRESSURE_Active)", "Delta": 0, "Type": "Integer" },
                "elect1HydPumpLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ELEC_1_LOW_PRESSURE_Active)", "Delta": 0, "Type": "Integer" },
                "engine2HydPumpLowPressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ENG_2_LOW_PRESSURE_Active)", "Delta": 0, "Type": "Integer" },
                "elect2HydPumpOverheatInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ENG_2_OVERHEAT_Active)", "Delta": 0, "Type": "Integer" },
                "elect1HydPumpOverheatInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD_PUMP_ENG_1_OVERHEAT_Active)", "Delta": 0, "Type": "Integer" },
                "pack1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_PACK_L_Active)", "Delta": 0, "Type": "Integer" },
                "pack2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_PACK_R_Active)", "Delta": 0, "Type": "Integer" },
                "wingBodyOverheat1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_WING_BODY_OVERHEAT_L_Active)", "Delta": 0, "Type": "Integer" },
                "wingBodyOverheat2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_WING_BODY_OVERHEAT_R_Active)", "Delta": 0, "Type": "Integer" },
                "bleed1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_BLEED_L_Active)", "Delta": 0, "Type": "Integer" },
                "bleed2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_BLEED_R_Active)", "Delta": 0, "Type": "Integer" },
                "dualBleedInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_DUAL_BLEED_Active)", "Delta": 0, "Type": "Integer" },
                "antiIceEngine1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ENG_1)", "Delta": 0, "Type": "Integer" },
                "antiIceEngine2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ENG_2)", "Delta": 0, "Type": "Integer" },
                "iceDetectorInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_DETECTOR)", "Delta": 0, "Type": "Integer" },
                "antiIceCowl1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_COWL_1)", "Delta": 0, "Type": "Integer" },
                "antiIceCowl2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_COWL_2)", "Delta": 0, "Type": "Integer" },
                "antiIceLValveInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_VALVE_1)", "Delta": 0, "Type": "Integer" },
                "antiIceRValveInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_VALVE_2)", "Delta": 0, "Type": "Integer" },
                "antiIceCowlValve1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_COWL_VALVE_1)", "Delta": 0, "Type": "Integer" },
                "antiIceCowlValve2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_COWL_VALVE_2)", "Delta": 0, "Type": "Integer" },
                "windowHeatOverheat1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_OVERHEAT_L_SIDE)", "Delta": 0, "Type": "Integer" },
                "windowHeatOverheat2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_OVERHEAT_L_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatOverheat3Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_OVERHEAT_R_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatOverheat4Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_OVERHEAT_R_SIDE)", "Delta": 0, "Type": "Integer" },
                "windowHeatOn1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_ANTI_ICE_ON_L_SIDE)", "Delta": 0, "Type": "Integer" },
                "windowHeatOn2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_ANTI_ICE_ON_L_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatOn3Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_ANTI_ICE_ON_R_FWD)", "Delta": 0, "Type": "Integer" },
                "windowHeatOn4Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_ANTI_ICE_ON_R_SIDE)", "Delta": 0, "Type": "Integer" },
                "antiIceCaptPitotInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_PITOT_L)", "Delta": 0, "Type": "Integer" },
                "antiIceFOPitotInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_PITOT_R)", "Delta": 0, "Type": "Integer" },
                "antiIceLElevPitotInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ELEV_PITOT_L)", "Delta": 0, "Type": "Integer" },
                "antiIceRElevPitotInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ELEV_PITOT_R)", "Delta": 0, "Type": "Integer" },
                "antiIceLAlphaVaneInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ALPHA_VANE_L)", "Delta": 0, "Type": "Integer" },
                "antiIceRAlphaVaneInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_ALPHA_VANE_R)", "Delta": 0, "Type": "Integer" },
                "antiIceTempProbeInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_TEMP_PROBE)", "Delta": 0, "Type": "Integer" },
                "antiIceAuxPitotInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE_AUX_PITOT)", "Delta": 0, "Type": "Integer" },
                "emerExitLightInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_EMER_EXIT_LIGHTS_NOT_ARMED)", "Delta": 0, "Type": "Integer" },

                "pressureManualInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_PRESS_MANUAL)", "Delta": 0, "Type": "Integer" },
                "pressureAltInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_PRESS_ALTERNATE)", "Delta": 0, "Type": "Integer" },
                "offScheduleDescentInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_OFF_SCHED_DESCENT)", "Delta": 0, "Type": "Integer" },
                "autoFailInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_AUTO_FAIL)", "Delta": 0, "Type": "Integer" },
                "yawDamperInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_YAW_DAMPER)", "Delta": 0, "Type": "Integer" },

                "irsFault1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_FAULT_1)", "Delta": 0, "Type": "Integer" },
                "irsFault2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_FAULT_2)", "Delta": 0, "Type": "Integer" },
                "irsDCFail1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_DC_FAIL_1)", "Delta": 0, "Type": "Integer" },
                "irsDCFail2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_DC_FAIL_2)", "Delta": 0, "Type": "Integer" },
                "irsOnDC1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_ON_DC_1)", "Delta": 0, "Type": "Integer" },
                "irsOnDC2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_ON_DC_2)", "Delta": 0, "Type": "Integer" },
                "irsAlign1Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_IRS_ALIGN_1)", "Delta": 0, "Type": "Integer" },
                "irsAlign2Ind": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_IRS_ALIGN_2)", "Delta": 0, "Type": "Integer" },
                "irsGPSInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_GPS)", "Delta": 0, "Type": "Integer" },
                "irsILSInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_ILS)", "Delta": 0, "Type": "Integer" },
                "irsGLSInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS_GLS)", "Delta": 0, "Type": "Integer" },
                
                "machInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Info_FCC_FD_A_master, Number)", "Delta": 0, "Type": "Integer" },
                "asIsInMachInd": { "Cmd": "(L:1:XMLVAR_AirSpeedIsInMach, Number)", "Delta": 0, "Type": "Integer" },

                "cautionFltContInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_FLT_CONTROL)", "Delta": 0, "Type": "Integer" },
                "cautionIrsInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_IRS)", "Delta": 0, "Type": "Integer" },
                "cautionFuelInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_FUEL)", "Delta": 0, "Type": "Integer" },
                "cautionElecInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ELEC)", "Delta": 0, "Type": "Integer" },
                "cautionApuInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_APU)", "Delta": 0, "Type": "Integer" },
                "cautionOvhtDetInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_OVHT_DET)", "Delta": 0, "Type": "Integer" },

                "cautionAntiIceInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_ICE)", "Delta": 0, "Type": "Integer" },
                "cautionHydInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_HYD)", "Delta": 0, "Type": "Integer" },
                "cautionDoorsInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_DOORS)", "Delta": 0, "Type": "Integer" },
                "cautionEngInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ENG)", "Delta": 0, "Type": "Integer" },
                "cautionOverheadInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_OVERHEAD)", "Delta": 0, "Type": "Integer" },
                "cautionAirCondInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_AIR_COND)", "Delta": 0, "Type": "Integer" },

                "tirePressureInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_TIRE_PRESSURE)", "Delta": 0, "Type": "Integer" },
                "brakeTempInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_BRAKE_TEMP)", "Delta": 0, "Type": "Integer" },
                "antiSkidInopInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_ANTI_SKID_INOP)", "Delta": 0, "Type": "Integer" },
                "autobrakeDisarmInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_AUTO_BRAKE_DISARM)", "Delta": 0, "Type": "Integer" },

                "xpndrFailInd": { "Cmd": "(L:1:XMLVAR_INDICATOR_Caution_XPDR_FAIL)", "Delta": 0, "Type": "Integer" },

                // label
                "fuelTempLbl": { "Cmd": "(L:1:XMLVAR_FUEL_TEMPERATURE, celsius)", "Delta": 0, "Type": "Double" },
                "flightAltitudeKnob": { "Cmd": "(L:1:XMLVAR_PRESSURIZATION_ALTITUDE_FLIGHT, Number)", "Delta": 0, "Type": "Double" },
                "landingAltitudeKnob": { "Cmd": "(L:1:XMLVAR_PRESSURIZATION_ALTITUDE_LANDING, Number)", "Delta": 0, "Type": "Double" },
                
                "courseSelector1Knob": { "Cmd": "(A:NAV OBS:1, degrees)", "Delta": 0, "Type": "Integer" },
                "headingSelectorKnob": { "Cmd": "(A:AUTOPILOT HEADING LOCK DIR, degrees)", "Delta": 0, "Type": "Integer" },
                "altitudeSelectorKnob": { "Cmd": "(A:AUTOPILOT ALTITUDE LOCK VAR:3, feet)", "Delta": 0, "Type": "Integer" },
                "verticalSpeedKnob": { "Cmd": "(A:AUTOPILOT VERTICAL HOLD VAR:1, feet per minute)", "Delta": 0, "Type": "Double" },

                "xpndrCode1Lbl": { "Cmd": "(A:TRANSPONDER CODE:1, Number)", "Delta": 0, "Type": "Integer" },
                "xpndrCode2Lbl": { "Cmd": "(A:TRANSPONDER CODE:2, Number)", "Delta": 0, "Type": "Integer" },

                "nav1ActFreqLbl": { "Cmd": "(A:NAV ACTIVE FREQUENCY:1, MHz)", "Delta": 0, "Type": "Double" },
                "nav2ActFreqLbl": { "Cmd": "(A:NAV ACTIVE FREQUENCY:2, MHz)", "Delta": 0, "Type": "Double" },
                "nav1StbyFreqLbl": { "Cmd": "(A:NAV STANDBY FREQUENCY:1, MHz)", "Delta": 0, "Type": "Double" },
                "nav2StbyFreqLbl": { "Cmd": "(A:NAV STANDBY FREQUENCY:2, MHz)", "Delta": 0, "Type": "Double" },

                // others
                "iasSelectorLbl": { "Cmd": "(A:AUTOPILOT AIRSPEED HOLD VAR:1, knots)", "Delta": 0, "Type": "Integer" },
                "machSelectorLbl": { "Cmd": "(A:AUTOPILOT MACH HOLD VAR:1, mach)", "Delta": 0, "Type": "Double" },
                "isVSActiveLbl": { "Cmd": "(A:AUTOPILOT VERTICAL HOLD, Bool)", "Delta": 0, "Type": "Integer" },

                "isSpeedManuallySet": { "Cmd": "(L:XMLVAR_SpeedIsManuallySet, Bool)", "Delta": 0, "Type": "Integer" },

                "decisionHeightLbl": { "Cmd": "(A:DECISION HEIGHT, Feet)", "Delta": 0, "Type": "Integer" },
                "decisionAltitudeLbl": { "Cmd": "(A:DECISION ALTITUDE MSL, Feet)", "Delta": 0, "Type": "Integer" },

                "baroInHgLbl": { "Cmd": "(A:KOHLSMAN SETTING HG:1, inHg)", "Delta": 0, "Type": "Double" },
                "baroMbLbl": { "Cmd": "(A:KOHLSMAN SETTING MB:1, Millibars)", "Delta": 0, "Type": "Integer" },

                "baroPreselectLbl": { "Cmd": "(L:XMLVAR_Baro1_SavedPressure, Number)", "Delta": 0, "Type": "Integer" },
                "baroIsStd": { "Cmd": "(L:XMLVAR_Baro1_ForcedToSTD, Bool)", "Delta": 0, "Type": "Integer" }

            }
            this.cmdDef = {
                "noSmokingSwitch": "? (>B:PASSENGER_NO_SMOKING_Set, Number)",
                "seatbeltsSwitch": "? (>B:PASSENGER_FASTEN_BELTS_Set, Number)",
                "groundPowerSwitch": "? (>B:ELECTRICAL_EXTERNAL_POWER_Set, Number)",
                "gen1Switch": "? (>B:ELECTRICAL_GENERATOR_1_Set, Number)",
                "apuGen1Switch": "? (>B:ELECTRICAL_APU_GENERATOR_1_Set, Number)",
                "apuGen2Switch": "? (>B:ELECTRICAL_APU_GENERATOR_2_Set, Number)",
                "gen2Switch": "? (>B:ELECTRICAL_GENERATOR_2_Set, Number)",
                "fuelPumpCtrLeftSwitch": "? (>B:FUEL_PUMP_CTR_L_Set, Bool)",
                "fuelPumpCtrRightSwitch": "? (>B:FUEL_PUMP_CTR_R_Set, Bool)",
                "fuelPumpLeftAftSwitch": "? (>B:FUEL_PUMP_AFT_1_Set, Bool)",
                "fuelPumpLeftFwdSwitch": "? (>B:FUEL_PUMP_FWD_1_Set, Bool)",
                "fuelPumpRightFwdSwitch": "? (>B:FUEL_PUMP_FWD_2_Set, Bool)",
                "fuelPumpRightAftSwitch": "? (>B:FUEL_PUMP_AFT_2_Set, Bool)",
                "apuSwitch": "? (>B:ENGINE_APU_Set, Number)",
                "cabutilSwitch": "? (>B:ELECTRICAL_CAB_UTIL_Set, Bool)",
                "ifeSwitch": "? (>B:ELECTRICAL_IFE_PASS_Set, Bool)",
                "dcmainSwitch": "? (>B:ELECTRICAL_BATTERY_Set, Bool)",
                "electBusTransferSwitch": "? (>B:ELECTRICAL_BUS_TRANSFER_Set, Bool)",
                "crossFeedKnob": "? (>B:FUEL_VALVE_CROSSFEED_Set, Bool)",
                "engineStartIgnitionSwitch": "? (>B:ENGINE_IGNITION_SELECT_Set, Bool)",
                "engine1StartKnob": "? (>B:ENGINE_IGNITION_1_Set, Bool)",
                "engine2StartKnob": "? (>B:ENGINE_IGNITION_2_Set, Bool)",
                "leverEngineStart1Switch": "? (>B:ENGINE_STARTER_1_Set, Bool)",
                "leverEngineStart2Switch": "? (>B:ENGINE_STARTER_2_Set, Bool)",

                "LRecircFanSwitch": "? (>B:PNEUMATICS_RECIRC_FAN_1_Set, Bool)",
                "RRecircFanSwitch": "? (>B:PNEUMATICS_RECIRC_FAN_2_Set, Bool)",
                "isolationValveSwitch": "? (>B:PNEUMATICS_ISOLATION_VALVE_Set, Number)",
                "LPackSwitch": "? (>B:PNEUMATICS_L_PACK_Set, Number)",
                "RPackSwitch": "? (>B:PNEUMATICS_R_PACK_Set, Number)",
                "engineBleedAir1Switch": "? (>B:PNEUMATICS_ENGINE_BLEED_1_Set, Bool)",
                "engineBleedAir2Switch": "? (>B:PNEUMATICS_ENGINE_BLEED_2_Set, Bool)",
                "apuBleedAirSwitch": "? (>B:PNEUMATICS_APU_BLEED_Set, Bool)",
                "engine1HydPumpSwitch": "? (>B:HYD_ENG_1_PUMP_Set, Bool)",
                "engine2HydPumpSwitch": "? (>B:HYD_ENG_2_PUMP_Set, Bool)",
                "electricHydPump1Switch": "? (>B:HYD_ELEC_1_PUMP_Set, Bool)",
                "electricHydPump2Switch": "? (>B:HYD_ELEC_2_PUMP_Set, Bool)",

                "engine1AntiIceSwitch": "? (>B:ANTI_ICE_ENG_1_Set, Bool)",
                "engine2AntiIceSwitch": "? (>B:ANTI_ICE_ENG_2_Set, Bool)",
                "wingAntiIceSwitch": "? (>B:ANTI_ICE_WING_Set, Bool)",

                "windowHeatLSideSwitch": "? (>B:WINDOW_HEAT_L_SIDE_Set, Bool)",
                "windowHeatLFwdSwitch": "? (>B:WINDOW_HEAT_L_FWD_Set, Bool)",
                "windowHeatOverheatTestSwitch": "? (>B:WINDOW_HEAT_OVHT_TEST_Set, Number)",
                "windowHeatRFwdSwitch": "? (>B:WINDOW_HEAT_R_FWD_Set, Bool)",
                "windowHeatRSideSwitch": "? (>B:WINDOW_HEAT_R_SIDE_Set, Bool)",
                "probeHeatASwitch": "? (>B:PROBE_HEAT_A_Set, Bool)",
                "probeHeatBSwitch": "? (>B:PROBE_HEAT_B_Set, Bool)",
                "voiceRecorderSwitch": "? (>B:VOICE_RECORDER_Set, Bool)",

                "landingLightLSwitch": "? (>B:LIGHTING_LANDING_LIGHT_FIXED_L_Set, Bool)",
                "landingLightRSwitch": "? (>B:LIGHTING_LANDING_LIGHT_FIXED_R_Set, Bool)",
                "runwayTurnoffLightLSwitch": "? (>B:LIGHTING_RUNWAY_TURNOFF_LIGHT_L_Set, Bool)",
                "runwayTurnoffLightRSwitch": "? (>B:LIGHTING_RUNWAY_TURNOFF_LIGHT_R_Set, Bool)",
                "taxiLightSwitch": "? (>B:LIGHTING_TAXI_LIGHT_GEAR_Set, Bool)",
                "emerLightSwitch": "? (>B:PASSENGER_EXIT_LIGHTS_Set, Number)",
                "logoLightSwitch": "? (>B:LIGHTING_LOGO_LIGHT_Set, Bool)",
                "positionLightSwitch": "? (>B:LIGHTING_POSITION_LIGHT_Set, Number)",
                "antiCollisionLightSwitch": "? (>B:LIGHTING_ANTI_COLLISION_LIGHT_Set, Bool)",
                "wingLightSwitch": "? (>B:LIGHTING_WING_LIGHT_Set, Bool)",
                "taxiLightWheelSwitch": "? (>B:LIGHTING_TAXI_LIGHT_WHEEL_WELL_Set, Bool)",

                "cabinPressureModeKnob": "? (>B:PNEUMATICS_PRESS_SELEC_Set, Number)",
                "cabinPressureValveSwitch": "? (>B:PNEUMATICS_VALVE_Set, Number)",
                "lWiperKnob": "? (>B:WINDSHIELD_L_WIPER_Set, Number)",
                "rWiperKnob": "? (>B:WINDSHIELD_R_WIPER_Set, Number)",
                "yawDamperSwitch": "? (>B:FLT_CONTROLS_PANEL_YAW_DAMPER_Set, Bool)",
                "irsModeSelector1Switch": "? (>B:AFT_OVHD_L_IRS_Set, Number)",
                "irsModeSelector2Switch": "? (>B:AFT_OVHD_R_IRS_Set, Number)",

                "flightAltitudeKnob": "? (>L:1:XMLVAR_PRESSURIZATION_ALTITUDE_FLIGHT, Number)",
                "landingAltitudeKnob": "? (>L:1:XMLVAR_PRESSURIZATION_ALTITUDE_LANDING, Number)",

                "courseSelector1Knob": "? (>B:FCC_COURSE_1_Set, degrees)",
                "iasMachSelectorKnob": "? (>B:FCC_SPEED_SEL_Set, Number)",
                "headingSelectorKnob": "? (>B:FCC_HEADING_SEL_Set, degrees)",
                "altitudeSelectorKnob": "? (>B:FCC_ALTITUDE_SEL_Set, Number)",
                "vertialSpeedKnob": "? (>B:FCC_VERTICAL_SPEED_SEL_Set, Number)",
                "flightDirectorSwitch": "? (>B:FCC_FD_1_Set, Bool)",
                "autoThrottleSwitch": "? (>B:FCC_AUTOTHROTTLE_Set, Bool)",
                "apCmd1Btn": "? (>B:FCC_CMD_1_Set, Bool)",
                "apCmd2Btn": "? (>B:FCC_CMD_2_Set, Bool)",
                "apCws1Btn": "? (>B:FCC_CWS_1_Set, Bool)",
                "apCws2Btn": "? (>B:FCC_CWS_2_Set, Bool)",
                "apVSBtn": "? (>B:FCC_VS_Set, Bool)",
                "apAltHldBtn": "? (>B:FCC_ALT_HLD_Set, Bool)",
                "apAppBtn": "? (>B:FCC_APP_Set, Bool)",
                "apVORLOCBtn": "? (>B:FCC_VOR_LOC_Set, Bool)",
                "apLNavBtn": "? (>B:FCC_LNAV_Set, Bool)",
                "apHdgSelectBtn": "? (>B:FCC_HDG_SEL_Set, Bool)",
                "apVNavBtn": "? (>B:FCC_VNAV_Set, Bool)",
                "apLvlChgBtn": "? (>B:FCC_LVL_CHG_Set, Bool)",
                "apSpeedBtn": "? (>B:FCC_SPEED_Set, Bool)",
                "apN1Btn": "? (>B:FCC_N1_Set, Bool)",
                "bankAngleSelectorKnob": "? (>B:FCC_BANK_ANGLE_SEL_Set, Number)",
                "verticalSpeedKnob": "? (B:FCC_VERTICAL_SPEED_SEL_Set, Number)",

                "spdChangeOverBtn": "? (>B:FCC_CHANGEOVER_Set, Bool)",
                "spdIntvBtn": "? (>B:FCC_SPEED_INTERVENTION_Set, Bool)",
                "altIntvBtn": "? (>B:FCC_ALTITUDE_INTERVENTION_Set, Bool)",

                "efisMinRefSelectorKnob": "? (>B:EFIS_MINS_REF_1_Set, Number)",
                "efisBaroUnitSelectorKnob": "? (>B:EFIS_BARO_UNIT_1_Set, Number)",
                "efisMFDModeSelectorKnob": "? (>B:EFIS_MODE_1_Set, Number)",
                "efisMFDRangeSelectorKnob": "? (>B:EFIS_RANGE_1_Set, Number)",

                "efisWXRBtn": "? (>B:EFIS_WXR_1_TOGGLE, Bool)",
                "efisSTABtn": "? (>B:EFIS_STA_1_TOGGLE, Bool)",
                "efisWPTBtn": "? (>B:EFIS_WPT_1_TOGGLE, Bool)",
                "efisArptBtn": "? (>B:EFIS_ARPT_1_TOGGLE, Bool)",
                "efisDATABtn": "? (>B:EFIS_DATA_1_TOGGLE, Bool)",
                "efisPOSBtn": "? (>B:EFIS_POS_1_TOGGLE, Bool)",
                "efisTerrBtn": "? (>B:EFIS_TERR_1_TOGGLE, Bool)",


                "efisModeCenterBtn": "? (>B:EFIS_CTR_1_TOGGLE, Bool)",
                "efisRangeTFCBtn": "? (>B:EFIS_TFC_1_TOGGLE, Bool)",
                "efisMinRstBtn": "? (>B:EFIS_RST_1_TOGGLE, Bool)",
                "efisBaroStdBtn": "? (>B:EFIS_BARO_STD_1_TOGGLE, Bool)",

                "efisFPVBtn": "? (>B:EFIS_FPV_1_TOGGLE, Bool)",
                "efisMTRSbtn": "? (>B:EFIS_MTRS_1_TOGGLE, Bool)",
                "efisVSDBtn": "? (>B:EFIS_VSD_1_TOGGLE, Bool)",

                "decisionHeightLbl": "? (>K:SET_DECISION_HEIGHT, Number)",
                "decisionAltitudeLbl": "? (>K:SET_DECISION_ALTITUDE_MSL, Number)",

                "baroMbLbl": "1 ? (>K:KOHLSMAN_SET, Number)",
                "baroPreselectLbl": "? (>L:XMLVAR_Baro1_SavedPressure, Number)",                   

                "minimumChangedEvent": "1 (>H:AS05B_PFD_._EFIS_MINS_INC)",

                "recallCaptCautionBtn": "1 (>B:ANNUNCIATION_RECALL_1_PUSH, Number)",
                "recallFOCautionBtn": "1 (>B:ANNUNCIATION_RECALL_2_PUSH, Number)",
                "fireWarnBtn": "1 (>B:ANNUNCIATION_FIRE_WARN_1_PUSH, Number)",                
                "masterCautionBtn": "1 (>B:ANNUNCIATION_MASTER_CAUTION_1_PUSH, Number)",
                "vorAdfSelector1Switch": "? (>B:EFIS_VOR_ADF_1_1_Set, Number)",
                "vorAdfSelector2Switch": "? (>B:EFIS_VOR_ADF_2_1_Set, Number)",
                "clockBtn": "1 (>B:BEHIND_YOKE_CLOCK_1_TOGGLE)",

                "fuelFlowSwitch": "? (>B:FWD_PDSTL_FUEL_FLOW_Set, Number)",
                "autobrakeKnob": "? (>B:FWD_PDSTL_AUTOBRAKE_Set, Number)",
                "mfdEngBtn": "1 (>B:FWD_PDSTL_ENG_PUSH)",
                "mfdInfoBtn": "1 (>B:FWD_PDSTL_INFO_PUSH)",
                "mfdSysBtn": "1 (>B:FWD_PDSTL_SYS_PUSH)",
                "mfdCRBtn": "1 (>B:FWD_PDSTL_CR_PUSH)",
                "mfdEngTfrBtn": "1 (>B:FWD_PDSTL_TRANSFER_PUSH)",

                "xpndrNum1Btn": "1 (>B:XPDR_PANEL_XPDR_1_PUSH)",
                "xpndrNum2Btn": "1 (>B:XPDR_PANEL_XPDR_2_PUSH)",
                "xpndrNum3Btn": "1 (>B:XPDR_PANEL_XPDR_3_PUSH)",
                "xpndrNum4Btn": "1 (>B:XPDR_PANEL_XPDR_4_PUSH)",
                "xpndrNum5Btn": "1 (>B:XPDR_PANEL_XPDR_5_PUSH)",
                "xpndrNum6Btn": "1 (>B:XPDR_PANEL_XPDR_6_PUSH)",
                "xpndrNum7Btn": "1 (>B:XPDR_PANEL_XPDR_7_PUSH)",
                "xpndrNum0Btn": "1 (>B:XPDR_PANEL_XPDR_0_PUSH)",
                "xpndrNumClrBtn": "1 (>B:XPDR_PANEL_XPDR_CLR_PUSH)",
                "xpndrIdentBtn": "1 (>B:XPDR_PANEL_XPDR_IDENT_PUSH)",

                "xpndrSysSelecKnob": "? (>B:XPDR_PANEL_SYS_SELEC_Set, Number)",
                "xpndrAltSrcKnob": "? (>B:XPDR_PANEL_ALT_SOURCE_Set, Number)",
                "xpndrModeKnob": "? (>B:XPDR_PANEL_XPDR_MODE_Set, Number)",
                "xpndrOperModeKnob": "? (>B:XPDR_PANEL_XPDR_OPERATING_MODE_Set, Number)",
                "tcasTrafficSelecSwitch": "? (>B:XPDR_PANEL_ORIENTATION_Set, Number)",

                "nav1SwapBtn": "1 (>K:NAV1_RADIO_SWAP)",
                "nav2SwapBtn": "1 (>K:NAV2_RADIO_SWAP)",
                "nav1TestBtn": "1 (>B:NAV_PANEL_NAV_TEST_1_PUSH)",
                "nav2TestBtn": "1 (>B:NAV_PANEL_NAV_TEST_2_PUSH)",
                "nav1StbyFreqLbl": "? (>K:NAV1_STBY_SET, Number)",
                "nav2StbyFreqLbl": "? (>K:NAV2_STBY_SET, Number)",

                "atcOption1Btn": "1 (>K:ATC_MENU_1, Number)",
                "atcOption2Btn": "1 (>K:ATC_MENU_2, Number)",
                "atcOption3Btn": "1 (>K:ATC_MENU_3, Number)",
                "atcOption4Btn": "1 (>K:ATC_MENU_4, Number)",
                "atcOption5Btn": "1 (>K:ATC_MENU_5, Number)",
                "atcOption6Btn": "1 (>K:ATC_MENU_6, Number)",
                "atcOption7Btn": "1 (>K:ATC_MENU_7, Number)",
                "atcOption8Btn": "1 (>K:ATC_MENU_8, Number)",
                "atcOption9Btn": "1 (>K:ATC_MENU_9, Number)",
                "atcOption0Btn": "1 (>K:ATC_MENU_0, Number)",
                
                "camera1Btn": "1 (>K:VIEW_CAMERA_SELECT_1, Number)",
                "camera2Btn": "1 (>K:VIEW_CAMERA_SELECT_2, Number)",
                "camera3Btn": "1 (>K:VIEW_CAMERA_SELECT_3, Number)",
                "camera4Btn": "1 (>K:VIEW_CAMERA_SELECT_4, Number)",
                "camera5Btn": "1 (>K:VIEW_CAMERA_SELECT_5, Number)",
                "camera6Btn": "1 (>K:VIEW_CAMERA_SELECT_6, Number)",
                "camera7Btn": "1 (>K:VIEW_CAMERA_SELECT_7, Number)",
                "camera8Btn": "1 (>K:VIEW_CAMERA_SELECT_8, Number)",
                "camera9Btn": "1 (>K:VIEW_CAMERA_SELECT_9, Number)",
                "camera0Btn": "1 (>K:VIEW_CAMERA_SELECT_0, Number)"

                
            }
        } // constructor


        updatePanel(self, json) { 
            if (json.asIsInMachInd) {
                json.iasMachSelectorKnob = json.machSelectorLbl;
            } else {
                json.iasMachSelectorKnob = json.iasSelectorLbl;
            }
            if (json.efisMinRefSelectorKnob) {
                json.efisMinSelectorKnob = json.decisionAltitudeLbl;
            } else {
                json.efisMinSelectorKnob = json.decisionHeightLbl;                
            }
            if (json.baroIsStd) {
                var baro = Math.round(json.baroPreselectLbl / 16);
                if (!json.efisBaroUnitSelectorKnob) {
                    baro = baro / 33.8639;
                }
                json.efisBaroPressureSelectorKnob = baro;
            } else {
                if (json.efisBaroUnitSelectorKnob) {
                    // hpa
                    json.efisBaroPressureSelectorKnob = json.baroMbLbl;
                } else {
                    // inhg
                    json.efisBaroPressureSelectorKnob = json.baroInHgLbl;
                }
            }

            self.setNavLbl(1, json);
            self.setNavLbl(2, json);

            var xpndrSrc = json.xpndrSysSelecKnob + 1;
            var k = "xpndrCode" + xpndrSrc + "Lbl";
           
            var xpndrCode = json[k];
            json.xpndrCodeLbl = xpndrCode;
            this.simData = json;
            super.updatePanel(self, json);
        }

        updateUI(self, ui, value, skipHot = true) {
            if (ui == "headingSelectorKnob" && value == 0) {
                value = 360;
            } else if (ui == "iasMachSelectorKnob") {
                if (self.simData.isSpeedManuallySet) {
                    if (self.simData.asIsInMachInd) {
                        value = "." + Math.round(value * 1000);
                    }
                } else {
                    value = "";
                }
            } else if (ui == "xpndrCodeLbl") {
                value = value.toString().padStart(4, "0");
            }
            super.updateUI(self, ui, value, skipHot);
        }

        onKnobRotate(self, ctl, dir) {
            var ui = jquery(ctl).attr("ctl");
            if (ui == "iasMachSelectorKnob") {
                if (!self.simData.isSpeedManuallySet) {
                    return;
                }
                var min = 100;
                var max = 340;
                var step = 1;
                if (self.simData.asIsInMachInd) {
                    min = 0.60;
                    max = 0.82;
                    step = 0.010;
                }
                jquery(ctl).attr("min", min);
                jquery(ctl).attr("max", max);
                jquery(ctl).attr("step", step);
            } else if (ui == "efisBaroPressureSelectorKnob") {
                var min = 955;
                var max = 1060;
                var step = 1;

                if (!self.simData.efisBaroUnitSelectorKnob) {
                    min = 28.20;
                    max = 31.30;
                    step = 0.01;
                }
                jquery(ctl).attr("min", min);
                jquery(ctl).attr("max", max);
                jquery(ctl).attr("step", step);
            } else if (ui == "verticalSpeedKnob") {
                if (!self.simData.isVSActiveLbl) {
                    return;
                }
            }
            super.onKnobRotate(self, ctl, dir);
        }

        sendCommand(self, ui, val, removeDuplicate = false) {
            if (ui == "iasMachSelectorKnob") {
                if (self.simData.asIsInMachInd) {
                    val = (val * 100).toFixed(0);
                }
            } else if (ui == "efisMinSelectorKnob") {
                if (self.simData.efisMinRefSelectorKnob) {
                    // radio altitude
                    ui = "decisionAltitudeLbl";
                } else {
                    // baro
                    ui = "decisionHeightLbl";
                }
                if (self.simData[ui] == 0) {
                    super.sendCommand(self, "minimumChangedEvent", 1, false);
                }
            } else if (ui == "efisBaroPressureSelectorKnob") {
                if (!self.simData.efisBaroUnitSelectorKnob) {
                    val = val * 33.8639;
                }
                if (self.simData.baroIsStd) {
                    ui = "baroPreselectLbl";
                } else {
                    ui = "baroMbLbl";
                }
                val = Math.round(val * 16);
            }
            super.sendCommand(self, ui, val, removeDuplicate);
        }

        preUpdateUI(self, ui, item, value) {
            var svalue = value;
            if (ui == "verticalSpeedKnob") {
                svalue = "";
                if (self.simData.isVSActiveLbl) {
                    var prefix = (value >= 0) ? "+" : "-";
                    if (value < 0.05) {
                        svalue = "0000";
                    } else {
                        svalue = prefix+Math.abs(value).toFixed(0).padStart(4);
                    }
                }
            }
            return svalue;
        }

        onInternalButtonTapped(self, ui, ev) {
            if (ui.startsWith("nav") && ui.endsWith("Btn")) {
                var key = ui.substring(4, ui.length - 3);
                var idx = parseInt(ui.charAt(3));

                self.onNavKeyPressed(idx, key);
            }
            super.onInternalButtonTapped(self, ui, ev);
        }

        getNavMode(freq) {
            var sfreq = freq.toFixed(2);
            var digit4 = parseInt(sfreq.charAt(4));
            if (freq >= 108.1 && freq <= 111.95 && (digit4 % 2 === 1)) {
                return this.NavMode.ILS;
            } else if (freq >= 108.0 && freq <= 117.95) {
                return this.NavMode.VOR;
            } 
        }

        setNavLbl(idx, json) {
            var ni = idx - 1;
            var kNavActFreq = "nav" + idx + "ActFreqLbl";
            var kNavActFreqMode = "nav" + idx + "ActFreqModeLbl";
            var kNavStbyFreq = "nav" + idx + "StbyFreqLbl";
            var kNavStbyFreqMode = "nav" + idx +"StbyFreqModeLbl"
            var navActFreq = json[kNavActFreq];
            var navStbyFreq = json[kNavStbyFreq];

            if (navStbyFreq == 0) {
                navStbyFreq = 110.70;
            }

            this.navActNavMode[ni] = this.getNavMode(navActFreq);
            json[kNavActFreqMode] = this.NavModeLbl[this.navActNavMode[ni]];
            json[kNavActFreq] = navActFreq.toFixed(2);

            if (this.navEditMode[ni]) {
                json[kNavStbyFreqMode] = this.NavModeLbl[this.navInputNavMode[ni]];
                json[kNavStbyFreq] = this.navInputFreq[ni];
            } else {
                this.navStbyNavMode[ni] = this.getNavMode(navStbyFreq);
                json[kNavStbyFreqMode] = this.NavModeLbl[this.navStbyNavMode[ni]];
                json[kNavStbyFreq] = navStbyFreq.toFixed(2);
                this.navInputFreq[ni] = json[kNavStbyFreq];
                this.navInputNavMode[ni] = this.navStbyNavMode[ni];
            }            
        }

        onNavKeyPressed(idx, key) {
            var ni = idx - 1;

            if (key == "Clr") {
                this.navCursorLocation[ni] = 0;
                this.navEditMode[ni] = false;
            } else if (key == "Swap") {
                if (!this.navEditMode[ni]) {
                    this.sendCommand(this, "nav"+idx+"SwapBtn", 1, false);
                }
            } else if (key == "ModeDec") {
                if (this.navInputNavMode[ni] > 0) {
                    this.navInputNavMode[ni]--;
                    this.navEditMode[ni] = true;
                    if (this.navCursorLocation[ni] == 0) {
                        this.navCursorLocation[ni] = 6;
                    }                    
                }
            } else if (key == "ModeInc") {
                if (this.navInputNavMode[ni] < this.NavModeLbl.length) {
                    this.navInputNavMode[ni]++;
                    this.navEditMode[ni] = true;
                    if (this.navCursorLocation[ni] == 0) {
                        this.navCursorLocation[ni] = 6;
                    }
                }
            } else {
                // num keys
                var num = parseInt(key.replace("Num", ""));
                var cursor = this.navCursorLocation[ni];
                if (cursor == 6) {
                    cursor = 0;
                }
                var digits = this.navInputFreq[ni].split("");
                digits[cursor] = num.toString();
                cursor++;
                if (cursor == 3) {
                    cursor++;
                }
                this.navCursorLocation[ni] = cursor;
                for (var ci = cursor; ci < 6; ci++) {
                    if (ci == 3) {
                        '.';
                    } else {
                        digits[ci] = '_';
                    }                    
                }
                this.navInputFreq[ni] = digits.join("");
                this.navEditMode[ni] = true
            }
            if (this.navEditMode[ni] && this.navCursorLocation[ni] == 6) {
                var sfreq = this.navInputFreq[ni];
                var digits = sfreq.split("");
                var navMode = this.navInputNavMode[ni];
                var ffreq = parseFloat(sfreq);
                var maxFreq = (navMode == this.NavMode.ILS) ? 112.0 : 118.0;
                

                if (ffreq >= 108.0 && ffreq < maxFreq) {
                    if (digits[5] == "0" || digits[5] == "5") {
                        if ((ffreq >= 112 && navMode == this.NavMode.VOR) ||
                            (ffreq < 112 && navMode == this.NavMode.ILS && (parseInt(digits[4]) % 2) == 1) ||
                            (ffreq < 112 && navMode == this.NavMode.VOR && (parseInt(digits[4]) % 2) == 0)) 
                         { 
                            // valid freq
                            var value = 0;
                            for (var i = 0; i < 6; i++) {
                                if (i == 3) {
                                    i++;
                                }
                                value = value * 16;
                                value = value + parseInt(digits[i]);
                            }
                            this.sendCommand(this, "nav" + idx + "StbyFreqLbl", value, false);
                            this.navEditMode[ni] = false;
                            this.navCursorLocation[ni] = 0;
                            this.updateUI(this, "nav" + idx + "StbyFreqLbl", sfreq, false);
                            this.updateUI(this, "nav" + idx + "StbyFreqModeLbl", this.NavModeLbl[navMode], false);
                        }
                    }
                }
            }
        }
    }

    var panel = new B38MPanel();
    panel.start();
    
});