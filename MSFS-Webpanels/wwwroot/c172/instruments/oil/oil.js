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

    return class C172Oil extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_OIL_TEMP = i++;
            this.IDX_OIL_PRESSURE = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/oil/oil-template.html";
            this.cssFile="../c172/instruments/oil/oil.css";
        }        

        refreshInstrument()
        {
            var mappingTbls= [
                [
                    [  55, 60.0],
                    [  75, 55.0],
                    [ 100, 45.0],
                    [ 150, 13.0],
                    [ 200,-26.0],
                    [ 245,-56.5],
                    [ 260,-66.7]
                ],
                [
                    [0,123],
                    [20,143],
                    [40,161.5],
                    [60,181.5],
                    [80,201.5],
                    [100,221.5],
                    [115,235],
                    [120,239.5]
                ]
            ];
            var lblTbl =[ ".left-needle", ".right-needle" ];

            for(var i=0;i<2;i++) {
                var mappingTbl = mappingTbls[i];
                var fqty = this.displayVal[i];
                if (i==0) {
                    fqty=fqty-460;
                }

                var rangle = super.interpolate(fqty, mappingTbl);

                jquery(this.rootElm).find(lblTbl[i]).css("transform", "rotate("+rangle+"deg)");
            }
        }        
    }

});