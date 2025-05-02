import express from "express";
import dotenv from "dotenv";
dotenv.config(); // Load environment variables
import "./config/dbconnection.js";
import cors from "cors";
import authRoutes from "./routes/authroutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/auth", authRoutes);

app.listen(process.env.PORT, () => {
  console.log("Server is running on port 4000");
});
