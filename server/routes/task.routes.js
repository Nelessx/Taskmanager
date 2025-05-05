import express from "express";
import { body } from "express-validator";
import { validateAuth } from "../middleware/auth.middleware.js";
import {
  postTask,
  getTask,
  getSingleTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";

const router = express.Router();

// Create task
router.post(
  "/",
  validateAuth,
  [
    body("task")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Task must be at least 3 characters long"),
    body("priority").isNumeric().withMessage("Priority must be a number"),
  ],
  postTask
);

// Get tasks
router.get("/", validateAuth, getTask);

// Get single task
router.get("/:taskId", validateAuth, getSingleTask);

// Update task
router.patch(
  "/:taskId",
  validateAuth,
  [
    body("task").trim().optional().isLength({ min: 3 }),
    body("priority").optional().isNumeric(),
    body("status").optional().isIn(["Pending", "Completed"]),
  ],
  updateTask
);

// Delete task
router.delete("/:taskId", validateAuth, deleteTask);

export default router;
