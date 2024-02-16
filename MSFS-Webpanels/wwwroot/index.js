require.config({
    baseUrl : '.',
    paths : {
        jquery : '3rdparty/jquery/jquery-1.11.2.min',
        sysParam : 'common/sysparam'
    },
    waitSeconds : 30,
});

require([
         'jquery','sysParam'
         ],
function($,sysParam) {
    function redirect() {
        $.ajax({
            url: sysParam.simVarUrl,
            success: function(jsonData, textStatus, jqXHR ){
                if (!jsonData.isSimConnected) {
                    setTimeout(redirect, 1000);
                    return;
                }
                var url;
                if (jsonData.aircraftFolder=="Asobo_A320_NEO") {
                    url = "a20n/" + "?v="+sysParam.versionCode;
                } else {
                    url = "c172/" + "?v="+sysParam.versionCode;
                }
                window.location.replace(url);
            },
            error: function(jqXHR, textStatus, errorThrown ) {
                setTimeout(redirect, 1000);
            },
            type: "get",
            dataType : "json",
            cache: false
        });
    }

    $(document).ready(function() {
        var versionCode = sysParam.versionCode;
        $("#version").text("("+versionCode+")");
        if (!urlParams.has("noRedirect")) {
            // redirect
            redirect();
        }
    });
});