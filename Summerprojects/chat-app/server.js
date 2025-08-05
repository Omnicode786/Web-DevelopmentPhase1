// server.js
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");

// Serve static files from the public folder
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5000;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // User joins a room
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { username });
    socket.emit("room-joined", roomId);
    console.log(`${username} joined room: ${roomId}`);
  });

  // User leaves a room
  socket.on("leave-room", ({ roomId, username }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("user-left", { username });
    console.log(`${username} left room: ${roomId}`);
  });

  // Relay encrypted message
  socket.on("send-msg", (data) => {
    // data: { roomId, encryptedMsg, username, timestamp }
    socket.to(data.roomId).emit("receive-msg", data);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
