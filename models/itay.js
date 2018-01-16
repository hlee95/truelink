var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var itaySchema = new Schema({
  user_id: {type: Number, index: true, required: true},
  connection_id: {type: Number, required: true},
  sent_time: {type: Date, index: true, required: true},
  acked_time: Date,
  incoming: {type: Boolean, default: false}, // True if from device -> phone, otherwise false.
  acked: Boolean,
});

itaySchema.plugin(uniqueValidator);

module.exports.Itay = mongoose.model("Itay", itaySchema);
