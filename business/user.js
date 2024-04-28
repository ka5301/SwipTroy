const bcrypt = require('bcrypt')
const db = require('../data/swiptroydb');
const {createAuthenticateToken, createAuthenticateRefreshToken} = require('../helpers/auth');

const createAuthCookie = (user) => {
    const refreshToken = createAuthenticateRefreshToken(user);
    return {
        name: 'jwt',
        value: refreshToken,
        options: {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
        }
    }
}

var user = {}

user.haveAccount = async (username) => {
    const user = await db.getUser(username);
    return user.length > 0;
}

user.register = async (record) => {
    record.password = await bcrypt.hash(record.password, 10);
    const user = await db.addUser(record);
    return {status:201};
}

user.login = async (record) => {
    const user = (await db.getUser(record.username))[0];
    if(user && await bcrypt.compare(record.password, user.password)){
        const cookieParams = createAuthCookie(user);
        const accessToken = createAuthenticateToken(record.username);
        return {status:200, user, accessToken, cookieParams};
    }
    return {status: 400}
}

user.getStories = async (username) => {
    var user = (await db.getUser(username))[0];
    var createdStoriesPromise = db.getStory(user.story);
    var likedStoriesPromise = db.getStory(user.likes);
    var bookmarkedStoriesPromise = db.getStory(user.bookmark);

    const [createdStories, likedStories, bookmarkedStories] = await Promise.all([createdStoriesPromise, likedStoriesPromise, bookmarkedStoriesPromise]);

    return {status: 200, stories:{createdStories, likedStories, bookmarkedStories}}
}

module.exports = user