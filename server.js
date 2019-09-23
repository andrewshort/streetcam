var express = require('express');
var app = express();
var http = require('http').Server(app);
var unirest = require("unirest");
var routeinfo = require("./routeinfo.js");

// Serve up content from public directory
app.use(express.static(__dirname + '/public/'));

var routerGeo = express.Router();

routerGeo.get('/addresssearch', function(req, res) {
    
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

routerGeo.get('/', function(req, res) {
    var queryType = req.query.queryType;
    var route = routeinfo.routeinfo[queryType];

    if (!queryType || !route) {
        res.status(400);
        res.send();
        return;
    }
    
    var url = route.urltemplate
        .replace("{{lat}}", req.query.lat )
        .replace("{{lon}}", req.query.lon )

    var webreq = unirest("GET", url);

    if (route.query) {
        webreq.query(route.query);
    }
    
    if (route.headers) {
        webreq.headers(route.headers);
    }

    webreq.end(function (webres) {
        if (webres.error) {
            res.json(webres.error);
            return;
        }

        if (typeof(route.transform) === 'function') {
            res.json(route.transform(webres.body));
        } else {
            res.json(webres.body);
        }
    });
});

app.use('/geo', routerGeo);

http.listen(process.env.PORT || 3000);
