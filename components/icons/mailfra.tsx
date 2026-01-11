import { forwardRef, type SVGProps } from "react"

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string
  strokeWidth?: number | string
  absoluteStrokeWidth?: boolean
}

// Variation 1: SendPulse - Envelope with motion lines showing outreach
export const MailfraSendPulse = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, strokeWidth = 2, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Envelope body */}
        <path d="M3 8l9 6 9-6" />
        <rect x="3" y="6" width="18" height="13" rx="2" />
        {/* Motion/send lines */}
        <line x1="21" y1="4" x2="23" y2="2" strokeWidth={Number(strokeWidth) * 0.8} />
        <line x1="18" y1="3" x2="19" y2="1" strokeWidth={Number(strokeWidth) * 0.8} />
        <line x1="22" y1="8" x2="24" y2="7" strokeWidth={Number(strokeWidth) * 0.8} />
      </svg>
    )
  },
)
MailfraSendPulse.displayName = "MailfraSendPulse"

// Variation 2: OutreachArrow - Open envelope with upward arrow (growth/outreach)
export const MailfraOutreach = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, strokeWidth = 2, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Open envelope base */}
        <path d="M3 10v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V10" />
        {/* Envelope flap open */}
        <path d="M3 10l9 5 9-5" />
        <path d="M3 10l9-7 9 7" />
        {/* Arrow shooting up from center */}
        <line x1="12" y1="14" x2="12" y2="2" />
        <polyline points="8,6 12,2 16,6" />
      </svg>
    )
  },
)
MailfraOutreach.displayName = "MailfraOutreach"

// Variation 3: ColdMail - Envelope with stacked copies (mass outreach)
export const MailfraCold = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, strokeWidth = 2, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Back envelope shadow */}
        <rect x="5" y="4" width="16" height="11" rx="1.5" strokeWidth={Number(strokeWidth) * 0.6} opacity="0.4" />
        {/* Middle envelope shadow */}
        <rect x="3.5" y="6" width="16" height="11" rx="1.5" strokeWidth={Number(strokeWidth) * 0.75} opacity="0.6" />
        {/* Front envelope */}
        <rect x="2" y="8" width="16" height="11" rx="2" />
        <path d="M2 10l8 5 8-5" />
      </svg>
    )
  },
)
MailfraCold.displayName = "MailfraCold"

// Variation 4: ConnectMail - Envelope with network dots (connection building)
export const MailfraConnect = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, strokeWidth = 2, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Envelope */}
        <rect x="2" y="7" width="14" height="11" rx="2" />
        <path d="M2 9l7 4.5 7-4.5" />
        {/* Network nodes */}
        <circle cx="19" cy="5" r="1.5" fill={color} />
        <circle cx="22" cy="10" r="1.5" fill={color} />
        <circle cx="19" cy="15" r="1.5" fill={color} />
        {/* Connection lines */}
        <line x1="16" y1="9" x2="17.5" y2="5.5" strokeWidth={Number(strokeWidth) * 0.75} />
        <line x1="16" y1="12" x2="20.5" y2="10" strokeWidth={Number(strokeWidth) * 0.75} />
        <line x1="16" y1="15" x2="17.5" y2="14.5" strokeWidth={Number(strokeWidth) * 0.75} />
      </svg>
    )
  },
)
MailfraConnect.displayName = "MailfraConnect"

// Variation 5: LaunchMail - Paper plane emerging from envelope (send action)
export const MailfraLaunch = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, strokeWidth = 2, color = "currentColor", className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
        {...props}
      >
        {/* Open envelope */}
        <path d="M2 11v9a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-9" />
        <path d="M2 11l7 4 7-4" />
        <path d="M2 11l7-5 7 5" />
        {/* Paper plane */}
        <path d="M14 10l8-8" />
        <path d="M22 2l-6 3 3 3" />
        <path d="M19 5l-5 5" />
      </svg>
    )
  },
)
MailfraLaunch.displayName = "MailfraLaunch"

// Default export
export const Mailfra = MailfraSendPulse
