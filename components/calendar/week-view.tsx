"use client"

import { format, addDays, startOfWeek } from "date-fns"
import { ko } from "date-fns/locale"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface WeekViewProps {
  date: Date
  onDateChange: (date: Date) => void
  onDateClick?: (date: Date) => void
  onDiaryClick?: (diary: any) => void
  diaryEntries?: any[]
}

export function WeekView({ date, onDateChange, onDateClick, onDiaryClick, diaryEntries = [] }: WeekViewProps) {
  const startDate = startOfWeek(date, { weekStartsOn: 0 })
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const goToPreviousWeek = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() - 7)
    onDateChange(newDate)
  }

  const goToNextWeek = () => {
    const newDate = new Date(date)
    newDate.setDate(date.getDate() + 7)
    onDateChange(newDate)
  }

  const selectDate = (newDate: Date) => {
    onDateChange(newDate)
    onDateClick?.(newDate)
  }

  const isToday = (day: Date) => {
    const today = new Date()
    return (
      day.getDate() === today.getDate() &&
      day.getMonth() === today.getMonth() &&
      day.getFullYear() === today.getFullYear()
    )
  }

  const isSelected = (day: Date) => {
    return (
      day.getDate() === date.getDate() && day.getMonth() === date.getMonth() && day.getFullYear() === date.getFullYear()
    )
  }

  const getDiariesForDate = (targetDate: Date) => {
    const dateStr = targetDate.toDateString()
    return diaryEntries.filter((entry) => new Date(entry.date).toDateString() === dateStr)
  }

  const hasDiaryForDate = (targetDate: Date) => {
    return getDiariesForDate(targetDate).length > 0
  }

  const selectedDateDiaries = getDiariesForDate(date)

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="icon" onClick={goToPreviousWeek} className="rounded-full hover:bg-gray-100">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-lg font-bold text-gray-800">
          {format(weekDays[0], "yyyy년 MM월 dd일")} - {format(weekDays[6], "MM월 dd일")}
        </h2>
        <Button variant="ghost" size="icon" onClick={goToNextWeek} className="rounded-full hover:bg-gray-100">
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map((day, index) => (
          <div key={index} className="text-center">
            <div className="text-xs text-gray-500 mb-1">{format(day, "E", { locale: ko })}</div>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-10 w-10 p-0 rounded-full relative",
                  isToday(day) && "border-2 border-gray-800",
                  isSelected(day) && "bg-gray-800 text-white hover:bg-gray-700 hover:text-white",
                )}
                onClick={() => selectDate(day)}
              >
                {format(day, "d")}
                {hasDiaryForDate(day) && (
                  <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white"></div>
                )}
              </Button>
            </motion.div>
          </div>
        ))}
      </div>

      <div className="h-[200px] rounded-2xl p-4 bg-[#F8F9FA] shadow-inner-neumorphic overflow-y-auto">
        {selectedDateDiaries.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">{format(date, "MM월 dd일")} 일기</h3>
            {selectedDateDiaries.map((diary, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                whileHover={{ scale: 1.02 }}
                onClick={() => onDiaryClick?.(diary)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-500">{diary.type}</span>
                  <span className="text-xs text-gray-400">
                    {diary.type === "schedule" && diary.scheduledTime
                      ? diary.scheduledTime
                      : format(new Date(diary.date), "HH:mm")}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {diary.title || diary.content?.substring(0, 30) + "..."}
                </h4>
                {diary.emotion && <span className="text-xs text-blue-600 mt-1 inline-block">{diary.emotion}</span>}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-gray-500 text-sm">{format(date, "yyyy년 MM월 dd일")}의 일정이 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}
