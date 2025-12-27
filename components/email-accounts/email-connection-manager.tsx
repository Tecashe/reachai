"use client"

import { useState } from "react"
import { ConnectedAccountsList } from "./connected-accounts-list"
import { ConnectionMethodSelector } from "./connection-method-selector"
import { GmailConnectionOptions } from "./gmail-connection-options"
import { OutlookSetupGuide } from "./outlook-setup-guide"
import { SmtpSetupGuide } from "./smtp-setup-guide"
import { CsvBulkImport } from "./csv-bulk-import"

type View = "list" | "select-method" | "gmail-options" | "outlook-setup" | "smtp-setup" | "csv-import"
type Provider = "gmail" | "outlook" | "smtp" | null

export function EmailConnectionManager() {
  const [currentView, setCurrentView] = useState<View>("list")
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null)

  const handleAddAccount = () => {
    setCurrentView("select-method")
  }

  const handleSelectProvider = (provider: Provider) => {
    setSelectedProvider(provider)
    if (provider === "gmail") {
      setCurrentView("gmail-options")
    } else if (provider === "outlook") {
      setCurrentView("outlook-setup")
    } else if (provider === "smtp") {
      setCurrentView("smtp-setup")
    }
  }

  const handleBulkImport = () => {
    setCurrentView("csv-import")
  }

  const handleBack = () => {
    setCurrentView("list")
    setSelectedProvider(null)
  }

  const handleAccountAdded = () => {
    setCurrentView("list")
    setSelectedProvider(null)
  }

  return (
    <div className="relative">
      <div className="transition-all duration-300 ease-in-out">
        {currentView === "list" && (
          <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
            <ConnectedAccountsList onAddAccount={handleAddAccount} onBulkImport={handleBulkImport} />
          </div>
        )}

        {currentView === "select-method" && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
            <ConnectionMethodSelector onSelectProvider={handleSelectProvider} onCancel={handleBack} />
          </div>
        )}

        {currentView === "gmail-options" && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
            <GmailConnectionOptions onAccountAdded={handleAccountAdded} onBack={handleBack} />
          </div>
        )}

        {currentView === "outlook-setup" && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
            <OutlookSetupGuide onAccountAdded={handleAccountAdded} onBack={handleBack} />
          </div>
        )}

        {currentView === "smtp-setup" && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
            <SmtpSetupGuide onAccountAdded={handleAccountAdded} onBack={handleBack} />
          </div>
        )}

        {currentView === "csv-import" && (
          <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
            <CsvBulkImport onAccountsAdded={handleAccountAdded} onCancel={handleBack} />
          </div>
        )}
      </div>
    </div>
  )
}
