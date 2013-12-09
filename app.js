var ntwitter = require('ntwitter')
    , express = require('express')
    , faye = require('faye')
    , http = require('http')
    , config = require('./config/config')
    , count
    , params = {
        screen_name: '',
        count: 200,
        include_rts: true
    }
    
var app = express()
app.use(express.static(__dirname + '/public'))

var server = http.createServer(app)
server.listen(3000)

bayes = require("./bayesClassifier.js")
var nbc = bayes()

/*
nbc.learn(getTweets("espn"))
nbc.learn(getTweets("FoxNews"))
nbc.learn(getTweets("NPR"))

nbc.process(getTweets("BBCNews"))
nbc.process(getTweets("BBCWorld"))
*/

/* These two functions are the only functions that 
 * need to be changed to learn and process tags 
 */

var startProcessing = function () {
    
    console.log("=====================")
    console.log("     PROCESSING      ")
    console.log("=====================")
    params.count = 10
    //verify functionality
    //getTweets("espn", nbc)
    //getTweets("NPR", nbc)

    //verify new sources
    //getTweets("BBCNews", nbc) //conservative
    getTweets("CNET", nbc) //tech
}

var startTraining = function (process) {
    count = 0
    articlesLearned = 4 //Update this number as sources are added
    getTweets("espn", nbc, "sports") 
    getTweets("FoxNews", nbc, "conservative")
    getTweets("NPR", nbc, "liberal")
    getTweets("WIRED", nbc, "technology")
    
}

startTraining()

/*
 * The following two utility functions handle twitter parsing
 */

function twitterCallback (tag) {
    //nbc.displayResults(tag)
    if (++count == articlesLearned) {
        startProcessing() 
    }
} 

function getTweets (user, callback, tag) {
    var twitterConfig = require('./config/twitterKeys.json')
        , twit = new ntwitter(twitterConfig)

    if (user) params.screen_name = user

    twit.getUserTimeline(params, function (err,data) {
        if (err) return null
        var tweetFeed = []

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
        })
        //Indicate globally that another handle has been learned or processed.
        if (tweetFeed.length == data.length) twitterCallback(tag)
    })
}
