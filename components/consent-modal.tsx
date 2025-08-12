"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { motion } from "framer-motion"

interface ConsentModalProps {
  content: string
  onClose: () => void
}

export function ConsentModal({ content, onClose }: ConsentModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-white rounded-3xl shadow-neumorphic p-6 w-full max-w-md max-h-[80vh] overflow-y-auto relative"
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

        <div className="pt-2 pb-4" dangerouslySetInnerHTML={{ __html: content }} />

        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <Button
            onClick={onClose}
            className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300"
          >
            확인
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}
