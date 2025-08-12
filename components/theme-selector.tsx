"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Palette, RotateCcw, Check, Lock } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useThemeStore, themePresets, type ThemeColors } from "@/lib/theme-store"
import { useRouter } from "next/navigation"

interface ThemeSelectorProps {
  isOpen: boolean
  onClose: () => void
}

const presetNames = {
  default: "기본",
  purple: "보라",
  pink: "핑크",
  green: "그린",
  blue: "블루",
  orange: "오렌지",
}

const freeThemes = ["default", "purple"]

export function ThemeSelector({ isOpen, onClose }: ThemeSelectorProps) {
  const { currentTheme, customColors, setTheme, setCustomColors, resetTheme } = useThemeStore()
  const [tempColors, setTempColors] = useState<ThemeColors>(customColors)
  const [activeTab, setActiveTab] = useState<"presets" | "custom">("presets")
  const router = useRouter()

  const handlePresetSelect = (presetName: string) => {
    if (!freeThemes.includes(presetName)) {
      onClose()
      router.push("/premium")
      return
    }
    setTheme(presetName)
  }

  const handleCustomColorChange = (colorKey: keyof ThemeColors, value: string) => {
    const newColors = { ...tempColors, [colorKey]: value }
    setTempColors(newColors)
    setCustomColors(newColors)
  }

  const handleReset = () => {
    resetTheme()
    setTempColors(themePresets.default)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-3xl bg-white shadow-neumorphic border-0">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Palette className="h-5 w-5" />
            테마 컬러 변경
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Tab Navigation */}
          <div className="flex bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => setActiveTab("presets")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "presets"
                  ? "bg-white shadow-neumorphic text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              프리셋
            </button>
            <button
              onClick={() => setActiveTab("custom")}
              className={`flex-1 py-2 px-4 rounded-xl text-sm font-medium transition-all ${
                activeTab === "custom"
                  ? "bg-white shadow-neumorphic text-gray-800"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              커스텀
            </button>
          </div>

          {/* Preset Colors */}
          {activeTab === "presets" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(themePresets).map(([key, colors]) => {
                  const isFree = freeThemes.includes(key)
                  const isSelected = currentTheme === key

                  return (
                    <motion.button
                      key={key}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePresetSelect(key)}
                      className={`relative p-4 rounded-2xl border-2 transition-all ${
                        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
                      } ${!isFree ? "opacity-75" : ""}`}
                    >
                      {!isFree && (
                        <div className="absolute top-2 right-2">
                          <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-800">
                          {presetNames[key as keyof typeof presetNames]}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-blue-500" />}
                      </div>
                      <div className="flex gap-1">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: colors.primary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: colors.secondary }}
                        />
                        <div
                          className="w-6 h-6 rounded-full border border-gray-200"
                          style={{ backgroundColor: colors.accent }}
                        />
                      </div>
                      {!isFree && <div className="mt-2 text-xs text-gray-500">프리미엄</div>}
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Custom Colors */}
          {activeTab === "custom" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">주요 색상</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={tempColors.primary}
                      onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl border-0 shadow-neumorphic-inset"
                    />
                    <Input
                      type="text"
                      value={tempColors.primary}
                      onChange={(e) => handleCustomColorChange("primary", e.target.value)}
                      className="flex-1 rounded-xl bg-gray-50 border-0 shadow-neumorphic-inset"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">보조 색상</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={tempColors.secondary}
                      onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl border-0 shadow-neumorphic-inset"
                    />
                    <Input
                      type="text"
                      value={tempColors.secondary}
                      onChange={(e) => handleCustomColorChange("secondary", e.target.value)}
                      className="flex-1 rounded-xl bg-gray-50 border-0 shadow-neumorphic-inset"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">강조 색상</Label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="color"
                      value={tempColors.accent}
                      onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                      className="w-12 h-12 p-1 rounded-xl border-0 shadow-neumorphic-inset"
                    />
                    <Input
                      type="text"
                      value={tempColors.accent}
                      onChange={(e) => handleCustomColorChange("accent", e.target.value)}
                      className="flex-1 rounded-xl bg-gray-50 border-0 shadow-neumorphic-inset"
                    />
                  </div>
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 rounded-2xl bg-gray-50">
                <p className="text-sm font-medium text-gray-700 mb-3">미리보기</p>
                <div className="space-y-2">
                  <div
                    className="h-8 rounded-lg flex items-center px-3 text-white text-sm font-medium"
                    style={{ backgroundColor: tempColors.primary }}
                  >
                    주요 색상
                  </div>
                  <div
                    className="h-8 rounded-lg flex items-center px-3 text-white text-sm font-medium"
                    style={{ backgroundColor: tempColors.accent }}
                  >
                    강조 색상
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={handleReset} className="flex-1 rounded-2xl bg-transparent">
              <RotateCcw className="h-4 w-4 mr-2" />
              초기화
            </Button>
            <Button onClick={onClose} className="flex-1 rounded-2xl bg-gray-800 hover:bg-gray-700">
              완료
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
