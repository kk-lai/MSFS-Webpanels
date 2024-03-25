require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min',
        'A20NPanel': "a20n-panel",
        'A20NFCU': "instruments/fcu/fcu",
        'A20NEFIS': "instruments/efis/efis",
        "SysParam": "../common/sysparam"
    },
    waitSeconds: 30,
});

require([
    'jquery', 'A20NPanel',
    'A20NFCU','A20NEFIS','SysParam'
],
    function (jquery, A20NPanel,
            A20NFCU,A20NEFIS,SysParam
        ) {
        class A20NGlareshieldPanel extends A20NPanel {
            constructor() {
                super(1024/748);
                this.refreshPeriod=500; // refresh every 0.5s
            }
        }

        jquery(document).ready(function () {
            jquery("#version-code").text(SysParam.versionCode);
            var panel = new A20NGlareshieldPanel();

            panel.loadCss("css/glareshield.css");
            panel.addInstrument(new A20NFCU(panel,jquery(".fcu").first()));
            panel.addInstrument(new A20NEFIS(panel,jquery(".efis").first()));
            panel.start();
        });

    }
);