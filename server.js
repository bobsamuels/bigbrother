var express = require('express');
var app = express();

var request = require('request');
var OAuth   = require('oauth-1.0a');


app.use('/', express.static(__dirname + '/'));
app.use('/libs', express.static(__dirname + '/node_modules'));

app.get('/api/twitterSearch/:query', function(req, res){
    var oauth = OAuth({
        consumer:{
            public: '90UT9cJ9B6WgFHxVZIj0989pH',
            secret: 'MvV41cv9kulvdcqXddO2O6uRYp42feAtZiVNnMmIceFmUrZqRj'
        },
        signature_method: 'HMAC-SHA1'
    });

    var token = {};
    var searchItem = req.params.query;
    var url = "https://api.twitter.com/1.1/search/tweets.json?q=" + searchItem + "&lang=en&result_type=recent&count=100";

    var requestData = {url:url, method:"GET"};

    request({
        method:requestData.method,
        url:requestData.url,
        headers:oauth.toHeader(oauth.authorize(requestData, token))
    }, function(err, resp, body){
        res.send(body);
    });
});

app.get('/api/instagramSearch/:query', function(req, res){
   var access_token="1650911176.1fb234f.4db7b8b4fcf94c9c9410b6de64aaff7e";
   var searchItem = req.params.query;
   var url = "https://api.instagram.com/v1/tags/" + searchItem + "/media/recent?count=100&access_token=" + access_token;

    request({
       method: "GET",
       url: url
   }, function(err, resp, body){
      res.send(body);
   });
});

var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
});