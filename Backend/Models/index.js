const { sequelize } = require('../Config/database');

const syncDatabase = async () => {
    try {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');
    } catch (error) {
        console.error('❌ Sync error:', error);
    }
};

module.exports = { syncDatabase };