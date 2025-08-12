"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Edit3, Save, X, Calendar, Tag, Heart, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

interface DiaryEntry {
  id: string
  title: string
  content: string
  type: string
  date: string
  emotion: string
  lastModified?: string
}

interface DiaryDetailModalProps {
  entry: DiaryEntry | null
  isOpen: boolean
  onClose: () => void
  onUpdate: (updatedEntry: DiaryEntry) => void
  onDelete?: (entryId: string) => void
}

const emotionOptions = [
  { value: "😊", label: "😊 기쁨" },
  { value: "😢", label: "😢 슬픔" },
  { value: "😠", label: "😠 화남" },
  { value: "😰", label: "😰 불안" },
  { value: "😴", label: "😴 피곤" },
  { value: "🤔", label: "🤔 생각" },
  { value: "❤️", label: "❤️ 사랑" },
  { value: "😌", label: "😌 평온" },
]

const typeOptions = [
  { value: "daily", label: "하루 일기" },
  { value: "emotion", label: "감정 일기" },
  { value: "gratitude", label: "감사 일기" },
  { value: "period", label: "생리 일기" },
  { value: "schedule", label: "일정 관리" },
]

export function DiaryDetailModal({ entry, isOpen, onClose, onUpdate, onDelete }: DiaryDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEntry, setEditedEntry] = useState<DiaryEntry | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (entry) {
      setEditedEntry({ ...entry })
      setIsEditing(false)
      setShowDeleteConfirm(false)
    }
  }, [entry])

  const handleSave = async () => {
    if (!editedEntry) return

    setIsSaving(true)
    try {
      // Simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedEntry = {
        ...editedEntry,
        lastModified: new Date().toISOString(),
      }

      // Update localStorage
      const entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
      const updatedEntries = entries.map((e: DiaryEntry) => (e.id === updatedEntry.id ? updatedEntry : e))
      localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries))

      onUpdate(updatedEntry)
      setIsEditing(false)

      toast({
        title: "저장 완료",
        description: "일기가 성공적으로 수정되었습니다.",
      })
    } catch (error) {
      toast({
        title: "저장 실패",
        description: "일기 저장 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!entry) return

    setIsDeleting(true)
    try {
      // Simulate delete delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove from localStorage
      const entries = JSON.parse(localStorage.getItem("diaryEntries") || "[]")
      const updatedEntries = entries.filter((e: DiaryEntry) => e.id !== entry.id)
      localStorage.setItem("diaryEntries", JSON.stringify(updatedEntries))

      onDelete?.(entry.id)
      onClose()

      toast({
        title: "삭제 완료",
        description: "일기가 성공적으로 삭제되었습니다.",
      })
    } catch (error) {
      toast({
        title: "삭제 실패",
        description: "일기 삭제 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  const handleCancel = () => {
    if (entry) {
      setEditedEntry({ ...entry })
    }
    setIsEditing(false)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return format(date, "yyyy년 MM월 dd일 (EEE)", { locale: ko })
  }

  const getTypeLabel = (type: string) => {
    return typeOptions.find((option) => option.value === type)?.label || type
  }

  if (!entry || !editedEntry) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-neumorphic border-0">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-800">
              {isEditing ? "일기 편집" : "일기 상세보기"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="rounded-full">
                    <Edit3 className="h-4 w-4 mr-2" />
                    편집
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="rounded-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    삭제
                  </Button>
                </>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    className="rounded-full bg-transparent"
                    disabled={isSaving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    취소
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="rounded-full bg-blue-600 hover:bg-blue-700"
                    disabled={isSaving}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? "저장 중..." : "저장"}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Entry metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {formatDate(entry.date)}
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-4 w-4" />
              {getTypeLabel(entry.type)}
            </div>
            {entry.lastModified && (
              <div className="flex items-center gap-1">
                <Edit3 className="h-4 w-4" />
                수정: {format(new Date(entry.lastModified), "MM.dd HH:mm", { locale: ko })}
              </div>
            )}
          </div>
        </DialogHeader>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 mt-6">
          {/* Emotion */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Heart className="h-4 w-4" />
              감정
            </label>
            {isEditing ? (
              <Select
                value={editedEntry.emotion}
                onValueChange={(value) => setEditedEntry({ ...editedEntry, emotion: value })}
              >
                <SelectTrigger className="rounded-2xl bg-gray-50 border-0 shadow-neumorphic-inset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {emotionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-2xl">
                <span className="text-2xl">{entry.emotion}</span>
                <span className="text-gray-700">
                  {emotionOptions.find((opt) => opt.value === entry.emotion)?.label.split(" ")[1] || ""}
                </span>
              </div>
            )}
          </div>

          {/* Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <Tag className="h-4 w-4" />
              유형
            </label>
            {isEditing ? (
              <Select
                value={editedEntry.type}
                onValueChange={(value) => setEditedEntry({ ...editedEntry, type: value })}
              >
                <SelectTrigger className="rounded-2xl bg-gray-50 border-0 shadow-neumorphic-inset">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="p-3 bg-gray-50 rounded-2xl">
                <span className="text-gray-700">{getTypeLabel(entry.type)}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">제목</label>
            {isEditing ? (
              <Input
                value={editedEntry.title}
                onChange={(e) => setEditedEntry({ ...editedEntry, title: e.target.value })}
                className="rounded-2xl bg-gray-50 border-0 shadow-neumorphic-inset"
                placeholder="제목을 입력하세요"
              />
            ) : (
              <div className="p-3 bg-gray-50 rounded-2xl">
                <h2 className="text-lg font-semibold text-gray-800">{entry.title}</h2>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">내용</label>
            {isEditing ? (
              <Textarea
                value={editedEntry.content}
                onChange={(e) => setEditedEntry({ ...editedEntry, content: e.target.value })}
                className="rounded-2xl bg-gray-50 border-0 shadow-neumorphic-inset min-h-[200px] resize-none"
                placeholder="내용을 입력하세요"
              />
            ) : (
              <div className="p-4 bg-gray-50 rounded-2xl min-h-[200px]">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{entry.content}</p>
              </div>
            )}
          </div>
        </motion.div>

        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[60]"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-neumorphic p-6 w-full max-w-sm relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">일기 삭제</h3>
                <p className="text-gray-600">
                  이 일기를 삭제하시겠습니까?
                  <br />
                  삭제된 일기는 복구할 수 없습니다.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 rounded-full bg-transparent"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  취소
                </Button>
                <Button
                  className="flex-1 rounded-full bg-red-600 hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "삭제 중..." : "삭제"}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
