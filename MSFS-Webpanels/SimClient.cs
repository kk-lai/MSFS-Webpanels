using log4net;
using log4net.ObjectRenderer;
using Microsoft.AspNetCore.Server.HttpSys;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using WASimCommander.CLI.Client;
using WASimCommander.CLI.Enums;
using static System.Formats.Asn1.AsnWriter;

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
        private static readonly object _lockObject = new object();

        protected static SimClient instance = null;
        protected WASimClient fsClient = null;
        protected uint MaxRequestId = 0;
        private Dictionary<string, RegistrationRequest> RegistrationRequests = new Dictionary<string, RegistrationRequest>();
        private Dictionary<string, Dictionary<string, Object>> DataResponses = new Dictionary<string, Dictionary<string, Object>>();
        private Dictionary<uint, RegistrationRequest> RequestIdRegistrationMap = new Dictionary<uint, RegistrationRequest>();

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
            uint requestId = r.requestId;
            _logger.Info("OnDataReceived:"+requestId);
            RegistrationRequest req = RequestIdRegistrationMap[requestId];
            if (req != null)
            {
                uint offset = r.requestId - req.SimRequestIdStart - 1;
                String key = req.RequestDefinition.ElementAt((int)offset).Key;
                RequestDefinitionItem item = req.RequestDefinition.ElementAt((int)offset).Value;
                Object val = (double)0;
                if (item.Type.ToLower().Equals("double")) {
                    r.tryConvert<double>(out double d);
                    val = d;
                } else if (item.Type.ToLower().Equals("string"))
                {
                    
                    bool v = r.tryConvert(out string s);
                    val = s;
                }
                else if (item.Type.ToLower().Equals("integer"))
                {
                    r.tryConvert<int>(out int i);
                    val = i;
                }
                DataResponses[req.ReqistrationId][key] = val;                
            }
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
            UInt32 version = fsClient.pingServer();
            if (version == 0)
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
            UnregisterRegistrationRequests();
            foreach (KeyValuePair<string, RegistrationRequest> entry in RegistrationRequests)
            {
                RegisterRegistrationRequest(entry.Value);
            }
            return CERROR.NOERR;
        }

        public void Disconnect()
        {
            if (IsConnected())
            {
                _logger.Info("Disconnect Start");
                fsClient.disconnectServer();
                fsClient.disconnectSimulator();
                UnregisterRegistrationRequests();
                _logger.Info("Disconnect End");
            }
        }

        public UInt32 GetWAServerVersion()
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

        private void UnregisterRegistrationRequests()
        {
            foreach (KeyValuePair<string, RegistrationRequest> entry in RegistrationRequests)
            {
                entry.Value.IsRegistered = false;
                entry.Value.SimRequestIdStart = 0;
            }
            MaxRequestId = 0;
            RequestIdRegistrationMap = new Dictionary<uint, RegistrationRequest>();
        }

        private void RegisterRegistrationRequest( RegistrationRequest req)
        {
            if (req.IsRegistered)
            {
                return;
            }
            if (IsConnected())
            {
                Dictionary<string, object> response = DataResponses[req.ReqistrationId];

                req.SimRequestIdStart = MaxRequestId;
                for(int i=0;i<req.RequestDefinition.Count;i++)
                {
                    
                    string defKey = req.RequestDefinition.ElementAt(i).Key;
                    RequestDefinitionItem item = req.RequestDefinition.ElementAt(i).Value;
                    _logger.Info("register:" + defKey+","+item.Cmd);
                    CalcResultType resultType = CalcResultType.Double;
                    if (item.Type!=null) 
                    {
                        if (item.Type.ToLower().Equals("string"))
                        {
                            resultType = CalcResultType.String;
                        } else if (item.Type.ToLower().Equals("integer"))
                        {
                            resultType = CalcResultType.Integer;
                        }
                    }
                    fsClient.saveDataRequestAsync(new WASimCommander.CLI.Structs.DataRequest(++MaxRequestId, resultType, item.Cmd, UpdatePeriod.Tick, 0, item.Delta));
                    RequestIdRegistrationMap.Add(MaxRequestId, req);
                }
                req.IsRegistered = true;
            }
        }

        public void RegisterDataRequest(String RegistrationId, IDictionary<String,RequestDefinitionItem> RequestDefinition)
        {
            lock (_lockObject)
            {
                if (RegistrationRequests.ContainsKey(RegistrationId))
                {
                    // already registered
                    return;
                }
                _logger.Info("Register new request definition:" + RegistrationId);
                RegistrationRequest req = new RegistrationRequest();
                req.RequestDefinition = RequestDefinition;
                req.IsRegistered = false;
                req.ReqistrationId = RegistrationId;
                RegistrationRequests.Add(RegistrationId, req);
                Dictionary<string, Object> defaultResponse = new Dictionary<string, Object>();
                for (int i = 0; i < req.RequestDefinition.Count; i++)
                {
                    RequestDefinitionItem item = req.RequestDefinition.ElementAt(i).Value;
                    Object defaultResult = (double)0;
                    if (item.Type != null)
                    {
                        if (item.Type.ToLower().Equals("string"))
                        {
                            defaultResult = "";
                        }
                        else if (item.Type.ToLower().Equals("integer"))
                        {
                            defaultResult = (int)0;
                        }
                    }
                    defaultResponse.Add(req.RequestDefinition.ElementAt(i).Key, defaultResult);
                }
                DataResponses.Add(RegistrationId, defaultResponse);
                RegisterRegistrationRequest(req);
            }            
        }

        public IDictionary<string, Object> GetDataResponse(string registrationId)
        {
            return DataResponses[registrationId];
        }
    }
}
