require("dotenv").config();
const express = require("express");
const app = express();
const indexRouter = require("./routes/index");
const compression = require("compression");
const logger = require("morgan");
var cors = require("cors");
const server = require("http").createServer(app);
const origin = ["http://localhost:4200"];
const { PORT } = require("./config/config.js");
require("./config/database.js");

app.disable("etag");

app.use(
  cors({
    origin,
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use("/static", express.static("static"));
app.use(compression());
app.use(logger("dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.use("/api/v2", indexRouter);

const port = PORT || 8000;
server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
});
