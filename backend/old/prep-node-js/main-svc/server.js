const express = require("express");

const app = express();

const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const connect = require("./config/database");
dotenv.config();
const PORT = process.env.PORT;
connect();

app.use(bodyParser.json({ limit: "10mb" }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});
