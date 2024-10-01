using Microsoft.FlightSimulator.SimConnect;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using static MSFS_Webpanels.A20NSimData;

namespace MSFS_Webpanels
{
    public class A32NXSimData : SimData
    {
        public enum BAROMODE
        {
            QFE = 0,
            QNH = 1,
            STD = 2
        };

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Ansi, Pack = 1)]
        public struct A32NXData
        {
            private Int32 isCircuitGeneralPanelOn;
            private Int32 isMachActive;
            private Int32 isA32NXFPAModeActive;
            private Int32 isUnitMetric;
            private float apSelectedSpeed;

            private Int32 apSelectedHeading;
            private Int32 autoPilotLocHold;
            private Int32 autoPilotAPPRHold;
            private Int32 isSpeedManaged;
            private Int32 isHeadingManaged;

            private Int32 isHeadingDashed;
            private Int32 isAltManaged;
            private Int32 isVSManaged;
            private Int32 autoPilotAltInc;
            private Int32 autoPilot1Status;

            private Int32 autoPilot2Status;
            private Int32 autoPilotFlightDirectorActive;
            private Int32 autoPilotSelectedVerticalSpeedHoldValue;
            private Int32 autoPilotThrottleArm;
            private Int32 autoPilotDisplayedAltitudeLockValueFeet;

            private float autoPilotSelectedFPAHoldValue;
            private Int32 autoPilotExpediteActive;
            private Int32 fcuState;
            private Int32 efisOption;
            private Int32 a32nxbtnLSActive;
            private Int32 a32nxndMode;
            private Int32 a32nxndRange;
            private Int32 isPressureSelectedUnitsHPA;
            private float pressureValueHg;
            private float pressureValueMB;
            private Int32 baroMode;
            private Int32 a32nxautoPilotNavAidState1;
            private Int32 a32nxautoPilotNavAidState2;
            private Int32 autoPilotAutoLandWarning;
            private Int32 masterWarningActive;
            private Int32 masterCautionActive;
            private Int32 lightTestMode;
            private Int32 captainGreenOn;
            private Int32 isATCMsgWaiting;

            public int IsCircuitGeneralPanelOn { get => isCircuitGeneralPanelOn; set => isCircuitGeneralPanelOn = value; }
            public int IsMachActive { get => isMachActive; set => isMachActive = value; }

            public int IsUnitMetric { get => isUnitMetric; set => isUnitMetric = value; }
            public float ApSelectedSpeed { get => apSelectedSpeed; set => apSelectedSpeed = value; }

            public int AutoPilotLocHold { get => autoPilotLocHold; set => autoPilotLocHold = value; }
            public int AutoPilotAPPRHold { get => autoPilotAPPRHold; set => autoPilotAPPRHold = value; }
            public int IsSpeedManaged { get => isSpeedManaged; set => isSpeedManaged = value; }
            public int IsHeadingManaged { get => isHeadingManaged; set => isHeadingManaged = value; }
            public int IsAltManaged { get => isAltManaged; set => isAltManaged = value; }
            public int IsVSManaged { get => isVSManaged; set => isVSManaged = value; }

            public int AutoPilot1Status { get => autoPilot1Status; set => autoPilot1Status = value; }
            public int AutoPilot2Status { get => autoPilot2Status; set => autoPilot2Status = value; }
            public int AutoPilotFlightDirectorActive { get => autoPilotFlightDirectorActive; set => autoPilotFlightDirectorActive = value; }
            public int AutoPilotSelectedVerticalSpeedHoldValue { get => autoPilotSelectedVerticalSpeedHoldValue; set => autoPilotSelectedVerticalSpeedHoldValue = value; }
            public int AutoPilotThrottleArm { get => autoPilotThrottleArm; set => autoPilotThrottleArm = value; }
            public int ApSelectedHeading { get => apSelectedHeading; set => apSelectedHeading = value; }
            public int AutoPilotDisplayedAltitudeLockValueFeet { get => autoPilotDisplayedAltitudeLockValueFeet; set => autoPilotDisplayedAltitudeLockValueFeet = value; }
            public float AutoPilotSelectedFPAHoldValue { get => autoPilotSelectedFPAHoldValue; set => autoPilotSelectedFPAHoldValue = value; }
            public int AutoPilotExpediteActive { get => autoPilotExpediteActive; set => autoPilotExpediteActive = value; }
            public int FcuState { get => fcuState; set => fcuState = value; }
            public int IsA32NXFPAModeActive { get => isA32NXFPAModeActive; set => isA32NXFPAModeActive = value; }
            public int IsHeadingDashed { get => isHeadingDashed; set => isHeadingDashed = value; }
            public int AutoPilotAltInc { get => autoPilotAltInc; set => autoPilotAltInc = value; }
            public int EfisOption { get => efisOption; set => efisOption = value; }
            public int IsPressureSelectedUnitsHPA { get => isPressureSelectedUnitsHPA; set => isPressureSelectedUnitsHPA = value; }
            public float PressureValueHg { get => pressureValueHg; set => pressureValueHg = value; }
            public float PressureValueMB { get => pressureValueMB; set => pressureValueMB = value; }
            public int BaroMode { get => baroMode; set => baroMode = value; }
            public int LightTestMode { get => lightTestMode; set => lightTestMode = value; }
            public int CaptainGreenOn { get => captainGreenOn; set => captainGreenOn = value; }
            public int IsATCMsgWaiting { get => isATCMsgWaiting; set => isATCMsgWaiting = value; }
            public int A32nxautoPilotNavAidState1 { get => a32nxautoPilotNavAidState1; set => a32nxautoPilotNavAidState1 = value; }
            public int A32nxautoPilotNavAidState2 { get => a32nxautoPilotNavAidState2; set => a32nxautoPilotNavAidState2 = value; }
            public int A32nxbtnLSActive { get => a32nxbtnLSActive; set => a32nxbtnLSActive = value; }
            public int A32nxndMode { get => a32nxndMode; set => a32nxndMode = value; }
            public int A32nxndRange { get => a32nxndRange; set => a32nxndRange = value; }
            public int AutoPilotAutoLandWarning { get => autoPilotAutoLandWarning; set => autoPilotAutoLandWarning = value; }
            public int MasterWarningActive { get => masterWarningActive; set => masterWarningActive = value; }
            public int MasterCautionActive { get => masterCautionActive; set => masterCautionActive = value; }
        }

        private A32NXData a32nxdata = new A32NXData();

        public A32NXData simData { get => a32nxdata; set => a32nxdata = value; }

        public A32NXSimData(SimData data) : base(data)
        {

        }

        public static void defineSimVarDefintion(SimConnect simConnect, Enum defId)
        {
            uint fieldId = 0;
            simConnect.AddToDataDefinition(defId, "L:A32NX_ELEC_AC_1_BUS_IS_POWERED", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT MANAGED SPEED IN MACH", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_TRK_FPA_MODE_ACTIVE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_METRIC_ALT_TOGGLE", "Bool", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_SPEED_SELECTED", "Number", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);

            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_HEADING_SELECTED", "degrees", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_LOC_MODE_ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_APPR_MODE_ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_SPD_MANAGED_DOT", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_HDG_MANAGED_DOT", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_HDG_MANAGED_DASHES", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_ALT_MANAGED", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCU_VS_MANAGED", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Autopilot_Altitude_Increment", "Number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_1_ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_2_ACTIVE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT FLIGHT DIRECTOR ACTIVE:1", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_VS_SELECTED", "ft/min", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOTHRUST_STATUS", "enum", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "AUTOPILOT ALTITUDE LOCK VAR:3", "feet", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_FPA_SELECTED", "Degree", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FMA_EXPEDITE_MODE", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A320_NE0_FCU_STATE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_EFIS_L_OPTION", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:BTN_LS_1_FILTER_ACTIVE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_EFIS_L_ND_MODE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_EFIS_L_ND_RANGE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Baro_Selector_HPA_1", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING HG:1", "inches of mercury", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "KOHLSMAN SETTING MB:1", "Millibars", SIMCONNECT_DATATYPE.FLOAT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:XMLVAR_Baro1_Mode", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_EFIS_L_NAVAID_1_MODE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_EFIS_L_NAVAID_2_MODE", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_AUTOPILOT_AUTOLAND_WARNING", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:Generic_Master_Warning_Active", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);            
            simConnect.AddToDataDefinition(defId, "L:Generic_Master_Caution_Active", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_OVHD_INTLT_ANN", "number", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_FCDC_1_PRIORITY_LIGHT_CAPT_GREEN_ON", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);
            simConnect.AddToDataDefinition(defId, "L:A32NX_DCDU_ATC_MSG_WAITING", "Boolean", SIMCONNECT_DATATYPE.INT32, 0, fieldId++);

            simConnect.RegisterDataDefineStruct<A32NXSimData.A32NXData>(defId);
        }

    }
}
