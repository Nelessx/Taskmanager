import jwt from "jsonwebtoken";
import { getCookieValue } from "../utils/cookieHelper.js";
import User from "../model/user.js";

export const validateAuth = async (req, res, next) => {
  try {
    const cookieString = req.headers.cookie;
    console.log("📍 Cookies received:", cookieString); // Debug log

    if (!cookieString) {
      throw new Error("No cookies found");
    }

    const token = getCookieValue(cookieString, "user_token");
    const isLogin = getCookieValue(cookieString, "isLogin");

    if (!token || isLogin !== "true") {
      throw new Error("Not authenticated");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Verify user exists in database
    const user = await User.findByPk(decodedToken.userId);
    if (!user) {
      throw new Error("User not found");
    }

    req.userId = decodedToken.userId;
    next();
  } catch (err) {
    const error = new Error("Invalid user");
    error.statusCode = 403;
    next(error);
  }
};
