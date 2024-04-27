const db = require('../data/swiptroydb');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const createAuthenticateToken =  (username) => {
    return jwt.sign({username}, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'1h'});
}

const verifyAuthenticateToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (!bearer) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const accessToken = bearer.split(" ")[1];

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decodedToken) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }

        db.IsBlacklistedToken(accessToken).then(isBlacklisted => {
            if(isBlacklisted){
                return res.status(401).json({ message: 'Token is blacklisted. Please login again.' });
            }
            req.user = decodedToken.username;
            next()
        });
    });
}

const createAuthenticateRefreshToken =  (user) => {
    var userData = {
        _id: user._id,
        username: user.username
    }

    return jwt.sign({userData}, process.env.REFRESH_TOKEN_SECRET,{expiresIn:'7d'});
}

const verifyAuthenticateRefreshToken = (req, res, next) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        }
        req.user = user
        if(!req.body.username||req.body.username=="") req.body.username = user.username;
        next()
    });
}

const blacklistAuthenticationToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    if (!bearer) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const accessToken = bearer.split(" ")[1];

    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;

    const blacklistAccessToken = db.blacklistToken(accessToken);
    const blacklistRefreshToken = db.blacklistToken(refreshToken);

    Promise.all([blacklistAccessToken, blacklistRefreshToken]).then(() => {
        res.cookie('jwt', null, {expires: new Date(0)});
        next();
    });
}

module.exports = {createAuthenticateToken, verifyAuthenticateToken, createAuthenticateRefreshToken, verifyAuthenticateRefreshToken, blacklistAuthenticationToken};