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

    return class GenericVerticalSpeedIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;
            this.IDX_VSI=i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../common/vertical-speed-indicator/generic/vertical-speed-indicator-template.html";
            this.cssFile="../common/vertical-speed-indicator/generic/vertical-speed-indicator.css";
        }
        
        refreshInstrument()
        {
            var v = this.displayVal[this.IDX_VSI];
            var rangle = super.interpolate(v, [
                [  -2000.0,-173.5],
                [  -1500.0,-131.5],
                [  -1000.0, -81.5],
                [   -500.0, -35.3],
                [      0.0,   0.0],
                [    500.0,  35.7],
                [   1000.0,  81.5],
                [   1500.0, 131.0],
                [   2000.0, 172.9]
            ]);

            jquery(this.rootElm).find('.needle-wrapper').css("transform", "rotate("+rangle+"deg)");            
        }        
    }

});