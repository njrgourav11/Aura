"use client"
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    LayoutDashboard,
    FileSignature,
    Receipt,
    Wallet,
    PieChart,
    Users,
    Settings,
    Menu,
    X,
    Sparkles
} from "lucide-react";

const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: 0 },
    { name: "Projects", href: "/projects", icon: Briefcase, badge: 0 },
    { name: "Contracts", href: "/contracts", icon: FileSignature, badge: 2 },
    { name: "Invoices", href: "/invoices", icon: Receipt, badge: 0 },
    { name: "Payments", href: "/payments", icon: Wallet, badge: 0 },
    { name: "Tax Reports", href: "/tax", icon: PieChart, badge: 0 },
    { name: "Clients", href: "/clients", icon: Users, badge: 0 },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) setIsOpen(false);
            else setIsOpen(true);
        };

        checkScreenSize();
        window.addEventListener("resize", checkScreenSize);
        return () => window.removeEventListener("resize", checkScreenSize);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    const sidebarContent = (
        <div className="flex flex-col h-full bg-slate-900/60 backdrop-blur-2xl border-r border-[var(--card-border)] text-slate-300 w-64 shadow-2xl relative">
            {/* Brand */}
            <div className="h-20 flex items-center px-6 border-b border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-3 relative z-10 w-full justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white">Aura</span>
                    </div>
                    {isMobile && (
                        <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-white/5 text-slate-400">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Nav Links */}
            <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto w-full">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu</div>
                {navItems.map((item) => {
                    const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/");
                    return (
                        <Link key={item.name} href={item.href} className="block w-full">
                            <div className={`
                flex items-center justify-between px-3 py-3 rounded-xl transition-all duration-200 group relative w-full
                ${isActive ? 'bg-indigo-500/15 text-indigo-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' : 'hover:bg-white/5 hover:text-white'}
              `}>
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-transparent rounded-xl border border-indigo-500/20"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    />
                                )}

                                <div className="flex items-center gap-3 relative z-10 w-full overflow-hidden">
                                    <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-indigo-400 transition-colors'}`} />
                                    <span className={`font-medium text-sm truncate w-full ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                </div>

                                {item.badge > 0 && (
                                    <div className="relative z-10 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-shadow-indigo-500/50 flex-shrink-0 ml-2">
                                        {item.badge}
                                    </div>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Bottom Settings */}
            <div className="p-4 border-t border-white/5 w-full">
                <Link href="/settings" className="block w-full">
                    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 transition-all text-slate-400 hover:text-white w-full">
                        <Settings className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm truncate w-full">Settings</span>
                    </div>
                </Link>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button */}
            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-4 rounded-full bg-slate-800/90 backdrop-blur border border-slate-700 shadow-2xl text-white flex items-center gap-2"
                >
                    <Menu className="w-5 h-5" />
                    <span className="font-medium text-sm">Menu</span>
                </button>
            )}

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSidebar}
                        className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Container */}
            <AnimatePresence initial={false}>
                {(isOpen || !isMobile) && (
                    <motion.aside
                        initial={{ x: -280, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -280, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                        className={`
              ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative z-20'}
              h-full flex-shrink-0
            `}
                    >
                        {sidebarContent}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}
