const express = require("express");
const port = 3000;
const app = express();
const bodyParser = require("body-parser");
require("./db");
require("./models/User");
require("make-promises-safe");

const authRoutes = require("./routes/authRoutes");
app.use(bodyParser.json());
app.use(authRoutes);
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, "192.168.43.155", () => {
  console.log("Server is running on port " + port);
});
