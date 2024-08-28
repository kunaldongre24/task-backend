const { config } = require("dotenv");
config();
const PORT = process.env.PORT || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/database";

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

module.exports = { JWT_SECRET, MONGODB_URI, PORT };
