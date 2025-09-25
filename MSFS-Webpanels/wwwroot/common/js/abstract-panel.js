require.config({
    baseUrl: '.',
    paths: {
        jquery: '../3rdparty/jquery/jquery-1.11.2.min'
    },
    waitSeconds: 30,
});


define([
    'jquery'
],
    function (jquery) {
        return class AbstractPanel {
            apiRoot = "/api/webpanel";
            aspectRatio = 1024 / 748;
            appTimer = null;
            isConnected = false;
            urlArgs = ""
            panelId = ""
            requestDef = null;

            constructor(panelId) {
                this.panelId = panelId;
            }

            start() {
                var urlParams = new URLSearchParams(window.location.search);
                this.urlArgs = "";
                if (urlParams.has('v')) {
                    this.urlArgs = "v=" + urlParams.get('v');
                } else {
                    this.urlArgs = "t=" + Date.now();
                }

                var that = this;
                jquery(document).ready(function () {
                    jquery.get('b73m.svg?' + this.urlArgs, function (data) {
                        var svg = jquery(data).find('svg');
                        jquery("#svg-container").html(svg);
                        that.resizeContainer();
                        jquery(window).resize(function () {
                            that.resizeContainer();
                        });
                    });
                    //appTimer = setInterval(timerFunc, 1000);
                });
            }

            timerFunc() {
                if (this.isConnected) {
                    jquery.ajax({
                        url: this.apiRoot + "/get-data/" + this.panelId,
                        method: "GET",
                        success: function (jsonData, textStatus, jqXHR) {
                            this.isConnected = true;
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            this.isConnected = false;
                        },
                        dataType: "json",
                        cache: false
                    });
                } else {
                    jquery.ajax({
                        url: this.apiRoot + "/register/" + this.panelId,
                        data: JSON.stringify(this.requestDef),
                        contentType: "application/json",
                        method: "POST",
                        success: function (jsonData, textStatus, jqXHR) {
                            this.isConnected = true;
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            this.isConnected = false;
                        },
                        cache: false
                    });
                }
            }

            resizeContainer() {
                var wh = jquery(window).innerHeight();
                var ww = jquery(window).innerWidth();

                var fh = wh;
                var fw = ww;
                var ar = ww / wh;
                var voffset = 0;
                var hoffset = 0;
                if (ar > this.aspectRatio) {
                    fw = Math.floor(wh * this.aspectRatio);
                    hoffset = (ww - fw) / 2;
                } else {
                    fh = Math.floor(ww / this.aspectRatio);
                    voffset = (wh - fh);
                }
                jquery("#svg-container").css("width", fw);
                jquery("#svg-container").css("height", fh);
                jquery("#svg-container").css("padding-top", voffset);
                jquery("#svg-container").css("padding-left", hoffset);

                jquery("#svg-container svg").attr("width", fw);
                jquery("#svg-container svg").attr("height", fh);
            }
        }
    });
