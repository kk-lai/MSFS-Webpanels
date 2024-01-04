using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace MSFS_Webpanels
{
    public class AIAircraft
    {
        public SimData.GenericPlaneData planeData { get; set; }
        public uint planeId { get; set; }

        [JsonIgnore]
        public DateTime lastUpdated { get; set; }

        public AIAircraft(uint planeId)
        {
            this.planeId= planeId; 
        }

        public override bool Equals(object? obj)
        {
            return obj is AIAircraft aircraft &&
                   planeId == aircraft.planeId;
        }
    }
}
