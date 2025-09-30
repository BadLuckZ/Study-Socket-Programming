import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import cors from "cors";
import { PORT, SERVER_IP } from "./utils/config";
import { availableParallelism } from "node:os";
import cluster from "node:cluster";
import { createAdapter, setupPrimary } from "@socket.io/cluster-adapter";
import { Message } from "./utils/interface";

if (cluster.isPrimary) {
  const numCPUs = availableParallelism();
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork({
      // กำหนด PORT ให้แต่ละ worker แตกต่างกัน โดยเริ่มจาก PORT หลัก + index
      PORT: 3000 + i,
    });
  }

  // ตั้งค่า cluster adapter ของ Socket.IO บน primary process
  // เพื่อให้ worker ทุกตัวสามารถสื่อสารกันและแชร์ connection state ได้
  setupPrimary();
} else {
  async function startServer() {
    const app = express();
    app.use(
      cors({
        origin: "*",
      })
    );

    const messages: Message[] = [];

    const server = createServer(app);
    const io = new Server(server, {
      connectionStateRecovery: {},
      adapter: createAdapter(),
    });

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
}
