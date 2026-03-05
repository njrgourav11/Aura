"use client"
import { useState } from "react";
import { Lock, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface PortalLoginProps {
    token: string;
    onVerified: (password: string) => void;
    businessName: string;
}

export default function PortalLogin({ token, onVerified, businessName }: PortalLoginProps) {
    const [password, setPassword] = useState("");
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
                setError(data.error || "Invalid passcode");
            }
        } catch (err) {
            setError("Connection failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 bg-grid-white/[0.02]">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Branding Icon */}
                <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                        <ShieldCheck size={40} className="text-white" />
                    </div>
                </div>

                <div className="glass-card p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />

                    <h2 className="text-3xl font-bold text-white mb-2">Protected Portal</h2>
                    <p className="text-slate-400 mb-8">
                        Please enter the passcode provided by <span className="text-blue-400 font-semibold">{businessName}</span> to access your documents.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6 text-left">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Passcode</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
                                <input
                                    required
                                    autoFocus
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:border-blue-500/50 transition-all text-xl tracking-[0.2em]"
                                    placeholder="••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 text-sm font-medium bg-red-400/10 p-3 rounded-xl border border-red-400/20"
                            >
                                {error}
                            </motion.p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 text-lg group"
                        >
                            {loading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    Verify & Enter
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="mt-8 text-center text-slate-500 text-sm">
                    Secure document portal managed by <span className="text-slate-300 font-medium">Aura Freelancer OS</span>
                </p>
            </motion.div>
        </div>
    );
}
