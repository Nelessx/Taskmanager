import express from "express";
import { body } from "express-validator";
import { login, signup } from "../controllers/auth.controller.js";
import User from "../model/user.js";

const router = express.Router();

router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please enter a valid email")
      .custom(async (value) => {
        const user = await User.findOne({ where: { email: value } });
        if (user) {
          return Promise.reject("Email already exists");
        }
      }),
    body("password")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters long"),
    body("name")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Name is required")
  ],
  signup
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").trim().not().isEmpty()
  ],
  login
);

export default router;