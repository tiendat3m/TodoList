import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { useState } from "react"
import { toast } from "sonner"
import api from "@/lib/axios"

const AddTasks = ({ handleNewTaskAdded }) => {
    const [newTaskTitle, setNewTaskTitle] = useState('')

    const addTask = async () => {
        if (newTaskTitle.trim()) {
            try {
                await api.post('/tasks', { title: newTaskTitle })
                toast.success(`Nhiệm vụ ${newTaskTitle} đã được thêm vào`)
                handleNewTaskAdded?.()
            } catch (error) {
                console.error('Lỗi khi truy xuất')
                toast.error('Lỗi khi thêm nhiệm vụ mới')
            }
            setNewTaskTitle('')
        } else {
            toast.error('Bạn cần nhập nội dung của nhiệm vụ')
        }
    }
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') addTask()
    }
    return (
        <Card className="p-6 border-0 bg-gradient-card shadow-custom-lg">
            <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                    type="text"
                    placeholder="Cần phải làm gì?"
                    className='h-12 text-base bg-slate-50 sm:flex-1 border-border/50 focus:ring-primary/20'
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <Button variant="gradient" size="xl" className="px-6 cursor-pointer" onClick={addTask} disabled={!newTaskTitle}><Plus size={5} /> Thêm</Button>
            </div>
        </Card>
    )
}

export default AddTasks
