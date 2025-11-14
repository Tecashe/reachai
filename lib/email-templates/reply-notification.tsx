import type * as React from "react"
import { Html, Head, Body, Container, Section, Text, Button, Hr } from "@react-email/components"

interface ReplyNotificationEmailProps {
  userName: string
  prospectName: string
  prospectEmail: string
  campaignName: string
  replySubject: string
  replyPreview: string
  sentiment: string
  category: string
  replyUrl: string
}

export const ReplyNotificationEmail: React.FC<ReplyNotificationEmailProps> = ({
  userName,
  prospectName,
  prospectEmail,
  campaignName,
  replySubject,
  replyPreview,
  sentiment,
  category,
  replyUrl,
}) => {
  const sentimentColor = sentiment === "POSITIVE" ? "#10b981" : sentiment === "NEGATIVE" ? "#ef4444" : "#6b7280"

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>New Reply Received! 🎉</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            <Text style={paragraph}>
              <strong>{prospectName}</strong> ({prospectEmail}) just replied to your email in{" "}
              <strong>{campaignName}</strong>
            </Text>

            <Section style={replyBox}>
              <Text style={replySubjectText}>
                <strong>Subject:</strong> {replySubject}
              </Text>
              <Text style={replyPreviewText}>{replyPreview}</Text>
            </Section>

            <Section style={metaBox}>
              <Text style={metaText}>
                <span style={{ ...badge, backgroundColor: sentimentColor }}>{sentiment}</span>
                <span style={{ ...badge, backgroundColor: "#6366f1" }}>{category}</span>
              </Text>
            </Section>

            <Button style={button} href={replyUrl}>
              View Reply in Inbox
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              This is an automated notification from mailfra. You can manage your notification preferences in your
              account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
}

const header = {
  padding: "32px 48px",
  backgroundColor: "#6366f1",
}

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#ffffff",
  margin: "0",
}

const content = {
  padding: "0 48px",
}

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "16px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
}

const replyBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "24px",
}

const replySubjectText = {
  fontSize: "14px",
  marginBottom: "8px",
}

const replyPreviewText = {
  fontSize: "14px",
  color: "#64748b",
  fontStyle: "italic",
  margin: "0",
}

const metaBox = {
  marginBottom: "24px",
}

const metaText = {
  fontSize: "14px",
  display: "flex",
  gap: "8px",
}

const badge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#ffffff",
  marginRight: "8px",
}

const button = {
  backgroundColor: "#6366f1",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 24px",
  marginBottom: "24px",
}

const hr = {
  borderColor: "#e2e8f0",
  margin: "24px 0",
}

const footer = {
  color: "#64748b",
  fontSize: "12px",
  lineHeight: "16px",
}

export default ReplyNotificationEmail
