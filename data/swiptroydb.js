const user = require('../models/users');
const story = require('../models/stories');
const blacklistedToken = require('../models/blacklistedtokens');
const cluster = require('../helpers/mongoconnection');
cluster.connect();

var db = {};

db.addUser = async (record) => {
    const userRecord = new user({
        username: record.username,
        password: record.password,
        story: record.story,
        bookmark: record.bookmark,
        likes: record.likes
    });

    return await userRecord.save();
}

db.getUser = async (username) => {
    try{
        return await user.find({username});
    }
    catch (err){
        throw new Error(err);
    }
}

db.saveUser = async (record) => {
    const updates = {
        story: record.story,
        bookmark: record.bookmark,
        likes: record.likes
    }

    return await user.findOneAndUpdate({_id:record._id},{$set:updates});
}

db.addStory = async (record) => {
    const storyRecord = new story({
        heading: record.heading,
        description: record.description,
        image: record.image,
        category: record.category,
        username: record.username,
        likes: 0
    });
    
    return await storyRecord.save();
}

db.getStory = async(id = null) => {
    try{
        return (id == null)? await story.find({}): await story.find({_id: {$in: id}});
    }
    catch (err){
        throw new Error(err);
    }
}

db.saveStory = async (record) => {
    const updates = {
        heading: record.heading,
        description: record.description,
        image: record.image,
        category: record.category
    }

    return await story.findOneAndUpdate({_id:record._id},{$set:updates});
}

db.updateStoryLikes = async (record) => {
    const updates = {
        likes: record.likes
    }

    return await story.findOneAndUpdate({_id:record._id},{$set:updates});
}

db.blacklistToken = async (token) => {
    const tokenRecord = new blacklistedToken({
        token: token
    });

    return await tokenRecord.save();
}

db.IsBlacklistedToken = async (token) => {
    const r_token = await blacklistedToken.findOne({token});
    return r_token != null;
}

module.exports = db;