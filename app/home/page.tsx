"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar } from "@/components/ui/calendar"
import { DiaryCard } from "@/components/diary-card"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DayView } from "@/components/calendar/day-view"
import { WeekView } from "@/components/calendar/week-view"
import { useUserStore } from "@/lib/store"

export default function HomePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState("day")
  const { user } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col">
      <main className="flex-1 pb-20 px-4 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Tabs defaultValue="day" value={calendarView} onValueChange={setCalendarView} className="w-full mb-6">
            <TabsList className="grid grid-cols-3 p-1 bg-[#F2F2F2] rounded-full shadow-neumorphic mb-4">
              <TabsTrigger
                value="day"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-neumorphic-pressed transition-all duration-300"
              >
                Day
              </TabsTrigger>
              <TabsTrigger
                value="week"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-neumorphic-pressed transition-all duration-300"
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-neumorphic-pressed transition-all duration-300"
              >
                Month
              </TabsTrigger>
            </TabsList>

            <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-neumorphic p-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={calendarView}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TabsContent value="day" className="mt-0">
                    <DayView date={date} onDateChange={setDate} />
                  </TabsContent>

                  <TabsContent value="week" className="mt-0">
                    <WeekView date={date} onDateChange={setDate} />
                  </TabsContent>

                  <TabsContent value="month" className="mt-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(date) => date && setDate(date)}
                      className="rounded-xl"
                    />
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>

          <div className="mb-6">
            <h2 className="text-lg font-bold mb-3 text-gray-800">다이어리 작성하기</h2>
            <ScrollArea className="w-full pb-2" orientation="horizontal">
              <div className="flex space-x-4 pb-4 pr-4">
                <DiaryCard
                  title="하루 일기"
                  description="오늘 있었던 일을 기록해보세요"
                  href="/write/daily"
                  emoji="📝"
                  color="bg-lavender"
                />
                <DiaryCard
                  title="감정 일기"
                  description="지금 어떤 감정을 느끼고 있나요?"
                  href="/write/emotion"
                  emoji="😊"
                  color="bg-apricot"
                />
                <DiaryCard
                  title="감사 일기"
                  description="오늘 감사했던 일을 적어보세요"
                  href="/write/gratitude"
                  emoji="🙏"
                  color="bg-mint"
                />
                {user?.gender === "female" && (
                  <DiaryCard
                    title="생리 일기"
                    description="컨디션과 증상을 기록해보세요"
                    href="/write/period"
                    emoji="🌸"
                    color="bg-skyblue"
                  />
                )}
                <DiaryCard
                  title="일정 관리"
                  description="해야 할 일을 정리해보세요"
                  href="/write/schedule"
                  emoji="📅"
                  color="bg-beige"
                />
              </div>
            </ScrollArea>
          </div>
        </motion.div>
      </main>

      <BottomNavigation />
    </div>
  )
}
