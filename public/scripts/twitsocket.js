$(document).ready(function () {
    var socket = io.connect();
    socket.disconnect();

    $('#listen-toggle').click(function () {
        if ($(this).hasClass('on')) {
            console.log('Disconnecting from socket...')
            socket.disconnect();
            $(this).toggleClass('on')
            $(this).toggleClass('is-link');
            $(this).toggleClass('is-danger');
            $(this).html('Start');
        } else {
            var keywords = "";
            keywords = $('#keywords').val();
            if (keywords != "") {
                socket.buffer = [];
                console.log('Connecting to socket...');
                socket.connect();
                socket.emit('some-key', {keyword: keywords});
                $(this).toggleClass('on');
                $(this).toggleClass('is-link');
                $(this).toggleClass('is-danger');
                $(this).html('Stop');
            }
        }
    });

    socket.on('stream', function (tweet) {
                    if (lastTweet == "") {
                        addTweet(tweet);
                    } else if (!(lastTweet == 'undefined') && !(tweet.tweet.user.screen_name == lastTweet.tweet.user.screen_name)) {
                        addTweet(tweet);
                    }
                    lastTweet = tweet;
                });
});

$('#clear-list').click(function () {
    $('#tweetd').empty();
});


var lastTweet = "";
function addTweet(tweet) {
    var cardhtml = ejs.render(`
        <div class="card">
            <div class="card-content">
                <div class="media">
                    <div class="media-left">
                        <figure class="image is-48x48">
                            <img src="<%= tweet.tweet.user.profile_image_url %>" alt="No Profile Image">
                        </figure>
                    </div>
                    <div class="media-content">
                        <p class="title is-4"><%= tweet.tweet.user.name %></p>
                        <p class="subtitle is-6">@<%= tweet.tweet.user.screen_name %></p>
                    </div>
                </div>
        
                <div class="content">
                    <%= tweet.tweet.text %>
                </div>
            </div>
        </div>
        <br>
    `, { tweet: tweet });
    $('#tweetd').prepend(cardhtml);
}

