# ⚡ NeonLink — Premium URL Shortener Platform

> A production-ready, full-stack URL shortener with ad monetization, advanced analytics, and a stunning cyber-neon UI.

![NeonLink](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-green?style=for-the-badge&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38bdf8?style=for-the-badge&logo=tailwindcss)

---

## ✨ Features

- 🔗 **URL Shortening** — Custom aliases, password protection, expiration dates
- 💰 **Ad Monetization** — 3-step redirect system with configurable ad slots per step
- 📊 **Advanced Analytics** — Country, browser, device, referrer, unique visits
- 👤 **User Accounts** — Auth with credentials, Google, or GitHub
- 🛡️ **Admin Panel** — Full platform management: users, links, ads, settings
- 📱 **QR Code Generation** — Download as PNG or SVG
- 🔑 **Developer API** — REST API with API key authentication
- 🚀 **PWA Ready** — Installable on mobile devices
- 🐳 **Docker Support** — One-command deployment

---

## 🛠️ Tech Stack

| Layer       | Technology                             |
|-------------|----------------------------------------|
| Framework   | Next.js 15 (App Router)                |
| Language    | TypeScript                             |
| Styling     | TailwindCSS + Framer Motion            |
| Database    | PostgreSQL + Prisma ORM                |
| Auth        | NextAuth v5                            |
| Cache       | Redis (ioredis)                        |
| Charts      | Recharts                               |
| Deployment  | Docker + Docker Compose                |

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 14+
- Redis 7+
- npm or yarn

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/neonlink.git
cd neonlink
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env.local
# Edit .env.local with your values
```

**Required variables:**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/neonlink"
REDIS_URL="redis://localhost:6379"
NEXTAUTH_SECRET="your-secret-min-32-chars"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Set Up Database

```bash
# Run migrations
npx prisma migrate dev --name init

# Seed with admin user and sample data
npx prisma db seed
```

The seed creates:
- Admin user: `admin@neonlink.io` / `Admin123!`
- Sample ads for each redirect step
- Default platform settings

### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and log in at `/login`.

---

## 🐳 Docker Deployment

The easiest way to run NeonLink in production:

```bash
# Copy and configure environment
cp .env.example .env
nano .env  # Set NEXTAUTH_SECRET and NEXTAUTH_URL

# Start all services
docker compose up -d

# Run migrations
docker compose exec app npx prisma migrate deploy
docker compose exec app npx prisma db seed
```

Services started:
- **app** — Next.js on port 3000
- **db** — PostgreSQL on port 5432
- **redis** — Redis on port 6379

---

## 📁 Project Structure

```
neonlink/
├── app/
│   ├── (auth)/              # Login, register, forgot-password pages
│   ├── (dashboard)/         # User dashboard (links, analytics, settings, API keys)
│   ├── (admin)/             # Admin panel (users, ads, reports, settings)
│   ├── [slug]/              # Redirect page with ad flow
│   ├── api/
│   │   ├── auth/            # NextAuth + register + forgot-password
│   │   ├── shorten/         # CRUD for links
│   │   ├── links/[slug]/    # Info, verify password, complete redirect
│   │   ├── analytics/       # Summary + chart data
│   │   ├── admin/           # Admin stats, users, ads, settings
│   │   ├── user/            # Profile, password, API keys
│   │   └── qr/              # QR code generation
│   ├── layout.tsx
│   ├── page.tsx             # Landing page
│   └── globals.css
├── components/
│   ├── particles/           # Animated background
│   ├── dashboard/           # QRCodeModal, CreateLinkModal
│   └── admin/               # AdminSidebar
├── hooks/
│   ├── useLinks.ts
│   └── useAnalytics.ts
├── lib/
│   ├── auth.ts              # NextAuth config + helpers
│   ├── prisma.ts            # Prisma singleton
│   ├── redis.ts             # Redis + in-memory fallback
│   └── utils.ts             # Utilities
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Database seeder
├── types/
│   └── index.ts             # TypeScript types
├── docker-compose.yml
├── Dockerfile
└── .env.example
```

---

## 🔧 Configuration

### Ad System

Manage ads from the Admin Panel → **Ads Manager**.

- **Step 1, 2, 3** — Assign different ad codes to each redirect step
- Supports: Google AdSense, PropellerAds, Monetag, custom HTML/JS
- Each step has a configurable countdown timer (default: 30 seconds)

### Plans

| Feature         | Free | Pro  | Business |
|-----------------|------|------|----------|
| Links           | 50   | 500  | Unlimited|
| Analytics       | 7d   | 30d  | 90d      |
| API Keys        | 1    | 5    | 10       |
| Custom Aliases  | ✅   | ✅   | ✅       |
| Password Links  | ✅   | ✅   | ✅       |
| QR Codes        | ✅   | ✅   | ✅       |

### Email (SMTP)

Configure in `.env.local`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

---

## 🔌 API Reference

### Authentication

Include your API key in the `Authorization` header:

```
Authorization: Bearer nl_your_api_key_here
```

### Endpoints

#### `POST /api/shorten`
Shorten a URL.

```json
// Request
{
  "url": "https://example.com/very-long-url",
  "alias": "my-link",          // optional
  "title": "My awesome link",  // optional
  "password": "secret",        // optional
  "expiresAt": "2025-12-31"    // optional ISO date
}

// Response
{
  "success": true,
  "link": {
    "slug": "AbC123",
    "shortUrl": "https://yourdomain.com/AbC123"
  }
}
```

#### `GET /api/shorten`
List your links (paginated).

```
GET /api/shorten?page=1&limit=10&search=example&sort=clicks
```

#### `DELETE /api/shorten?id=<linkId>`
Delete a link.

---

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to change the neon color palette:

```ts
colors: {
  neon: {
    blue: '#00BFFF',    // Primary
    purple: '#8A2BE2',  // Secondary
    green: '#00FF88',   // Success
  }
}
```

### Ad Timer
Change the global ad countdown in Admin → Settings → **Ad Timer**.

---

## 🔐 Security

- **Rate limiting** — 20 requests/minute per IP on the shorten endpoint
- **Session validation** — Anti-bypass for redirect flow
- **CSRF protection** — Built-in via NextAuth
- **XSS protection** — Security headers via `next.config.ts`
- **SQL injection** — Protected by Prisma ORM parameterization
- **Password hashing** — bcrypt with salt rounds 12
- **Bot detection** — User-agent parsing and IP logging

---

## 📦 Production Deployment

### Build

```bash
npm run build
npm start
```

### Environment Checklist

- [ ] Set a strong `NEXTAUTH_SECRET` (32+ chars)
- [ ] Set `NEXTAUTH_URL` to your domain
- [ ] Set `NEXT_PUBLIC_APP_URL` to your domain
- [ ] Configure your PostgreSQL connection
- [ ] Configure Redis connection
- [ ] Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` before seeding
- [ ] Configure SMTP for email features
- [ ] Add `IPINFO_TOKEN` for geolocation

---

## 📄 License

MIT — Feel free to use for personal or commercial projects.

---

Built with ❤️ and ⚡ neon by NeonLink
