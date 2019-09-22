var express = require('express');
var app = express();
var http = require('http').Server(app);
var unirest = require("unirest");

// Serve up content from public directory
app.use(express.static(__dirname + '/public/'));

var router = express.Router();

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
        "x-rapidapi-key": "f52d72a488msh0d8da40727b9a8bp1ece6ejsnd5579f2540ca"
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
