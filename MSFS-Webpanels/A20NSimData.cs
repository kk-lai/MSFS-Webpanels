﻿using Microsoft.FlightSimulator.SimConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Policy;
using System.Text;
using System.Threading.Tasks;
using static C172SimData;

namespace MSFS_Webpanels
{
    public class A20NSimData : SimData
    {
        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
        public struct A20NData
        {
            private Int32 isCircuitGeneralPanelOn;
            private Int32 isMachActive;
            private Int32 showSelectedSpeed;
            private Int32 autoPilotAirspeedSlotIndex;
            private float autoPilotSelectedMachHoldValue;
            private float autoPilotSelectedAirspeedHoldValue;
            private Int32 isLateralModeActive;
            private Int32 isTRKMode;
            private Int32 showSelectedHeading;
            private Int32 autoPilotAPPRHold;
            private Int32 autoPilotHeadingSlotIndex;
            private float autoPilotDisplayedHeadingLockValueDegrees;
            private Int32 autoPilotAltitudeManaged;
            private float autoPilotDisplayedAltitudeLockValueFeet;
            private Int32 fcuState;
            private Int32 autoPilotSelectedVerticalSpeedHoldValue;
            private Int32 autoPilot1Status;
            private Int32 autoPilot2Status;
            private Int32 autoPilotThrottleArm;
            private Int32 autoPilotAltInc;
            private float indicatedSpeed;
            private float indicatedSpeedMach;
            private Int32 autoPilotHeadingLockActive;
            private Int32 autoPilotAltitudeSlotIndex;
            private float headingMagnetic;
            private float gpsGroundTrack;
            private float gpsGroundSpeed;
            private Int32 autoPilotGlideslopeHold;

            public int IsCircuitGeneralPanelOn { get => isCircuitGeneralPanelOn; set => isCircuitGeneralPanelOn = value; }
            public int IsMachActive { get => isMachActive; set => isMachActive = value; }
            public int ShowSelectedSpeed { get => showSelectedSpeed; set => showSelectedSpeed = value; }
            public int AutoPilotAirspeedSlotIndex { get => autoPilotAirspeedSlotIndex; set => autoPilotAirspeedSlotIndex = value; }
            public float AutoPilotSelectedMachHoldValue { get => autoPilotSelectedMachHoldValue; set => autoPilotSelectedMachHoldValue = value; }
            public float AutoPilotSelectedAirspeedHoldValue { get => autoPilotSelectedAirspeedHoldValue; set => autoPilotSelectedAirspeedHoldValue = value; }
            public int IsLateralModeActive { get => isLateralModeActive; set => isLateralModeActive = value; }
            public int IsTRKMode { get => isTRKMode; set => isTRKMode = value; }
            public int ShowSelectedHeading { get => showSelectedHeading; set => showSelectedHeading = value; }
            public int AutoPilotAPPRHold { get => autoPilotAPPRHold; set => autoPilotAPPRHold = value; }
            public int AutoPilotHeadingSlotIndex { get => autoPilotHeadingSlotIndex; set => autoPilotHeadingSlotIndex = value; }
            public float AutoPilotDisplayedHeadingLockValueDegrees { get => autoPilotDisplayedHeadingLockValueDegrees; set => autoPilotDisplayedHeadingLockValueDegrees = value; }
            public int AutoPilotAltitudeManaged { get => autoPilotAltitudeManaged; set => autoPilotAltitudeManaged = value; }
            public float AutoPilotDisplayedAltitudeLockValueFeet { get => autoPilotDisplayedAltitudeLockValueFeet; set => autoPilotDisplayedAltitudeLockValueFeet = value; }
            public int FcuState { get => fcuState; set => fcuState = value; }
            public int AutoPilotSelectedVerticalSpeedHoldValue { get => autoPilotSelectedVerticalSpeedHoldValue; set => autoPilotSelectedVerticalSpeedHoldValue = value; }
            public int AutoPilot1Status { get => autoPilot1Status; set => autoPilot1Status = value; }
            public int AutoPilot2Status { get => autoPilot2Status; set => autoPilot2Status = value; }
            public int AutoPilotThrottleArm { get => autoPilotThrottleArm; set => autoPilotThrottleArm = value; }
            public int AutoPilotAltInc { get => autoPilotAltInc; set => autoPilotAltInc = value; }
            public float IndicatedSpeed { get => indicatedSpeed; set => indicatedSpeed = value; }
            public float IndicatedSpeedMach { get => indicatedSpeedMach; set => indicatedSpeedMach = value; }
            public int AutoPilotHeadingLockActive { get => autoPilotHeadingLockActive; set => autoPilotHeadingLockActive = value; }
            public int AutoPilotAltitudeSlotIndex { get => autoPilotAltitudeSlotIndex; set => autoPilotAltitudeSlotIndex = value; }
            public float HeadingMagnetic { get => headingMagnetic; set => headingMagnetic = value; }
            public float GpsGroundTrack { get => gpsGroundTrack; set => gpsGroundTrack = value; }
            public float GpsGroundSpeed { get => gpsGroundSpeed; set => gpsGroundSpeed = value; }
            public int AutoPilotGlideslopeHold { get => autoPilotGlideslopeHold; set => autoPilotGlideslopeHold = value; }
        }

        private A20NData a20NData = new A20NData();

        public A20NData simData { get => a20NData; set => a20NData = value; }

        public A20NSimData(SimData data) : base(data)
        {
            
        }

        public static void defineSimVarDefintion(SimConnect simConnect, Enum defId)
        {
            uint fieldId = 0;
            simConnect.AddToDataDefinition(defId, "CIRCUIT GENERAL PANEL ON", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT MANAGED SPEED IN MACH", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_FCU_SHOW_SELECTED_SPEED", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT SPEED SLOT INDEX", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT MACH HOLD VAR:1", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT AIRSPEED HOLD VAR:1", "knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT NAV1 LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_TRK_FPA_MODE_ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_FCU_SHOW_SELECTED_HEADING", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT APPROACH HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT HEADING SLOT INDEX", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT HEADING LOCK DIR:3", "degrees", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE SLOT INDEX", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE LOCK VAR:3", "feet", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_NEO_FCU_STATE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT VERTICAL HOLD VAR:3", "feet per minute", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Autopilot_1_Status", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Autopilot_2_Status", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT THROTTLE ARM", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Autopilot_Altitude_Increment", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AIRSPEED INDICATED", "knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AIRSPEED MACH", "Mach", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT HEADING LOCK", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE SLOT INDEX", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "PLANE HEADING DEGREES MAGNETIC", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "GPS GROUND MAGNETIC TRACK", "degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "GPS GROUND SPEED", "knots", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT GLIDESLOPE HOLD", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.RegisterDataDefineStruct<A20NSimData.A20NData>(defId);
        }
    }
}