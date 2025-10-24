import type * as React from "react"

interface TeamInvitationEmailProps {
  inviterName: string
  inviterEmail: string
  inviteeEmail: string
  role: string
  invitationUrl: string
  expiresAt: string
}

export const TeamInvitationEmail: React.FC<TeamInvitationEmailProps> = ({
  inviterName,
  inviterEmail,
  inviteeEmail,
  role,
  invitationUrl,
  expiresAt,
}) => (
  <html>
    <head>
      <style>{`
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          border-radius: 8px 8px 0 0;
          text-align: center;
        }
        .content {
          background: #f9fafb;
          padding: 30px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: 600;
          margin: 20px 0;
        }
        .info-box {
          background: white;
          border-left: 4px solid #667eea;
          padding: 16px;
          margin: 20px 0;
          border-radius: 4px;
        }
        .footer {
          text-align: center;
          color: #6b7280;
          font-size: 14px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </head>
    <body>
      <div className="header">
        <h1>You've been invited to join ReachAI</h1>
      </div>
      <div className="content">
        <p>Hi there,</p>
        <p>
          <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join their ReachAI workspace as a{" "}
          <strong>{role}</strong>.
        </p>

        <div className="info-box">
          <p>
            <strong>What is ReachAI?</strong>
          </p>
          <p>
            ReachAI is an AI-powered cold email platform that helps teams generate personalized outreach campaigns,
            research prospects, and track engagement.
          </p>
        </div>

        <p>As a {role}, you'll be able to:</p>
        <ul>
          {role === "OWNER" && (
            <>
              <li>Full access to all campaigns and prospects</li>
              <li>Manage team members and billing</li>
              <li>Configure integrations and settings</li>
            </>
          )}
          {role === "ADMIN" && (
            <>
              <li>Create and manage campaigns</li>
              <li>Add and research prospects</li>
              <li>Invite team members</li>
              <li>View analytics</li>
            </>
          )}
          {role === "MEMBER" && (
            <>
              <li>Create and edit campaigns</li>
              <li>Add and research prospects</li>
              <li>Generate AI emails</li>
              <li>View analytics</li>
            </>
          )}
          {role === "VIEWER" && (
            <>
              <li>View campaigns and prospects</li>
              <li>View analytics</li>
              <li>Read-only access</li>
            </>
          )}
        </ul>

        <div style={{ textAlign: "center" }}>
          <a href={invitationUrl} className="button">
            Accept Invitation
          </a>
        </div>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          This invitation will expire on {expiresAt}. If you don't accept it by then, you'll need to request a new
          invitation.
        </p>

        <p style={{ fontSize: "14px", color: "#6b7280" }}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </p>
      </div>
      <div className="footer">
        <p>© 2025 ReachAI. All rights reserved.</p>
        <p>
          <a href="https://reachai.com/privacy" style={{ color: "#667eea", textDecoration: "none" }}>
            Privacy Policy
          </a>
          {" · "}
          <a href="https://reachai.com/terms" style={{ color: "#667eea", textDecoration: "none" }}>
            Terms of Service
          </a>
        </p>
      </div>
    </body>
  </html>
)
