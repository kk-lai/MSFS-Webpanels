using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using System.Configuration;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using Zen.Barcode;


namespace MSFS_Webpanels
{
    public partial class FormMain : Form
    {

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
                            break;
                        }
                    }
                }
            }


        }

        protected override void DefWndProc(ref Message m)
        {
            if (m.Msg == SimConnectClient.WM_USER_SIMCONNECT)
            {
                simConnectClient.SimConnectMsgHandler();
                if (simConnectClient.SimData.IsSimConnected)
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
            if (simConnectClient.SimData.IsSimConnected)
            {
                simConnectClient.Disconnect();
            }
            else
            {
                simConnectClient.Connect(this.Handle);
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

                    String webUrl = "http://" + hostAddress + ":" + port + "/";
                    linkPanel.Text = webUrl;
                    CodeQrBarcodeDraw qrCode = BarcodeDrawFactory.CodeQr;
                    pictureQRcode.Image = qrCode.Draw(webUrl, pictureQRcode.Height);
                    buttonStart.Enabled = true;
                    pictureQRcode.Visible = true;
                    linkPanel.Visible = true;
                    timer.Stop();
                }
            }

        }

        private void buttonTest_Click(object sender, EventArgs e)
        {
            simConnectClient.sendEventToSimulator(SimConnectClient.EVENT.SWAP_COM1_FREQ, 0);
        }
    }
}