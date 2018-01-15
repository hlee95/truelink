var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type: String, index: true},
  password_hash: Number,
  salt: Number,
  phone_id: String, // Id of the user's mobile phone.
  connection_ids: [Number],
  itay_ids: [Number]
});

module.exports.User = mongoose.model("User", userSchema);
