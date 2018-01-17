var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var lampSchema = new Schema({
  lamp_id: {type: String, required: true, unique: true}, // Lamp device id
  arduino_ip_address: {type: String, required: true}, // Arduino ip address of self
  partner_lamp_id: {type: String, required: true}, // Id of partner lamp

  user_id: String, // Owner (app) of this lamp (needed to push itay to app)

  nickname: String, // User assigned nickname, assigned by a user who is not the owner
  timezone: Number, // GMT, defaults to server timezone.
  image_url: String // An image set by an app owner that has this lamp as a connection
});

lampSchema.plugin(uniqueValidator);

module.exports.Lamp = mongoose.model("Lamp", lampSchema);
