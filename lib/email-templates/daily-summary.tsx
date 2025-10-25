import type * as React from "react"
import { Html, Head, Body, Container, Section, Text, Button, Hr } from "@react-email/components"

interface DailySummaryEmailProps {
  userName: string
  date: string
  totalReplies: number
  positiveReplies: number
  emailsSent: number
  openRate: number
  replyRate: number
  topCampaigns: Array<{
    name: string
    replies: number
    sent: number
  }>
  recentReplies: Array<{
    prospectName: string
    campaignName: string
    sentiment: string
    preview: string
  }>
}

const DailySummaryEmail: React.FC<DailySummaryEmailProps> = ({
  userName,
  date,
  totalReplies,
  positiveReplies,
  emailsSent,
  openRate,
  replyRate,
  topCampaigns,
  recentReplies,
}) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={heading}>Your Daily Summary</Text>
            <Text style={subheading}>{date}</Text>
          </Section>

          <Section style={content}>
            <Text style={greeting}>Hi {userName},</Text>
            <Text style={paragraph}>Here's what happened yesterday with your campaigns:</Text>

            <Section style={statsGrid}>
              <div style={statBox}>
                <Text style={statNumber}>{totalReplies}</Text>
                <Text style={statLabel}>Total Replies</Text>
              </div>
              <div style={statBox}>
                <Text style={statNumber}>{positiveReplies}</Text>
                <Text style={statLabel}>Positive Replies</Text>
              </div>
              <div style={statBox}>
                <Text style={statNumber}>{emailsSent}</Text>
                <Text style={statLabel}>Emails Sent</Text>
              </div>
              <div style={statBox}>
                <Text style={statNumber}>{replyRate}%</Text>
                <Text style={statLabel}>Reply Rate</Text>
              </div>
            </Section>

            {topCampaigns.length > 0 && (
              <>
                <Text style={sectionTitle}>Top Performing Campaigns</Text>
                {topCampaigns.map((campaign, index) => (
                  <Section key={index} style={campaignBox}>
                    <Text style={campaignName}>{campaign.name}</Text>
                    <Text style={campaignStats}>
                      {campaign.replies} replies from {campaign.sent} sent
                    </Text>
                  </Section>
                ))}
              </>
            )}

            {recentReplies.length > 0 && (
              <>
                <Text style={sectionTitle}>Recent Replies</Text>
                {recentReplies.map((reply, index) => (
                  <Section key={index} style={replyBox}>
                    <Text style={replyProspect}>
                      {reply.prospectName} • {reply.campaignName}
                    </Text>
                    <Text style={replyPreview}>{reply.preview}</Text>
                    <span
                      style={{
                        ...badge,
                        backgroundColor:
                          reply.sentiment === "POSITIVE"
                            ? "#10b981"
                            : reply.sentiment === "NEGATIVE"
                              ? "#ef4444"
                              : "#6b7280",
                      }}
                    >
                      {reply.sentiment}
                    </span>
                  </Section>
                ))}
              </>
            )}

            <Button style={button} href={`${process.env.NEXT_PUBLIC_APP_URL}/dashboard`}>
              View Full Dashboard
            </Button>

            <Hr style={hr} />

            <Text style={footer}>
              This is your daily summary from ReachAI. You can manage your notification preferences in your account
              settings.
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
  margin: "0 0 8px 0",
}

const subheading = {
  fontSize: "14px",
  color: "#e0e7ff",
  margin: "0",
}

const content = {
  padding: "0 48px",
}

const greeting = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "8px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "24px",
}

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "16px",
  marginBottom: "32px",
}

const statBox = {
  textAlign: "center" as const,
  padding: "16px",
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
}

const statNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#6366f1",
  margin: "0 0 4px 0",
}

const statLabel = {
  fontSize: "12px",
  color: "#64748b",
  margin: "0",
}

const sectionTitle = {
  fontSize: "18px",
  fontWeight: "600",
  marginBottom: "16px",
  marginTop: "32px",
}

const campaignBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
}

const campaignName = {
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 4px 0",
}

const campaignStats = {
  fontSize: "14px",
  color: "#64748b",
  margin: "0",
}

const replyBox = {
  backgroundColor: "#f8fafc",
  borderRadius: "8px",
  padding: "16px",
  marginBottom: "12px",
}

const replyProspect = {
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "8px",
}

const replyPreview = {
  fontSize: "14px",
  color: "#64748b",
  fontStyle: "italic",
  marginBottom: "8px",
}

const badge = {
  display: "inline-block",
  padding: "4px 12px",
  borderRadius: "12px",
  fontSize: "12px",
  fontWeight: "600",
  color: "#ffffff",
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
  marginTop: "32px",
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

export default DailySummaryEmail
