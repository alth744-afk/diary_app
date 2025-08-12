"use client"

import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

interface PremiumModalProps {
  onClose: () => void
}

export function PremiumModal({ onClose }: PremiumModalProps) {
  const router = useRouter()

  const handlePremiumClick = () => {
    onClose()
    router.push("/premium")
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-[100]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-neumorphic p-6 w-full max-w-md relative"
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
          <h2 className="text-xl font-bold text-gray-800 mb-2">이 기능은 프리미엄 전용입니다</h2>
          <p className="text-gray-600">프리미엄 구독으로 더 많은 기능을 이용해보세요</p>
        </div>

        <ul className="space-y-3 mb-6">
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-gray-800" />
            </div>
            <span className="text-gray-700">테마 컬러 커스터마이징</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-gray-800" />
            </div>
            <span className="text-gray-700">감정 기반 자동 다크모드</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-gray-800" />
            </div>
            <span className="text-gray-700">암호 잠금</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-gray-800" />
            </div>
            <span className="text-gray-700">감정 통계 리포트</span>
          </li>
          <li className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center mr-3">
              <Check className="h-4 w-4 text-gray-800" />
            </div>
            <span className="text-gray-700">광고 제거</span>
          </li>
        </ul>

        <div className="flex flex-col gap-3">
          <Button
            className="py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]"
            onClick={handlePremiumClick}
          >
            프리미엄 구독 시작하기
          </Button>
          <Button variant="ghost" onClick={onClose} className="rounded-full">
            나중에 하기
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
