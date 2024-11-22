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

    return class C172RPM extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_RPM = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/rpm/rpm-template.html";
            this.cssFile="../c172/instruments/rpm/rpm.css";
        }        

        refreshInstrument()
        {
            var v = this.displayVal[this.IDX_RPM];
            var rangle = super.interpolate(v, [
                [0,-38.6],
                [0.1,-33.85],
                [500,-2.85],
                [1000,32.9],
                [1500,68.9],
                [2000,105.4],
                [2500,141.4],
                [3000,177.4],
                [3500,213.4]
            ]);            

            jquery(this.rootElm).find('.needle-wrapper').css("transform", "rotate("+rangle+"deg)");         
        }        
    }

});