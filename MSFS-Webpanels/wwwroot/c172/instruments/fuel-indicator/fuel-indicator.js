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

    return class C172FuelIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
 
            var i = 0;
            this.IDX_LEFT_FUEL_QTY = i++;
            this.IDX_RIGHT_FUEL_QTY = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/fuel-indicator/fuel-indicator-template.html";
            this.cssFile="../c172/instruments/fuel-indicator/fuel-indicator.css";
        }        

        refreshInstrument()
        {
            var fuelMappingTbl = [
                [
                    [   0, 56.0],
                    [   5, 33.5],
                    [  10, 11.0],
                    [  15,-11.5],
                    [  20,-32.5],
                    [  26,-53.0]
                ],
                [
                    [   0,124.0],
                    [   5,146.5],
                    [  10,169.0],
                    [  15,191.5],
                    [  20,212.5],
                    [  26,233.0]
                ]
            ];
            var lblTbl =[ ".left-needle", ".right-needle" ];

            for(var i=0;i<2;i++) {
                var mappingTbl = fuelMappingTbl[i];
                var fqty = this.displayVal[i];

                var rangle = super.interpolate(fqty, mappingTbl);

                jquery(this.rootElm).find(lblTbl[i]).css("transform", "rotate("+rangle+"deg)");
            }
        }        
    }

});