"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, User, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useUserStore } from "@/lib/store"
import { useEffect, useState } from "react"

export function BottomNavigation() {
  const pathname = usePathname()
  const { user } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-white border-t border-gray-100 flex items-center justify-around px-6 shadow-neumorphic-top">
      <Link
        href="/home"
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          pathname.includes("/home") ? "text-gray-800" : "text-gray-400",
        )}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
          <Home className="h-6 w-6" />
          <span className="text-xs mt-1 font-medium">홈</span>
        </motion.div>
      </Link>

      <Link
        href="/my-diaries"
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          pathname.includes("/my-diaries") ? "text-gray-800" : "text-gray-400",
        )}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
          <BookOpen className="h-6 w-6" />
          <span className="text-xs mt-1 font-medium">내 일기</span>
        </motion.div>
      </Link>

      <Link
        href="/profile"
        className={cn(
          "flex flex-col items-center justify-center w-full h-full",
          pathname.includes("/profile") ? "text-gray-800" : "text-gray-400",
        )}
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} className="flex flex-col items-center">
          <User className="h-6 w-6" />
          <span className="text-xs mt-1 font-medium">프로필</span>
        </motion.div>
      </Link>
    </div>
  )
}
