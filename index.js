require('dotenv').config()
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
app.use(express.static('public'));
var Twit = require('twit'); 
var io = require('socket.io').listen(server);

var tempTweet = ""; // Temporary holder for checking duplicates

// Listen on port 8080
server.listen(8080, function() {
  console.log("The server is running.");
});

// Render the index.html file on connection
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

// Twitter Developer credentials, found in .env file
var T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_SECRET,
        timeout_ms: 60 * 1000
});

// When the user connects to the server
io.sockets.on('connection', function (socket) {
    // Detected when the user has put in hashtag(s) and hit start
    socket.on('some-key', function (key) {
        // Clear the watchlist and add the hashtag(s)
        var watchlist = [];
        watchlist.push(key.keyword);
        if (Array.isArray(watchlist) && watchlist.length > 0) {
            var stream = T.stream('statuses/filter', { track: watchlist }); 

            // Starting Twitter Stream
            stream.on('tweet', function (tweet) {
                if (tempTweet == "") {
                    // Check if its the first tweet
                    io.sockets.emit('stream', {'tweet': tweet});
                } else if (tempTweet.user.screen_name == tweet.user.screen_name) {
                    // Not emitting the tweet as its a duplicate
                } else {
                    // Standard emit
                    io.sockets.emit('stream', {'tweet': tweet});
                }
                tempTweet = tweet;
            });

            // Stop Twitter Stream when user clicks Stop
            socket.on('disconnect', (reason) => {
                stream.stop();
            })
        }
    });
});
