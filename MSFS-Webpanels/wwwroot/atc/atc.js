require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min'        
    },
    waitSeconds: 30,
});

require([
    'jquery'
],
function (jquery) {
    var apiRoot = "/api/webpanel";
    var appTimer = null;
    var isConnected = false;

    var requestDef = {
        "navLight": { "Cmd": "(A:LIGHT NAV, Bool)", "Delta": 0, "Type": "Integer" },
        "beaconLight": { "Cmd": "(A:LIGHT BEACON, Bool)", "Delta": 0, "Type": "Integer" },
        "fuelLQty": { "Cmd": "(A:FUEL LEFT QUANTITY, gallons)", "Delta": 0.5, "Type": "Double" },
        "fuelRQty": { "Cmd": "(A:FUEL RIGHT QUANTITY, gallons)", "Delta": 0.5, "Type": "Double" },
        "atcId": { "Cmd": "(A:ATC ID, String)", "Delta": 0, "Type": "String" }
    };
    var pid = "atc";

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

        appTimer = setInterval(timerFunc, 1000);
    });
});