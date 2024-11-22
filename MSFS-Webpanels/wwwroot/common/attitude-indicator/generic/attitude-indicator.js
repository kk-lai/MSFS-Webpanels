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

    return class GenericAttitudeIndicator extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
           
            var i = 0;
            this.IDX_PITCH = i++;
            this.IDX_BANK = i++;
            this.IDX_PLANE_POS = i++;
            this.IDX_VAC = i++;
        }

        init()
        {
            this.aspectRatio = 1;
            this.htmlFile="../common/attitude-indicator/generic/attitude-indicator-template.html";
            this.cssFile="../common/attitude-indicator/generic/attitude-indicator.css";
        }

        refreshInstrument()
        {
            var lbls = ['.background', '.roll'];
            var rangle = this.displayVal[this.IDX_BANK];
            for(var i=0;i<2;i++) {               
                jquery(this.rootElm).find(lbls[i]).css("transform", "rotate("+rangle+"deg)");
            }
            var v = this.scale(this.displayVal[this.IDX_PITCH],-0.87890625,0, -20, 20);
            rangle=this.displayVal[this.IDX_BANK];
            jquery(this.rootElm).find('.pitch-wrapper').css("transform", "rotate("+rangle+"deg) translate(0,"+v+"%)");
            
            v = this.interpolate(this.displayVal[this.IDX_PLANE_POS],[
                    [-100, 19],
                    [-66, 13.5],
                    [-5, 0],
                    [47, -13.5],
                    [93, -27],
                    [100, -32.5]
                ]);
            jquery(this.rootElm).find('.plane-wrapper').css("transform", "translate(0,"+v+"%)");
            var gyro = jquery(this.rootElm).find('.gyro');
            if (this.displayVal[this.IDX_VAC]>2.3) {
                gyro.addClass("hide");
            } else {
                gyro.removeClass("hide");
            }
        }        
    }

});