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

    return class GenericToggleSwitch extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_SW=i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../common/toggle-switch/generic/toggle-switch-template.html";
            this.cssFile="../common/toggle-switch/generic/toggle-switch.css";
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".switch").removeClass("switch-state-0 switch-state-1");
            jquery(this.rootElm).find(".switch").addClass("switch-state-"+this.displayVal[this.IDX_SW]);
        }        
    }

});