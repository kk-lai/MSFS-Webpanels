using log4net;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace MSFS_Webpanels
{
    [Route("api/[controller]")]
    [ApiController]
#if DEBUG
    [EnableCors("MyPolicy")]
#endif
    public class WebpanelController : ControllerBase
    {
        private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);

        [HttpPost("register/{defId}")]
        public IActionResult RegisterDataRequest(String defId, [FromBody] IDictionary<string, DataRequestEntry> RequestDefinition)
        {
            _logger.Debug("RegisterDataRequest triggered:"+defId);
            return Ok();
        }

        [HttpGet("get-data/{defId}")]
        public IActionResult GetData(String defId)
        {
            _logger.Debug("GetData triggered");
            return Ok();
        }

        [HttpPost("exec-code")]
        public IActionResult ExecCode(string cmd)
        {
            _logger.Debug("ExecCode triggered");
            return Ok();
        }
    }
}
