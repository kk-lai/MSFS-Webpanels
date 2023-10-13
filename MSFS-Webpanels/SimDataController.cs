using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;

[Route("api/[controller]")]
[ApiController]
[EnableCors("MyPolicy")]
public class SimDataController: ControllerBase
{
    private readonly string[] SIMPLE_VAR =
    {
        "simvar-gyrodrifterror",
        "simvar-headingbug",
        "simvar-nav1obs",
        "simvar-nav2obs",
        "simvar-adfcard",
        "simvar-qnh",
        "simvar-switchfuelpump",
        "simvar-switchbcn",
        "simvar-switchland",
        "simvar-switchtaxi",
        "simvar-switchnav",
        "simvar-switchstrobe",
        "simvar-switchpitotheat",
        "simvar-switchalternator",
        "simvar-switchbatterymaster",
        "simvar-switchavionics1",
        "simvar-switchavionics2",
        "simvar-parkingbrake",
        "simvar-fuelvalve",
        "simvar-com1standbyfreq",
        "simvar-com2standbyfreq",
        "simvar-nav1standbyfreq",
        "simvar-nav2standbyfreq",
        "simvar-adfstandbyfreq",
        "simvar-apaltitude",
        "simvar-com1freqswap",
        "simvar-com2freqswap",
        "simvar-nav1freqswap",
        "simvar-nav2freqswap",
        "simvar-adffreqswap",
        "simvar-com1standbyfreqinc",
        "simvar-com2standbyfreqinc",
        "simvar-btnap",
        "simvar-btnhdg",
        "simvar-btnnav",
        "simvar-btnapr",
        "simvar-btnrev",
        "simvar-btnalt",
        "simvar-btnvsinc",
        "simvar-btnvsdec",
        "simvar-xpdr"
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

    [Route("set/{var}/{val}")]
    [HttpGet]
    public IActionResult SetVar(string var, uint val)
    {
        int idx = Array.IndexOf(SIMPLE_VAR, var);
        if (idx >= 0)
        {   
            SimConnectClient.getSimConnectClient().setSimpleVar((uint)idx, val);
            return Ok();
        }

        if (var.Equals("simvar-magneto"))
        {
            SimConnectClient.getSimConnectClient().setMagneto(val);
            return Ok();
        }

        if (var.Equals("simvar-flapsposition"))
        {
            SimConnectClient.getSimConnectClient().setFlaps(val);
            return Ok();
        }

        if (var.Equals("simvar-fuelselectorui"))
        {
            SimConnectClient.getSimConnectClient().setFuelSelector(val);
            return Ok();
        }

        if (var.Equals("simvar-xpdrswitch"))
        {
            SimConnectClient.getSimConnectClient().setTransponderSwitch(val);
            return Ok();
        }


        return (IActionResult)BadRequest();

    }

}
