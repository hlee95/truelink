var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var connectionSchema = new Schema({
  user_id: {type: String, required: true},
  timezone: Number,
  name: {type: String, required: true},
  image_url: String,
  device_id: {type: String, required: true, unique:true} // Id of the paired hardware lamp device.
});

connectionSchema.plugin(uniqueValidator);

module.exports.Connection = mongoose.model("Connection", connectionSchema);
