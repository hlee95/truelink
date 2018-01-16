var express = require('express');
var router = express.Router();

var User = require("../models/user").User;
var passwordAuth = require('password-hash-and-salt');

router.get('/create_user', function(req, res, next) {
  res.send("create_user");
});

router.post("/create_user", function(req, res, next) {
  var newUser = {};
  newUser.name = req.body.name;
  newUser.email = req.body.email;
  var password = req.body.password;
  passwordAuth(password).hash(function (err, hash) {
    if (err) {
      console.log("Couldn't hash password: " + err);
      res.status(500).json({"error": "couldn't hash password"});
      return;
    }
    newUser.password_hash = hash;
    newUser.phone_id = req.body.phone_id;

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
