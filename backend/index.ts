import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { PORT, SERVER_IP } from "./utils/config";
import { Message } from "./utils/interface";

async function startServer() {
  const app = express();
  app.use(
    cors({
      origin: "*",
    })
  );

  // เก็บข้อความทั้งหมดใน memory ของ process นี้
  const messages: Message[] = [];

  const server = createServer(app);
  const io = new Server(server);

  // เมื่อไหร่ก็ตามที่มีการเรียกใช้ Server Socket Code ชุดนี้จะทำงาน
  io.on("connection", (socket) => {
    console.log("Backend: User connected");

    // ส่ง "messages" ไปให้ Client Socket พร้อม 1 ข้อมูล คือ messages
    socket.emit("messages", messages);

    // เมื่อไหร่ก็ตามที่ Server Socket ได้รับ "disconnect" (พบว่า User ออกจากหน้าที่ Socket นี้ดูอยู่) Code ชุดนี้จะทำงาน
    socket.on("disconnect", () => {
      console.log("Backend: User disconnected");
    });

    // เมื่อไหร่ก็ตามที่ Server Socket ได้รับ "message" Code ชุดนี้จะทำงาน
    socket.on("message", (msg: Message) => {
      // เก็บ message ใหม่ไว้ใน messages
      messages.push(msg);
      // ส่ง "messages" ไปให้ Client Socket พร้อม 1 ข้อมูล คือ messages
      io.emit("messages", messages);
    });
  });

  server.listen(PORT, () => {
    console.log(`Server running at ${SERVER_IP}:${PORT}`);
  });
}

startServer();
