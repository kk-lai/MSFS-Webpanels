using MSFS_Webpanels;
using System;
using System.Runtime.InteropServices;

public class C172SimData : SimData
{
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
    }
    private C172Data c172data = new C172Data();

    public C172Data simData { get => c172data; set => c172data = value; }

    public C172SimData(SimData data)
	{
		IsSimConnected = data.IsSimConnected;
		IsSimRunning = data.IsSimRunning;
		IsPaused = data.IsPaused;
        GeneralPlaneData = data.GeneralPlaneData;
    }
}
