import Link from "next/link";
import { ArrowRight, FileSignature, Receipt, Settings, ShieldCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden pt-32 pb-20">
        {/* Background Glows */}
        <div className="absolute top-0 -translate-y-12 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 translate-y-24 right-0 w-[500px] h-[400px] bg-fuchsia-500/10 blur-[100px] rounded-full pointer-events-none" />

        {/* Main Content */}
        <main className="z-10 flex flex-col items-center text-center px-6 max-w-5xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-8">
            <ShieldCheck className="w-4 h-4" />
            <span>The Ultimate Freelancer OS</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-slate-50 tracking-tight leading-tight mb-6">
            Automate your <span className="text-gradient">freelance</span> business.
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-12">
            Create ironclad contracts, generate professional invoices, track every payment, and manage your taxes automatically. Designed exclusively for modern freelancers and agencies.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/register" className="btn-primary w-full sm:w-auto text-base px-8 py-3.5">
              <span>Get Started for Free <ArrowRight className="w-4 h-4" /></span>
            </Link>
            <Link href="/login" className="btn-secondary w-full sm:w-auto text-base px-8 py-3.5">
              Sign In
            </Link>
          </div>

          <div id="features" className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 text-left w-full">
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <FileSignature className="w-6 h-6 text-indigo-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Smart Contracts</h3>
              <p className="text-slate-400 text-sm">Create and sign professional contracts with pre-built clauses and digital signatures in seconds.</p>
            </div>
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-fuchsia-500/10 flex items-center justify-center border border-fuchsia-500/20">
                <Receipt className="w-6 h-6 text-fuchsia-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Automated Invoicing</h3>
              <p className="text-slate-400 text-sm">Generate beautiful, tax-compliant invoices automatically when milestones are reached.</p>
            </div>
            <div className="glass-card p-6 flex flex-col gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                <Settings className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-slate-100">Business Autopilot</h3>
              <p className="text-slate-400 text-sm">Track active projects, pending payments, and estimated taxes all from one unified dashboard.</p>
            </div>
          </div>
        </main>
      </div>

      {/* Pricing Skeleton */}
      <section id="pricing" className="py-24 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-12">Simple, transparent pricing.</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Starter', 'Pro', 'Agency'].map((plan) => (
              <div key={plan} className="glass-card p-8 flex flex-col h-full border-white/5">
                <h3 className="text-xl font-bold mb-2">{plan}</h3>
                <div className="text-4xl font-bold mb-6">$29<span className="text-sm text-slate-500 font-normal">/mo</span></div>
                <ul className="text-slate-400 text-sm space-y-4 mb-8 flex-1">
                  <li>Unlimited Invoices</li>
                  <li>Smart Contracts</li>
                  <li>Client Portal</li>
                </ul>
                <Link href="/register" className={`w-full py-3 rounded-lg font-medium transition-all ${plan === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}>
                  Choose {plan}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

