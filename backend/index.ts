import express from "express";
import { createServer } from "node:http";

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
