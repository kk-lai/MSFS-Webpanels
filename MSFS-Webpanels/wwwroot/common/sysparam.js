require.config({
    waitSeconds : 30,
});

define(function() {           
    return {
        isOfflineTest : false,
        //isOfflineTest : false,
        defaultCoolDown : 500, // ms
        refreshPeriod : 50, // ms;
        serverUpdateCooldown :20, // ms  
        //simVarUrl: 'sample-data.json',
        simVarUrl: 'http://192.168.2.195:8888/api/SimData',
        tapEvent: ('ontouchstart' in document.documentElement) ? 'touchstart': 'mousedown',
        tapEndEvent: ('ontouchstart' in document.documentElement) ? 'touchend': 'mouseup mouseleave',
        dragEvent: ('ontouchstart' in document.documentElement) ? 'touchstart touchmove touchend': 'mousedown mousemove mouseup mouseleave'
    };
});