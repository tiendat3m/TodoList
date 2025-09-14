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
}

app.use('/api/tasks', taskRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../frontend/dist/index.html"))
    })
}

connecDb().then(() => {
    app.listen(port, () => {
        console.log("App is running on port: 5001")
    })
})



