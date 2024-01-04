using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace MSFS_Webpanels
{
    public class FlightPlan
    {
        public string Title { get; set; }

        [XmlElement(ElementName = "ATCWaypoint")]
        public Waypoint[] waypoints { get; set; }

    }
}
