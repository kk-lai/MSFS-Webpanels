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

    return class C172EGT extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_ENGINE_EGT = i++;
            this.IDX_ENGING_FUELFLOW = i++;
            this.IDX_REFEGT = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../c172/instruments/egt/egt-template.html";
            this.cssFile="../c172/instruments/egt/egt.css";
        }

        refreshInstrument()
        {
            var needles = [".left-needle", ".ref-needle-wrapper"];
            var idx = [this.IDX_ENGINE_EGT, this.IDX_REFEGT ];
            var params = [
                [ -0.27, 526.5, 1750, 2150 ],
                [ -0.003326517533, 56.0, null, null ]
            ];
            for(var i=0;i<2;i++) {
                var v = this.displayVal[idx[i]];
                //console.log(v);
                var rangle = this.scale(v, params[i][0],params[i][1],params[i][2], params[i][3]);
                jquery(this.rootElm).find(needles[i]).css("transform", "rotate("+rangle+"deg)");
            }

            var rangle = this.interpolate(this.displayVal[this.IDX_ENGING_FUELFLOW], [
                    [   0,126.8],
                    [   5,134.8],
                    [   6,137.4],
                    [  10,156.4],
                    [  15,191.8],
                    [  19,233.0],
                    [  20,242.7]
                ]);
            jquery(this.rootElm).find(".right-needle").css("transform", "rotate("+rangle+"deg)");
        }        
    }

});