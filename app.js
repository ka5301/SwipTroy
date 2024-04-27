const cors = require('cors');
const express = require("express");
const cookieParser = require('cookie-parser')

const app = express();
const bodyParser = require('body-parser');

var corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/",express.static("public"));
app.use('/assets',express.static('assets'));

app.use("/user",require("./routes/user"));

app.use("/story",require("./routes/story"));

var port = process.env.PORT || 5000;
app.listen( port, function(){
	console.log(`Server has started at the port ${port}`);
});

