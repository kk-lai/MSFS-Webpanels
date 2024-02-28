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
            buttonStart = new Button();
            label1 = new Label();
            pictureQRcode = new PictureBox();
            linkPanel = new LinkLabel();
            label3 = new Label();
            textboxInput = new TextBox();
            buttonAbout = new Button();
            btnTroubleshoot = new Button();
            txtEventInput = new TextBox();
            btnSend = new Button();
            txtInputEvent = new TextBox();
            ((System.ComponentModel.ISupportInitialize)pictureQRcode).BeginInit();
            SuspendLayout();
            // 
            // buttonStart
            // 
            buttonStart.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            buttonStart.Enabled = false;
            buttonStart.Location = new Point(402, 320);
            buttonStart.Name = "buttonStart";
            buttonStart.Size = new Size(166, 59);
            buttonStart.TabIndex = 0;
            buttonStart.Text = "&Connect";
            buttonStart.UseVisualStyleBackColor = true;
            buttonStart.Click += buttonStart_Click;
            // 
            // label1
            // 
            label1.Font = new Font("Segoe UI", 14F, FontStyle.Regular, GraphicsUnit.Point);
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
            linkPanel.Font = new Font("Segoe UI", 12F, FontStyle.Regular, GraphicsUnit.Point);
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
            label3.Font = new Font("Segoe UI", 12F, FontStyle.Regular, GraphicsUnit.Point);
            label3.Location = new Point(461, 391);
            label3.Name = "label3";
            label3.Size = new Size(107, 21);
            label3.TabIndex = 6;
            label3.Text = "By: Kevin King";
            // 
            // textboxInput
            // 
            textboxInput.Location = new Point(461, 168);
            textboxInput.Name = "textboxInput";
            textboxInput.Size = new Size(100, 23);
            textboxInput.TabIndex = 9;
            textboxInput.Visible = false;
            // 
            // buttonAbout
            // 
            buttonAbout.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            buttonAbout.Location = new Point(402, 243);
            buttonAbout.Name = "buttonAbout";
            buttonAbout.Size = new Size(166, 59);
            buttonAbout.TabIndex = 10;
            buttonAbout.Text = "&About";
            buttonAbout.UseVisualStyleBackColor = true;
            buttonAbout.Click += buttonAbout_Click;
            // 
            // btnTroubleshoot
            // 
            btnTroubleshoot.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            btnTroubleshoot.Location = new Point(402, 164);
            btnTroubleshoot.Name = "btnTroubleshoot";
            btnTroubleshoot.Size = new Size(166, 59);
            btnTroubleshoot.TabIndex = 12;
            btnTroubleshoot.Text = "&Troubleshoot";
            btnTroubleshoot.UseVisualStyleBackColor = true;
            btnTroubleshoot.Click += btnTroubleshoot_Click;
            // 
            // txtEventInput
            // 
            txtEventInput.Location = new Point(402, 42);
            txtEventInput.Name = "txtEventInput";
            txtEventInput.Size = new Size(166, 23);
            txtEventInput.TabIndex = 13;
            txtEventInput.Visible = false;
            // 
            // btnSend
            // 
            btnSend.Location = new Point(402, 87);
            btnSend.Name = "btnSend";
            btnSend.Size = new Size(166, 59);
            btnSend.TabIndex = 15;
            btnSend.Text = "&Send Event";
            btnSend.UseVisualStyleBackColor = true;
            btnSend.Visible = false;
            btnSend.Click += btnSend_Click;
            // 
            // txtInputEvent
            // 
            txtInputEvent.Location = new Point(402, 9);
            txtInputEvent.Name = "txtInputEvent";
            txtInputEvent.Size = new Size(166, 23);
            txtInputEvent.TabIndex = 16;
            txtInputEvent.Visible = false;
            // 
            // FormMain
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(580, 428);
            Controls.Add(txtInputEvent);
            Controls.Add(btnSend);
            Controls.Add(txtEventInput);
            Controls.Add(btnTroubleshoot);
            Controls.Add(buttonAbout);
            Controls.Add(textboxInput);
            Controls.Add(label3);
            Controls.Add(linkPanel);
            Controls.Add(pictureQRcode);
            Controls.Add(label1);
            Controls.Add(buttonStart);
            Icon = (Icon)resources.GetObject("$this.Icon");
            MinimumSize = new Size(542, 406);
            Name = "FormMain";
            Text = "MSFS-Webpanels";
            ((System.ComponentModel.ISupportInitialize)pictureQRcode).EndInit();
            ResumeLayout(false);
            PerformLayout();
        }

        #endregion

        private Button buttonStart;
        private Label label1;
        private PictureBox pictureQRcode;
        private LinkLabel linkPanel;
        private Label label3;
        private TextBox textboxInput;
        private Button buttonAbout;
        private Button btnTroubleshoot;
        private TextBox txtEventInput;
        private Button btnSend;
        private TextBox txtInputEvent;
    }
}