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

    return class C172VAC extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/vac/vac-template.html";
            this.cssFile="../c172/instruments/vac/vac.css";
        }

        refreshInstrument()
        {
            var sfs = [
                [-27.5,137.5,2,7],
                [-0.916667,180,-60,60]
            ];
            var lblTbl =[ ".left-needle", ".right-needle" ];

            for(var i=0;i<2;i++) {                
                var v = this.displayVal[i];
                var rangle = super.scale(v,sfs[i][0],sfs[i][1],sfs[i][2],sfs[i][3]);

                jquery(this.rootElm).find(lblTbl[i]).css("transform", "rotate("+rangle+"deg)");
            }
        }        
    }

});