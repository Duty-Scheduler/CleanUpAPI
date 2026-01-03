import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { sequelize } from "./models/index.js";
import { initializeSocket } from "./lib/socket.js";
import authRoutes from "./routes/auth.routes.js";
import groupRoutes from "./routes/group.routes.js";
import penaltyRoutes from "./routes/penalty.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./lib/swagger.js";

dotenv.config();
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

// Khởi tạo Socket.IO
initializeSocket(server);

app.use(express.json());
// app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Đường dẫn giao diện UI
app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Đường dẫn file JSON
app.get("/api/v1/docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/group", groupRoutes);
app.use("/api/v1/penalty", penaltyRoutes);
app.use("/api/v1/task", taskRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/notification", notificationRoutes);

server.listen(PORT, () => {
  console.log("Server is listening in Port: ", PORT);
});
