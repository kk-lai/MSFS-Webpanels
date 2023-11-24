using Microsoft.FlightSimulator.SimConnect;
using MSFS_Webpanels;
using System;
using System.Runtime.InteropServices;

public class SimData
{
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct GenericData
    {
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 256)]
        private String atcModel;
        private float planeLatitude;
        private float planeLongitude;
        private float planeAltitude;
        private float planeGroundSpeed;
        private float planeTrueHeading;

        public string AtcModel { get => atcModel; set => atcModel = value; }
        public float PlaneLatitude { get => planeLatitude; set => planeLatitude = value; }
        public float PlaneLongitude { get => planeLongitude; set => planeLongitude = value; }
        public float PlaneAltitude { get => planeAltitude; set => planeAltitude = value; }
        public float PlaneGroundSpeed { get => planeGroundSpeed; set => planeGroundSpeed = value; }
        public float PlaneTrueHeading { get => planeTrueHeading; set => planeTrueHeading = value; }
    }


    private bool isSimConnected;
    private bool isSimRunning;
    private bool isPaused;

    private GenericData generalPlaneData = new GenericData();

    public bool IsPaused { get => isPaused; set => isPaused = value; }
    public bool IsSimRunning { get => isSimRunning; set => isSimRunning = value; }
    public bool IsSimConnected { get => isSimConnected; set => isSimConnected = value; }
    public GenericData GeneralPlaneData { get => generalPlaneData; set => generalPlaneData = value; }
}
