using System;

public class SimData
{

    private bool isSimConnected;
    private bool isSimRunning;
    private bool isPaused;
    private string aircraftType;

    public bool IsPaused { get => isPaused; set => isPaused = value; }
    public bool IsSimRunning { get => isSimRunning; set => isSimRunning = value; }
    public bool IsSimConnected { get => isSimConnected; set => isSimConnected = value; }
    public string AircraftType { get => aircraftType; set => aircraftType = value; }
}
