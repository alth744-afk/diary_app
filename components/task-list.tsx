"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Task {
  id: string
  text: string
  completed: boolean
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([{ id: "1", text: "할 일을 추가해보세요", completed: false }])
  const [newTask, setNewTask] = useState("")

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask,
          completed: false,
        },
      ])
      setNewTask("")
    }
  }

  const toggleTask = (id: string) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)))
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="할 일 추가하기"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
          className="rounded-xl py-6 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
        />
        <Button
          onClick={addTask}
          className="rounded-xl bg-gray-800 hover:bg-gray-700 shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center justify-between p-4 bg-white rounded-xl shadow-neumorphic"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={task.id}
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="data-[state=checked]:bg-gray-800 data-[state=checked]:text-white h-5 w-5 rounded-md"
                />
                <Label htmlFor={task.id} className={task.completed ? "line-through text-gray-400" : "text-gray-800"}>
                  {task.text}
                </Label>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTask(task.id)}
                className="rounded-full hover:bg-gray-100"
              >
                <Trash2 className="h-4 w-4 text-gray-500" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
