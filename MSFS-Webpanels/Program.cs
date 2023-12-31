using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using System.Net;
using System.Runtime.InteropServices;



namespace MSFS_Webpanels
{
    internal static class Program
    {
        public static IWebHost webHost;
        [DllImport("kernel32.dll")]
        static extern bool AttachConsole(int dwProcessId);
        private const int ATTACH_PARENT_PROCESS = -1;

        /// <summary>
        ///  The main entry point for the application.
        /// </summary>
        /// 
        [STAThread]
        static void Main(string[] args)
        {
            AttachConsole(ATTACH_PARENT_PROCESS);
            Task.Run(() => StartWebServer(args));
            // To customize application configuration such as set high DPI settings or default font,
            // see https://aka.ms/applicationconfiguration.
            ApplicationConfiguration.Initialize();
            Application.Run(new FormMain());
        }

        public static void StartWebServer(string[] args)
        {
            String cdir = Directory.GetCurrentDirectory();
            webHost = WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                .UseContentRoot(cdir)
                .UseWebRoot(Path.Combine(cdir, "wwwroot"))
                .UseStaticWebAssets()
                .UseStartup<Startup>()
              .Build();            
            webHost.Run();
        }
    }
}