require.config({
    baseUrl: '../',
    paths: {
        jquery: '3rdparty/jquery/jquery-1.11.2.min',
        leaflet: '3rdparty/leaflet/leaflet',
        SysParam: "common/sysparam",
        MapIcons: "map/map-icons",
        BaseMaps: "map/basemaps"
    },
    waitSeconds: 30,
});

require(['jquery', 'leaflet', 'SysParam', 'MapIcons','BaseMaps'], function (jquery, leaflet, SysParam, MapIcons, BaseMaps) {

    var map;
    var baseMaps = BaseMaps;
    var isPoolingSimVars = false;
    var isServerAppRunning = false;
    var followAircraft = true;

    var aiAircrafts = {};
    var userAircraft = null;
    var flightPlanLastUpdated  = null;

    var defaultLevel = 15;
    var maxZoomLevel = 20;

    var overlays = {
        "User Aircraft": leaflet.layerGroup([]),
        "Flight Plan": leaflet.layerGroup([]),
        "AI Aircrafts": leaflet.layerGroup([]),
        "Nav Aids": leaflet.layerGroup([])
    };

    var AircraftMarker = leaflet.Marker.extend({
        options: {
            clickable: false,
            keyboard: false,
            heading:0,
            id:'user',
            altitude: 0,
            groundSpeed: 0,
            atcId : '',
            flightNumber: '',
            airline : '',
            acModel: '',
            acType: '',
            isOnGround: true,
            wingSpan : 200,
            size: 50,
            interactive: false,
            zIndexOffset:0
        },
        _setPos: function (pos) {
            leaflet.Marker.prototype._setPos.call(this, pos);
            jquery(this._icon).children(".aircraft-icon").css("transform", 'rotate('+this.options.heading+"deg)");
            if (this.options.infoBox) {
                this.setInfoBoxText();
                leaflet.Tooltip.prototype._setPosition.call(this.options.infoBox,pos);
            }
        },
        onZoom: function() {
            var zoomLevel = map.getZoom();
            var icon = this.getIcon();
            this.setIcon(icon);
            this.setInfoBoxText();
            var offsetY = this.options.size * 0.4;
            this.options.infoBox.options.offset=[0,offsetY];
            this.options.infoBox.update();
        },
        getIcon: function() {
            var mpp=this.getDistancePerPixel();
            var newSize = this.options.wingSpan * 0.3048 / mpp;
            if (newSize<20) {
                newSize=20;
            }
            this.options.size=newSize;
            var icon = leaflet.divIcon({
                iconSize : [ newSize, newSize ],    
                iconAnchor: [ newSize/2, newSize/2 ],
                className: 'icon',
                html: '<div class="'+this.options.id+'-aircraft aircraft-icon">' + MapIcons.aircraft + '</div>'
            });
            return icon;
        },
        getInfoBox: function() {
            var zoomLevel = map.getZoom();
            var offsetY = this.options.size * 0.4;
            var pos = this.getLatLng();

            return leaflet.tooltip(pos, {
                className:  'aircraft-infobox '+ this.options.id + "-infobox",
                direction:  'bottom',
                permanent:true,
                offset:[0,offsetY],
                opacity:1
            });
        },
        setInfoBoxText: function() {
            var infoBoxText = '';
            var zoomLevel = map.getZoom();
            if (zoomLevel > 14) {
                if (this.options.id!='user') {    
                    if (zoomLevel == 15) {
                        infoBoxText = infoBoxText + '<div class="ac-type">' + this.options.acModel + '</div>';
                    } else {
                        infoBoxText = infoBoxText + '<div class="ac-callsign">' + this.options.atcId + '</div>';                    
                        infoBoxText = infoBoxText + '<div class="ac-type">' + this.options.acType + " " + this.options.acModel + '</div>';
                    }            
                }
                if (this.options.id=='user' || map.getZoom()>15) {
                    infoBoxText = infoBoxText + '<div class="ac-groundspeed">GS ' + Math.round(this.options.groundSpeed) + ' kts</div>';
                    var alt = new Intl.NumberFormat().format(Math.round(this.options.altitude));
                    if (!this.options.isOnGround) {
                        infoBoxText = infoBoxText + '<div class="ac-alt">ALT ' + alt + ' ft</div>';
                    }                    
                }   
            }         
            if (infoBoxText=='') {
                this.options.infoBox.setContent('&nbsp;');
            } else {
                this.options.infoBox.setContent(infoBoxText);
            }           
            
        },
        onAdd: function (map) {
            leaflet.Marker.prototype.onAdd.call(this,map);
            this.options.infoBox = this.getInfoBox();          
            this.setInfoBoxText();
            this.options.infoBox.addTo(map);
        },
        onRemove: function(map) {
            this.options.infoBox.remove();
            leaflet.Marker.prototype.onRemove.call(this,map);
        },
        initialize: function(latlng,options) {                     
            Object.assign(this.options, options);
            if (this.options.id=='user') {
                this.options.zIndexOffset = 1000;
            }            
            this.options.icon = this.getIcon();            
            leaflet.Marker.prototype.initialize(latlng, this.options);
            leaflet.Util.setOptions(this, this.options);
        },
        getDistancePerPixel: function()
        {
            var bnds = map.getBounds();
            var mapSize=map.getSize();
            var center = bnds.getCenter();
            var xd = leaflet.latLng(bnds.getWest(), center.lng).distanceTo(leaflet.latLng(bnds.getEast(),center.lng));
            var yd = leaflet.latLng(center.lat, bnds.getNorth()).distanceTo(leaflet.latLng(center.lat, bnds.getSouth()));

            var xdpp = xd / mapSize.x;
            var ydpp = yd / mapSize.y;
            return 0.8*((xdpp<ydpp) ? xdpp: ydpp);
        }
    });

    function updateFlightPlan(flightPlanDoc) {
        var prevflightPlanLastUpdated = flightPlanLastUpdated;
        flightPlanLastUpdated = null;
        if (flightPlanDoc!=null) {
            flightPlanLastUpdated = flightPlanDoc.lastUpdated;
        }        
        
        if (prevflightPlanLastUpdated != flightPlanLastUpdated) {
            var flightPlanOverlay = overlays["Flight Plan"];
            flightPlanOverlay.clearLayers();
            if (flightPlanLastUpdated != null) {
                var latlngs = [];
                for (var i = 0; i < flightPlanDoc.flightPlan.waypoints.length; i++) {
                    var waypt = flightPlanDoc.flightPlan.waypoints[i];
                    latlngs.push([waypt.latitude, waypt.longitude]);
                }
                flightPathShadow = leaflet.polyline(latlngs, { color: 'black', weight: 7 }).addTo(flightPlanOverlay);
                flightPath = leaflet.polyline(latlngs, { color: '#ff00ff', weight: 3 }).addTo(flightPlanOverlay);
            }
        }
    }

    function updateUserAircraft(planeData)
    {
        var newPos = leaflet.latLng(planeData.planeLatitude, planeData.planeLongitude);
        if (map.hasLayer(overlays["User Aircraft"])) {
            userAircraft.options.heading = planeData.planeTrueHeading;
            userAircraft.options.groundSpeed = planeData.planeGroundSpeed;
            userAircraft.options.altitude = planeData.planeAltitude;
            userAircraft.options.wingSpan = planeData.planeWingSpan;
            userAircraft.options.isOnGround = (planeData.planeOnGround == 1);
            userAircraft.setLatLng(newPos);
        }
        
        if (followAircraft) {
            if (map.getBounds().contains(newPos)) {
                map.panTo(newPos);
            } else {
                map.setView(newPos, map.getZoom());
            }
        }
    }

    function updateAIAircrafts(aircrafts)
    {
        var aiAircraftOverlay = overlays["AI Aircrafts"];
        var toDeleteAircrafts = aiAircrafts; // set all aircrafts to be deleted

        aiAircrafts = {}; // empty

        for(var i=0;i<aircrafts.length;i++) {
            if (!map.hasLayer(aiAircraftOverlay)) {
                break;
            }
            var aircraft = aircrafts[i];
            var acId = "ai"+aircraft.planeId;
            aircraft=aircraft.planeData;
            var aircraftMarker = null;
            var newPosition = leaflet.latLng(aircraft.planeLatitude, aircraft.planeLongitude);
            if (toDeleteAircrafts.hasOwnProperty(acId)) {
                aircraftMarker = toDeleteAircrafts[acId];
                delete toDeleteAircrafts[acId];
            } else {
                aircraftMarker = new AircraftMarker(newPosition, { 
                    id: acId,
                    atcId : aircraft.atcId,
                    flightNumber: aircraft.atcFlightNumber,
                    airline : aircraft.atcAirline,
                    acModel: aircraft.atcModel,
                    acType: aircraft.atcType,
                    wingSpan: aircraft.planeWingSpan
                });
                aircraftMarker.addTo(aiAircraftOverlay);
            }
            aircraftMarker.options.heading = aircraft.planeTrueHeading;
            aircraftMarker.options.groundSpeed = aircraft.planeGroundSpeed;
            aircraftMarker.options.altitude = aircraft.planeAltitude;           
            aircraftMarker.options.isOnGround = (aircraft.planeOnGround == 1);
            aircraftMarker.setLatLng(newPosition);
            aiAircrafts[acId]=aircraftMarker;
        }
        var acIds = Object.keys(toDeleteAircrafts);
        for(var i=0;i<acIds.length;i++) {
            var aircraftMarker = toDeleteAircrafts[acIds[i]];
            aircraftMarker.removeFrom(aiAircraftOverlay);
        }
    }

    function refreshMap() {
        if (isPoolingSimVars) {
            return;
        }
        isPoolingSimVars = true;
        jquery.ajax({
            url: SysParam.mapDataUrl,
            success: function (jsonData, textStatus, jqXHR) {
                isServerAppRunning = true;
                isPoolingSimVars = false;
                updateFlightPlan(jsonData.flightPlanDoc);            
                if (jsonData.userPlaneData!=null) {
                    updateUserAircraft(jsonData.userPlaneData);
                }
                if (jsonData.aiAircrafts!=null) {
                    updateAIAircrafts(jsonData.aiAircrafts);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                isPoolingSimVars = false;
                isServerAppRunning = false;
            },
            type: "get",
            dataType: "json",
            cache: false,
            timeout: 1000 // ms
        });
    }


    jquery(document).ready(function () {
        var overlayKeys = Object.keys(overlays);
        var baseMapKeys = Object.keys(baseMaps);

        var activeLayers = [];

        activeLayers.push(baseMaps[baseMapKeys[0]]);
        for(var i=0;i<overlayKeys.length;i++) {
            activeLayers.push(overlays[overlayKeys[i]]);
        }

        map = leaflet.map('map', {
            center: [22.29995262688891, 113.90904903482829],
            zoom: defaultLevel,
            layers: activeLayers,
            maxZoom: maxZoomLevel
        });
        leaflet.control.layers(baseMaps, overlays).addTo(map);

        userAircraft = new AircraftMarker([0,0], { id: 'user'});
        userAircraft.addTo(overlays[overlayKeys[0]]);

        map.on('zoomend', function(ev) {
            console.log(map.getZoom());
            userAircraft.onZoom();
            var oids = Object.keys(aiAircrafts);
            for(var i=0;i<oids.length;i++) {
                var oid = oids[i];
                var aircraftMarker = aiAircrafts[oid];
                aircraftMarker.onZoom();
            }
        });

        var followAircraftControl = leaflet.control({ position: "topleft" });
        followAircraftControl.onAdd = function (map) {
            this._div = leaflet.DomUtil.create('div', 'follow-aircraft leaflet-control-layers');
            this._div.innerHTML = '<i class="fa-solid fa-plane-circle-check"></i><i class="fa-solid fa-plane-circle-xmark hide"></i>';
            return this._div;
        }
        followAircraftControl.addTo(map);

        jquery(".follow-aircraft").on(SysParam.tapEvent, function (e) {
            followAircraft = !followAircraft;
            var c;
            if (followAircraft) {
                c = "check";
            } else {
                c = "xmark";
            }
            jquery(this).find(".fa-solid").addClass("hide");
            jquery(this).find(".fa-plane-circle-" + c).removeClass("hide");
            leaflet.DomEvent.stopPropagation(e);
        });

        map.addControl(new leaflet.Control.Scale({ width: 200, position: 'bottomleft', imperial: false }));

        setInterval(refreshMap, SysParam.mapRefreshPeriod);        
    });

});