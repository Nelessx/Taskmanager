import { DataTypes } from "sequelize";
import { sequelize } from "../config/database.js";
import User from "./user.js";

const Task = sequelize.define(
  "Task",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    task: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      validate: {
        min: 1,
        max: 5,
      },
    },
    status: {
      type: DataTypes.ENUM("Pending", "Completed"),
      defaultValue: "Pending",
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: "tasks",
  }
);

// Define relationships
Task.belongsTo(User, {
  foreignKey: {
    name: "UserId",
    allowNull: false,
  },
  onDelete: "CASCADE",
});

User.hasMany(Task, {
  foreignKey: "UserId",
});

export default Task;
