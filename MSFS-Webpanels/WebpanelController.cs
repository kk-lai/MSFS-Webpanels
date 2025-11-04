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
        private SimClient fsSimClient = SimClient.GetInstance();

        [HttpPost("register/{regId}")]
        public IActionResult RegisterDataRequest(String regId, [FromBody] IDictionary<string, RequestDefinitionItem> RequestDefinition)
        {
            _logger.Info("RegisterDataRequest triggered:"+ regId);
            if (fsSimClient.IsConnected())
            {
                fsSimClient.RegisterDataRequest(regId, RequestDefinition);
                return Ok();
            }
            else
            {
                return this.Problem("Simualtor Disconnected", statusCode: 500);
            }
        }

        [HttpGet("get-data/{regId}")]
        public IActionResult GetData(String regId)
        {
            _logger.Debug("GetData triggered");
            if (fsSimClient.IsConnected())
            {
                IDictionary<string, Object> response = fsSimClient.GetDataResponse(regId);
                return Ok(response);
            } else
            {
                return this.Problem("Simualtor Disconnected", statusCode: 500);
            }            
        }

        [HttpPost("exec-code")]
        public IActionResult ExecCode([FromForm] string cmd)
        {
            _logger.Info("ExecCode triggered:"+cmd);
            if (fsSimClient.IsConnected())
            {
                fsSimClient.SendCommand(cmd);
                return Ok();
            }
            else
            {
                return this.Problem("Simualtor Disconnected", statusCode: 500);
            }            
        }
    }
}
