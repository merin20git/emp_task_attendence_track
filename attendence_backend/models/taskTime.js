const Mongoose = require("mongoose");

const taskTimeSchema = Mongoose.Schema({
  userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  taskId: { type: Mongoose.Schema.Types.ObjectId, ref: "task", required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date, default: null },
  durationSeconds: { type: Number, default: 0 } // seconds
});

module.exports = Mongoose.model("tasktime", taskTimeSchema);
