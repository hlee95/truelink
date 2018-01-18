/* Client side code for sending requests to the Arduino. */

var request = require("request");

// Given an arduino's IP address, send an itay to it and wait for a response.
//
// Returns null on success, or an error on error.
//
// The callback argument should have signature function(err, res, body).
function sendItay(arduinoAddress, itayObject, callback) {
  // Note the body string must be JSON serializable.
  var endpoint = arduinoAddress + "/itay";
  request({
    url: endpoint,
    method: "POST",
    json: true,
    body: itayObject
  }, callback);
}

ArduinoClient = {
  "sendItay": sendItay
}

module.exports.ArduinoClient = ArduinoClient;

/* Testing code, add to app.js to test.

var f = require("./arduino_client/arduino_client").ArduinoClient;
var a = "https://limitless-lowlands-74122.herokuapp.com";
f.sendItay(a, {sender_id: "hi", recipient_id: "bye"}, function (err, res, body) {
  if (err) {
    console.log("error");
    return;
  }
  console.log(body);
});

*/
