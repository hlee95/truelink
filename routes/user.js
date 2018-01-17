var express = require('express');
var router = express.Router();

var User = require("../models/user").User;
var Lamp = require("../models/lamp").Lamp;
var passwordAuth = require('password-hash-and-salt');

// Gets the connections (lamp connections) of a user.
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
    var connectionIds = user.connection_ids;
    // Return the actual lamps.
    Lamp.find({"lamp_id": {$in: connectionIds}}, function(err, lamps) {
      if (err) {
        console.log("Couldn't find lamps matching connection_ids " + err);
        res.status(500).json({"error": "couldn't find lamp connections for user"});
        return;
      }
      console.log("GET lamp connections for user successful");
      res.json(lamps);
    });
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

// Grant a user account ownership of a lamp.
router.put("/user/:user_id", function(req, res, next) {
  if (!req.params.user_id) {
    res.status(400).json({"error": "no user_id provided"});
    return;
  }
  if (!req.body.lamp_id) {
    res.status(400).json({"error": "no lamp_id provided, cannot pair"});
    return;
  }

  // Update the lamp to point to this user account.
  Lamp.findOneAndUpdate(
    {"lamp_id": req.body.lamp_id},
    {"user_id": req.params.user_id},
    {new: true},
    function(err, lamp) {
      if (err) {
        console.log("Can't pair, couldn't update lamp: " + err);
        res.status(500).json({"error": "couldn't pair user and lamp"});
        return;
      }
      // Update the user's lamp_ids and connection_ids.
      User.findOneAndUpdate(
        {"_id": req.params.user_id},
        {$push: {
          "lamp_ids": lamp.lamp_id, // Ownership.
          "connection_ids": lamp.partner_lamp_id} // Connection.
        },
        {new: true},
        function(err, user) {
          if (err) {
            console.log("Can't pair, couldn't find or update user: " + err);
            res.status(500).json({"error": "couldn't pair user and lamp"});
            return;
          }

          console.log("Successfully paired user " + req.params.user_id + " and lamp " + req.body.lamp_id);
          res.json({"user": user, "lamp": lamp});
        });
  });
});

module.exports = router;
