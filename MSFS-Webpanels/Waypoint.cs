using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace MSFS_Webpanels
{
    public class Waypoint
    {
        [XmlAttribute]
        public string id { get; set; }

        [XmlElement(ElementName = "ATCWaypointType")]
        public string type { get; set; }
        
        [XmlIgnore]
        private string _position;

        [JsonIgnore]
        [XmlElement(ElementName = "WorldPosition")]
        public string position
        {
            get
            {
                return _position;
            }
            set
            {
                _position = value;
                string[] fields = value.Split(",");
                for(int i=0;i<2;i++)
                {
                    string sval = fields[i];
                    string[] hms = sval.Split('°', '\'', '\"');
                    float sf = 1;
                    float v = 0;
                    float sgn = 1;
                    for(int j=0;j<3;j++)
                    {
                        string cf = hms[j];
                        if (j==0)
                        {
                            string dir = cf.Substring(0, 1);
                            if (dir.Equals("W") || dir.Equals("S"))
                            {
                                sgn = -1;
                            }
                            cf=cf.Substring(1);
                        }
                        float cv = float.Parse(cf);
                        v = v + cv * sf;
                        sf = sf / 60;
                    }
                    v = sgn * v;
                    if (i==0)
                    {
                        latitude = v;
                    } else
                    {
                        longitude = v;
                    }
                }
                altitude = float.Parse(fields[2]);
            }
        }

        public float latitude { get; set; }

        public float longitude { get; set; } 

        public float altitude { get; set; }


    }
}
