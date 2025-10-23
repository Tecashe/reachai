"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { X, CreditCard, CheckCircle, Loader2, Zap, Brain, Sparkles } from "lucide-react"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { stripePromise } from "@/lib/stripe-client"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CREDIT_PACKAGES, type CreditPackage } from "@/lib/constants"

type CreditPurchasePopupProps = {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

// List of countries
const COUNTRIES = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "IN", name: "India" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
].sort((a, b) => a.name.localeCompare(b.name))

// Card form component
const CardForm = ({
  onSubmit,
  onBack,
  isProcessing,
  setIsProcessing,
  pkg,
  creditType,
}: {
  onSubmit: (paymentData: { paymentMethodId: string; cardholderName: string; country: string }) => void
  onBack: () => void
  isProcessing: boolean
  setIsProcessing: (value: boolean) => void
  pkg: CreditPackage
  creditType: "email" | "research"
}) => {
  const stripe = useStripe()
  const elements = useElements()
  const [cardholderName, setCardholderName] = useState("")
  const [country, setCountry] = useState("")
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    if (!cardholderName.trim()) {
      setError("Please enter the cardholder name")
      return
    }

    if (!country) {
      setError("Please select your country")
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found")
      return
    }

    setError(null)
    setIsProcessing(true)

    try {
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: cardholderName,
          address: {
            country,
          },
        },
      })

      if (paymentMethodError) {
        throw new Error(paymentMethodError.message || "Failed to process your card")
      }

      if (!paymentMethod) {
        throw new Error("No payment method returned")
      }

      onSubmit({
        paymentMethodId: paymentMethod.id,
        cardholderName,
        country,
      })
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsProcessing(false)
      toast({
        title: "Payment failed",
        description: err.message || "An error occurred while processing your payment",
        variant: "destructive",
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-8"
    >
      <div className="text-center space-y-3">
        <p className="text-muted-foreground">
          You&apos;re purchasing <span className="text-foreground font-medium">{pkg.name}</span>
        </p>
        <div className="inline-flex items-center gap-1 px-3 py-1 bg-muted rounded-full">
          <span className="text-2xl font-bold">${pkg.price}</span>
          <span className="text-sm text-muted-foreground">for {pkg.credits.toLocaleString()} credits</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="cardholder-name" className="text-sm font-medium">
              Cardholder Name
            </label>
            <input
              id="cardholder-name"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              className="w-full h-12 px-4 bg-background border border-input rounded-xl placeholder-muted-foreground focus:border-ring focus:outline-none transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="country" className="text-sm font-medium">
              Country
            </label>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger id="country" className="w-full h-12 rounded-xl">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="card-element" className="text-sm font-medium">
              Card Details
            </label>
            <div className="p-4 bg-background border border-input rounded-xl">
              <CardElement
                id="card-element"
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "hsl(var(--foreground))",
                      fontFamily: "system-ui, sans-serif",
                      "::placeholder": {
                        color: "hsl(var(--muted-foreground))",
                      },
                    },
                    invalid: {
                      color: "hsl(var(--destructive))",
                    },
                  },
                  hidePostalCode: true,
                }}
              />
            </div>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-destructive/10 border border-destructive/50 rounded-xl text-sm text-destructive"
          >
            {error}
          </motion.div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            disabled={isProcessing}
            className="flex-1 h-12 rounded-xl bg-transparent"
          >
            Back
          </Button>
          <Button type="submit" disabled={isProcessing || !stripe || !elements} className="flex-1 h-12 rounded-xl">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Pay ${pkg.price}
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          🔒 Payments are secured by Stripe. Credits never expire.
        </p>
      </form>
    </motion.div>
  )
}

export function CreditPurchasePopup({ isOpen, onClose, onSuccess }: CreditPurchasePopupProps) {
  const [selectedPackage, setSelectedPackage] = useState<CreditPackage | null>(null)
  const [creditType, setCreditType] = useState<"email" | "research">("email")
  const [showCardForm, setShowCardForm] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const { toast } = useToast()

  const handlePackageSelect = (pkg: CreditPackage, type: "email" | "research") => {
    setSelectedPackage(pkg)
    setCreditType(type)
    setShowCardForm(true)
  }

  const handleSubmitPayment = async (paymentData: {
    paymentMethodId: string
    cardholderName: string
    country: string
  }) => {
    if (!selectedPackage) return

    try {
      const response = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          creditType,
          ...paymentData,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to process purchase")
      }

      setIsComplete(true)

      setTimeout(() => {
        onSuccess()
        handleReset()
        onClose()
      }, 2000)
    } catch (error: any) {
      toast({
        title: "Purchase failed",
        description: error.message || "An error occurred while processing your purchase",
        variant: "destructive",
        duration: 5000,
      })
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setShowCardForm(false)
    setSelectedPackage(null)
    setIsComplete(false)
    setIsProcessing(false)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-background border rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden"
          >
            <div className="p-8 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">
                  {isComplete ? "Purchase Complete!" : showCardForm ? "Payment" : "Purchase Credits"}
                </h2>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-10 w-10">
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {isComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-6"
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">Credits Added!</h3>
                    <p className="text-muted-foreground max-w-sm">
                      Your account has been credited with{" "}
                      <span className="text-foreground font-medium">{selectedPackage?.credits.toLocaleString()}</span>{" "}
                      {creditType} credits.
                    </p>
                  </div>
                </motion.div>
              ) : showCardForm ? (
                <Elements stripe={stripePromise}>
                  <CardForm
                    onSubmit={handleSubmitPayment}
                    onBack={handleReset}
                    isProcessing={isProcessing}
                    setIsProcessing={setIsProcessing}
                    pkg={selectedPackage!}
                    creditType={creditType}
                  />
                </Elements>
              ) : (
                <div className="space-y-6">
                  <Tabs
                    defaultValue="email"
                    className="w-full"
                    onValueChange={(v) => setCreditType(v as "email" | "research")}
                  >
                    <TabsList className="w-full grid grid-cols-2 mb-6">
                      <TabsTrigger value="email">
                        <Zap className="h-4 w-4 mr-2" />
                        Email Credits
                      </TabsTrigger>
                      <TabsTrigger value="research">
                        <Brain className="h-4 w-4 mr-2" />
                        Research Credits
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="email" className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {CREDIT_PACKAGES.email.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "relative p-6 border rounded-xl space-y-4 hover:border-primary/50 transition-colors cursor-pointer",
                              pkg.popular && "border-primary border-2",
                            )}
                            onClick={() => handlePackageSelect(pkg, "email")}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  Popular
                                </div>
                              </div>
                            )}
                            <div className="space-y-2">
                              <h3 className="font-semibold">{pkg.name}</h3>
                              <div className="text-3xl font-bold">${pkg.price}</div>
                              <div className="text-sm text-muted-foreground">
                                {pkg.credits.toLocaleString()} credits
                              </div>
                              {pkg.savings && (
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  Save {pkg.savings}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>${pkg.pricePerCredit.toFixed(3)}/email</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>Never expires</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="research" className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {CREDIT_PACKAGES.research.map((pkg) => (
                          <motion.div
                            key={pkg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={cn(
                              "relative p-6 border rounded-xl space-y-4 hover:border-primary/50 transition-colors cursor-pointer",
                              pkg.popular && "border-primary border-2",
                            )}
                            onClick={() => handlePackageSelect(pkg, "research")}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  Popular
                                </div>
                              </div>
                            )}
                            <div className="space-y-2">
                              <h3 className="font-semibold">{pkg.name}</h3>
                              <div className="text-3xl font-bold">${pkg.price}</div>
                              <div className="text-sm text-muted-foreground">
                                {pkg.credits.toLocaleString()} credits
                              </div>
                              {pkg.savings && (
                                <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                  Save {pkg.savings}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>${pkg.pricePerCredit.toFixed(2)}/research</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-primary" />
                                <span>AI-powered insights</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
