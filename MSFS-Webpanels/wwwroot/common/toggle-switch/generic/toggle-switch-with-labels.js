require.config({
    baseUrl : '.',
    paths : {
        jquery : '../../3rdparty/jquery/jquery-1.11.2.min',
        GenericToggleSwitch : '../common/toggle-switch/generic/toggle-switch'
    },
    waitSeconds : 30,
});


define([
         'jquery', 'GenericToggleSwitch'    
         ],
function(jquery, GenericToggleSwitch) {

    return class ToggleSwitchWithLabels extends GenericToggleSwitch {
        constructor(panel,elm, simvars, labelOn, labelOff)
        {            
            super(panel,elm, simvars);

            var i = 0;
            this.IDX_SW=i++;

            this.isLabelSet = false;
            this.onLabel = labelOn;
            this.offLabel = labelOff;
        }

        init()
        {
            this.aspectRatio=4540150377/9270182943;
            this.htmlFile="../common/toggle-switch/generic/toggle-switch-with-labels-template.html";
            this.cssFile="../common/toggle-switch/generic/toggle-switch-with-labels.css";
        }

        refreshInstrument()
        {
            if (!this.isLabelSet) {
                jquery(this.rootElm).find(".top-label").html(this.onLabel);
                jquery(this.rootElm).find(".bottom-label").html(this.offLabel);
            }
            super.refreshInstrument();
        }        
    }

});