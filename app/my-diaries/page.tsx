"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, Filter, Calendar, X, RotateCcw } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { BottomNavigation } from "@/components/bottom-navigation"
import { DiaryDetailModal } from "@/components/diary-detail-modal"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import Link from "next/link"

interface DiaryEntry {
  id: string
  title: string
  content: string
  type: string
  date: string
  emotion: string
  lastModified?: string
}

interface DateFilter {
  type: "single" | "range" | "none"
  startDate?: Date
  endDate?: Date
}

export default function MyDiariesPage() {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState<DateFilter>({ type: "none" })
  const [selectedEntry, setSelectedEntry] = useState<DiaryEntry | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
    setDiaryEntries(
      entries.sort((a: DiaryEntry, b: DiaryEntry) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )

    const savedFilters = JSON.parse(localStorage.getItem("diaryFilters") || "{}")
    if (savedFilters.searchTerm) setSearchTerm(savedFilters.searchTerm)
    if (savedFilters.typeFilter) setTypeFilter(savedFilters.typeFilter)
    if (savedFilters.dateFilter) setDateFilter(savedFilters.dateFilter)
  }, [])

  useEffect(() => {
    if (mounted) {
      const filters = { searchTerm, typeFilter, dateFilter }
      localStorage.setItem("diaryFilters", JSON.stringify(filters))
    }
  }, [searchTerm, typeFilter, dateFilter, mounted])

  const filteredEntries = diaryEntries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter === "all" || entry.type === typeFilter

    let matchesDate = true
    if (dateFilter.type === "single" && dateFilter.startDate) {
      const entryDate = new Date(entry.date).toDateString()
      const filterDate = dateFilter.startDate.toDateString()
      matchesDate = entryDate === filterDate
    } else if (dateFilter.type === "range" && dateFilter.startDate && dateFilter.endDate) {
      const entryDate = new Date(entry.date)
      matchesDate = entryDate >= dateFilter.startDate && entryDate <= dateFilter.endDate
    }

    return matchesSearch && matchesType && matchesDate
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    })
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      daily: "하루 일기",
      emotion: "감정 일기",
      gratitude: "감사 일기",
      period: "생리 일기",
      schedule: "일정 관리",
    }
    return labels[type] || type
  }

  const resetFilters = () => {
    setSearchTerm("")
    setTypeFilter("all")
    setDateFilter({ type: "none" })
    localStorage.removeItem("diaryFilters")
  }

  const getDateFilterText = () => {
    if (dateFilter.type === "single" && dateFilter.startDate) {
      return format(dateFilter.startDate, "yyyy.MM.dd", { locale: ko })
    } else if (dateFilter.type === "range" && dateFilter.startDate && dateFilter.endDate) {
      return `${format(dateFilter.startDate, "MM.dd", { locale: ko })} - ${format(dateFilter.endDate, "MM.dd", { locale: ko })}`
    }
    return "날짜 선택"
  }

  const handleCardClick = (entry: DiaryEntry) => {
    setSelectedEntry(entry)
    setIsModalOpen(true)
  }

  const handleEntryUpdate = (updatedEntry: DiaryEntry) => {
    setDiaryEntries((prev) =>
      prev
        .map((entry) => (entry.id === updatedEntry.id ? updatedEntry : entry))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    )
    setSelectedEntry(updatedEntry)
  }

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">내 일기</h1>

          {/* 검색 및 필터 */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="일기 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-2xl bg-white shadow-neumorphic border-0"
              />
            </div>

            <div className="flex gap-3 flex-wrap">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="flex-1 min-w-[120px] rounded-2xl bg-white shadow-neumorphic border-0">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="유형 필터" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 유형</SelectItem>
                  <SelectItem value="daily">하루 일기</SelectItem>
                  <SelectItem value="emotion">감정 일기</SelectItem>
                  <SelectItem value="gratitude">감사 일기</SelectItem>
                  <SelectItem value="period">생리 일기</SelectItem>
                  <SelectItem value="schedule">일정 관리</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`flex-1 min-w-[120px] rounded-2xl bg-white shadow-neumorphic border-0 justify-start ${
                      dateFilter.type !== "none" ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    {getDateFilterText()}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <Button
                        variant={dateFilter.type === "single" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateFilter({ type: "single" })}
                        className="w-full"
                      >
                        특정 날짜
                      </Button>
                      <Button
                        variant={dateFilter.type === "range" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDateFilter({ type: "range" })}
                        className="w-full"
                      >
                        기간 선택
                      </Button>
                    </div>

                    {dateFilter.type === "single" && (
                      <CalendarComponent
                        mode="single"
                        selected={dateFilter.startDate}
                        onSelect={(date) => setDateFilter({ type: "single", startDate: date })}
                        locale={ko}
                      />
                    )}

                    {dateFilter.type === "range" && (
                      <CalendarComponent
                        mode="range"
                        selected={{
                          from: dateFilter.startDate,
                          to: dateFilter.endDate,
                        }}
                        onSelect={(range) =>
                          setDateFilter({
                            type: "range",
                            startDate: range?.from,
                            endDate: range?.to,
                          })
                        }
                        locale={ko}
                      />
                    )}

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDateFilter({ type: "none" })}
                      className="w-full"
                    >
                      <X className="h-4 w-4 mr-2" />
                      날짜 필터 해제
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            {(searchTerm || typeFilter !== "all" || dateFilter.type !== "none") && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-gray-500 hover:text-gray-700">
                <RotateCcw className="h-4 w-4 mr-2" />
                필터 초기화
              </Button>
            )}
          </div>
        </div>

        {/* 일기 목록 */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {filteredEntries.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500">
                {searchTerm || typeFilter !== "all" || dateFilter.type !== "none"
                  ? "검색 조건에 맞는 일기가 없습니다."
                  : "아직 작성된 일기가 없습니다."}
              </p>
              <Link href="/home">
                <Button className="mt-4 rounded-full bg-gray-800 hover:bg-gray-700">일기 작성하러 가기</Button>
              </Link>
            </div>
          ) : (
            filteredEntries.map((entry, index) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-neumorphic p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleCardClick(entry)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center flex-1 min-w-0">
                    <span className="text-2xl mr-3 flex-shrink-0">{entry.emotion}</span>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-gray-800 text-lg truncate cursor-help" title={entry.title}>
                        {entry.title}
                      </h3>
                      <p className="text-sm text-gray-500">{getTypeLabel(entry.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-400 text-sm flex-shrink-0 ml-2">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDate(entry.date)}
                  </div>
                </div>

                <p
                  className="text-gray-600 line-clamp-2 cursor-help leading-relaxed"
                  title={entry.content}
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    wordBreak: "break-word",
                    hyphens: "auto",
                  }}
                >
                  {entry.content}
                </p>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>

      <BottomNavigation />

      <DiaryDetailModal
        entry={selectedEntry}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onUpdate={handleEntryUpdate}
      />
    </div>
  )
}
