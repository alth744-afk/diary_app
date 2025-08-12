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
import { DiaryDetailModal } from "@/components/diary-detail-modal"
import { useUserStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { format } from "date-fns"

interface DiaryTypeModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (type: string) => void
  selectedDate?: Date
}

function DiaryTypeModal({ isOpen, onClose, onSelect, selectedDate }: DiaryTypeModalProps) {
  const { user } = useUserStore()

  if (!isOpen) return null

  const diaryTypes = [
    {
      type: "daily",
      title: "하루 일기",
      description: "오늘 있었던 일을 기록해보세요",
      emoji: "📝",
      color: "bg-lavender",
    },
    {
      type: "emotion",
      title: "감정 일기",
      description: "지금 어떤 감정을 느끼고 있나요?",
      emoji: "😊",
      color: "bg-apricot",
    },
    {
      type: "gratitude",
      title: "감사 일기",
      description: "오늘 감사했던 일을 적어보세요",
      emoji: "🙏",
      color: "bg-mint",
    },
    ...(user?.gender === "female"
      ? [
          {
            type: "period",
            title: "생리 일기",
            description: "컨디션과 증상을 기록해보세요",
            emoji: "🌸",
            color: "bg-skyblue",
          },
        ]
      : []),
    { type: "schedule", title: "일정 관리", description: "해야 할 일을 정리해보세요", emoji: "📅", color: "bg-beige" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-neumorphic p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full hover:bg-gray-100"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-2">다이어리 유형 선택</h2>
          <p className="text-gray-600">
            {selectedDate
              ? `${selectedDate.toLocaleDateString("ko-KR")}에 작성할 다이어리를 선택하세요`
              : "작성할 다이어리 유형을 선택하세요"}
          </p>
        </div>

        <div className="space-y-3">
          {diaryTypes.map((diary) => (
            <button
              key={diary.type}
              onClick={() => onSelect(diary.type)}
              className="w-full p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all duration-300 text-left"
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{diary.emoji}</span>
                <div>
                  <h3 className="font-semibold text-gray-800">{diary.title}</h3>
                  <p className="text-sm text-gray-600">{diary.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function HomePage() {
  const [date, setDate] = useState<Date>(new Date())
  const [calendarView, setCalendarView] = useState("day")
  const [titleInput, setTitleInput] = useState("")
  const [showQuickWrite, setShowQuickWrite] = useState(false)
  const [showDiaryTypeModal, setShowDiaryTypeModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | null>(null)
  const [diaryEntries, setDiaryEntries] = useState<any[]>([])
  const [selectedDiary, setSelectedDiary] = useState<any>(null)
  const [showDiaryDetail, setShowDiaryDetail] = useState(false)
  const [scrollToTime, setScrollToTime] = useState<number | null>(null)
  const { user } = useUserStore()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const savedTitle = localStorage.getItem("currentDiaryTitle")
    if (savedTitle) {
      setTitleInput(savedTitle)
    }
    loadDiaryEntries()

    const timeToScroll = localStorage.getItem("scrollToTime")
    const switchToDay = localStorage.getItem("switchToDay")

    if (timeToScroll && switchToDay) {
      setCalendarView("day")
      setScrollToTime(Number.parseInt(timeToScroll))
      localStorage.removeItem("scrollToTime")
      localStorage.removeItem("switchToDay")
    }
  }, [])

  useEffect(() => {
    if (scrollToTime !== null && mounted && calendarView === "day") {
      setTimeout(() => {
        setScrollToTime(null)
      }, 500)
    }
  }, [scrollToTime, mounted, calendarView])

  const loadDiaryEntries = () => {
    const entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
    setDiaryEntries(entries)
  }

  useEffect(() => {
    if (mounted && titleInput) {
      localStorage.setItem("currentDiaryTitle", titleInput)
    }
  }, [titleInput, mounted])

  const handleQuickWrite = (type: string) => {
    if (titleInput.trim()) {
      localStorage.setItem("pendingDiaryTitle", titleInput.trim())
    }
    router.push(`/write/${type}`)
  }

  const handleTitleFocus = () => {
    setShowQuickWrite(true)
  }

  const handleTitleBlur = () => {
    setTimeout(() => setShowQuickWrite(false), 200)
  }

  const handleCalendarClick = (clickedDate?: Date, viewType?: string, timeSlot?: number) => {
    const targetDate = clickedDate || date

    if (viewType === "day") {
      localStorage.setItem("selectedDiaryDate", targetDate.toISOString())
      if (timeSlot !== undefined) {
        router.push(`/write/schedule?time=${timeSlot}`)
      } else {
        router.push("/write/schedule")
      }
    } else {
      // Week/Month view에서는 다이어리 유형 선택 모달 표시
      setSelectedDate(targetDate)
      setSelectedTimeSlot(timeSlot || null)
      setShowDiaryTypeModal(true)
    }
  }

  const handleDiaryTypeSelect = (type: string) => {
    if (selectedDate) {
      localStorage.setItem("selectedDiaryDate", selectedDate.toISOString())
    }

    let url = `/write/${type}`
    if (selectedTimeSlot !== null) {
      url += `?time=${selectedTimeSlot}`
    }

    setShowDiaryTypeModal(false)
    router.push(url)
  }

  const handleDiaryClick = (diary: any) => {
    setSelectedDiary(diary)
    setShowDiaryDetail(true)
  }

  const handleDiaryUpdate = (updatedDiary: any) => {
    setDiaryEntries((prev) => prev.map((entry) => (entry.id === updatedDiary.id ? updatedDiary : entry)))
    setSelectedDiary(updatedDiary)
    loadDiaryEntries() // 업데이트 후 다시 로드
  }

  const handleDiaryDelete = (deletedId: string) => {
    setDiaryEntries((prev) => prev.filter((entry) => entry.id !== deletedId))
    loadDiaryEntries() // 삭제 후 다시 로드
  }

  const hasEntryOnDate = (checkDate: Date) => {
    const dateStr = checkDate.toDateString()
    return diaryEntries.some((entry) => new Date(entry.date).toDateString() === dateStr)
  }

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
                    <DayView
                      date={date}
                      onDateChange={setDate}
                      onTimeClick={(clickedDate, timeSlot) => handleCalendarClick(clickedDate, "day", timeSlot)}
                      onDiaryClick={handleDiaryClick}
                      diaryEntries={diaryEntries}
                      scrollToTime={scrollToTime}
                    />
                  </TabsContent>

                  <TabsContent value="week" className="mt-0">
                    <WeekView
                      date={date}
                      onDateChange={setDate}
                      onDateClick={(clickedDate) => handleCalendarClick(clickedDate, "week")}
                      onDiaryClick={handleDiaryClick}
                      diaryEntries={diaryEntries}
                    />
                  </TabsContent>

                  <TabsContent value="month" className="mt-0">
                    <div className="flex justify-center px-4">
                      <div className="w-full max-w-[480px]">
                        <Calendar
                          mode="single"
                          selected={date}
                          onSelect={(date) => {
                            if (date) {
                              setDate(date)
                              handleCalendarClick(date, "month")
                            }
                          }}
                          className="rounded-xl mx-auto"
                          modifiers={{
                            hasEntry: (date) => hasEntryOnDate(date),
                          }}
                          modifiersStyles={{
                            hasEntry: {
                              backgroundColor: "#E8F5E8",
                              color: "#2D5A2D",
                              fontWeight: "bold",
                            },
                          }}
                        />
                        {/* 선택된 날짜의 일기 표시 */}
                        <div className="mt-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-neumorphic p-4">
                          {(() => {
                            const selectedDateDiaries = diaryEntries.filter(
                              (entry) => new Date(entry.date).toDateString() === date.toDateString(),
                            )

                            return selectedDateDiaries.length > 0 ? (
                              <div className="space-y-2">
                                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                                  {format(date, "MM월 dd일")} 일기
                                </h3>
                                {selectedDateDiaries.map((diary, index) => (
                                  <motion.div
                                    key={index}
                                    className="bg-white rounded-lg p-3 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleDiaryClick(diary)}
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
                                    {diary.emotion && (
                                      <span className="text-xs text-blue-600 mt-1 inline-block">{diary.emotion}</span>
                                    )}
                                  </motion.div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center text-gray-500 text-sm py-4">
                                {format(date, "yyyy년 MM월 dd일")}의 일기가 없습니다.
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </motion.div>
              </AnimatePresence>
            </div>
          </Tabs>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-gray-800">다이어리 작성하기</h2>
            </div>
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

      <AnimatePresence>
        {showDiaryTypeModal && (
          <DiaryTypeModal
            isOpen={showDiaryTypeModal}
            onClose={() => setShowDiaryTypeModal(false)}
            onSelect={handleDiaryTypeSelect}
            selectedDate={selectedDate || undefined}
          />
        )}
      </AnimatePresence>

      {/* 일기 상세보기 모달 추가 */}
      <DiaryDetailModal
        entry={selectedDiary}
        isOpen={showDiaryDetail}
        onClose={() => setShowDiaryDetail(false)}
        onUpdate={handleDiaryUpdate}
        onDelete={handleDiaryDelete}
      />
    </div>
  )
}
