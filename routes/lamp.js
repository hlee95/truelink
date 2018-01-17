var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var Lamp = require("../models/lamp").Lamp;

// Get all lamps.
router.get("/lamp", function(req, res, next) {
  Lamp.find({}, function(err, lamps) {
    if (err) {
      console.log("Error finding lamps");
      res.status(500).json({"error": "couldn't find lamps"});
      return;
    }
    res.json(lamps);
  });
});

// Registers a new lamp and returns its id in the response.
router.post("/lamp", function(req, res, next) {
  var newLamp = {
    "lamp_id": req.body.lamp_id,
    "partner_lamp_id": req.body.partner_lamp_id,
    "arduino_address": req.body.arduino_address,
  }

  // Save new lamp.
  var lamp = new Lamp(newLamp);
  lamp.save(function(err, lamp) {
    if (err) {
      console.log("Couldn't save lamp: " + err);
      res.status(500).json({"error": "couldn't save lamp"});
      return;
    }
    console.log("Created new lamp: " + lamp);
    res.status(200).json(lamp);
  });

});

// Modifies an existing lamp and returns the new version in the response.
// This could modify any of the properties.
router.put("/lamp/:lamp_id", function(req, res, next) {
  if (!req.params.lamp_id) {
    res.status(400).json({"error": "no lamp_id provided"});
    return;
  }

  Lamp.findOneAndUpdate(
    {"lamp_id": req.params.lamp_id},
    req.body,
    {new: true},
    function(err, lamp) {
      if (err) {
        console.log("Couldn't update lamp: " + err);
        res.status(500).json({"error": "couldn't update lamp"});
        return;
      }

      // TODO: in the case where it's an existing user buying a new lamp,
      // need to change lamp_id and switch all other itays to have that
      // lamp_id and change the partner lamp's information.

      console.log("Updated lamp: ", lamp);
      res.json(lamp);
  });
});

module.exports = router;
