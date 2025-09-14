import { AddTasks, DateTimeFilter, Footer, Header, StatsAndFilters, TaskList, TaskListPagination } from "@/components"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"
import { visibleTaskLimit } from "@/lib/data"

const HomePage = () => {
    const [taskBuffer, setTaskBuffer] = useState([])
    const [activeTaskCount, setActiveTaskCount] = useState(0)
    const [completeTaskCount, setCompleteTaskCount] = useState(0)
    const [filter, setFilter] = useState('all')
    const [dateQuery, setDateQuery] = useState('today')
    const [page, setPage] = useState(1)
    const fetchTask = async () => {
        try {
            const res = await api.get(`/tasks?filter=${dateQuery}`)
            setTaskBuffer(res.data.tasks)
            setActiveTaskCount(res.data.activeCount)
            setCompleteTaskCount(res.data.completeCount)
        } catch (error) {
            console.error("lỗi xảy ra khi truy xuất task", error)
            toast.error('lỗi xảy ra khi truy xuất task')
        }
    }
    useEffect(() => {
        fetchTask()
    }, [dateQuery])

    useEffect(() => {
        setPage(1)
    }, [filter, dateQuery])

    const filteredTasks = taskBuffer.filter((task) => {
        switch (filter) {
            case 'active':
                return task.status === 'active'
            case 'completed':
                return task.status === 'complete'
            default:
                return true
        }
    })
    const handleTaskChanged = () => {
        fetchTask()
    }

    const visibleTasks = filteredTasks.slice(
        (page - 1) * visibleTaskLimit,
        page * visibleTaskLimit
    )

    const totalPages = Math.ceil(filteredTasks.length / visibleTaskLimit)

    const handleNext = () => {
        if (page < totalPages) setPage(prev => prev + 1)
    }

    const handlePrev = () => {
        if (page > 1) setPage(prev => prev - 1)
    }

    const handlePageChange = (newPage) => {
        setPage(newPage)
    }
    useEffect(() => {
        if (page > 1 && visibleTasks.length === 0) {
            handlePrev()
        }
    }, [visibleTasks, page])
    return (
        <div className="min-h-screen w-full bg-[#fefcff] relative">
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `
                    radial-gradient(circle at 30% 70%, rgba(173, 216, 230, 0.35), transparent 60%),
                    radial-gradient(circle at 70% 30%, rgba(255, 182, 193, 0.4), transparent 60%)`,
                }}
            />

            <div className='container pt-8 mx-auto relative z-10'>
                <div className="w-full max-w-2xl p-6 mx-auto space-y-6">
                    <Header />
                    <AddTasks handleNewTaskAdded={handleTaskChanged} />
                    <StatsAndFilters activeTaskCount={activeTaskCount} completedTaskCount={completeTaskCount} filter={filter} setFilter={setFilter} />
                    <TaskList filteredTasks={visibleTasks} filter={filter} handleTaskChanged={handleTaskChanged} />
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <TaskListPagination handleNext={handleNext} handlePrev={handlePrev} handlePageChange={handlePageChange} page={page} totalPages={totalPages} />
                        <DateTimeFilter dateQuery={dateQuery} setDateQuery={setDateQuery} />
                    </div>
                    <Footer activeTaskCount={activeTaskCount} completedTaskCount={completeTaskCount} />
                </div>
            </div>
        </div>
    )
}

export default HomePage
