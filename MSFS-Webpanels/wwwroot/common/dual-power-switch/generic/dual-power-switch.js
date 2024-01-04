require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument'
    },
    waitSeconds : 30,
});


define([
         'jquery', 'Instrument'    
         ],
function(jquery, Instrument) {

    return class GenericDualPowerSwitch extends Instrument {
        constructor(panel,elm, simvars, switchTheme = 'red', lblTop = '&nbsp;', lblLeft ='&nbsp;', lblRight = '&nbsp;')
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_SW1=i++;
            this.IDX_SW2=i++;

            this.isThemeSet = false;
            this.switchTheme = switchTheme;
            this.lblTop = lblTop;
            this.lblLeft = lblLeft;
            this.lblRight = lblRight;
        }

        init()
        {
            this.aspectRatio=97.0105263158016/140.1123031636005;
            this.htmlFile="../common/dual-power-switch/generic/dual-power-switch-template.html";
            this.cssFile="../common/dual-power-switch/generic/dual-power-switch.css";
        }

        refreshInstrument()
        {
            if (!this.isThemeSet) {
                jquery(this.rootElm).find(".generic-dual-power-switch").addClass(this.switchTheme+'-switch');
                jquery(this.rootElm).find(".switch-label").html(this.lblTop);
                jquery(this.rootElm).find(".switch-label-left").html(this.lblLeft);
                jquery(this.rootElm).find(".switch-label-right").html(this.lblRight);
                this.isThemeSet=true;
            }
            var lbls= ['.switch-left', '.switch-right'];
            for(var i=0;i<2;i++) {
                jquery(this.rootElm).find(lbls[i]).removeClass("switch-state-0 switch-state-1").addClass("switch-state-" + this.displayVal[i]);
            }
        }        
    }

});