"use client"
import { useState } from "react";
import { Lock, Loader2, ArrowRight, ShieldCheck, Eye, EyeOff, FileText, CreditCard, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface PortalLoginProps {
    token: string;
    onVerified: (password: string) => void;
    businessName: string;
}

export default function PortalLogin({ token, onVerified, businessName }: PortalLoginProps) {
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/portal/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });

            if (res.ok) {
                onVerified(password);
            } else {
                const data = await res.json();
                setError(data.error || "Invalid passcode. Please try again.");
            }
        } catch (err) {
            setError("Connection failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <FileText size={18} />, label: "View Contracts & Agreements" },
        { icon: <CreditCard size={18} />, label: "Access Invoices & Pay Online" },
        { icon: <Briefcase size={18} />, label: "Track Project Progress" },
    ];

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Atmospheric background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 blur-[140px] rounded-full" />
                <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            <div className="relative w-full max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/60"
                >
                    {/* Left Panel — Brand Info */}
                    <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-blue-600/20 via-indigo-600/10 to-slate-900 border-r border-white/5">
                        {/* Logo / Business Name */}
                        <div>
                            <div className="flex items-center gap-3 mb-10">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <ShieldCheck size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="font-bold text-white text-sm">{businessName}</div>
                                    <div className="text-xs text-slate-400">Client Portal</div>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-white leading-tight mb-4">
                                Your Secure<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                    Document Hub
                                </span>
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Access your invoices, contracts, and project updates securely shared by {businessName}.
                            </p>
                        </div>

                        {/* Feature Pills */}
                        <div className="space-y-3">
                            <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-5">What you can access</p>
                            {features.map((f, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 text-slate-300 text-sm"
                                >
                                    <span className="text-blue-400">{f.icon}</span>
                                    {f.label}
                                </motion.div>
                            ))}
                        </div>

                        {/* Footer note */}
                        <p className="text-xs text-slate-600 mt-8">
                            Powered by <span className="text-slate-400 font-semibold">FreelanceOS</span>
                        </p>
                    </div>

                    {/* Right Panel — Login Form */}
                    <div className="bg-slate-900 p-8 sm:p-10 flex flex-col justify-center">
                        {/* Mobile logo */}
                        <div className="flex lg:hidden items-center gap-3 mb-8">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                <ShieldCheck size={18} className="text-white" />
                            </div>
                            <div>
                                <div className="font-bold text-white text-sm">{businessName}</div>
                                <div className="text-xs text-slate-400">Client Portal</div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-2xl sm:text-3xl font-black text-white mb-2">Welcome Back</h1>
                            <p className="text-slate-400 text-sm">
                                Enter the passcode provided by <span className="text-blue-400 font-semibold">{businessName}</span> to continue.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Password Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    Access Passcode
                                </label>
                                <div className="relative group">
                                    <Lock
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors"
                                        size={16}
                                    />
                                    <input
                                        required
                                        autoFocus
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-11 pr-12 py-4 bg-slate-800 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all text-base"
                                        placeholder="Enter your passcode..."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            {/* Error */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -6 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
                                >
                                    <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-black flex-shrink-0">!</span>
                                    {error}
                                </motion.div>
                            )}

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading || !password}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 text-base group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Access Portal
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-8 text-center text-slate-600 text-xs">
                            Contact <span className="text-slate-400">{businessName}</span> if you don&apos;t have your passcode.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
