var geomap = function(elem) {
    this.map =            new OpenLayers.Map(elem);
    this.mapnik         = new OpenLayers.Layer.OSM();
    
    var wgs84 = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var mercator   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    
    this.position       = new OpenLayers.LonLat(-86.16,39.76).transform( wgs84, mercator);
    this.zoom           = 9;
    
    this.map.addLayer(this.mapnik);
    this.map.setCenter(this.position, this.zoom );

    //var markers = new OpenLayers.Layer.Markers( "Markers" );
    
    //this.map.addLayer(markers);
    
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


        /*
        var lonLat = new OpenLayers.LonLat( lng, lat )
        .transform(wgs84,
            this.map.getProjectionObject() // to Spherical Mercator Projection
        );

        markers.addMarker(new OpenLayers.Marker(lonLat));
        */
    }

    this.setCenter = function(lat, lng, zoom) {
        this.position = new OpenLayers.LonLat(lng,lat).transform( wgs84, mercator);
        this.zoom = zoom || this.map.getZoom();;
        
        this.map.setCenter(this.position, this.zoom);

        
    };

    this.getCenter = function() {
        return this.position.transform(mercator, wgs84);
    }

    this.onmapclick = function(cb) {
        console.log('onmapclick');
        this._clickCallback = cb;

        var handler = new OpenLayers.Handler.Click(
            this.mapnik, { 
                    click: function(evt) {
                        console.log('click has triggered');
                        var pixel = evt.xy;
                        var location = this.map.getLonLatFromPixel(pixel)
                            .transform( mercator, wgs84);
    
                        if (cb) {
                            cb(location);
                        } else {
                            console.log('no click callback')
                        }
                        
                        
                    }
                    ,dblclick: function(evt) {
                        console.log('dblclick has triggered');
                    }
                },
                {
                    single: true  
                    ,double: true
                    ,stopSingle: true
                    ,stopDouble: true
                } 
            );
           // handler.activate();
    }

    
};

window.geomap = geomap;