var twitter = require('ntwitter');
var redis = require('redis');
var http = require('http');
var credentials = require('./credentials.js');

var client = redis.createClient();

var t = new twitter({
    consumer_key: credentials.consumer_key,
    consumer_secret: credentials.consumer_secret,
    access_token_key: credentials.access_token_key,
    access_token_secret: credentials.access_token_secret
});

t.stream(
    'statuses/filter',
    { track: ['movie'] },
    function(stream) {
        stream.on('data', function(tweet) {
            console.log(tweet.text);
            if(tweet.text.indexOf("movie") > -1) {
                client.incr('movie');
            }
        });
    }
);

http.createServer(function (req, res) {
    client.get("movie", function (error, awesomeCount) {
        if (error !== null) {
            //handle error here
            console.log("error: " + error);
        } else {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end("The movie count is " + awesomeCount);
        }
    });
}).listen(process.env.PORT);