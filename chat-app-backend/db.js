const { Sequelize } = require('sequelize');
require('dotenv').config();

// Connect to the database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
  }
);

sequelize.sync();  // Sync models to the database

module.exports = sequelize;

