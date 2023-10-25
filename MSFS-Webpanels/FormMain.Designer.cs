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
            buttonTest = new Button();
            label3 = new Label();
            linkGit = new LinkLabel();
            textboxInput = new TextBox();
            ((System.ComponentModel.ISupportInitialize)pictureQRcode).BeginInit();
            SuspendLayout();
            // 
            // buttonStart
            // 
            buttonStart.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            buttonStart.Enabled = false;
            buttonStart.Location = new Point(348, 259);
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
            pictureQRcode.Location = new Point(12, 66);
            pictureQRcode.Name = "pictureQRcode";
            pictureQRcode.Size = new Size(264, 252);
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
            linkPanel.Size = new Size(0, 21);
            linkPanel.TabIndex = 3;
            linkPanel.Visible = false;
            // 
            // buttonTest
            // 
            buttonTest.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            buttonTest.Location = new Point(348, 157);
            buttonTest.Name = "buttonTest";
            buttonTest.Size = new Size(166, 59);
            buttonTest.TabIndex = 4;
            buttonTest.Text = "&Test";
            buttonTest.UseVisualStyleBackColor = true;
            buttonTest.Visible = false;
            buttonTest.Click += buttonTest_Click;
            // 
            // label3
            // 
            label3.Anchor = AnchorStyles.Bottom | AnchorStyles.Right;
            label3.AutoSize = true;
            label3.Font = new Font("Segoe UI", 12F, FontStyle.Regular, GraphicsUnit.Point);
            label3.Location = new Point(407, 330);
            label3.Name = "label3";
            label3.Size = new Size(107, 21);
            label3.TabIndex = 6;
            label3.Text = "By: Kevin King";
            // 
            // linkGit
            // 
            linkGit.Anchor = AnchorStyles.Bottom | AnchorStyles.Left;
            linkGit.AutoSize = true;
            linkGit.Font = new Font("Segoe UI", 12F, FontStyle.Regular, GraphicsUnit.Point);
            linkGit.Location = new Point(12, 330);
            linkGit.Name = "linkGit";
            linkGit.Size = new Size(310, 21);
            linkGit.TabIndex = 7;
            linkGit.TabStop = true;
            linkGit.Text = "https://github.com/kk-lai/MSFS-Webpanels";
            // 
            // textboxInput
            // 
            textboxInput.Location = new Point(348, 104);
            textboxInput.Name = "textboxInput";
            textboxInput.Size = new Size(100, 23);
            textboxInput.TabIndex = 9;
            textboxInput.Visible = false;
            // 
            // FormMain
            // 
            AutoScaleDimensions = new SizeF(7F, 15F);
            AutoScaleMode = AutoScaleMode.Font;
            ClientSize = new Size(526, 367);
            Controls.Add(textboxInput);
            Controls.Add(linkGit);
            Controls.Add(label3);
            Controls.Add(buttonTest);
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
        private Button buttonTest;
        private Label label3;
        private LinkLabel linkGit;
        private TextBox textboxInput;
    }
}