import express from 'express';
import taskRoute from '../backend/src/routes/tasksRouters.js';
import { connecDb } from '../backend/src/config/db.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
    try {
        await connecDb();
        next();
    } catch (error) {
        console.error('DB Connection Error:', error);
        res.status(500).json({
            error: 'Database connection failed',
            message: error.message,
            envCheck: !!process.env.DB_CONNECT_STRING
        });
    }
});

app.use('/api/tasks', taskRoute);

// Error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message
    });
});

export default app;
