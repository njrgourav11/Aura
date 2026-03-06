"use client"
import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false);

    const plans = [
        {
            name: "Starter",
            price: isYearly ? 7 : 9,
            desc: "Best for beginners.",
            cta: "Start Free",
            features: [
                "Up to 5 clients",
                "10 invoices per month",
                "Basic contract templates",
                "Dashboard analytics",
                "Manual payment logging",
                "PDF export"
            ]
        },
        {
            name: "Pro",
            price: isYearly ? 24 : 29,
            desc: "Best for professional freelancers.",
            cta: "Upgrade to Pro",
            popular: true,
            features: [
                "Everything in Starter +",
                "Unlimited clients",
                "Unlimited invoices",
                "Recurring invoices",
                "Payment integrations",
                "Client portal",
                "Time tracking",
                "Proposal generator",
                "Multi-currency support",
                "Automation rules"
            ]
        },
        {
            name: "Agency",
            price: isYearly ? 64 : 79,
            desc: "For freelance teams & agencies.",
            cta: "Start Agency Plan",
            features: [
                "Everything in Pro +",
                "Team members",
                "Role based access",
                "Multiple businesses",
                "White labeling",
                "Advanced analytics",
                "API access",
                "Webhooks",
                "Priority support"
            ]
        }
    ];

    const faqs = [
        { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time with no questions asked." },
        { q: "Is my data secure?", a: "We use enterprise-grade encryption and isolated multi-tenant architecture to ensure your data is always safe." },
        { q: "Can I export invoices?", a: "Absolutely. All plans include PDF export for invoices and contracts." },
        { q: "Do clients need an account to pay?", a: "No, clients can view and pay invoices through a secure, non-account portal." },
        { q: "What payment gateways are supported?", a: "We support Stripe, PayPal, and Razorpay for automated reconciliation." }
    ];

    return (
        <div className="flex min-h-screen flex-col bg-slate-950 text-slate-50 selection:bg-indigo-500/30">
            <Navbar />

            <main className="flex-1 pt-32 pb-20">
                <div className="max-w-7xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Simple Pricing for Everyone</h1>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            Start free. Upgrade when your business grows. No hidden fees.
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-20">
                        <span className={`text-sm font-medium ${!isYearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
                        <button
                            onClick={() => setIsYearly(!isYearly)}
                            className="w-14 h-7 bg-slate-800 rounded-full p-1 relative transition-colors border border-white/5"
                        >
                            <div className={`w-5 h-5 bg-indigo-500 rounded-full transition-all duration-300 ${isYearly ? "translate-x-7" : "translate-x-0"}`} />
                        </button>
                        <span className={`text-sm font-medium ${isYearly ? "text-white" : "text-slate-500"}`}>Yearly</span>
                        <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black tracking-widest uppercase px-2 py-1 rounded border border-emerald-500/20">
                            Save 20%
                        </span>
                    </div>

                    {/* Plans */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                        {plans.map((plan, i) => (
                            <div key={i} className={`glass-card p-10 flex flex-col h-full border-white/5 relative ${plan.popular ? "border-indigo-500/30 bg-indigo-500/5" : ""}`}>
                                {plan.popular && (
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-[10px] font-black tracking-widest uppercase px-4 py-1.5 rounded-full shadow-lg">
                                        Most Popular
                                    </div>
                                )}
                                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                <p className="text-slate-500 text-sm mb-6">{plan.desc}</p>
                                <div className="text-5xl font-black mb-10 flex items-baseline">
                                    ${plan.price}
                                    <span className="text-base font-normal text-slate-500 ml-2">/mo</span>
                                </div>

                                <ul className="space-y-4 mb-10 flex-1">
                                    {plan.features.map((feature, j) => (
                                        <li key={j} className="flex items-start gap-3 text-sm text-slate-300">
                                            <CheckCircle2 size={16} className="text-indigo-500 mt-0.5 shrink-0" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>

                                <Link
                                    href="/waitlist"
                                    className={`w-full py-4 rounded-xl font-bold text-center transition-all ${plan.popular
                                            ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-xl shadow-indigo-600/20"
                                            : "bg-white/5 text-white hover:bg-white/10"
                                        }`}
                                >
                                    Join Waitlist
                                </Link>
                            </div>
                        ))}
                    </div>

                    {/* Comparison Table */}
                    <div className="mb-32 overflow-x-auto">
                        <h2 className="text-2xl font-bold mb-12 text-center">Compare Features</h2>
                        <table className="w-full text-left font-medium text-sm">
                            <thead>
                                <tr className="border-b border-white/5 text-slate-500">
                                    <th className="py-4 px-6 font-bold">Feature</th>
                                    <th className="py-4 px-6 font-bold">Starter</th>
                                    <th className="py-4 px-6 font-bold">Pro</th>
                                    <th className="py-4 px-6 font-bold">Agency</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[
                                    ["Clients", "5", "Unlimited", "Unlimited"],
                                    ["Invoices", "10/mo", "Unlimited", "Unlimited"],
                                    ["Contracts", "Basic", "Advanced", "Advanced"],
                                    ["Automation", "❌", "✔", "✔"],
                                    ["Client Portal", "❌", "✔", "✔"],
                                    ["Team Members", "❌", "❌", "✔"],
                                    ["API Access", "❌", "❌", "✔"]
                                ].map((row, i) => (
                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                        <td className="py-5 px-6 text-slate-300 font-bold">{row[0]}</td>
                                        <td className="py-5 px-6 font-mono">{row[1]}</td>
                                        <td className="py-5 px-6 font-mono text-indigo-400">{row[2]}</td>
                                        <td className="py-5 px-6 font-mono text-indigo-400">{row[3]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* FAQs */}
                    <div className="max-w-3xl mx-auto mb-32">
                        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            {faqs.map((faq, i) => (
                                <div key={i} className="glass-card p-6 border-white/5">
                                    <div className="font-bold text-white mb-3 flex items-center gap-3">
                                        <HelpCircle size={18} className="text-indigo-400" />
                                        {faq.q}
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Final CTA */}
                    <div className="glass-card p-12 text-center border-white/5 bg-gradient-to-tr from-indigo-500/10 to-transparent">
                        <h2 className="text-3xl md:text-5xl font-black mb-8 tracking-tight">Ready to Automate Your Business?</h2>
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center">
                            <Link href="/waitlist" className="btn-primary px-10 py-4 text-lg">
                                <span>Join the Waitlist <ArrowRight size={18} /></span>
                            </Link>
                            <Link href="/waitlist?tab=demo" className="btn-secondary px-10 py-4 text-lg bg-white/5 border-white/10 text-white">
                                Schedule a Demo
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
