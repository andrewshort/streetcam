var routeInfo = [];

routeInfo['cam'] = {
    urltemplate: 'https://webcamstravel.p.rapidapi.com/webcams/list/nearby={{lat}},{{lon}},120',
    query: {
        "lang": "en",
        "show": "webcams:image,location"
    },
    headers: {
        "x-rapidapi-host": "webcamstravel.p.rapidapi.com",
        "x-rapidapi-key": process.env.rapidapikey
    },
    transform: function(data) {

        var response = {
            items: [],
            queryType: 'cam'
        }

        var cams = data.result.webcams;
        for (var i = 0; i < cams.length; i++) {
            var cam = cams[i];
            
            response.items.push({
                markerInfo: {
                    id: cam.location.id,
                    latitude: cam.location.latitude,
                    longitude: cam.location.longitude,
                    popupImage: cam.image.current.preview,
                    title: cam.title
                }
            });
        }
        return response;
    }

}

routeInfo['flickr'] = {
    urltemplate: "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + process.env.flickrkey + "&has_geo=1&extras=geo&lat={{lat}}&lon={{lon}}&radius=10&format=json&nojsoncallback=1",
    transform: function(data) {

        var response = {
            items: [],
            queryType: 'flickr'
        }

        var photoArr = data.photos.photo;
                        
        for (var i = 0; i < photoArr.length; i++) {
            var photo = photoArr[i];
            

            // http://farm{farm-id}.static.flickr.com/{server-id}/{id}_{secret}.jpg 
            var url = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '.jpg';  
            
            response.items.push({
                markerInfo: {
                    id: photo.id,
                    latitude: photo.latitude,
                    longitude: photo.longitude,
                    popupImage: url,
                    title: photo.title
                }
            });
        }

        return response;
    }
}

exports.routeinfo = routeInfo;