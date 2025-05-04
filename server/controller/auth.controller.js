import { validationResult } from "express-validator";
import prisma from "../prismaClient";  // Import the Prisma Client
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const getCookieOptions = (isHttpOnly = true) => {
  const options = {
    maxAge: parseInt(process.env.COOKIE_EXPIRE) || 24 * 60 * 60 * 1000, // default to 1 day
    httpOnly: isHttpOnly,
  };

  if (process.env.COOKIE_DOMAIN && process.env.COOKIE_DOMAIN.trim() !== "") {
    options.domain = process.env.COOKIE_DOMAIN.trim();
  }

  if (process.env.ISPRODUCTION === "true") {
    options.secure = true;
    options.sameSite = "None";
  }

  return options;
};

export const signup = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 403;
    const errArray = error.array();
    err.data = errArray[0].msg;
    throw err;
  }

  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const error = new Error("Password not match");
    error.statusCode = 401;
    throw error;
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      const err = new Error("User Already Exist");
      err.statusCode = 409;
      return next(err);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create a new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        ip: req.clientIp,
      },
    });

    if (!newUser) {
      const error = new Error("Something went wrong");
      error.statusCode = 500;
      throw error;
    }

    res.status(200).json({ message: "Signup successfully" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 403;
    const errArray = error.array();
    err.data = errArray[0].msg;
    throw err;
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const userData = await prisma.user.findUnique({ where: { email } });
    if (!userData) {
      const error = new Error("No user found");
      error.statusCode = 403;
      throw error;
    }

    // Compare password
    const match = await bcrypt.compare(password, userData.password);
    if (!match) {
      const error = new Error("Password not match");
      error.statusCode = 403;
      throw error;
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: userData.id,  // Use Prisma's `id` field
        email: userData.email,
        userAgent: req.headers["user-agent"],
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const cookieOptions = getCookieOptions(true);
    const nonHttpOnlyOptions = getCookieOptions(false);

    res.cookie("user_token", token, cookieOptions);
    res.cookie("isLogin", true, nonHttpOnlyOptions);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    next(error);
  }
};

export const postLogout = (req, res, next) => {
  const cookieOptions = getCookieOptions(true);
  const nonHttpOnlyOptions = getCookieOptions(false);

  res.clearCookie("user_token", cookieOptions);
  res.clearCookie("isLogin", nonHttpOnlyOptions);

  res.status(200).json({ message: "Logout successful" });
};
