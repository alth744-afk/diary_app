"use client"

import { format } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { useEffect, useRef, useState } from "react"

interface DayViewProps {
  date: Date
  onDateChange: (date: Date) => void
  onTimeClick?: (date?: Date, timeSlot?: number) => void
  onDiaryClick?: (diary: any) => void
  diaryEntries?: any[]
  scrollToTime?: number | null
}

export function DayView({
  date,
  onDateChange,
  onTimeClick,
  onDiaryClick,
  diaryEntries = [],
  scrollToTime = null,
}: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [expandedHours, setExpandedHours] = useState<Set<number>>(new Set())

  useEffect(() => {
    const scrollToCurrentTime = () => {
      if (scrollAreaRef.current) {
        const currentHour = new Date().getHours()
        const hourHeight = 56 // 각 시간 슬롯의 높이
        const scrollTop = Math.max(0, currentHour * hourHeight - 100)

        scrollAreaRef.current.scrollTo({
          top: scrollTop,
          behavior: "smooth",
        })
      }
    }

    const timer = setTimeout(scrollToCurrentTime, 200)
    return () => clearTimeout(timer)
  }, [date])

  useEffect(() => {
    if (scrollToTime !== null && scrollAreaRef.current) {
      const hourHeight = 56
      const scrollTop = Math.max(0, scrollToTime * hourHeight - 100)
      scrollAreaRef.current.scrollTo({ top: scrollTop, behavior: "smooth" })
    }
  }, [scrollToTime])

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

  const getDiariesForTimeSlot = (targetDate: Date, hour: number) => {
    const dateStr = targetDate.toDateString()
    return diaryEntries.filter((entry) => {
      const entryDate = new Date(entry.date)
      const entryHour = entry.timeSlot || entryDate.getHours()
      return entryDate.toDateString() === dateStr && entryHour === hour
    })
  }

  const getDiaryColor = (diary: any) => {
    switch (diary.type) {
      case "daily":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "schedule":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "emotion":
        return "bg-pink-100 text-pink-800 hover:bg-pink-200"
      default:
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
    }
  }

  const toggleExpandHour = (hour: number) => {
    const newExpanded = new Set(expandedHours)
    if (newExpanded.has(hour)) {
      newExpanded.delete(hour)
    } else {
      newExpanded.add(hour)
    }
    setExpandedHours(newExpanded)
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

      <div ref={scrollAreaRef} className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        {hours.map((hour) => {
          const hourDiaries = getDiariesForTimeSlot(date, hour)
          const isExpanded = expandedHours.has(hour)
          const visibleDiaries = isExpanded ? hourDiaries : hourDiaries.slice(0, 2)

          return (
            <motion.div
              key={hour}
              data-hour={hour}
              className="flex items-start cursor-pointer min-h-[56px]"
              whileHover={{ backgroundColor: "#F8F9FA", borderRadius: "0.75rem" }}
              onClick={() => onTimeClick?.(date, hour)}
            >
              <div className="w-12 text-xs text-gray-500 pt-2">{hour}:00</div>
              <div className="flex-1 border-l pl-2 border-gray-200 rounded-r relative py-1">
                {hourDiaries.length > 0 && (
                  <div className="space-y-1">
                    {visibleDiaries.map((diary, index) => (
                      <div
                        key={index}
                        className={`${getDiaryColor(diary)} text-xs px-2 py-1 rounded-lg truncate cursor-pointer flex items-center justify-between`}
                        onClick={(e) => {
                          e.stopPropagation()
                          onDiaryClick?.(diary)
                        }}
                      >
                        <span className="truncate">{diary.title || diary.content?.substring(0, 20) + "..."}</span>
                        {diary.type === "schedule" && diary.scheduledTime && (
                          <span className="text-xs ml-1 flex-shrink-0">{diary.scheduledTime}</span>
                        )}
                      </div>
                    ))}
                    {hourDiaries.length > 2 && (
                      <div
                        className="text-xs text-blue-600 px-2 py-1 cursor-pointer hover:bg-blue-50 rounded"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleExpandHour(hour)
                        }}
                      >
                        {isExpanded ? "접기" : `+${hourDiaries.length - 2}개 더`}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
