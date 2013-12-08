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

Naivebayes.prototype.initCategory = function(category) {
    if (this.categories[category]) return true
    this.docCount[category] = 0
    this.wordCount[category] = 0
    this.wordFreqCount = {}
    this.categories[category]=category
    console.log(this.categories)
    return false
}

Naivebayes.prototype.learn = function (tweet, tag) {
    
    var tokens = this.tokenizeText(tweet)
    
    console.log(tweet.content)

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
        self.wordCount[tag]++

        //add to the frequency count    
        if (!self.wordFreqCount[tag]) self.wordFreqCount[tag] = {}
        if (!self.wordFreqCount[tag][token]) self.wordFreqCount[tag][token]=1
        else self.wordFreqCount[tag][token]++
    })
    console.log(this.wordCount[tag])
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
