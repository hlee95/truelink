var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var connectionSchema = new Schema({
  user_id: {type: Number, index: true},
  timezone: Number,
  name: {type: String, index: true},
  image_url: String,
  device_id: Number // Id of the paired hardware lamp device.
});

module.exports.Connection = mongoose.model("Connection", connectionSchema);
