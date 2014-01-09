var worker = function() {
	var twitter = require('ntwitter');
	var redis = require('redis');
	var request = require("request");
	var credentials = require('./credentials.js');

	var client = redis.createClient();
	
	var t = new twitter({
		consumer_key: credentials.consumer_key,
		consumer_secret: credentials.consumer_secret,
		access_token_key: credentials.access_token_key,
		access_token_secret: credentials.access_token_secret
	});

	var rt_opening = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/in_theaters.json?apikey=" + credentials.rt_key + "&page_limit=10";
	var rt_upcoming = "http://api.rottentomatoes.com/api/public/v1.0/lists/movies/opening.json?apikey=" + credentials.rt_key + "&page_limit=5";
	
	var upcoming_movies = [];
	
	request(rt_opening, function(error, response, body) {
	
		// get movies that are in theaters
		obj = JSON.parse(body).movies;
		console.log("IN THEATERS");
		
		// check box office revenue post-weekend
		var d = new Date();
		if(d.getDay() == 1) { // if it is Monday, get Box Office gross
			
			// iterate through movies, get revenue via OMdb api
			for(var i = 0; i < obj.length; i++) {
			
				var url = "http://www.omdbapi.com/?t=";
				url += obj[i].title + "&y=" + obj[i].year;
				url += "&tomatoes=true";
				url = encodeURI(url);

				request(url, function(err, resp, body) {
				
					var omdb_obj = JSON.parse(body);
					console.log(omdb_obj.BoxOffice + "\t\t" + omdb_obj.Title);
				
				});
			
			}
			
		} else {
		
			for(var i = 0; i < obj.length; i++)
				console.log(obj[i].title);
		
		}

		request(rt_upcoming, function(error, response, body) {

			console.log();
			console.log("UPCOMING MOVIES");
			var upcoming = JSON.parse(body).movies;
			for(var i = 0; i < upcoming.length; i++) {
				console.log(upcoming[i].year + "\t" + upcoming[i].title);
				upcoming_movies.push(upcoming[i].title);
			}
			
		});
		
	});
		
	t.stream(
		'statuses/filter',
		{ track: upcoming_movies },
		function(stream) {
			stream.on('data', function(tweet) {
//				console.log(tweet.text);
				for(var i = 0; i < upcoming_movies.length; i++) {
					if(tweet.text.indexOf(upcoming_movies[i]) > -1) {
						client.incr(upcoming_movies[i]);
					}
				}
			});
		}
	); 
	
};

module.exports = worker;