require.config({
    waitSeconds : 30,
});

define(function() {
    return {
        versionCode : "1.2.0",
        logLevel: 2,
        isOfflineTest : false,
        defaultCoolDown : 500, // ms
        refreshPeriod : 200, // ms;
        serverUpdateCooldown :20, // ms
        simVarUrl: '/api/SimData',
        tapEvent: ('ontouchstart' in document.documentElement) ? 'touchstart': 'mousedown',
        tapEndEvent: ('ontouchstart' in document.documentElement) ? 'touchend': 'mouseup mouseleave',
        dragEvent: ('ontouchstart' in document.documentElement) ? 'touchstart touchmove touchend': 'mousedown mousemove mouseup mouseleave'
    };
});