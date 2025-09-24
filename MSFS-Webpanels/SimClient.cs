using log4net;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WASimCommander.CLI.Client;
using WASimCommander.CLI.Enums;

namespace MSFS_Webpanels
{
    public enum CERROR
    {
        NOERR=0,
        WASIMMISSING,
        FSMISSING
    };

    public class SimClient
    {
        private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);

        protected static SimClient instance = null;
        protected WASimClient fsClient = null;
        protected uint MaxRequestId = 0;
        IDictionary<string, object> RequestDefinition = null;

        public static SimClient GetInstance()
        {
            if (instance==null)
            {
                instance = new SimClient();
            }
            return instance;
        }

        public SimClient()
        {
            fsClient = new WASimClient(0x57454250); // WEBP
            fsClient.OnDataReceived += FsClient_OnDataReceived;
        }

        private void FsClient_OnDataReceived(WASimCommander.CLI.Structs.DataRequestRecord r)
        {
            
        }

        public CERROR Connect()
        {            
            if (IsConnected() && GetWAServerVersion()!=0)
            {
                return CERROR.NOERR;
            }
            _logger.Info("Connecting Simulator");
            HR hr;
            if ((hr = fsClient.connectSimulator()) != HR.OK)
            {
                _logger.Info("Cannot connect flight simulator");
                return CERROR.FSMISSING;
            }
            _logger.Info("Get Server Version");
            if (GetWAServerVersion()==0)
            {
                _logger.Info("Unable to Get Server Version");
                return CERROR.WASIMMISSING;
            }
            _logger.Info("Connecting Server");
            if ((hr = fsClient.connectServer()) != HR.OK)
            {
                _logger.Info("Server Connection Error");
                return CERROR.WASIMMISSING;
            }
            _logger.Info("Connection Successful");
            return CERROR.NOERR;
        }

        public void Disconnect()
        {
            if (IsConnected())
            {
                _logger.Info("Disconnect Start");
                fsClient.disconnectServer();
                fsClient.disconnectSimulator();
                _logger.Info("Disconnect End");
            }
        }

        public uint GetWAServerVersion()
        {
            if (!IsConnected())
            {
                return 0;
            }
            return fsClient.pingServer();            
        }

        public bool IsConnected()
        {
            return fsClient.isInitialized() && fsClient.isConnected();
        }

        public void Dispose()
        {
            Disconnect();
            fsClient.Dispose();
        }

        public void RegisterDataRequest()
        {
            for(uint reqId=0;reqId<MaxRequestId;reqId++)
            {
                fsClient.removeDataRequest(reqId);
            }
            MaxRequestId = 0;

        }
    }
}
