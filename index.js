var express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var router = require("./routes");
var app = express();
const port = process.env.PORT || 5001

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


app.get('/restaurant-api/',(req,res)=>res.send("Welcome to express"))

app.use('/restaurant-api/', router);

var server = app.listen(port,function (err) {
  if (err) {
    console.log("Server creation error..");
  } else {
    console.log("Server is running on.." + port || 5000);
  }
});

// module.exports = server;