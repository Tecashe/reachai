# mailfra - AI-Powered Cold Email Personalization Platform

A production-ready SaaS platform for writing cold emails that actually get replies. Built with Next.js 14, TypeScript, Clerk, Prisma, and OpenAI.

## Features

- 🤖 AI-powered prospect research and email generation
- 📊 Comprehensive analytics and reporting
- 📧 Email tracking (opens, clicks, replies)
- 🎯 Multi-touch email sequences
- 👥 Team collaboration
- 💳 Stripe subscription management
- 🔐 Secure authentication with Clerk
- 📈 Quality scoring and personalization levels

## Quick Start

### 1. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 2. Set Up Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

\`\`\`bash
cp .env.example .env
\`\`\`

Required environment variables:
- `DATABASE_URL` - Neon PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `OPENAI_API_KEY` - OpenAI API key
- `RESEND_API_KEY` - Resend email API key
- `RESEND_FROM_EMAIL` - Verified sender email (e.g., noreply@yourdomain.com)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `CLERK_WEBHOOK_SECRET` - Clerk webhook signing secret
- `NEXT_PUBLIC_APP_URL` - Your app URL (http://localhost:3000 for dev)
- `CRON_SECRET` - Secret for cron job authentication

### 3. Set Up Database

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Seed database with sample data
npm run db:seed
\`\`\`

### 4. Configure Webhooks

**Clerk Webhook:**
1. Go to Clerk Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/clerk`
3. Subscribe to: `user.created`, `user.updated`, `user.deleted`
4. Copy signing secret to `CLERK_WEBHOOK_SECRET`

**Stripe Webhook:**
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Subscribe to: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
4. Copy signing secret to `STRIPE_WEBHOOK_SECRET`

### 5. Run Development Server

\`\`\`bash
npm run dev
# or
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Post-Deployment Setup

1. **Update Webhook URLs:**
   - Update Clerk webhook to `https://yourdomain.com/api/webhooks/clerk`
   - Update Stripe webhook to `https://yourdomain.com/api/webhooks/stripe`

2. **Configure Cron Jobs:**
   - Add Vercel Cron job for `/api/cron/reset-credits` (runs monthly)
   - Set `CRON_SECRET` environment variable

3. **Email Configuration:**
   - Verify your domain in Resend
   - Update `RESEND_FROM_EMAIL` to your verified domain

4. **Go Live with Stripe:**
   - Switch to live mode in Stripe dashboard
   - Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` with live keys
   - Create live products and prices

5. **Test Everything:**
   - Test user sign-up flow
   - Test subscription checkout
   - Test email sending
   - Test webhook processing

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Clerk
- **Payments:** Stripe
- **Email:** Resend
- **AI:** OpenAI GPT-4
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Deployment:** Vercel

## Project Structure

\`\`\`
├── app/
│   ├── (dashboard)/        # Protected dashboard routes
│   │   ├── campaigns/      # Campaign management
│   │   ├── prospects/      # Prospect management
│   │   ├── templates/      # Email templates
│   │   ├── analytics/      # Analytics dashboard
│   │   └── billing/        # Subscription & billing
│   ├── api/                # API routes
│   │   ├── webhooks/       # Webhook handlers
│   │   ├── emails/         # Email operations
│   │   ├── generate/       # AI generation
│   │   └── cron/           # Cron jobs
│   ├── sign-in/            # Auth pages
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── landing/            # Landing page components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── services/           # Business logic services
│   │   ├── email-sender.tsx    # Email sending
│   │   ├── email-generator.ts  # AI email generation
│   │   ├── ai-research.ts      # Prospect research
│   │   └── web-scraper.ts      # Web scraping
│   ├── actions/            # Server actions
│   ├── cron/               # Cron job logic
│   ├── db.ts               # Prisma client
│   ├── env.ts              # Environment validation
│   ├── logger.ts           # Logging utility
│   └── resend.ts           # Resend client
├── prisma/
│   └── schema.prisma       # Database schema
└── scripts/                # Database scripts
\`\`\`

## Key Features Explained

### AI Email Generation
- Uses OpenAI GPT-4 for intelligent email writing
- Multiple personalization levels (LOW, MEDIUM, HIGH, ULTRA)
- Quality scoring and suggestions
- Template-based generation with variable substitution

### Prospect Research
- Automated web scraping for company data
- LinkedIn profile analysis
- Recent news and pain point detection
- Competitor tool identification

### Email Tracking
- Open tracking via invisible pixel
- Click tracking via link wrapping
- Real-time analytics and reporting
- Engagement scoring

### Subscription Management
- Tiered pricing (FREE, STARTER, PRO, AGENCY)
- Credit-based system for emails and research
- Automatic monthly credit resets
- Stripe webhook integration for billing events

### Campaign Management
- Multi-step email sequences
- Automated follow-ups
- Daily send limits
- A/B testing support

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret | Yes |
| `OPENAI_API_KEY` | OpenAI API key | Yes |
| `RESEND_API_KEY` | Resend API key | Yes |
| `RESEND_FROM_EMAIL` | Verified sender email | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Yes |
| `CRON_SECRET` | Cron job authentication | Yes |
| `RATE_LIMIT_MAX` | Max requests per window | No (default: 100) |
| `RATE_LIMIT_WINDOW` | Rate limit window in ms | No (default: 60000) |

## API Routes

### Public Routes
- `POST /api/webhooks/clerk` - Clerk user events
- `POST /api/webhooks/stripe` - Stripe billing events

### Protected Routes
- `POST /api/generate/email` - Generate AI email
- `POST /api/emails/send` - Send single email
- `POST /api/emails/send-bulk` - Send bulk emails
- `POST /api/research/prospect` - Research prospect
- `POST /api/prospects/upload` - Upload CSV prospects
- `GET /api/track/open/[trackingId]` - Track email open
- `GET /api/track/click/[trackingId]` - Track link click

### Cron Routes
- `GET /api/cron/reset-credits` - Monthly credit reset

## Development Tips

1. **Testing Webhooks Locally:**
   \`\`\`bash
   # Use Stripe CLI for webhook testing
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   
   # Use ngrok for Clerk webhooks
   ngrok http 3000
   \`\`\`

2. **Database Management:**
   \`\`\`bash
   # View database in Prisma Studio
   npx prisma studio
   
   # Reset database
   npx prisma db push --force-reset
   \`\`\`

3. **Debugging:**
   - Check logs in Vercel dashboard
   - Use `console.log("[builtbycashe] ...")` for debugging
   - Monitor webhook events in Stripe/Clerk dashboards

## Support

For issues or questions:
1. Check the documentation
2. Review environment variables
3. Check webhook configurations
4. Review logs in Vercel dashboard

## License

MIT

