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

    return class C172SimpleFlapsLever extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;

            this.IDX_FLAPSPOSITION = i++;

        }

        init()
        {
            this.aspectRatio=1/2;
            this.htmlFile="../c172/instruments/simple-flaps-lever/simple-flaps-lever-template.html";
            this.cssFile="../c172/instruments/simple-flaps-lever/simple-flaps-lever.css";
        }

        refreshInstrument()
        {
            var voffset=this.displayVal[this.IDX_FLAPSPOSITION]*160.4444444;
            jquery(this.rootElm).find(".lever").css('transform', 'translate(0,'+voffset+'%)');
        }        
    }

});