import Link from "next/link";
import {
  ArrowRight,
  FileSignature,
  Receipt,
  Settings,
  ShieldCheck,
  Clock,
  TrendingUp,
  Users,
  Shield,
  Globe,
  LayoutDashboard,
  CheckCircle2,
  AlertCircle,
  Lock
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Animation variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true }
};

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fuchsia-600/10 blur-[100px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-semibold mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              The Ultimate Freelancer OS
            </div>

            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.1] mb-8">
              Run Your Entire <br className="hidden md:block" />
              <span className="text-gradient">Business</span> From One Platform
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12 leading-relaxed">
              Contracts, invoices, payments, analytics, and client management —
              all automated in one powerful Freelancer OS.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
              <Link href="/register" className="btn-primary px-10 py-4 text-lg">
                <span>Start Free <ArrowRight className="w-5 h-5" /></span>
              </Link>
              <Link href="#demo" className="btn-secondary px-10 py-4 text-lg bg-white/5 hover:bg-white/10 border-white/10">
                See Demo
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Secure multi-tenant system
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Built for freelancers & agencies
              </div>
            </div>

            {/* Product Visual Mockup */}
            <div className="mt-24 w-full max-w-5xl relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-slate-900 border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-800/50 border-b border-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/20" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/20" />
                </div>
                <div className="p-4 md:p-8 grid grid-cols-12 gap-6 bg-slate-950/50">
                  {/* Abstract Dashboard Elements */}
                  <div className="col-span-12 md:col-span-4 space-y-6">
                    <div className="h-32 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                    <div className="h-48 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                  </div>
                  <div className="col-span-12 md:col-span-8 space-y-6">
                    <div className="h-56 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 animate-pulse" />
                    <div className="h-24 rounded-2xl bg-white/5 border border-white/5 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-24 relative overflow-hidden bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                Freelancing Shouldn't Feel <br />
                <span className="text-slate-500 text-3xl md:text-4xl">Like Running 10 Different Tools</span>
              </h2>
              <p className="text-slate-400 text-lg mb-12">
                Stop wasting hours on administrative overhead. Aura replaces 5+ tools with one unified platform.
              </p>

              <div className="space-y-6">
                {[
                  "Managing contracts manually",
                  "Tracking unpaid invoices",
                  "Handling taxes & revenue reports",
                  "Organizing client communication",
                  "Switching between multiple tools"
                ].map((pain, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="mt-1 w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20 text-red-400">
                      <AlertCircle size={12} />
                    </div>
                    <span className="text-slate-300 font-medium">{pain}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/5 blur-[100px] rounded-full" />
              <div className="glass-card p-8 border-white/5 relative z-10">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                    <span className="text-red-400 text-sm font-bold">Unpaid Invoice (Stale)</span>
                    <span className="text-white font-mono">$1,200.00</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-white/5 rounded-xl opacity-50">
                    <span className="text-slate-400 text-sm">Contract Draft #4</span>
                    <span className="text-slate-500">v.1.4</span>
                  </div>
                  <div className="flex items-center justify-center p-8 border-2 border-dashed border-white/5 rounded-xl">
                    <p className="text-slate-600 text-sm font-medium">Messy spreadsheets everywhere...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section id="features" className="py-32 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Everything You Need</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              A complete ecosystem designed to make running a freelance business as simple as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Client CRM",
                desc: "Manage clients, contact history, and project relationships.",
                icon: <Users className="w-6 h-6 text-blue-400" />
              },
              {
                title: "Smart Invoicing",
                desc: "Create professional invoices and track payments automatically.",
                icon: <Receipt className="w-6 h-6 text-fuchsia-400" />
              },
              {
                title: "Legal Contracts",
                desc: "Generate legally structured contracts with built-in clauses.",
                icon: <FileSignature className="w-6 h-6 text-indigo-400" />
              },
              {
                title: "Revenue Dashboard",
                desc: "Track income, unpaid invoices, and tax liability in real time.",
                icon: <TrendingUp className="w-6 h-6 text-emerald-400" />
              },
              {
                title: "Payment Automation",
                desc: "Log payments and automatically reconcile revenue.",
                icon: <Settings className="w-6 h-6 text-amber-400" />
              },
              {
                title: "Multi-Currency Support",
                desc: "Work with global clients without worrying about conversions.",
                icon: <Globe className="w-6 h-6 text-cyan-400" />
              }
            ].map((f, i) => (
              <div key={i} className="glass-card p-8 group hover:border-indigo-500/30 transition-all duration-500 h-full flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-6 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm flex-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Product Demo Section */}
      <section id="demo" className="py-24 bg-slate-900/50 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">See Freelancer OS in Action</h2>
            <p className="text-slate-400 max-w-2xl">
              From onboarding a new client to reconciling payments, Aura handles the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-8">
              {[
                { step: "01", title: "Add a Client", desc: "Easily organize contact details and project history." },
                { step: "02", title: "Create a Contract", desc: "Generate ironclad agreements with pre-built clauses." },
                { step: "03", title: "Send Invoice", desc: "Beautiful, tax-compliant invoices sent in one click." },
                { step: "04", title: "Log Payment", desc: "Track revenue and update your dashboard automatically." }
              ].map((item, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="text-2xl font-black text-white/10 group-hover:text-indigo-500/50 transition-colors">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-7 bg-slate-950 border border-white/5 rounded-3xl p-4 shadow-2xl relative overflow-hidden group">
              <div className="aspect-video bg-indigo-500/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent" />
                <LayoutDashboard className="w-20 h-20 text-indigo-500/20 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center shadow-xl shadow-indigo-500/40 cursor-pointer hover:scale-110 transition-transform">
                    <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[12px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Feature Deep Dive */}
      <section className="py-32 space-y-32">
        {/* Contracts */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-4 aspect-square max-w-md mx-auto border-white/5 bg-gradient-to-br from-indigo-500/5 to-transparent">
                <div className="h-full w-full border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                  <FileSignature className="w-24 h-24 text-indigo-500/20" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-6">
                Legal Protection
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Contracts That Protect You</h2>
              <ul className="space-y-4 mb-10">
                {[
                  "Article-based legal structure",
                  "Confidentiality & IP clauses",
                  "Signature-ready PDFs",
                  "Fully editable agreements"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-indigo-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white">
                Explore Contracts
              </Link>
            </div>
          </div>
        </div>

        {/* Invoicing */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/20 text-fuchsia-400 text-xs font-bold mb-6">
                Cash Flow
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Smart Invoicing & Payments</h2>
              <ul className="space-y-4 mb-10">
                {[
                  "Track invoice lifecycle",
                  "Automated payment reconciliation",
                  "Itemized billing and taxes",
                  "Instant PDF generation"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-fuchsia-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white">
                Master Invoicing
              </Link>
            </div>
            <div>
              <div className="glass-card p-4 aspect-square max-w-md mx-auto border-white/5 bg-gradient-to-br from-fuchsia-500/5 to-transparent">
                <div className="h-full w-full border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                  <Receipt className="w-24 h-24 text-fuchsia-500/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="glass-card p-4 aspect-square max-w-md mx-auto border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="h-full w-full border border-dashed border-white/10 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="w-24 h-24 text-emerald-500/20" />
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
                Insights
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Real-Time Business Analytics</h2>
              <ul className="space-y-4 mb-10">
                {[
                  "Monthly revenue charts",
                  "Unpaid invoice tracking",
                  "Estimated tax liability",
                  "Global currency conversion"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-300">
                    <CheckCircle2 size={18} className="text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href="/register" className="btn-secondary py-3 px-6 bg-white/5 border-white/10 text-white">
                View Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Social Proof */}
      <section className="py-32 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Trusted by Freelancers Worldwide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
            <div className="text-center">
              <div className="text-5xl font-black text-indigo-500 mb-2">10,000+</div>
              <div className="text-slate-400 font-medium">Invoices generated</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-fuchsia-500 mb-2">500+</div>
              <div className="text-slate-400 font-medium">Active freelancers</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-black text-emerald-500 mb-2">$2M+</div>
              <div className="text-slate-400 font-medium">Revenue tracked</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 border-white/5 italic text-slate-300 leading-relaxed">
              "Aura replaced 4 tools I was using for contracts and invoices. It's the only operating system that actually understands how freelancers work."
              <div className="mt-6 flex items-center gap-3 not-italic">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
                <div>
                  <div className="text-white font-bold text-sm">Sarah Jenkins</div>
                  <div className="text-slate-500 text-xs">UX Designer & Consultant</div>
                </div>
              </div>
            </div>
            <div className="glass-card p-8 border-white/5 italic text-slate-300 leading-relaxed">
              "Our entire freelance operation runs on this platform. The automated taxing and multi-currency support alone saved us dozens of hours each month."
              <div className="mt-6 flex items-center gap-3 not-italic">
                <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10" />
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
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-16">From Client → Contract → Payment</h2>

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 max-w-5xl mx-auto">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-10 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -z-10" />

            {[
              { title: "Client Created", icon: <Users size={20} /> },
              { title: "Contract Generated", icon: <FileSignature size={20} /> },
              { title: "Invoice Sent", icon: <Receipt size={20} /> },
              { title: "Payment Logged", icon: <TrendingUp size={20} /> },
              { title: "Dashboard Updated", icon: <LayoutDashboard size={20} /> }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/5 transition-all duration-500 shadow-xl">
                  {step.icon}
                </div>
                <div className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">{step.title}</div>
                {i < 4 && <div className="md:hidden text-indigo-500/30 font-black text-2xl">↓</div>}
              </div>
            ))}
          </div>

          <p className="mt-20 text-slate-500 font-medium tracking-wide uppercase text-xs">The OS Concept: Everything connected, perfectly isolated.</p>
        </div>
      </section>

      {/* 8. Security & Reliability */}
      <section id="security" className="py-24 bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="glass-card p-12 lg:p-20 border-white/5 bg-gradient-to-br from-indigo-500/5 via-transparent to-fuchsia-500/5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Built With Security In Mind</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
                  {[
                    { title: "Multi-tenant isolation", icon: <Shield className="text-emerald-400" size={20} /> },
                    { title: "Encrypted Auth", icon: <Lock className="text-emerald-400" size={20} /> },
                    { title: "Data Privacy", icon: <ShieldCheck className="text-emerald-400" size={20} /> },
                    { title: "Cloud Infrastructure", icon: <Globe className="text-emerald-400" size={20} /> }
                  ].map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
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
                  <ShieldCheck size={120} className="text-emerald-500 relative z-10 opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Pricing Teaser */}
      <section id="pricing" className="py-32">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Simple Pricing That Scales</h2>
          <p className="text-slate-400 mb-20 max-w-2xl mx-auto">
            Starting free. Upgrade when your business grows into an agency.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {[
              { name: "Starter", price: "$9", desc: "Best for beginners" },
              { name: "Pro", price: "$29", desc: "Best for professionals", popular: true },
              { name: "Agency", price: "$79", desc: "For freelance teams" }
            ].map((plan, i) => (
              <div key={i} className={`glass-card p-8 border-white/5 relative ${plan.popular ? 'border-indigo-500/30 bg-indigo-500/5' : ''}`}>
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                <div className="text-4xl font-black text-white mb-2">{plan.price}<span className="text-sm font-normal text-slate-500">/mo</span></div>
                <p className="text-slate-500 text-sm mb-8">{plan.desc}</p>
                <div className="w-full h-px bg-white/5 mb-8" />
                <ul className="text-slate-400 text-sm text-left space-y-4 mb-8">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    {plan.name === 'Starter' ? 'Up to 5 clients' : 'Unlimited clients'}
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    Smart Contracts
                  </li>
                </ul>
              </div>
            ))}
          </div>

          <Link href="/pricing" className="inline-flex items-center gap-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors group">
            View Full Feature Comparison <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 10. Final CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tight">
            Start Running Your <br />
            Business Like a Pro
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-xl mx-auto">
            Join 500+ freelancers who have automated their administrative overhead.
            Get started for free today.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
            <Link href="/register" className="btn-primary px-10 py-4 text-lg">
              <span>Start Free <ArrowRight size={18} /></span>
            </Link>
            <Link href="#demo" className="btn-secondary px-10 py-4 text-lg bg-white/5 border-white/10 text-white">
              Book Demo
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

