"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { ChevronLeft } from "lucide-react"
import { ConsentModal } from "@/components/consent-modal"

const consentItems = [
  {
    id: "terms",
    label: "[필수] 이용약관 동의",
    required: true,
    content: `
      <h2>이용약관</h2>
      <p>본 약관은 다이어리 앱 서비스 이용에 관한 조건 및 절차, 회사와 회원 간의 권리, 의무 및 책임, 기타 필요한 사항을 규정합니다.</p>
      <h3>제1조 (목적)</h3>
      <p>본 약관은 회사가 제공하는 다이어리 앱 서비스의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>
      <h3>제2조 (정의)</h3>
      <p>"서비스"란 회사가 제공하는 다이어리 앱 서비스를 의미합니다.</p>
      <p>"회원"이란 본 약관에 동의하고 서비스를 이용하는 자를 의미합니다.</p>
      <h3>제3조 (약관의 효력 및 변경)</h3>
      <p>회사는 필요한 경우 약관을 변경할 수 있으며, 변경된 약관은 서비스 내 공지사항을 통해 공지합니다.</p>
    `,
  },
  {
    id: "privacy",
    label: "[필수] 개인정보 수집 및 이용 동의",
    required: true,
    content: `
      <h2>개인정보 수집 및 이용 동의</h2>
      <p>회사는 다음과 같이 개인정보를 수집 및 이용합니다.</p>
      <h3>1. 수집하는 개인정보 항목</h3>
      <p>- 필수항목: 이메일 주소, 닉네임, 생년월일, 성별</p>
      <p>- 선택항목: 프로필 사진</p>
      <h3>2. 개인정보의 수집 및 이용목적</h3>
      <p>- 서비스 제공 및 계정 관리</p>
      <p>- 서비스 개선 및 맞춤형 서비스 제공</p>
      <h3>3. 개인정보의 보유 및 이용기간</h3>
      <p>회원 탈퇴 시까지 또는 법령에 따른 보존기간까지</p>
    `,
  },
  {
    id: "thirdParty",
    label: "[필수] 개인정보 제3자 제공 동의",
    required: true,
    content: `
      <h2>개인정보 제3자 제공 동의</h2>
      <p>회사는 다음과 같이 개인정보를 제3자에게 제공합니다.</p>
      <h3>1. 제공받는 자</h3>
      <p>- 결제 서비스 제공업체</p>
      <p>- 서비스 운영 및 유지보수 업체</p>
      <h3>2. 제공하는 개인정보 항목</h3>
      <p>- 이메일 주소, 결제 정보</p>
      <h3>3. 제공받는 자의 이용목적</h3>
      <p>- 결제 서비스 제공</p>
      <p>- 서비스 운영 및 유지보수</p>
      <h3>4. 보유 및 이용기간</h3>
      <p>회원 탈퇴 시까지 또는 법령에 따른 보존기간까지</p>
    `,
  },
  {
    id: "location",
    label: "[필수] 위치기반서비스 이용 동의",
    required: true,
    content: `
      <h2>위치기반서비스 이용 동의</h2>
      <p>회사는 다음과 같이 위치정보를 수집 및 이용합니다.</p>
      <h3>1. 위치정보 수집 방법</h3>
      <p>- 모바일 기기의 GPS, 와이파이, 블루투스 등을 통해 수집</p>
      <h3>2. 위치정보 이용 목적</h3>
      <p>- 위치 기반 다이어리 작성 기능 제공</p>
      <p>- 위치 기반 알림 서비스 제공</p>
      <h3>3. 위치정보 보유 기간</h3>
      <p>회원 탈퇴 시까지 또는 법령에 따른 보존기간까지</p>
    `,
  },
  {
    id: "marketing",
    label: "[선택] 마케팅 수신 동의",
    required: false,
    content: `
      <h2>마케팅 수신 동의</h2>
      <p>회사는 다음과 같이 마케팅 정보를 제공합니다.</p>
      <h3>1. 마케팅 정보 제공 방법</h3>
      <p>- 이메일, 앱 내 알림, SMS 등</p>
      <h3>2. 마케팅 정보 내용</h3>
      <p>- 서비스 업데이트 및 이벤트 안내</p>
      <p>- 맞춤형 혜택 및 프로모션 정보</p>
      <h3>3. 마케팅 정보 수신 거부</h3>
      <p>마케팅 정보 수신은 언제든지 설정 메뉴에서 변경할 수 있습니다.</p>
    `,
  },
]

export default function ConsentPage() {
  const router = useRouter()
  const [consents, setConsents] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    thirdParty: false,
    location: false,
    marketing: false,
  })
  const [allConsent, setAllConsent] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [currentContent, setCurrentContent] = useState("")
  const [currentItemId, setCurrentItemId] = useState<string | null>(null)

  const handleAllConsent = (checked: boolean) => {
    setAllConsent(checked)
    const newConsents = { ...consents }
    Object.keys(newConsents).forEach((key) => {
      newConsents[key] = checked
    })
    setConsents(newConsents)
  }

  const handleSingleConsent = (id: string, checked: boolean) => {
    const newConsents = { ...consents, [id]: checked }
    setConsents(newConsents)

    // Check if all required consents are checked
    const allChecked = Object.entries(newConsents).every(([key, value]) => {
      const item = consentItems.find((item) => item.id === key)
      return !item?.required || value
    })

    setAllConsent(allChecked)
  }

  const openModal = (id: string, content: string) => {
    setCurrentItemId(id)
    setCurrentContent(content)
    setModalOpen(true)
  }

  const handleModalConfirm = () => {
    if (currentItemId) {
      handleSingleConsent(currentItemId, true)
    }
    setModalOpen(false)
    setCurrentItemId(null)
  }

  const handleContinue = () => {
    // Check if all required consents are checked
    const requiredConsentsChecked = consentItems.filter((item) => item.required).every((item) => consents[item.id])

    if (requiredConsentsChecked) {
      router.push("/google-auth")
    } else {
      alert("필수 항목에 모두 동의해주세요.")
    }
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
          <h1 className="text-2xl font-bold text-gray-800">약관 동의</h1>
          <p className="text-gray-500 mt-2">서비스 이용을 위해 약관에 동의해주세요</p>
        </div>

        <div className="bg-white rounded-3xl shadow-neumorphic p-6 mb-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-100">
            <Checkbox
              id="all-consent"
              checked={allConsent}
              onCheckedChange={(checked) => handleAllConsent(checked as boolean)}
              className="h-5 w-5 rounded-md data-[state=checked]:bg-gray-800"
            />
            <Label htmlFor="all-consent" className="text-lg font-bold cursor-pointer">
              전체 동의
            </Label>
          </div>

          <div className="space-y-4 mt-4">
            {consentItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={item.id}
                    checked={consents[item.id]}
                    onCheckedChange={(checked) => handleSingleConsent(item.id, checked as boolean)}
                    className="h-5 w-5 rounded-md data-[state=checked]:bg-gray-800"
                  />
                  <Label htmlFor={item.id} className="cursor-pointer">
                    {item.label}
                  </Label>
                </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-500 text-xs"
                    onClick={() => openModal(item.id, item.content)}
                  >
                    보기
                  </Button>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleContinue}
          className="w-full py-6 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-neumorphic hover:shadow-neumorphic-pressed transition-all duration-300 hover:scale-[0.98] active:scale-[0.96]"
        >
          동의하고 계속하기
        </Button>
      </motion.div>

      {modalOpen && (
        <ConsentModal
          content={currentContent}
          onClose={() => setModalOpen(false)}
          onConfirm={handleModalConfirm}
        />
      )}
    </div>
  )
}
