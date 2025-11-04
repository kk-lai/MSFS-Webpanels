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

    class B73MPanel extends AbstractPanel {
        constructor() {
            super('b73m');
            this.requestDef = {
                "dummy": { "Cmd": "(B:PASSENGER_FASTEN_BELTS, Number)", "Delta": 0, "Type": "Integer" },
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

                // label
                "fuelTempLbl": { "Cmd": "(L:1:XMLVAR_FUEL_TEMPERATURE, celsius)", "Delta": 0, "Type": "Double" },
                "flightAltitudeKnob": { "Cmd": "(L:1:XMLVAR_PRESSURIZATION_ALTITUDE_FLIGHT, Number)", "Delta": 0, "Type": "Double" },
                "landingAltitudeKnob": { "Cmd": "(L:1:XMLVAR_PRESSURIZATION_ALTITUDE_LANDING, Number)", "Delta": 0, "Type": "Double" },
                
                "courseSelector1Knob": { "Cmd": "(A:NAV OBS:1, degrees)", "Delta": 0, "Type": "Integer" },
                "headingSelectorKnob": { "Cmd": "(A:AUTOPILOT HEADING LOCK DIR, degrees)", "Delta": 0, "Type": "Integer" },
                "altitudeSelectorKnob": { "Cmd": "(A:AUTOPILOT ALTITUDE LOCK VAR:3, feet)", "Delta": 0, "Type": "Integer" },
                "verticalSpeedKnob": { "Cmd": "(AUTOPILOT VERTICAL HOLD VAR:1, feet per minute)", "Delta": 0, "Type": "Double" },

                // others
                "iasSelectorLbl": { "Cmd": "(A:AUTOPILOT AIRSPEED HOLD VAR:1, knots)", "Delta": 0, "Type": "Integer" },
                "machSelectorLbl": { "Cmd": "(A:AUTOPILOT MACH HOLD VAR:1, mach)", "Delta": 0, "Type": "Double" },
                "isVSActiveLbl": { "Cmd": "(A:AUTOPILOT VERTICAL HOLD, Bool)", "Delta": 0, "Type": "Integer" },
            }
            this.cmdDef = {
                "noSmokingSwitch": "(>B:PASSENGER_NO_SMOKING_Set, Number)",
                "seatbeltsSwitch": "(>B:PASSENGER_FASTEN_BELTS_Set, Number)",
                "groundPowerSwitch": "(>B:ELECTRICAL_EXTERNAL_POWER_Set, Number)",
                "gen1Switch": "(>B:ELECTRICAL_GENERATOR_1_Set, Number)",
                "apuGen1Switch": "(>B:ELECTRICAL_APU_GENERATOR_1_Set, Number)",
                "apuGen2Switch": "(>B:ELECTRICAL_APU_GENERATOR_2_Set, Number)",
                "gen2Switch": "(>B:ELECTRICAL_GENERATOR_2_Set, Number)",
                "fuelPumpCtrLeftSwitch": "(>B:FUEL_PUMP_CTR_L_Set, Bool)",
                "fuelPumpCtrRightSwitch": "(>B:FUEL_PUMP_CTR_R_Set, Bool)",
                "fuelPumpLeftAftSwitch": "(>B:FUEL_PUMP_AFT_1_Set, Bool)",
                "fuelPumpLeftFwdSwitch": "(>B:FUEL_PUMP_FWD_1_Set, Bool)",
                "fuelPumpRightFwdSwitch": "(>B:FUEL_PUMP_FWD_2_Set, Bool)",
                "fuelPumpRightAftSwitch": "(>B:FUEL_PUMP_AFT_2_Set, Bool)",                
                "apuSwitch": "(>B:ENGINE_APU_Set, Number)",
                "cabutilSwitch": "(>B:ELECTRICAL_CAB_UTIL_Set, Bool)",
                "ifeSwitch": "(>B:ELECTRICAL_IFE_PASS_Set, Bool)",
                "dcmainSwitch": "(>B:ELECTRICAL_BATTERY_Set, Bool)",
                "electBusTransferSwitch": "(>B:ELECTRICAL_BUS_TRANSFER_Set, Bool)",
                "crossFeedKnob": "(>B:FUEL_VALVE_CROSSFEED_Set, Bool)",
                "engineStartIgnitionSwitch": "(>B:ENGINE_IGNITION_SELECT_Set, Bool)",
                "engine1StartKnob": "(>B:ENGINE_IGNITION_1_Set, Bool)",
                "engine2StartKnob": "(>B:ENGINE_IGNITION_2_Set, Bool)",
                "leverEngineStart1Switch": "(>B:ENGINE_STARTER_1_Set, Bool)",
                "leverEngineStart2Switch": "(>B:ENGINE_STARTER_2_Set, Bool)",

                "LRecircFanSwitch": "(>B:PNEUMATICS_RECIRC_FAN_1_Set, Bool)",
                "RRecircFanSwitch": "(>B:PNEUMATICS_RECIRC_FAN_2_Set, Bool)",
                "isolationValveSwitch": "(>B:PNEUMATICS_ISOLATION_VALVE_Set, Number)",
                "LPackSwitch": "(>B:PNEUMATICS_L_PACK_Set, Number)",
                "RPackSwitch": "(>B:PNEUMATICS_R_PACK_Set, Number)",
                "engineBleedAir1Switch": "(>B:PNEUMATICS_ENGINE_BLEED_1_Set, Bool)",
                "engineBleedAir2Switch": "(>B:PNEUMATICS_ENGINE_BLEED_2_Set, Bool)",
                "apuBleedAirSwitch": "(>B:PNEUMATICS_APU_BLEED_Set, Bool)",
                "engine1HydPumpSwitch": "(>B:HYD_ENG_1_PUMP_Set, Bool)",
                "engine2HydPumpSwitch": "(>B:HYD_ENG_2_PUMP_Set, Bool)",
                "electricHydPump1Switch": "(>B:HYD_ELEC_1_PUMP_Set, Bool)",
                "electricHydPump2Switch": "(>B:HYD_ELEC_2_PUMP_Set, Bool)",

                "engine1AntiIceSwitch": "(>B:ANTI_ICE_ENG_1_Set, Bool)",
                "engine2AntiIceSwitch": "(>B:ANTI_ICE_ENG_2_Set, Bool)",
                "wingAntiIceSwitch": "(>B:ANTI_ICE_WING_Set, Bool)",

                "windowHeatLSideSwitch": "(>B:WINDOW_HEAT_L_SIDE_Set, Bool)",
                "windowHeatLFwdSwitch": "(>B:WINDOW_HEAT_L_FWD_Set, Bool)",
                "windowHeatOverheatTestSwitch": "(>B:WINDOW_HEAT_OVHT_TEST_Set, Number)",
                "windowHeatRFwdSwitch": "(>B:WINDOW_HEAT_R_FWD_Set, Bool)",
                "windowHeatRSideSwitch": "(>B:WINDOW_HEAT_R_SIDE_Set, Bool)",
                "probeHeatASwitch": "(>B:PROBE_HEAT_A_Set, Bool)",
                "probeHeatBSwitch": "(>B:PROBE_HEAT_B_Set, Bool)",
                "voiceRecorderSwitch": "(>B:VOICE_RECORDER_Set, Bool)",

                "landingLightLSwitch": "(>B:LIGHTING_LANDING_LIGHT_FIXED_L_Set, Bool)",
                "landingLightRSwitch": "(>B:LIGHTING_LANDING_LIGHT_FIXED_R_Set, Bool)",
                "runwayTurnoffLightLSwitch": "(>B:LIGHTING_RUNWAY_TURNOFF_LIGHT_L_Set, Bool)",
                "runwayTurnoffLightRSwitch": "(>B:LIGHTING_RUNWAY_TURNOFF_LIGHT_R_Set, Bool)",
                "taxiLightSwitch": "(>B:LIGHTING_TAXI_LIGHT_GEAR_Set, Bool)",
                "emerLightSwitch": "(>B:PASSENGER_EXIT_LIGHTS_Set, Number)",
                "logoLightSwitch": "(>B:LIGHTING_LOGO_LIGHT_Set, Bool)",
                "positionLightSwitch": "(>B:LIGHTING_POSITION_LIGHT_Set, Number)",
                "antiCollisionLightSwitch": "(>B:LIGHTING_ANTI_COLLISION_LIGHT_Set, Bool)",
                "wingLightSwitch": "(>B:LIGHTING_WING_LIGHT_Set, Bool)",
                "taxiLightWheelSwitch": "(>B:LIGHTING_TAXI_LIGHT_WHEEL_WELL_Set, Bool)",

                "cabinPressureModeKnob": "(>B:PNEUMATICS_PRESS_SELEC_Set, Number)",
                "cabinPressureValveSwitch": "(>B:PNEUMATICS_VALVE_Set, Number)",
                "lWiperKnob": "(>B:WINDSHIELD_L_WIPER_Set, Number)",
                "rWiperKnob": "(>B:WINDSHIELD_R_WIPER_Set, Number)",
                "yawDamperSwitch": "(>B:FLT_CONTROLS_PANEL_YAW_DAMPER_Set, Bool)",
                "irsModeSelector1Switch": "(>B:AFT_OVHD_L_IRS_Set, Number)",
                "irsModeSelector2Switch": "(>B:AFT_OVHD_R_IRS_Set, Number)",

                "flightAltitudeKnob": "(>L:1:XMLVAR_PRESSURIZATION_ALTITUDE_FLIGHT, Number)",
                "landingAltitudeKnob": "(>L:1:XMLVAR_PRESSURIZATION_ALTITUDE_LANDING, Number)",
                
                "courseSelector1Knob": "(>B:FCC_COURSE_1_Set, degrees)",
                "iasMachSelectorKnob": "(>B:FCC_SPEED_SEL_Set, Number)",
                "headingSelectorKnob": "(>B:FCC_HEADING_SEL_Set, degrees)",
                "altitudeSelectorKnob": "(>B:FCC_ALTITUDE_SEL_Set, Number)",
                "vertialSpeedKnob": "(>B:FCC_VERTICAL_SPEED_SEL_Set, Number)",
                "flightDirectorSwitch": "(>B:FCC_FD_1_Set, Bool)",
                "autoThrottleSwitch": "(>B:FCC_AUTOTHROTTLE_Set, Bool)",
                "apCmd1Btn": "(>B:FCC_CMD_1_Set, Bool)",
                "apCmd2Btn": "(>B:FCC_CMD_2_Set, Bool)",
                "apCws1Btn": "(>B:FCC_CWS_1_Set, Bool)",
                "apCws2Btn": "(>B:FCC_CWS_2_Set, Bool)",
                "apVSBtn": "(>B:FCC_VS_Set, Bool)",
                "apAltHldBtn": "(>B:FCC_ALT_HLD_Set, Bool)",
                "apAppBtn": "(>B:FCC_APP_Set, Bool)",
                "apVORLOCBtn": "(>B:FCC_VOR_LOC_Set, Bool)",
                "apLNavBtn": "(>B:FCC_LNAV_Set, Bool)",
                "apHdgSelectBtn": "(>B:FCC_HDG_SEL_Set, Bool)",
                "apVNavBtn": "(>B:FCC_VNAV_Set, Bool)",
                "apLvlChgBtn": "(>B:FCC_LVL_CHG_Set, Bool)",
                "apSpeedBtn": "(>B:FCC_SPEED_Set, Bool)",
                "apN1Btn": "(>B:FCC_N1_Set, Bool)",
                "bankAngleSelectorKnob": "(>B:FCC_BANK_ANGLE_SEL_Set, Number)",
                
                "spdChangeOverBtn": "(>B:FCC_CHANGEOVER_Set, Bool)",
                "spdIntvBtn": "(>B:FCC_SPEED_INTERVENTION_Set, Bool)",
                "altIntvBtn": "(>B:FCC_ALTITUDE_INTERVENTION_Set, Bool)",

                "efisMinRefSelectorKnob": "(>B:EFIS_MINS_REF_1_Set, Bool)",
                "efisBaroUnitSelectorKnob": "(>B:EFIS_BARO_UNIT_1_Set, Bool)",
                "efisMFDModeSelectorKnob": "(>B:EFIS_MODE_1_Set, Number)",
                "efisMFDRangeSelectorKnob": "(>B:EFIS_RANGE_1_Set, Number)",

                "efisWXRBtn": "(>B:EFIS_WXR_1_TOGGLE, Bool)",
                "efisSTABtn": "(>B:EFIS_STA_1_TOGGLE, Bool)",
                "efisWPTBtn": "(>B:EFIS_WPT_1_TOGGLE, Bool)",
                "efisArptBtn": "(>B:EFIS_ARPT_1_TOGGLE, Bool)",
                "efisDATABtn": "(>B:EFIS_DATA_1_TOGGLE, Bool)",
                "efisPOSBtn": "(>B:EFIS_POS_1_TOGGLE, Bool)",
                "efisTerrBtn": "(>B:EFIS_TERR_1_TOGGLE, Bool)",


                "efisModeCenterBtn": "(>B:EFIS_CTR_1_TOGGLE, Bool)",
                "efisRangeTFCBtn": "(>B:EFIS_TFC_1_TOGGLE, Bool)",
                "efisMinRstBtn": "(>B:EFIS_RST_1_TOGGLE, Bool)",
                "efisBaroStdBtn": "(>B:EFIS_BARO_STD_1_TOGGLE, Bool)",

                "efisFPVBtn": "(>B:EFIS_FPV_1_TOGGLE, Bool)",
                "efisMTRSbtn": "(>B:EFIS_MTRS_1_TOGGLE, Bool)",
                "efisVSDBtn": "(>B:EFIS_VSD_1_TOGGLE, Bool)",
            }
        } // constructor


        updatePanel(self, json) {
            if (json.asIsInMachInd) {
                json.iasMachSelectorKnob = json.machSelectorLbl;
            } else {
                json.iasMachSelectorKnob = json.iasSelectorLbl;
            }
            this.simData = json;
            super.updatePanel(self, json);
        }

        updateUI(self, ui, value, skipHot = true) {
            if (ui == "headingSelectorKnob" && value == 0) {
                value = 360;
            } else if (ui == "iasMachSelectorKnob" && self.simData.asIsInMachInd) {
                value = value.toFixed(3);
            }
            super.updateUI(self, ui, value, skipHot);
        }

        onKnobRotate(self, ctl, dir) {
            var ui = jquery(ctl).attr("ctl");
            if (ui == "iasMachSelectorKnob" && self.simData.asIsInMachInd) {               
                // handle mach
                var min = 0.60;
                var max = 0.82;
                var step = 0.010;
                var adj = step * dir;
                var oVal = parseFloat(jquery(ctl).attr("value"));
                var nVal = oVal + adj;

                if (nVal < min) {
                    nVal = min;
                }
                if (nVal > max) {
                    nVal = max;
                }

                if (nVal != oVal) {
                    self.sendCommand(self, ui, nVal);
                    self.updateUI(self, ui, nVal, false);
                    var rtime = self.repeatTime2;
                    if (dt < self.repeatTime1) {
                        rtime = self.repeatTime1;
                    }
                    self.repeatTimer = setTimeout(self.onKnobRotate, rtime, self, ctl, dir);
                }
                return;
            }
            super.onKnobRotate(self, ctl, dir);
        }

        sendCommand(self, ui, val, removeDuplicate = false) {
            if (ui == "iasMachSelectorKnob") {
                if (self.simData.asIsInMachInd) {
                    val = (val * 100).toFixed(0);                    
                } 
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
    }

    var panel = new B73MPanel();
    panel.start();
    
});