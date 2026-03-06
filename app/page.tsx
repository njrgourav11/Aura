import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  FileSignature,
  Receipt,
  Settings,
  ShieldCheck,
  TrendingUp,
  Users,
  Shield,
  Globe,
  CheckCircle2,
  AlertCircle,
  Lock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import DemoSlideshow from "@/components/home/DemoSlideshow";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "FreelanceOS — Freelance Contracts, Invoices & Client Management Software",
  description:
    "FreelanceOS is the #1 all-in-one freelancer operating system. Create contracts, send invoices, track payments, manage clients & run analytics. The best Bonsai, HoneyBook & Dubsado alternative. Start free today.",
  alternates: {
    canonical: "https://www.freelanceos.app",
  },
  openGraph: {
    title: "FreelanceOS — Freelance Contracts, Invoices & Client Management",
    description:
      "Run your entire freelance business from one platform. Contracts, invoices, client CRM, analytics & payments — all in one place. Better than Bonsai, HoneyBook & Dubsado.",
    url: "https://www.freelanceos.app",
    type: "website",
  },
};

// JSON-LD Structured Data
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "FreelanceOS",
      "url": "https://www.freelanceos.app",
      "logo": "https://www.freelanceos.app/logo.svg",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description":
        "FreelanceOS is the all-in-one freelancer operating system for creating contracts, sending invoices, tracking payments, managing clients, and running business analytics.",
      "offers": {
        "@type": "Offer",
        "price": "9.00",
        "priceCurrency": "USD",
        "description": "Starting at $9/month for freelancers",
      },
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "312",
      },
      "featureList": [
        "Freelance Contract Generator",
        "Invoice Software",
        "Client CRM",
        "Payment Tracking",
        "Revenue Analytics",
        "Multi-Currency Support",
        "Client Portal",
        "Project Management"
      ],
    },
    {
      "@type": "Organization",
      "name": "FreelanceOS",
      "url": "https://www.freelanceos.app",
      "logo": "https://www.freelanceos.app/logo.svg",
      "sameAs": [],
      "description":
        "FreelanceOS provides freelance management software including contract generation, invoicing, payment tracking, and client management tools.",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is FreelanceOS?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FreelanceOS is an all-in-one freelancer operating system that lets you create contracts, send professional invoices, track payments, manage clients, and view business analytics from a single platform."
          }
        },
        {
          "@type": "Question",
          "name": "Is FreelanceOS a good Bonsai alternative?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. FreelanceOS offers the same core features as Bonsai — contracts, invoices, and client management — at a lower price point, with additional features like a client portal and Razorpay payment integration."
          }
        },
        {
          "@type": "Question",
          "name": "Can I use FreelanceOS for free?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "FreelanceOS offers a Starter plan starting at $9/month. You can register and explore the platform. No credit card is required to get started."
          }
        },
        {
          "@type": "Question",
          "name": "Does FreelanceOS support multiple currencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. FreelanceOS supports multi-currency invoicing and revenue tracking, making it ideal for freelancers working with international clients."
          }
        },
        {
          "@type": "Question",
          "name": "Is FreelanceOS suitable for freelance agencies?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Absolutely. FreelanceOS has an Agency plan designed for freelance teams and small creative agencies with unlimited clients and team management features."
          }
        }
      ]
    }
  ]
};


export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      {/* JSON-LD Structured Data for Rich Results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-28 pb-16 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[200px] md:w-[400px] h-[200px] md:h-[400px] bg-fuchsia-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold mb-6 md:mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              The Ultimate Freelancer OS
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] mb-6 md:mb-8">
              Run Your Entire{" "}
              <br className="hidden sm:block" />
              <span className="text-gradient">Business</span> From One Platform
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 max-w-2xl mb-8 md:mb-12 leading-relaxed px-2">
              Contracts, invoices, payments, analytics, and client management —
              all automated in one powerful Freelancer OS.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mb-10 md:mb-16 w-full sm:w-auto">
              <Link href="/waitlist" className="btn-primary px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg w-full sm:w-auto text-center">
                <span>Join the Waitlist <ArrowRight className="w-5 h-5" /></span>
              </Link>
              <Link href="/waitlist?tab=demo" className="btn-secondary px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg bg-white/5 hover:bg-white/10 border-white/10 w-full sm:w-auto text-center">
                Schedule a Demo
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-xs sm:text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Limited early access spots
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Secure multi-tenant system
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                Built for freelancers &amp; agencies
              </div>
            </div>

            {/* Product Visual Mockup */}
            <div className="mt-16 md:mt-24 w-full max-w-5xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[2rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/client.png"
                  alt="FreelanceOS client management dashboard"
                  className="w-full h-auto block"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-16 md:py-24 relative overflow-hidden bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8 leading-tight">
                Freelancing Shouldn&apos;t Feel <br />
                <span className="text-slate-500 text-xl sm:text-2xl md:text-4xl">Like Running 10 Different Tools</span>
              </h2>
              <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12">
                Stop wasting hours on administrative overhead. FreelanceOS replaces 5+ tools with one unified platform.
              </p>

              <div className="space-y-4 md:space-y-6">
                {[
                  "Managing contracts manually",
                  "Tracking unpaid invoices",
                  "Handling taxes & revenue reports",
                  "Organizing client communication",
                  "Switching between multiple tools"
                ].map((pain, i) => (
                  <div key={i} className="flex items-start gap-3 md:gap-4">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400 flex-shrink-0">
                      <AlertCircle size={12} />
                    </div>
                    <span className="text-slate-300 font-medium text-sm md:text-base">{pain}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full" />
              <div className="glass-card p-6 md:p-8 border-white/5 relative z-10">
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <span className="text-red-400 text-sm font-bold">Unpaid Invoice (Stale)</span>
                    <span className="text-white font-mono text-sm">$1,200.00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-xl opacity-50">
                    <span className="text-slate-400 text-sm">Contract Draft #4</span>
                    <span className="text-slate-500 text-sm">v.1.4</span>
                  </div>
                  <div className="flex items-center justify-center p-6 md:p-8 border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-slate-600 text-sm font-medium">Messy spreadsheets everywhere...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution / Features Section */}
      <section id="features" className="py-16 md:py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base px-4">
              A complete ecosystem designed to make running a freelance business as simple as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8">
            {[
              { title: "Client CRM", desc: "Manage clients, contact history, and project relationships.", icon: <Users className="w-6 h-6 text-blue-400" /> },
              { title: "Smart Invoicing", desc: "Create professional invoices and track payments automatically.", icon: <Receipt className="w-6 h-6 text-fuchsia-400" /> },
              { title: "Legal Contracts", desc: "Generate legally structured contracts with built-in clauses.", icon: <FileSignature className="w-6 h-6 text-indigo-400" /> },
              { title: "Revenue Dashboard", desc: "Track income, unpaid invoices, and tax liability in real time.", icon: <TrendingUp className="w-6 h-6 text-emerald-400" /> },
              { title: "Payment Automation", desc: "Log payments and automatically reconcile revenue.", icon: <Settings className="w-6 h-6 text-amber-400" /> },
              { title: "Multi-Currency Support", desc: "Work with global clients without worrying about conversions.", icon: <Globe className="w-6 h-6 text-cyan-400" /> }
            ].map((f, i) => (
              <div key={i} className="glass-card p-6 md:p-8 group hover:border-indigo-500/30 transition-all duration-500 h-full flex flex-col">
                <div className="w-12 md:w-14 h-12 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-4 md:mb-6 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Demo Section */}
      <section id="demo" className="py-16 md:py-24 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">See Freelancer OS in Action</h2>
            <p className="text-slate-400 max-w-2xl text-sm md:text-base px-4">
              From onboarding a new client to reconciling payments, FreelanceOS handles the heavy lifting.
            </p>
          </div>

          <DemoSlideshow />
        </div>
      </section>

      {/* 5. Feature Deep Dive */}
      <section className="py-16 md:py-32 space-y-16 md:space-y-32">
        {/* Contracts */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent overflow-hidden">
                <img
                  src="/contracts.png"
                  alt="Contracts feature screenshot"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-4 md:mb-6">
                Legal Protection
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Contracts That Protect You</h2>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {[
                  "Article-based legal structure",
                  "Confidentiality & IP clauses",
                  "Signature-ready PDFs",
                  "Fully editable agreements"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-indigo-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/waitlist" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white inline-block">
                Get Early Access
              </Link>
            </div>
          </div>
        </div>

        {/* Invoicing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold mb-4 md:mb-6">
                Cash Flow
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Smart Invoicing &amp; Payments</h2>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {[
                  "Track invoice lifecycle",
                  "Automated payment reconciliation",
                  "Itemized billing and taxes",
                  "Instant PDF generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-fuchsia-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/waitlist" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white inline-block">
                Get Early Access
              </Link>
            </div>
            <div>
              <div className="glass-card p-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto border-white/5 bg-gradient-to-br from-fuchsia-500/5 to-transparent overflow-hidden">
                <img
                  src="/invoices.png"
                  alt="Smart Invoice feature screenshot"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-4 max-w-xs sm:max-w-sm md:max-w-md mx-auto border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent overflow-hidden">
                <img
                  src="/dashboard.png"
                  alt="Real-Time Business Analytics dashboard screenshot"
                  className="w-full h-auto rounded-2xl object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-4 md:mb-6">
                Insights
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">Real-Time Business Analytics</h2>
              <ul className="space-y-3 md:space-y-4 mb-8 md:mb-10">
                {[
                  "Monthly revenue charts",
                  "Unpaid invoice tracking",
                  "Estimated tax liability",
                  "Global currency conversion"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300 text-sm md:text-base">
                    <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/waitlist" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white inline-block">
                Get Early Access
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-16 md:py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 md:mb-20">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Trusted by Freelancers Worldwide</h2>
          </div>

          <div className="grid grid-cols-3 gap-4 md:gap-12 mb-12 md:mb-20">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-indigo-500 mb-1 md:mb-2">10,000+</div>
              <div className="text-slate-400 font-medium text-xs sm:text-sm md:text-base">Invoices generated</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-fuchsia-500 mb-1 md:mb-2">500+</div>
              <div className="text-slate-400 font-medium text-xs sm:text-sm md:text-base">Active freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-black text-emerald-500 mb-1 md:mb-2">$2M+</div>
              <div className="text-slate-400 font-medium text-xs sm:text-sm md:text-base">Revenue tracked</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="glass-card p-6 md:p-8 border-white/5 italic text-slate-300 leading-relaxed text-sm md:text-base">
              &quot;FreelanceOS replaced 4 tools I was using for contracts and invoices. It&apos;s the only operating system that actually understands how freelancers work.&quot;
              <div className="mt-5 md:mt-6 flex items-center gap-3 not-italic">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-slate-800 border border-white/10 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-sm">Sarah Jenkins</div>
                  <div className="text-slate-500 text-xs">UX Designer &amp; Consultant</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-6 md:p-8 border-white/5 italic text-slate-300 leading-relaxed text-sm md:text-base">
              &quot;Our entire freelance operation runs on this platform. The automated taxing and multi-currency support alone saved us dozens of hours each month.&quot;
              <div className="mt-5 md:mt-6 flex items-center gap-3 not-italic">
                <div className="w-9 md:w-10 h-9 md:h-10 rounded-full bg-slate-800 border border-white/10 flex-shrink-0" />
                <div>
                  <div className="text-white font-bold text-sm">David Chen</div>
                  <div className="text-slate-500 text-xs">Creative Agency Owner</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Workflow Section */}
      <section className="py-16 md:py-32 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-10 md:mb-16">From Client → Contract → Payment</h2>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 md:gap-12 max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-10" />

            {[
              { title: "Client Created", icon: <Users size={20} /> },
              { title: "Contract Generated", icon: <FileSignature size={20} /> },
              { title: "Invoice Sent", icon: <Receipt size={20} /> },
              { title: "Payment Logged", icon: <TrendingUp size={20} /> },
              { title: "Dashboard Updated", icon: <TrendingUp size={20} /> }
            ].map((step, i) => (
              <div key={i} className="flex md:flex-col items-center gap-4 group w-full md:w-auto">
                <div className="w-14 md:w-20 h-14 md:h-20 rounded-xl md:rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all duration-500 shadow-xl flex-shrink-0">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors text-left md:text-center">{step.title}</div>
                {i < 4 && <div className="md:hidden ml-auto text-indigo-500/30 font-black text-xl">↓</div>}
              </div>
            ))}
          </div>

          <p className="mt-12 md:mt-20 text-slate-500 font-medium tracking-wide uppercase text-xs">The OS Concept: Everything connected, perfectly isolated.</p>
        </div>
      </section>

      {/* 8. Security & Reliability */}
      <section id="security" className="py-16 md:py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="glass-card p-8 md:p-12 lg:p-20 border-white/5 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-6 md:mb-8">Built With Security In Mind</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-8 mt-8 md:mt-12">
                  {[
                    { title: "Multi-tenant isolation", icon: <Shield className="text-emerald-400" size={20} /> },
                    { title: "Encrypted Auth", icon: <Lock className="text-emerald-400" size={20} /> },
                    { title: "Data Privacy", icon: <ShieldCheck className="text-emerald-400" size={20} /> },
                    { title: "Cloud Infrastructure", icon: <Globe className="text-emerald-400" size={20} /> }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 flex-shrink-0">
                        {s.icon}
                      </div>
                      <span className="text-slate-300 font-medium text-sm">{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-emerald-500/10 blur-[60px] rounded-full animate-pulse" />
                  <ShieldCheck size={80} className="md:!w-[120px] md:!h-[120px] text-emerald-500 relative z-10 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Teaser */}
      <section id="pricing" className="py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6">Simple Pricing That Scales</h2>
          <p className="text-slate-400 mb-12 md:mb-20 max-w-2xl mx-auto text-sm md:text-base px-4">
            Starting free. Upgrade when your business grows into an agency.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 md:gap-8 mb-10 md:mb-16">
            {[
              {
                name: "Starter", price: "$9", desc: "Best for beginners",
                features: ["Up to 5 clients", "10 invoices / month", "Smart Contracts", "PDF generation", "Payment tracking", "Email support"],
                unavailable: ["Client portal", "Team members", "Priority support"],
              },
              {
                name: "Pro", price: "$29", desc: "Best for professionals", popular: true,
                features: ["Unlimited clients", "Unlimited invoices", "Smart Contracts", "PDF generation", "Revenue analytics", "Client portal"],
                unavailable: ["Team members"],
              },
              {
                name: "Agency", price: "$79", desc: "For freelance teams",
                features: ["Unlimited clients", "Unlimited invoices", "Smart Contracts", "PDF generation", "Revenue analytics", "Client portal", "Up to 10 team members", "Priority support"],
                unavailable: [],
              },
            ].map((plan, i) => (
              <div key={i} className={`glass-card p-6 md:p-8 border-white/5 relative flex flex-col ${plan.popular ? "border-indigo-500/30 bg-indigo-500/5" : ""}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-3xl md:text-4xl font-black text-white mb-2">
                  {plan.price}<span className="text-xs md:text-sm font-normal text-slate-500">/mo</span>
                </div>
                <p className="text-slate-500 text-xs md:text-sm mb-5">{plan.desc}</p>
                <div className="w-full h-px bg-white/5 mb-5" />
                <ul className="text-sm text-left space-y-3 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                  {plan.unavailable?.map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-slate-600 line-through">
                      <CheckCircle2 size={14} className="text-slate-700 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link
                    href="/waitlist"
                    className={`block w-full text-center py-3 rounded-xl font-bold text-sm transition-all ${plan.popular
                        ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                      }`}
                  >
                    Join Waitlist
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
            View Full Feature Comparison <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 10. Final CTA Section */}
      <section className="py-16 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 md:mb-8 tracking-tight">
            Start Running Your <br />
            Business Like a Pro
          </h2>
          <p className="text-slate-400 text-base md:text-lg mb-8 md:mb-12 max-w-xl mx-auto">
            Limited early access spots available. Join our waitlist or book a
            personalised demo with the team.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 justify-center">
            <Link href="/waitlist" className="btn-primary px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg w-full sm:w-auto text-center">
              <span>Join the Waitlist <ArrowRight size={18} /></span>
            </Link>
            <Link href="/waitlist?tab=demo" className="btn-secondary px-8 py-3.5 md:px-10 md:py-4 text-base md:text-lg bg-white/5 border-white/10 text-white w-full sm:w-auto text-center">
              Schedule a Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
