const Task = require("../models/Task");
const TaskHistory = require("../models/TaskHistory");
const { Parser } = require("json2csv");

// Helper function to log task changes
async function logTaskChange(taskId, changeType, changeDetails) {
  await TaskHistory.create({
    taskId,
    changeType,
    changeDetails,
  });
}

const TaskController = {
  // Create a new task
  async createTask(req, res) {
    try {
      const { title, description, dueDate, priority } = req.body;
      const newTask = await Task.create({
        title,
        description,
        dueDate,
        priority,
      });
      await logTaskChange(
        newTask._id,
        "created",
        `Task created with title "${title}"`
      );
      res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error creating task" });
    }
  },

  // Get all tasks with optional sorting
  async getTasks(req, res) {
    const { sortBy = "dueDate", order = "asc" } = req.query; // Sorting options

    try {
      const tasks = await Task.find().sort({
        [sortBy]: order === "asc" ? 1 : -1,
      });
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Error fetching tasks" });
    }
  },

  // Get a task by ID
  async getTaskFromId(req, res) {
    const { id } = req.params;

    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: "Error fetching task" });
    }
  },

  // Update a task
  async updateTask(req, res) {
    const { id } = req.params;
    const updates = req.body;

    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      const oldData = task.toObject();
      Object.assign(task, updates);
      await task.save();

      const changeDetails = Object.keys(updates)
        .map((key) => `${key} changed from "${oldData[key]}" to "${task[key]}"`)
        .join(", ");

      await logTaskChange(id, "edited", changeDetails);
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ error: "Error updating task" });
    }
  },

  // Delete a task
  async deleteTask(req, res) {
    const { id } = req.params;

    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      await task.remove();
      await logTaskChange(id, "deleted", "Task removed");
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Error deleting task" });
    }
  },
  async getTaskHistory(req, res) {
    const { id } = req.params;
    try {
      const task = await TaskHistory.find({ taskId: id });
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.send(task);
    } catch (error) {
      res.status(500).json({ error: "Error deleting task" });
    }
  },
  async exportTasksToCSV(req, res) {
    try {
      const tasks = await Task.find();
      const parser = new Parser();
      const csv = parser.parse(tasks);
      res.header("Content-Type", "text/csv");
      res.attachment("tasks.csv");
      res.send(csv);
    } catch (error) {
      res.status(500).json({ error: "Error exporting tasks to CSV" });
    }
  },
};

module.exports = TaskController;
