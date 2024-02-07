using log4net;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Logging;
using MSFS_Webpanels;
using System;
using System.Reflection;

[Route("api/[controller]")]
[ApiController]
#if DEBUG
[EnableCors("MyPolicy")]
#endif
public class SimDataController: ControllerBase
{
    private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);

    public SimDataController()
    {
        
    }   

    [HttpGet()]
    public IActionResult Index()
	{        
        SimData simData = SimConnectClient.getSimConnectClient().simData;        

		return Ok(simData);
    }

    [HttpPost]
    public IActionResult SendEvent([FromBody]SimEventMessage msg)
    {
        if (SimConnectClient.getSimConnectClient().processWebRequest(msg.EventName, msg.IParams)==0)
        {
            return (IActionResult)Ok();
        }      
        return (IActionResult)BadRequest();
    }

}
