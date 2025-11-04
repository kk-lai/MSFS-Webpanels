# MSFS-Webpanels

Introduction
============
This is a touch panel web application that allows users to control and view the gauges and switches of an aircraft’s panel with the browser of a tablet.

When I play MSFS, I face a problem where I need to move the view of the game to see some of the gauges. One of the most common solutions is to extend the screen with an extra monitor. However, my desk cannot fit one more monitor. There are solutions to extend PC screen with an iPad, but I think they are not good enough. If the second screen can accept input, it will be good. So, I developed this application. I looked for similar solutions on the internet, but some of them are not free. For free solutions, they do not fit me. Therefore, I decided to do it myself. My design goal is to find a balance between realism and usability. Thanks to project flightgear (https://www.flightgear.org/), I got readily made good quality images of gauges. These images make the panel look like a “real” panel. Instead of using knobs to change the input, my design is to drag the gauges directly because using knobs for input is difficult. After implementing all gauges and switches, I found that the auto-pilot and radio should be added too. My first thought was to implement the radio panel and show it when the user taps a button. However, changing the frequency or altitude with knobs is difficult, so I implemented a number pad interface to input these numbers. For now, only Cessna 172 panel is implemented. In the future, I plan to develop more panels for other aircraft.

Prerequisites
=============
ASP.NET Core 8.0 Runtime
https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-aspnetcore-8.0.20-windows-x64-installer


.NET 8.0 Desktop Runtime (v8.0.20)
https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-8.0.20-windows-x64-installer

Installation
============
1. Install runtime libraries stated in prerequisites section
2. Unzip MSFS-Webpanels.zip into any location you wanted

Configuration
=============
The web server port is configured to 8888, you may change the port number by modifying the line below in the file "appsettings.json" as below:

"Url": "http://*:xxxx"

Where "xxxx" is your target port number
 
Usage
=====
1. Run the executable “MSFS-Webpanels.exe”.
2. Click "Allow access" button to allow connection behind the firewall when "Windows Security Alert" is popped up.
3. Connect MSFS by clicking the “Connect” button.
4. On your tablet, open the panel page with a browser by entering the link stated in the application or scanning the QRCode with your tablet’s camera.
5. Tap the “i” icon at the bottom right corner to see the locations of the controls, where arrows are drag controls and dots are tap controls.
6. In case the panel does not work properly, tap the “refresh” icon beside the “i” icon to reload the page.
7. If you want to use the panel in full screen, you may add the page to your home screen by selecting “Share” > “Add to Home Screen” on your iPad.

Please remove existing icon from "Home Screen" and clear browsing data of the browser when using new version panel.

Future Plans
============
1. Fix problem when "Magneto from R to off" the engine doesn't stop
2. Rewrite front-end to be more modularized
3. Separate one panel to left, main, radio, bottom panels
4. Write panels for other aircrafts

Source Code
===========
Source code can be downloadable at https://github.com/kk-lai/MSFS-Webpanels 

It can be compiled with Microsoft Visual Studio 2022.

Release Notes
=============
1.0.2 - Initial release
1.1.0 - DME distance bug fix, add gear up/down switch, engine hours recorder, logging
1.1.1 - Add version code in js and html files for better support
1.1.3 - Upgrade to .net 8.0, update related libraries.

License
=======
GPLv3

3rd party libraries
===================
1. jquery (https://jquery.com/)
2. jquery-ui (https://jqueryui.com/)
3. requirejs (https://requirejs.org/)
4. Zen Barcode https://www.nuget.org/packages/Zen.Barcode.Rendering.Framework

Image Credits
=============
Gauges (by Flightgear)
https://www.flightgear.org/

Information Icon (by Anggara)
https://www.freepik.com/icon/information_9195785 

Power switch (by aranjuezmedina)
https://www.freepik.com/free-vector/off-button-design_1101194.htm#&position=0&from_view=search&track=ais

Toggle switch (by macrovector)
https://www.freepik.com/free-vector/realistic-analog-button-trigger-set_3977438.htm#query=selector%20knob&position=17&from_view=search&track=ais

Toggle switch nuts (by freepik)
https://www.freepik.com/free-vector/industry-realistic-nuts-bolts-collection_25928714.htm#query=hex%20bolt&position=7&from_view=search&track=ais

Flaps Lever (by starline)
https://www.freepik.com/free-vector/glossy-web-buttons-set-different-colors_4249635.htm#query=rectangle%20button&position=1&from_view=search&track=ais

Magneto (by macrovector)
https://www.freepik.com/free-vector/metal-padlocks-keys-different-shapes-realistic-set_2873578.htm#query=keyhole&position=12&from_view=keyword&track=sph

QR code scan (by freepik)
https://www.freepik.com/free-vector/mobile-background-with-qr-code_1023723.htm#query=ipad%20app%20qr%20code&position=16&from_view=search&track=ais

Monitor (by rawpixel.com)
https://www.freepik.com/free-vector/monitor_3425242.htm#query=monitor&position=12&from_view=search&track=sph

Knob (by macrovector)
https://www.freepik.com/free-vector/control-knob-regulators_10603970.htm#fromView=search&page=1&position=10&uuid=7f53d50e-d2c4-4b25-a481-c9a943a95a6f&query=knob


Green LED (by freepik)
https://www.freepik.com/free-vector/gradient-colored-ui-kit-collection_20826488.htm#fromView=search&page=2&position=44&uuid=57841508-4f27-452c-a67f-fbdf2ce097ce&query=Button+green

Jet Engine (by juicy_fish)
https://www.freepik.com/icon/jet_15128470#fromView=search&page=1&position=14&uuid=99490f7c-a1be-4497-9bf7-ebcca695afa1

Air Icon (by freepik)
https://www.freepik.com/icon/wind_1057159#fromView=search&page=1&position=13&uuid=97e39256-d172-4025-a1fe-19f0ec1ebab9

FMC (by andinur)
https://www.freepik.com/icon/interaction_17308023#fromView=search&page=2&position=21&uuid=8f615b59-358c-4ec5-b1f6-572974c2df61

Alarm (by freepik)
https://www.freepik.com/icon/alarm_469654#fromView=search&page=1&position=76&uuid=1bd3cdf4-8009-4136-90bf-d5ff2631c6dd

7seg fonts
https://github.com/keshikan/DSEG

