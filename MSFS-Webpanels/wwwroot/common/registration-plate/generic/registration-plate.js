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

    return class GenericRegistrationPlate extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_ATCID=i++;
        }

        init()
        {
            this.aspectRatio=112.64/50.6315789342;
            this.htmlFile="../common/registration-plate/generic/registration-plate-template.html";
            this.cssFile="../common/registration-plate/generic/registration-plate.css";
        }

        refreshInstrument()
        {
            jquery(this.rootElm).find(".atcid").text(this.displayVal[this.IDX_ATCID]);
        }        
    }

});