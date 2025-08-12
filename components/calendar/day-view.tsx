"use client"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface DayViewProps {
  date: Date
  onDateChange: (date: Date) => void
}

export function DayView({ date, onDateChange }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)

  const goToPreviousDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    onDateChange(newDate)
  }

  const goToNextDay = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    onDateChange(newDate)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousDay} className="rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-bold text-gray-800">{format(date, "yyyy년 MM월 dd일")}</h2>
        <Button variant="ghost" size="icon" onClick={goToNextDay} className="rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {hours.map((hour) => (
          <motion.div
            key={hour}
            className="flex items-start"
            whileHover={{ backgroundColor: "#F8F9FA", borderRadius: "0.75rem" }}
          >
            <div className="w-12 text-xs text-gray-500 pt-2">{hour}:00</div>
            <div className="flex-1 h-14 border-l pl-2 border-gray-200 rounded-r"></div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
