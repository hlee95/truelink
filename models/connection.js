var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var connectionSchema = new Schema({
  user_id: {type: Number, index: true, unique: true, required: true},
  timezone: Number,
  name: {type: String, index: true, required: true},
  image_url: String,
  device_id: {type: Number, required: true} // Id of the paired hardware lamp device.
});

connectionSchema.plugin(uniqueValidator);

module.exports.Connection = mongoose.model("Connection", connectionSchema);
