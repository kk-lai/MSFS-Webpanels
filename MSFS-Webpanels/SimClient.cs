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
        protected bool isConnected = false;
        private Dictionary<string, RegistrationRequest> RegistrationRequests = new Dictionary<string, RegistrationRequest>();
        private Dictionary<string, Dictionary<string, Object>> DataResponses = new Dictionary<string, Dictionary<string, Object>>();
        private Dictionary<uint, RegistrationRequest> RequestIdRegistrationMap = new Dictionary<uint, RegistrationRequest>();
        private DateTime lastSimVarUpdate = DateTime.MinValue;

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
            fsClient.OnClientEvent += FsClient_OnClientEvent;
        }

        private void FsClient_OnClientEvent(WASimCommander.CLI.Structs.ClientEvent evt)
        {
            _logger.Info("OnClientEvent:"+evt.ToString());
            if (evt.eventType==ClientEventType.ServerDisconnected || evt.eventType == ClientEventType.SimDisconnected)
            {
                this.isConnected = false;
            }
            if (evt.eventType==ClientEventType.ServerConnected)
            {
                this.isConnected = true;
            }            
        }

        private void FsClient_OnDataReceived(WASimCommander.CLI.Structs.DataRequestRecord r)
        {
            uint requestId = r.requestId;
            StringBuilder sb = new StringBuilder();
            foreach (byte b in r.data)
            {
                sb.Append(b.ToString("X2")); // "X2" formats as two-digit uppercase hex
                sb.Append(",");
            }
            string hex = sb.ToString();

            _logger.Debug("OnDataReceived:" + requestId + "," +r.nameOrCode +","+ hex);
            if (requestId==0)
            {
                lastSimVarUpdate = DateTime.Now;
                return;
            }

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
                _logger.Debug("OnDataReceived:" + key + "," + val);
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
                this.Disconnect();
                _logger.Error("Cannot connect flight simulator");
                return CERROR.FSMISSING;
            }
            _logger.Info("Get Server Version");
            UInt32 version = fsClient.pingServer();
            if (version == 0)
            {
                this.Disconnect();
                _logger.Error("Unable to Get Server Version");
                return CERROR.WASIMMISSING;
            }
            _logger.Info("Connecting Server");
            if ((hr = fsClient.connectServer()) != HR.OK)
            {
                this.Disconnect();
                _logger.Error("Server Connection Error");
                return CERROR.WASIMMISSING;
            }
            _logger.Info("Connection Successful");
            //UnregisterRegistrationRequests();
            lastSimVarUpdate = DateTime.Now;
            fsClient.saveDataRequestAsync(new WASimCommander.CLI.Structs.DataRequest(0, CalcResultType.Integer, "(E:SIMULATION TIME, Seconds)", 4, UpdatePeriod.Millisecond, 3000, 0));
            foreach (KeyValuePair<string, RegistrationRequest> entry in RegistrationRequests)
            {
                RegisterRegistrationRequest(entry.Value);
            }
            return CERROR.NOERR;
        }

        public void Disconnect()
        {
            _logger.Info("Disconnect Start");
            fsClient.disconnectServer();
            fsClient.disconnectSimulator();
            _logger.Info("Disconnect End");            
        }

        public void Dispose()
        {
            _logger.Info("Dispose");
            Disconnect();
            fsClient.Dispose();            
        }

        public UInt32 GetWAServerVersion()
        {
            if (!IsConnected())
            {
                return 0;
            }
            UInt32 version = fsClient.pingServer();
            if (version==0)
            {
                Disconnect();
            }
            return version;
        }

        public bool IsConnected()
        {            
            return this.isConnected;
        }

        private void RegisterRegistrationRequest(RegistrationRequest req)
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
                    _logger.Debug("register:" + defKey+","+item.Cmd+":"+(MaxRequestId+1));
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

        public void SendCommand(string cmd)
        {
            _logger.Info("Send Command:" + cmd);
            fsClient.executeCalculatorCode(cmd);
        }
    }
}
