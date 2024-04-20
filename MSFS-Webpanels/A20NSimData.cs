using Microsoft.FlightSimulator.SimConnect;
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
        public enum BAROMODE
        {
            QFE = 0,
            QNH = 1,
            STD = 2
        };

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
            private Int32 baroMode;
            private Int32 isPressureSelectedUnitsHPA;
            private float pressureValueHg;
            private float pressureValueMB;
            private Int32 ndMode;
            private Int32 ndRange;
            private Int32 autoPilotFlightDirectorActive;
            private Int32 btnLSActive;
            private Int32 btnCSTRActive;
            private Int32 btnWPTActive;
            private Int32 btnVORDActive;
            private Int32 btnNDBActive;
            private Int32 btnARPTActive;
            private Int32 autoPilotNavAidState1;
            private Int32 autoPilotNavAidState2;
            private Int32 masterWarningActive;
            private Int32 masterWarningAck;
            private Int32 masterCautionActive;
            private Int32 masterCautionAck;
            private Int32 lightTestActive;

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
            public int BaroMode { get => baroMode; set => baroMode = value; }
            public int IsPressureSelectedUnitsHPA { get => isPressureSelectedUnitsHPA; set => isPressureSelectedUnitsHPA = value; }
            public float PressureValueHg { get => pressureValueHg; set => pressureValueHg = value; }
            public float PressureValueMB { get => pressureValueMB; set => pressureValueMB = value; }
            public int NdMode { get => ndMode; set => ndMode = value; }
            public int NdRange { get => ndRange; set => ndRange = value; }
            public int AutoPilotFlightDirectorActive { get => autoPilotFlightDirectorActive; set => autoPilotFlightDirectorActive = value; }
            public int BtnLSActive { get => btnLSActive; set => btnLSActive = value; }
            public int BtnCSTRActive { get => btnCSTRActive; set => btnCSTRActive = value; }
            public int BtnWPTActive { get => btnWPTActive; set => btnWPTActive = value; }
            public int BtnVORDActive { get => btnVORDActive; set => btnVORDActive = value; }
            public int BtnNDBActive { get => btnNDBActive; set => btnNDBActive = value; }
            public int BtnARPTActive { get => btnARPTActive; set => btnARPTActive = value; }
            public int AutoPilotNavAidState1 { get => autoPilotNavAidState1; set => autoPilotNavAidState1 = value; }
            public int AutoPilotNavAidState2 { get => autoPilotNavAidState2; set => autoPilotNavAidState2 = value; }
            public int MasterWarningActive { get => masterWarningActive; set => masterWarningActive = value; }
            public int MasterWarningAck { get => masterWarningAck; set => masterWarningAck = value; }
            public int MasterCautionActive { get => masterCautionActive; set => masterCautionActive = value; }
            public int MasterCautionAck { get => masterCautionAck; set => masterCautionAck = value; }
            public int LightTestActive { get => lightTestActive; set => lightTestActive = value; }
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
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Baro1_Mode", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Baro_Selector_HPA_1", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING HG", "inches of mercury", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING MB", "Millibars", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_Neo_MFD_NAV_MODE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_Neo_MFD_Range", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT FLIGHT DIRECTOR ACTIVE:1", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_LS_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_CSTR_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_WPT_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_VORD_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_NDB_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_ARPT_FILTER_ACTIVE", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_NAV_AID_SWITCH_L1_State", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_NAV_AID_SWITCH_L2_State", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "MASTER WARNING ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "MASTER WARNING ACKNOWLEDGED", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "MASTER CAUTION ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "MASTER CAUTION ACKNOWLEDGED", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_LTS_Test", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.RegisterDataDefineStruct<A20NSimData.A20NData>(defId);
        }
    }
}
