using Zen.Barcode;

namespace MSFS_Webpanels
{
    public partial class FormMain : Form
    {
        String webUrl = "http://192.168.2.199/webpanels";
        public FormMain()
        {
            InitializeComponent();
            linkPanel.Text = webUrl;
            CodeQrBarcodeDraw qrCode = BarcodeDrawFactory.CodeQr;
            pictureQRcode.Image = qrCode.Draw(webUrl, pictureQRcode.Height);



        }
    }
}