var geomap = function(elem) {
    this.map =            new OpenLayers.Map(elem);
    this.mapnik         = new OpenLayers.Layer.OSM();
    
    var wgs84 = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var mercator   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    
    this.map.addLayer(this.mapnik);
    
    var vectorLayer = new OpenLayers.Layer.Vector("Overlay");
    this.map.addLayer(vectorLayer);

    //Add a selector control to the vectorLayer with popup functions
    var controls = {
        selector: new OpenLayers.Control.SelectFeature(vectorLayer, { onSelect: createPopup, onUnselect: destroyPopup })
      };


    this.map.addControl(controls['selector']);
    controls['selector'].activate();
  
    function createPopup(feature) {
        feature.popup = new OpenLayers.Popup.FramedCloud("pop",
            feature.geometry.getBounds().getCenterLonLat(),
            null,
            '<div style="width:400px;height:244px"><img src="' + feature.attributes.featureImg + '" title="' + feature.attributes.featureTitle + '"></img></div>',
            null,
            true,
            function() { controls['selector'].unselectAll(); }
        );
        //feature.popup.closeOnMove = true;
        this.map.addPopup(feature.popup);
    }
  
      function destroyPopup(feature) {
        feature.popup.destroy();
        feature.popup = null;
      }

    this.addMarker = function(lat, lng, featureImg, featureTitle) {
        
        // Define markers as "features" of the vector layer:
        var feature = new OpenLayers.Feature.Vector(
                new OpenLayers.Geometry.Point( lng, lat ).transform(wgs84, this.map.getProjectionObject()),
                {description:'This is the value of<br>the description attribute' , featureImg: featureImg, featureTitle: featureTitle } ,
                {externalGraphic: 'img/marker.png', graphicHeight: 25, graphicWidth: 21, graphicXOffset:-12, graphicYOffset:-25  }
            );    
        vectorLayer.addFeatures(feature);
    }

    this.setCenter = function(lat, lng, zoom) {
        var position = new OpenLayers.LonLat(lng,lat).transform( wgs84, mercator);
        zoom = zoom || this.map.getZoom();
        
        this.map.setCenter(position, zoom);
    };

    this.getCenter = function() {
        var center = this.map.center;
        return new OpenLayers.LonLat(center.lon,center.lat).transform( mercator, wgs84 );
    }

    this.setCenter(39.76, -86.16, 11 );    
};

window.geomap = geomap;