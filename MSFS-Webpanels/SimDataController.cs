using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MSFS_Webpanels;
using System;

[Route("api/[controller]")]
[ApiController]
[EnableCors("MyPolicy")]
public class SimDataController: ControllerBase
{
    private readonly string[] SIMEVENTS =
    {
        "simvar-refegt", //SET_EGT_REF,
        "simvar-tasadj", //SET_TAS_ADJ,
        "simvar-attitudebarposition", //SET_ATTITUDE_BAR_POSITION,
        
        "simvar-gyrodrifterror", //SET_GYRO_DRIFT_ERROR,
        "simvar-headingbug", //SET_HEADING_BUG,
        "simvar-nav1obs", //SET_NAV1_OBS,
        "simvar-nav2obs", //SET_NAV2_OBS,
        "simvar-adfcard", //SET_ADF_CARD,
        "simvar-qnh", //SET_QNH,

        "simvar-switchfuelpump", //SET_SWITCH_FUELPUMP,
        "simvar-switchbcn", //SET_SWITCH_BCN,
        "simvar-switchland", //SET_SWITCH_LAND,
        "simvar-switchtaxi", //SET_SWITCH_TAXI,
        "simvar-switchnav", //SET_SWITCH_NAV,
        "simvar-switchstrobe", //SET_SWITCH_STROBE,
        "simvar-switchpitotheat", //SET_SWITCH_PITOT_HEAT,
        "simvar-switchalternator", //SET_SWITCH_ALTERNATOR,
        "simvar-switchbatterymaster", //SET_SWITCH_BATTERY_MASTER,
        "simvar-switchavionics1", //SET_SWITCH_AVIONICS1,
        "simvar-switchavionics2", //SET_SWITCH_AVIONICS2,
        "simvar-parkingbrake",  //SET_SWITCH_PARKING_BRAKE,
        "simvar-fuelvalve", //SET_FUEL_VALVE_ENG1,                
        
        "simvar-com1standbyfreq", //SET_COM1_STANDBY,
        "simvar-com2standbyfreq", //SET_COM2_STANDBY,
        "simvar-nav1standbyfreq", //SET_NAV1_STANDBY,
        "simvar-nav2standbyfreq", //SET_NAV2_STANDBY,
        "simvar-adfstandbyfreq", //SET_ADF_STANDBY,
        "simvar-apaltitude", //SET_AP_ALTITUDE,
        "simvar-com1freqswap", //SWAP_COM1_FREQ,
        "simvar-com2freqswap", //SWAP_COM2_FREQ,
        "simvar-nav1freqswap", //SWAP_NAV1_FREQ,
        "simvar-nav2freqswap", //SWAP_NAV2_FREQ,
        "simvar-adffreqswap", //SWAP_ADF_FREQ,

        "simvar-btnap", //BTN_AP,
        "simvar-btnhdg", //BTN_HDG,
        "simvar-btnnav", //BTN_NAV,
        "simvar-btnapr", //BTN_APR,
        "simvar-btnrev", //BTN_REV,
        "simvar-btnalt", //BTN_ALT,
        "simvar-btnvsinc", //BTN_VS_INC,
        "simvar-btnvsdec", //BTN_VS_DEC,
        "simvar-xpdr", //SET_XPDR_CODE,       
        
        "simvar-fuelselectorleft", //SET_FUEL_SELECTOR_LEFT,
        "simvar-fuelselectorall", //SET_FUEL_SELECTOR_ALL,
        "simvar-fuelselectorright", //SET_FUEL_SELECTOR_RIGHT,        

        "simvar-magnetodec", // MAGNETO_INCR
        "simvar-magnetoinc", // MAGNETO_DECR

        "simvar-flapspositiondec", //FLAPS_DECR,
        "simvar-flapspositioninc", //FLAPS_INCR,

        "simvar-gyrodrifterrorex", // GYRO_DRIFT_SET_EX1
        "simvar-headinggyroset", // HEADING_GYRO_SET

        "simvar-com1rx", // COM1_RECEIVE_SELECT
        "simvar-com2rx", // COM2_RECEIVE_SELECT
        "simvar-pilottx", // PILOT_TRANSMITTER_SET
        "simvar-nav1rx", // RADIO_VOR1_IDENT_TOGGLE
        "simvar-nav2rx", // RADIO_VOR2_IDENT_TOGGLE
        "simvar-adfrx" // RADIO_ADF_IDENT_TOGGLE
    };


    public SimDataController()
	{
	}

    [HttpGet()]
    public IActionResult Index()
	{
        SimData simData = SimConnectClient.getSimConnectClient().SimData;        

		return Ok(simData);
    }

    [HttpPost]
    public IActionResult SendEvent([FromBody]SimEventMessage msg)
    {
        if (msg.EventName.Equals("simvar-xpdrswitch"))
        {
            SimConnectClient.getSimConnectClient().setTransponderSwitch(msg.IParams[0]);
            return (IActionResult)Ok();
        }
        else
        {
            int idx = Array.IndexOf(SIMEVENTS, msg.EventName);
            if (idx >= 0)
            {
                SimConnectClient.getSimConnectClient().transmitEvent((uint)idx, msg.IParams);
            }
            return (IActionResult)Ok();
        }
        return (IActionResult)BadRequest();
    }

}
