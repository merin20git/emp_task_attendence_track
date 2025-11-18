const Mongoose = require("mongoose");

const taskSchema = Mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  userId: { type: Mongoose.Schema.Types.ObjectId, ref: "users", required: true },
  status: { type: String, default: "pending" },
  createdAt: { type: Date, default: Date.now },
  timeSpentSeconds: { type: Number, default: 0 }

});


module.exports = Mongoose.model("task", taskSchema);

