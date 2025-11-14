export const APP_NAME = "mailfra"
export const APP_DESCRIPTION = "AI-Powered Cold Email Personalization Platform"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Pricer
export const PRICING_PLANS = [
  {
    tier: "FREE",
    name: "Free",
    price: 0,
    interval: "month",
    features: [
      "100 emails/month",
      "50 prospects/month",
      "1 campaign",
      "10 AI credits",
      "Basic email templates",
      "Email tracking",
    ],
    popular: false,
  },
  {
    tier: "STARTER",
    name: "Starter",
    price: 29,
    interval: "month",
    features: [
      "1,000 emails/month",
      "500 prospects/month",
      "5 campaigns",
      "100 AI credits",
      "AI research assistant",
      "Advanced templates",
      "Email sequences",
      "Priority support",
    ],
    popular: true,
  },
  {
    tier: "PRO",
    name: "Pro",
    price: 79,
    interval: "month",
    features: [
      "5,000 emails/month",
      "2,500 prospects/month",
      "20 campaigns",
      "500 AI credits",
      "Deep AI research",
      "Competitor intelligence",
      "A/B testing",
      "Team collaboration (5 members)",
      "API access",
    ],
    popular: false,
  },
  {
    tier: "AGENCY",
    name: "Agency",
    price: 199,
    interval: "month",
    features: [
      "20,000 emails/month",
      "10,000 prospects/month",
      "Unlimited campaigns",
      "2,000 AI credits",
      "White-label options",
      "Dedicated account manager",
      "Custom integrations",
      "Team collaboration (20 members)",
      "Advanced analytics",
    ],
    popular: false,
  },
] as const

export const PRICING_TIERS = PRICING_PLANS

// Email providers
export const EMAIL_PROVIDERS = [
  { id: "resend", name: "Resend", icon: "📧" },
  { id: "gmail", name: "Gmail", icon: "📮" },
  { id: "outlook", name: "Outlook", icon: "📨" },
] as const

// Research depth options
export const RESEARCH_DEPTH_OPTIONS = [
  { value: "BASIC", label: "Basic", description: "Company name and website" },
  { value: "STANDARD", label: "Standard", description: "Company info + recent news" },
  { value: "DEEP", label: "Deep", description: "Full research with competitor analysis" },
] as const

// Personalization levels
export const PERSONALIZATION_LEVELS = [
  { value: "LOW", label: "Low", description: "Basic name and company" },
  { value: "MEDIUM", label: "Medium", description: "Include job title and industry" },
  { value: "HIGH", label: "High", description: "Deep personalization with insights" },
  { value: "ULTRA", label: "Ultra", description: "Maximum personalization with AI research" },
] as const

// Tone of voice options
export const TONE_OPTIONS = ["professional", "casual", "friendly", "formal", "enthusiastic", "consultative"] as const

// Credit packages for purchase
export const CREDIT_PACKAGES = {
  email: [
    {
      id: "email_500",
      name: "Starter Pack",
      credits: 500,
      price: 19,
      pricePerCredit: 0.038,
      popular: false,
      savings: undefined,
    },
    {
      id: "email_1000",
      name: "Growth Pack",
      credits: 1000,
      price: 29,
      pricePerCredit: 0.029,
      popular: true,
      savings: "24%",
    },
    {
      id: "email_5000",
      name: "Scale Pack",
      credits: 5000,
      price: 99,
      pricePerCredit: 0.0198,
      popular: false,
      savings: "48%",
    },
    {
      id: "email_10000",
      name: "Enterprise Pack",
      credits: 10000,
      price: 149,
      pricePerCredit: 0.0149,
      popular: false,
      savings: "61%",
    },
  ],
  research: [
    {
      id: "research_50",
      name: "Starter Pack",
      credits: 50,
      price: 29,
      pricePerCredit: 0.58,
      popular: false,
      savings: undefined,
    },
    {
      id: "research_100",
      name: "Growth Pack",
      credits: 100,
      price: 49,
      pricePerCredit: 0.49,
      popular: true,
      savings: "16%",
    },
    {
      id: "research_500",
      name: "Scale Pack",
      credits: 500,
      price: 199,
      pricePerCredit: 0.398,
      popular: false,
      savings: "31%",
    },
    {
      id: "research_1000",
      name: "Enterprise Pack",
      credits: 1000,
      price: 299,
      pricePerCredit: 0.299,
      popular: false,
      savings: "48%",
    },
  ],
} as const

export type CreditPackage = {
  id: string
  name: string
  credits: number
  price: number
  pricePerCredit: number
  popular: boolean
  savings?: string
}

export const CREDIT_COSTS = {
  EMAIL_SEND: 1,
  RESEARCH_FAST: 1,
  RESEARCH_DEEP: 3,
  EMAIL_VALIDATION: 0, // Free
  AB_TEST_VARIANT: 0, // Free
} as const

export const LOW_CREDIT_THRESHOLDS = {
  EMAIL: 50,
  RESEARCH: 10,
} as const

export const TEMPLATE_LIBRARY = [
  // Cold Outreach Templates
  {
    id: "cold_1",
    name: "Problem-Solution Approach",
    category: "cold_outreach",
    subject: "Quick question about {{company}}'s {{pain_point}}",
    body: `Hi {{firstName}},

I noticed {{company}} is {{recent_activity}}. Many companies in {{industry}} face challenges with {{pain_point}}.

We've helped similar companies like {{competitor}} achieve {{specific_result}}. Would you be open to a quick 15-minute call to explore if we could help {{company}} achieve similar results?

Best regards,
{{senderName}}`,
    description: "Lead with a problem your prospect likely faces, then offer your solution",
    variables: [
      "firstName",
      "company",
      "recent_activity",
      "industry",
      "pain_point",
      "competitor",
      "specific_result",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "cold_2",
    name: "Social Proof Opener",
    category: "cold_outreach",
    subject: "How {{competitor}} increased {{metric}} by {{percentage}}",
    body: `Hi {{firstName}},

I saw that {{company}} is {{recent_news}}. Congrats on the momentum!

We recently helped {{competitor}} increase their {{metric}} by {{percentage}} in just {{timeframe}}. Given your focus on {{goal}}, I thought this might be relevant.

Would you be interested in learning how they did it?

Best,
{{senderName}}`,
    description: "Use social proof from similar companies to build credibility",
    variables: [
      "firstName",
      "company",
      "recent_news",
      "competitor",
      "metric",
      "percentage",
      "timeframe",
      "goal",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "cold_3",
    name: "Personalized Insight",
    category: "cold_outreach",
    subject: "Noticed {{company}}'s {{specific_initiative}}",
    body: `Hi {{firstName}},

I came across {{company}}'s {{specific_initiative}} and was impressed by {{specific_detail}}.

As someone who works with {{industry}} companies, I noticed an opportunity to {{improvement_suggestion}}. We've helped companies like {{example_company}} achieve {{result}}.

Would you be open to a brief conversation about this?

Cheers,
{{senderName}}`,
    description: "Show you've done your research with specific, personalized insights",
    variables: [
      "firstName",
      "company",
      "specific_initiative",
      "specific_detail",
      "industry",
      "improvement_suggestion",
      "example_company",
      "result",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "cold_4",
    name: "Mutual Connection Intro",
    category: "cold_outreach",
    subject: "{{mutual_connection}} recommended I reach out",
    body: `Hi {{firstName}},

{{mutual_connection}} mentioned you're doing great work at {{company}} and suggested I reach out.

We specialize in helping {{industry}} companies {{value_proposition}}. Given {{company}}'s focus on {{goal}}, I thought there might be a fit.

Would you be open to a brief intro call?

Best,
{{senderName}}`,
    description: "Leverage mutual connections for warm introductions",
    variables: ["firstName", "mutual_connection", "company", "industry", "value_proposition", "goal", "senderName"],
    isSystemTemplate: true,
  },
  {
    id: "cold_5",
    name: "Congratulations Approach",
    category: "cold_outreach",
    subject: "Congrats on {{achievement}}!",
    body: `Hi {{firstName}},

Congratulations on {{achievement}}! I saw the announcement about {{company}} and wanted to reach out.

As you scale {{specific_area}}, you might find {{our_solution}} helpful. We've helped companies like {{example_company}} {{result}} during similar growth phases.

Would love to share how we could support {{company}}'s next chapter.

Best regards,
{{senderName}}`,
    description: "Congratulate on recent achievements to start a positive conversation",
    variables: [
      "firstName",
      "achievement",
      "company",
      "specific_area",
      "our_solution",
      "example_company",
      "result",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "cold_6",
    name: "Industry Trend Opener",
    category: "cold_outreach",
    subject: "{{industry}} companies are shifting to {{trend}}",
    body: `Hi {{firstName}},

I've noticed {{industry}} leaders like {{competitor_1}} and {{competitor_2}} are {{trend_action}}.

At {{company}}, you're well-positioned to {{opportunity}}. We've helped similar companies navigate this shift and achieve {{result}}.

Interested in a quick conversation about how this applies to {{company}}?

Cheers,
{{senderName}}`,
    description: "Position yourself as an industry expert by discussing relevant trends",
    variables: [
      "firstName",
      "industry",
      "trend",
      "competitor_1",
      "competitor_2",
      "trend_action",
      "company",
      "opportunity",
      "result",
      "senderName",
    ],
    isSystemTemplate: true,
  },

  // Follow-up Templates
  {
    id: "followup_1",
    name: "Value-Add Follow-up",
    category: "follow_up",
    subject: "Re: {{original_subject}} + resource",
    body: `Hi {{firstName}},

Following up on my previous email about {{topic}}.

I thought you might find this helpful: {{resource_link}} - it's a {{resource_description}} that {{benefit}}.

Still interested in discussing how we can help {{company}} with {{goal}}?

Best,
{{senderName}}`,
    description: "Add value in your follow-up with a relevant resource",
    variables: [
      "firstName",
      "original_subject",
      "topic",
      "resource_link",
      "resource_description",
      "benefit",
      "company",
      "goal",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "followup_2",
    name: "Breakup Email",
    category: "follow_up",
    subject: "Should I close your file?",
    body: `Hi {{firstName}},

I've reached out a few times about {{topic}} but haven't heard back.

I don't want to be a pest, so I'll assume this isn't a priority for {{company}} right now.

If that changes, feel free to reach out. Otherwise, I'll close your file.

Best of luck with {{recent_initiative}}!

{{senderName}}`,
    description: "Final follow-up that often gets responses by creating urgency",
    variables: ["firstName", "topic", "company", "recent_initiative", "senderName"],
    isSystemTemplate: true,
  },
  {
    id: "followup_3",
    name: "Different Angle Follow-up",
    category: "follow_up",
    subject: "Different approach for {{company}}",
    body: `Hi {{firstName}},

I realize my previous email about {{original_topic}} might not have resonated.

Let me try a different angle: What if you could {{alternative_benefit}} without {{common_objection}}?

That's exactly what we did for {{case_study_company}}. Worth a quick chat?

Best,
{{senderName}}`,
    description: "Approach from a different angle if the first attempt didn't work",
    variables: [
      "firstName",
      "company",
      "original_topic",
      "alternative_benefit",
      "common_objection",
      "case_study_company",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "followup_4",
    name: "Case Study Follow-up",
    category: "follow_up",
    subject: "Case study: How {{case_study_company}} achieved {{result}}",
    body: `Hi {{firstName}},

I wanted to share a recent case study that might be relevant to {{company}}.

{{case_study_company}} (similar to {{company}} in {{similarity}}) used our solution to {{achievement}}. The results:

• {{metric_1}}
• {{metric_2}}
• {{metric_3}}

Would you like to see how this could work for {{company}}?

Best,
{{senderName}}`,
    description: "Share a relevant case study to demonstrate value",
    variables: [
      "firstName",
      "case_study_company",
      "result",
      "company",
      "similarity",
      "achievement",
      "metric_1",
      "metric_2",
      "metric_3",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "followup_5",
    name: "Question-Based Follow-up",
    category: "follow_up",
    subject: "Quick question about {{company}}'s {{area}}",
    body: `Hi {{firstName}},

Quick question: Is {{company}} currently {{current_situation}}?

I ask because we just helped {{similar_company}} solve this exact challenge, and I thought the approach might be relevant for you.

Worth a 10-minute conversation?

Thanks,
{{senderName}}`,
    description: "Use a question to re-engage and show relevance",
    variables: ["firstName", "company", "area", "current_situation", "similar_company", "senderName"],
    isSystemTemplate: true,
  },
  {
    id: "followup_6",
    name: "Timing Follow-up",
    category: "follow_up",
    subject: "Bad timing before?",
    body: `Hi {{firstName}},

I reached out {{timeframe}} ago about {{topic}}, but I'm guessing the timing wasn't right.

Things change quickly, so I wanted to check in. Are you still facing challenges with {{pain_point}}?

If so, I'd love to share how we've helped companies like {{example_company}} solve this.

Best,
{{senderName}}`,
    description: "Acknowledge timing might have been off and try again",
    variables: ["firstName", "timeframe", "topic", "pain_point", "example_company", "senderName"],
    isSystemTemplate: true,
  },

  // Meeting Request Templates
  {
    id: "meeting_1",
    name: "Direct Meeting Request",
    category: "meeting_request",
    subject: "15 minutes to discuss {{topic}}?",
    body: `Hi {{firstName}},

Based on {{company}}'s {{recent_activity}}, I believe we could help you {{specific_outcome}}.

Would you be available for a 15-minute call {{suggested_time}}? I'll come prepared with:

• {{talking_point_1}}
• {{talking_point_2}}
• {{talking_point_3}}

Here's my calendar: {{calendar_link}}

Looking forward to connecting!

{{senderName}}`,
    description: "Clear, direct meeting request with specific agenda",
    variables: [
      "firstName",
      "company",
      "recent_activity",
      "specific_outcome",
      "suggested_time",
      "talking_point_1",
      "talking_point_2",
      "talking_point_3",
      "calendar_link",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "meeting_2",
    name: "Soft Meeting Request",
    category: "meeting_request",
    subject: "Quick question about {{topic}}",
    body: `Hi {{firstName}},

I have a quick question about {{company}}'s approach to {{topic}}.

Rather than a long email, would you be open to a brief 10-minute call? I promise to be respectful of your time.

If {{suggested_day}} works, here's my calendar: {{calendar_link}}

Thanks,
{{senderName}}`,
    description: "Softer approach that feels less salesy",
    variables: ["firstName", "company", "topic", "suggested_day", "calendar_link", "senderName"],
    isSystemTemplate: true,
  },
  {
    id: "meeting_3",
    name: "Executive Meeting Request",
    category: "meeting_request",
    subject: "{{mutual_connection}} suggested we connect",
    body: `Hi {{firstName}},

{{mutual_connection}} mentioned you're the right person to speak with about {{topic}} at {{company}}.

I work with {{industry}} leaders like {{client_1}} and {{client_2}} to {{value_proposition}}.

Would you be open to a brief conversation? I'm happy to work around your schedule.

Best regards,
{{senderName}}
{{title}}`,
    description: "Professional approach for reaching executives with social proof",
    variables: [
      "firstName",
      "mutual_connection",
      "topic",
      "company",
      "industry",
      "client_1",
      "client_2",
      "value_proposition",
      "senderName",
      "title",
    ],
    isSystemTemplate: true,
  },
  {
    id: "meeting_4",
    name: "Demo Request",
    category: "meeting_request",
    subject: "Quick demo of {{solution}} for {{company}}",
    body: `Hi {{firstName}},

I'd love to show you a quick demo of how {{solution}} could help {{company}} {{achieve_goal}}.

The demo takes just 15 minutes and I'll customize it to show:
• {{benefit_1}}
• {{benefit_2}}
• {{benefit_3}}

Does {{suggested_time}} work? Here's my calendar: {{calendar_link}}

Best,
{{senderName}}`,
    description: "Request a product demo with clear benefits",
    variables: [
      "firstName",
      "solution",
      "company",
      "achieve_goal",
      "benefit_1",
      "benefit_2",
      "benefit_3",
      "suggested_time",
      "calendar_link",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "meeting_5",
    name: "Audit/Assessment Offer",
    category: "meeting_request",
    subject: "Free {{assessment_type}} for {{company}}",
    body: `Hi {{firstName}},

I'd like to offer {{company}} a complimentary {{assessment_type}} to identify opportunities for {{improvement_area}}.

This typically takes 20 minutes and companies find value in:
• {{insight_1}}
• {{insight_2}}
• {{insight_3}}

No strings attached - just actionable insights. Interested?

Calendar: {{calendar_link}}

Best regards,
{{senderName}}`,
    description: "Offer a free audit or assessment to provide value upfront",
    variables: [
      "firstName",
      "company",
      "assessment_type",
      "improvement_area",
      "insight_1",
      "insight_2",
      "insight_3",
      "calendar_link",
      "senderName",
    ],
    isSystemTemplate: true,
  },
  {
    id: "meeting_6",
    name: "Peer Introduction",
    category: "meeting_request",
    subject: "Introduction to {{peer_name}} at {{peer_company}}",
    body: `Hi {{firstName}},

I thought you might benefit from connecting with {{peer_name}}, {{peer_title}} at {{peer_company}}.

They recently solved {{similar_challenge}} and achieved {{result}}. Given {{company}}'s focus on {{goal}}, I thought the introduction could be valuable.

Would you be interested in a brief three-way intro call?

Best,
{{senderName}}`,
    description: "Offer to introduce them to a relevant peer for networking value",
    variables: [
      "firstName",
      "peer_name",
      "peer_title",
      "peer_company",
      "similar_challenge",
      "result",
      "company",
      "goal",
      "senderName",
    ],
    isSystemTemplate: true,
  },
] as const

export type SystemTemplate = {
  id: string
  name: string
  category: string
  subject: string
  body: string
  description: string
  variables: readonly string[] // Changed from string[] to readonly string[] to match TEMPLATE_LIBRARY constants
  isSystemTemplate: boolean
}
