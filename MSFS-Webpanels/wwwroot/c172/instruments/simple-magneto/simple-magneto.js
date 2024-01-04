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

    return class C172SimpleMagneto extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
 
            var i = 0;
            this.IDX_ENGINESTARTER=i++;
            this.IDX_LEFTMAGNETOSTATE=i++;
            this.IDX_RIGHTMAGNETOSTATE=i++;

            // local variable
            this.IDX_MAGNETO_POS = i++;

            i=0;
            this.MAGNETO_OFF = i++;
            this.MAGNETO_RIGHT = i++;
            this.MAGNETO_LEFT = i++;
            this.MAGNETO_BOTH = i++;
            this.MAGNETO_START = i++;

            this.displayVal.push(0);
        }

        init()
        {
            this.aspectRatio=307/333;
            this.htmlFile="../c172/instruments/simple-magneto/simple-magneto-template.html";
            this.cssFile="../c172/instruments/simple-magneto/simple-magneto.css";
        }        

        refreshInstrument()
        {
            var positions =  [-65,-35,0,35,65];

            var magnetoPosition = 0;

            magnetoPosition = this.MAGNETO_OFF;
            if (this.displayVal[this.IDX_ENGINESTARTER] == 1) {
                magnetoPosition = this.MAGNETO_START;
            } else {
                if (this.displayVal[this.IDX_RIGHTMAGNETOSTATE] == 1) {
                    magnetoPosition = this.MAGNETO_RIGHT;
                }
                if (this.displayVal[this.IDX_LEFTMAGNETOSTATE] == 1) {
                    magnetoPosition += this.MAGNETO_LEFT;
                }
            }

            this.displayVal[this.IDX_MAGNETO_POS]=magnetoPosition;
            var rang = positions[magnetoPosition];
            jquery(this.rootElm).find(".magneto-switch").css("transform", "rotate("+rang+"deg)");
        }        
    }

});