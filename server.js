var express = require('express');
var app = express();
var http = require('http').Server(app);
var unirest = require("unirest");

// Serve up content from public directory
app.use(express.static(__dirname + '/public/'));

var router = express.Router();

router.get('/list/nearby', function(req, res) {
	var webreq = unirest("GET", "https://webcamstravel.p.rapidapi.com/webcams/list/nearby=39.76,-86.16,120");

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
            res.json(webres.error)
        }

        console.log(webres.body);

        res.json(webres.body);
    });
});

app.use('/wc', router);

http.listen(process.env.PORT || 3000);
