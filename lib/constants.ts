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













//new constants
export interface PremiumTemplate {
  name: string
  industry: string
  category: string
  subject: string
  body: string
  thumbnailQuery: string
  tags: string[]
  variables: string[]
  colorScheme: {
    primary: string
    secondary: string
    accent: string
  }
}

export const PREMIUM_TEMPLATES: PremiumTemplate[] = [
  // SaaS Templates (5)
  {
    name: 'SaaS Product Demo Request',
    industry: 'saas',
    category: 'cold-outreach',
    subject: 'Quick question about {{companyName}}\'s {{painPoint}}',
    body: `Hi {{firstName}},

I noticed {{companyName}} is {{companyContext}}. Many companies in {{industry}} struggle with {{painPoint}}.

We've helped similar companies like {{socialProof}} achieve {{result}} through our platform.

Would you be open to a 15-minute demo to see how we can help {{companyName}}?

Best regards,
{{senderName}}`,
    thumbnailQuery: 'modern SaaS dashboard interface',
    tags: ['b2b', 'demo-request', 'saas'],
    variables: ['firstName', 'companyName', 'painPoint', 'companyContext', 'industry', 'socialProof', 'result', 'senderName'],
    colorScheme: { primary: '#3b82f6', secondary: '#1e40af', accent: '#06b6d4' }
  },
  {
    name: 'Free Trial Activation',
    industry: 'saas',
    category: 'nurture',
    subject: 'Your {{productName}} trial starts now, {{firstName}}',
    body: `Hi {{firstName}},

Welcome to {{productName}}! Your trial is now active.

Here's how to get started in 3 steps:
1. {{step1}}
2. {{step2}}
3. {{step3}}

Need help? Reply to this email or book a time with our team: {{calendarLink}}

To your success,
{{senderName}}`,
    thumbnailQuery: 'welcome onboarding checklist',
    tags: ['trial', 'onboarding', 'welcome'],
    variables: ['firstName', 'productName', 'step1', 'step2', 'step3', 'calendarLink', 'senderName'],
    colorScheme: { primary: '#10b981', secondary: '#059669', accent: '#34d399' }
  },
  {
    name: 'Feature Announcement',
    industry: 'saas',
    category: 'announcement',
    subject: 'New: {{featureName}} is here 🎉',
    body: `Hi {{firstName}},

We just launched {{featureName}} and I think you'll love it.

{{featureDescription}}

This means you can now:
• {{benefit1}}
• {{benefit2}}
• {{benefit3}}

Try it now: {{ctaLink}}

Questions? Just reply to this email.

{{senderName}}`,
    thumbnailQuery: 'product launch announcement',
    tags: ['announcement', 'product-launch'],
    variables: ['firstName', 'featureName', 'featureDescription', 'benefit1', 'benefit2', 'benefit3', 'ctaLink', 'senderName'],
    colorScheme: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
  },
  {
    name: 'Upgrade to Enterprise',
    industry: 'saas',
    category: 'upsell',
    subject: 'Ready to scale? Let\'s talk Enterprise',
    body: `Hi {{firstName}},

I've noticed {{companyName}} has been growing quickly with {{currentPlan}}.

As you scale, you might benefit from our Enterprise features:
→ {{feature1}}
→ {{feature2}}
→ {{feature3}}

Companies like {{socialProof}} upgraded and saw {{result}}.

Would you like to discuss what Enterprise could look like for {{companyName}}?

Best,
{{senderName}}`,
    thumbnailQuery: 'enterprise business growth',
    tags: ['upsell', 'enterprise', 'b2b'],
    variables: ['firstName', 'companyName', 'currentPlan', 'feature1', 'feature2', 'feature3', 'socialProof', 'result', 'senderName'],
    colorScheme: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' }
  },
  {
    name: 'Re-engagement After Trial',
    industry: 'saas',
    category: 'reengagement',
    subject: 'We miss you, {{firstName}}',
    body: `Hi {{firstName}},

I noticed your {{productName}} trial ended on {{trialEndDate}}.

I'd love to understand what didn't work for you. Was it:
• Setup complexity?
• Missing features?
• Budget constraints?
• Something else?

If you're willing to share, I'd appreciate 5 minutes to get your feedback.

And if there's anything we can do to win you back, I'm all ears.

{{senderName}}`,
    thumbnailQuery: 'reconnect conversation',
    tags: ['reengagement', 'feedback', 'follow-up'],
    variables: ['firstName', 'productName', 'trialEndDate', 'senderName'],
    colorScheme: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' }
  },

  // E-commerce Templates (4)
  {
    name: 'Cart Abandonment Recovery',
    industry: 'ecommerce',
    category: 'cart-abandonment',
    subject: 'You left something behind, {{firstName}}',
    body: `Hi {{firstName}},

You left {{itemCount}} item(s) in your cart:

{{cartItems}}

Complete your order now and get {{discount}}% off with code: {{discountCode}}

This offer expires in {{expiryHours}} hours.

Shop now: {{cartLink}}

Happy shopping,
{{storeName}}`,
    thumbnailQuery: 'shopping cart checkout',
    tags: ['ecommerce', 'cart-abandonment', 'discount'],
    variables: ['firstName', 'itemCount', 'cartItems', 'discount', 'discountCode', 'expiryHours', 'cartLink', 'storeName'],
    colorScheme: { primary: '#f97316', secondary: '#ea580c', accent: '#fb923c' }
  },
  {
    name: 'Product Recommendation',
    industry: 'ecommerce',
    category: 'nurture',
    subject: 'You might like these, {{firstName}}',
    body: `Hi {{firstName}},

Based on your recent purchase of {{previousProduct}}, we think you'll love:

{{recommendation1}}
{{recommendation2}}
{{recommendation3}}

Customers who bought {{previousProduct}} also rated these 5 stars.

Browse now: {{shopLink}}

{{storeName}}`,
    thumbnailQuery: 'product recommendations grid',
    tags: ['ecommerce', 'cross-sell', 'recommendation'],
    variables: ['firstName', 'previousProduct', 'recommendation1', 'recommendation2', 'recommendation3', 'shopLink', 'storeName'],
    colorScheme: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' }
  },
  {
    name: 'Back in Stock Alert',
    industry: 'ecommerce',
    category: 'announcement',
    subject: '{{productName}} is back in stock!',
    body: `Hi {{firstName}},

Great news! {{productName}} is back in stock.

You asked to be notified, so here's your exclusive 24-hour early access.

{{productDescription}}

Only {{stockCount}} left. Get yours: {{productLink}}

{{storeName}}`,
    thumbnailQuery: 'product back in stock notification',
    tags: ['ecommerce', 'announcement', 'stock-alert'],
    variables: ['firstName', 'productName', 'productDescription', 'stockCount', 'productLink', 'storeName'],
    colorScheme: { primary: '#ef4444', secondary: '#dc2626', accent: '#f87171' }
  },
  {
    name: 'Seasonal Sale Announcement',
    industry: 'ecommerce',
    category: 'announcement',
    subject: '{{seasonName}} Sale: Up to {{discount}}% off',
    body: `Hi {{firstName}},

Our {{seasonName}} Sale is here!

Save up to {{discount}}% on:
• {{category1}}
• {{category2}}
• {{category3}}

Plus, FREE shipping on orders over {{freeShippingThreshold}}.

Sale ends {{endDate}}. Shop now: {{saleLink}}

{{storeName}}`,
    thumbnailQuery: 'seasonal sale banner',
    tags: ['ecommerce', 'sale', 'announcement'],
    variables: ['firstName', 'seasonName', 'discount', 'category1', 'category2', 'category3', 'freeShippingThreshold', 'endDate', 'saleLink', 'storeName'],
    colorScheme: { primary: '#a855f7', secondary: '#9333ea', accent: '#c084fc' }
  },

  // Real Estate Templates (3)
  {
    name: 'Property Showing Request',
    industry: 'real_estate',
    category: 'property-showing',
    subject: 'New listing in {{neighborhood}}: {{address}}',
    body: `Hi {{firstName}},

Just listed: {{address}}

{{propertyDescription}}

Key features:
• {{feature1}}
• {{feature2}}
• {{feature3}}

Priced at {{price}}

I think this might be perfect for you. Available for showing this {{availableDay}}.

View photos: {{listingLink}}

{{agentName}}
{{agentPhone}}`,
    thumbnailQuery: 'modern house property listing',
    tags: ['real-estate', 'property', 'showing'],
    variables: ['firstName', 'neighborhood', 'address', 'propertyDescription', 'feature1', 'feature2', 'feature3', 'price', 'availableDay', 'listingLink', 'agentName', 'agentPhone'],
    colorScheme: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' }
  },
  {
    name: 'Buyer Lead Follow-Up',
    industry: 'real_estate',
    category: 'follow-up',
    subject: 'Following up on {{neighborhood}} properties',
    body: `Hi {{firstName}},

I wanted to follow up on your interest in {{neighborhood}}.

Since we last spoke, {{updateCount}} new properties matching your criteria have come on the market:

{{property1}}
{{property2}}
{{property3}}

Would you like to schedule showings? I'm available {{availability}}.

View all matches: {{searchLink}}

{{agentName}}
{{agentPhone}}`,
    thumbnailQuery: 'real estate agent meeting',
    tags: ['real-estate', 'follow-up', 'buyer'],
    variables: ['firstName', 'neighborhood', 'updateCount', 'property1', 'property2', 'property3', 'availability', 'searchLink', 'agentName', 'agentPhone'],
    colorScheme: { primary: '#10b981', secondary: '#059669', accent: '#34d399' }
  },
  {
    name: 'Market Update Report',
    industry: 'real_estate',
    category: 'nurture',
    subject: '{{neighborhood}} market update: {{month}} {{year}}',
    body: `Hi {{firstName}},

Here's your {{month}} market update for {{neighborhood}}:

📈 Median Price: {{medianPrice}} ({{priceChange}})
🏠 Days on Market: {{daysOnMarket}} ({{domChange}})
📊 Properties Sold: {{propertiesSold}}

{{marketAnalysis}}

Thinking of buying or selling? Let's talk about what this means for you.

Read full report: {{reportLink}}

{{agentName}}
{{agentPhone}}`,
    thumbnailQuery: 'real estate market data chart',
    tags: ['real-estate', 'nurture', 'market-update'],
    variables: ['firstName', 'neighborhood', 'month', 'year', 'medianPrice', 'priceChange', 'daysOnMarket', 'domChange', 'propertiesSold', 'marketAnalysis', 'reportLink', 'agentName', 'agentPhone'],
    colorScheme: { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa' }
  },

  // Recruiting Templates (3)
  {
    name: 'Passive Candidate Outreach',
    industry: 'recruiting',
    category: 'cold-outreach',
    subject: '{{firstName}}, interested in {{roleTitle}} at {{companyName}}?',
    body: `Hi {{firstName}},

I came across your profile and was impressed by your work at {{currentCompany}}.

We're hiring for {{roleTitle}} at {{companyName}}. The role involves:
• {{responsibility1}}
• {{responsibility2}}
• {{responsibility3}}

Compensation: {{salaryRange}}
Location: {{location}}

Even if you're not looking right now, I'd love to have a quick chat about your career goals.

Interested? Reply here or grab time on my calendar: {{calendarLink}}

{{recruiterName}}
{{companyName}}`,
    thumbnailQuery: 'professional recruitment conversation',
    tags: ['recruiting', 'cold-outreach', 'passive-candidate'],
    variables: ['firstName', 'currentCompany', 'roleTitle', 'companyName', 'responsibility1', 'responsibility2', 'responsibility3', 'salaryRange', 'location', 'calendarLink', 'recruiterName'],
    colorScheme: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' }
  },
  {
    name: 'Interview Invitation',
    industry: 'recruiting',
    category: 'meeting-request',
    subject: 'Next steps: Interview for {{roleTitle}}',
    body: `Hi {{firstName}},

Great news! We'd like to move forward with your application for {{roleTitle}} at {{companyName}}.

Your next step is a {{interviewType}} interview with {{interviewerName}}, our {{interviewerTitle}}.

We'll discuss:
• {{topic1}}
• {{topic2}}
• Your questions about the role and team

Please select a time that works for you: {{schedulingLink}}

The interview will last approximately {{duration}} minutes.

Looking forward to speaking with you!

{{recruiterName}}
{{companyName}}`,
    thumbnailQuery: 'professional interview meeting',
    tags: ['recruiting', 'interview', 'meeting-request'],
    variables: ['firstName', 'roleTitle', 'companyName', 'interviewType', 'interviewerName', 'interviewerTitle', 'topic1', 'topic2', 'schedulingLink', 'duration', 'recruiterName'],
    colorScheme: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
  },
  {
    name: 'Offer Letter',
    industry: 'recruiting',
    category: 'announcement',
    subject: 'Offer: {{roleTitle}} at {{companyName}}',
    body: `Hi {{firstName}},

Congratulations! We're excited to offer you the position of {{roleTitle}} at {{companyName}}.

Offer details:
• Position: {{roleTitle}}
• Start Date: {{startDate}}
• Compensation: {{salary}}/year
• Benefits: {{benefits}}
• Reporting to: {{managerName}}

Your formal offer letter is attached. Please review and sign by {{offerExpiry}}.

We can't wait to have you on the team!

Questions? Call me directly: {{recruiterPhone}}

{{recruiterName}}
{{companyName}}`,
    thumbnailQuery: 'celebration congratulations',
    tags: ['recruiting', 'offer', 'announcement'],
    variables: ['firstName', 'roleTitle', 'companyName', 'startDate', 'salary', 'benefits', 'managerName', 'offerExpiry', 'recruiterPhone', 'recruiterName'],
    colorScheme: { primary: '#10b981', secondary: '#059669', accent: '#34d399' }
  },

  // Consulting Templates (2)
  {
    name: 'Consulting Services Intro',
    industry: 'consulting',
    category: 'cold-outreach',
    subject: 'Helping {{companyName}} with {{painPoint}}',
    body: `Hi {{firstName}},

I noticed {{companyName}} is {{companyContext}}.

We specialize in helping {{industry}} companies solve {{painPoint}}.

Recent client example:
{{clientName}} was struggling with {{clientProblem}}. We helped them achieve:
• {{result1}}
• {{result2}}
• {{result3}}

Would a brief conversation make sense?

{{consultantName}}
{{consultingFirm}}`,
    thumbnailQuery: 'business consulting strategy',
    tags: ['consulting', 'cold-outreach', 'b2b'],
    variables: ['firstName', 'companyName', 'painPoint', 'companyContext', 'industry', 'clientName', 'clientProblem', 'result1', 'result2', 'result3', 'consultantName', 'consultingFirm'],
    colorScheme: { primary: '#3b82f6', secondary: '#2563eb', accent: '#60a5fa' }
  },
  {
    name: 'Project Proposal Follow-Up',
    industry: 'consulting',
    category: 'follow-up',
    subject: 'Re: Proposal for {{projectName}}',
    body: `Hi {{firstName}},

Following up on the proposal I sent last {{daysSent}}.

To recap, we proposed:
• {{deliverable1}}
• {{deliverable2}}
• {{deliverable3}}

Timeline: {{timeline}}
Investment: {{budget}}

Do you have any questions? I'm happy to jump on a call to discuss.

{{consultantName}}
{{consultingFirm}}`,
    thumbnailQuery: 'business proposal meeting',
    tags: ['consulting', 'follow-up', 'proposal'],
    variables: ['firstName', 'projectName', 'daysSent', 'deliverable1', 'deliverable2', 'deliverable3', 'timeline', 'budget', 'consultantName', 'consultingFirm'],
    colorScheme: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' }
  },

  // Healthcare Templates (2)
  {
    name: 'Patient Appointment Reminder',
    industry: 'healthcare',
    category: 'meeting-request',
    subject: 'Appointment reminder: {{appointmentDate}} at {{appointmentTime}}',
    body: `Hi {{firstName}},

This is a reminder of your upcoming appointment:

Date: {{appointmentDate}}
Time: {{appointmentTime}}
Provider: Dr. {{providerName}}
Location: {{clinicAddress}}

Please arrive 15 minutes early to complete check-in.

Need to reschedule? Call us at {{clinicPhone}} or reply to this email.

{{clinicName}}`,
    thumbnailQuery: 'medical clinic appointment',
    tags: ['healthcare', 'appointment', 'reminder'],
    variables: ['firstName', 'appointmentDate', 'appointmentTime', 'providerName', 'clinicAddress', 'clinicPhone', 'clinicName'],
    colorScheme: { primary: '#06b6d4', secondary: '#0891b2', accent: '#22d3ee' }
  },
  {
    name: 'Health Screening Invitation',
    industry: 'healthcare',
    category: 'nurture',
    subject: 'It\'s time for your {{screeningType}} screening',
    body: `Hi {{firstName}},

Our records show you're due for your annual {{screeningType}} screening.

Why it matters:
{{screeningBenefits}}

We have appointments available:
• {{date1}}
• {{date2}}
• {{date3}}

Schedule now: {{schedulingLink}}
Or call: {{clinicPhone}}

Your health is our priority.

{{clinicName}}`,
    thumbnailQuery: 'healthcare wellness checkup',
    tags: ['healthcare', 'screening', 'wellness'],
    variables: ['firstName', 'screeningType', 'screeningBenefits', 'date1', 'date2', 'date3', 'schedulingLink', 'clinicPhone', 'clinicName'],
    colorScheme: { primary: '#10b981', secondary: '#059669', accent: '#34d399' }
  },

  // Finance Templates (2)
  {
    name: 'Financial Planning Consultation',
    industry: 'finance',
    category: 'cold-outreach',
    subject: 'Planning for {{financialGoal}}?',
    body: `Hi {{firstName}},

Are you on track for {{financialGoal}}?

Many {{profession}} professionals we work with are surprised to learn they could:
• {{benefit1}}
• {{benefit2}}
• {{benefit3}}

I'd love to offer you a complimentary financial review (no obligation).

We'll analyze your current situation and identify opportunities.

Book your review: {{calendarLink}}

{{advisorName}}
{{firmName}}`,
    thumbnailQuery: 'financial planning consultation',
    tags: ['finance', 'cold-outreach', 'consulting'],
    variables: ['firstName', 'financialGoal', 'profession', 'benefit1', 'benefit2', 'benefit3', 'calendarLink', 'advisorName', 'firmName'],
    colorScheme: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24' }
  },
  {
    name: 'Quarterly Portfolio Update',
    industry: 'finance',
    category: 'nurture',
    subject: 'Your Q{{quarter}} portfolio performance',
    body: `Hi {{firstName}},

Here's your Q{{quarter}} {{year}} portfolio update:

Portfolio Value: {{portfolioValue}} ({{change}})

Performance highlights:
• {{highlight1}}
• {{highlight2}}
• {{highlight3}}

Market outlook:
{{marketOutlook}}

Let's schedule your quarterly review: {{calendarLink}}

{{advisorName}}
{{firmName}}`,
    thumbnailQuery: 'investment portfolio dashboard',
    tags: ['finance', 'nurture', 'report'],
    variables: ['firstName', 'quarter', 'year', 'portfolioValue', 'change', 'highlight1', 'highlight2', 'highlight3', 'marketOutlook', 'calendarLink', 'advisorName', 'firmName'],
    colorScheme: { primary: '#14b8a6', secondary: '#0d9488', accent: '#2dd4bf' }
  },

  // Nonprofit Templates (2)
  {
    name: 'Donation Appeal',
    industry: 'nonprofit',
    category: 'cold-outreach',
    subject: 'Help us {{mission}} this {{season}}',
    body: `Hi {{firstName}},

This {{season}}, we're working to {{mission}}.

Last year, donors like you helped us:
• {{impact1}}
• {{impact2}}
• {{impact3}}

Your donation of {{suggestedAmount}} could {{specificImpact}}.

Every contribution makes a difference.

Donate now: {{donationLink}}

With gratitude,
{{organizationName}}`,
    thumbnailQuery: 'nonprofit community impact',
    tags: ['nonprofit', 'donation', 'fundraising'],
    variables: ['firstName', 'mission', 'season', 'impact1', 'impact2', 'impact3', 'suggestedAmount', 'specificImpact', 'donationLink', 'organizationName'],
    colorScheme: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6' }
  },
  {
    name: 'Volunteer Recruitment',
    industry: 'nonprofit',
    category: 'cold-outreach',
    subject: 'Volunteer with us: {{opportunityName}}',
    body: `Hi {{firstName}},

We're looking for volunteers for {{opportunityName}}.

What you'll do:
• {{activity1}}
• {{activity2}}
• {{activity3}}

When: {{dates}}
Where: {{location}}
Time commitment: {{timeCommitment}}

Join {{volunteerCount}} others making a difference.

Sign up: {{signupLink}}

{{organizationName}}`,
    thumbnailQuery: 'volunteers community service',
    tags: ['nonprofit', 'volunteer', 'recruiting'],
    variables: ['firstName', 'opportunityName', 'activity1', 'activity2', 'activity3', 'dates', 'location', 'timeCommitment', 'volunteerCount', 'signupLink', 'organizationName'],
    colorScheme: { primary: '#8b5cf6', secondary: '#7c3aed', accent: '#a78bfa' }
  },
]
