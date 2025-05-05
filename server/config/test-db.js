import { sequelize } from "./database.js";

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connection has been established successfully.");
    // Test database version
    const [results] = await sequelize.query("SELECT version();");
    console.log("📌 Database version:", results[0].version);
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
};

testConnection();
