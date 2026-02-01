// "use client"

// import { useState } from "react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import { Check, ExternalLink, Settings, Trash2 } from "lucide-react"
// import { IntegrationDialog } from "./integration-dialog"
// import { disconnectIntegration } from "@/lib/actions/integrations"
// import { useToast } from "@/hooks/use-toast"

// interface IntegrationCardProps {
//   integration: {
//     type: string
//     name: string
//     description: string
//     category: string
//     icon: string
//     features: string[]
//   }
//   isConnected: boolean
//   connectedIntegration?: any
// }

// export function IntegrationCard({ integration, isConnected, connectedIntegration }: IntegrationCardProps) {
//   const [showDialog, setShowDialog] = useState(false)
//   const [isDisconnecting, setIsDisconnecting] = useState(false)
//   const { toast } = useToast()

//   const handleDisconnect = async () => {
//     if (!connectedIntegration) return

//     setIsDisconnecting(true)
//     try {
//       await disconnectIntegration(connectedIntegration.id)
//       toast({
//         title: "Integration disconnected",
//         description: `${integration.name} has been disconnected successfully.`,
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to disconnect integration. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDisconnecting(false)
//     }
//   }

//   return (
//     <>
//       <Card className={isConnected ? "border-primary" : ""}>
//         <CardHeader>
//           <div className="flex items-start justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-2xl">
//                 {integration.icon}
//               </div>
//               <div>
//                 <CardTitle className="text-lg">{integration.name}</CardTitle>
//                 <Badge variant="secondary" className="text-xs mt-1">
//                   {integration.category}
//                 </Badge>
//               </div>
//             </div>
//             {isConnected && (
//               <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
//                 <Check className="h-4 w-4 text-white" />
//               </div>
//             )}
//           </div>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <CardDescription>{integration.description}</CardDescription>

//           {/* Features */}
//           <ul className="space-y-1">
//             {integration.features.map((feature, index) => (
//               <li key={index} className="flex items-center gap-2 text-xs text-muted-foreground">
//                 <Check className="h-3 w-3 text-primary" />
//                 {feature}
//               </li>
//             ))}
//           </ul>

//           {/* Actions */}
//           <div className="flex gap-2">
//             {isConnected ? (
//               <>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   className="flex-1 bg-transparent"
//                   onClick={() => setShowDialog(true)}
//                 >
//                   <Settings className="h-4 w-4 mr-2" />
//                   Manage
//                 </Button>
//                 <Button variant="destructive" size="sm" onClick={handleDisconnect} disabled={isDisconnecting}>
//                   <Trash2 className="h-4 w-4" />
//                 </Button>
//               </>
//             ) : (
//               <Button className="w-full" size="sm" onClick={() => setShowDialog(true)}>
//                 Connect
//                 <ExternalLink className="h-4 w-4 ml-2" />
//               </Button>
//             )}
//           </div>

//           {isConnected && connectedIntegration?.lastSyncedAt && (
//             <p className="text-xs text-muted-foreground">
//               Last synced: {new Date(connectedIntegration.lastSyncedAt).toLocaleDateString()}
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       <IntegrationDialog
//         integration={integration}
//         isConnected={isConnected}
//         open={showDialog}
//         onOpenChange={setShowDialog}
//       />
//     </>
//   )
// }


'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Loader2, Trash2, CheckCircle2 } from 'lucide-react'
import { getProviderIcon } from './provider-icons'

interface IntegrationCardProps {
  provider: string
  providerName: string
  isConnected?: boolean
  onConnect: (provider: string) => void
  onDisconnect: (provider: string) => void
  isLoading?: boolean
}

export function IntegrationCard({
  provider,
  providerName,
  isConnected = false,
  onConnect,
  onDisconnect,
  isLoading = false,
}: IntegrationCardProps) {
  const [isDisconnecting, setIsDisconnecting] = useState(false)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)

  const handleDisconnect = async () => {
    setIsDisconnecting(true)
    try {
      onDisconnect(provider)
      setShowDisconnectDialog(false)
    } catch (error) {
      console.error('[v0] Error disconnecting:', error)
    } finally {
      setIsDisconnecting(false)
    }
  }

  return (
    <>
      <div className='border border-border p-5 flex flex-col gap-4'>
        {/* Header */}
        <div className='flex items-center justify-between gap-3'>
          <div className='flex items-center gap-3 flex-1 min-w-0'>
            <div className='flex-shrink-0 w-8 h-8 flex items-center justify-center text-foreground'>
              {getProviderIcon(provider)}
            </div>
            <div className='flex-1 min-w-0'>
              <h3 className='font-medium text-foreground text-sm'>{providerName}</h3>
              <p className='text-xs text-muted-foreground mt-0.5'>
                {isConnected ? 'Connected' : 'Not connected'}
              </p>
            </div>
          </div>

          {isConnected && (
            <CheckCircle2 className='w-4 h-4 text-primary flex-shrink-0' />
          )}
        </div>

        {/* Action Button */}
        <div className='flex gap-2'>
          {!isConnected ? (
            <Button
              onClick={() => onConnect(provider)}
              disabled={isLoading}
              className='w-full h-8 text-xs'
              size='sm'
            >
              {isLoading ? (
                <>
                  <Loader2 className='w-3 h-3 animate-spin' />
                  Connecting
                </>
              ) : (
                'Connect'
              )}
            </Button>
          ) : (
            <>
              <Button
                onClick={() => onConnect(provider)}
                variant='outline'
                className='flex-1 h-8 text-xs'
                size='sm'
                disabled={isLoading}
              >
                {isLoading ? 'Reconnecting...' : 'Reconnect'}
              </Button>
              <Button
                onClick={() => setShowDisconnectDialog(true)}
                variant='ghost'
                size='sm'
                disabled={isDisconnecting || isLoading}
                className='h-8 w-8 p-0'
              >
                {isDisconnecting ? (
                  <Loader2 className='w-3 h-3 animate-spin' />
                ) : (
                  <Trash2 className='w-3 h-3' />
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      <AlertDialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Disconnect {providerName}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to disconnect {providerName}? This will revoke access and automations using this service will be affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex gap-3 justify-end'>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className='bg-destructive hover:bg-destructive/90'
            >
              {isDisconnecting ? 'Disconnecting...' : 'Disconnect'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
