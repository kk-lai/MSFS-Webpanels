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

    return class C172SimpleFuelSelector extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;

            this.IDX_FUELSELECTOR = i++;

        }

        init()
        {
            this.aspectRatio=184.32/49.95468617;
            this.htmlFile="../c172/instruments/simple-fuel-selector/simple-fuel-selector-template.html";
            this.cssFile="../c172/instruments/simple-fuel-selector/simple-fuel-selector.css";
        }

        refreshInstrument()
        {
            var state= this.displayVal[this.IDX_FUELSELECTOR];
            jquery(this.rootElm).find(".lever").removeClass("lever-state-0 lever-state-1 lever-state-2").addClass("lever-state-"+state);
        }        
    }

});