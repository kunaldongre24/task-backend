const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const taskHistorySchema = new Schema({
  taskId: {
    type: Schema.Types.ObjectId,
    ref: "Task",
    required: true,
  },
  changeType: {
    type: String,
    enum: ["created", "status-changed", "edited"],
    required: true,
  },
  changeDetails: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const TaskHistory = mongoose.model("TaskHistory", taskHistorySchema);
module.exports = TaskHistory;
