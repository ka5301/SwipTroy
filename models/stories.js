var mongoose = require("mongoose");
var story = new mongoose.Schema({
    heading : String,
    description : String,
    image : String,
    category : String,
    likes : Number,
    username : String
});

module.exports = mongoose.model("story",story);