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

    return class C172AirspeedIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_IAS = i++;
            this.IDX_TAS_ADJ = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/asi/asi-template.html";
            this.cssFile="../c172/instruments/asi/asi.css";
        }        

        refreshInstrument()
        {
            var lbls = [".alt-wrapper",".tas-wrapper"];
            var tbls = [
                [-3.8,5],
                [-3.8,-2.5]
            ];
            var v = this.displayVal[this.IDX_TAS_ADJ];
            for(var i=0;i<2;i++) {                
                var rangle = this.scale(v, tbls[i][0], tbls[i][1]);
                jquery(this.rootElm).find(lbls[i]).css("transform", "rotate("+rangle+"deg)");
            }
            v = this.displayVal[this.IDX_IAS];
            var rangle = this.interpolate(v, [
                    [   0,  0.0],
                    [  10,  3.0],
                    [  40, 31.1],
                    [  60, 71.7],
                    [  80,118.0],
                    [ 100,165.3],
                    [ 120,206.6],
                    [ 140,238.3],
                    [ 160,267.7],
                    [ 180,293.1],
                    [ 200,319.2],
                    [ 210,331.6]
                ]);
            jquery(this.rootElm).find(".needle-wrapper").css("transform", "rotate("+rangle+"deg)");
        }        
    }

});