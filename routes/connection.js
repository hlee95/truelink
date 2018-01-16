var express = require("express");
var router = express.Router();

var User = require("../models/user").User;
var Connection = require("../models/connection").Connection;

// Returns an array of the connections for a given user_id.
router.get("/connection/:user_id", function(req, res, next) {
  if (!req.params.user_id) {
    res.status(500).json({"error": "no user_id provided"});
    return;
  }
  Connection.find({"user_id": req.params.user_id}, function(err, connections) {
    if (err) {
      console.log("Could't get connections for user_id " + String(req.params.user_id));
      res.status(500).json({"error": "couldn't find connections in database"});
      return;
    }
    res.json(connections);
  });
});

// Adds a new connection and returns its id in the response.
router.post("/connection", function(req, res, next) {
  var newConnection = {
    "user_id": req.body.user_id,
    "name": req.body.name,
    "device_id": req.body.device_id,
  }
  if (req.body.timezone) {
    newConnection.timezone = req.body.timezone;
  }
  if (req.body.image_url) {
    newConnection.image_url = req.body.image_url;
  }

  // Check that user exists.
  User.count({"_id": newConnection.user_id}, function(err, count) {
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
  });

  var connection = new Connection(newConnection);
  connection.save(function(err, connection) {
    if (err) {
      console.log("Couldn't save connection: " + err);
      res.status(500).json({"error": "couldn't save connection"});
      return;
    }
    newConnectionId = connection._id;
    // Update the user's connections.
    User.findByIdAndUpdate(
      newConnection.user_id,
      {$push: {"connection_ids": newConnectionId}},
      function(err) {
        if (err) {
          console.log("Error adding connection_id to user");
          res.status(500).json({"error": "couldn't add connection user"});
          return;
        }
      }
    );

    console.log("Created new connection: " + connection);
    res.json({"connection_id": newConnectionId});
  });

});

// Modifies an existing connection and returns it in the response.
router.put("/connection/:connection_id", function(req, res, next) {

});

// Deletes an existing connection and returns it in the response.
router.delete("/connection/:connection_id", function(req, res, next) {
  // Remove from connections, update user.
});

module.exports = router;
