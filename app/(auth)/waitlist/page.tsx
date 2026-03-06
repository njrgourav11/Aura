"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, CheckCircle2, Sparkles, Calendar, Users, Clock } from "lucide-react";
import { Suspense } from "react";

type Tab = "waitlist" | "demo";

function WaitlistContent() {
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<Tab>("waitlist");

    useEffect(() => {
        if (searchParams.get("tab") === "demo") {
            setActiveTab("demo");
        }
    }, [searchParams]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 sm:p-10 w-full"
        >
            {/* Logo */}
            <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">FreelanceOS</span>
            </div>

            {/* Tab Toggle */}
            <div className="flex gap-1 p-1 bg-slate-900/80 border border-white/8 rounded-2xl mb-8">
                {(["waitlist", "demo"] as Tab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                            activeTab === tab
                                ? "bg-white/10 text-white shadow"
                                : "text-slate-500 hover:text-slate-300"
                        }`}
                    >
                        {tab === "waitlist" ? (
                            <><Users size={15} /> Join Waitlist</>
                        ) : (
                            <><Calendar size={15} /> Request a Demo</>
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === "waitlist" ? (
                    <WaitlistForm key="waitlist" />
                ) : (
                    <DemoForm key="demo" />
                )}
            </AnimatePresence>

            <div className="mt-8 text-center lg:text-left">
                <p className="text-slate-400 text-sm">
                    Already have an account?{" "}
                    <Link href="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

export default function WaitlistPage() {
    return (
        <Suspense fallback={null}>
            <WaitlistContent />
        </Suspense>
    );
}

function WaitlistForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", businessType: "", referral: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY",
                    subject: "New FreelanceOS Waitlist Signup",
                    from_name: "FreelanceOS Waitlist",
                    ...form,
                    formType: "Waitlist",
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) return <SuccessState type="waitlist" />;

    return (
        <motion.div
            key="waitlist-form"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.25 }}
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Join the Waitlist</h2>
                <p className="text-slate-400 text-sm">Be first in line when we open access. Limited spots available.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="wl-name">Full Name</label>
                    <input
                        id="wl-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Alex Smith"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="wl-email">Work Email</label>
                    <input
                        id="wl-email"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="alex@example.com"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="wl-phone">Phone Number</label>
                    <input
                        id="wl-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+91 98765 43210"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="wl-businessType">I am a</label>
                    <select
                        id="wl-businessType"
                        name="businessType"
                        value={form.businessType}
                        onChange={handleChange}
                        className="input-field"
                        required
                    >
                        <option value="" disabled>Select one...</option>
                        <option value="Solo Freelancer">Solo Freelancer</option>
                        <option value="Small Agency (2-10)">Small Agency (2–10 people)</option>
                        <option value="Growing Agency (10+)">Growing Agency (10+ people)</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="wl-referral">How did you hear about us?</label>
                    <input
                        id="wl-referral"
                        name="referral"
                        type="text"
                        value={form.referral}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Twitter, Google, a friend..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 mt-2 text-base shadow-indigo-500/25"
                >
                    <span>
                        {loading
                            ? <Loader2 className="w-5 h-5 animate-spin" />
                            : <>Request Early Access <ArrowRight className="w-4 h-4 ml-1" /></>
                        }
                    </span>
                </button>
            </form>
        </motion.div>
    );
}

function DemoForm() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", teamSize: "", preferredTime: "", message: "" });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const res = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "YOUR_WEB3FORMS_ACCESS_KEY",
                    subject: "New FreelanceOS Demo Request",
                    from_name: "FreelanceOS Demo Request",
                    ...form,
                    formType: "Demo Request",
                }),
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) return <SuccessState type="demo" />;

    return (
        <motion.div
            key="demo-form"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
        >
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-1">Schedule a Demo</h2>
                <p className="text-slate-400 text-sm">Tell us about your business and we&apos;ll reach out within 24 hours to book a personalised walkthrough.</p>
            </div>

            {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-name">Full Name</label>
                        <input
                            id="demo-name"
                            name="name"
                            type="text"
                            value={form.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Alex Smith"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-email">Work Email</label>
                        <input
                            id="demo-email"
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="alex@example.com"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-phone">Phone Number</label>
                    <input
                        id="demo-phone"
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="+91 98765 43210"
                    />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-company">Company / Business Name</label>
                        <input
                            id="demo-company"
                            name="company"
                            type="text"
                            value={form.company}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Alex Designs"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-teamSize">Team Size</label>
                        <select
                            id="demo-teamSize"
                            name="teamSize"
                            value={form.teamSize}
                            onChange={handleChange}
                            className="input-field"
                            required
                        >
                            <option value="" disabled>Select...</option>
                            <option value="Just me">Just me</option>
                            <option value="2-5">2–5 people</option>
                            <option value="6-15">6–15 people</option>
                            <option value="15+">15+ people</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-preferredTime">Preferred Time for Demo</label>
                    <input
                        id="demo-preferredTime"
                        name="preferredTime"
                        type="text"
                        value={form.preferredTime}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="e.g. Weekday mornings IST, anytime Friday..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="demo-message">What are you hoping to solve?</label>
                    <textarea
                        id="demo-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Brief overview of your current workflow and pain points..."
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 mt-2 text-base"
                    style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)" }}
                >
                    <span>
                        {loading
                            ? <Loader2 className="w-5 h-5 animate-spin" />
                            : <>Book My Demo <Calendar className="w-4 h-4 ml-1" /></>
                        }
                    </span>
                </button>
            </form>
        </motion.div>
    );
}

function SuccessState({ type }: { type: "waitlist" | "demo" }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center py-10"
        >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            {type === "waitlist" ? (
                <>
                    <h3 className="text-2xl font-bold text-white mb-2">You&apos;re on the list! 🎉</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                        We&apos;ll reach out as soon as your spot opens up. Keep an eye on your inbox.
                    </p>
                </>
            ) : (
                <>
                    <h3 className="text-2xl font-bold text-white mb-2">Demo Requested! 🚀</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto leading-relaxed">
                        Thanks! We&apos;ll review your details and reach out within 24 hours to confirm your demo time.
                    </p>
                </>
            )}
            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-600">
                <Clock size={12} />
                <span>{type === "waitlist" ? "We'll be in touch soon." : "Response within 24 hours."}</span>
            </div>
        </motion.div>
    );
}
