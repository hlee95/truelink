var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var userSchema = new Schema({
  email: {type: String, index: true, unique: true, required: true},
  name: {type: String, required: true},
  password_hash: {type: String, required: true},
  phone_id: String, // Id of the user's mobile phone
  lamp_ids: [String], // Ids of lamps the user owns
  connection_ids: [String] // Ids of lamps the user is connected to but does not own ("Mom")
});

userSchema.plugin(uniqueValidator);

module.exports.User = mongoose.model("User", userSchema);
