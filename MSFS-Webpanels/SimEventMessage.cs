using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSFS_Webpanels
{
    public class SimEventMessage
    {
        private string eventName;
        private uint[] iParams;


        public string EventName { get => eventName; set => eventName = value; }
        public uint[] IParams { get => iParams; set => iParams = value; }
    }
}
