var ntwitter = require('ntwitter')
    , express = require('express')
    , faye = require('faye')
    , http = require('http')
    , config = require('./config/config')
    , params = {
        screen_name: '',
        count: 15,
        include_rts: true
    }
    
var app = express()
app.use(express.static(__dirname + '/public'))

var server = http.createServer(app)
server.listen(3000)

bayes = require("./bayesClassifier.js")
var nbc = bayes()
getTweets("espn", nbc, "sports") 
//getTweets("FoxNews", "conservative", nbc.learn)
//getTweets("NPR", "liberal", nbc.learn)

//getTweets("BBCNews", nbc.process)
          /*
          function (tweetfeed, tag) {
    console.log(tweetfeed)
    console.log(tag)
})*/

/*
//getTweets("espn", nbc.learn) //nbc.learn(dataset)
nbc.learn(getTweets("espn"))
nbc.learn(getTweets("FoxNews"))
nbc.learn(getTweets("NPR"))

nbc.process(getTweets("BBCNews"))
nbc.process(getTweets("BBCWorld"))
*/


function getTweets (user, callback, tag) {
    var twitterConfig = require('./config/twitterKeys.json')
        , twit = new ntwitter(twitterConfig)

    if (user) params.screen_name = user

    twit.getUserTimeline(params, function (err,data) {
        if (err) return null
        var tweetFeed = []
            , count = 0

        data.forEach(function(tweet) {
              
            var geo = null
              
            if (tweet.retweeted_status) tweet = tweet.retweeted_status
            if (tweet.coordinates) geo = tweet.coordinates.coordinates
            var processedTweet = {
                "datePosted" : tweet.created_at,
                "content": tweet.text,
                "geo": geo,
                "screen_name": tweet.user.screen_name,
            }
                if (tag) callback.learn(processedTweet, tag)
                else callback.process(processedTweet)
            tweetFeed.push(processedTweet)
            //if (data.length==++count) {
                //if (tag) callback.learn(tweetFeed, tag)
                //else callback.process(tweetFeed)
            //}
        })
    })
}
