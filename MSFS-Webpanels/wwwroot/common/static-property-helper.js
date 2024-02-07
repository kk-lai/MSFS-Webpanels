require.config({
    waitSeconds : 30,
});

define(function() {           
    return {
        "setProperty" : function(c,k,v) {
            if (!this.hasOwnProperty(c)) {
                this[c]={};
            }
            this[c][k]=v;
        },
        "getProperty" : function(c,k) {
            if (!this.hasOwnProperty(c) || !this[c].hasOwnProperty(k)) {
                return null;
            }
            return this[c][k];
        }
    };
});