import React from "react";

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 flex flex-col min-h-screen">
                <nav className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center font-bold text-lg">
                                A
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                                Aura Client Hub
                            </span>
                        </div>
                        <div className="text-xs text-white/40 font-mono hidden md:block">
                            SECURE ACCESS PORTAL
                        </div>
                    </div>
                </nav>

                <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
                    {children}
                </main>

                <footer className="border-t border-white/5 bg-black/20 backdrop-blur-xl py-8">
                    <div className="max-w-7xl mx-auto px-4 text-center text-white/40 text-sm">
                        Powered by <span className="text-indigo-400 font-semibold">Aura Freelancer OS</span>
                        <p className="mt-1 lowercase">Professional. Secure. Transparent.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}
