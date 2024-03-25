using System;
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
using static SimData;
using System.Windows.Forms.VisualStyles;
using WASimCommander.CLI.Client;
using Microsoft.AspNetCore.Mvc;


public class SimConnectClient
{
    private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);

    public readonly static string[] WritableSimVars =
    {
        "simvar-xpdrswitch",
        "simvar-apaltitude",
        "simvar-varismachactive",
        "simvar-istrkmode",
        "simvar-autopilotaltinc",
        "simvar-autopilot1status",
        "simvar-autopilot2status",
        "simvar-ndmode",
        "simvar-ndrange",
        "simvar-autopilotnavaidstate1",
        "simvar-autopilotnavaidstate2",
        "simvar-ispressureselectedunitshpa",
        "simvar-baromode"
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
        "simvar-gearhandleposition", // GEAR_TOGGLE 
        "simvar-ismachactive", // AUTOPILOT MANAGED SPEED IN MACH
        "simvar-autopilotselectedmachholdvalue", // AP_MACH_VAR_SET
        "simvar-autopilotselectedairspeedholdvalue", // AP_SPD_VAR_SET
        "simvar-autopilotselectedverticalspeedholdvalue",  // AP_VS_VAR_SET_ENGLISH
        "simvar-autopilotapprhold",   // AP_LOC_HOLD
        "simvar-autopilotthrottlearm",  // AUTO_THROTTLE_ARM
        "simvar-autopilotflightdirectoractive" // TOGGLE_FLIGHT_DIRECTOR
    };

    private readonly string[] WritableSimVarsDef =
{
        "TRANSPONDER STATE:1", "Enum", 
        "AUTOPILOT ALTITUDE LOCK VAR", "Feet", 
        "L:XMLVAR_AirSpeedIsInMach", "Number",
        "L:XMLVAR_TRK_FPA_MODE_ACTIVE", "Number",
        "L:XMLVAR_Autopilot_Altitude_Increment", "Number",
        "L:XMLVAR_Autopilot_1_Status","Number",
        "L:XMLVAR_Autopilot_2_Status","Number",
        "L:A320_Neo_MFD_NAV_MODE","Number",
        "L:A320_Neo_MFD_Range","Number",
        "L:XMLVAR_NAV_AID_SWITCH_L1_State","Number",
        "L:XMLVAR_NAV_AID_SWITCH_L2_State","Number",
        "L:XMLVAR_Baro_Selector_HPA_1","Number",
        "L:XMLVAR_Baro1_Mode","Number"
    };

    public readonly static string[] RPNEvents =
    {
        "simvar-a20nairspeedmanaged",
        "simvar-a20nairspeedselected",
        "simvar-a20nairspeedchanged",
        "simvar-a20nheadingmanaged",
        "simvar-a20nheadingselected",
        "simvar-a20nheadingchanged",
        "simvar-a20naltmanaged",
        "simvar-a20naltselected",
        "simvar-a20naltchanged",
        "simvar-a20nvshold",
        "simvar-a20nvszero",
        "simvar-a20nvschanged",
        "simvar-a20nexped",
        "simvar-btnlsactive",
        "simvar-pfdlsactive",
        "simvar-btncstractive",
        "simvar-pfdcstractive",
        "simvar-btnwptactive",
        "simvar-pfdwptactive",
        "simvar-btnvordactive",
        "simvar-pfdvordactive",
        "simvar-btnndbactive",
        "simvar-pfdndbactive",
        "simvar-btnarptactive",
        "simvar-pfdarptactive"
    };

    public readonly static string[] RPNScripts =
    {
        "(>H:A320_Neo_CDU_MODE_MANAGED_SPEED)",
        "(>H:A320_Neo_CDU_MODE_SELECTED_SPEED)",
        "(>H:A320_Neo_CDU_AP_INC_SPEED)",
        "(>H:A320_Neo_CDU_MODE_MANAGED_HEADING)",
        "(>H:A320_Neo_CDU_MODE_SELECTED_HEADING)",
        "(>H:A320_Neo_CDU_AP_INC_HEADING)",
        "(>H:A320_Neo_CDU_MODE_MANAGED_ALTITUDE)",
        "(>H:A320_Neo_CDU_MODE_SELECTED_ALTITUDE)",
        "(>H:A320_Neo_CDU_AP_INC_ALT)",
        "(>H:A320_Neo_FCU_VS_HOLD)",
        "(>H:A320_Neo_FCU_VS_ZERO)",
        "(>H:A320_Neo_FCU_VS_INC)",
        "(>H:A320_Neo_EXPEDITE_MODE)",
        "(>H:A320_Neo_MFD_BTN_LS)",
        "(>H:A320_Neo_PFD_BTN_LS)",
        "(>H:A320_Neo_MFD_BTN_CSTR)",
        "(>H:A320_Neo_PFD_BTN_CSTR)",
        "(>H:A320_Neo_MFD_BTN_WPT)",
        "(>H:A320_Neo_PFD_BTN_WPT)",
        "(>H:A320_Neo_MFD_BTN_VORD)",
        "(>H:A320_Neo_PFD_BTN_VORD)",
        "(>H:A320_Neo_MFD_BTN_NDB)",
        "(>H:A320_Neo_PFD_BTN_NDB)",
        "(>H:A320_Neo_MFD_BTN_ARPT)",
        "(>H:A320_Neo_PFD_BTN_ARPT)"
    };

    enum QUEUEITEM_TYPE
    {
        SIM_VARSET,
        SIM_EVENT,
        RPN_EXEC
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
#if DEBUG
        , CUSTOM_REQ
#endif
    };

    enum DEFINITION
    {
        PANEL_DATA,
        SIM_VAR,
        GENERAL_PLANE_DATA
#if DEBUG
        ,CUSTOM_DEF
#endif
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
        GEAR_TOGGLE,

        AP_MANAGED_SPEED_IN_MACH_TOGGLE,
        AP_MACH_VAR_SET,
        AP_SPD_VAR_SET,
        AP_VS_VAR_SET_ENGLISH,
        AP_LOC_HOLD,
        AUTO_THROTTLE_ARM,
        TOGGLE_FLIGHT_DIRECTOR
#if DEBUG
        , CUSTOM_EVENT1
#endif
    };

    enum NOTIFICATIONGROUP
    {
        DEFAULT_GROUP
    }

#if DEBUG
    struct CustomStruct
    {
        public Int32 customVar;
    }
#endif 

    struct WritableSimVarStruct
    {
        public Int32 simVar;
    }

    private SimConnect simConnect = null;
    public const int WM_USER_SIMCONNECT = 0x0402;
    private ConcurrentQueue<QueueItem> updateQueue = new ConcurrentQueue<QueueItem>();

    private static SimConnectClient simClient = new SimConnectClient();
    private WASimClient waSimClient = null;
    private readonly AutoResetEvent dataUpdateEvent = new AutoResetEvent(false);

    public static SimConnectClient getSimConnectClient()
    {       
        return simClient;
    }

    public SimData simData { get; set; }
    public SimData.GenericPlaneData genericPlaneData { get; set; }
    private string? aircraftTitle = null;

    public SimConnectClient()
    {
        simData = new SimData();
    }

    private void WaSimClient_OnClientEvent(WASimCommander.CLI.Structs.ClientEvent evt)
    {
        if (evt.eventType== WASimCommander.CLI.Enums.ClientEventType.ServerConnected)
        {
            dataUpdateEvent.Set();
        }
    }

    public string Connect(IntPtr whnd)
    {
        if (simConnect != null)
        {
            return "Already Connected";
        }
        try
        {
            _logger.Info("Try connect simulator");
            waSimClient = new WASimClient(0xaddabee);
            waSimClient.OnClientEvent += WaSimClient_OnClientEvent;

            if (waSimClient.connectSimulator()!=WASimCommander.CLI.Enums.HR.OK)
            {
                _logger.Error("Error connect MSFS");
                waSimClient.Dispose();
                return "Cannot connect simulator";
            }

            UInt32 version = waSimClient.pingServer();
            if (version==0)
            {
                _logger.Error("Error WASimCommander Module is not installed");
                waSimClient.Dispose();
                return "WASimCommander module is not found, please copy folder wasimcommander-module in Community Folder of MSFS";
            }

            if (waSimClient.connectServer()!=WASimCommander.CLI.Enums.HR.OK)
            {
                _logger.Error("Error connecting WASimCommander");
                waSimClient.Dispose();
                return "WASimCommander module connection failure";
            }

            if (!dataUpdateEvent.WaitOne(1000))
            {
                _logger.Error("Error connecting WASimCommander");
                waSimClient.Dispose();
                return "WASimCommander module connection failure";
            }

            _logger.Info("Calling SimConnect");
            simConnect = new SimConnect("MSFS Webpanels data request", whnd, WM_USER_SIMCONNECT, null, 0);
            simConnect.OnRecvOpen += new SimConnect.RecvOpenEventHandler(OnRecvOpen);
            simConnect.OnRecvQuit += new SimConnect.RecvQuitEventHandler(OnRecvQuit);
            simConnect.OnRecvException += new SimConnect.RecvExceptionEventHandler(OnRecvException);
            simConnect.OnRecvEvent += new SimConnect.RecvEventEventHandler(OnRecvEvent);
            simConnect.OnRecvSimobjectData += new SimConnect.RecvSimobjectDataEventHandler(OnRecvSimobjectData);
            simConnect.OnRecvSystemState += new SimConnect.RecvSystemStateEventHandler(OnRecvSystemStateHandler);

            simConnect.SubscribeToSystemEvent(EVENT.SIM_PAUSE, "Pause");
            simConnect.SubscribeToSystemEvent(EVENT.SIM_RUNNING, "Sim");

            uint fieldId = 0;

            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "TITLE", null, SIMCONNECT_DATATYPE.STRING256, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC ID", null, SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC MODEL", null, SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC TYPE", null, SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC FLIGHT NUMBER", null, SIMCONNECT_DATATYPE.STRING8, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.GENERAL_PLANE_DATA, "ATC AIRLINE", null, SIMCONNECT_DATATYPE.STRING64, 0, fieldId++);
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
                    SIMCONNECT_PERIOD.SECOND, 0, 0, 1, 0);

#if DEBUG
            fieldId = 0;
            simConnect.AddToDataDefinition(DEFINITION.CUSTOM_DEF, "L:A320_FCU_SHOW_SELECTED_SPEED", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.RegisterDataDefineStruct<CustomStruct>(DEFINITION.CUSTOM_DEF);
#endif

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

            simConnect.MapClientEventToSimEvent(EVENT.AP_MANAGED_SPEED_IN_MACH_TOGGLE, "AP_MANAGED_SPEED_IN_MACH_TOGGLE");
            simConnect.MapClientEventToSimEvent(EVENT.AP_MACH_VAR_SET, "AP_MACH_VAR_SET");
            simConnect.MapClientEventToSimEvent(EVENT.AP_SPD_VAR_SET, "AP_SPD_VAR_SET");
            simConnect.MapClientEventToSimEvent(EVENT.AP_VS_VAR_SET_ENGLISH, "AP_VS_VAR_SET_ENGLISH");
            simConnect.MapClientEventToSimEvent(EVENT.AP_LOC_HOLD, "AP_LOC_HOLD");
            simConnect.MapClientEventToSimEvent(EVENT.AUTO_THROTTLE_ARM, "AUTO_THROTTLE_ARM");
            simConnect.MapClientEventToSimEvent(EVENT.TOGGLE_FLIGHT_DIRECTOR, "TOGGLE_FLIGHT_DIRECTOR");

            _logger.Info("End calling SimConnect");
            return "Success";
        }
        catch (COMException ex)
        {
            _logger.Error(ex.ToString());
            Disconnect();
            return "Unknown error";
        }
    }

    public void Disconnect()
    {
        _logger.Info("Disconnect");
        if (waSimClient != null)
        {
            waSimClient.disconnectServer();
            waSimClient.disconnectSimulator();
            waSimClient.Dispose();
        }
        if (simConnect != null)
        {
            simConnect.Dispose();
        }

        simData.IsSimConnected = false;
        simData.AircraftFolder = null;
        simConnect = null;
        waSimClient = null;
        aircraftTitle = null;
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
        simData.AircraftFolder = null;
        aircraftTitle = null;
        if (simConnect!=null)
        {
            simConnect.Dispose();
            simConnect = null;
        }        
        if (waSimClient!=null)
        {
            waSimClient.Dispose();
            waSimClient = null;
        }
    }

    private void OnRecvException(SimConnect sender, SIMCONNECT_RECV_EXCEPTION data)
    {
        _logger.Error("MSFS Exception:" + data.dwException);
    }

    private void OnRecvSimobjectData(SimConnect sender, SIMCONNECT_RECV_SIMOBJECT_DATA data)
    {
        if (data.dwDefineID == (uint)DEFINITION.PANEL_DATA)
        {
            if (data.dwData[0].GetType()==typeof(A20NSimData.A20NData))
            {
                simData = new A20NSimData(simData);
                A20NSimData pdata = (A20NSimData)simData;
                pdata.simData = (A20NSimData.A20NData)data.dwData[0];
            } else if (data.dwData[0].GetType() == typeof(C172SimData.C172Data))
            {
                simData = new C172SimData(simData);
                C172SimData pdata = (C172SimData)simData;
                pdata.simData = (C172SimData.C172Data)data.dwData[0];
            } else
            {
                simData = new SimData(simData);
            }
        }
        if (data.dwDefineID == (uint)DEFINITION.GENERAL_PLANE_DATA)
        {
            genericPlaneData = (SimData.GenericPlaneData)data.dwData[0];            
            if (!genericPlaneData.AircraftTitle.Equals(this.aircraftTitle))
            {
                _logger.Info("Plane changed:" + genericPlaneData.AircraftTitle);
                simData.AircraftFolder = null;
                if (this.aircraftTitle!=null)
                {
                    simConnect.RequestDataOnSimObject(REQUEST.AIRCRAFT_STATE, DEFINITION.PANEL_DATA, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                            SIMCONNECT_PERIOD.NEVER, 0, 0, 0, 0);
                    simConnect.ClearDataDefinition(DEFINITION.PANEL_DATA);
                }
                simConnect.RequestSystemState(REQUEST.AIRCRAFT_LOADED, "AircraftLoaded");
                this.aircraftTitle = genericPlaneData.AircraftTitle;                
            }
        }
#if DEBUG
        if (data.dwDefineID == (uint)DEFINITION.CUSTOM_DEF)
        {
            CustomStruct customData = (CustomStruct)data.dwData[0];
            //_logger.Info("Connection:" + customData.busConnectionOn);
        }
#endif
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
                } else if (itm.QueueItemType == QUEUEITEM_TYPE.RPN_EXEC)
                {
                    string s = "";
                    for(int i=0;i<itm.IParams.Length;i++)
                    {
                        if (s.Length>0)
                        {
                            s = s + " ";
                        }
                        s = s + itm.IParams[itm.IParams.Length - 1 - i];
                    }
                    if (s.Length > 0)
                    {
                        s = s + " ";
                    }
                    s = s + RPNScripts[itm.Offset];
                    waSimClient.executeCalculatorCode(s);
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

    private void OnRecvSystemStateHandler(SimConnect sender, SIMCONNECT_RECV_SYSTEM_STATE data)
    {
        if (data.dwRequestID == (uint)REQUEST.AIRCRAFT_LOADED)
        {
            int epos = data.szString.LastIndexOf("\\");
            simData.AircraftFolder = data.szString.Substring(21, epos - 21);
            if (("Asobo_A320_NEO").Equals(simData.AircraftFolder))
            {
                A20NSimData.defineSimVarDefintion(simConnect, DEFINITION.PANEL_DATA);
                simConnect.RequestDataOnSimObject(REQUEST.AIRCRAFT_STATE, DEFINITION.PANEL_DATA, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                    SIMCONNECT_PERIOD.VISUAL_FRAME, 0, 0, 0, 0);
            } else
            {
                C172SimData.defineSimVarDefintion(simConnect, DEFINITION.PANEL_DATA);
                simConnect.RequestDataOnSimObject(REQUEST.AIRCRAFT_STATE, DEFINITION.PANEL_DATA, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                    SIMCONNECT_PERIOD.VISUAL_FRAME, 0, 0, 0, 0);
            }
            _logger.Info("OnRecvSystemStateHandler:" + data.szString);
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
        idx = Array.IndexOf(SimConnectClient.RPNEvents, req);
        if (idx >= 0)
        {
            itm.Offset = (uint)idx;
            itm.QueueItemType = QUEUEITEM_TYPE.RPN_EXEC;

        }
        if (itm.Offset>=0)
        {
            updateQueue.Enqueue(itm);
            return 0;
        }
        return -1;
    }

#if DEBUG
    public void sendCustomEvent(string eventName, uint[] values)
    {
        uint[] scParams = new uint[5];
        for(int i=0;i<5 && i<values.Length;i++)
        {
            scParams[i] = values[i];
        }
        simConnect.MapClientEventToSimEvent(EVENT.CUSTOM_EVENT1, eventName);
        simConnect.TransmitClientEvent_EX1(SimConnect.SIMCONNECT_OBJECT_ID_USER, EVENT.CUSTOM_EVENT1,
                     NOTIFICATIONGROUP.DEFAULT_GROUP, SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY, scParams[0], scParams[1], scParams[2], scParams[3], scParams[4]);        
    }

    public void testSimvar()
    {
        /*
        CustomStruct customData = new CustomStruct();
        customData.busLookupIdx = 11;
        customData.apuBleed = 0;
        simConnect.SetDataOnSimObject(DEFINITION.CUSTOM_DEF,
            SimConnect.SIMCONNECT_OBJECT_ID_USER,
            SIMCONNECT_DATA_SET_FLAG.DEFAULT,
            customData
        );
        _logger.Info("xConnection:" + customData.busConnectionOn);
        */
        /*
        CustomStruct customData = new CustomStruct();
        customData.customVar = 2;
        simConnect.SetDataOnSimObject(DEFINITION.CUSTOM_DEF,
            SimConnect.SIMCONNECT_OBJECT_ID_USER,
            SIMCONNECT_DATA_SET_FLAG.DEFAULT,
            customData
        );
        */
        uint[] param = { 2 };
        sendCustomEvent("SPEED_SLOT_INDEX_SET", param);
        CustomStruct customData = new CustomStruct();
        customData.customVar = 0;
        simConnect.SetDataOnSimObject(DEFINITION.CUSTOM_DEF,
            SimConnect.SIMCONNECT_OBJECT_ID_USER,
            SIMCONNECT_DATA_SET_FLAG.DEFAULT,
            customData
        );
        /*
        simConnect.RequestDataOnSimObject(REQUEST.CUSTOM_REQ, DEFINITION.CUSTOM_DEF, SimConnect.SIMCONNECT_OBJECT_ID_USER,
            SIMCONNECT_PERIOD.ONCE, 0, 0, 0, 0); */
    }
#endif
}
