const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true
        }
    }
);

const testConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ PostgreSQL connected successfully');
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        return false;
    }
};

module.exports = { sequelize, testConnection };