import express from 'express'
import taskRoute from './routes/tasksRouters.js'
import { connecDb } from './config/db.js'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config()
const port = process.env.PORT || '5001'

const app = express()

app.use(express.json())

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}))

app.use('/api/tasks', taskRoute)

connecDb().then(() => {
    app.listen(port, () => {
        console.log("App is running on port: 5001")
    })
})



