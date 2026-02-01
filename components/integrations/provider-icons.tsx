import React from 'react'

/**
 * Returns the official SVG icon for each integration provider
 * Uses inline SVGs for best performance and customization
 */
export function getProviderIcon(provider: string) {
    switch (provider) {
        case 'AIRTABLE':
            return <AirtableIcon />
        case 'AMPLITUDE':
            return <AmplitudeIcon />
        case 'ASANA':
            return <AsanaIcon />
        case 'CLICKUP':
            return <ClickUpIcon />
        case 'CODA':
            return <CodaIcon />
        case 'GOOGLE_DOCS':
            return <GoogleDocsIcon />
        case 'GOOGLE_SHEETS':
            return <GoogleSheetsIcon />
        case 'HUBSPOT':
            return <HubSpotIcon />
        case 'INTERCOM':
            return <IntercomIcon />
        case 'KLAVIYO':
            return <KlaviyoIcon />
        case 'MAILCHIMP':
            return <MailchimpIcon />
        case 'MIXPANEL':
            return <MixpanelIcon />
        case 'NOTION':
            return <NotionIcon />
        case 'PIPEDRIVE':
            return <PipedriveIcon />
        case 'SALESFORCE':
            return <SalesforceIcon />
        case 'SEGMENT':
            return <SegmentIcon />
        case 'SERVICENOW':
            return <ServiceNowIcon />
        case 'TRELLO':
            return <TrelloIcon />
        case 'ZENDESK':
            return <ZendeskIcon />
        case 'ZOHO_CRM':
            return <ZohoCRMIcon />
        default:
            return <DefaultIcon />
    }
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
    <div className='w-10 h-10 flex items-center justify-center rounded-lg bg-muted'>
        {children}
    </div>
)

function AirtableIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 2h28v28H2z' fill='#18AACF' />
                <path
                    d='M11 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z'
                    fill='white'
                />
                <path
                    d='M21 9c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z'
                    fill='white'
                />
            </svg>
        </IconWrapper>
    )
}

function AmplitudeIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='none' stroke='currentColor'>
                <circle cx='16' cy='16' r='14' strokeWidth='2' fill='#A335EE' stroke='#A335EE' />
                <path
                    d='M10 20l4-8 4 4 4-8'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </IconWrapper>
    )
}

function AsanaIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <circle cx='16' cy='9' r='3' fill='#FF6B6B' />
                <path d='M16 13c3.3 0 6 2.7 6 6v6h-2v-6c0-2.2-1.8-4-4-4s-4 1.8-4 4v6H10v-6c0-3.3 2.7-6 6-6z' fill='#FF6B6B' />
            </svg>
        </IconWrapper>
    )
}

function ClickUpIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#8B5CF6' />
                <path
                    d='M12 14l4 4 4-4m0 6l-4-4-4 4'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </IconWrapper>
    )
}

function CodaIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#13ADE4' />
                <path
                    d='M12 10l3 6-3 6m8 0l-3-6 3-6'
                    stroke='white'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                />
            </svg>
        </IconWrapper>
    )
}

function GoogleDocsIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M6 4h20v24H6z' fill='#4285F4' />
                <path d='M8 8h16M8 14h16M8 20h12' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
        </IconWrapper>
    )
}

function GoogleSheetsIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M4 4h24v24H4z' fill='#34A853' />
                <g stroke='white' strokeWidth='1' fill='none'>
                    <line x1='8' y1='4' x2='8' y2='28' />
                    <line x1='16' y1='4' x2='16' y2='28' />
                    <line x1='24' y1='4' x2='24' y2='28' />
                    <line x1='4' y1='10' x2='28' y2='10' />
                    <line x1='4' y1='16' x2='28' y2='16' />
                    <line x1='4' y1='22' x2='28' y2='22' />
                </g>
            </svg>
        </IconWrapper>
    )
}

function HubSpotIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <circle cx='16' cy='16' r='14' fill='#FF7A59' />
                <circle cx='12' cy='14' r='2' fill='white' />
                <circle cx='20' cy='14' r='2' fill='white' />
                <path d='M12 20c2-1 4-1 4 0' stroke='white' strokeWidth='1.5' fill='none' />
            </svg>
        </IconWrapper>
    )
}

function IntercomIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <rect x='2' y='4' width='28' height='24' rx='2' fill='#29B2FF' />
                <circle cx='10' cy='12' r='2' fill='white' />
                <circle cx='16' cy='12' r='2' fill='white' />
                <circle cx='22' cy='12' r='2' fill='white' />
            </svg>
        </IconWrapper>
    )
}

function KlaviyoIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#12C4E8' />
                <path d='M12 12h8v8h-8z' fill='white' />
                <path d='M14 14h4v4h-4z' fill='#12C4E8' />
            </svg>
        </IconWrapper>
    )
}

function MailchimpIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#FFE01B' />
                <path
                    d='M16 8c0 1.1-1.8 2-4 2s-4-.9-4-2c0 1.1 1.8 3 4 3s4-1.9 4-3zm0 6c0 1.1-1.8 2-4 2s-4-.9-4-2c0 1.1 1.8 3 4 3s4-1.9 4-3z'
                    fill='#111'
                />
            </svg>
        </IconWrapper>
    )
}

function MixpanelIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <circle cx='16' cy='16' r='14' fill='#25292E' />
                <path
                    d='M14 10l-4 6h6l4 6'
                    stroke='#00D4FF'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    fill='none'
                />
            </svg>
        </IconWrapper>
    )
}

function NotionIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <rect x='2' y='2' width='28' height='28' rx='2' fill='#000' />
                <path
                    d='M6 8l16 .5M6 12l12 .5M6 16l14 .5M6 20l10 .5M6 24l8 .5'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                />
            </svg>
        </IconWrapper>
    )
}

function PipedriveIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <circle cx='16' cy='16' r='14' fill='#3A4B2A' />
                <path
                    d='M16 10v12M10 16h12'
                    stroke='#4DB859'
                    strokeWidth='2'
                    strokeLinecap='round'
                />
            </svg>
        </IconWrapper>
    )
}

function SalesforceIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#00A1DE' />
                <circle cx='12' cy='12' r='2' fill='white' />
                <circle cx='20' cy='12' r='2' fill='white' />
                <circle cx='16' cy='20' r='2' fill='white' />
            </svg>
        </IconWrapper>
    )
}

function SegmentIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 8h28v16H2z' fill='#221F20' />
                <circle cx='8' cy='16' r='3' fill='#13E990' />
                <circle cx='16' cy='16' r='3' fill='#13E990' />
                <circle cx='24' cy='16' r='3' fill='#13E990' />
            </svg>
        </IconWrapper>
    )
}

function ServiceNowIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <rect x='2' y='4' width='28' height='24' rx='2' fill='#00A699' />
                <path
                    d='M10 12h12M10 18h12M10 24h8'
                    stroke='white'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                />
            </svg>
        </IconWrapper>
    )
}

function TrelloIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <rect x='2' y='4' width='28' height='24' rx='2' fill='#0079BF' />
                <rect x='6' y='8' width='7' height='16' rx='1' fill='white' />
                <rect x='19' y='8' width='7' height='12' rx='1' fill='white' />
            </svg>
        </IconWrapper>
    )
}

function ZendeskIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#03363D' />
                <path
                    d='M16 10v12M10 16h12'
                    stroke='#02D0B9'
                    strokeWidth='2'
                    strokeLinecap='round'
                />
            </svg>
        </IconWrapper>
    )
}

function ZohoCRMIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <path d='M2 16c0-7.7 6.3-14 14-14s14 6.3 14 14-6.3 14-14 14S2 23.7 2 16z' fill='#5B3FF7' />
                <path d='M12 10h8v4h-8zM12 18h8v4h-8z' fill='white' opacity='0.9' />
                <path d='M12 14h2v2h-2zM18 14h2v2h-2z' fill='white' />
            </svg>
        </IconWrapper>
    )
}

function DefaultIcon() {
    return (
        <IconWrapper>
            <svg viewBox='0 0 32 32' className='w-6 h-6' fill='currentColor'>
                <rect x='2' y='4' width='28' height='24' rx='2' fill='#999' />
                <path d='M10 14h12M10 18h12' stroke='white' strokeWidth='1.5' strokeLinecap='round' />
            </svg>
        </IconWrapper>
    )
}
