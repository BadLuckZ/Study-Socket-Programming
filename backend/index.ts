import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  })
);

const server = createServer(app);
const io = new Server(server);

// เมื่อไหร่ก็ตามที่มีการเรียกใช้ Socket จาก localhost:3000 Code ชุดนึ้จะทำงาน
io.on("connection", (socket) => {
  console.log("user connected");

  // เมื่อไหร่ก็ตามที่ Socket พบว่า User ออกจากหน้าที่ Socket นี้ดูอยู่ Code ชุดนี้จะทำงาน
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
