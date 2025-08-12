"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

const symptoms = [
  { id: "cramps", label: "복통" },
  { id: "headache", label: "두통" },
  { id: "backache", label: "허리 통증" },
  { id: "fatigue", label: "피로감" },
  { id: "bloating", label: "붓기" },
  { id: "mood", label: "기분 변화" },
]

const flowLevels = [
  { value: 1, label: "적음" },
  { value: 2, label: "보통" },
  { value: 3, label: "많음" },
  { value: 4, label: "매우 많음" },
]

export function PeriodSymptoms() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [flowLevel, setFlowLevel] = useState<number>(2)
  const [painLevel, setPainLevel] = useState<number[]>([3])

  const toggleSymptom = (id: string) => {
    if (selectedSymptoms.includes(id)) {
      setSelectedSymptoms(selectedSymptoms.filter((item) => item !== id))
    } else {
      setSelectedSymptoms([...selectedSymptoms, id])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">생리양</h3>
        <div className="flex space-x-2">
          {flowLevels.map((level) => (
            <motion.div key={level.value} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(
                  "w-full border-gray-200 rounded-xl shadow-neumorphic bg-white",
                  flowLevel === level.value && "border-gray-800 shadow-neumorphic-pressed",
                )}
                onClick={() => setFlowLevel(level.value)}
              >
                {level.label}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">통증 정도</h3>
        <Slider value={painLevel} min={1} max={10} step={1} onValueChange={setPainLevel} className="py-4" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>약함 (1)</span>
          <span>심함 (10)</span>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-800">증상</h3>
        <div className="grid grid-cols-2 gap-3">
          {symptoms.map((symptom) => (
            <div key={symptom.id} className="flex items-center space-x-3 bg-white rounded-xl p-3 shadow-neumorphic">
              <Checkbox
                id={symptom.id}
                checked={selectedSymptoms.includes(symptom.id)}
                onCheckedChange={() => toggleSymptom(symptom.id)}
                className="data-[state=checked]:bg-gray-800 data-[state=checked]:text-white h-5 w-5 rounded-md"
              />
              <Label htmlFor={symptom.id} className="text-gray-800 cursor-pointer">
                {symptom.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
