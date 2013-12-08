module.exports = function () {
    return new Naivebayes()
}

function Naivebayes () {

    this.totalDocCount = 0

    //this should be an object rather than objects...
    this.vocabulary = {}
    this.vocabSize = 0
    this.categories = {} 
    
    //per category //function new person...
    this.docCount = {}
    this.wordCount = {}
    this.wordFreqCount = {}
}

Naivebayes.prototype.displayResults = function (tag) {
    console.log(this.wordCount)
    //console.log(this.wordFreqCount)
}

Naivebayes.prototype.initCategory = function(category) {
    if (this.categories[category]) return true
    this.docCount[category] = 0
    this.wordCount[category] = 0
    this.wordFreqCount[category] = {}
    this.categories[category]=category
    return false
}

Naivebayes.prototype.learn = function (tweet, tag) {
    
    var tokens = this.tokenizeText(tweet)
    
    //console.log(tweet.content)

    if (this.initCategory(tag)) console.log(tag+ " already exists")
    else console.log("New category: "+tag)

    this.docCount[tag]++
    this.totalDocCount++
    
    var self = this 
    
    tokens.forEach(function (token) {
        //add to the vocabulary
        self.vocabulary[token] = true
        self.vocabSize++

        //increment word count for category
        if (!self.wordCount[tag]) self.wordCount[tag]=0
        self.wordCount[tag]++

        //add to the frequency count   
        if (!self.wordFreqCount[tag][token]) self.wordFreqCount[tag][token]=1
        else self.wordFreqCount[tag][token]++
    })
    //ghetto fix, look into this later...
    if (this.wordFreqCount['']) this.wordFreqCount['']=0
}

Naivebayes.prototype.process = function (tweet) {
    console.log("process") 
    
    var tokens = this.tokenizeText(tweet)

    var tokenFreq = {}

    tokens.forEach(function (token) {
        if (tokenFreq[token]) tokenFreq[token]=0
        tokenFreq++
    })

    var self = this
        , categories = this.categories


    //remember to use laplace+1 smoothing and sum of logs approach
    for (i in categories) {
        var category = categories[i]
        categoryProbability = self.docCount[category]/self.totalDocCount  

    }
        console.log(categoryProbability)      
    

}

Naivebayes.prototype.tokenizeText = function (text) {

    //remove html
   // text = text.replace (/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig, function (text) {
   //    return ""
   // })
    //remove mentions '@'
    text=text.content
   
    text = text.replace("(","")
    text = text.replace(")","")

    text = text.replace(/[@]+[A-Za-z0-9-_]+/g, function(u) {
        return u.replace("@","")
    })
    //remove hashtag '#'
    text = text.replace(/[#]+[A-Za-z0-9-_]+/g, function(u) {
        return u.replace("#","")
    })
    text = text.replace(/[^\w\s]/g, ' ')
    
    return text.split(/\s+/)
}
