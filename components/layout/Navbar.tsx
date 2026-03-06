"use client"
import Link from "next/link";
import { ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
    { label: "Features", href: "/#features" },
    { label: "Demo", href: "/#demo" },
    { label: "Pricing", href: "/pricing" },
    { label: "Security", href: "/#security" },
    { label: "Schedule Demo", href: "/waitlist?tab=demo" }
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            if (menuOpen) setMenuOpen(false);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen]);

    // Close menu on route change / link click
    const handleLinkClick = () => setMenuOpen(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
            ? "bg-slate-950/90 backdrop-blur-lg border-b border-white/5 py-3"
            : "bg-transparent py-5"
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group" onClick={handleLinkClick}>
                    <img src="/logo.svg" alt="FreelanceOS" className="h-8 md:h-10 w-auto object-contain" />
                    <span className="font-bold text-xl md:text-2xl tracking-tight text-white">
                        Freelance<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">OS</span>
                    </span>
                </Link>

                {/* Desktop Nav Links */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Desktop CTA */}
                <div className="hidden md:flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2">
                        Log in
                    </Link>
                    <Link href="/waitlist" className="btn-primary py-2 px-5 text-sm">
                        <span>Join Waitlist <ArrowRight className="w-4 h-4 ml-1" /></span>
                    </Link>
                </div>

                {/* Mobile: Log in + Hamburger */}
                <div className="flex md:hidden items-center gap-2">
                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-3 py-2">
                        Log in
                    </Link>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        aria-label="Toggle menu"
                    >
                        {menuOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </div>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden bg-slate-950/95 backdrop-blur-lg border-t border-white/5 px-4 py-4 space-y-1">
                    {navLinks.map((item) => (
                        <Link
                            key={item.label}
                            href={item.href}
                            onClick={handleLinkClick}
                            className="block px-4 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            {item.label}
                        </Link>
                    ))}
                    <div className="pt-3 border-t border-white/5 mt-2 space-y-2">
                        <Link
                            href="/waitlist"
                            onClick={handleLinkClick}
                            className="btn-primary py-3 text-sm w-full text-center block"
                        >
                            <span>Join Waitlist <ArrowRight className="w-4 h-4 inline ml-1" /></span>
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
