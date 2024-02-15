require.config({
    baseUrl : '../.',
    paths : {
        sysparam: 'common/sysparam'
    },
    waitSeconds : 30,
});

define(['sysparam'],function (sysparam) {
    return {
        aspectRatio: 1024/748,  // 1024/748 (full screen)
        defaultCoolDown : 500, // ms
        refreshPeriod : 50, // ms;
        serverUpdateCooldown :20, // ms
        simVarUrl: sysparam.simVarUrl,
        versionCode: sysparam.versionCode
    }
});