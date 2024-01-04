require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        Instrument: '../common/instrument',
        StaticPropertyHelper: "../common/static-property-helper"
    },
    waitSeconds : 30,
});


define([
         'jquery', 'Instrument','StaticPropertyHelper'    
         ],
function(jquery, Instrument, StaticPropertyHelper) {

    return class C172ADFIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {         
            super(panel,elm, simvars);           
            var i = 0;
            this.IDX_ADFCARD = i++;
            this.IDX_ADFDIR = i++;
        }

        init()
        {
            this.aspectRatio = 1;
            this.htmlFile="../c172/instruments/adf-indicator/adf-indicator-template.html";
            this.cssFile="../c172/instruments/adf-indicator/adf-indicator.css";
        }

        refreshInstrument()
        {
            var lbls = ['.needle-wrapper', '.az-card', '.knob'];
            var idxs = [ this.IDX_ADFDIR, this.IDX_ADFCARD, this.IDX_ADFCARD];
            var sfs = [
                    [1,0],
                    [-1,0],
                    [20,0],
                ];
            for(var i=0;i<lbls.length;i++) {
                var v1 = this.displayVal[idxs[i]];
                var rangle = this.scale(v1, sfs[i][0], sfs[i][1]);
                jquery(this.rootElm).find(lbls[i]).css('transform','rotate('+rangle+'deg)');
            }
        }        
    }

});