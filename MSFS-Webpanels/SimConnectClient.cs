﻿using System;
using Microsoft.FlightSimulator.SimConnect;
using System.Runtime.InteropServices;
using System.Reflection.Metadata;
using Microsoft.VisualBasic;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Diagnostics;
using System.Collections.Concurrent;
using Microsoft.Extensions.Configuration.Ini;
using Microsoft.Extensions.FileProviders;
using System.Collections;
using Microsoft.VisualBasic.Devices;
using log4net;
using System.Reflection;
using MSFS_Webpanels;
using System.Xml.Serialization;

public class SimConnectClient
{
    private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);
	
	public readonly static string[] WritableSimVars =
    {
        "simvar-xpdrswitch",
        "simvar-apaltitude"
    };
	
	public readonly static string[] SimEvents =
    {
        "simvar-refegt", //SET_EGT_REF,
        "simvar-tasadj", //SET_TAS_ADJ,
        "simvar-attitudebarposition", //SET_ATTITUDE_BAR_POSITION,
        
        "simvar-headingbug", //SET_HEADING_BUG,
        "simvar-nav1obs", //SET_NAV1_OBS,
        "simvar-nav2obs", //SET_NAV2_OBS,
        "simvar-adfcard", //SET_ADF_CARD,
        "simvar-qnh", //SET_QNH,

        "simvar-switchfuelpump", //SET_SWITCH_FUELPUMP,
        "simvar-switchbcn", //SET_SWITCH_BCN,
        "simvar-switchland", //SET_SWITCH_LAND,
        "simvar-switchtaxi", //SET_SWITCH_TAXI,
        "simvar-switchnav", //SET_SWITCH_NAV,
        "simvar-switchstrobe", //SET_SWITCH_STROBE,
        "simvar-switchpitotheat", //SET_SWITCH_PITOT_HEAT,
        "simvar-switchalternator", //SET_SWITCH_ALTERNATOR,
        "simvar-switchbatterymaster", //SET_SWITCH_BATTERY_MASTER,
        "simvar-switchavionics1", //SET_SWITCH_AVIONICS1,
        "simvar-switchavionics2", //SET_SWITCH_AVIONICS2,
        "simvar-parkingbrake",  //SET_SWITCH_PARKING_BRAKE,
        "simvar-fuelvalve", //SET_FUEL_VALVE_ENG1,                
        
        "simvar-com1standbyfreq", //SET_COM1_STANDBY,
        "simvar-com2standbyfreq", //SET_COM2_STANDBY,
        "simvar-nav1standbyfreq", //SET_NAV1_STANDBY,
        "simvar-nav2standbyfreq", //SET_NAV2_STANDBY,
        "simvar-adfstandbyfreq", //SET_ADF_STANDBY,
        "simvar-com1freqswap", //SWAP_COM1_FREQ,
        "simvar-com2freqswap", //SWAP_COM2_FREQ,
        "simvar-nav1freqswap", //SWAP_NAV1_FREQ,
        "simvar-nav2freqswap", //SWAP_NAV2_FREQ,
        "simvar-adffreqswap", //SWAP_ADF_FREQ,

        "simvar-btnap", //BTN_AP,
        "simvar-btnhdg", //BTN_HDG,
        "simvar-btnnav", //BTN_NAV,
        "simvar-btnapr", //BTN_APR,
        "simvar-btnrev", //BTN_REV,
        "simvar-btnalt", //BTN_ALT,
        "simvar-btnvsinc", //BTN_VS_INC,
        "simvar-btnvsdec", //BTN_VS_DEC,
        "simvar-xpdr", //SET_XPDR_CODE,       
        
        "simvar-fuelselectorleft", //SET_FUEL_SELECTOR_LEFT,
        "simvar-fuelselectorall", //SET_FUEL_SELECTOR_ALL,
        "simvar-fuelselectorright", //SET_FUEL_SELECTOR_RIGHT,        

        "simvar-magnetodec", // MAGNETO_INCR
        "simvar-magnetoinc", // MAGNETO_DECR

        "simvar-flapspositiondec", //FLAPS_DECR,
        "simvar-flapspositioninc", //FLAPS_INCR,

        "simvar-gyrodrifterrorex", // GYRO_DRIFT_SET_EX1
        "simvar-headinggyroset", // HEADING_GYRO_SET

        "simvar-com1rx", // COM1_RECEIVE_SELECT
        "simvar-com2rx", // COM2_RECEIVE_SELECT
        "simvar-pilottx", // PILOT_TRANSMITTER_SET
        "simvar-nav1rx", // RADIO_VOR1_IDENT_TOGGLE
        "simvar-nav2rx", // RADIO_VOR2_IDENT_TOGGLE
        "simvar-adfrx", // RADIO_ADF_IDENT_TOGGLE

        "simvar-vsholdset", // AP_PANEL_VS_SET
        "simvar-apaltvarset", // AP_ALT_VAR_SET
        "simvar-togglegpsdrivenav1", // TOGGLE_GPS_DRIVES_NAV1
        "simvar-appanelvson", // AP_PANEL_VS_ON
        "simvar-xpdridentset", // XPNDR_IDENT_SET
        "simvar-com1volume",
        "simvar-nav1volume",
        "simvar-com2volume",
        "simvar-nav2volume",
        "simvar-adfvolume",
        "simvar-audiopanelvolume", // AUDIO_PANEL_VOLUME_SET
        "simvar-markertestmute", // MARKER_BEACON_TEST_MUTE
        "simvar-markerishighsensitivity", // MARKER_BEACON_SENSITIVITY_HIGH
        "simvar-intercommode", // INTERCOM_MODE_SET
        "simvar-markersoundon", // MARKER_SOUND_TOGGLE
        "simvar-intercomactive", // TOGGLE_ICS
        "simvar-dmesoundon", // RADIO_DME1_IDENT_TOGGLE
        "simvar-speakeractive", // TOGGLE_SPEAKER
        "simvar-copilottxtype", // COPILOT_TRANSMITTER_SET
        "simvar-gearhandleposition"
    };
    
    private readonly string[] WritableSimVarsDef =
	{
        "TRANSPONDER STATE:1", "Enum", 
        "AUTOPILOT ALTITUDE LOCK VAR", "Feet"
    };
	
	enum QUEUEITEM_TYPE
    {
        SIM_VARSET,
        SIM_EVENT
    };

    class QueueItem
    {
        QUEUEITEM_TYPE queueItemType;
        uint offset;        
        uint[] iParams;

        public uint[] IParams { get => iParams; set => iParams = value; }
        public uint Offset { get => offset; set => offset = value; }
        public QUEUEITEM_TYPE QueueItemType { get => queueItemType; set => queueItemType = value; }
    }

    enum REQUEST
    {
        AIRCRAFT_LOADED,
        AIRCRAFT_STATE,
        PLANE_INFO_REQ
    };

    enum DEFINITION
    {
        C172_FPANEL,
        SIM_VAR,
        GENERAL_PLANE_DATA,
    };

    public enum EVENT
    {
        SIM_PAUSE,
        SIM_RUNNING,
        AIRCRAFT_LOADED,
        FLIGHT_PLAN_ACTIVATED,
        FLIGHT_PLAN_DEACTIVATED,

        SET_EGT_REF,
        SET_TAS_ADJ,
        SET_ATTITUDE_BAR_POSITION,

        SET_HEADING_BUG,
        SET_NAV1_OBS,
        SET_NAV2_OBS,
        SET_ADF_CARD,
        SET_QNH,

        SET_SWITCH_FUELPUMP,
        SET_SWITCH_BCN,
        SET_SWITCH_LAND,
        SET_SWITCH_TAXI,
        SET_SWITCH_NAV,
        SET_SWITCH_STROBE,
        SET_SWITCH_PITOT_HEAT,
        SET_SWITCH_ALTERNATOR,
        SET_SWITCH_BATTERY_MASTER,
        SET_SWITCH_AVIONICS1,
        SET_SWITCH_AVIONICS2,
        SET_SWITCH_PARKING_BRAKE,
        SET_FUEL_VALVE_ENG1,

        SET_COM1_STANDBY,
        SET_COM2_STANDBY,
        SET_NAV1_STANDBY,
        SET_NAV2_STANDBY,
        SET_ADF_STANDBY,
        SWAP_COM1_FREQ,
        SWAP_COM2_FREQ,
        SWAP_NAV1_FREQ,
        SWAP_NAV2_FREQ,
        SWAP_ADF_FREQ,

        BTN_AP,
        BTN_HDG,
        BTN_NAV,
        BTN_APR,
        BTN_REV,
        BTN_ALT,
        BTN_VS_INC,
        BTN_VS_DEC,

        SET_XPDR_CODE,


        SET_FUEL_SELECTOR_LEFT,
        SET_FUEL_SELECTOR_ALL,
        SET_FUEL_SELECTOR_RIGHT,

        MAGNETO_DECR,
        MAGNETO_INCR,

        FLAPS_DECR,
        FLAPS_INCR,

        GYRO_DRIFT_SET_EX1,
        HEADING_GYRO_SET,

        SET_COM1_RX,
        SET_COM2_RX,
        SET_PILOT_TX,
        TOGGLE_VOR1_IDENT,
        TOGGLE_VOR2_IDENT,
        TOGGLE_ADF_IDENT,

        AP_PANEL_VS_SET,
        AP_ALT_VAR_SET,
        TOGGLE_GPS_DRIVES_NAV1,
        AP_PANEL_VS_ON,
        XPNDR_IDENT_SET,
        COM1_VOLUME_SET,
        NAV1_VOLUME_SET_EX1,
        COM2_VOLUME_SET,
        NAV2_VOLUME_SET_EX1,
        ADF_VOLUME_SET,
        AUDIO_PANEL_VOLUME_SET,
        MARKER_BEACON_TEST_MUTE,
        MARKER_BEACON_SENSITIVITY_HIGH,
        INTERCOM_MODE_SET,
        MARKER_SOUND_TOGGLE,
        TOGGLE_ICS,
        RADIO_DME1_IDENT_TOGGLE,
        TOGGLE_SPEAKER,
        COPILOT_TRANSMITTER_SET,
        GEAR_TOGGLE
    };

    enum NOTIFICATIONGROUP
    {
        DEFAULT_GROUP
    }

    struct WritableSimVarStruct
    {
        public Int32 simVar;
    }

    private SimConnect simConnect = null;
    public const int WM_USER_SIMCONNECT = 0x0402;
    private ConcurrentQueue<QueueItem> updateQueue = new ConcurrentQueue<QueueItem>();

    private static SimConnectClient simClient = new SimConnectClient();

    public static SimConnectClient getSimConnectClient()
    {       
        return simClient;
    }

    public SimData simData { get; set; }

    public SimConnectClient()
    {
        simData = new SimData();
    }

    public void Connect(IntPtr whnd)
    {
        if (simConnect != null)
        {
            return;
        }
        try
        {
            _logger.Info("Calling SimConnect");
            simConnect = new SimConnect("MSFS Webpanels data request", whnd, WM_USER_SIMCONNECT, null, 0);
            simConnect.OnRecvOpen += new SimConnect.RecvOpenEventHandler(OnRecvOpen);
            simConnect.OnRecvQuit += new SimConnect.RecvQuitEventHandler(OnRecvQuit);
            simConnect.OnRecvException += new SimConnect.RecvExceptionEventHandler(OnRecvException);
            simConnect.OnRecvEvent += new SimConnect.RecvEventEventHandler(OnRecvEvent);
            simConnect.OnRecvEventFilename += new SimConnect.RecvEventFilenameEventHandler(OnRecvFilenameEvent);
            simConnect.OnRecvSystemState += new SimConnect.RecvSystemStateEventHandler(OnRecvSystemStateHandler);

            simConnect.OnRecvSimobjectData += new SimConnect.RecvSimobjectDataEventHandler(OnRecvSimobjectData);

            simConnect.SubscribeToSystemEvent(EVENT.AIRCRAFT_LOADED, "AircraftLoaded");
            simConnect.SubscribeToSystemEvent(EVENT.SIM_PAUSE, "Pause");
            simConnect.SubscribeToSystemEvent(EVENT.SIM_RUNNING, "Sim");

            uint fieldId = 0;
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATC ID", null, SIMCONNECT_DATATYPE.STRING256, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FUEL LEFT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FUEL RIGHT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG EXHAUST GAS TEMPERATURE GES:1", "percent scaler 32k", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG EXHAUST GAS TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG FUEL FLOW GPH:1", "Gallons per hour", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG OIL TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG OIL PRESSURE:1", "psi", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "SUCTION PRESSURE", "inHg", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ELECTRICAL BATTERY LOAD", "Amperes", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AIRSPEED INDICATED", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AIRSPEED TRUE CALIBRATE", "Degrees", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE INDICATOR PITCH DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE INDICATOR BANK DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE BARS POSITION", "percent", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INDICATED ALTITUDE", "ft", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "KOHLSMAN SETTING MB", "millibar scaler 16", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV OBS:1", "Degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV TOFROM:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GS FLAG:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV CDI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GSI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TURN COORDINATOR BALL", "Position 128", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ELECTRICAL MAIN BUS VOLTAGE:1", "volts", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TURN INDICATOR RATE", "degrees per second", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "CIRCUIT GENERAL PANEL ON", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HEADING INDICATOR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT HEADING LOCK DIR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GYRO DRIFT ERROR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "VERTICAL SPEED", "feet/minute", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV OBS:2", "Degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV TOFROM:2", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GS FLAG:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV CDI:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GSI:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG RPM:1", "RPM", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF CARD", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF RADIAL:1", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG FUEL PUMP SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "LIGHT BEACON", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "LIGHT LANDING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "LIGHT TAXI", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "LIGHT NAV", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "LIGHT STROBE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "PITOT HEAT SWITCH:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG MASTER ALTERNATOR:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ELECTRICAL MASTER BATTERY", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AVIONICS MASTER SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AVIONICS MASTER SWITCH:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG STARTER:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "RECIP ENG LEFT MAGNETO:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "RECIP ENG RIGHT MAGNETO:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FLAPS HANDLE INDEX", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FUEL TANK SELECTOR:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG FUEL VALVE:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "BRAKE PARKING POSITION", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM ACTIVE FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM STANDBY FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV ACTIVE FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV STANDBY FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT ALTITUDE LOCK VAR", "Feet", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT MASTER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT HEADING LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT NAV1 LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT ALTITUDE LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT VERTICAL HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT VERTICAL HOLD VAR", "feet/minute", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT APPROACH HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT BACKCOURSE HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUTOPILOT GLIDESLOPE HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV DME:1", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV DMESPEED:1", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV SIGNAL:1", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV HAS DME:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV DME:2", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV DMESPEED:2", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV SIGNAL:2", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV HAS DME:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TRANSPONDER CODE:1", "Bco16", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TRANSPONDER STATE:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM TRANSMIT:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM RECEIVE EX1:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM TRANSMIT:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM RECEIVE EX1:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV SOUND:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV SOUND:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF SOUND:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GPS DRIVES NAV1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INDICATED ALTITUDE:3", "Feet", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ADF VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "SIMULATION TIME", "second", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM VOLUME:2", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV VOLUME:2", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "KOHLSMAN SETTING MB:2", "millibar scaler 16", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            // VOL
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AUDIO PANEL VOLUME", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            // HI/LO/TM EVT MARKER_BEACON_TEST_MUTE MARKER_BEACON_SENSITIVITY_HIGH
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "MARKER BEACON TEST MUTE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "MARKER BEACON SENSITIVITY HIGH", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            // ISO ALL CREW, EVT = INTERCOM_MODE_SET
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INTERCOM MODE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "MARKER SOUND", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            // ICS ?
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INTERCOM SYSTEM ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            // AUX Missing?
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "DME SOUND", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "SPEAKER ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            // COM3/2/1 COM1/2 COM2/1 TEL
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COM TRANSMIT:3", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "PILOT TRANSMITTING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COPILOT TRANSMITTING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "PILOT TRANSMITTER TYPE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "COPILOT TRANSMITTER TYPE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INNER MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "MIDDLE MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "OUTER MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "IS GEAR RETRACTABLE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GEAR HANDLE POSITION", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "GENERAL ENG ELAPSED TIME:1", "hours over 10", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HSI CDI NEEDLE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HSI GSI NEEDLE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HSI CDI NEEDLE VALID", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HSI GSI NEEDLE VALID", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "HSI DISTANCE", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.RegisterDataDefineStruct<C172SimData.C172Data>(DEFINITION.C172_FPANEL);
            simConnect.RequestDataOnSimObject(REQUEST.AIRCRAFT_STATE, DEFINITION.C172_FPANEL, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                SIMCONNECT_PERIOD.VISUAL_FRAME, 0, 0, 0, 0);

            fieldId = 0;
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC ID", "degree latitude", SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC MODEL", "degree latitude", SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC TYPE", "degree latitude", SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC FLIGHT NUMBER", "degree latitude", SIMCONNECT_DATATYPE.STRING8, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC AIRLINE", "degree latitude", SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "PLANE LATITUDE", "degree latitude", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "PLANE LONGITUDE", "degree longitude", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "PLANE ALTITUDE", "feet", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "GROUND VELOCITY", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "PLANE HEADING DEGREES TRUE", "Degrees", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "WING SPAN", "Feet", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "SIM ON GROUND", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ENGINE TYPE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "NUMBER OF ENGINES", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.RegisterDataDefineStruct<SimData.GenericPlaneData>(DEFINITION.GENERAL_PLANE_DATA);
            simConnect.RequestDataOnSimObject(REQUEST.PLANE_INFO_REQ, DEFINITION.GENERAL_PLANE_DATA, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                    SIMCONNECT_PERIOD.SECOND, 0, 0, 0, 0);

            /*
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "", "", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            */

           simConnect.MapClientEventToSimEvent(EVENT.SET_EGT_REF, "EGT1_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_TAS_ADJ, "TRUE_AIRSPEED_CAL_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_ATTITUDE_BAR_POSITION, "ATTITUDE_BARS_POSITION_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_HEADING_BUG, "HEADING_BUG_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_QNH, "KOHLSMAN_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_NAV1_OBS, "VOR1_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_NAV2_OBS, "VOR2_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_ADF_CARD, "ADF_CARD_SET");

           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_ALTERNATOR, "ALTERNATOR_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_BATTERY_MASTER, "MASTER_BATTERY_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_AVIONICS1, "AVIONICS_MASTER_1_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_AVIONICS2, "AVIONICS_MASTER_2_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_FUELPUMP, "ELECT_FUEL_PUMP1_SET"); //?

           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_BCN, "BEACON_LIGHTS_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_LAND, "LANDING_LIGHTS_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_TAXI, "TAXI_LIGHTS_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_NAV, "NAV_LIGHTS_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_STROBE, "STROBES_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_PITOT_HEAT, "PITOT_HEAT_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_SWITCH_PARKING_BRAKE, "PARKING_BRAKE_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_VALVE_ENG1, "SET_FUEL_VALVE_ENG1");

           simConnect.MapClientEventToSimEvent(EVENT.FLAPS_DECR, "FLAPS_DECR");
           simConnect.MapClientEventToSimEvent(EVENT.FLAPS_INCR, "FLAPS_INCR");

           simConnect.MapClientEventToSimEvent(EVENT.MAGNETO_INCR, "MAGNETO_INCR");
           simConnect.MapClientEventToSimEvent(EVENT.MAGNETO_DECR, "MAGNETO_DECR");

           simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_LEFT, "FUEL_SELECTOR_LEFT");
           simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_ALL, "FUEL_SELECTOR_ALL");
           simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_RIGHT, "FUEL_SELECTOR_RIGHT");

           simConnect.MapClientEventToSimEvent(EVENT.SET_COM1_STANDBY, "COM_STBY_RADIO_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_COM2_STANDBY, "COM2_STBY_RADIO_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_NAV1_STANDBY, "NAV1_STBY_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_NAV2_STANDBY, "NAV2_STBY_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SET_ADF_STANDBY, "ADF_STBY_SET");
           simConnect.MapClientEventToSimEvent(EVENT.SWAP_COM1_FREQ, "COM1_RADIO_SWAP");
           simConnect.MapClientEventToSimEvent(EVENT.SWAP_COM2_FREQ, "COM2_RADIO_SWAP");
           simConnect.MapClientEventToSimEvent(EVENT.SWAP_NAV1_FREQ, "NAV1_RADIO_SWAP");
           simConnect.MapClientEventToSimEvent(EVENT.SWAP_NAV2_FREQ, "NAV2_RADIO_SWAP");
           simConnect.MapClientEventToSimEvent(EVENT.SWAP_ADF_FREQ, "ADF1_RADIO_SWAP");

           simConnect.MapClientEventToSimEvent(EVENT.BTN_AP, "AP_MASTER");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_HDG, "AP_PANEL_HEADING_HOLD");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_NAV, "AP_NAV1_HOLD");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_APR, "AP_APR_HOLD");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_REV, "AP_BC_HOLD");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_ALT, "AP_PANEL_ALTITUDE_HOLD");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_VS_INC, "AP_VS_VAR_INC");
           simConnect.MapClientEventToSimEvent(EVENT.BTN_VS_DEC, "AP_VS_VAR_DEC");

           simConnect.MapClientEventToSimEvent(EVENT.SET_XPDR_CODE, "XPNDR_SET");
           simConnect.MapClientEventToSimEvent(EVENT.GYRO_DRIFT_SET_EX1, "GYRO_DRIFT_SET_EX1");
           simConnect.MapClientEventToSimEvent(EVENT.HEADING_GYRO_SET, "HEADING_GYRO_SET");

           simConnect.MapClientEventToSimEvent(EVENT.SET_COM1_RX, "COM1_RECEIVE_SELECT");
           simConnect.MapClientEventToSimEvent(EVENT.SET_COM2_RX, "COM2_RECEIVE_SELECT");
           simConnect.MapClientEventToSimEvent(EVENT.SET_PILOT_TX, "PILOT_TRANSMITTER_SET");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_VOR1_IDENT, "RADIO_VOR1_IDENT_TOGGLE");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_VOR2_IDENT, "RADIO_VOR2_IDENT_TOGGLE");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_ADF_IDENT, "RADIO_ADF_IDENT_TOGGLE");
           simConnect.MapClientEventToSimEvent(EVENT.AP_PANEL_VS_SET, "AP_PANEL_VS_SET");

           simConnect.MapClientEventToSimEvent(EVENT.AP_ALT_VAR_SET, "AP_ALT_VAR_SET_ENGLISH");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_GPS_DRIVES_NAV1, "TOGGLE_GPS_DRIVES_NAV1");

           simConnect.MapClientEventToSimEvent(EVENT.AP_PANEL_VS_ON, "AP_PANEL_VS_ON");
           simConnect.MapClientEventToSimEvent(EVENT.XPNDR_IDENT_SET, "XPNDR_IDENT_SET");

           simConnect.MapClientEventToSimEvent(EVENT.COM1_VOLUME_SET, "COM1_VOLUME_SET");
           simConnect.MapClientEventToSimEvent(EVENT.NAV1_VOLUME_SET_EX1, "NAV1_VOLUME_SET_EX1");
           simConnect.MapClientEventToSimEvent(EVENT.COM2_VOLUME_SET, "COM2_VOLUME_SET");
           simConnect.MapClientEventToSimEvent(EVENT.NAV2_VOLUME_SET_EX1, "NAV2_VOLUME_SET_EX1");
           simConnect.MapClientEventToSimEvent(EVENT.ADF_VOLUME_SET, "ADF_VOLUME_SET");

           simConnect.MapClientEventToSimEvent(EVENT.AUDIO_PANEL_VOLUME_SET, "AUDIO_PANEL_VOLUME_SET");
           simConnect.MapClientEventToSimEvent(EVENT.MARKER_BEACON_TEST_MUTE, "MARKER_BEACON_TEST_MUTE");
           simConnect.MapClientEventToSimEvent(EVENT.MARKER_BEACON_SENSITIVITY_HIGH, "MARKER_BEACON_SENSITIVITY_HIGH");
           simConnect.MapClientEventToSimEvent(EVENT.INTERCOM_MODE_SET, "INTERCOM_MODE_SET");
           simConnect.MapClientEventToSimEvent(EVENT.MARKER_SOUND_TOGGLE, "MARKER_SOUND_TOGGLE");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_ICS, "TOGGLE_ICS");
           simConnect.MapClientEventToSimEvent(EVENT.RADIO_DME1_IDENT_TOGGLE, "RADIO_DME1_IDENT_TOGGLE");
           simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_SPEAKER, "TOGGLE_SPEAKER");
           simConnect.MapClientEventToSimEvent(EVENT.COPILOT_TRANSMITTER_SET, "COPILOT_TRANSMITTER_SET");
           simConnect.MapClientEventToSimEvent(EVENT.GEAR_TOGGLE, "GEAR_TOGGLE");

            simConnect.RequestSystemState(REQUEST.AIRCRAFT_LOADED, "AircraftLoaded");
            _logger.Info("End calling SimConnect");
        }
        catch (COMException ex)
        {
            _logger.Error(ex.ToString());
        }
    }

    public void Disconnect()
    {
        if (simConnect == null)
        {
            return;
        }
        _logger.Info("Call Dispose");
        simConnect.Dispose();
        simData.IsSimConnected = false;
        simConnect = null;
    }

    public void SimConnectMsgHandler()
    {
        if (simConnect != null)
        {
            try
            {
                simConnect.ReceiveMessage();

            } catch (Exception e)
            {
                _logger.Error(e.ToString());
            }
        }
    }

    private void OnRecvOpen(SimConnect sender, SIMCONNECT_RECV_OPEN data)
    {
        _logger.Info("MSFS OnRecvOpen");
        simData.IsSimConnected = true;
    }

    private void OnRecvQuit(SimConnect sender, SIMCONNECT_RECV data)
    {
        _logger.Info("MSFS OnRecvQuit");
        simData.IsSimConnected = false;
        if (simConnect!=null)
        {
            simConnect.Dispose();
            simConnect = null;
        }  
    }

    private void OnRecvException(SimConnect sender, SIMCONNECT_RECV_EXCEPTION data)
    {
        _logger.Error("MSFS Exception:" + data.ToString());
    }

    private void OnRecvSimobjectData(SimConnect sender, SIMCONNECT_RECV_SIMOBJECT_DATA data)
    {
        if (data.dwDefineID == (uint)DEFINITION.C172_FPANEL)
        {
            C172SimData ndata;
            if (simData is C172SimData)
            {
                ndata = (C172SimData)simData;
            } else
            {
                ndata = new C172SimData(simData);
            }
            ndata.simData = (C172SimData.C172Data)data.dwData[0];
            this.simData = ndata;
        }       
        while (updateQueue.Count > 0)
        {
            QueueItem itm;
            if (updateQueue.TryDequeue(out itm))
            {
                if (itm.QueueItemType==QUEUEITEM_TYPE.SIM_EVENT)
                {
                    uint[] scParams = new uint[5];
                    for (int i = 0; i < itm.IParams.Length; i++)
                    {
                        scParams[i] = itm.IParams[i];
                    }
                    EVENT evt = (EVENT)(itm.Offset + (uint)EVENT.SET_EGT_REF);
                    simConnect.TransmitClientEvent_EX1(SimConnect.SIMCONNECT_OBJECT_ID_USER, evt,
                     NOTIFICATIONGROUP.DEFAULT_GROUP, SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY, scParams[0], scParams[1], scParams[2], scParams[3], scParams[4]);
                } else if (itm.QueueItemType == QUEUEITEM_TYPE.SIM_VARSET)
                {
                    string vname;
                    string vunit;
                    uint offset = itm.Offset << 1;
                    uint val = itm.IParams[0];

                    vname = WritableSimVarsDef[offset];
                    vunit = WritableSimVarsDef[offset + 1];

                    simConnect.AddToDataDefinition(DEFINITION.SIM_VAR, vname, vunit, SIMCONNECT_DATATYPE.INT32, 0, 0);
                    simConnect.RegisterDataDefineStruct<WritableSimVarStruct>(DEFINITION.SIM_VAR);
                    simConnect.SetDataOnSimObject(DEFINITION.SIM_VAR,
                        SimConnect.SIMCONNECT_OBJECT_ID_USER,
                        SIMCONNECT_DATA_SET_FLAG.DEFAULT,
                        new WritableSimVarStruct { simVar = (Int32)val }
                    );
                    simConnect.ClearDataDefinition(DEFINITION.SIM_VAR);
                }
            }
        }
    }

    private void OnRecvEvent(SimConnect sender, SIMCONNECT_RECV_EVENT data)
    {
        switch ((EVENT)data.uEventID)
        {
            case EVENT.SIM_RUNNING:
                _logger.Info("Sim Running");
                simData.IsSimRunning = (data.dwData == 1); ;
                break;
            case EVENT.SIM_PAUSE:
                _logger.Info("Sim Paused");
                simData.IsPaused = (data.dwData == 1);
                break;
            case EVENT.FLIGHT_PLAN_DEACTIVATED:
                _logger.Info("Flight plan deactivated");
                break;
        }
    }

    private void OnRecvFilenameEvent(SimConnect sender, SIMCONNECT_RECV_EVENT_FILENAME data)
    {
        if (data.uEventID == (uint)EVENT.AIRCRAFT_LOADED)
        {            
            int spos = data.szFileName.IndexOf("SimObjects\\Airplanes");
            int epos = data.szFileName.LastIndexOf("\\");
            if (spos>=0) 
            {
                this.simData.AircraftFolder = data.szFileName.Substring(spos+21, epos - spos - 21);
            }
            _logger.Info("OnRecvFilenameEvent:"+data.szFileName);
        }
    }
    private void OnRecvSystemStateHandler(SimConnect sender, SIMCONNECT_RECV_SYSTEM_STATE data)
    {

        if (data.dwRequestID == (uint)REQUEST.AIRCRAFT_LOADED)
        {
            int epos = data.szString.LastIndexOf("\\");
            this.simData.AircraftFolder = data.szString.Substring(21,epos-21);
            _logger.Info("OnRecvSystemStateHandler:"+data.szString);
        }
    }
    
    public int processWebRequest(string req, uint[] iparams)
    {        
        int idx = Array.IndexOf(SimConnectClient.WritableSimVars, req);
        QueueItem itm = new QueueItem();
        itm.IParams = iparams;

        if (idx >= 0)
        {
            itm.Offset = (uint)idx;
            itm.QueueItemType = QUEUEITEM_TYPE.SIM_VARSET;

        }
        idx = Array.IndexOf(SimConnectClient.SimEvents, req);
        if (idx >= 0)
        {
            itm.Offset = (uint)idx;
            itm.QueueItemType = QUEUEITEM_TYPE.SIM_EVENT;

        }        
        if (itm.Offset>=0)
        {
            updateQueue.Enqueue(itm);
            return 0;
        }
        return -1;
    }
}
