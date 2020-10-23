var socket = io.connect();
    socket.on('stream', function (tweet) {
        console.log(tweet);
        var cardhtml = ejs.render(`
            <div class="card">
                <div class="card-content">
                    <div class="media">
                        <div class="media-left">
                            <figure class="image is-48x48">
                                <img src="<%= tweet.tweet.user.profile_image_url %>" alt="Placeholder image">
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
        `, { tweet: tweet});
        $('#tweetd').append(cardhtml);
        });