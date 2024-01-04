# MSFS-Webpanels

Introduction
============
This is a touch panel web application that allows users to control and view the gauges and switches of an aircraft’s panel with the browser of a tablet.

When I play MSFS, I face a problem where I need to move the view of the game to see some of the gauges. One of the most common solutions is to extend the screen with an extra monitor. However, my desk cannot fit one more monitor. There are solutions to extend PC screen with an iPad, but I think they are not good enough. If the second screen can accept input, it will be good. So, I developed this application. I looked for similar solutions on the internet, but some of them are not free. For free solutions, they do not fit me. Therefore, I decided to do it myself. My design goal is to find a balance between realism and usability. Thanks to project flightgear (https://www.flightgear.org/), I got readily made good quality images of gauges. These images make the panel look like a “real” panel. Instead of using knobs to change the input, my design is to drag the gauges directly because using knobs for input is difficult. After implementing all gauges and switches, I found that the auto-pilot and radio should be added too. My first thought was to implement the radio panel and show it when the user taps a button. However, changing the frequency or altitude with knobs is difficult, so I implemented a number pad interface to input these numbers. For now, only Cessna 172 panel is implemented. In the future, I plan to develop more panels for other aircraft.

Prerequisites
=============
ASP.NET Core 7.0 Runtime
https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-aspnetcore-7.0.13-windows-x64-installer

.NET 7.0 Desktop Runtime (v7.0.13)
https://dotnet.microsoft.com/en-us/download/dotnet/thank-you/runtime-desktop-7.0.13-windows-x64-installer

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

Application Icon
https://www.flaticon.com/free-icon/altitude-indicator_10403534

7-segment font
https://github.com/keshikan/DSEG

Volume knob
https://www.pngwing.com/en/free-png-zsndf

Altitude, ADF Knob
https://www.pngwing.com/en/free-png-zrgdi

Transponder Knob
https://www.pngwing.com/en/free-png-vatts

LED
https://www.pngwing.com/en/free-png-zhkmj

Screws
https://www.pngwing.com/en/free-png-awqdy

DME knob
https://www.pngwing.com/en/free-png-stxtt

Com transceiver knob
https://www.freepik.com/free-vector/realistic-set-circle-shiny-metallic-regulator-buttons-level-adjustment-transparent-background-isolated-vector-illustration_26763710.htm#query=control%20knob&position=1&from_view=search&track=ais&uuid=cf0bb9f9-4378-4642-860a-107cf52890ba

LED light effect
https://www.pngwing.com/en/free-png-bxvkg

Radio icon
https://www.freepik.com/icon/radio_1376241#fromView=search&term=radio+panel&page=4&position=34&track=ais

Map Icon
https://www.flaticon.com/free-icon/treasure-map_475489?term=map&page=1&position=38&origin=search&related_id=475489

Menu Icon
<a href="https://www.freepik.com/icon/menu_4458493#fromView=search&term=menu&page=20&position=14&track=ais&uuid=1c4ec3af-c29b-4051-a741-5b2802a2ad11">Icon by Rizki Ahmad Fauzi</a>

?
https://www.flaticon.com/free-icon/plane_10133867?term=airplane&page=7&position=14&origin=tag&related_id=10133867


Propeller Plane SVG Vector
https://www.svgrepo.com/svg/481021/propeller-plane

https://www.svgrepo.com/svg/480733/jumbo-plane


https://www.shareicon.net/bottom-view-military-helicopter-helicopter-plane-army-helicopter-transport-659389

https://www.svgrepo.com/svg/128811/helicopter-bottom-view-silhouette

