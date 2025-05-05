import { sequelize } from '../config/database.js';
import User from '../model/user.js';
import Task from '../model/task.js';

const migrate = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database tables created successfully');
    
    // Query table information directly
    const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('📊 Created tables:', tables);
    
    // Log model information
    console.log('📝 Models registered:');
    console.log('- User model:', User.tableName);
    console.log('- Task model:', Task.tableName);

  } catch (error) {
    console.error('❌ Error creating database tables:', error);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
};

migrate();