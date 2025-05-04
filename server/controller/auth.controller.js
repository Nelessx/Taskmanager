import { validationResult } from "express-validator";
import { user } from "../model/user.js";
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

export const signup = (req, res, next) => {
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

  user
    .findOne({ email: email })
    .then((response) => {
      if (response) {
        const err = new Error("User Already Exist");
        err.statusCode = 409;
        return next(err);
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const newUser = new user({
        name,
        email,
        password: hashedPassword,
        ip: req.clientIp,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      if (!savedUser) {
        const error = new Error("Something went wrong");
        error.statusCode = 500;
        throw error;
      }

      res.status(200).json({ message: "Signup successfully" });
    })
    .catch((error) => {
      if (!error.statusCode) {
        error.statusCode = 500;
      }
      next(error);
    });
};

export const postLogin = (req, res, next) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    const err = new Error("Validation Error");
    err.statusCode = 403;
    const errArray = error.array();
    err.data = errArray[0].msg;
    throw err;
  }

  const { email, password } = req.body;
  let newUserData;

  user
    .findOne({ email })
    .then((userData) => {
      if (!userData) {
        const error = new Error("No user found");
        error.statusCode = 403;
        throw error;
      }

      newUserData = userData;
      return bcrypt.compare(password, userData.password);
    })
    .then((match) => {
      if (!match) {
        const error = new Error("Password not match");
        error.statusCode = 403;
        throw error;
      }

      const token = jwt.sign(
        {
          id: newUserData._id,
          email: newUserData.email,
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
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

export const postLogout = (req, res, next) => {
  const cookieOptions = getCookieOptions(true);
  const nonHttpOnlyOptions = getCookieOptions(false);

  res.clearCookie("user_token", cookieOptions);
  res.clearCookie("isLogin", nonHttpOnlyOptions);

  res.status(200).json({ message: "Logout successful" });
};
