import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication | Aura",
    description: "Sign in to your Aura account",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[var(--background)] flex">
            {/* Left side - Dynamic branding/graphics */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-r border-white/5 overflow-hidden flex-col items-center justify-center p-12">
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-slate-900/50 to-fuchsia-500/20" />
                    {/* Animated meshes / abstract shapes */}
                    <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-indigo-500/20 blur-[120px] mix-blend-screen animate-pulse-slow" />
                    <div className="absolute top-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-fuchsia-500/20 blur-[100px] mix-blend-screen animate-pulse-slow tracking-wide" style={{ animationDelay: '2s' }} />
                </div>

                <div className="relative z-10 w-full max-w-lg">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        Manage your freelance business <span className="text-gradient">beautifully.</span>
                    </h1>
                    <p className="text-lg text-slate-400 mb-12">
                        Automate contracts, track invoices, receive payments, and simplify your taxes — all from a single dashboard built for modern professionals.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        {['Smart Contracts', 'Auto Invoicing', 'Global Payments', 'Tax Reports'].map(feature => (
                            <div key={feature} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-indigo-400" />
                                <span className="text-slate-300 font-medium">{feature}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right side - Forms */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
                {/* Mobile Background Glows */}
                <div className="absolute -top-32 -right-32 w-64 h-64 bg-fuchsia-500/20 rounded-full blur-[80px] lg:hidden" />
                <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-indigo-500/20 rounded-full blur-[80px] lg:hidden" />

                <div className="w-full max-w-md relative z-10">
                    {children}
                </div>
            </div>
        </div>
    );
}
