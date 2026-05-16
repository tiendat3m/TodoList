import express from 'express'
import taskRoute from './routes/tasksRouters.js'
import { connecDb } from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
import path from 'path'
dotenv.config()
const port = process.env.PORT || '5001'
const __dirname = path.resolve()
const app = express()

app.use(express.json())

if (process.env.NODE_ENV !== "production") {
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }))
} else {
    app.use(cors({
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    }))
}

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
    await connecDb();
    next();
});

app.use('/api/tasks', taskRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

// For local development
if (process.env.NODE_ENV !== "production") {
    connecDb().then(() => {
        app.listen(port, () => {
            console.log("App is running on port: " + port)
        })
    })
}

// For Vercel serverless
export default app



