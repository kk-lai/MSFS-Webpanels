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

    return class C172SimpleRadioPanel extends Instrument {
        constructor(panel,elm, simvars)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_COM1ACTIVEFREQ=i++;
            this.IDX_COM1STANDBYFREQ=i++;
            this.IDX_COM2ACTIVEFREQ=i++;
            this.IDX_COM2STANDBYFREQ=i++;
            this.IDX_NAV1ACTIVEFREQ=i++;
            this.IDX_NAV1STANDBYFREQ=i++;
            this.IDX_NAV2ACTIVEFREQ=i++;
            this.IDX_NAV2STANDBYFREQ=i++;
            this.IDX_ADFACTIVEFREQ=i++;
            this.IDX_ADFSTANDBYFREQ=i++;
            this.IDX_DMEDISTANCE=i++;
            this.IDX_DMESIGNAL=i++;
            this.IDX_DMEISAVAILABLE=i++;
        }

        init()
        {
            this.aspectRatio=354.304/50.6315789342;
            this.htmlFile="../c172/instruments/simple-radio-panel/simple-radio-panel-template.html";
            this.cssFile="../c172/instruments/simple-radio-panel/simple-radio-panel.css";
        }        

        refreshInstrument()
        {       
            var lbls=['.active-freq', '.standby-freq'];
            var sf = 1;
            var dp = 3;
            for(var ri=0;ri<5;ri++) {
                var radioType = this.simvars[ri*2];
                if (radioType.startsWith("adf")) {
                    radioType=".adf";
                    sf=1;
                    dp=0;
                } else {
                    if (radioType.startsWith("nav")) {
                        dp=2;
                    }
                    radioType="."+radioType.substring(0,4);
                    sf=0.001;
                }
                for(var fi=0;fi<2;fi++) {
                    var freq = this.displayVal[ri*2+fi]*sf;
                    if (dp>0) {
                        freq=freq.toFixed(dp);
                    } else {
                        freq=freq.toString().padStart(4,"0");
                    }
                    jquery(this.rootElm).find(radioType + " " + lbls[fi]).text(freq);                    
                }
            }
            var dme = "";
            
            if (this.displayVal[this.IDX_DMEISAVAILABLE] && this.displayVal[this.IDX_DMESIGNAL]>0) {
                var dmeVal = this.displayVal[this.IDX_DMEDISTANCE]/10;
                if (dmeVal<99.95) {
                    dme=dmeVal.toFixed(1);
                } else {
                    dme=dmeVal.toFixed(0);
                }                
            }
            jquery(this.rootElm).find(".dme-distance").text(dme);
        }        
    }

});