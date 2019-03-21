require("dotenv").config();
var keys = require("./keys.js");

var request = require("request");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
var fs = require("fs");

var command = process.argv[2];
var query = process.argv.slice(3).join(" ");

function bandsInTown(){
    var URL = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";

    request(URL, function (error, response, body) {
        if (error) console.log(error);
        var result = JSON.parse(body)[0];
        console.log("Name of venue: " + result.venue.name);
        console.log("Venue location: " + result.venue.city + ", " + result.venue.country);
        console.log("Date of Event: " + moment(result.datetime).format("MM/DD/YYYY"));
    })
}
 
var spotifySong = function (query) {
    
    spotify.search({ type: 'track', query: query, limit: 1 }, function (err, data) {
        if(query === undefined) {
            query = "the sign";
        }
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log("Song: " + data.tracks.items[0].name);
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Preview: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
    });
    
}

var movieThis = function () {
    request("http://www.omdbapi.com/?i=tt3896198&apikey=4ae94b36&t=" + query, function (error, response, body) {
        var result = JSON.parse(body);
        console.log("Title : " + result.Title);
        console.log("Year: " + result.Released);
        console.log("IMDB Rating: " + result.imdbRating );
        console.log("Rotten Tomatoes Rating: " + result.Ratings[1].Value);
        console.log("Country: " +  result.Country);
        console.log("Language: " + result.Language);
        console.log("Movie Plot: " + result.Plot);
        console.log("Actors: " +  result.Actors);
    });
}


if (command === "spotify-this-song") {
    console.log("Searching for the song: " + query);
    spotifySong(query);
} else if (command === "concert-this") {
    console.log(query);
    bandsInTown(query);
}   else if (command === "movie-this") {
    console.log(query);
    movieThis(query);
} else if(command === "do-what-it-says") {
    fs.readFile("random.txt", "utf-8", function(error, data) {
        if (error) {
			console.log('ERROR: Reading random.txt -- ' + error);
			return;
		} else {
			var commandString = data.split(',');
			var command = commandString[0].trim();
			var query = commandString[1].trim();

			switch(command) {
				case 'spotify-this-song':
					spotifySong(query);
					break;
			}
		}
    })
}

