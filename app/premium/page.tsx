"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, Check } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function PremiumPage() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 rounded-full hover:bg-gray-100 transition-all duration-300"
        asChild
      >
        <Link href="/profile">
          <ChevronLeft className="h-5 w-5 mr-1" />
          뒤로
        </Link>
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <h1 className="text-2xl font-bold mb-2 text-gray-800">프리미엄으로 나만의 다이어리를 완성하세요</h1>
        <p className="text-gray-600">더 많은 기능으로 나만의 다이어리를 완성하세요</p>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
        <motion.div variants={item} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="bg-white rounded-3xl shadow-neumorphic p-6 relative overflow-hidden transition-all duration-300 hover:shadow-neumorphic-hover">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">월간 구독</h2>
              <p className="text-3xl font-bold mb-1">₩3,900</p>
              <p className="text-gray-500 text-sm mb-6">매월 자동 결제</p>
              <Button className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]">
                월간 구독하기
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-neumorphic p-6 relative overflow-hidden border-2 border-gray-800 transition-all duration-300 hover:shadow-neumorphic-hover">
            <div className="absolute top-0 right-0">
              <div className="bg-gray-800 text-white text-xs px-4 py-1 rounded-bl-lg font-medium">추천</div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">연간 구독</h2>
              <p className="text-3xl font-bold mb-1">₩39,000</p>
              <p className="text-gray-500 text-sm mb-6">연 1회 결제 (2개월 무료)</p>
              <Button className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]">
                연간 구독하기
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div variants={item} className="bg-white/80 backdrop-blur-md rounded-3xl shadow-neumorphic p-6">
          <h2 className="font-bold mb-4 text-gray-800">프리미엄 혜택</h2>
          <ul className="space-y-3">
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
        </motion.div>
      </motion.div>
    </div>
  )
}
