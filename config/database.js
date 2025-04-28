const { Sequelize } = require("sequelize");
const config = require("./config.json"); // Import config.json

const env = process.env.NODE_ENV || "development"; // Default to development
const dbConfig = config[env];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    dialect: dbConfig.dialect,
    dialectOptions: dbConfig.dialectOptions,
    pool: dbConfig.pool,
    logging: false, // Optional: disable SQL query logs
  }
);

module.exports = sequelize;
