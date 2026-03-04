"use client"
import { Bell, Search, User, LogOut } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

export default function TopBar() {
    const { data: session } = useSession();

    return (
        <header className="h-20 flex-shrink-0 flex items-center justify-between px-6 md:px-8 border-b border-white/5 bg-slate-900/40 backdrop-blur-md z-30 sticky top-0 w-full">

            {/* Search */}
            <div className="flex-1 max-w-md hidden md:block">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/30 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800/50 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all sm:text-sm"
                        placeholder="Search contracts, invoices..."
                    />
                </div>
            </div>

            {/* Mobile Spacer */}
            <div className="md:hidden flex-1"></div>

            {/* Right Side */}
            <div className="flex items-center gap-4 md:gap-6">
                {/* Notifications */}
                <button className="relative p-2 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-fuchsia-500 rounded-full animate-pulse-slow"></span>
                </button>

                {/* User Info */}
                <div className="flex items-center gap-3 pl-4 md:pl-6 border-l border-white/5">
                    <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-medium text-slate-200">{session?.user?.name || "User"}</span>
                        <span className="text-xs text-slate-500">{session?.user?.email}</span>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-fuchsia-500 p-[2px] cursor-pointer hover:shadow-lg hover:shadow-indigo-500/20 transition-all group relative"
                    >
                        <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center overflow-hidden border border-slate-800 group-hover:bg-slate-800 transition-colors">
                            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-white" />
                        </div>
                    </button>
                </div>
            </div>
        </header>
    );
}

