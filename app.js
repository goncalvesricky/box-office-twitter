var express = require("express"),
	http = require("http"),
	path = require("path"),
	app = express(),
	twitterWorker = require("./twitter.js");

twitterWorker();

var port = process.env.PORT || 3000
	
http.createServer(app).listen(port, function(){
	console.log("Express server listening on port 3000");
});
	
app.configure(function() {
	app.use(express.static(path.join(__dirname, 'public')));
});

app.get("/", function(req, res) {
	res.send("Hello world");
});

app.get("/counts.json", function	(req, res) {
    redisClient.get("movie", function	(error, awesomeCount) {
	if (error !== null) {
            // handle error here                                                                                                                       
            console.log("ERROR: " + error);
        } else {
            var jsonObject = {
		"movie":awesomeCount
            };
            // use res.json to return JSON objects instead of strings
            res.json(jsonObject);
        }
    });
});