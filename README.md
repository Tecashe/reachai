# ReachAI - AI-Powered Cold Email Personalization Platform

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
- `STRIPE_SECRET_KEY` - Stripe secret key

### 3. Set Up Database

\`\`\`bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Run initial setup script
npm run db:setup
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
3. Subscribe to: `checkout.session.completed`, `invoice.payment_succeeded`
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
3. Add all environment variables
4. Deploy!

### Post-Deployment

1. Update webhook URLs to production domain
2. Update `NEXT_PUBLIC_APP_URL` to production URL
3. Switch Stripe to live mode (update keys)
4. Test all integrations

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Clerk
- **Payments:** Stripe
- **Email:** Resend
- **AI:** OpenAI GPT-4
- **Styling:** Tailwind CSS + shadcn/ui
- **Deployment:** Vercel

## Project Structure

\`\`\`
├── app/
│   ├── (dashboard)/        # Protected dashboard routes
│   ├── api/                # API routes
│   ├── sign-in/            # Auth pages
│   └── page.tsx            # Landing page
├── components/
│   ├── dashboard/          # Dashboard components
│   ├── landing/            # Landing page components
│   └── ui/                 # shadcn/ui components
├── lib/
│   ├── services/           # Business logic
│   ├── actions/            # Server actions
│   └── db.ts               # Prisma client
├── prisma/
│   └── schema.prisma       # Database schema
└── scripts/                # Database scripts
\`\`\`

## License

MIT
