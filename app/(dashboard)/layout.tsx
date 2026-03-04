"use client"
import Sidebar from "@/components/layout/Sidebar";
import TopBar from "@/components/layout/TopBar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full bg-[var(--background)] overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col relative overflow-hidden">
                {/* Glow effect for main content area */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-indigo-500/10 blur-[100px] pointer-events-none" />

                <TopBar />
                <main className="flex-1 overflow-y-auto p-6 md:p-8 z-10 w-full pb-24 lg:pb-8">
                    <div className="mx-auto max-w-7xl animate-fade-in w-full min-h-[calc(100vh-200px)]">
                        {children}
                    </div>

                    <footer className="mt-20 py-8 border-t border-white/5 text-center">
                        <p className="text-slate-500 text-xs">
                            © {new Date().getFullYear()} Aura Freelancer OS. Handcrafted for modern professionals.
                        </p>
                    </footer>
                </main>
            </div>
        </div>
    );
}
