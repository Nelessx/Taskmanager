import express from "express";
import { validateAuth } from "../middleware/auth.middleware.js";
import { getUser } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/user", validateAuth, getUser);

export default router;
