"use client"

import { useRouter } from "next/navigation"
import { X } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

interface PremiumModalNewProps {
  onClose: () => void
}

export function PremiumModalNew({ onClose }: PremiumModalNewProps) {
  const router = useRouter()

  const handlePremiumStart = () => {
    onClose()
    router.push("/premium")
  }

  const handleLater = () => {
    onClose()
  }

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative"
      >
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">이 기능은 프리미엄 전용입니다</h2>
          <p className="text-gray-600 text-sm">더 많은 테마와 고급 기능을 사용하려면 프리미엄을 구독해보세요.</p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handlePremiumStart}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-2xl py-3 font-medium"
          >
            프리미엄 구독 시작하기
          </Button>
          <Button
            onClick={handleLater}
            variant="outline"
            className="w-full rounded-2xl py-3 font-medium border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
          >
            나중에 하기
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
