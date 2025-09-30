import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { PORT, IP } from "./config";

const app = express();
app.use(
  cors({
    origin: "*",
  })
);

const messages: string[] = [];

const server = createServer(app);
const io = new Server(server, { connectionStateRecovery: {} });

// เมื่อไหร่ก็ตามที่มีการเรียกใช้ Server Socket Code ชุดนึ้จะทำงาน
io.on("connection", (socket) => {
  console.log("Backend: User connected");

  // ส่ง "messages" ไปให้ Client Socket พร้อม 1 ข้อมูล คือ messages
  socket.emit("messages", messages);

  // เมื่อไหร่ก็ตามที่ Server Socket ได้รับ "disconnect" (พบว่า User ออกจากหน้าที่ Socket นี้ดูอยู่) Code ชุดนี้จะทำงาน
  socket.on("disconnect", () => {
    console.log("Backend: User disconnected");
  });

  // เมื่อไหร่ก็ตามที่ Server Socket ได้รับ "message" Code ชุดนี้จะทำงาน
  socket.on("message", (msg) => {
    // เก็บ message ใหม่ไว้ใน messages
    messages.push(msg);
    // ส่ง "messages" ไปให้ Client Socket พร้อม 1 ข้อมูล คือ messages
    io.emit("messages", messages);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at ${IP}:${PORT}`);
});
