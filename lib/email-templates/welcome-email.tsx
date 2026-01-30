import type * as React from "react"
import {
    Html,
    Head,
    Body,
    Container,
    Section,
    Text,
    Button,
    Hr,
    Img,
    Link,
    Row,
    Column,
    Preview,
} from "@react-email/components"

interface WelcomeEmailProps {
    userName: string
    userEmail?: string
}

const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ userName, userEmail }) => {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://mailfra.app"
    const currentYear = new Date().getFullYear()

    return (
        <Html>
            <Head />
            <Preview>Welcome to Mailfra - Start sending personalized cold emails that get responses</Preview>
            <Body style={main}>
                <Container style={container}>
                    {/* Hero Header */}
                    <Section style={heroSection}>
                        <Text style={logoText}>mailfra</Text>
                        <Text style={heroHeading}>Welcome aboard! 🚀</Text>
                        <Text style={heroSubheading}>
                            You're now part of the future of cold email outreach
                        </Text>
                    </Section>

                    {/* Main Content */}
                    <Section style={contentSection}>
                        <Text style={greeting}>Hi {userName},</Text>

                        <Text style={paragraph}>
                            Thank you for joining <strong>Mailfra</strong>! We're excited to help you transform your
                            cold email outreach with AI-powered personalization that actually converts.
                        </Text>

                        <Text style={paragraph}>
                            With Mailfra, you'll be able to send emails that feel genuinely personal—at scale.
                            No more generic templates. No more low response rates.
                        </Text>

                        {/* Quick Start Section */}
                        <Section style={quickStartSection}>
                            <Text style={sectionTitle}>🎯 Get Started in 3 Simple Steps</Text>

                            <Section style={stepContainer}>
                                <Row>
                                    <Column style={stepNumber}>1</Column>
                                    <Column style={stepContent}>
                                        <Text style={stepTitle}>Connect Your Email</Text>
                                        <Text style={stepDescription}>
                                            Link your Gmail, Outlook, or custom SMTP to start sending
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>

                            <Section style={stepContainer}>
                                <Row>
                                    <Column style={stepNumber}>2</Column>
                                    <Column style={stepContent}>
                                        <Text style={stepTitle}>Create Your First Campaign</Text>
                                        <Text style={stepDescription}>
                                            Import prospects or find leads with our AI-powered lead finder
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>

                            <Section style={stepContainer}>
                                <Row>
                                    <Column style={stepNumber}>3</Column>
                                    <Column style={stepContent}>
                                        <Text style={stepTitle}>Let AI Personalize & Send</Text>
                                        <Text style={stepDescription}>
                                            Our AI researches each prospect and crafts unique, compelling emails
                                        </Text>
                                    </Column>
                                </Row>
                            </Section>
                        </Section>

                        {/* CTA Button */}
                        <Section style={ctaSection}>
                            <Button style={primaryButton} href={`${appUrl}/dashboard`}>
                                Go to Your Dashboard →
                            </Button>
                        </Section>

                        {/* Features Grid */}
                        <Text style={sectionTitle}>✨ What You Can Do with Mailfra</Text>

                        <Section style={featuresGrid}>
                            <Row>
                                <Column style={featureCard}>
                                    <Text style={featureIcon}>🤖</Text>
                                    <Text style={featureTitle}>AI Personalization</Text>
                                    <Text style={featureDescription}>
                                        Unique emails for every prospect based on real research
                                    </Text>
                                </Column>
                                <Column style={featureCard}>
                                    <Text style={featureIcon}>📊</Text>
                                    <Text style={featureTitle}>Smart Analytics</Text>
                                    <Text style={featureDescription}>
                                        Track opens, clicks, and replies in real-time
                                    </Text>
                                </Column>
                            </Row>
                            <Row>
                                <Column style={featureCard}>
                                    <Text style={featureIcon}>🔥</Text>
                                    <Text style={featureTitle}>Email Warmup</Text>
                                    <Text style={featureDescription}>
                                        Build sender reputation automatically
                                    </Text>
                                </Column>
                                <Column style={featureCard}>
                                    <Text style={featureIcon}>🎯</Text>
                                    <Text style={featureTitle}>Lead Finder</Text>
                                    <Text style={featureDescription}>
                                        Find verified leads matching your ideal customer
                                    </Text>
                                </Column>
                            </Row>
                        </Section>

                        {/* Account Info */}
                        <Section style={accountInfoSection}>
                            <Text style={accountInfoTitle}>📧 Your Account</Text>
                            <Text style={accountInfoText}>
                                <strong>Email:</strong> {userEmail || "your registered email"}
                            </Text>
                            <Text style={accountInfoText}>
                                <strong>Plan:</strong> Free (100 email credits included)
                            </Text>
                            <Text style={accountInfoText}>
                                <strong>Research Credits:</strong> 50 included
                            </Text>
                        </Section>

                        {/* Trust Indicators */}
                        <Section style={trustSection}>
                            <Row>
                                <Column style={trustItem}>
                                    <Text style={trustIcon}>🔒</Text>
                                    <Text style={trustText}>Bank-level encryption</Text>
                                </Column>
                                <Column style={trustItem}>
                                    <Text style={trustIcon}>💬</Text>
                                    <Text style={trustText}>24/7 Support</Text>
                                </Column>
                                <Column style={trustItem}>
                                    <Text style={trustIcon}>⚡</Text>
                                    <Text style={trustText}>99.9% Uptime</Text>
                                </Column>
                            </Row>
                        </Section>

                        <Hr style={hr} />

                        {/* Help Section */}
                        <Text style={helpText}>
                            Need help getting started? Check out our{" "}
                            <Link href={`${appUrl}/docs`} style={link}>
                                documentation
                            </Link>{" "}
                            or reply to this email — we're here to help!
                        </Text>

                        <Text style={signOff}>
                            Welcome to the team! 🎉
                            <br />
                            <strong>The Mailfra Team</strong>
                        </Text>
                    </Section>

                    {/* Footer */}
                    <Section style={footer}>
                        <Text style={footerLogo}>mailfra</Text>

                        <Text style={footerLinks}>
                            <Link href={`${appUrl}/dashboard`} style={footerLink}>Dashboard</Link>
                            {" • "}
                            <Link href={`${appUrl}/docs`} style={footerLink}>Documentation</Link>
                            {" • "}
                            <Link href={`${appUrl}/support`} style={footerLink}>Support</Link>
                        </Text>

                        <Text style={footerSocial}>
                            <Link href="https://twitter.com/mailfraapp" style={footerLink}>Twitter</Link>
                            {" • "}
                            <Link href="https://linkedin.com/company/mailfra" style={footerLink}>LinkedIn</Link>
                        </Text>

                        <Hr style={footerHr} />

                        <Text style={footerLegal}>
                            © {currentYear} Mailfra. All rights reserved.
                        </Text>
                        <Text style={footerAddress}>
                            AI-Powered Cold Email Personalization Platform
                        </Text>
                        <Text style={footerUnsubscribe}>
                            <Link href={`${appUrl}/settings/notifications`} style={footerLink}>
                                Manage email preferences
                            </Link>
                            {" | "}
                            <Link href={`${appUrl}/privacy`} style={footerLink}>
                                Privacy Policy
                            </Link>
                            {" | "}
                            <Link href={`${appUrl}/terms`} style={footerLink}>
                                Terms of Service
                            </Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    )
}

// Styles
const main = {
    backgroundColor: "#f4f4f7",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
    margin: "0 auto",
    maxWidth: "600px",
}

const heroSection = {
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "48px 40px",
    textAlign: "center" as const,
    borderRadius: "12px 12px 0 0",
}

const logoText = {
    fontSize: "28px",
    fontWeight: "700" as const,
    color: "#ffffff",
    margin: "0 0 24px 0",
    letterSpacing: "-0.5px",
}

const heroHeading = {
    fontSize: "32px",
    fontWeight: "700" as const,
    color: "#ffffff",
    margin: "0 0 12px 0",
    lineHeight: "1.2",
}

const heroSubheading = {
    fontSize: "16px",
    color: "rgba(255, 255, 255, 0.9)",
    margin: "0",
    lineHeight: "1.5",
}

const contentSection = {
    backgroundColor: "#ffffff",
    padding: "40px",
}

const greeting = {
    fontSize: "20px",
    fontWeight: "600" as const,
    color: "#1a1a2e",
    margin: "0 0 20px 0",
}

const paragraph = {
    fontSize: "16px",
    lineHeight: "1.6",
    color: "#4a4a68",
    margin: "0 0 16px 0",
}

const quickStartSection = {
    backgroundColor: "#f8f9fc",
    borderRadius: "12px",
    padding: "24px",
    margin: "32px 0",
}

const sectionTitle = {
    fontSize: "18px",
    fontWeight: "600" as const,
    color: "#1a1a2e",
    margin: "0 0 20px 0",
}

const stepContainer = {
    marginBottom: "16px",
}

const stepNumber = {
    width: "36px",
    height: "36px",
    backgroundColor: "#667eea",
    color: "#ffffff",
    borderRadius: "50%",
    textAlign: "center" as const,
    fontSize: "16px",
    fontWeight: "600" as const,
    lineHeight: "36px",
    verticalAlign: "top" as const,
}

const stepContent = {
    paddingLeft: "16px",
    verticalAlign: "top" as const,
}

const stepTitle = {
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "#1a1a2e",
    margin: "0 0 4px 0",
}

const stepDescription = {
    fontSize: "14px",
    color: "#6b7280",
    margin: "0",
    lineHeight: "1.4",
}

const ctaSection = {
    textAlign: "center" as const,
    margin: "32px 0",
}

const primaryButton = {
    backgroundColor: "#667eea",
    backgroundImage: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "8px",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: "600" as const,
    textDecoration: "none",
    padding: "14px 32px",
    display: "inline-block" as const,
}

const featuresGrid = {
    margin: "24px 0",
}

const featureCard = {
    backgroundColor: "#f8f9fc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center" as const,
    width: "48%",
    margin: "4px",
}

const featureIcon = {
    fontSize: "28px",
    margin: "0 0 8px 0",
}

const featureTitle = {
    fontSize: "14px",
    fontWeight: "600" as const,
    color: "#1a1a2e",
    margin: "0 0 4px 0",
}

const featureDescription = {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0",
    lineHeight: "1.4",
}

const accountInfoSection = {
    backgroundColor: "#eef2ff",
    borderRadius: "8px",
    padding: "20px",
    margin: "24px 0",
    borderLeft: "4px solid #667eea",
}

const accountInfoTitle = {
    fontSize: "16px",
    fontWeight: "600" as const,
    color: "#1a1a2e",
    margin: "0 0 12px 0",
}

const accountInfoText = {
    fontSize: "14px",
    color: "#4a4a68",
    margin: "0 0 8px 0",
}

const trustSection = {
    textAlign: "center" as const,
    margin: "32px 0",
}

const trustItem = {
    textAlign: "center" as const,
    padding: "0 8px",
}

const trustIcon = {
    fontSize: "20px",
    margin: "0",
}

const trustText = {
    fontSize: "12px",
    color: "#6b7280",
    margin: "4px 0 0 0",
}

const hr = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
}

const helpText = {
    fontSize: "14px",
    color: "#6b7280",
    lineHeight: "1.6",
    margin: "0 0 24px 0",
}

const link = {
    color: "#667eea",
    textDecoration: "underline",
}

const signOff = {
    fontSize: "16px",
    color: "#1a1a2e",
    lineHeight: "1.6",
    margin: "0",
}

const footer = {
    backgroundColor: "#1a1a2e",
    padding: "32px 40px",
    textAlign: "center" as const,
    borderRadius: "0 0 12px 12px",
}

const footerLogo = {
    fontSize: "20px",
    fontWeight: "700" as const,
    color: "#ffffff",
    margin: "0 0 16px 0",
}

const footerLinks = {
    fontSize: "14px",
    margin: "0 0 12px 0",
}

const footerLink = {
    color: "#a0aec0",
    textDecoration: "none",
}

const footerSocial = {
    fontSize: "14px",
    margin: "0 0 20px 0",
}

const footerHr = {
    borderColor: "#2d3748",
    margin: "20px 0",
}

const footerLegal = {
    fontSize: "12px",
    color: "#718096",
    margin: "0 0 4px 0",
}

const footerAddress = {
    fontSize: "12px",
    color: "#718096",
    margin: "0 0 12px 0",
}

const footerUnsubscribe = {
    fontSize: "11px",
    color: "#718096",
    margin: "0",
}

export default WelcomeEmail
