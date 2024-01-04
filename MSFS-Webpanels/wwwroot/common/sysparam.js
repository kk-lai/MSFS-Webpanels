require.config({
    waitSeconds : 30,
});

define(function() {           
    return {
        isOfflineTest : false,
        defaultCoolDown : 500, // ms
        refreshPeriod : 50, // ms;
        serverUpdateCooldown :20, // ms  
        mapRefreshPeriod: 500, // ms
        simVarUrl: '/api/SimData',
        mapDataUrl: '/api/MapData',
        tapEvent: ('ontouchstart' in document.documentElement) ? 'touchstart': 'mousedown',
        tapEndEvent: ('ontouchstart' in document.documentElement) ? 'touchend': 'mouseup mouseleave',
        dragEvent: ('ontouchstart' in document.documentElement) ? 'touchstart touchmove touchend': 'mousedown mousemove mouseup mouseleave'
    };
});