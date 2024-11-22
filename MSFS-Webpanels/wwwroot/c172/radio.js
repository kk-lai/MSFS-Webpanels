require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min',
        'KT76C': "../common/transponder/kt76c/kt76c",
        'KX165': "../common/comm-transceiver/kx165/kx165",
        'KAP140': "../common/autopilot-system/kap140/kap140",
        'KMA28': "../common/audio-panel/kma28/kma28",
        'KR87': "../common/adf-system/kr87/kr87",
        'KDI572': "../common/dme-system/kdi572/kdi572",
        'C172Panel': "c172panel"
    },
    waitSeconds: 30,
});

require([
    'jquery', 'KT76C', 'KX165', 'KAP140', 'KMA28', 'KR87', 'KDI572', 'C172Panel'
],
    function (jquery, KT76C, KX165, KAP140, KMA28, KR87, KDI572, C172Panel) {


        class RadioPanel extends C172Panel {
            constructor() {
                //super(1164/931)
                super(1 / 1.802441848);
            }
        }


        jquery(document).ready(function () {

            var panel = new RadioPanel();
               
            panel.addInstrument(new KMA28(panel,jquery(".audio-panel").first(), [
                "switchAvionics1", 
                "generalPanelOn",
                "audioPanelVolume",
                "markerTestMute",
                "markerIsHighSensitivity",
                "intercomMode",
                "com1rx",
                "com2rx",
                "nav1rx",
                "nav2rx",
                "markerSoundOn",
                "intercomActive",
                "adfrx",
                "dmeSoundOn",
                "speakerActive",
                "com1tx",
                "com2tx",
                "com3tx",
                "pilotTx",
                "copilotTxType",
                "pilotTxing",
                "copilotTxing",
                "insideMarkerOn",
                "middleMarkerOn",
                "outsideMarkerOn"            
            ]));
            
            panel.addInstrument(new KX165(panel,jquery(".comm-transceiver1").first(), [
                "switchAvionics1", 
                "generalPanelOn",
                "com1ActiveFreq",
                "com1StandbyFreq",
                "com1Volume",
                "nav1ActiveFreq",
                "nav1StandbyFreq",
                "nav1Volume"
            ]));
            panel.addInstrument(new KX165(panel,jquery(".comm-transceiver2").first(), [
                "switchAvionics1", 
                "generalPanelOn",
                "com2ActiveFreq",
                "com2StandbyFreq",
                "com2Volume",
                "nav2ActiveFreq",
                "nav2StandbyFreq",
                "nav2Volume"
            ]));
            panel.addInstrument(new KDI572(panel,jquery(".dme-system").first(), [
                "switchAvionics1", 
                "generalPanelOn",      
                "dmeDistance",
                "dmeSpeed",
                "dmeSignal",
                "dmeIsAvailable",                        
                "dme2Distance",
                "dme2Speed",
                "dme2Signal",
                "dme2IsAvailable"
            ]));
            panel.addInstrument(new KR87(panel,jquery(".adf-receiver").first(), [
                "switchAvionics1", 
                "generalPanelOn",    
                "adfActiveFreq",
                "adfStandbyFreq",
                "adfVolume",
                "simulationTime"                    
            ]));         
            panel.addInstrument(new KAP140(panel,jquery(".autopilot-system").first(), [
                        "switchAvionics1", 
                        "generalPanelOn",                
                        "apMaster",
                        "apHeadingLock",
                        "apNavLock",
                        "apAltitudeLock",
                        "apVerticalHold",
                        "apVerticalHoldSpeed",
                        "apApproachHold",
                        "apRevHold",
                        "apGSHold",
                        "apAltitude",
                        "qnh2"
                    ]));                       
            
            panel.addInstrument(new KT76C(panel,jquery(".transponder").first(), [
                    "pressureAltitude", 
                    "xpdr", 
                    "xpdrSwitch", 
                    "switchAvionics1", 
                    "generalPanelOn"]));
                
            panel.start();

        });


    });
