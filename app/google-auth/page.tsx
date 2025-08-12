"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export default function GoogleAuthPage() {
  const router = useRouter()
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null)

  const googleAccounts = [
    {
      email: "user@gmail.com",
      name: "사용자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      email: "another.user@gmail.com",
      name: "다른 사용자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  const handleAccountSelect = (email: string) => {
    setSelectedAccount(email)
    setTimeout(() => {
      router.push("/loading")
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] p-6">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6 rounded-full hover:bg-gray-100 transition-all duration-300"
        onClick={() => router.back()}
      >
        <ChevronLeft className="h-5 w-5 mr-1" />
        뒤로
      </Button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Google 계정 선택</h1>
          <p className="text-gray-500 mt-2">계속하려면 Google 계정을 선택하세요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-neumorphic p-4 mb-6">
          <div className="space-y-2">
            {googleAccounts.map((account) => (
              <motion.div
                key={account.email}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="p-3 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => handleAccountSelect(account.email)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={account.avatar || "/placeholder.svg"}
                    alt={account.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-800">{account.name}</p>
                    <p className="text-sm text-gray-500">{account.email}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-center">
            <Button variant="ghost" className="text-gray-600 text-sm">
              다른 계정으로 로그인
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
