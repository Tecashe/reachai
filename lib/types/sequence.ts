



// export type SequenceStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED"

// export type StepType =
//   | "EMAIL"
//   | "LINKEDIN_CONNECT"
//   | "LINKEDIN_MESSAGE"
//   | "LINKEDIN_VIEW"
//   | "CALL"
//   | "TASK"
//   | "DELAY"
//   | "CONDITION"

// export type DelayUnit = "MINUTES" | "HOURS" | "DAYS" | "WEEKS"

// export type LinkedInAction = "VIEW_PROFILE" | "SEND_CONNECTION" | "SEND_MESSAGE" | "SEND_INMAIL"

// export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

// export type EnrollmentStatus =
//   | "ACTIVE"
//   | "PAUSED"
//   | "COMPLETED"
//   | "BOUNCED"
//   | "REPLIED"
//   | "UNSUBSCRIBED"
//   | "MANUALLY_REMOVED"

// export type ABTestMetric = "OPEN_RATE" | "CLICK_RATE" | "REPLY_RATE" | "POSITIVE_REPLY_RATE"

// export type AutomationTrigger =
//   | "REPLY_RECEIVED"
//   | "POSITIVE_REPLY"
//   | "NEGATIVE_REPLY"
//   | "NO_OPEN"
//   | "NO_REPLY"
//   | "LINK_CLICKED"
//   | "STEP_COMPLETED"
//   | "GOAL_MET"

// // ===========================================
// // MAIN INTERFACES
// // ===========================================

// export interface Sequence {
//   id: string
//   userId: string
//   name: string
//   description?: string | null
//   status: SequenceStatus

//   // Settings
//   timezone: string
//   sendInBusinessHours: boolean
//   businessHoursStart: string
//   businessHoursEnd: string
//   businessDays: number[]

//   // Deliverability
//   dailySendLimit: number
//   minDelayBetweenSends: number
//   trackOpens: boolean
//   trackClicks: boolean

//   // Multi-channel
//   enableLinkedIn: boolean
//   enableCalls: boolean
//   enableTasks: boolean

//   // A/B Testing
//   enableABTesting: boolean
//   abTestWinnerMetric: ABTestMetric
//   abTestSampleSize: number
//   abTestDuration: number

//   // AI
//   aiOptimizeSendTime: boolean
//   aiPersonalization: boolean
//   toneOfVoice: string

//   // Stats
//   totalSteps: number
//   totalEnrolled: number
//   totalCompleted: number
//   avgOpenRate?: number | null
//   avgReplyRate?: number | null
//   avgClickRate?: number | null

//   // Organization
//   folderId?: string | null
//   tags: string[]

//   // Relationships
//   steps?: SequenceStep[]

//   // Timestamps
//   archivedAt?: Date | null
//   createdAt: Date
//   updatedAt: Date
// }

// export interface SequenceStep {
//   id: string
//   sequenceId: string
//   order: number
//   stepType: StepType

//   // Timing
//   delayValue: number
//   delayUnit: DelayUnit

//   // Email fields
//   subject?: string | null
//   body?: string | null
//   bodyHtml?: string | null
//   templateId?: string | null

//   // Personalization
//   variables?: Record<string, string> | null
//   spintaxEnabled: boolean

//   // Conditions
//   conditions?: StepConditions | null
//   skipIfReplied: boolean
//   skipIfBounced: boolean

//   // LinkedIn
//   linkedInAction?: LinkedInAction | null
//   linkedInMessage?: string | null

//   // Call
//   callScript?: string | null
//   callDuration?: number | null

//   // Task
//   taskTitle?: string | null
//   taskDescription?: string | null
//   taskPriority: TaskPriority

//   // A/B Variants
//   variants?: SequenceStepVariant[]

//   // Stats
//   sent: number
//   delivered: number
//   opened: number
//   clicked: number
//   replied: number
//   bounced: number

//   // Notes
//   internalNotes?: string | null

//   createdAt: Date
//   updatedAt: Date
// }

// export interface SequenceStepVariant {
//   id: string
//   stepId: string
//   variantName: string
//   weight: number
//   subject?: string | null
//   body?: string | null
//   sent: number
//   opened: number
//   clicked: number
//   replied: number
//   isWinner: boolean
//   winnerSelectedAt?: Date | null
//   createdAt: Date
//   updatedAt: Date
// }

// export interface StepConditions {
//   sendIf?: {
//     notOpened?: boolean
//     notReplied?: boolean
//     notClicked?: boolean
//     hasOpened?: boolean
//     hasClicked?: boolean
//     daysInStep?: number
//   }
// }

// export interface SequenceEnrollment {
//   id: string
//   sequenceId: string
//   prospectId: string
//   status: EnrollmentStatus
//   currentStep: number
//   variantId?: string | null
//   enrolledAt: Date
//   nextStepAt?: Date | null
//   completedAt?: Date | null
//   pausedAt?: Date | null
//   exitReason?: string | null
//   exitedAt?: Date | null
//   emailsSent: number
//   emailsOpened: number
//   emailsClicked: number
//   replied: boolean
//   repliedAt?: Date | null
//   createdAt: Date
//   updatedAt: Date
// }

// export interface SequenceFolder {
//   id: string
//   userId: string
//   name: string
//   color: string
//   icon: string
//   parentId?: string | null
//   sequenceCount?: number
//   createdAt: Date
//   updatedAt: Date
// }

// export interface SequenceAutomation {
//   id: string
//   sequenceId: string
//   name: string
//   description?: string | null
//   isActive: boolean
//   trigger: AutomationTrigger
//   triggerConfig?: Record<string, unknown> | null
//   conditions?: Record<string, unknown> | null
//   actions: AutomationAction[]
//   timesTriggered: number
//   lastTriggeredAt?: Date | null
//   createdAt: Date
//   updatedAt: Date
// }

// export interface AutomationAction {
//   type: "SEND_EMAIL" | "PAUSE" | "MOVE_TO_SEQUENCE" | "ADD_TAG" | "NOTIFY" | "UPDATE_CRM" | "WEBHOOK"
//   config: Record<string, unknown>
// }

// // ===========================================
// // UI STATE INTERFACES
// // ===========================================

// export interface SequenceBuilderState {
//   sequence: Sequence | null
//   selectedStepId: string | null
//   isEditing: boolean
//   isDragging: boolean
//   zoomLevel: number
//   canvasOffset: { x: number; y: number }
// }

// export interface PersonalizationVariable {
//   key: string
//   label: string
//   defaultValue: string
//   category: "contact" | "company" | "custom" | "ai"
//   description?: string
// }

// export const DEFAULT_PERSONALIZATION_VARIABLES: Record<string, PersonalizationVariable[]> = {
//   contact: [
//     {
//       key: "firstName",
//       label: "First Name",
//       defaultValue: "there",
//       category: "contact",
//       description: "Contact's first name",
//     },
//     { key: "lastName", label: "Last Name", defaultValue: "", category: "contact", description: "Contact's last name" },
//     {
//       key: "fullName",
//       label: "Full Name",
//       defaultValue: "there",
//       category: "contact",
//       description: "Contact's full name",
//     },
//     { key: "email", label: "Email", defaultValue: "", category: "contact", description: "Contact's email address" },
//     { key: "location", label: "Location", defaultValue: "", category: "contact", description: "Contact's location" },
//     {
//       key: "linkedinUrl",
//       label: "LinkedIn URL",
//       defaultValue: "",
//       category: "contact",
//       description: "LinkedIn profile URL",
//     },
//   ],
//   company: [
//     {
//       key: "company",
//       label: "Company",
//       defaultValue: "your company",
//       category: "company",
//       description: "Company name",
//     },
//     { key: "jobTitle", label: "Job Title", defaultValue: "", category: "company", description: "Contact's job title" },
//     { key: "industry", label: "Industry", defaultValue: "", category: "company", description: "Company industry" },
//     {
//       key: "companySize",
//       label: "Company Size",
//       defaultValue: "",
//       category: "company",
//       description: "Number of employees",
//     },
//   ],
//   ai: [
//     {
//       key: "icebreaker",
//       label: "AI Icebreaker",
//       defaultValue: "",
//       category: "ai",
//       description: "AI-generated personalized icebreaker",
//     },
//     {
//       key: "painPoint",
//       label: "Pain Point",
//       defaultValue: "",
//       category: "ai",
//       description: "AI-identified pain point",
//     },
//     {
//       key: "valueProposition",
//       label: "Value Prop",
//       defaultValue: "",
//       category: "ai",
//       description: "AI-generated value proposition",
//     },
//   ],
// }

// export type { EnhancedEmailTemplate } from "@/lib/types"
export type SequenceStatus = "DRAFT" | "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED"

export type StepType =
  | "EMAIL"
  | "LINKEDIN_CONNECT"
  | "LINKEDIN_MESSAGE"
  | "LINKEDIN_VIEW"
  | "CALL"
  | "TASK"
  | "DELAY"
  | "CONDITION"
  // New node types
  | "AB_SPLIT"
  | "WAIT_UNTIL"
  | "EXIT_TRIGGER"
  | "MANUAL_REVIEW"
  | "MULTI_CHANNEL_TOUCH"
  | "MULTI_CHANNEL_TOUCH" 
  | "BEHAVIOR_BRANCH"
  | "RANDOM_VARIANT"
  | "CONTENT_REFERENCE"
  | "VOICEMAIL_DROP"
  | "DIRECT_MAIL"

export type DelayUnit = "MINUTES" | "HOURS" | "DAYS" | "WEEKS"

export type LinkedInAction = "VIEW_PROFILE" | "SEND_CONNECTION" | "SEND_MESSAGE" | "SEND_INMAIL"

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT"

export type EnrollmentStatus =
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "BOUNCED"
  | "REPLIED"
  | "UNSUBSCRIBED"
  | "MANUALLY_REMOVED"

export type ABTestMetric = "OPEN_RATE" | "CLICK_RATE" | "REPLY_RATE" | "POSITIVE_REPLY_RATE"

export type AutomationTrigger =
  | "REPLY_RECEIVED"
  | "POSITIVE_REPLY"
  | "NEGATIVE_REPLY"
  | "NO_OPEN"
  | "NO_REPLY"
  | "LINK_CLICKED"
  | "STEP_COMPLETED"
  | "GOAL_MET"

export type WaitConditionType = "EMAIL_OPENED" | "LINK_CLICKED" | "LINKEDIN_VIEWED" | "SPECIFIC_TIME" | "SPECIFIC_DAYS"

export type WaitFallbackAction = "SKIP" | "CONTINUE" | "EXIT_SEQUENCE"

export type ExitCondition =
  | "ANY_REPLY"
  | "POSITIVE_REPLY"
  | "NEGATIVE_REPLY"
  | "MEETING_BOOKED"
  | "PAGE_VISITED"
  | "EMAIL_BOUNCED"
  | "UNSUBSCRIBED"
  | "LINK_CLICKED"
  | "WEBHOOK_RESPONSE"

export type ExitAction = "REMOVE_FROM_SEQUENCE" | "MOVE_TO_SEQUENCE" | "UPDATE_CRM" | "NOTIFY_TEAM" | "ADD_TAG"

export type ReviewAction = "APPROVE" | "SKIP_NEXT" | "REMOVE" | "EDIT_NEXT"

export type BehaviorCondition = "OPENED_EMAIL" | "NOT_OPENED" | "CLICKED_LINK" | "NOT_CLICKED" | "NO_ACTION" | "REPLIED"

export type CallOutcome =
  | "CONNECTED"
  | "VOICEMAIL"
  | "NO_ANSWER"
  | "WRONG_NUMBER"
  | "GATEKEEPER"
  | "BUSY"
  | "CALLBACK_REQUESTED"

// ===========================================
// MAIN INTERFACES
// ===========================================

export interface Sequence {
  id: string
  userId: string
  name: string
  description?: string | null
  status: SequenceStatus

  // Settings
  timezone: string
  sendInBusinessHours: boolean
  businessHoursStart: string
  businessHoursEnd: string
  businessDays: number[]

  // Deliverability
  dailySendLimit: number
  minDelayBetweenSends: number
  trackOpens: boolean
  trackClicks: boolean

  // Multi-channel
  enableLinkedIn: boolean
  enableCalls: boolean
  enableTasks: boolean

  // A/B Testing
  enableABTesting: boolean
  abTestWinnerMetric: ABTestMetric
  abTestSampleSize: number
  abTestDuration: number

  // AI
  aiOptimizeSendTime: boolean
  aiPersonalization: boolean
  toneOfVoice: string

  // Stats
  totalSteps: number
  totalExited: number
  totalEnrolled: number
  totalCompleted: number
  avgOpenRate?: number | null
  avgReplyRate?: number | null
  avgClickRate?: number | null

  // Organization
  folderId?: string | null
  tags: string[]

  // Relationships
  steps?: SequenceStep[]

  // Timestamps
  archivedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SequenceStep {
  id: string
  sequenceId: string
  order: number
  stepType: StepType

  // Timing
  delayValue: number
  delayUnit: DelayUnit

  businessDaysOnly?: boolean
  randomizeDelay?: boolean
  delayRandomMin?: number
  delayRandomMax?: number
  sendAtTime?: string | null

  
  reviewNote?: string
  estimatedTime?: number
  requireProof?: boolean
  bestTimeToCall?: string

  useInMail?: boolean
  dailyLimit?: number

  // Email fields
  subject?: string | null
  body?: string | null
  bodyHtml?: string | null
  templateId?: string | null

  preHeaderText?: string | null
  customFromName?: string | null
  replyToAddress?: string | null
  signatureId?: string | null
  spamScore?: number | null
  aiOptimizeSendTime?: boolean
  trackSpecificLinks?: Record<string, string> | null

  // Personalization
  variables?: Record<string, string> | null
  spintaxEnabled: boolean

  // Conditions
  conditions?: StepConditions | null
  skipIfReplied: boolean
  skipIfBounced: boolean

  // LinkedIn
  linkedInAction?: LinkedInAction | null
  linkedInMessage?: string | null
  linkedInConnectionNote?: string | null
  linkedInSafetyLimits?: boolean
  linkedInInMailEnabled?: boolean

  // Call
  callScript?: string | null
  callDuration?: number | null
  callOutcome?: CallOutcome | null
  callBestTimeEnabled?: boolean
  callRecordingUrl?: string | null
  callDispositionCodes?: string[] | null


  // Task
  taskTitle?: string | null
  taskDescription?: string | null
  taskPriority: TaskPriority
  taskEstimatedTime?: number | null
  taskTemplateId?: string | null
  taskRequiresProof?: boolean

  // A/B Variants
  variants?: SequenceStepVariant[]

  abSplitConfig?: ABSplitConfig | null

  waitUntilConfig?: WaitUntilConfig | null

  exitTriggerConfig?: ExitTriggerConfig | null

  manualReviewConfig?: ManualReviewConfig | null

  multiChannelConfig?: MultiChannelConfig | null

  behaviorBranchConfig?: BehaviorBranchConfig | null

  randomVariantConfig?: RandomVariantConfig | null

  contentReferenceConfig?: ContentReferenceConfig | null

  voicemailDropConfig?: VoicemailDropConfig | null

  directMailConfig?: DirectMailConfig | null

  // Stats
  sent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  bounced: number

  skipped?: number
  exited?: number
  avgTimeAtStep?: number | null
  conversionRate?: number | null

  // Notes
  internalNotes?: string | null

  isEnabled?: boolean
  versionHistory?: StepVersionHistory[] | null
  teamNotes?: StepTeamNote[] | null
  lastEditedBy?: string | null
  lastEditedAt?: Date | null

  createdAt: Date
  updatedAt: Date
}

export interface ABSplitConfig {
  branches: ABSplitBranch[]
  autoSelectWinner: boolean
  winnerThreshold: number // number of sends before selecting winner
  mergeAfter: boolean // whether branches merge back
}

export interface ABSplitBranch {
  id: string
  name: string
  trafficPercent: number
  targetStepId?: string | null // next step in this branch
  stats: {
    entered: number
    converted: number
  }
}

export interface WaitUntilConfig {
  conditionType: WaitConditionType
  maxWaitDays: number
  specificDays?: number[] // 0-6 for Sun-Sat
  specificTimeStart?: string
  specificTimeEnd?: string
  avoidDateRanges?: { start: string; end: string }[]
  fallbackAction: WaitFallbackAction
  useProspectTimezone?: boolean
}

export interface ExitTriggerConfig {
  conditions: ExitCondition[]
  pageVisitedUrl?: string | null
  linkClickedUrl?: string | null
  webhookEndpoint?: string | null
  actions: ExitTriggerAction[]
}

export interface ExitTriggerAction {
  type: ExitAction
  config: Record<string, unknown>
}

export interface ManualReviewConfig {
  notifyUserId?: string | null
  notifyEmail?: string | null
  notifySlackChannel?: string | null
  autoApproveAfterDays?: number | null
  reviewInstructions?: string | null
  pendingCount?: number
}

export interface MultiChannelConfig {
  touches: MultiChannelTouch[]
  executeSimultaneously: boolean
  delayBetweenTouches?: number // in minutes
}

export interface MultiChannelTouch {
  id: string
  type: "EMAIL" | "LINKEDIN_VIEW" | "LINKEDIN_CONNECT" | "LINKEDIN_MESSAGE" | "CALL"
  order: number
  delayFromPrevious?: number
  config: Record<string, unknown>
}

export interface BehaviorBranchConfig {
  branches: BehaviorBranchPath[]
  evaluationPeriodDays: number
  defaultBranchId?: string | null
}

export interface BehaviorBranchPath {
  id: string
  name: string
  condition: BehaviorCondition
  daysToWait?: number
  targetStepId?: string | null
  stats: {
    entered: number
    converted: number
  }
}

export interface RandomVariantConfig {
  variants: RandomVariantOption[]
  variationType: "subject" | "opening" | "signoff" | "full_email"
}

export interface RandomVariantOption {
  id: string
  content: string
  usageCount: number
}

export interface ContentReferenceConfig {
  resourceType: "blog" | "video" | "case_study" | "whitepaper" | "custom"
  resourceUrl: string
  resourceTitle: string
  trackingEnabled: boolean
  followUpTriggers: {
    onClicked?: string | null // step id to go to
    onDownloaded?: string | null
    onTimeSpent?: { seconds: number; stepId: string } | null
  }
}

export interface VoicemailDropConfig {
  audioUrl?: string | null
  ttsMessage?: string | null
  useTts: boolean
  personalizeWithVariables: boolean
  integrationId?: string | null
}

export interface DirectMailConfig {
  mailType: "handwritten_note" | "postcard" | "lumpy_mail"
  message: string
  integrationId?: string | null
  useProspectAddress: boolean
  followUpEmailEnabled: boolean
  followUpDelay?: number
}

export interface StepVersionHistory {
  id: string
  changedAt: Date
  changedBy: string
  changes: Record<string, { old: unknown; new: unknown }>
}

export interface StepTeamNote {
  id: string
  userId: string
  userName: string
  content: string
  createdAt: Date
}

export interface StepConditions {
  sendIf?: {
    notOpened?: boolean
    notReplied?: boolean
    notClicked?: boolean
    hasOpened?: boolean
    hasClicked?: boolean
    daysInStep?: number
    // New conditions
    jobTitleContains?: string
    companySizeGreaterThan?: number
    industryCodes?: string[]
    leadScoreGreaterThan?: number
    crmStageEquals?: string
    customFieldEquals?: Record<string, string>
    webhookReturnsTrue?: string
  }
  // Boolean logic
  logicOperator?: "AND" | "OR"
}

export interface SequenceStepVariant {
  id: string
  stepId: string
  variantName: string
  weight: number
  subject?: string | null
  body?: string | null
  sent: number
  opened: number
  clicked: number
  replied: number
  isWinner: boolean
  winnerSelectedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface SequenceEnrollment {
  id: string
  sequenceId: string
  prospectId: string
  status: EnrollmentStatus
  currentStep: number
  variantId?: string | null
  enrolledAt: Date
  nextStepAt?: Date | null
  completedAt?: Date | null
  pausedAt?: Date | null
  exitReason?: string | null
  exitedAt?: Date | null
  emailsSent: number
  emailsOpened: number
  emailsClicked: number
  replied: boolean
  repliedAt?: Date | null
  createdAt: Date
  updatedAt: Date

  currentStepIndex: number  
  resumedAt?: Date | null  
  lastActivityAt?: Date | null  
  linksClicked: number  
  metadata?: Record<string, any> | null  
}

export interface SequenceFolder {
  id: string
  userId: string
  name: string
  color: string
  icon: string
  parentId?: string | null
  sequenceCount?: number
  createdAt: Date
  updatedAt: Date
}

export interface SequenceAutomation {
  id: string
  sequenceId: string
  name: string
  description?: string | null
  isActive: boolean
  trigger: AutomationTrigger
  triggerConfig?: Record<string, unknown> | null
  conditions?: Record<string, unknown> | null
  actions: AutomationAction[]
  timesTriggered: number
  lastTriggeredAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface AutomationAction {
  type: "SEND_EMAIL" | "PAUSE" | "MOVE_TO_SEQUENCE" | "ADD_TAG" | "NOTIFY" | "UPDATE_CRM" | "WEBHOOK"
  config: Record<string, unknown>
}

// ===========================================
// UI STATE INTERFACES
// ===========================================

export interface SequenceBuilderState {
  sequence: Sequence | null
  selectedStepId: string | null
  isEditing: boolean
  isDragging: boolean
  zoomLevel: number
  canvasOffset: { x: number; y: number }
}

export interface PersonalizationVariable {
  key: string
  label: string
  defaultValue: string
  category: "contact" | "company" | "custom" | "ai"
  description?: string
}

export const DEFAULT_PERSONALIZATION_VARIABLES: Record<string, PersonalizationVariable[]> = {
  contact: [
    {
      key: "firstName",
      label: "First Name",
      defaultValue: "there",
      category: "contact",
      description: "Contact's first name",
    },
    { key: "lastName", label: "Last Name", defaultValue: "", category: "contact", description: "Contact's last name" },
    {
      key: "fullName",
      label: "Full Name",
      defaultValue: "there",
      category: "contact",
      description: "Contact's full name",
    },
    { key: "email", label: "Email", defaultValue: "", category: "contact", description: "Contact's email address" },
    { key: "location", label: "Location", defaultValue: "", category: "contact", description: "Contact's location" },
    {
      key: "linkedinUrl",
      label: "LinkedIn URL",
      defaultValue: "",
      category: "contact",
      description: "LinkedIn profile URL",
    },
  ],
  company: [
    {
      key: "company",
      label: "Company",
      defaultValue: "your company",
      category: "company",
      description: "Company name",
    },
    { key: "jobTitle", label: "Job Title", defaultValue: "", category: "company", description: "Contact's job title" },
    { key: "industry", label: "Industry", defaultValue: "", category: "company", description: "Company industry" },
    {
      key: "companySize",
      label: "Company Size",
      defaultValue: "",
      category: "company",
      description: "Number of employees",
    },
  ],
  ai: [
    {
      key: "icebreaker",
      label: "AI Icebreaker",
      defaultValue: "",
      category: "ai",
      description: "AI-generated personalized icebreaker",
    },
    {
      key: "painPoint",
      label: "Pain Point",
      defaultValue: "",
      category: "ai",
      description: "AI-identified pain point",
    },
    {
      key: "valueProposition",
      label: "Value Prop",
      defaultValue: "",
      category: "ai",
      description: "AI-generated value proposition",
    },
  ],
}

export const STEP_TYPE_CONFIG: Record<
  StepType,
  {
    label: string
    description: string
    color: string
    bgColor: string
    borderColor: string
    category: "core" | "linkedin" | "multichannel" | "automation" | "advanced"
  }
> = {
  EMAIL: {
    label: "Email",
    description: "Send an automated email",
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    category: "core",
  },
  DELAY: {
    label: "Delay",
    description: "Wait before next step",
    color: "text-gray-600",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    category: "core",
  },
  LINKEDIN_VIEW: {
    label: "LinkedIn View",
    description: "View prospect's LinkedIn profile",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    category: "linkedin",
  },
  LINKEDIN_CONNECT: {
    label: "LinkedIn Connect",
    description: "Send connection request",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    category: "linkedin",
  },
  LINKEDIN_MESSAGE: {
    label: "LinkedIn Message",
    description: "Send LinkedIn message",
    color: "text-sky-600",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/30",
    category: "linkedin",
  },
  CALL: {
    label: "Call",
    description: "Create call task",
    color: "text-green-600",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    category: "multichannel",
  },
  TASK: {
    label: "Task",
    description: "Create manual task",
    color: "text-purple-600",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
    category: "multichannel",
  },
  CONDITION: {
    label: "Condition",
    description: "Branch based on conditions",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500/10",
    borderColor: "border-yellow-500/30",
    category: "automation",
  },
  AB_SPLIT: {
    label: "A/B Split",
    description: "Split into multiple test paths",
    color: "text-indigo-600",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
    category: "advanced",
  },
  WAIT_UNTIL: {
    label: "Wait Until",
    description: "Smart conditional waiting",
    color: "text-orange-600",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    category: "automation",
  },
  EXIT_TRIGGER: {
    label: "Exit Trigger",
    description: "Auto-remove from sequence",
    color: "text-red-600",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
    category: "automation",
  },
  MANUAL_REVIEW: {
    label: "Manual Review",
    description: "Pause for human approval",
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    category: "automation",
  },
  MULTI_CHANNEL_TOUCH: {
    label: "Multi-Channel",
    description: "Multiple touches at once",
    color: "text-cyan-600",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
    category: "multichannel",
  },
  BEHAVIOR_BRANCH: {
    label: "Behavior Branch",
    description: "Branch based on engagement",
    color: "text-emerald-600",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    category: "automation",
  },
  RANDOM_VARIANT: {
    label: "Random Variant",
    description: "Add natural variation",
    color: "text-fuchsia-600",
    bgColor: "bg-fuchsia-500/10",
    borderColor: "border-fuchsia-500/30",
    category: "advanced",
  },
  CONTENT_REFERENCE: {
    label: "Content Reference",
    description: "Track content engagement",
    color: "text-teal-600",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
    category: "advanced",
  },
  VOICEMAIL_DROP: {
    label: "Voicemail Drop",
    description: "Leave ringless voicemail",
    color: "text-rose-600",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/30",
    category: "multichannel",
  },
  DIRECT_MAIL: {
    label: "Direct Mail",
    description: "Send physical mail",
    color: "text-violet-600",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/30",
    category: "multichannel",
  },
}

export type { EnhancedEmailTemplate } from "@/lib/types"