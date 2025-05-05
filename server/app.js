import express from "express";
import "dotenv/config";
import cors from "cors";
import requestIp from "request-ip";
import { connectDB } from "./config/database.js";
import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const port = 3030;

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type"],
  exposedHeaders: ["Set-Cookie"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestIp.mw());

// Routes with prefixes
app.use("/task", taskRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode;
  const message = error.messsage;
  const data = error.data;
  res
    .status(status || 500)
    .json({ message: message, data: data, error: "yes", errors: error });
});

connectDB().then(() => {
  app.listen(process.env.PORT || port, () => {
    console.log(`🚀 Server is running on port ${process.env.PORT || port}`);
  });
});
