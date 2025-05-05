import { body } from "express-validator";

export const taskValidation = [
  body("task")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Task must be at least 3 characters long"),
  body("priority")
    .isInt({ min: 1, max: 5 })
    .withMessage("Priority must be between 1 and 5"),
];

export const userValidation = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please enter a valid email"),
  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("name").trim().notEmpty().withMessage("Name is required"),
];

export const validateStatus = [
  body("status")
    .isIn(["Pending", "Completed"])
    .withMessage("Status must be either Pending or Completed"),
];
