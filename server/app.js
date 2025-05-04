import express from "express";
import "dotenv/config";
import cors from "cors";
import prisma from "./prismaClient.js";  // Import the Prisma Client
import authRoutes from "./routes/auth.routes.js";
import requestIp from "request-ip";
import taskRoutes from "./routes/task.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
const port = 3030;

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

const corsOptions = {
  origin: clientUrl,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(requestIp.mw());

// Use routes
app.use(taskRoutes);
app.use(userRoutes);
app.use("/auth", authRoutes);

// Global error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message || "An error occurred";
  const data = error.data;
  res.status(status).json({ message: message, data: data, error: "yes", errors: error });
});

// Initialize Prisma Client and check connection
async function startServer() {
  try {
    await prisma.$connect();  // Connect to the database using Prisma
    app.listen(process.env.PORT || port, () => {
      console.log(`Server is running on port ${process.env.PORT || port}`);
    });
  } catch (err) {
    console.log("Error connecting to database: ", err);
  }
}

// Start the server
startServer();
