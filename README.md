# MSFS-Webpanels

Introduction
============
When I play MSFS, I face a problem where I need to move the view of the game to see some of the gauges. One of the most common solutions is to buy an extra monitor. However, my desk cannot fit one more monitor. There are solutions to extend PC screen with an iPad, but I think they are not good enough. If the second screen can accept input, it will be good. So, I developed this application. I looked for similar solutions on the internet, but some of them are not free. For free solutions, they do not fit me. Therefore, I decided to do it myself. My design goal is to find a balance between realism and usability. Thanks to project flightgear (https://www.flightgear.org/), I got readily made good quality images of gauges. These images make the panel look like a “real” panel. Instead of using knobs to change the input, my design is to drag the gauges directly because using knobs for input is difficult. After implementing all gauges and switches, I found that the auto-pilot and radio should be added too. My first thought was to implement the radio panel and show it when the user taps a button. However, changing the frequency or altitude with knobs is difficult, so I implemented a number pad interface to input these numbers. For now, only Cessna 172 panel is implemented. In the future, I plan to develop more panels for other aircraft.

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

Usage
=====
1. Run the executable “MSFS-Webpanels.exe”.
2. Connect MSFS by clicking the “Connect” button.
3. On your tablet, open the panel page with a browser by entering the link stated in the application or scanning the QRCode with your tablet’s camera.
4. Tap the “i” icon at the bottom right corner to see the locations of the controls, where arrows are drag controls and dots are tap controls.
5. In case the panel does not work properly, tap the “refresh” icon beside the “i” icon to reload the page.
6. If you want to use the panel in full screen, you may add the page to your home screen by selecting “Share” > “Add to Home Screen” on your iPad.

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
