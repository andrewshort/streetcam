var geomap = function(elem) {
    this.map =            new OpenLayers.Map(elem);
    this.mapnik         = new OpenLayers.Layer.OSM();
    
    var wgs84 = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
    var mercator   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    
    this.position       = new OpenLayers.LonLat(-86.16,39.76).transform( wgs84, mercator);
    this.zoom           = 9;
    
    this.map.addLayer(this.mapnik);
    this.map.setCenter(this.position, this.zoom );

    this.setCenter = function(lat, lng, zoom) {
        this.position = new OpenLayers.LonLat(lng,lat).transform( wgs84, mercator);
        this.zoom = zoom || this.zoom;
        
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
            handler.activate();
    }

    
};

window.geomap = geomap;