using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSFS_Webpanels
{
    public class MapData
    {
        public SimBaseDocument? flightPlanDoc { get; set; }
        public SimData.GenericPlaneData? userPlaneData { get; set; }
        public ArrayList aiAircrafts { get; set; }

        public MapData()
        {
            aiAircrafts = new ArrayList();
        }

        public void removeOutdatedAIAircrafts()
        {
            DateTime coolDownTime = DateTime.Now.AddMinutes(-1); // not update for ? minutes;
            for(int i=0;i<aiAircrafts.Count;i++)
            {
                AIAircraft aircraft = (AIAircraft)aiAircrafts[i];
                if (aircraft.lastUpdated<coolDownTime)
                {
                    aiAircrafts.RemoveAt(i);
                    i--;
                }
            }
        }
    }
}
