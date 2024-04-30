const db = require('../data/swiptroydb');
const { Types: { ObjectId } } = require('mongoose');

const toggle = (array = [], value) => {
    const index = array.indexOf(value);
    let count = 0;
    if (index === -1) {
        array.push(value);
        count = 1;
    } else {
        array.splice(index, 1);
        count = -1;
    }
    return [array, count];
}

const updateUserDocument = async (username, options) => {
    let count = 0;
    const user = (await db.getUser(username))[0];
    if (options.story_id) [user.story, count] = toggle(user.story, options.story_id);
    if (options.liked_id) [user.likes, count] = toggle(user.likes, options.liked_id);
    if (options.bookmarked_id) [user.bookmark, count] = toggle(user.bookmark, options.bookmarked_id);
    await db.saveUser(user);
    return count;
}

var story = {}

story.create = async (record) => {
    const story = await db.addStory(record);
    await updateUserDocument(record.username, options = { story_id: story._id });
    return { status: 201, story }
}

story.getStories = async () => {
    return await db.getStory();
}

story.getStory = async (id) => {
    return await db.getStory([id]);
}

story.save = async (record) => {
    return await db.saveStory(record);
}

story.like = async (story_id, username) => {
    const count = await updateUserDocument(username, options = { liked_id: story_id });
    const story = (await db.getStory([story_id]))[0];
    story.likes += count;
    await db.updateStoryLikes(story);
    return story.likes;
}

story.bookmark = async (story_id, username) => {
    await updateUserDocument(username, options = { bookmarked_id: story_id });
}

module.exports = story