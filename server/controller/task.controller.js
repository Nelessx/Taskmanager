import prisma from "../prismaClient";

export const postTask = async (req, res, next) => {
  const { task, priority } = req.body;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!userData) {
      const err = new Error("Invalid user");
      err.statusCode = 403;
      throw err;
    }

    const newTask = await prisma.task.create({
      data: {
        task: task,
        priority: Number(priority),
        userId: userData.id,
      },
    });

    res.status(200).json({ message: "Task created", data: newTask });
  } catch (err) {
    next(err);
  }
};

export const getTask = async (req, res, next) => {
  const { sorts, filter, search } = req.query;
  try {
    const userData = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!userData) {
      const err = new Error("Invalid user");
      err.statusCode = 403;
      throw err;
    }

    let query = { userId: userData.id };

    if (search && search.trim().length > 0) {
      query = { ...query, task: { contains: search, mode: 'insensitive' } };
    }

    if (filter) {
      query = { ...query, status: filter };
    }

    let taskData;
    if (sorts === "date") {
      taskData = await prisma.task.findMany({
        where: query,
        orderBy: { createDate: 'desc' },
      });
    } else if (sorts === "priority") {
      taskData = await prisma.task.findMany({
        where: query,
        orderBy: { priority: 'desc' },
      });
    } else {
      taskData = await prisma.task.findMany({ where: query });
    }

    res.status(200).json({ message: "Task found", data: taskData });
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const result = await prisma.task.delete({
      where: { id: taskId },
    });

    const taskData = await prisma.task.findMany({
      where: { userId: result.userId },
    });

    res.status(200).json({ message: "Task deleted", data: taskData });
  } catch (err) {
    next(err);
  }
};

export const completeTask = async (req, res, next) => {
  const { taskId } = req.body;
  try {
    const result = await prisma.task.update({
      where: { id: taskId },
      data: { status: "Completed" },
    });

    const taskData = await prisma.task.findMany({
      where: { userId: result.userId },
    });

    res.status(200).json({ message: "Task marked as complete", data: taskData });
  } catch (err) {
    next(err);
  }
};

export const getSingleTask = async (req, res, next) => {
  const { taskId } = req.query;
  try {
    const taskData = await prisma.task.findUnique({
      where: { id: taskId },
    });

    if (!taskData) {
      const err = new Error("Task not found");
      err.statusCode = 401;
      throw err;
    }

    res.status(200).json({ message: "Task found", data: taskData });
  } catch (err) {
    next(err);
  }
};

export const editTask = async (req, res, next) => {
  const { taskId, task, priority } = req.body;
  try {
    const singleTask = await prisma.task.update({
      where: { id: taskId },
      data: { task: task, priority: priority },
    });

    const taskData = await prisma.task.findMany({
      where: { userId: singleTask.userId },
    });

    res.status(201).json({
      message: "Task edited",
      data: taskData,
      singleTask,
    });
  } catch (err) {
    next(err);
  }
};
