/* Entry point for truelink server. */

var express = require("express");
var app = express();

const RUN_LOCALLY = false;
const LOCAL_MONGODB_ADDRESS = "mongodb://127.0.0.1:27017/truelink";

var mongodb_address = process.env.MONGODB_URI;
if (RUN_LOCALLY) {
  mongodb_address = LOCAL_MONGODB_ADDRESS
}

// For parsing HTTP requests using JSON.
app.use(express.json());

// DB connection.
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(mongodb_address, {useMongoClient: true});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once("open", function() {
  console.log("Connected to database!");
});

// Require all routers.
var index = require("./routes/index");
var create_user = require("./routes/create_user");
var login = require("./routes/login");
var connection = require("./routes/connection");
var itay = require("./routes/itay");

// Forward requests to our various routers.
app.use("/", index, create_user, login, connection, itay);

// Start it up!
var port = process.env.PORT || 3000;
app.listen(port, () => console.log("Truelink server listening on port " + String(port) + "!"));

module.exports = app;
