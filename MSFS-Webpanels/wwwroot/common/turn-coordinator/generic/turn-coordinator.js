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

    return class GenericTurnCoordinator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;
            this.IDX_GENERAL_PLANE_ON=i++;
            this.IDX_BALL_POS=i++;
            this.IDX_TCRATE=i++;
        }

        init()
        {
            this.aspectRatio=1;
            this.htmlFile="../common/turn-coordinator/generic/turn-coordinator-template.html";
            this.cssFile="../common/turn-coordinator/generic/turn-coordinator.css";
        }

        refreshInstrument()
        {
            var lbls = ['.on-ind', '.off-ind'];
            var idxs = [ this.IDX_GENERAL_PLANE_ON, this.IDX_GENERAL_PLANE_ON];
            var vals = [ 1 , 0];

            for(var i=0;i<lbls.length;i++) {
                var v1 = this.displayVal[idxs[i]];
                var v2 = vals[i];
                if (v1==v2) {
                    jquery(this.rootElm).find(lbls[i]).removeClass("hide");
                } else {
                    jquery(this.rootElm).find(lbls[i]).addClass("hide");
                }
            }

            var v = this.displayVal[this.IDX_TCRATE];
            var rangle = this.scale(v, 6.666666666666667, -90, -7.5, 7.5);
            jquery(this.rootElm).find('.plane-wrapper').css('transform','rotate('+rangle+'deg)');

            v= this.displayVal[this.IDX_BALL_POS];
            var htranslate=v*1.505462598808; //v*1.4616141736;
            var vtranslate=-Math.abs(v)*0.140748031488;


            jquery(this.rootElm).find('.ball-wrapper').css("transform","translate("+htranslate+"%,"+vtranslate+"%)");
        }        
    }

});