var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var itaySchema = new Schema({
  user_id: {type: Number, index: true},
  connection_id: Number,
  sent_time: {type: Date, index: true},
  acked_time: Date,
  incoming: Boolean, // True if from phone -> device, otherwise false.
  acked: Boolean,
});

module.exports.Itay = mongoose.model("Itay", itaySchema);
