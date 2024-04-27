const express = require("express");
const router = express.Router();
const user = require('../business/user');

const {verifyAuthenticateToken, blacklistAuthenticationToken} = require('../helpers/auth');

var auth = [
    "/stories"
]

router.use(auth,verifyAuthenticateToken);

router.get("/haveAccount/:username", async (req, res) => {
    try{
        const response = await user.haveAccount(req.params.username);
        res.status(200).json({haveAccount:response});
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.get("/stories", async (req, res) => {
    try{
        const response = await user.getStories(req.user);
        res.status(200).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.post("/register", async (req, res) => {
    try{
        const response = await user.register(req.body);
        res.status(response.status).json({ message: 'User registered successfully' });
    }
    catch(err){
        if (err.name === 'MongoServerError' && err.code === 11000){
            res.status(400).send("You already have an account!!");
        }
        else{
            res.status(500).send("SOMETHING WENT WRONG!!");
        }
    }
});

router.post("/login", async (req, res) => {
    try{
        const response = await user.login(req.body);
        if(response.status === 401){
            return res.status(response.status).json({ error: 'Invalid username or password' });
        }
        res.cookie(response.cookieParams.name, response.cookieParams.value, response.cookieParams.options);
        res.status(response.status).json({token: response.accessToken});
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.post("/logout", blacklistAuthenticationToken, async (req, res) => {
    try{
        res.status(200).json({ message: 'Logout successful' });
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

module.exports = router;