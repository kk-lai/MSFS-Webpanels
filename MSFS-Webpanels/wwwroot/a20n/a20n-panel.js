require.config({
    baseUrl : '.',
    paths : {
        'Panel' : "../common/panel",
        'SysParam': '../common/sysparam'
    },
    waitSeconds : 30,
});

define(['Panel','SysParam'],function(Panel,SysParam) {
    class A20NPanel extends Panel {
        constructor(aspectRatio) {
            super(aspectRatio);
        }

        postProcessingFunc(jsonData)
        {
            if (!jsonData.isSimConnected) {
                return;
            }
            if (jsonData.aircraftFolder!="Asobo_A320_NEO") {
                window.location.replace("../?v=" + SysParam.versionCode);
            }
        }
    }

    return A20NPanel;


});
