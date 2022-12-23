const express = require("express");
const port = 3000;
const port1 = 3001;
const app = express();
const bodyParser = require("body-parser");
require("./db");
require("./models/User");
require("./models/Message");
require("make-promises-safe");

const authRoutes = require("./routes/authRoutes");
const UploadMediaRoutes = require("./routes/UploadMediaRoutes");
const MessageRoutes = require("./routes/MessageRoutes");

const { createServer } = require("http");
const { Server } = require("socket.io");
const httpServer = createServer();
const io = new Server(httpServer, {});

app.use(bodyParser.json());
app.use(authRoutes);
app.use(UploadMediaRoutes);
app.use(MessageRoutes);

app.get("/", (req, res) => {
  res.send("Hello World");
});

io.on("connection", (socket) => {
  console.log("USER CONNECTED - ", socket.id);

  socket.on("disconnect", () => {
    console.log("USER DISCONNECTED - ", socket.id);
  });

  socket.on("join_room", (data) => {
    console.log("USER WITH ID - ", socket.id, "JOIN ROOM - ", data.roomid);
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    console.log("MESSAGE RECEIVED - ", data);
    io.emit("receive_message", data);
  });
});

//httpServer.listen(3001);

app.listen(port1, "192.168.43.155", () => {
  console.log("Socket is running on port1 " + port1);
});

app.listen(port, "192.168.43.155", () => {
  console.log("Server is running on port " + port);
});
