using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using MSFS_Webpanels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

[Route("api/[controller]")]
[ApiController]
#if DEBUG
[EnableCors("MyPolicy")]
#endif

public class MapDataController : ControllerBase
{
    [HttpGet()]
    public IActionResult Index()
    {
        MapData mapData = SimConnectClient.getSimConnectClient().mapData;

        return Ok(mapData);
    }

}

