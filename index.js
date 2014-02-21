var express = require('express');
var request = require('request');
var fs = require('fs');
var app = express();

var config = JSON.parse(fs.readFileSync("config.json"));

app.use(express.bodyParser());
app.set('view engine', 'jade');
app.set('views', __dirname);


app.configure(function () {
    app.use(
        "/", //the URL throught which you want to access to you static content
        express.static(__dirname) //where your static content is located in your filesystem
    );
});

app.get('/', function(req, res){
  res.render('index');
});

app.get('/config', function(req, res){
  res.send(config);
});

app.get('/listings', function(req, res){
  request.get('http://' + config.city + '.en.craigslist.ca/jsonsearch/apa?useMap=1&zoomToPosting=&catAbb=apa&query=&minAsk=&maxAsk=' + config.maxPrice + '&bedrooms=1&housing_type=&excats=', function(error, response, body){
    res.send(body);
  })
});

app.get('/jsonsearch/apa*', function(req, res) {
  request.get('http://' + config.city + '.en.craigslist.ca/jsonsearch/apa?geocluster=' + req.query.geocluster + '&key=' + req.query.key , function(error, response, body){
    res.send(body);
  });
  console.log(req.query);
});

app.listen(3000); //the port you want to use