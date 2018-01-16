var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var passwordAuth = require('password-hash-and-salt');

router.get("/login", function(req, res, next) {
  res.send("login");
});

router.post("/login", function(req, res, next) {
  User.findOne({"email":req.body.email}, function(err, user) {
    if (err || !user) {
      console.log("No such user " + req.body.email);
      res.status(401).send();
      return;
    }
    passwordAuth(req.body.password).verifyAgainst(user.password_hash,
      function(err, verified) {
        if (err) {
          console.log("Error verifying password: " + err);
          res.status(500).send();
          return;
        }
        if (!verified) {
          console.log("Bad password");
          res.status(401).json({"error": "bad password"});
          return;
        } else {
          res.status(200).send("OK");
        }
    });
  });
});

module.exports = router;
