module.exports = function () {
    return new Naivebayes()
}

function Naivebayes () {

    this.totalDocCount = 0

    //this should be an object rather than objects...
    this.vocabulary = {}
    this.vocabSize = 0
    this.categories = {} 
    this.categoriesSize = 0
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
    this.categoriesSize++
    return false
}

Naivebayes.prototype.learn = function (tweet, tag) {
    
    var tokens = this.tokenizeText(tweet)

    if (!this.initCategory(tag)) console.log("New category: "+tag)

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
    
    var tokens = this.tokenizeText(tweet)

    var tokenFreq = {}

    console.log(tweet.content)

    tokens.forEach(function (token) {
        if (!tokenFreq[token]) tokenFreq[token]=0
        tokenFreq[token]++
    })
    var self = this
        , catCount = 1
        , chosen
        , maxProbability=-1000
        , categories = this.categories

    for (i in categories) {
        var category = categories[i]
            , count = tokens.length
        //calculate initial category probabilty
        categoryProbability = self.docCount[category]/self.totalDocCount  
        logCategoryProbability = Math.log(categoryProbability)
        
        tokens.forEach(function(token){
            //Add one smoothing (1 rather than 0)
            wordFreqCount = self.wordFreqCount[category][token] || 1    
            wordCount = self.wordCount[category]
            
            //Calculate token probabilty (sum of logs)
            var tokenProbability = Math.log(
                wordFreqCount  / (wordCount + self.vocabSize)
            )
            //BUG: category size must be the same.
            logCategoryProbability += tokenFreq[token] + tokenProbability
            //Update chosen category with full probability
            if (--count == 1) {
                if (logCategoryProbability > maxProbability) {
                    maxProbability = logCategoryProbability
                    chosen=category
                }
            }
            if (count ==1 && catCount== self.categoriesSize ) {
                console.log(chosen)
                console.log(maxProbability)
            }
            })
        catCount++    
    }
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
