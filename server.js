var express = require('express');
var app = express();
var http = require('http').Server(app);
var unirest = require("unirest");

// Serve up content from public directory
app.use(express.static(__dirname + '/public/'));

var router = express.Router();

router.get('/flickr', function(req, res) {
    
    var lat = req.query.lat;
    var lon = req.query.lon;
    var radius = req.query.radius;
    var uri = "https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + process.env.flickrkey + "&has_geo=1&extras=geo&lat=" + lat + "&lon=" + lon + "&radius=" + radius + "&format=json&nojsoncallback=1"

    var webreq = unirest("GET", uri);
    
    webreq.end(function (webres) {
        if (webres.error) {
            console.log(webres.error);
            res.json(webres.error);
            return;
        }

        res.json(webres.body);
    });
});

router.get('/addresssearch', function(req, res) {
    
    var q = req.query.q;
    var webreq = unirest("GET", "https://nominatim.openstreetmap.org/search?q=" + q + "&format=json");
    
    webreq.headers({
        "User-Agent" : "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:66.0) Gecko/20100101 Firefox/66.0"
    })
    webreq.end(function (webres) {
        if (webres.error) {
            console.log(webres.error);
            res.json(webres.error);
            return;
        }

        res.json(webres.body);
    });
})

router.get('/list', function(req, res) {
    var nearby = req.query.nearby;
	var webreq = unirest("GET", "https://webcamstravel.p.rapidapi.com/webcams/list/nearby=" + nearby);

    webreq.query({
        "lang": "en",
        "show": "webcams:image,location"
    });

    webreq.headers({
        "x-rapidapi-host": "webcamstravel.p.rapidapi.com",
        "x-rapidapi-key": process.env.rapidapikey
    });


    webreq.end(function (webres) {
        if (webres.error) {
            console.log(webres.error);
            res.json(webres.error);
            return;
        }

        res.json(webres.body);
    });
});

app.use('/wc', router);

http.listen(process.env.PORT || 3000);
