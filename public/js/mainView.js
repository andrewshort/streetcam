(function() {

    var mainView = function() {
        
        var geomap;
        $("document").ready(function() {
            geomap = new window.geomap("map");

            var center = geomap.getCenter();
            loadImages(center.lat, center.lon);

            $('#searchHereButton').click(function() {
                var center = geomap.getCenter();
                loadImages(center.lat, center.lon);
            });

            $('#searchAddress').keypress(function (e) {
                
                var key = e.which;
                if(key == 13)  // the enter key code
                {
                    var searchAddress = $('#searchAddress').val();
                    $.get({
                            //url: 'wc/list?nearby=39.76,-86.16,120',
                            url: 'geo/addresssearch?q=' + searchAddress,
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

        function loadFromUrl(type, lat, lon, callback) {
            $.get({
                url: 'geo/?queryType=' + type + '&lat=' + lat + '&lon=' + lon,
                success: addMarkers         
            });
        }

        function addMarkers(data) {
            var items = data.items;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                
                var markerInfo = item.markerInfo;
                geomap.addMarker(markerInfo.latitude, markerInfo.longitude, markerInfo.popupImage, markerInfo.title);
            }
        }

        function loadImages(lat, lng) {
            var center = geomap.getCenter();
            var lat = center.lat;
            var lon = center.lon;
            
            loadFromUrl('cam', lat, lon, addMarkers );
            loadFromUrl('flickr', lat, lon, addMarkers );
        }
    };

    window.mainView = mainView;

})();