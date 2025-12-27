import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import { sequelize } from './models/index.js';
import authRoutes from "./routes/auth.routes.js";



dotenv.config();
const PORT = process.env.PORT;

const app = express();
app.use(express.json());
// app.use(cookieParser());
app.use(cors({
    origin: "*",
    credentials: true
}));

app.use('/api/v1/auth', authRoutes);

app.listen(PORT, () => {
    console.log("Server is listening in Port: ", PORT);
})