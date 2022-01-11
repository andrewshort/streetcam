var express = require('express');
var app = express();
var http = require('http').Server(app);
var unirest = require("unirest");
var routeinfo = require("./routeinfo.js");
var url  = require('url');
var path = require('path');

//Loads the handlebars module
const handlebars = require('express-handlebars');
//Sets our app to use the handlebars engine

app.set('view engine', 'handlebars');

app.set('views', path.join(__dirname, 'views'));

app.engine('handlebars', handlebars.create({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')}
).engine);


// Serve up content from public directo`ry
app.use(express.static(__dirname + '/public/'));

app.get('/', (req, res) => {
    //Serves the body of the page aka "main.handlebars" to the container //aka "index.handlebars"
    res.render('main', {layout : 'index'});
    });

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

app.get('/windy/cam/*', function(req, res) {
    var url_parts = url.parse(req.url);
    console.log(url_parts);
    console.log(url_parts.pathname);

    var path = url_parts.pathname.replace('/windy/cam', '') + '?show=webcams:location,image';
    var base_url = 'https://api.windy.com/api/webcams/v2'
    var webreq = unirest("GET", base_url + path);
    webreq.headers({
        'x-windy-key': process.env.windykey
    })
    
    webreq.end(function (webres) {
        if (webres.error) {
            res.json(webres.error);
            return;
        }

        res.json(webres.body);
    });
});

http.listen(process.env.PORT || 3000);
