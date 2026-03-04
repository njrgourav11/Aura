"use client"
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (res?.error) {
                setError("Invalid email or password");
                setLoading(false);
            } else {
                router.push("/");
            }
        } catch {
            setError("An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card p-8 sm:p-10 w-full"
        >
            <div className="flex items-center gap-2 mb-8 justify-center lg:justify-start">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">Aura</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Welcome back</h2>
                <p className="text-slate-400">Enter your credentials to access your dashboard</p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                >
                    {error}
                </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field"
                        placeholder="alex@example.com"
                        required
                    />
                </div>

                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-sm font-medium text-slate-300" htmlFor="password">Password</label>
                        <Link href="#" className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                            Forgot password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 mt-2 text-base shadow-indigo-500/25"
                >
                    <span>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
                        {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                    </span>
                </button>
            </form>

            <div className="mt-8 text-center lg:text-left">
                <p className="text-slate-400 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/register" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                        Create an account
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
