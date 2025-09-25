require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min',
        "AbstractPanel": "../common/js/abstract-panel"
    },
    waitSeconds: 30,
});

require([
    'jquery', "AbstractPanel"
],
    function (jquery, AbstractPanel) {

    class B73MPanel extends AbstractPanel {
        constructor() {
            super('b73m');
            this.requestDef = {
                "taxiLight": { "Cmd": "(A:LIGHT TAXI, Bool)", "Delta": 0, "Type": "Integer" },
                "strobeLight": { "Cmd": "(A:LIGHT STROBE, Bool)", "Delta": 0, "Type": "Integer" }
            }
        }
    }

    var panel = new B73MPanel();
    panel.start();
    /*
    var apiRoot = "/api/webpanel";
    var aspectRatio = 1024 / 748;

    var appTimer = null;
    var isConnected = false;

    var requestDef = {
        "taxiLight": { "Cmd": "(A:LIGHT TAXI, Bool)", "Delta": 0, "Type": "Integer" },
        "strobeLight": { "Cmd": "(A:LIGHT STROBE, Bool)", "Delta": 0, "Type": "Integer" }
    };
    var pid = "b73m";

    var urlParams = new URLSearchParams(window.location.search);
    var urlArgs = "";
    if (urlParams.has('v')) {
        urlArgs = "v=" + urlParams.get('v');
    } else {
        urlArgs = "t=" + Date.now();
    }

    var resizeContainer = function () {
        var wh = jquery(window).innerHeight();
        var ww = jquery(window).innerWidth();

        var fh = wh;
        var fw = ww;
        var ar = ww / wh;
        var voffset = 0;
        var hoffset = 0;
        if (ar > aspectRatio) {
            fw = Math.floor(wh * aspectRatio);
            hoffset = (ww - fw) / 2;
        } else {
            fh = Math.floor(ww / aspectRatio);
            voffset = (wh - fh);
        }
        jquery("#svg-container").css("width", fw);
        jquery("#svg-container").css("height", fh);
        jquery("#svg-container").css("padding-top", voffset);
        jquery("#svg-container").css("padding-left", hoffset);

        jquery("#svg-container svg").attr("width", fw);
        jquery("#svg-container svg").attr("height", fh);

    }

    var timerFunc = function () {
        if (isConnected) {
            jquery.ajax({
                url: apiRoot + "/get-data/" + pid,
                method: "GET",
                success: function (jsonData, textStatus, jqXHR) {
                    isConnected = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    isConnected = false;
                },
                dataType: "json",
                cache: false
            });
        } else {
            jquery.ajax({
                url: apiRoot + "/register/" + pid,
                data: JSON.stringify(requestDef),
                contentType: "application/json",
                method: "POST",
                success: function (jsonData, textStatus, jqXHR) {
                    isConnected = true;
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    isConnected = false;
                },
                cache: false
            });
        }
    }

    jquery(document).ready(function () {
        jquery.get('b73m.svg?' + urlArgs, function (data) {
            var svg = jquery(data).find('svg');
            jquery("#svg-container").html(svg);
            resizeContainer();
            jquery(window).resize(function () {
                resizeContainer();
            });
        });
        //appTimer = setInterval(timerFunc, 1000);
    });
    */
});