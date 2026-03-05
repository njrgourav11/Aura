"use client"
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-slate-950/80 backdrop-blur-lg border-b border-white/5 py-4"
            : "bg-transparent py-6"
            }`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <img src="/logo.svg" alt="FreelanceOS" className="h-10 w-auto object-contain" />
                    <span className="font-bold text-2xl tracking-tight text-white">
                        Freelance<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">OS</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {[
                        { label: "Features", href: "/#features" },
                        { label: "Demo", href: "/#demo" },
                        { label: "Pricing", href: "/pricing" },
                        { label: "Security", href: "/#security" }
                    ].map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                        Log in
                    </Link>
                    <Link href="/register" className="btn-primary py-2 px-5 text-sm">
                        <span>Get Started <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
