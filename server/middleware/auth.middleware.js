import { getCookieValue } from "../utils/cookieHelper.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import prisma from "../prismaClient.js"; // ← your Prisma client

export const validateAuth = async (req, res, next) => {
  try {
    const cookieString = req.headers.cookie || "";
    const token = getCookieValue(cookieString, "user_token");
    const isLogin = getCookieValue(cookieString, "isLogin");

    if (isLogin !== "true" || !token) {
      const error = new Error("Invalid user");
      error.statusCode = 403;
      return next(error);
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decodedToken.id;

    const userData = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userData) {
      const error = new Error("Invalid user");
      error.statusCode = 403;
      return next(error);
    }

    req.userId = userData.id;
    next();
  } catch (err) {
    err.statusCode = err.statusCode || 401;
    err.message = err.message || "Authentication failed";
    next(err);
  }
};
