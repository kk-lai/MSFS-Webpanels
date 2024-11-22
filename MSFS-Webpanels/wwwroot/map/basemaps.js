require.config({
    baseUrl: '../../',
    paths: {
        leaflet: '3rdparty/leaflet/leaflet'
    },
    waitSeconds: 30,
});

define(['leaflet'],function(leaflet) {
    return {
        "OpenStreetMap": leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© <a href="/copyright">OpenStreetMap contributors</a>'
            }),
        "OpenTopoMap": leaflet.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                maxZoom: 16,
                subdomains: 'abc',
                attribution: 'map data: © <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | map style: © <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }),
        "Carto Light": leaflet.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '<a href="https://carto.com/">© CARTO</a> <a href="http://openmaptiles.org/">© OpenMapTiles</a> <a href="https://openstreetmap.org/copyright">© OpenStreetMap contributors</a>'
            }),
        "ESRI World Imagery": leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                maxZoom: 19,
            })
    };
});