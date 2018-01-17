var express = require('express');
var router = express.Router();

var User = require("../models/user").User;
var passwordAuth = require('password-hash-and-salt');

// Gets the connections of a user.
router.get("/user/:user_id", function(req, res, next) {
  if (!req.params.user_id) {
    res.status(400).json({"error": "no user_id provided"});
    return;
  }
  User.findOne({"_id": req.params.user_id}, function(err, user) {
    if (err) {
      console.log("Couldn't get connections for user_id " + req.params.user_id);
      res.status(500).json({"error": "couldn't find user in database"});
      return;
    }
    console.log("GET connections for user " + req.params.user_id + " successful");
    res.json(user.connection_ids);
  });
});

// Creates a new user.
router.post("/user", function(req, res, next) {
  var newUser = {};
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  var password = req.body.password;
  passwordAuth(password).hash(function (err, hash) {
    if (err) {
      console.log("Couldn't hash password " + err);
      res.status(500).json({"error": "couldn't hash password"});
      return;
    }
    newUser.password_hash = hash;

    // TODO: this will be the information needed for notifications.
    newUser.phone_id = req.body.phone_id;

    // Add the new user to the database.
    var user = new User(newUser);
    user.save(function(err, user) {
      if (err) {
        console.log("Couldn't save user: " + err);
        res.status(500).json({"error": "couldn't save user"});
        return;
      }
      newUserId = user._id;
      console.log("Created new user: " + user);
      res.json({"user_id": newUserId});
    });
  });
});

module.exports = router;
