const express = require('express');
const cors = require('cors');
const { testConnection } = require('./config/database');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.get('/test-db', async (req, res) => {
    const dbConnected = await testConnection();
    res.json({ 
        database: dbConnected ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

app.get('/', (req, res) => {
    res.json({ 
        message: 'E-commerce API is running successfully',
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access: http://localhost:${PORT}`);
    console.log(`Database test: http://localhost:${PORT}/test-db`);
});