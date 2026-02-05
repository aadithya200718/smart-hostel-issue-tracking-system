require('dotenv').config();
const app = require('./app');
// const { sequelize } = require('./models');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    const db = require('./models');
    await db.sequelize.authenticate();
    console.log('Database connected!');

    // Sync models (use { force: true } only for dev/reset)
    await db.sequelize.sync({ alter: true });
    // await db.sequelize.sync();
    console.log('Database synced!');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
  }
}

startServer();
