using log4net;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using System.Configuration;
using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.Encodings.Web;
using Zen.Barcode;


// Get-ChildItem -Path "W:\MSFS-Webpanels-dev" -Recurse| Unblock-File

[assembly: log4net.Config.XmlConfigurator(ConfigFile = "log4net.config", Watch = true)]

namespace MSFS_Webpanels
{
    public partial class FormMain : Form
    {
        private readonly log4net.ILog _logger = LogManager.GetLogger(MethodBase.GetCurrentMethod().DeclaringType.Name);
        private System.Windows.Forms.Timer timer;
        private String hostAddress = "localhost";
        private SimClient fsSimClient = SimClient.GetInstance();

        public FormMain()
        {
            InitializeComponent();
            timer = new System.Windows.Forms.Timer();
            timer.Tick += new EventHandler(timerFunc);
            timer.Interval = 500;
            timer.Start();

            _logger.Info("MSFS-Webpanels (version:" + Application.ProductVersion + ") Start");

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
            this.Text = "MSFS-Webpanels (version:" + Application.ProductVersion + ")";
        }


        private void timerFunc(Object myObject, EventArgs myEventArgs)
        {
            IWebHost webApp = Program.webHost;
            if (!linkPanel.Visible && webApp != null && webApp.ServerFeatures != null)
            {
                foreach (var address in webApp.ServerFeatures.Get<IServerAddressesFeature>().Addresses)
                {
                    var uri = new Uri(address);
                    var port = uri.Port;
                    var arg = "/?v="+Application.ProductVersion;

#if DEBUG
                    Random rnd = new Random();
                    int num = rnd.Next(0, 10000);
                    String webUrl = "http://" + hostAddress + ":" + port + "/b73m/index.html?t=" + num;
#else
                    String webUrl = "http://" + hostAddress + ":" + port + "/?v=" + Application.ProductVersion;
#endif
//                    String webUrl = "http://" + hostAddress + ":" + port + "/?v=" + Application.ProductVersion;
                    linkPanel.Text = webUrl;
                    CodeQrBarcodeDraw qrCode = BarcodeDrawFactory.CodeQr;
                    pictureQRcode.Image = qrCode.Draw(webUrl, pictureQRcode.Height);                    
                    pictureQRcode.Visible = true;
                    linkPanel.Visible = true;

                    _logger.Info("Web Server " + webUrl + " Started");
                }
            }
            if (fsSimClient.IsConnected())
            {
                if (fsSimClient.IsConnectionLost())
                {
                    _logger.Error("Connection Lost");
                    fsSimClient.Disconnect();
                }
            }
            if (!fsSimClient.IsConnected())
            {
                int timerInterval = 3000;
                labelStatus.Text = "Connecting";
                CERROR errCode = fsSimClient.Connect();
                if (errCode == CERROR.FSMISSING)
                {
                    labelStatus.Text = "Error Code 1";                    
                } else if (errCode == CERROR.WASIMMISSING)
                {
                    labelStatus.Text = "Error Code 2";
                } else if (errCode == CERROR.NOERR)
                {
                    labelStatus.Text = "Connected";
                    timerInterval = 5000;
                }
                timer.Interval = timerInterval;
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

        protected override void OnClosed(EventArgs e)
        {
            timer.Stop();
            fsSimClient.Dispose();
            base.OnClosed(e);            
        }
    }
}
