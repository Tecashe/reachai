// // ===========================================
// // SEQUENCE MANAGEMENT TYPES
// // ===========================================

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

// export const DEFAULT_PERSONALIZATION_VARIABLES: PersonalizationVariable[] = [
//   {
//     key: "firstName",
//     label: "First Name",
//     defaultValue: "there",
//     category: "contact",
//     description: "Contact's first name",
//   },
//   { key: "lastName", label: "Last Name", defaultValue: "", category: "contact", description: "Contact's last name" },
//   {
//     key: "fullName",
//     label: "Full Name",
//     defaultValue: "there",
//     category: "contact",
//     description: "Contact's full name",
//   },
//   { key: "email", label: "Email", defaultValue: "", category: "contact", description: "Contact's email address" },
//   { key: "company", label: "Company", defaultValue: "your company", category: "company", description: "Company name" },
//   { key: "jobTitle", label: "Job Title", defaultValue: "", category: "company", description: "Contact's job title" },
//   { key: "industry", label: "Industry", defaultValue: "", category: "company", description: "Company industry" },
//   {
//     key: "companySize",
//     label: "Company Size",
//     defaultValue: "",
//     category: "company",
//     description: "Number of employees",
//   },
//   { key: "location", label: "Location", defaultValue: "", category: "contact", description: "Contact's location" },
//   {
//     key: "linkedinUrl",
//     label: "LinkedIn URL",
//     defaultValue: "",
//     category: "contact",
//     description: "LinkedIn profile URL",
//   },
//   {
//     key: "icebreaker",
//     label: "AI Icebreaker",
//     defaultValue: "",
//     category: "ai",
//     description: "AI-generated personalized icebreaker",
//   },
//   { key: "painPoint", label: "Pain Point", defaultValue: "", category: "ai", description: "AI-identified pain point" },
//   {
//     key: "valueProposition",
//     label: "Value Prop",
//     defaultValue: "",
//     category: "ai",
//     description: "AI-generated value proposition",
//   },
// ]
// ===========================================
// SEQUENCE MANAGEMENT TYPES
// ===========================================

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

  // Email fields
  subject?: string | null
  body?: string | null
  bodyHtml?: string | null
  templateId?: string | null

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

  // Call
  callScript?: string | null
  callDuration?: number | null

  // Task
  taskTitle?: string | null
  taskDescription?: string | null
  taskPriority: TaskPriority

  // A/B Variants
  variants?: SequenceStepVariant[]

  // Stats
  sent: number
  delivered: number
  opened: number
  clicked: number
  replied: number
  bounced: number

  // Notes
  internalNotes?: string | null

  createdAt: Date
  updatedAt: Date
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

export interface StepConditions {
  sendIf?: {
    notOpened?: boolean
    notReplied?: boolean
    notClicked?: boolean
    hasOpened?: boolean
    hasClicked?: boolean
    daysInStep?: number
  }
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
