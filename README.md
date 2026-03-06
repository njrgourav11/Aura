# ✨ FreelanceOS

**The Operating System for Modern Freelancers and Creative Agencies.**

FreelanceOS is a high-performance, legal-grade business platform designed to help freelancers transition from "managing projects" to "running a professional entity." Built with Next.js 16 & React 19, FreelanceOS provides a seamless, automated environment for contracts, invoices, client management, and financial growth.

---

## 🚀 Current Features

### 🌐 Landing Page & Onboarding
- **Stunning Marketing Page:** Animated hero section, feature grid, testimonials, and a live demo slideshow showcasing the full workflow.
- **Animated Demo Slideshow:** Auto-advancing interactive tour (Add Client → Create Contract → Send Invoice → Log Payment) with screenshot previews.
- **Pricing Page:** Transparent tier breakdown with a "Get Started" CTA.
- **SEO-Ready:** Auto-generated `sitemap.xml` and `robots.txt` for discoverability.

### 🔐 Authentication & Security
- **Secure Auth:** NextAuth.js-powered login/registration with session management.
- **Role-Based Access:** User vs. Admin role distinction with protected admin routes.
- **Multi-Tenancy:** Full data isolation — every user's clients, contracts, and invoices are completely private.

### ⚖️ Legal-Grade Contract Engine
- **ARTICLE-Based Structure:** Professional contracts with built-in clauses for IP protection, Confidentiality, and Indemnification.
- **High-Fidelity PDF Export:** Premium vector logos and consistent layouts for a high-end client impression, rendered with jsPDF.
- **Formal Signatures:** Structured execution areas for legally binding service agreements.
- **Status Lifecycle:** Draft → Active → Completed / Cancelled tracking.

### 💰 Finance & Invoicing
- **Smart Lifecycle Management:** Track invoices from Draft → Sent → Paid with real-time status updates.
- **Automatic Payment Sync:** Mark invoices as paid instantly when a payment is logged.
- **Multi-Currency Support:** Standardized financial tracking across global clients and currencies.
- **Itemized Invoices:** Line-item descriptions with quantity, rate, and auto-calculated amounts.
- **PDF Export:** Download beautifully formatted invoice PDFs directly from the dashboard.

### 💳 Payments (Razorpay Integration)
- **Embedded Razorpay Checkout:** Clients can pay invoices directly inside the Client Portal — zero friction.
- **Automatic Status Update:** Invoice status flips to "Paid" automatically on successful payment.
- **Payment Ledger:** Full payment history per client with date, amount, and method tracking.

### 📊 Analytics & Reporting
- **Revenue Charts:** Interactive Recharts-powered graphs showing income trends over time on the admin dashboard.
- **Tax Dashboard:** Summarize earnings, expenses, and tax liability at a glance for filing season.
- **KPI Cards:** Real-time totals for Revenue, Unpaid Invoices, Active Contracts, and Active Projects.

### 🗂️ Project Management
- **Project Tracker:** Create and manage projects linked to clients with status (Active, Planning, Completed, On Hold), start/end dates, and budget.
- **Task Management:** Add granular tasks to projects with completion tracking and due dates.
- **Milestones:** Set and track key project milestones with completion status and deadlines.
- **Project Notes:** Internal/client-facing notes and updates per project, with timestamps.

### 👥 Client Management
- **Client CRM:** Centralized directory for all client contact details, addresses, and business info.
- **Client Portal Generation:** One-click portal creation — share a secure, branded link with any client.

### 🌐 Client Portal
- **Secure Access:** Password-protected or open-access portal per client — fully configurable.
- **Tabbed Dashboard:** Clients get a beautiful branded portal with Overview, Projects, Invoices, and Contracts tabs.
- **Live Project Updates:** Clients can see task progress (with completion ring), milestones, and project notes/updates in real time.
- **Invoice Payment:** Clients can view all invoices with itemized breakdowns and pay directly via Razorpay.
- **Contract Viewer & Download:** View and download signed contracts as PDFs from within the portal.
- **Summary KPIs:** Active projects count, pending invoices, amount owed, and contract count at a glance.

### ⚙️ Business Settings
- **Legal Entity Profile:** Manage your business name, Tax ID, GST number, address, bank details, and contact info.
- **Logo & Branding:** Upload your logo for automatic embedding in all PDFs and portal headers.

---

## 🗺️ Upcoming Features (Roadmap)

### 🕐 Phase 3: Automation & Recurring Billing
- **Recurring Invoices:** Automated billing cycles for retainers and website maintenance contracts.
- **Expense Tracking:** Log software subscriptions, travel, and operational costs to calculate true net profit.
- **Email Delivery:** Send invoices and portal links directly via email from within the dashboard.

### 🌍 Phase 4: Ecosystem & Scale
- **Proposal Generator:** Convert leads to signed contracts in a few clicks with smart templates.
- **Regional Tax Reports:** Automated summaries for GST (India), 1099 (US), and VAT (UK/EU).
- **Automation Engine:** Custom workflow triggers (e.g., "When contract is signed → auto-create Project").
- **Stripe & PayPal Support:** Additional global payment gateways beyond Razorpay.
- **Time Tracking:** Start/Stop timers that convert billable hours into invoice line items automatically.
- **Team Collaboration:** Sub-accounts, team member roles, and shared client workspaces.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) + React 19 |
| **Database** | MongoDB via Mongoose |
| **Auth** | NextAuth.js v4 (Secure Sessions) |
| **Styling** | Tailwind CSS v4 + Framer Motion |
| **Documents** | jsPDF (Coordinate-based rendering) |
| **Charts** | Recharts |
| **Payments** | Razorpay SDK |
| **Utilities** | date-fns, bcryptjs, Lucide Icons |

---

*FreelanceOS: Delivering Professionalism.*
