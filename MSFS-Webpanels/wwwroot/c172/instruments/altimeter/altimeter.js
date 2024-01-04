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

    return class C172Altimeter extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
           
            var i = 0;
            this.IDX_ALTITUDE = i++;
            this.IDX_QNH = i++;
        }

        init()
        {
            this.aspectRatio = 1;
            this.htmlFile="../c172/instruments/altimeter/altimeter-template.html";
            this.cssFile="../c172/instruments/altimeter/altimeter.css";
        }

        refreshInstrument()
        {
            var lbls = ['.pressure-card','.needle-10k-wrapper','.needle-1k-wrapper','.needle-100-wrapper'];
            var idxs = [this.IDX_QNH, this.IDX_ALTITUDE, this.IDX_ALTITUDE, this.IDX_ALTITUDE];
            var tbls = [
                [-0.1845617765,112,15168,17104],
                [0.0036,0,null,null],
                [0.036,0,null,null],
                [0.36,0,null,null],
            ];
            for(var i=0;i<4;i++) {
                var v = this.displayVal[idxs[i]];
                var rangle = this.scale(v,tbls[i][0],tbls[i][1],tbls[i][2],tbls[i][3]);
                jquery(this.rootElm).find(lbls[i]).css('transform', 'rotate('+rangle+'deg)');
            }
        }        
    }

});