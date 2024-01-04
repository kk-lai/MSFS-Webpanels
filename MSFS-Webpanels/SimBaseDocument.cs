using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace MSFS_Webpanels
{
    [XmlRoot("SimBase.Document")]
    public class SimBaseDocument
    {
        public string Descr { get; set; }
        [XmlAttribute]
        public string Type { get; set; }

        [XmlElement(ElementName = "FlightPlan.FlightPlan")]
        public FlightPlan flightPlan { get; set; }

        [XmlIgnore]
        public DateTime lastUpdated { get; set; }

    }
}
