require.config({
    waitSeconds : 30,
});

define(function() {
    return {
        isOfflineTest : false,
        defaultCoolDown : 500, // ms
        refreshPeriod : 200, // ms;
        serverUpdateCooldown :20, // ms
        mapRefreshPeriod: 500, // ms
        //simVarUrl: 'sample-data.json',
        simVarUrl: 'http://192.168.2.195:8888/api/SimData',
        mapDataUrl: 'sample-data.json',
        tapEvent: ('ontouchstart' in document.documentElement) ? 'touchstart': 'mousedown',
        tapEndEvent: ('ontouchstart' in document.documentElement) ? 'touchend': 'mouseup mouseleave',
        dragEvent: ('ontouchstart' in document.documentElement) ? 'touchstart touchmove touchend': 'mousedown mousemove mouseup mouseleave'
    };
});