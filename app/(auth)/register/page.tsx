"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        businessName: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
                setLoading(false);
            } else {
                // Auto-login after registration
                const result = await signIn("credentials", {
                    email: formData.email,
                    password: formData.password,
                    redirect: false,
                });

                if (result?.error) {
                    router.push("/login?registered=true");
                } else {
                    router.push("/dashboard");
                }
            }
        } catch {
            setError("Failed to register. Please try again.");
            setLoading(false);
        }
    };


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
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
                <span className="font-bold text-2xl tracking-tight text-white">FreelanceOS</span>
            </div>

            <div className="mb-8 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Create an account</h2>
                <p className="text-slate-400">Start managing your freelance business today</p>
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

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Alex Smith"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="businessName">Business Name</label>
                        <input
                            id="businessName"
                            type="text"
                            value={formData.businessName}
                            onChange={handleChange}
                            className="input-field"
                            placeholder="Alex Designs"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="alex@example.com"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5" htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="••••••••"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full py-3 mt-4 text-base shadow-indigo-500/25"
                >
                    <span>
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign up"}
                        {!loading && <ArrowRight className="w-4 h-4 ml-1" />}
                    </span>
                </button>
            </form>

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
