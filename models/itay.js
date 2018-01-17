var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var uniqueValidator = require('mongoose-unique-validator');

var itaySchema = new Schema({
  sender_id: {type: String, required: true},
  recipient_id: {type: String, required: true},
  sent_time: {type: Date, required: true},
});

itaySchema.plugin(uniqueValidator);

module.exports.Itay = mongoose.model("Itay", itaySchema);
