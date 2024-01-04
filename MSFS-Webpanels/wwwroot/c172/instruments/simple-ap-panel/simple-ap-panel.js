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

    return class C172SimpleAPPanel extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);
            
            var i = 0;

            this.IDX_APALTITUDE = i++;
            this.IDX_APMASTER = i++;
            this.IDX_HDGLOCK = i++;
            this.IDX_NAVLOCK = i++;
            this.IDX_ALTLOCK = i++;
            this.IDX_VSHOLD = i++;
            this.IDX_VSHOLDSPEED = i++;
            this.IDX_APRHOLD = i++;
            this.IDX_REVHOLD = i++;
            this.IDX_GSHOLD = i++;
        }

        init()
        {
            this.aspectRatio=537.31512786944/50.6315789342;
            this.htmlFile="../c172/instruments/simple-ap-panel/simple-ap-panel-template.html";
            this.cssFile="../c172/instruments/simple-ap-panel/simple-ap-panel.css";
        }

        getAPStatusText() {
            var apStatus1="";
            var apStatus2="";
            if (this.displayVal[this.IDX_APMASTER] != 0) {
                apStatus1 = "ROL";
                if (this.displayVal[this.IDX_HDGLOCK] != 0) {
                    apStatus1 = "HDG";
                } else if (this.displayVal[this.IDX_NAVLOCK] != 0) {
                    apStatus1 = "NAV";
                } else if (this.displayVal[this.IDX_APRHOLD] != 0) {
                    apStatus1 = "APR";
                } else if (this.displayVal[this.IDX_REVHOLD]!= 0) {
                    apStatus1 = "REV";
                }
                apStatus2 = "PIT";
                if (this.displayVal[this.IDX_VSHOLD] != 0) {
                    apStatus2 = "VS";
                } else if (this.displayVal[this.IDX_ALTLOCK] != 0) {
                    apStatus2 = "ALT";
                } else if (this.displayVal[this.IDX_GSHOLD] != 0) {
                    apStatus2 = "GS";
                }
            }
            return [ apStatus1, apStatus2 ];
        }

        refreshInstrument()
        {
            var tval = this.displayVal[this.IDX_APALTITUDE].toString();
            if (tval.length>3) {
                tval = tval.substring(0,tval.length-3) + "&nbsp;" + tval.substring(tval.length-3, tval.length);
            }
            jquery(this.rootElm).find(".apaltitude").html(tval);
            jquery(this.rootElm).find(".apverticalholdspeed").text(this.displayVal[this.IDX_VSHOLDSPEED]);
            var apStatus = this.getAPStatusText();
            jquery(this.rootElm).find(".apstatus1").text(apStatus[0]);
            jquery(this.rootElm).find(".apstatus2").text(apStatus[1]);
        }        
    }

});