import prisma from "../prismaClient"; // assuming you have the Prisma client initialized

export const getUser = async (req, res, next) => {
  try {
    const id = req.userId;
    const userData = await prisma.user.findUnique({
      where: { id: id },
    });

    if (!userData) {
      const err = new Error("Invalid user");
      err.statusCode = 403;
      throw err;
    }

    res.status(200).json({
      message: "Get user data done",
      data: { name: userData.name, email: userData.email },
    });
  } catch (err) {
    next(err);
  }
};

export const editUser = async (req, res, next) => {
  const { name, email } = req.body;
  try {
    const id = req.userId;
    const updatedUser = await prisma.user.update({
      where: { id: id },
      data: { name: name, email: email },
    });

    res.status(200).json({
      message: "Edit user data done",
      data: { name: updatedUser.name, email: updatedUser.email },
    });
  } catch (err) {
    next(err);
  }
};

export const editPassword = async (req, res, next) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  try {
    if (newPassword !== confirmPassword) {
      const error = new Error("Passwords do not match");
      error.statusCode = 401;
      throw error;
    }

    const userData = await prisma.user.findUnique({
      where: { id: req.userId },
    });

    if (!userData) {
      const err = new Error("Invalid user");
      err.statusCode = 403;
      throw err;
    }

    const match = await bcrypt.compare(oldPassword, userData.password);
    if (!match) {
      const error = new Error("Password not match");
      error.statusCode = 403;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: req.userId },
      data: { password: hashedPassword },
    });

    res.status(200).json({ message: "Password update done" });
  } catch (err) {
    next(err);
  }
};
