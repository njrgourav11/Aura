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
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white">Aura</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {["Features", "Pricing"].map((item) => (
                        <Link
                            key={item}
                            href={`/#${item.toLowerCase()}`}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            {item}
                        </Link>
                    ))}
                    {["Testimonials", "FAQ"].map((item) => (
                        <span
                            key={item}
                            className="text-sm font-medium text-slate-600/50 cursor-not-allowed"
                            title="Coming Soon"
                        >
                            {item}
                        </span>
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
