using Microsoft.FlightSimulator.SimConnect;
using MSFS_Webpanels;
using System;
using System.Runtime.InteropServices;

public class SimData
{
    
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
    public struct GenericPlaneData
    {
        private float simulationRate;
        [MarshalAs(UnmanagedType.ByValTStr, SizeConst = 128)]
        private string aircraftTitle;

        public string AircraftTitle { get => aircraftTitle; set => aircraftTitle = value; }        
        public float SimulationRate { get => simulationRate; set => simulationRate = value; }
    }

    private bool isSimConnected;
    private bool isSimRunning;
    private bool isPaused;
    private string? aircraftFolder;
    private bool isDebug;
    private UInt32 msfsMajorVersion;
    private UInt32 msfsMinorVersion;
    private float simulationRate;

    public SimData()
    {

    }

    public SimData(SimData data)
    {
        this.isPaused = data.isPaused;
        this.isSimRunning = data.isSimRunning;
        this.isSimConnected = data.isSimConnected;
        this.aircraftFolder = data.aircraftFolder;
        this.msfsMajorVersion = data.msfsMajorVersion;
        this.msfsMinorVersion = data.msfsMinorVersion;
        this.SimulationRate = data.SimulationRate;
        this.isDebug = data.isDebug;
    }

    public bool IsPaused { get => isPaused; set => isPaused = value; }
    public bool IsSimRunning { get => isSimRunning; set => isSimRunning = value; }
    public bool IsSimConnected { get => isSimConnected; set => isSimConnected = value; }
    public string? AircraftFolder { get => aircraftFolder; set => aircraftFolder = value; }
    public bool IsDebug { get => isDebug; set => isDebug = value; }
    public uint MsfsMajorVersion { get => msfsMajorVersion; set => msfsMajorVersion = value; }
    public uint MsfsMinorVersion { get => msfsMinorVersion; set => msfsMinorVersion = value; }
    public float SimulationRate { get => simulationRate; set => simulationRate = value; }

    public virtual int processWebrequest(string req, uint[] iparams)
    {
        return SimConnectClient.getSimConnectClient().processWebRequest(req, iparams);
    }

    public virtual void postDataUpdate()
    {

    }
}
