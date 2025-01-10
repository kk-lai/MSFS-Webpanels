using Microsoft.FlightSimulator.SimConnect;
using MSFS_Webpanels;
using System;
using System.Runtime.InteropServices;

public class C172SimData : SimData
{
    private readonly Int32[] FuelSelectorMapTable = { 0, 2, 1, 3 };

    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct C172Data 
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        private String atcId;

        private float fuelLeftQuantity;
		private float fuelRightQuantity;

        private Int32 refEGT;
		private float engineEGT;
		private float engineFuelFlow;

		private float engineOilTemp;
		private float engineOilPressure;

		private float vac;
		private float batteryAmp;

		private float ias;
		private float tasAdj;

		private float attitudePitch;
		private float attitudeBank;
		private float attitudeBarPosition;

		private float altitude;
        private float qnh;

		private Int32 nav1Obs;
		private Int32 nav1ToFrom;
		private Int32 nav1GSFlag;
		private Int32 nav1CDI;
		private Int32 nav1GSI;

		private Int32 tcBallPos;
		private Int32 electricalBusVoltage;
		private float tcRate;
        private Int32 generalPanelOn;

		private Int32 heading;
		private Int32 headingBug;
        private Int32 gyroDriftError;

        private float vsi;

		private Int32 nav2Obs;
        private Int32 nav2ToFrom;
        private Int32 nav2GSFlag;
        private Int32 nav2CDI;
        private Int32 nav2GSI;

        private Int32 engineRPM;

		private Int32 adfCard;
		private Int32 adfRadial;

        private Int32 switchFuelPump;
        private Int32 switchBCN;
        private Int32 switchLAND;
        private Int32 switchTAXI;
        private Int32 switchNAV;
        private Int32 switchSTROBE;
        private Int32 switchPitotHeat;

        private Int32 switchAlternator;
        private Int32 switchBatteryMaster;

        private Int32 switchAvionics1;
        private Int32 switchAvionics2;

        private Int32 engineStarter;
        private Int32 leftMagnetoState;
        private Int32 rightMagnetoState;

        private Int32 flapsPosition;

        private Int32 fuelSelector;
        private Int32 fuelValve;
        private Int32 parkingBrake;

        private Int32 com1ActiveFreq;
        private Int32 com1StandbyFreq;
        private Int32 com2ActiveFreq;
        private Int32 com2StandbyFreq;

        private Int32 nav1ActiveFreq;
        private Int32 nav1StandbyFreq;
        private Int32 nav2ActiveFreq;
        private Int32 nav2StandbyFreq;

        private Int32 adfActiveFreq;
        private Int32 adfStandbyFreq;

        private Int32 apAltitude;
        private Int32 apMaster;
        private Int32 apHeadingLock;
        private Int32 apNavLock;
        private Int32 apAltitudeLock;
        private Int32 apVerticalHold;
        private Int32 apVerticalHoldSpeed;
        private Int32 apApproachHold;
        private Int32 apRevHold;
        private Int32 apGSHold;
        private float dmeDistance;
        private float dmeSpeed;
        private float dmeSignal;
        private Int32 dmeIsAvailable;
        private float dme2Distance;
        private float dme2Speed;
        private float dme2Signal;
        private Int32 dme2IsAvailable;

        private Int32 xpdr;
        private Int32 xpdrSwitch;

        private Int32 com1tx;
        private Int32 com1rx;
        private Int32 com2tx;
        private Int32 com2rx;
        private Int32 nav1rx;
        private Int32 nav2rx;
        private Int32 adfrx;

        private Int32 gpsDriveNav1;
        private float pressureAltitude;
        private Int32 adfVolume;
        private Int32 simulationTime;
        private Int32 com1Volume;
        private Int32 nav1Volume;
        private Int32 com2Volume;
        private Int32 nav2Volume;
        private float qnh2;
        private Int32 audioPanelVolume;
        private Int32 markerTestMute;
        private Int32 markerIsHighSensitivity;
        private Int32 intercomMode;
        private Int32 markerSoundOn;
        private Int32 intercomActive;
        private Int32 dmeSoundOn;
        private Int32 speakerActive;
        private Int32 com3tx;
        private Int32 pilotTxing;
        private Int32 copilotTxing;
        private Int32 pilotTx;
        private Int32 copilotTxType;
        private Int32 insideMarkerOn;
        private Int32 middleMarkerOn;
        private Int32 outsideMarkerOn;
        private Int32 isGearRetractable;
        private Int32 gearHandlePosition;
        private Int32 engineElapsedTime;
        private Int32 hsiCDINeedle;
        private Int32 hsiGSINeedle;
        private Int32 hsiCDINeedleValid;
        private Int32 hsiGSINeedleValid;
        private float hsiDistance;

        public float FuelLeftQuantity { get => fuelLeftQuantity; set => fuelLeftQuantity = value; }
        public float FuelRightQuantity { get => fuelRightQuantity; set => fuelRightQuantity = value; }
        public float EngineEGT { get => engineEGT; set => engineEGT = value; }
        public float EngineFuelFlow { get => engineFuelFlow; set => engineFuelFlow = value; }
        public float EngineOilTemp { get => engineOilTemp; set => engineOilTemp = value; }
        public float EngineOilPressure { get => engineOilPressure; set => engineOilPressure = value; }
        public float Vac { get => vac; set => vac = value; }
        public float BatteryAmp { get => batteryAmp; set => batteryAmp = value; }
        public float Ias { get => ias; set => ias = value; }
        public float TasAdj { get => tasAdj; set => tasAdj = value; }
        public float AttitudePitch { get => attitudePitch; set => attitudePitch = value; }
        public float AttitudeBank { get => attitudeBank; set => attitudeBank = value; }
        public float AttitudeBarPosition { get => attitudeBarPosition; set => attitudeBarPosition = value; }
        public float Altitude { get => altitude; set => altitude = value; }
        public int Nav1Obs { get => nav1Obs; set => nav1Obs = value; }
        public int Nav1ToFrom { get => nav1ToFrom; set => nav1ToFrom = value; }
        public int Nav1GSFlag { get => nav1GSFlag; set => nav1GSFlag = value; }
        public int Nav1CDI { get => nav1CDI; set => nav1CDI = value; }
        public int Nav1GSI { get => nav1GSI; set => nav1GSI = value; }
        public int TcBallPos { get => tcBallPos; set => tcBallPos = value; }
        public float TcRate { get => tcRate; set => tcRate = value; }
        public int Heading { get => heading; set => heading = value; }
        public int HeadingBug { get => headingBug; set => headingBug = value; }
        public float Vsi { get => vsi; set => vsi = value; }
        public int Nav2Obs { get => nav2Obs; set => nav2Obs = value; }
        public int Nav2ToFrom { get => nav2ToFrom; set => nav2ToFrom = value; }
        public int Nav2GSFlag { get => nav2GSFlag; set => nav2GSFlag = value; }
        public int Nav2CDI { get => nav2CDI; set => nav2CDI = value; }
        public int Nav2GSI { get => nav2GSI; set => nav2GSI = value; }
        public int EngineRPM { get => engineRPM; set => engineRPM = value; }
        public int AdfCard { get => adfCard; set => adfCard = value; }
        public int AdfRadial { get => adfRadial; set => adfRadial = value; }
        public int SwitchBCN { get => switchBCN; set => switchBCN = value; }
        public int SwitchLAND { get => switchLAND; set => switchLAND = value; }
        public int SwitchTAXI { get => switchTAXI; set => switchTAXI = value; }
        public int SwitchNAV { get => switchNAV; set => switchNAV = value; }
        public int SwitchSTROBE { get => switchSTROBE; set => switchSTROBE = value; }
        public int SwitchPitotHeat { get => switchPitotHeat; set => switchPitotHeat = value; }
        public int SwitchAlternator { get => switchAlternator; set => switchAlternator = value; }
        public int SwitchBatteryMaster { get => switchBatteryMaster; set => switchBatteryMaster = value; }
        public int SwitchAvionics1 { get => switchAvionics1; set => switchAvionics1 = value; }
        public int SwitchAvionics2 { get => switchAvionics2; set => switchAvionics2 = value; }
        public int LeftMagnetoState { get => leftMagnetoState; set => leftMagnetoState = value; }
        public int RightMagnetoState { get => rightMagnetoState; set => rightMagnetoState = value; }
        public int FlapsPosition { get => flapsPosition; set => flapsPosition = value; }
        public int SwitchFuelPump { get => switchFuelPump; set => switchFuelPump = value; }
        public int GyroDriftError { get => gyroDriftError; set => gyroDriftError = value; }
        public float Qnh { get => qnh; set => qnh = value; }
        public int EngineStarter { get => engineStarter; set => engineStarter = value; }
        public int ElectricalBusVoltage { get => electricalBusVoltage; set => electricalBusVoltage = value; }
        public int FuelSelector { get => fuelSelector; set => fuelSelector = value; }
        public int ParkingBrake { get => parkingBrake; set => parkingBrake = value; }
        public int FuelValve { get => fuelValve; set => fuelValve = value; }
        public string AtcId { get => atcId; set => atcId = value; }
        public int Com1ActiveFreq { get => com1ActiveFreq; set => com1ActiveFreq = value; }
        public int Com1StandbyFreq { get => com1StandbyFreq; set => com1StandbyFreq = value; }
        public int Com2ActiveFreq { get => com2ActiveFreq; set => com2ActiveFreq = value; }
        public int Com2StandbyFreq { get => com2StandbyFreq; set => com2StandbyFreq = value; }
        public int Nav1ActiveFreq { get => nav1ActiveFreq; set => nav1ActiveFreq = value; }
        public int Nav1StandbyFreq { get => nav1StandbyFreq; set => nav1StandbyFreq = value; }
        public int Nav2ActiveFreq { get => nav2ActiveFreq; set => nav2ActiveFreq = value; }
        public int Nav2StandbyFreq { get => nav2StandbyFreq; set => nav2StandbyFreq = value; }
        public int AdfActiveFreq { get => adfActiveFreq; set => adfActiveFreq = value; }
        public int AdfStandbyFreq { get => adfStandbyFreq; set => adfStandbyFreq = value; }
        public int ApAltitude { get => apAltitude; set => apAltitude = value; }
        public int ApMaster { get => apMaster; set => apMaster = value; }
        public int ApHeadingLock { get => apHeadingLock; set => apHeadingLock = value; }
        public int ApNavLock { get => apNavLock; set => apNavLock = value; }
        public int ApAltitudeLock { get => apAltitudeLock; set => apAltitudeLock = value; }
        public int ApVerticalHold { get => apVerticalHold; set => apVerticalHold = value; }
        public int ApVerticalHoldSpeed { get => apVerticalHoldSpeed; set => apVerticalHoldSpeed = value; }
        public int ApApproachHold { get => apApproachHold; set => apApproachHold = value; }
        public int ApRevHold { get => apRevHold; set => apRevHold = value; }
        public int ApGSHold { get => apGSHold; set => apGSHold = value; }
        public float DmeDistance { get => dmeDistance; set => dmeDistance = value; }
        public int XpdrSwitch { get => xpdrSwitch; set => xpdrSwitch = value; }
        public int Xpdr { get => xpdr; set => xpdr = value; }
        public int RefEGT { get => refEGT; set => refEGT = value; }
        public int GeneralPanelOn { get => generalPanelOn; set => generalPanelOn = value; }
        public int Com1tx { get => com1tx; set => com1tx = value; }
        public int Com1rx { get => com1rx; set => com1rx = value; }
        public int Com2tx { get => com2tx; set => com2tx = value; }
        public int Com2rx { get => com2rx; set => com2rx = value; }
        public int Nav1rx { get => nav1rx; set => nav1rx = value; }
        public int Nav2rx { get => nav2rx; set => nav2rx = value; }
        public int Adfrx { get => adfrx; set => adfrx = value; }
        public int GpsDriveNav1 { get => gpsDriveNav1; set => gpsDriveNav1 = value; }
        public float DmeSpeed { get => dmeSpeed; set => dmeSpeed = value; }
        public float DmeSignal { get => dmeSignal; set => dmeSignal = value; }
        public int DmeIsAvailable { get => dmeIsAvailable; set => dmeIsAvailable = value; }
        public float Dme2Distance { get => dme2Distance; set => dme2Distance = value; }
        public float Dme2Speed { get => dme2Speed; set => dme2Speed = value; }
        public float Dme2Signal { get => dme2Signal; set => dme2Signal = value; }
        public int Dme2IsAvailable { get => dme2IsAvailable; set => dme2IsAvailable = value; }
        public float PressureAltitude { get => pressureAltitude; set => pressureAltitude = value; }
        public Int32 AdfVolume { get => adfVolume; set => adfVolume = value; }
        public int SimulationTime { get => simulationTime; set => simulationTime = value; }
        public int Com1Volume { get => com1Volume; set => com1Volume = value; }
        public int Nav1Volume { get => nav1Volume; set => nav1Volume = value; }
        public int Com2Volume { get => com2Volume; set => com2Volume = value; }
        public int Nav2Volume { get => nav2Volume; set => nav2Volume = value; }
        public float Qnh2 { get => qnh2; set => qnh2 = value; }
        public int AudioPanelVolume { get => audioPanelVolume; set => audioPanelVolume = value; }
        public int MarkerTestMute { get => markerTestMute; set => markerTestMute = value; }
        public int MarkerIsHighSensitivity { get => markerIsHighSensitivity; set => markerIsHighSensitivity = value; }
        public int IntercomMode { get => intercomMode; set => intercomMode = value; }
        public int MarkerSoundOn { get => markerSoundOn; set => markerSoundOn = value; }
        public int IntercomActive { get => intercomActive; set => intercomActive = value; }
        public int DmeSoundOn { get => dmeSoundOn; set => dmeSoundOn = value; }
        public int SpeakerActive { get => speakerActive; set => speakerActive = value; }
        public int Com3tx { get => com3tx; set => com3tx = value; }

        public int PilotTx { get => pilotTx; set => pilotTx = value; }
        public int CopilotTxType { get => copilotTxType; set => copilotTxType = value; }
        public int InsideMarkerOn { get => insideMarkerOn; set => insideMarkerOn = value; }
        public int MiddleMarkerOn { get => middleMarkerOn; set => middleMarkerOn = value; }
        public int OutsideMarkerOn { get => outsideMarkerOn; set => outsideMarkerOn = value; }
        public int PilotTxing { get => pilotTxing; set => pilotTxing = value; }
        public int CopilotTxing { get => copilotTxing; set => copilotTxing = value; }

        public int IsGearRetractable { get => isGearRetractable; set => isGearRetractable = value; }
        public int GearHandlePosition { get => gearHandlePosition; set => gearHandlePosition = value; }
        public Int32 EngineElapsedTime { get => engineElapsedTime; set => engineElapsedTime = value; }
        public int HsiCDINeedle { get => hsiCDINeedle; set => hsiCDINeedle = value; }
        public int HsiGSINeedle { get => hsiGSINeedle; set => hsiGSINeedle = value; }
        public int HsiCDINeedleValid { get => hsiCDINeedleValid; set => hsiCDINeedleValid = value; }
        public int HsiGSINeedleValid { get => hsiGSINeedleValid; set => hsiGSINeedleValid = value; }
        public float HsiDistance { get => hsiDistance; set => hsiDistance = value; }
        
    }
    private C172Data c172data = new C172Data();

    public C172Data simData { get => c172data; set => c172data = value; }

    public C172SimData(SimData data) : base(data)
    {

    }

    public static void defineSimVarDefintion(SimConnect simConnect, Enum defId, uint msfsVersion)
    {
        uint fieldId = 0;
        simConnect.AddToDataDefinition(defId, "ATC ID", null, SIMCONNECT_DATATYPE.STRING256, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "FUEL LEFT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "FUEL RIGHT QUANTITY", "gallon", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "ENG EXHAUST GAS TEMPERATURE GES:1", "percent scaler 32k", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ENG EXHAUST GAS TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ENG FUEL FLOW GPH:1", "Gallons per hour", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "GENERAL ENG OIL TEMPERATURE:1", "Rankine", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "GENERAL ENG OIL PRESSURE:1", "psi", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "SUCTION PRESSURE", "inHg", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ELECTRICAL BATTERY LOAD", "Amperes", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "AIRSPEED INDICATED", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AIRSPEED TRUE CALIBRATE", "Degrees", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "ATTITUDE INDICATOR PITCH DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ATTITUDE INDICATOR BANK DEGREES", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ATTITUDE BARS POSITION", "percent", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "INDICATED ALTITUDE", "ft", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING MB", "millibar scaler 16", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "NAV OBS:1", "Degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV TOFROM:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV GS FLAG:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV CDI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV GSI:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "TURN COORDINATOR BALL", "Position 128", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        if (msfsVersion == SimConnectClient.MSFS2024)
        {
            simConnect.AddToDataDefinition(defId, "ELECTRICAL BUS VOLTAGE:5", "volts", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        } else
        {
            simConnect.AddToDataDefinition(defId, "ELECTRICAL MAIN BUS VOLTAGE:1", "volts", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        }        

        simConnect.AddToDataDefinition(defId, "TURN INDICATOR RATE", "degrees per second", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "CIRCUIT GENERAL PANEL ON", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "HEADING INDICATOR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT HEADING LOCK DIR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "GYRO DRIFT ERROR", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "VERTICAL SPEED", "feet/minute", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "NAV OBS:2", "Degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV TOFROM:2", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV GS FLAG:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV CDI:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV GSI:2", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "GENERAL ENG RPM:1", "RPM", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "ADF CARD", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ADF RADIAL:1", "degree", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        
        if (msfsVersion == SimConnectClient.MSFS2024)
        {
            simConnect.AddToDataDefinition(defId, "FUELSYSTEM PUMP SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        } else
        {
            simConnect.AddToDataDefinition(defId, "GENERAL ENG FUEL PUMP SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        }
        
        simConnect.AddToDataDefinition(defId, "LIGHT BEACON", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "LIGHT LANDING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "LIGHT TAXI", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "LIGHT NAV", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "LIGHT STROBE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "PITOT HEAT SWITCH:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "GENERAL ENG MASTER ALTERNATOR:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        if (msfsVersion == SimConnectClient.MSFS2024)
        {
            simConnect.AddToDataDefinition(defId, "ELECTRICAL MASTER BATTERY:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "LINE CONNECTION ON:8", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "LINE CONNECTION ON:14", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        } else
        {
            simConnect.AddToDataDefinition(defId, "ELECTRICAL MASTER BATTERY:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AVIONICS MASTER SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AVIONICS MASTER SWITCH:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        }
            
        simConnect.AddToDataDefinition(defId, "GENERAL ENG STARTER:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "RECIP ENG LEFT MAGNETO:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "RECIP ENG RIGHT MAGNETO:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "FLAPS HANDLE INDEX", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        if (msfsVersion == SimConnectClient.MSFS2024)
        {
            simConnect.AddToDataDefinition(defId, "FUELSYSTEM JUNCTION SETTING:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "FUELSYSTEM VALVE SWITCH:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        } else
        {
            simConnect.AddToDataDefinition(defId, "FUEL TANK SELECTOR:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "GENERAL ENG FUEL VALVE:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        }

        simConnect.AddToDataDefinition(defId, "BRAKE PARKING POSITION", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "COM ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM ACTIVE FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM STANDBY FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "NAV ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV ACTIVE FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV STANDBY FREQUENCY:2", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "ADF ACTIVE FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ADF STANDBY FREQUENCY:1", "Kilohertz", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE LOCK VAR", "Feet", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT MASTER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT HEADING LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT NAV1 LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT VERTICAL HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT VERTICAL HOLD VAR", "feet/minute", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT APPROACH HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT BACKCOURSE HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "AUTOPILOT GLIDESLOPE HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "NAV DME:1", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV DMESPEED:1", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV SIGNAL:1", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV HAS DME:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV DME:2", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV DMESPEED:2", "Knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV SIGNAL:2", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV HAS DME:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "TRANSPONDER CODE:1", "Bco16", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "TRANSPONDER STATE:1", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "COM TRANSMIT:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM RECEIVE EX1:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM TRANSMIT:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM RECEIVE EX1:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV SOUND:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV SOUND:2", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ADF SOUND:1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "GPS DRIVES NAV1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "INDICATED ALTITUDE:3", "Feet", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "ADF VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "SIMULATION TIME", "second", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV VOLUME:1", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COM VOLUME:2", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "NAV VOLUME:2", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING MB:2", "millibar scaler 16", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

        // VOL
        simConnect.AddToDataDefinition(defId, "AUDIO PANEL VOLUME", "percent", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        // HI/LO/TM EVT MARKER_BEACON_TEST_MUTE MARKER_BEACON_SENSITIVITY_HIGH
        simConnect.AddToDataDefinition(defId, "MARKER BEACON TEST MUTE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "MARKER BEACON SENSITIVITY HIGH", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        // ISO ALL CREW, EVT = INTERCOM_MODE_SET
        simConnect.AddToDataDefinition(defId, "INTERCOM MODE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "MARKER SOUND", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        // ICS ?
        simConnect.AddToDataDefinition(defId, "INTERCOM SYSTEM ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        // AUX Missing?
        simConnect.AddToDataDefinition(defId, "DME SOUND", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "SPEAKER ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        // COM3/2/1 COM1/2 COM2/1 TEL
        simConnect.AddToDataDefinition(defId, "COM TRANSMIT:3", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "PILOT TRANSMITTING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COPILOT TRANSMITTING", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "PILOT TRANSMITTER TYPE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "COPILOT TRANSMITTER TYPE", "Enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "INNER MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "MIDDLE MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "OUTER MARKER", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

        simConnect.AddToDataDefinition(defId, "IS GEAR RETRACTABLE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "GEAR HANDLE POSITION", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "GENERAL ENG ELAPSED TIME:1", "hours over 10", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "HSI CDI NEEDLE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "HSI GSI NEEDLE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "HSI CDI NEEDLE VALID", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "HSI GSI NEEDLE VALID", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
        simConnect.AddToDataDefinition(defId, "HSI DISTANCE", "decinmile", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);        
        simConnect.RegisterDataDefineStruct<C172SimData.C172Data>(defId);
    }

    public override int processWebrequest(string req, uint[] iparams)
    {
        if (MsfsMajorVersion == SimConnectClient.MSFS2024)
        {
            string nreq = null;
            uint[] niparams = new uint[2];

            if (req == "simvar-fuelselectorleft")
            {
                nreq = "simvar-fuelselector";
                niparams[0] = 1;
                niparams[1] = 1;
            }
            else if (req == "simvar-fuelselectorall")
            {
                nreq = "simvar-fuelselector";
                niparams[0] = 1;
                niparams[1] = 2;
            }
            else if (req == "simvar-fuelselectorright")
            {
                nreq = "simvar-fuelselector";
                niparams[0] = 1;
                niparams[1] = 3;
            }
            else if (req == "simvar-switchavionics1")
            {
                nreq = "simvar-electlineconset";
                niparams[0] = 8;
                niparams[1] = iparams[0];
            }
            else if (req == "simvar-switchavionics2")
            {
                nreq = "simvar-electlineconset";
                niparams[0] = 14;
                niparams[1] = iparams[0];
            } else if (req == "simvar-switchfuelpump")
            {
                nreq = req;
                niparams[0] = 1;
            }

            if (nreq!=null)
            {
                req = nreq;
                iparams = niparams;
            }
        }
        return base.processWebrequest(req, iparams);
    }

    public override void postDataUpdate()
    {
        if (MsfsMajorVersion== SimConnectClient.MSFS2024)
        {
            this.c172data.FuelSelector = FuelSelectorMapTable[this.c172data.FuelSelector];
        }
    }
}
