/* Entry point for truelink server. */

var express = require("express");
var app = express();

// DB connection.
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://127.0.0.1:27017/truelink", {useMongoClient: true});
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

// Catch 404 error and pass to error handler.
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler.
app.use(function(err, req, res, next) {
  // Render error.
  var status = err.status || 500;
  res.send("Error " + String(status));
  console.log("Error " + String(status));
  console.log(req);
});

// Start it up!
app.listen(3000, () => console.log("Example app listening on port 3000!"));

module.exports = app;
