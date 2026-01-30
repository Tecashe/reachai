// app/dashboard/email-accounts/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

interface SetupInfo {
    clientId: string
    adminConsoleUrl: string
    steps: string[]
}

export default function EmailAccountsPage() {
    const [setupInfo, setSetupInfo] = useState<SetupInfo | null>(null)
    const [loading, setLoading] = useState(true)
    const [showInstructions, setShowInstructions] = useState(false)
    const [testEmail, setTestEmail] = useState('')
    const [testing, setTesting] = useState(false)

    const searchParams = useSearchParams()
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const connectedEmail = searchParams.get('email')

    useEffect(() => {
        fetchSetupInfo()
    }, [])

    const fetchSetupInfo = async () => {
        try {
            const res = await fetch('/api/oauth/setup-info')
            const data = await res.json()
            setSetupInfo(data)
        } catch (err) {
            console.error('Failed to fetch setup info:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleConnectGoogle = () => {
        window.location.href = '/api/oauth/google/authorize'
    }

    const handleTestConnection = async () => {
        if (!testEmail) return

        setTesting(true)
        try {
            const res = await fetch('/api/oauth/test-connection', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: testEmail,
                    sendTestEmail: true,
                }),
            })

            const data = await res.json()

            if (data.success) {
                alert(`✅ Test email sent to ${testEmail}! Check your inbox.`)
            } else {
                alert(`❌ Test failed: ${data.error}`)
            }
        } catch (err) {
            alert('❌ Test failed: Network error')
        } finally {
            setTesting(false)
        }
    }

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">Loading...</div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">Email Accounts</h1>

            {/* Success Message */}
            {success === 'connected' && connectedEmail && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-green-800">
                        ✅ Successfully connected: <strong>{decodeURIComponent(connectedEmail)}</strong>
                    </p>
                </div>
            )}

            {/* Error Message */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800">
                        ❌ Error: {error === 'access_denied' ? 'You denied access' :
                            error === 'invalid_callback' ? 'Invalid OAuth callback' :
                                error === 'connection_failed' ? 'Connection failed' :
                                    'Unknown error occurred'}
                    </p>
                </div>
            )}

            {/* Connect Google Account Button */}
            <div className="mb-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Connect Google Account</h2>
                <p className="text-gray-600 mb-4">
                    Connect your Google Workspace or Gmail account to start sending emails.
                </p>
                <button
                    onClick={handleConnectGoogle}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                    🔗 Connect Google Account
                </button>
            </div>

            {/* Admin Setup Instructions */}
            <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">
                        For Google Workspace Admins
                    </h2>
                    <button
                        onClick={() => setShowInstructions(!showInstructions)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        {showInstructions ? '▼ Hide' : '▶ Show'} Instructions
                    </button>
                </div>

                {showInstructions && setupInfo && (
                    <div className="space-y-4">
                        <p className="text-gray-700">
                            To remove the "This app isn't verified" warning, your Google Workspace
                            admin should allowlist this app in App Access Control.
                        </p>

                        <div className="bg-white p-4 rounded border border-gray-300">
                            <p className="font-medium mb-2">Client ID to allowlist:</p>
                            <div className="flex items-center gap-2">
                                <code className="flex-1 bg-gray-100 px-3 py-2 rounded text-sm font-mono">
                                    {setupInfo.clientId}
                                </code>
                                <button
                                    onClick={() => navigator.clipboard.writeText(setupInfo.clientId)}
                                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium"
                                >
                                    Copy
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded border border-gray-300">
                            <p className="font-medium mb-2">Steps for Admin:</p>
                            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                                {setupInfo.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                ))}
                            </ol>
                        </div>

                        <a
                            href={setupInfo.adminConsoleUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900 text-sm font-medium"
                        >
                            Open Google Admin Console →
                        </a>
                    </div>
                )}
            </div>

            {/* Test Connection */}
            <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Test Connection</h2>
                <p className="text-gray-600 mb-4">
                    Send a test email to verify your account is connected correctly.
                </p>

                <div className="flex gap-3">
                    <input
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="your-email@domain.com"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleTestConnection}
                        disabled={!testEmail || testing}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                        {testing ? 'Testing...' : '📧 Send Test Email'}
                    </button>
                </div>
            </div>

            {/* Implementation Notes */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold mb-2 text-blue-900">📝 Implementation Notes</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Uses OAuth2 for individual user authentication (like Instantly)</li>
                    <li>• Each user authenticates separately and gets their own tokens</li>
                    <li>• Admin can pre-approve app to remove "unverified" warnings</li>
                    <li>• Emails sent via SMTP (allowed for cold email campaigns)</li>
                    <li>• Tokens automatically refresh when expired</li>
                </ul>
            </div>
        </div>
    )
}