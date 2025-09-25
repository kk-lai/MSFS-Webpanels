using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSFS_Webpanels
{
    public class RegistrationRequest
    {
        public IDictionary<string, RequestDefinitionItem>? RequestDefinition  { get; set; }
        public uint SimRequestIdStart { get; set; }
        public bool IsRegistered { get; set; } 
        public string ReqistrationId { get; set; }

    }
}
