/* Client side code for sending requests to the Arduino. */

var request = require("request");

function testGoogle() {
  request("http://google.com", function(err, res, body) {
    console.log(err);
    console.log(body);
  });
}

// Given an arduino's IP address, send an itay to it and wait for a response.
//
// Returns null on success, or an error on error.
//
// The callback argument should have signature function(err, res, body).
function sendItay(arduinoAddress, itayObject, callback) {
  var body = {
    "itay": itayObject
  }
  // Note the body string must be JSON serializable.
  var bodyString = String(body)
  request(arduinoAddress, {
    "method": "PUT",
    "json": true,
    "body": bodyString
  }, callback);
}

module.exports.sendItay = sendItay;
module.exports.testGoogle = testGoogle;
