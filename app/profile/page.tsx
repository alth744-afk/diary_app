"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { ChevronRight, LogOut, Moon, Palette, Bell, Mail, Shield, CreditCard, Lock, User } from "lucide-react"
import { BottomNavigation } from "@/components/bottom-navigation"
import { PremiumModal } from "@/components/premium-modal"
import { useUserStore } from "@/lib/store"

export default function ProfilePage() {
  const router = useRouter()
  const [showPremiumModal, setShowPremiumModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const { user, clearUser } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = () => {
    clearUser()
    router.push("/")
  }

  const handlePremiumFeature = () => {
    setShowPremiumModal(true)
  }

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

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-[#FAFAFA] pb-20">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">프로필</h1>
        </div>

        <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
          <motion.div variants={item} className="bg-white rounded-3xl shadow-neumorphic overflow-hidden">
            <div className="p-6 flex items-center space-x-4 border-b border-gray-100">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-gray-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{user?.nickname || "사용자"}</h2>
                <p className="text-sm text-gray-500">{user?.email || "user@example.com"}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {user?.gender === "female" ? "여성" : user?.gender === "male" ? "남성" : ""}
                  {user?.birthdate ? ` · ${user.birthdate}` : ""}
                </p>
              </div>
            </div>

            <div className="space-y-4 p-1">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-3 text-gray-500" />
                  <Label htmlFor="notifications" className="cursor-pointer text-gray-800">
                    매일 일기 알림 받기
                  </Label>
                </div>
                <Switch id="notifications" className="data-[state=checked]:bg-gray-800" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <Label htmlFor="marketing" className="cursor-pointer text-gray-800">
                    마케팅 정보 수신 동의
                  </Label>
                </div>
                <Switch id="marketing" className="data-[state=checked]:bg-gray-800" />
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="text-gray-800">내 이메일 보기</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="bg-white rounded-3xl shadow-neumorphic overflow-hidden">
            <div className="space-y-4 p-1">
              <div className="p-4 flex items-center justify-between" onClick={handlePremiumFeature}>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 mr-3 text-gray-500" />
                  <Label htmlFor="lock" className="cursor-pointer text-gray-800">
                    암호 잠금 설정
                  </Label>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full mr-2 flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    프리미엄
                  </span>
                  <Switch id="lock" disabled className="data-[state=checked]:bg-gray-800" />
                </div>
              </div>

              <div className="p-4 flex items-center justify-between cursor-pointer" onClick={handlePremiumFeature}>
                <div className="flex items-center">
                  <Palette className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="text-gray-800">다이어리 테마 컬러 변경</span>
                </div>
                <div className="flex items-center">
                  <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full flex items-center">
                    <Lock className="h-3 w-3 mr-1" />
                    프리미엄
                  </span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <Moon className="h-5 w-5 mr-3 text-gray-500" />
                  <Label htmlFor="darkMode" className="cursor-pointer text-gray-800">
                    다크모드 설정
                  </Label>
                </div>
                <Switch
                  id="darkMode"
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="data-[state=checked]:bg-gray-800"
                />
              </div>

              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => router.push("/premium")}
              >
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-3 text-gray-500" />
                  <span className="text-gray-800">프리미엄 구독 관리</span>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </motion.div>

          <motion.div variants={item}>
            <Button
              variant="outline"
              className="w-full py-6 border-gray-200 text-gray-700 rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300"
              onClick={handleLogout}
            >
              <LogOut className="h-5 w-5 mr-2" />
              로그아웃
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <BottomNavigation />

      {showPremiumModal && <PremiumModal onClose={() => setShowPremiumModal(false)} />}
    </div>
  )
}
