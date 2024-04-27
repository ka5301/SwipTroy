var mongoose= require("mongoose");
var blacklistedToken = new mongoose.Schema({
    token: String
});

module.exports = mongoose.model("blacklistedToken", blacklistedToken);