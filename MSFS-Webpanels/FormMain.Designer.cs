namespace MSFS_Webpanels
{
    partial class FormMain
    {
        /// <summary>
        ///  Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        ///  Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        ///  Required method for Designer support - do not modify
        ///  the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(FormMain));
            label1 = new Label();
            pictureQRcode = new PictureBox();
            linkPanel = new LinkLabel();
            label3 = new Label();
            buttonAbout = new Button();
            labelStatus = new Label();
            label4 = new Label();
            ((System.ComponentModel.ISupportInitialize)pictureQRcode).BeginInit();
            SuspendLayout();
            // 
            // label1
            // 
            label1.Font = new Font("Segoe UI", 14F);
            label1.ForeColor = SystemColors.ActiveCaptionText;
            label1.Location = new Point(12, 9);
            label1.Name = "label1";
            label1.Size = new Size(499, 54);
            label1.TabIndex = 1;
            label1.Text = "Scan the QRCode below with your tablet and press \"Connect\" button to start the panel";
            // 
            // pictureQRcode
            // 
            pictureQRcode.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            pictureQRcode.Location = new Point(12, 87);
            pictureQRcode.Name = "pictureQRcode";
            pictureQRcode.Size = new Size(329, 329);
            pictureQRcode.SizeMode = PictureBoxSizeMode.Zoom;
            pictureQRcode.TabIndex = 2;
            pictureQRcode.TabStop = false;
            pictureQRcode.Visible = false;
            // 
            // linkPanel
            // 
            linkPanel.AutoSize = true;
            linkPanel.Font = new Font("Segoe UI", 12F);
            linkPanel.Location = new Point(12, 63);
            linkPanel.Name = "linkPanel";
            linkPanel.Size = new Size(53, 21);
            linkPanel.TabIndex = 3;
            linkPanel.TabStop = true;
            linkPanel.Text = "http://";
            linkPanel.Visible = false;
            linkPanel.LinkClicked += linkPanel_LinkClicked;
            // 
            // label3
            // 
            label3.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F);
            label3.Location = new Point(461, 391);
            label3.Name = "label3";
            label3.Size = new Size(107, 21);
            label3.TabIndex = 6;
            label3.Text = "By: Kevin King";
            // 
            // buttonAbout
            // 
            buttonAbout.Location = new Point(402, 329);
            buttonAbout.Name = "buttonAbout";
            buttonAbout.Size = new Size(166, 59);
            buttonAbout.TabIndex = 10;
            buttonAbout.Text = "&About";
            buttonAbout.UseVisualStyleBackColor = true;
            buttonAbout.Click += buttonAbout_Click;
            // 
            // labelStatus
            // 
            labelStatus.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            labelStatus.Font = new Font("Segoe UI", 14.25F, FontStyle.Regular, GraphicsUnit.Point, 0);
            labelStatus.ForeColor = SystemColors.ActiveCaptionText;
            labelStatus.Location = new Point(375, 281);
            labelStatus.Name = "labelStatus";
            labelStatus.Size = new Size(193, 30);
            labelStatus.TabIndex = 11;
            labelStatus.Text = "Disconnected";
            // 
            // label4
            // 
            label4.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            label4.Font = new Font("Segoe UI", 14F);
            label4.ForeColor = SystemColors.ActiveCaptionText;
            label4.Location = new Point(375, 251);
            label4.Name = "label4";
            label4.Size = new Size(140, 30);
            label4.TabIndex = 12;
            label4.Text = "Status:";
            // 
            // FormMain
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(580, 428);
            Controls.Add(label4);
            Controls.Add(labelStatus);
            Controls.Add(buttonAbout);
            Controls.Add(label3);
            Controls.Add(linkPanel);
            Controls.Add(pictureQRcode);
            Controls.Add(label1);
            Icon = (Icon)resources.GetObject("$this.Icon");
            MinimumSize = new Size(542, 406);
            Name = "FormMain";
            Text = "MSFS-Webpanels";
            ((System.ComponentModel.ISupportInitialize)pictureQRcode).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion
        private Label label1;
        private PictureBox pictureQRcode;
        private LinkLabel linkPanel;
        private Label label3;
        private Button buttonAbout;
        private Label labelStatus;
        private Label label4;
    }
}