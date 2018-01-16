var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var Itay = require("../models/itay").Itay;

// Get all itays involving a particular user.
// TODO: also allow filtering by the connection_ids?
router.get("/itay/:user_id", function(req, res, next) {
  if (!req.params.user_id) {
    res.status(400).json({"error": "no user_id provided"});
    return;
  }
  Itay.find({"user_id": req.params.user_id}).sort({"sent_time": "desc"})
    .exec(function(err, itays) {
      if (err) {
        console.log("Couldn't get itays for user_id " + req.params.user_id);
        res.status(500).json({"error": "couldn't find itays in database"});
        return;
      }
      res.json(itays);
  });
});

// Record a new itay, and trigger delivery to recipient.
// TODO: only return response and add to database if repicipient server
// receives it, otherwise will need to trigger a resend.
router.post("/itay", function(req, res, next) {
  var newItay = {
    "user_id": req.body.user_id,
    "connection_id": req.body.connection_id,
    "sent_time": Date.now(),
    "to_phone": req.body.to_phone
  }

  // Check that user exists.
  User.count({"_id": newItay.user_id}, function(err, count) {
    if (err) {
      console.log("Could't count users");
      res.status(500).send();
      return;
    }
    if (count < 1) {
      console.log("No such user");
      res.status(400).json({"error": "no such user"});
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
      var newItayId = itay._id;

      // Update the user's connections.
      User.findByIdAndUpdate(
        newItay.user_id,
        {$push: {"itay_ids": newItayId}},
        function(err) {
          if (err) {
            console.log("Error adding itay_id to user");
            res.status(500).json({"error": "couldn't add itay_id to user"});
            return;
          }
        }
      );

      console.log("Created new itay: " + itay);
      res.json({"itay_id": newItayId});
    });
  });
});

// Updates the properties of an itay.
// Possible updates include ack_time and acked.
router.put("/itay/:itay_id", function(req, res, next) {
  if (!req.params.itay_id) {
    res.status(400).json({"error": "no itay_id provided"});
    return;
  }

  // TODO: For now, acking is the only purpose for PUT, but it might not be
  // in the future, so just wrap it in an if statement for now.
  if (req.body.acked) {
    var changes = {
      "acked": true,
      "acked_time": Date.now()
    }
    // Change the acked flag and add the acked_time.
    Itay.findByIdAndUpdate(
      req.params.itay_id,
      changes,
      {new: true},
      function(err, itay) {
        if (err) {
          console.log("Couldn't update itay: ", itay);
          res.status(500).json({"error": "couldn't update itay"});
          return;
        }
        console.log("Updated itay: ", itay);
        res.json(itay);
    });
  }
});

module.exports = router;
