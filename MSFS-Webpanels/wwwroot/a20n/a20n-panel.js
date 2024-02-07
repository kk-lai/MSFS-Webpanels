require.config({
    baseUrl : '.',
    paths : {
        'Panel' : "../common/panel",
    },
    waitSeconds : 30,
});

define(['Panel'],function(Panel) {
    class A20NPanel extends Panel {
        constructor(aspectRatio) {
            super(aspectRatio);
        }

        postProcessingFunc(jsonData)
        {
            if (!jsonData.isSimConnected) {
                return;
            }
        }
    }

    return A20NPanel;


});
