import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/api/test", (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      message: "Connection Successful!",
    },
  });
});

app.listen(5000, () => {
  console.log("Server running at port 5000...");
});
