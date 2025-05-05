import { sequelize } from "../config/database.js";
import User from "../model/user.js";
import Task from "../model/task.js";

const testModels = async () => {
  try {
    // Test user creation
    const testUser = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      ip: "127.0.0.1",
    });
    console.log("✅ Test user created:", testUser.id);

    // Test task creation
    const testTask = await Task.create({
      task: "Test Task",
      priority: 1,
      UserId: testUser.id,
    });
    console.log("✅ Test task created:", testTask.id);

    // Test relationships
    const userWithTasks = await User.findOne({
      where: { id: testUser.id },
      include: Task,
    });
    console.log("📝 User with tasks:", JSON.stringify(userWithTasks, null, 2));
  } catch (error) {
    console.error("❌ Error testing models:", error);
  } finally {
    await sequelize.close();
  }
};

testModels();
