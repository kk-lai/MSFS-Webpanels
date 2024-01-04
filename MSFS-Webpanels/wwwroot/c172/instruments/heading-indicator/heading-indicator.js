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

    return class C172HeadingIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;
            this.IDX_HEADING=i++;
            this.IDX_HDGBUG=i++;
            this.IDX_GYRODRIFTERROR=i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/heading-indicator/heading-indicator-template.html";
            this.cssFile="../c172/instruments/heading-indicator/heading-indicator.css";
        }

        refreshInstrument()
        {
            var lbls = ['.backplate', '.hdg-knob', '.push-knob'];
            var idxs = [ this.IDX_HEADING, this.IDX_HDGBUG, this.IDX_GYRODRIFTERROR];
            var sfs = [
                    [-1,0],
                    [1,0],
                    [-1,0]
                ];
            for(var i=0;i<lbls.length;i++) {
                var v1 = this.displayVal[idxs[i]];
                var rangle = this.scale(v1, sfs[i][0], sfs[i][1]);
                jquery(this.rootElm).find(lbls[i]).css('transform','rotate('+rangle+'deg)');
            }

            var rangle = this.displayVal[this.IDX_HDGBUG]-this.displayVal[this.IDX_HEADING];
            jquery(this.rootElm).find(".bug-wrapper").css('transform','rotate('+rangle+'deg)');
        }        
    }

});