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

    return class KI209 extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;
            this.IDX_OBS = i++;
            this.IDX_TOFROM = i++;
            this.IDX_GS_FLAG = i++;
            this.IDX_CDI = i++;
            this.IDX_GSI = i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../common/course-deviation-indicator/ki209/ki209-template.html";
            this.cssFile="../common/course-deviation-indicator/ki209/ki209.css";
        }

        refreshInstrument()
        {
            var lbls = ['.from-ind', '.to-ind', '.gs-ind'];
            var idxs = [ this.IDX_TOFROM, this.IDX_TOFROM, this.IDX_GS_FLAG];
            var vals = [ 2, 1, 1];

            for(var i=0;i<lbls.length;i++) {
                var v1 = this.displayVal[idxs[i]];
                var v2 = vals[i];
                if (v1==v2) {
                    jquery(this.rootElm).find(lbls[i]).removeClass("hide");
                } else {
                    jquery(this.rootElm).find(lbls[i]).addClass("hide");
                }
            }
            
            lbls = ['.nav-needle-motor', '.nav-needle-wrapper', '.gs-needle-motor', '.gs-needle-wrapper', '.az-card', '.knob'];
            idxs = [ this.IDX_CDI, this.IDX_CDI, this.IDX_GSI, this.IDX_GSI, this.IDX_OBS, this.IDX_OBS];
            var sfs = [
                    [-0.2519685039,90],
                    [-0.2519685039,0],
                    [0.2941176470,0],
                    [0.2941176470,0],
                    [-1,0],
                    [20,0]
                ];
            for(var i=0;i<lbls.length;i++) {
                var v1 = this.displayVal[idxs[i]];
                var rangle = this.scale(v1, sfs[i][0], sfs[i][1]);
                jquery(this.rootElm).find(lbls[i]).css('transform','rotate('+rangle+'deg)');
            }
        }        
    }

});