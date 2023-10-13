using System;
using Microsoft.FlightSimulator.SimConnect;
using System.Runtime.InteropServices;
using System.Reflection.Metadata;
using Microsoft.VisualBasic;

public class SimConnectClient
{
    enum REQUEST
    {
        AIRCRAFT_LOADED,
        AIRCRAFT_STATE
    };

    enum DEFINITION
    {
        C172_FPANEL,
        TRANSPONDER_STATE
    };

    public enum EVENT
    {
        SIM_PAUSE,
        SIM_RUNNING,
        AIRCRAFT_LOADED,

        SET_EGT_REF,
        SET_TAS_ADJ,
        SET_ATTITUDE_BAR_POSITION,


        SET_GYRO_DRIFT_ERROR,
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
        SET_AP_ALTITUDE,
        SWAP_COM1_FREQ,
        SWAP_COM2_FREQ,
        SWAP_NAV1_FREQ,
        SWAP_NAV2_FREQ,
        SWAP_ADF_FREQ,

        INC_COM1_25K,
        INC_COM2_25K,

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
        FLAPS_INCR
    };

    enum NOTIFICATIONGROUP
    {
        DEFAULT_GROUP
    }

    struct TransponderState
    {
        public uint state;
    }

    private SimConnect simConnect = null;
    private SimData simData = new SimData();
    public const int WM_USER_SIMCONNECT = 0x0402;

    private static SimConnectClient? simClient =  null;

    public static SimConnectClient getSimConnectClient()
    {
        if (simClient==null)
        {
            simClient = new SimConnectClient();
        }
        return simClient;
    }

    public SimData SimData { get => simData; set => simData = value; }

    public SimConnectClient()
    {
    }

    public void Connect(IntPtr whnd)
    {
        if (simConnect!=null)
        {
            return;
        }
        try
        {
            simConnect = new SimConnect("MSFS Webpanels data request", whnd, WM_USER_SIMCONNECT, null, 0);
            simConnect.OnRecvOpen += new SimConnect.RecvOpenEventHandler(OnRecvOpen);
            simConnect.OnRecvQuit += new SimConnect.RecvQuitEventHandler(OnRecvQuit);
            simConnect.OnRecvException += new SimConnect.RecvExceptionEventHandler(OnRecvException);
            simConnect.OnRecvEvent += new SimConnect.RecvEventEventHandler(OnRecvEvent);
            simConnect.OnRecvEventFilename += new SimConnect.RecvEventFilenameEventHandler(OnRecvFilenameEvent);

            simConnect.OnRecvSimobjectData += new SimConnect.RecvSimobjectDataEventHandler(OnRecvSimobjectData);
            simConnect.SubscribeToSystemEvent(EVENT.AIRCRAFT_LOADED, "AircraftLoaded");
            simConnect.SubscribeToSystemEvent(EVENT.SIM_PAUSE, "Pause");
            simConnect.SubscribeToSystemEvent(EVENT.SIM_RUNNING, "Sim");
            uint fieldId = 0;
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATC ID", null, SIMCONNECT_DATATYPE.STRING256, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FUEL LEFT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32 ,0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "FUEL RIGHT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            // todo: ref egt
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG EXHAUST GAS TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG FUEL FLOW GPH:1", "Gallons per hour", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG OIL TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ENG OIL PRESSURE:1", "psi", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "SUCTION PRESSURE", "inHg", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ELECTRICAL BATTERY LOAD", "Amperes", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AIRSPEED INDICATED", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "AIRSPEED TRUE CALIBRATE", "Degrees", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE INDICATOR PITCH DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE INDICATOR BANK DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ATTITUDE BARS POSITION", "percent over 100", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);           

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "INDICATED ALTITUDE", "ft", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "KOHLSMAN SETTING MB", "Millibars", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV OBS:1", "Degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV TOFROM:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GS FLAG:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV CDI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV GSI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TURN COORDINATOR BALL", "Position 128", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "ELECTRICAL MAIN BUS VOLTAGE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TURN INDICATOR RATE", "degrees per second", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

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

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING VACUUM LEFT", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING VACUUM RIGHT", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING VACUUM", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING VOLTAGE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING OIL PRESSURE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING FUEL LEFT", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING FUEL RIGHT", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "WARNING FUEL", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

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

            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "NAV DME:1", "decinmile", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TRANSPONDER CODE:1", "Bco16", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "TRANSPONDER STATE:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.RequestDataOnSimObject(REQUEST.AIRCRAFT_STATE, DEFINITION.C172_FPANEL, SimConnect.SIMCONNECT_OBJECT_ID_USER,
                SIMCONNECT_PERIOD.VISUAL_FRAME, 0, 0, 0, 0);
            simConnect.RegisterDataDefineStruct<C172SimData.C172Data>(DEFINITION.C172_FPANEL);


            fieldId = 0;
            simConnect.AddToDataDefinition(DEFINITION.TRANSPONDER_STATE, "TRANSPONDER STATE:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, 0);
            simConnect.RegisterDataDefineStruct<TransponderState>(DEFINITION.TRANSPONDER_STATE);

            /*
            simConnect.AddToDataDefinition(DEFINITION.C172_FPANEL, "", "", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            */

            simConnect.MapClientEventToSimEvent(EVENT.SET_EGT_REF, "EGT_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_TAS_ADJ, "TRUE_AIRSPEED_CAL_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_ATTITUDE_BAR_POSITION, "ATTITUDE_BARS_POSITION_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_GYRO_DRIFT_ERROR, "GYRO_DRIFT_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_HEADING_BUG, "HEADING_BUG_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_QNH, "KOHLSMAN_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_NAV1_OBS, "VOR1_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_NAV2_OBS, "VOR2_SET");    
            simConnect.MapClientEventToSimEvent(EVENT.SET_ADF_CARD, "ADF_CARD_SET");
            /*
            simConnect.MapClientEventToSimEvent(EVENT.SET_MAGNETO_OFF, "MAGNETO_OFF");
            simConnect.MapClientEventToSimEvent(EVENT.SET_MAGNETO_RIGHT, "MAGNETO_RIGHT");
            simConnect.MapClientEventToSimEvent(EVENT.SET_MAGNETO_LEFT, "MAGNETO_LEFT");
            simConnect.MapClientEventToSimEvent(EVENT.SET_MAGNETO_BOTH, "MAGNETO_BOTH");
            simConnect.MapClientEventToSimEvent(EVENT.SET_MAGNETO_START, "MAGNETO_START");
            */
            simConnect.MapClientEventToSimEvent(EVENT.MAGNETO_DECR, "MAGNETO_DECR");
            simConnect.MapClientEventToSimEvent(EVENT.MAGNETO_INCR, "MAGNETO_INCR");

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

            simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_LEFT, "FUEL_SELECTOR_LEFT");
            simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_ALL, "FUEL_SELECTOR_ALL");
            simConnect.MapClientEventToSimEvent(EVENT.SET_FUEL_SELECTOR_RIGHT, "FUEL_SELECTOR_RIGHT");

            simConnect.MapClientEventToSimEvent(EVENT.SET_COM1_STANDBY, "COM_STBY_RADIO_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_COM2_STANDBY, "COM2_STBY_RADIO_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_COM2_STANDBY, "COM2_STBY_RADIO_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_COM2_STANDBY, "COM2_STBY_RADIO_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_NAV1_STANDBY, "NAV1_STBY_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_NAV2_STANDBY, "NAV2_STBY_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_ADF_STANDBY, "ADF_STBY_SET");
            simConnect.MapClientEventToSimEvent(EVENT.SET_AP_ALTITUDE, "AP_ALT_VAR_SET_ENGLISH");
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

            simConnect.MapClientEventToSimEvent(EVENT.INC_COM1_25K, "COM_RADIO_FRACT_INC");
            simConnect.MapClientEventToSimEvent(EVENT.INC_COM2_25K, "COM2_RADIO_FRACT_INC");

            simConnect.MapClientEventToSimEvent(EVENT.SET_XPDR_CODE, "XPNDR_SET");

        }
        catch (COMException ex)
        {

        }
    }

    public void Disconnect()
    {
        if (simConnect == null)
        {
            return;
        }
        simConnect.Dispose();
        simData.IsSimConnected = false;
        simConnect = null;        
    }

    public void SimConnectMsgHandler()
    {
        if (simConnect!=null)
        {
            try
            {
                simConnect.ReceiveMessage();
            } catch (Exception e)
            {

            }
            
        }
    }
    
    private void OnRecvOpen(SimConnect sender, SIMCONNECT_RECV_OPEN data)
    {
        simData.IsSimConnected = true;
    }

    private void OnRecvQuit(SimConnect sender, SIMCONNECT_RECV data)
    {
        simData.IsSimConnected = false;
    }

    private void OnRecvException(SimConnect sender, SIMCONNECT_RECV_EXCEPTION data)
    {
        Console.WriteLine(data.ToString);
    }
    
    private void OnRecvSimobjectData(SimConnect sender, SIMCONNECT_RECV_SIMOBJECT_DATA data)
    {
        Console.WriteLine("OnRecvSimobjectData");
        if (data.dwDefineID==(uint)DEFINITION.C172_FPANEL)
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
            simData = ndata;
        }
    }

    private void OnRecvEvent(SimConnect sender, SIMCONNECT_RECV_EVENT data)
    {
        switch ((EVENT)data.uEventID)
        {
            case EVENT.SIM_RUNNING:
                Console.WriteLine("Sim Running");
                simData.IsSimRunning = (data.dwData == 1); ;
                break;
            case EVENT.SIM_PAUSE:
                Console.WriteLine("Sim Paused");
                simData.IsPaused = (data.dwData == 1);
                break;
        }
    }

    private void OnRecvFilenameEvent(SimConnect sender, SIMCONNECT_RECV_EVENT_FILENAME data)
    {
        if (data.uEventID==(uint)EVENT.AIRCRAFT_LOADED)
        {
            simData.AircraftCFGPath = data.szFileName;
        }
    }

    public void setSimpleVar(uint vidx, uint val)
    {
        try { 
        uint evt = (uint)EVENT.SET_GYRO_DRIFT_ERROR + vidx;
            simConnect.TransmitClientEvent(SimConnect.SIMCONNECT_OBJECT_ID_USER, (EVENT)evt,
               val, NOTIFICATIONGROUP.DEFAULT_GROUP, SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY);
        } catch (Exception e)
        {

        }
    }

    public void sendEventToSimulator(SimConnectClient.EVENT evt, uint val)
    {
        simConnect.TransmitClientEvent(SimConnect.SIMCONNECT_OBJECT_ID_USER, evt,
               val, NOTIFICATIONGROUP.DEFAULT_GROUP, SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY);
    }

    public void setMagneto(uint pos)
    {
        transmitEventOffset(EVENT.MAGNETO_DECR, pos);
    }

    public void setFlaps(uint pos)
    {
        transmitEventOffset(EVENT.FLAPS_DECR, pos);
    }

    public void setFuelSelector(uint pos)
    {
        transmitEventOffset(EVENT.SET_FUEL_SELECTOR_LEFT, pos);
    }

    private void transmitEventOffset(EVENT firstEvent, uint idx)
    {
        try { 
            uint evt = (uint)firstEvent + idx;
            simConnect.TransmitClientEvent(SimConnect.SIMCONNECT_OBJECT_ID_USER, (EVENT)evt,
               0, NOTIFICATIONGROUP.DEFAULT_GROUP, SIMCONNECT_EVENT_FLAG.GROUPID_IS_PRIORITY);
        } catch (Exception e)
        {

        }
    }

    public void setTransponderSwitch(uint pos)
    {
        simConnect.SetDataOnSimObject(DEFINITION.TRANSPONDER_STATE, 
            SimConnect.SIMCONNECT_OBJECT_ID_USER, 
            SIMCONNECT_DATA_SET_FLAG.DEFAULT,
            new TransponderState { state = pos }
        );
    }
}
