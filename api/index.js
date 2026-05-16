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
    await connecDb();
    next();
});

app.use('/api/tasks', taskRoute);

export default app;
