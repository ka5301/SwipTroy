var mongoose= require("mongoose");
var user = new mongoose.Schema({
    username : {type: String,required:true, unique: true},
    password : {type: String,required:true, unique: true},
    bookmark : [],
    story : [],
    likes : []
});

module.exports = mongoose.model("user",user);