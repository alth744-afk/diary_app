"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Task {
  id: string
  text: string
  completed: boolean
  time?: string
}

interface TaskListProps {
  selectedTime?: number
  onTimeChange?: (time: number | undefined) => void
}

export function TaskList({ selectedTime, onTimeChange }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [newTask, setNewTask] = useState("")
  const [selectedTaskTime, setSelectedTaskTime] = useState<string>(
    selectedTime ? `${selectedTime.toString().padStart(2, "0")}:00` : "",
  )

  useEffect(() => {
    if (selectedTime !== undefined) {
      setSelectedTaskTime(`${selectedTime.toString().padStart(2, "0")}:00`)
    }
  }, [selectedTime])

  const handleTimeChange = (timeString: string) => {
    setSelectedTaskTime(timeString)
    if (onTimeChange) {
      if (timeString) {
        const hour = Number.parseInt(timeString.split(":")[0])
        onTimeChange(hour)
        scrollToTime(hour)
      } else {
        onTimeChange(undefined)
      }
    }
  }

  const scrollToTime = (hour: number) => {
    const timeElement = document.querySelector(`[data-hour="${hour}"]`)
    if (timeElement) {
      timeElement.scrollIntoView({ behavior: "smooth", block: "center" })
    }
  }

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          text: newTask,
          completed: false,
          time: selectedTaskTime || undefined,
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

  const timeOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, "0")
    return `${hour}:00`
  })

  return (
    <div className="space-y-4">
      <div className="mb-4">
        <Label className="text-sm font-medium text-gray-700 mb-2 block">시간 선택 (선택사항)</Label>
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <select
            value={selectedTaskTime}
            onChange={(e) => handleTimeChange(e.target.value)}
            className="rounded-xl py-2 px-3 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300 text-sm"
          >
            <option value="">시간 선택 안함</option>
            {timeOptions.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>
      </div>

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

      {tasks.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">아직 할 일이 없습니다.</p>
          <p className="text-xs mt-1">위에서 할 일을 추가해보세요!</p>
        </div>
      ) : (
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
                <div className="flex items-center space-x-3 flex-1">
                  <Checkbox
                    id={task.id}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="data-[state=checked]:bg-gray-800 data-[state=checked]:text-white h-5 w-5 rounded-md"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={task.id}
                      className={task.completed ? "line-through text-gray-400" : "text-gray-800"}
                    >
                      {task.text}
                    </Label>
                    {task.time && (
                      <div className="flex items-center mt-1">
                        <Clock className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">{task.time}</span>
                      </div>
                    )}
                  </div>
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
      )}
    </div>
  )
}
