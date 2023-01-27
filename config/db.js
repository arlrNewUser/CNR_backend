
import Sequelize from "sequelize";
import dotenv from "dotenv";

// Env variables
dotenv.config();

const db = new Sequelize('cnre', process.env.DB_USER, process.env.DB_PASSWORD, {
    host: '127.0.0.1',
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    define: {
        timestamps: false
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    operatorAliases: false
});

export default db;
