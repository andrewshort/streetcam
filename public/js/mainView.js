(function() {

    var mainView = function() {
        
        var geomap;
        $("document").ready(function() {
            geomap = new window.geomap("map");

            var center = geomap.getCenter();
            loadImages(center.lat, center.lon);

            $('#searchAddress').keypress(function (e) {
                
                var key = e.which;
                if(key == 13)  // the enter key code
                {
                    var searchAddress = $('#searchAddress').val();
                    $.get({
                            //url: 'wc/list?nearby=39.76,-86.16,120',
                            url: 'wc/addresssearch?q=' + searchAddress,
                            success: function(data) {
                                if (data.length > 0) { // take first result for now
                                    var lat = data[0].lat;
                                    var lon = data[0].lon;
                                    geomap.setCenter(lat, lon, 12);
                                    loadImages(lat, lon);
                                }
                            }

                        });
                }
            });
        });

        

        function loadImages(lat, lng) {
            var center = geomap.getCenter();
            var lat = center.lat;
            var lng = center.lon;
            $.get({
                    //url: 'wc/list?nearby=39.76,-86.16,120',
                    url: 'wc/list?nearby=' + lat + ',' + lng + ',120',
                    success: function(data) {
                        
                        var cams = data.result.webcams;
                        for (var i = 0; i < cams.length; i++) {
                            var cam = cams[i];
                            var title = cam.title;
                            var preview = cam.image.current.preview;
                            
                            geomap.addMarker(cam.location.latitude, cam.location.longitude, cam.image.current.preview, cam.title);
                        }
                    }            
                });

                $.get({
                    //url: 'wc/list?nearby=39.76,-86.16,120',
                    url: 'wc/flickr?lat=' + lat + '&lon=' + lng + '&radius=10',
                    success: function(data) {
                        var photoArr = data.photos.photo;
                        
                        for (var i = 0; i < photoArr.length; i++) {
                            var photo = photoArr[i];
                            

                            // http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}.jpg 
                            var url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';  
                            geomap.addMarker(photo.latitude, photo.longitude, url, photo.title);
                        }
                        
                    }            
                });
        }
    };

    window.mainView = mainView;

})();