using log4net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using Microsoft.VisualBasic;
using NetFwTypeLib;
using System.Configuration;
using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.Encodings.Web;
using System.Windows.Forms;
using Zen.Barcode;


[assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config", Watch = true)]

namespace MSFS_Webpanels
{
    public partial class FormMain : Form
    {
        private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);
        private SimConnectClient simConnectClient = SimConnectClient.getSimConnectClient();
        private System.Windows.Forms.Timer timer;
        private String hostAddress = "localhost";


        public FormMain()
        {
            InitializeComponent();
            timer = new System.Windows.Forms.Timer();
            timer.Tick += new EventHandler(timerFunc);
            timer.Interval = 500;
            timer.Start();

#if DEBUG
            //btnTroubleshoot.Visible = true;
            btnSend.Visible = true;
            txtEventInput.Visible = true;
#endif

            _logger.Info(System.Reflection.Assembly.GetExecutingAssembly().GetName().Name + " (version:" + Application.ProductVersion + ") Start");

            foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
            {
                IPInterfaceProperties props = ni.GetIPProperties();

                if (props.GatewayAddresses.Count > 0 && (ni.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 || ni.NetworkInterfaceType == NetworkInterfaceType.Ethernet))
                {

                    foreach (UnicastIPAddressInformation ip in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (ip.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                        {
                            hostAddress = ip.Address.ToString();
                            _logger.Info("IP Address:" + hostAddress);
                            break;
                        }
                    }
                }
            }

            this.Text = System.Reflection.Assembly.GetExecutingAssembly().GetName().Name + " (version:" + Application.ProductVersion + ")";
        }



        protected override void DefWndProc(ref Message m)
        {
            if (m.Msg == SimConnectClient.WM_USER_SIMCONNECT)
            {
                simConnectClient.SimConnectMsgHandler();
                if (simConnectClient.simData.IsSimConnected)
                {
                    buttonStart.Text = "&Disconnect";
                }
                else
                {
                    buttonStart.Text = "&Connect";
                }
            }
            else
            {
                base.DefWndProc(ref m);
            }
        }

        private void buttonStart_Click(object sender, EventArgs e)
        {
            if (!simConnectClient.simData.IsSimConnected)
            {
                _logger.Info("Start connecting MSFS");
                simConnectClient.Disconnect();
                if (simConnectClient.Connect(this.Handle)!=0)
                {
                    MessageBox.Show("Connection Error", System.Reflection.Assembly.GetExecutingAssembly().GetName().Name, MessageBoxButtons.OK, MessageBoxIcon.Error);
                }
            }
            else
            {
                _logger.Info("End connecting MSFS");
                simConnectClient.Disconnect();
            }
        }

        private void timerFunc(Object myObject, EventArgs myEventArgs)
        {
            IWebHost webApp = Program.webHost;
            if (webApp != null && webApp.ServerFeatures != null)
            {
                foreach (var address in webApp.ServerFeatures.Get<IServerAddressesFeature>().Addresses)
                {
                    var uri = new Uri(address);
                    var port = uri.Port;

                    String webUrl = "http://" + hostAddress + ":" + port + "/?v=" + Application.ProductVersion;
                    linkPanel.Text = webUrl;
                    CodeQrBarcodeDraw qrCode = BarcodeDrawFactory.CodeQr;
                    pictureQRcode.Image = qrCode.Draw(webUrl, pictureQRcode.Height);
                    buttonStart.Enabled = true;
                    pictureQRcode.Visible = true;
                    linkPanel.Visible = true;
                    timer.Stop();

                    _logger.Info("Web Server " + webUrl + " Started");
                }
            }
        }

        private void linkPanel_LinkClicked(object sender, LinkLabelLinkClickedEventArgs e)
        {
            Process.Start(new ProcessStartInfo(linkPanel.Text) { UseShellExecute = true });
        }

        private void buttonAbout_Click(object sender, EventArgs e)
        {
            AboutBox aboutBox = new AboutBox();
            aboutBox.ShowDialog();
        }

        private void btnTroubleshoot_Click(object sender, EventArgs e)
        {
            Type NetFwMgrType = Type.GetTypeFromProgID("HNetCfg.FwMgr", false);
            INetFwMgr mgr = (INetFwMgr)Activator.CreateInstance(NetFwMgrType);
            bool firewallEnabled = mgr.LocalPolicy.CurrentProfile.FirewallEnabled;
            String appPath = Path.GetFullPath(Application.ExecutablePath);

            Boolean fwBlocked = true;

            if (firewallEnabled)
            {
                Type NetFwPolicyType = Type.GetTypeFromProgID("HNetCfg.FwPolicy2");
                INetFwPolicy2 fwPolicy2 = (INetFwPolicy2)Activator.CreateInstance(NetFwPolicyType);
                INetFwRules rules = fwPolicy2.Rules;
                int activeProfile = fwPolicy2.CurrentProfileTypes;
                foreach (INetFwRule rule in rules)
                {
                    if (rule.ApplicationName == null)
                    {
                        continue;
                    }
                    String ruleAppPath = Path.GetFullPath(rule.ApplicationName);

                    
                    if (appPath.Equals(ruleAppPath, StringComparison.OrdinalIgnoreCase))                    
                    {
                        if ((activeProfile & rule.Profiles) > 0 && rule.Enabled && rule.Action == NET_FW_ACTION_.NET_FW_ACTION_ALLOW)
                        {
                            fwBlocked = false;
                        }
                    }
                }
            }
            else
            {
                fwBlocked = false;
            }
            if (fwBlocked)
            {
                _logger.Info("Firewall blocked incoming connection");
                MessageBox.Show("Windows Firewall blocked this application from incoming connection, please configure Windows Firewall.", Application.ProductName, MessageBoxButtons.OK, MessageBoxIcon.Error);
            }
            else
            {
                MessageBox.Show("Firewall configured properly", Application.ProductName, MessageBoxButtons.OK, MessageBoxIcon.Information);
            }
        }

        private void btnSend_Click(object sender, EventArgs e)
        {
#if DEBUG
            if (txtEventInput.Text.Trim().Length > 0)
            {
                string[] fields = txtEventInput.Text.Trim().Split(",");
                string evt = "";
                uint[] vals = null;
                if (fields.Length > 0)
                {
                    evt = fields[0].Trim();
                    vals = new uint[fields.Length - 1];
                    for (int i = 1; i < fields.Length; i++)
                    {
                        vals[i - 1] = uint.Parse(fields[i]);
                    }
                }
                simConnectClient.sendCustomEvent(evt, vals);
            } else
            {
                simConnectClient.testSimvar();
            }
#endif
        }
    }
}
