import Task from "../../models/Task.js"

export const getAllTasks = async (req, res) => {
    const { filter = 'today' } = req.query
    const now = new Date()
    let startDate
    switch (filter) {
        case 'today': {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDay())
            break
        }
        case 'week': {
            const mondayDate = now.getDate() - (now.getDay() - 1) - (now.getDay() === 0 ? 7 : 0)
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate)
            break
        }
        case 'month': {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
            break
        }
        case 'all':
        default: {
            startDate = null
        }
    }
    const query = startDate ? { createdAt: { $gte: startDate } } : {}
    try {
        const result = await Task.aggregate([
            { $match: query },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: 'active' } }, { $count: 'count' }],
                    completeCount: [{ $match: { status: 'complete' } }, { $count: 'count' }],
                }
            }
        ])
        const tasks = result[0].tasks
        const activeCount = result[0].activeCount[0]?.count || 0
        const completeCount = result[0].completeCount[0]?.count || 0

        return res.status(200).json({ tasks, activeCount, completeCount })
    } catch (error) {
        console.error('Lỗi khi gọi getAllTasks', error)
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}
export const createTasks = async (req, res) => {
    try {
        const { title } = req.body
        const tasks = new Task({ title })
        const newTask = await tasks.save()
        return res.status(201).json(newTask)
    } catch (error) {
        console.error('Lỗi khi gọi createTasks', error)
        return res.status(500).json({ message: 'lỗi hệ thông' })
    }
}
export const updateTasks = async (req, res) => {
    try {
        const { title, completedAt, status } = req.body
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            {
                title,
                status,
                completedAt
            },
            { new: true }
        )
        if (!updatedTask) return res.status(404).json({ message: 'Nhiệm vụ không tồn tại' })
        return res.status(200).json(updatedTask)
    } catch (error) {
        console.error('Lỗi khi gọi updateTasks: ', error)
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}
export const deleteTasks = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.id)
        if (!deletedTask) return res.status(404).json({ message: 'nhiệm vụ không tồn tại' })
        return res.status(200).json(deletedTask)
    } catch (error) {
        console.error('Lỗi khi gọi deleteTasks: ', error)
        return res.status(500).json({ message: 'Lỗi hệ thống' })
    }
}
