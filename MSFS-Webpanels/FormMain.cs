using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using System.Configuration;
using System.Diagnostics;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Runtime.InteropServices;
using System.Text.Encodings.Web;
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

            this.Text = "MSFS-Webpanels (version:" + Application.ProductVersion + ")";
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
            if (!simConnectClient.SimData.IsSimConnected)
            {
                simConnectClient.Disconnect();
                simConnectClient.Connect(this.Handle);
            }
            else
            {
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
            /*
            uint val = 0;
            if (textboxInput.Text.Trim().Length > 0)
            {
                val = uint.Parse(textboxInput.Text.Trim());
            }
            simConnectClient.sendEventToSimulator(SimConnectClient.EVENT.SET_ATTITUDE_BAR_POSITION, 0, val);
            */
            uint[] val = new uint[2];
            val[0] = 5000;
            val[1] = 1;
            uint evt = SimConnectClient.EVENT.AP_ALT_VAR_SET - SimConnectClient.EVENT.SET_EGT_REF;


            SimConnectClient.getSimConnectClient().transmitEvent(evt, val);
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
    }
}
