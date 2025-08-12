"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DiaryCardProps {
  title: string
  description: string
  href: string
  emoji: string
  color?: string
}

export function DiaryCard({ title, description, href, emoji, color = "bg-gray-50" }: DiaryCardProps) {
  return (
    <Link href={href} className="min-w-[220px] block">
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className={cn("rounded-3xl shadow-neumorphic p-5 transition-all duration-300", color)}
      >
        <div className="text-3xl mb-3">{emoji}</div>
        <h3 className="font-bold mb-2 text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </motion.div>
    </Link>
  )
}
