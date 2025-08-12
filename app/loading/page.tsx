"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      router.push("/signup")
    }, 2000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] p-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
          }}
          className="mb-8"
        >
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full bg-yellow-100 opacity-30 blur-xl"></div>
            <div className="text-4xl flex items-center justify-center h-full">✨</div>
          </div>
        </motion.div>

        <h1 className="text-xl font-bold text-gray-800 mb-2">가입 중입니다...</h1>
        <p className="text-gray-500">잠시만 기다려주세요</p>

        <div className="mt-8">
          <motion.div
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1,
              ease: "linear",
            }}
            className="w-8 h-8 border-4 border-gray-300 border-t-gray-800 rounded-full mx-auto"
          ></motion.div>
        </div>
      </motion.div>
    </div>
  )
}
