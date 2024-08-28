const taskRoute = require("./Task");

const express = require("express");
const router = express.Router();

router.use("/task", taskRoute);

module.exports = router;
