const multer =require("multer");

const obj = {};

const story_image_storage = multer.diskStorage({
    destination: './assets/images',
    filename: (req, file, cb) => {
        return cb(null, `${Date.now()}_${file.originalname}`);
    }
})

obj.story = multer({storage:story_image_storage});

module.exports = obj;