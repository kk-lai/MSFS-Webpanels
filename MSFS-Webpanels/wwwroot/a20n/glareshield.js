require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min',
        'A20NPanel': "a20n-panel",
        'A20NFCU': "instruments/fcu/fcu"
    },
    waitSeconds: 30,
});

require([
    'jquery', 'A20NPanel',
    'A20NFCU'
],
    function (jquery, A20NPanel,
            A20NFCU
        ) {
        class A20NGlareshieldPanel extends A20NPanel {
            constructor() {
                //super(1164/931)
                super(1024/748);
            }
        }

        jquery(document).ready(function () {

            var panel = new A20NGlareshieldPanel();

            panel.addInstrument(new A20NFCU(panel,jquery(".fcu").first()));
            panel.start();
        });

    }
);