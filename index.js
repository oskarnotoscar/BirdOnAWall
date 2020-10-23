require('dotenv').config()
var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app);
app.use(express.static('public'));
var Twit = require('twit'); 
var io = require('socket.io').listen(server);

server.listen(3000, function() {
  console.log("The server is running.");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var watchlist = ['#code, #dogs, #cats'];

var T = new Twit({
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_SECRET,
        timeout_ms: 60 * 1000
});

io.sockets.on('connection', function (socket) {

    var stream = T.stream('statuses/filter', { track: watchlist }); 

    stream.on('tweet', function (tweet) { 
        io.sockets.emit('stream', {'tweet': tweet}); 
    });
  
}); 