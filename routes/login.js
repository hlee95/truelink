var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var Lamp = require("../models/lamp").Lamp;
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
          // Get the connections of this user.
          User.findOne({"email": req.body.email}, function(err, user) {
            if (err) {
              console.log("Couldn't get connections for user" + req.body.email);
              res.status(500).json({"error": "couldn't find user in database"});
              return;
            }
            var connectionIds = user.connection_ids;
            // Return the actual lamps.
            Lamp.find({"lamp_id": {$in: connectionIds}}, function(err, lamps) {
              if (err) {
                console.log("Couldn't find lamps matching connection_ids " + err);
                res.status(500).json({"error": "couldn't find lamp connections for user"});
                return;
              }
              res.json(
                {"user_id": user._id,
                 "name": user.name,
                 "connections": lamps
               });
            });
          });
        }
    });
  });
});

module.exports = router;
