"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const emotions = [
  { emoji: "😊", name: "행복" },
  { emoji: "😔", name: "슬픔" },
  { emoji: "😡", name: "화남" },
  { emoji: "😌", name: "편안" },
  { emoji: "🥰", name: "사랑" },
  { emoji: "😰", name: "불안" },
  { emoji: "😴", name: "피곤" },
  { emoji: "🤔", name: "고민" },
]

export function EmotionSelector() {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-800">오늘의 감정을 선택해주세요</h3>
      <div className="grid grid-cols-4 gap-3">
        {emotions.map((emotion) => (
          <motion.div key={emotion.name} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "h-20 w-full flex flex-col items-center justify-center border-gray-200 rounded-2xl shadow-neumorphic bg-white",
                selectedEmotion === emotion.name && "border-gray-800 shadow-neumorphic-pressed",
              )}
              onClick={() => setSelectedEmotion(emotion.name)}
            >
              <span className="text-3xl mb-2">{emotion.emoji}</span>
              <span className="text-xs font-medium">{emotion.name}</span>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
