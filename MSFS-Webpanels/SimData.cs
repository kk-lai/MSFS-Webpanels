using Microsoft.FlightSimulator.SimConnect;
using MSFS_Webpanels;
using System;
using System.Runtime.InteropServices;

public class SimData
{
    
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct GenericPlaneData
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
        private string aircraftTitle;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)]
        private string atcId;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)]
        private string atcModel;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)]
        private string atcType;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 8)]
        private string atcFlightNumber;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 64)]
        private string atcAirline;

        private float planeLatitude;
        private float planeLongitude;
        private float planeAltitude;
        private float planeGroundSpeed;
        private float planeTrueHeading;
        private float planeWingSpan;
        private int planeOnGround;
        private int planeEngineType;
        private int planeNumberOfEngines;

        public string AircraftTitle { get => aircraftTitle; set => aircraftTitle = value; }
        public float PlaneLatitude { get => planeLatitude; set => planeLatitude = value; }
        public float PlaneLongitude { get => planeLongitude; set => planeLongitude = value; }
        public float PlaneAltitude { get => planeAltitude; set => planeAltitude = value; }
        public float PlaneGroundSpeed { get => planeGroundSpeed; set => planeGroundSpeed = value; }
        public float PlaneTrueHeading { get => planeTrueHeading; set => planeTrueHeading = value; }
        public string AtcId { get => atcId; set => atcId = value; }
        public string AtcModel { get => atcModel; set => atcModel = value; }
        public string AtcType { get => atcType; set => atcType = value; }
        public string AtcFlightNumber { get => atcFlightNumber; set => atcFlightNumber = value; }
        public string AtcAirline { get => atcAirline; set => atcAirline = value; }
        public float PlaneWingSpan { get => planeWingSpan; set => planeWingSpan = value; }
        public int PlaneOnGround { get => planeOnGround; set => planeOnGround = value; }
        public int PlaneEngineType { get => planeEngineType; set => planeEngineType = value; }
        public int PlaneNumberOfEngines { get => planeNumberOfEngines; set => planeNumberOfEngines = value; }
    }

    private bool isSimConnected;
    private bool isSimRunning;
    private bool isPaused;
    private string? aircraftFolder;

    public SimData()
    {

    }

    public SimData(SimData data)
    {
        this.isPaused = data.isPaused;
        this.isSimRunning = data.isSimRunning;
        this.isSimConnected = data.isSimConnected;
        this.aircraftFolder = data.aircraftFolder;
    }

    public bool IsPaused { get => isPaused; set => isPaused = value; }
    public bool IsSimRunning { get => isSimRunning; set => isSimRunning = value; }
    public bool IsSimConnected { get => isSimConnected; set => isSimConnected = value; }
    public string? AircraftFolder { get => aircraftFolder; set => aircraftFolder = value; }
}
