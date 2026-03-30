const express = require('express');
const cors = require('cors');
const { testConnection } = require('./Config/database');
const { syncDatabase } = require('./Models');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({
        message: 'Ethiopian Theatre Hub API',
        version: '1.0.0',
        status: 'running'
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        time: new Date().toISOString()
    });
});

// Start server
const startServer = async () => {
    try {
        await testConnection();
        await syncDatabase();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📡 API: http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
    }
};

startServer();