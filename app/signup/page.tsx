"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { motion } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { useUserStore } from "@/lib/store"

export default function SignupPage() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [nickname, setNickname] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [gender, setGender] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!nickname) {
      alert("닉네임을 입력해주세요.")
      return
    }

    if (!gender) {
      alert("성별을 선택해주세요.")
      return
    }

    // Save user data to store
    setUser({
      nickname,
      birthdate,
      gender,
      email: "user@gmail.com", // This would come from the Google auth in a real app
    })

    router.push("/home")
  }

  const handleSkip = () => {
    // Set default values
    setUser({
      nickname: "사용자",
      birthdate: "",
      gender: "female", // Default gender
      email: "user@gmail.com",
    })

    router.push("/home")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8F9FA] to-[#FFFFFF] p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">프로필 설정</h1>
            <p className="text-gray-500 mt-2">다이어리를 시작하기 전에 간단한 정보를 입력해주세요</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-gray-700 font-medium">
                닉네임
              </Label>
              <Input
                id="nickname"
                placeholder="사용할 닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="rounded-xl py-6 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="birthdate" className="text-gray-700 font-medium">
                생년월일 (선택)
              </Label>
              <Input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                className="rounded-xl py-6 px-4 bg-[#F2F2F2] border-0 shadow-inner-neumorphic focus:shadow-inner-neumorphic-focus transition-all duration-300"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-700 font-medium">성별 선택</Label>
              <RadioGroup value={gender || ""} onValueChange={setGender} className="flex space-x-4">
                <div className="flex items-center space-x-2 bg-[#F2F2F2] rounded-xl p-4 shadow-neumorphic flex-1 cursor-pointer data-[state=checked]:shadow-neumorphic-pressed">
                  <RadioGroupItem
                    value="male"
                    id="male"
                    className="data-[state=checked]:border-gray-800 data-[state=checked]:text-gray-800"
                  />
                  <Label htmlFor="male" className="cursor-pointer">
                    남성
                  </Label>
                </div>
                <div className="flex items-center space-x-2 bg-[#F2F2F2] rounded-xl p-4 shadow-neumorphic flex-1 cursor-pointer data-[state=checked]:shadow-neumorphic-pressed">
                  <RadioGroupItem
                    value="female"
                    id="female"
                    className="data-[state=checked]:border-gray-800 data-[state=checked]:text-gray-800"
                  />
                  <Label htmlFor="female" className="cursor-pointer">
                    여성
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]"
            >
              다이어리 시작하기
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleSkip}
              className="w-full text-gray-500 hover:text-gray-700 rounded-full transition-all duration-300"
            >
              건너뛰기
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
