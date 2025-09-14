import express from 'express'
import { createTasks, deleteTasks, getAllTasks, updateTasks } from '../controller/taskController.js'

const router = express.Router()

router.get('/', getAllTasks)

router.post('/', createTasks)

router.put('/:id', updateTasks)

router.delete('/:id', deleteTasks)

export default router