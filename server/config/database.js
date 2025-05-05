import { Sequelize } from "sequelize";
import "dotenv/config";

export const sequelize = new Sequelize(process.env.POSTGRES_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  logging: false, 
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("📦 PostgreSQL Database connected successfully");
    await sequelize.sync({ alter: true }); 
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
