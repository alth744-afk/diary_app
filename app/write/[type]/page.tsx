"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { ChevronLeft, Save } from "lucide-react"
import { motion } from "framer-motion"
import { EmotionSelector } from "@/components/emotion-selector"
import { PeriodSymptoms } from "@/components/period-symptoms"
import { TaskList } from "@/components/task-list"

const diaryPrompts: Record<string, string> = {
  daily: "오늘 기억에 남는 일은?",
  emotion: "지금 기분은 어떤가요?",
  gratitude: "오늘 감사했던 3가지",
  period: "오늘의 컨디션은 어떤가요?",
  schedule: "오늘 해야 할 일은 무엇인가요?",
}

const diaryTitles: Record<string, string> = {
  daily: "하루 일기",
  emotion: "감정 일기",
  gratitude: "감사 일기",
  period: "생리 일기",
  schedule: "일정 관리",
}

const diaryEmojis: Record<string, string> = {
  daily: "📝",
  emotion: "😊",
  gratitude: "🙏",
  period: "🌸",
  schedule: "📅",
}

export default function WritePage() {
  const router = useRouter()
  const params = useParams()
  const type = params.type as string
  const [content, setContent] = useState("")
  const [title, setTitle] = useState("")
  const [selectedEmotion, setSelectedEmotion] = useState("😊")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number | undefined>()

  useEffect(() => {
    const pendingTitle = localStorage.getItem("pendingDiaryTitle")
    if (pendingTitle) {
      setTitle(pendingTitle)
      localStorage.removeItem("pendingDiaryTitle")
    }

    const urlParams = new URLSearchParams(window.location.search)
    const timeFromUrl = urlParams.get("time")

    if (timeFromUrl) {
      setSelectedTimeSlot(Number.parseInt(timeFromUrl))
    } else {
      const timeSlot = localStorage.getItem("selectedTimeSlot")
      if (timeSlot) {
        setSelectedTimeSlot(Number.parseInt(timeSlot))
        localStorage.removeItem("selectedTimeSlot")
      }
    }
  }, [])

  const handleTimeChange = (time: number | undefined) => {
    setSelectedTimeSlot(time)
  }

  const handleSave = () => {
    const finalTitle = title.trim() || content.split("\n")[0]?.trim() || content.substring(0, 50).trim()

    const diaryEntry: any = {
      id: Date.now().toString(),
      title: finalTitle || `${diaryTitles[type]} - ${new Date().toLocaleDateString("ko-KR")}`,
      content,
      type,
      date: new Date().toISOString(),
      emotion: type === "emotion" ? selectedEmotion : diaryEmojis[type],
      lastModified: new Date().toISOString(),
    }

    if (type === "schedule" && selectedTimeSlot !== undefined) {
      diaryEntry.timeSlot = selectedTimeSlot
      diaryEntry.scheduledTime = `${selectedTimeSlot.toString().padStart(2, "0")}:00`
    }

    const existingEntries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
    existingEntries.push(diaryEntry)
    localStorage.setItem("diaryEntries", JSON.stringify(existingEntries))

    localStorage.removeItem("currentDiaryTitle")

    if (type === "schedule" && selectedTimeSlot !== undefined) {
      localStorage.setItem("scrollToTime", selectedTimeSlot.toString())
      localStorage.setItem("switchToDay", "true")
    }

    router.push("/home")
  }

  const renderDiaryContent = () => {
    switch (type) {
      case "emotion":
        return (
          <>
            <EmotionSelector onEmotionChange={setSelectedEmotion} />
            <Textarea
              placeholder={diaryPrompts[type]}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] mt-6 rounded-2xl py-4 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
            />
          </>
        )
      case "period":
        return (
          <>
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">여성 사용자를 위한 생리 일기입니다</p>
            </div>
            <PeriodSymptoms />
          </>
        )
      case "schedule":
        return <TaskList selectedTime={selectedTimeSlot} onTimeChange={handleTimeChange} />
      default:
        return (
          <Textarea
            placeholder={diaryPrompts[type]}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px] rounded-2xl py-4 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 rounded-full hover:bg-gray-100 transition-all duration-300"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        뒤로
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-neumorphic p-6"
      >
        <div className="flex items-center mb-6">
          <span className="text-2xl mr-3">{diaryEmojis[type]}</span>
          <h1 className="text-xl font-bold text-gray-800">{diaryTitles[type] || "일기 작성"}</h1>
        </div>

        <div className="mb-6">
          <Input
            placeholder={title ? "제목을 입력하세요" : diaryPrompts[type]}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-2xl py-4 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
          />
          {!title && (
            <p className="text-xs text-gray-400 mt-2 px-2">
              제목을 입력하지 않으면 내용의 첫 줄이 제목으로 사용됩니다.
            </p>
          )}
        </div>

        {renderDiaryContent()}

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleSave}
            disabled={!content.trim() && type !== "schedule"}
            className="px-6 py-5 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-400 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]"
          >
            <Save className="h-5 w-5 mr-2" />
            저장하기
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
