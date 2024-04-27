const express = require("express");
const router = express.Router();
const story = require('../business/story');
const fileUpload = require('../helpers/fileUpload');

const {verifyAuthenticateToken} = require('../helpers/auth');

var auth = [
    "/uploadImage",
    "/create",
    "/save",
    "/like/:id",
    "/bookmark/:id"
]

router.use(auth, verifyAuthenticateToken);

router.post("/uploadImage", fileUpload.story.single('story_picture'), (req, res) => {
    res.json({path:req.file.path});
});

router.post("/create", async (req, res) => {
    try{
        req.body.username = req.user;
        const response = await story.create(req.body);
        res.status(response.status).json(response);
    }
    catch(err){
        console.log(err);
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.get("/", async (req, res) => {
    try{
        const response = await story.getStories();
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.get("/:id", async (req, res) => {
    try{
        const response = await story.getStory(req.params.id);
        (response.length>0)? res.status(200).json(response): res.sendStatus(404);
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.patch("/save/:id", async (req, res) => {
    try{
        req.body._id = req.params.id;
        const response = await story.save(req.body);
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.patch("/like/:id", async (req, res) => {
    try{
        const response = await story.like(req.params.id, req.user);
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

router.patch("/bookmark/:id", async (req, res) => {
    try{
        const response = await story.bookmark(req.params.id, req.user);
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).send("SOMETHING WENT WRONG!!");
    }
});

module.exports = router;