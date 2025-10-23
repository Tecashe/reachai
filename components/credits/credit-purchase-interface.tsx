"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CreditPurchasePopup } from "./credit-purchase-popup"
import { Zap } from "lucide-react"

interface CreditPurchaseInterfaceProps {
  userId: string
}

export function CreditPurchaseInterface({ userId }: CreditPurchaseInterfaceProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsPopupOpen(true)} size="lg" className="w-full">
        <Zap className="h-5 w-5 mr-2" />
        Purchase Credits
      </Button>

      <CreditPurchasePopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSuccess={() => {
          window.location.reload()
        }}
      />
    </>
  )
}
