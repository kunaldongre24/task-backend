const TaskController = require("../controllers/TaskController");
const express = require("express");
const router = express.Router();

router.post("/createTask", TaskController.createTask);
router.get("/getTasks", TaskController.getTasks);
router.get("/getTask/:id", TaskController.getTaskFromId);
router.get("/getTaskHistory/:id", TaskController.getTaskHistory);
router.put("/updateTask/:id", TaskController.updateTask);
router.delete("/deleteTask/:id", TaskController.deleteTask);
router.get("/exportTasks", TaskController.exportTasksToCSV);

module.exports = router;
