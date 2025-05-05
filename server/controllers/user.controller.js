import User from "../model/user.js";
import Task from "../model/task.js";

export const getUser = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "createdAt"],
      include: [
        {
          model: Task,
          attributes: ["id", "task", "status", "priority", "createdAt"],
        },
      ],
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({ message: "User found", data: user });
  } catch (err) {
    next(err);
  }
};
