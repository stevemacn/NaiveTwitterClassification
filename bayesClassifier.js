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
    return false
}

Naivebayes.prototype.learn = function (tweet, tag) {
    
    var tokens = this.tokenizeText(tweet)
    
    console.log(tokens)

    if (this.initCategory(tag)) console.log(tag+ " already exists")
    else console.log("New category: "+tag)

    this.docCount[tag]++
    this.totalDocCount++
    
    tokens.forEach(function (token) {
        
    })
    
    console.log(tokens)

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
