// "use client"

// import { useEffect, useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Zap, TrendingDown, TrendingUp, Gift } from "lucide-react"
// import { formatDistanceToNow } from "date-fns"

// interface CreditTransaction {
//   id: string
//   type: string
//   amount: number
//   balance: number
//   description: string
//   createdAt: string
// }

// interface CreditUsageHistoryProps {
//   userId: string
// }

// export function CreditUsageHistory({ userId }: CreditUsageHistoryProps) {
//   const [transactions, setTransactions] = useState<CreditTransaction[]>([])
//   const [loading, setLoading] = useState(true)

//   useEffect(() => {
//     const fetchTransactions = async () => {
//       try {
//         const response = await fetch("/api/credits/transactions")
//         const data = await response.json()
//         setTransactions(data.transactions || [])
//       } catch (error) {
//         console.error("Failed to fetch transactions:", error)
//       } finally {
//         setLoading(false)
//       }
//     }
//     fetchTransactions()
//   }, [])

//   const getIcon = (type: string) => {
//     switch (type) {
//       case "PURCHASE":
//         return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
//       case "DEDUCTION":
//         return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
//       case "BONUS":
//         return <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
//       default:
//         return <Zap className="h-4 w-4" />
//     }
//   }

//   const getTypeLabel = (type: string) => {
//     switch (type) {
//       case "PURCHASE":
//         return "Purchase"
//       case "DEDUCTION":
//         return "Used"
//       case "BONUS":
//         return "Bonus"
//       case "REFUND":
//         return "Refund"
//       case "SUBSCRIPTION":
//         return "Subscription"
//       default:
//         return type
//     }
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle>Usage History</CardTitle>
//           <CardDescription>Loading your credit transactions...</CardDescription>
//         </CardHeader>
//       </Card>
//     )
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Usage History</CardTitle>
//         <CardDescription>Your recent credit transactions and usage</CardDescription>
//       </CardHeader>
//       <CardContent>
//         {transactions.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             <p>No transactions yet</p>
//             <p className="text-sm mt-1">Your credit usage will appear here</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {transactions.slice(0, 10).map((transaction) => (
//               <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
//                 <div className="flex items-center gap-3">
//                   {getIcon(transaction.type)}
//                   <div>
//                     <p className="text-sm font-medium">{transaction.description}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
//                     </p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <p
//                     className={`text-sm font-semibold ${
//                       transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
//                     }`}
//                   >
//                     {transaction.amount > 0 ? "+" : ""}
//                     {transaction.amount}
//                   </p>
//                   <p className="text-xs text-muted-foreground">Balance: {transaction.balance}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, TrendingDown, TrendingUp, Gift, RefreshCw } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface CreditTransaction {
  id: string
  type: string
  creditType: string
  amount: number
  balance: number
  description: string
  entityType?: string
  entityId?: string
  createdAt: string
}

interface CreditUsageHistoryProps {
  userId: string
}

export function CreditUsageHistory({ userId }: CreditUsageHistoryProps) {
  const [transactions, setTransactions] = useState<CreditTransaction[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch("/api/credits/transactions")
        const data = await response.json()
        setTransactions(data.transactions || [])
      } catch (error) {
        console.error("Failed to fetch transactions:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
      case "DEDUCTION":
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />
      case "BONUS":
        return <Gift className="h-4 w-4 text-purple-600 dark:text-purple-400" />
      case "REFUND":
        return <RefreshCw className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default:
        return <Zap className="h-4 w-4" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "PURCHASE":
        return "Purchase"
      case "DEDUCTION":
        return "Used"
      case "BONUS":
        return "Bonus"
      case "REFUND":
        return "Refund"
      case "SUBSCRIPTION":
        return "Subscription"
      default:
        return type
    }
  }

  const getCreditTypeBadge = (creditType: string) => {
    const variant = creditType === "EMAIL" ? "default" : "secondary"
    return (
      <Badge variant={variant} className="text-xs">
        {creditType}
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Usage History</CardTitle>
          <CardDescription>Loading your credit transactions...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage History</CardTitle>
        <CardDescription>Your recent credit transactions and usage</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No transactions yet</p>
            <p className="text-sm mt-1">Your credit usage will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {getIcon(transaction.type)}
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{transaction.description}</p>
                      {getCreditTypeBadge(transaction.creditType)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(transaction.createdAt), { addSuffix: true })}
                    </p>
                    {transaction.entityType && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {transaction.entityType}: {transaction.entityId?.slice(0, 8)}...
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      transaction.amount > 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {transaction.amount > 0 ? "+" : ""}
                    {transaction.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">Balance: {transaction.balance}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
