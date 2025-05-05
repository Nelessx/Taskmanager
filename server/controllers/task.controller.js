import { validationResult } from "express-validator";
import Task from "../model/task.js";
import User from "../model/user.js";
import { Op } from "sequelize";

export const postTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const { task, priority } = req.body;
    const userId = req.userId;

    const newTask = await Task.create({
      task,
      priority: Number(priority),
      UserId: userId,
    });

    res.status(201).json({ message: "Task created", data: newTask });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  try {
    const { sorts, filter, search } = req.query;
    const userId = req.userId;

    let queryOptions = {
      where: { UserId: userId },
      order: [],
    };

    if (search) {
      queryOptions.where.task = { [Op.iLike]: `%${search}%` };
    }

    if (filter) {
      queryOptions.where.status = filter;
    }

    if (sorts) {
      queryOptions.order =
        sorts.toLowerCase() === "date"
          ? [["createdAt", "DESC"]]
          : [["priority", "DESC"]];
    }

    const tasks = await Task.findAll(queryOptions);
    res.status(200).json({ message: "Tasks found", data: tasks });
  } catch (err) {
    next(err);
  }
};

export const getSingleTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({
      where: {
        id: taskId,
        UserId: userId,
      },
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: "Task found",
      data: task,
    });
  } catch (err) {
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 422;
      error.data = errors.array()[0].msg;
      throw error;
    }

    const { taskId } = req.params;
    const { task, priority, status } = req.body;
    const userId = req.userId;

    const taskToUpdate = await Task.findOne({
      where: {
        id: taskId,
        UserId: userId,
      },
    });

    if (!taskToUpdate) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    // Update only provided fields
    if (task) taskToUpdate.task = task;
    if (priority) taskToUpdate.priority = priority;
    if (status) taskToUpdate.status = status;

    await taskToUpdate.save();

    res.status(200).json({
      message: "Task updated successfully",
      data: taskToUpdate,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const userId = req.userId;

    const task = await Task.findOne({
      where: {
        id: taskId,
        UserId: userId,
      },
    });

    if (!task) {
      const error = new Error("Task not found");
      error.statusCode = 404;
      throw error;
    }

    await task.destroy();
    res.status(200).json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
