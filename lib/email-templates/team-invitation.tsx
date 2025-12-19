

import { Html, Head, Body, Container, Section, Text, Link, Button, Hr } from "@react-email/components"

interface TeamInvitationEmailProps {
  inviterName: string
  inviterEmail: string
  inviteeEmail: string
  role: string
  invitationUrl: string
  expiresAt: string
}

export const TeamInvitationEmail = ({
  inviterName,
  inviterEmail,
  inviteeEmail,
  role,
  invitationUrl,
  expiresAt,
}: TeamInvitationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Text style={headerText}>You've been invited to join mailfra</Text>
        </Section>

        <Section style={content}>
          <Text style={paragraph}>Hi there,</Text>

          <Text style={paragraph}>
            <strong>{inviterName}</strong> ({inviterEmail}) has invited you to join their mailfra workspace as a{" "}
            <strong>{role}</strong>.
          </Text>

          <Section style={infoBox}>
            <Text style={paragraph}>
              <strong>What is mailfra?</strong>
            </Text>
            <Text style={paragraph}>
              mailfra is an AI-powered cold email platform that helps teams generate personalized outreach campaigns,
              research prospects, and track engagement.
            </Text>
          </Section>

          <Text style={paragraph}>As a {role}, you'll be able to:</Text>

          <Text style={listItem}>
            {role === "OWNER" &&
              "• Full access to all campaigns and prospects\n• Manage team members and billing\n• Configure integrations and settings"}
            {role === "ADMIN" &&
              "• Create and manage campaigns\n• Add and research prospects\n• Invite team members\n• View analytics"}
            {role === "MEMBER" &&
              "• Create and edit campaigns\n• Add and research prospects\n• Generate AI emails\n• View analytics"}
            {role === "VIEWER" && "• View campaigns and prospects\n• View analytics\n• Read-only access"}
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={invitationUrl}>
              Accept Invitation
            </Button>
          </Section>

          <Text style={smallText}>
            This invitation will expire on {expiresAt}. If you don't accept it by then, you'll need to request a new
            invitation.
          </Text>

          <Text style={smallText}>If you weren't expecting this invitation, you can safely ignore this email.</Text>
        </Section>

        <Hr style={hr} />

        <Section style={footer}>
          <Text style={footerText}>© 2025 mailfra. All rights reserved.</Text>
          <Text style={footerText}>
            <Link href="https://mailfra.com/privacy" style={link}>
              Privacy Policy
            </Link>
            {" · "}
            <Link href="https://mailfra.com/terms" style={link}>
              Terms of Service
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
}

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
}

const header = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  padding: "30px",
  borderRadius: "8px 8px 0 0",
  textAlign: "center" as const,
}

const headerText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
}

const content = {
  padding: "30px",
}

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#333333",
  margin: "16px 0",
}

const infoBox = {
  backgroundColor: "#f9fafb",
  borderLeft: "4px solid #667eea",
  padding: "16px",
  margin: "20px 0",
  borderRadius: "4px",
}

const listItem = {
  fontSize: "16px",
  lineHeight: "1.8",
  color: "#333333",
  margin: "16px 0",
  whiteSpace: "pre-line" as const,
}

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
}

const button = {
  backgroundColor: "#667eea",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
}

const smallText = {
  fontSize: "14px",
  color: "#6b7280",
  lineHeight: "1.6",
  margin: "12px 0",
}

const hr = {
  borderColor: "#e5e7eb",
  margin: "20px 0",
}

const footer = {
  textAlign: "center" as const,
  padding: "20px 30px",
}

const footerText = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "8px 0",
}

const link = {
  color: "#667eea",
  textDecoration: "none",
}
