var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var Lamp = require("../models/lamp").Lamp;
var Itay = require("../models/itay").Itay;

var ArduinoClient = require("../arduino_client/arduino_client").ArduinoClient;

// Get all itays involving a particular user.
// This is a superset of the ones involving a particular lamp that the user owns.
// TODO: also allow filtering by the connection_ids?
router.get("/itay_user/:user_id", function(req, res, next) {
  if (!req.params.user_id) {
    res.status(400).json({"error": "no user_id provided"});
    return;
  }
  // For each lamp the user owns, find all itays.
  User.findOne({"_id": req.params.user_id}, function(err, user) {
    if (err) {
      console.log("Couldn't find user");
      res.status(500).json({"error": "cannot get itays, user not found"});
      return;
    }
    var lamps = user.lamp_ids;
    Itay.find({
      $or: [{"sender_id": {$in: lamps}}, {"recipient_id": {$in: lamps}}]},
      function(err, itays) {
        if (err) {
          console.log("Couldn't get itays for user_id " + req.params.user_id);
          res.status(500).json({"error": "couldn't find itays for user in database"});
          return;
        }
        console.log("GET itays for user " + req.params.user_id + " successful");
        res.json(itays);
    });
  });

});

// Get all itays involving a particular lamp.
router.get("/itay_lamp/:lamp_id", function(req, res, next) {
  if (!req.params.lamp_id) {
    res.status(400).json({"error": "no lamp_id provided"});
    return;
  }
  // Find itays with either sender_id or recipient_id the same as user_id.
  Itay.find({
    $or: [{"sender_id": req.params.lamp_id}, {"recipient_id": req.params.lamp_id}]})
    .sort({"sent_time": "desc"})
    .exec(function(err, itays) {
      if (err) {
        console.log("Couldn't get itays for lamp_id " + req.params.lamp_id);
        res.status(500).json({"error": "couldn't find itays for lamp in database"});
        return;
      }
      console.log("GET itays for lamp " + req.params.lamp_id + " successful");
      res.json(itays);
  });
});

// Record a new itay, and trigger delivery to recipient.
router.post("/itay", function(req, res, next) {
  var newItay = {
    "sender_id": req.body.sender_id,
    "recipient_id": req.body.recipient_id,
    "sent_time": Date.now()
  }

  // Check that the sender and recipient exist, then save new itay.
  Lamp.count(
    {$or: [{"lamp_id": newItay.sender_id}, {"lamp_id": newItay.recipient_id}]},
    function(err, count) {
      if (err) {
        console.log("Couldn't count lamps for sender and recipient");
        res.status(500).send({"error": "couldn't count lamps"});
        return;
      }
      if (count != 2) {
        console.log("Sender or recipient not in database");
        res.status(400).json({"error": "sender or recipient doesn't exist"});
        return;
      }

      // Save new itay.
      var itay = new Itay(newItay);
      itay.save(function(err, itay) {
        if (err) {
          console.log("Couldn't save itay: " + err);
          res.status(500).json({"error": "couldn't save itay"});
          return;
        }
        console.log("Created new itay: " + itay);
        res.json({"itay_id": itay._id});
      });

      // Send to recipient lamp.
      // TODO: Consider if this should happen inside the callback above.
      // Would increase latency but be more consistent.
      /*
      var cloudAppAddress = "https://limitless-lowlands-74122.herokuapp.com";
      ArduinoClient.sendItay(cloudAppAddress, itay, function(err, res, body) {
        if (err) {
          console.log("Uh oh");
        } else {
          console.log("OK!");
          console.log(body);
        }
      })
      */
  });
});

module.exports = router;
