"use client"
import { useState, useEffect } from "react";
import PortalLogin from "./PortalLogin";
import { Loader2, ShieldAlert } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { FileText, CreditCard, Briefcase, Flag, Package } from "lucide-react";
import { format } from "date-fns";
import { PortalDownloadButton, PortalViewButton } from "@/components/portal/PortalActions";
import RazorpayPaymentButton from "@/components/payments/RazorpayPaymentButton";

interface PortalContainerProps {
    token: string;
    initialData: {
        isProtected: boolean;
        businessName: string;
        clientName: string;
    };
}

export default function PortalContainer({ token, initialData }: PortalContainerProps) {
    const [isVerified, setIsVerified] = useState(!initialData.isProtected);
    const [password, setPassword] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(initialData.isProtected ? false : true);
    const [error, setError] = useState("");

    const fetchFullData = async (pwd?: string) => {
        setLoading(true);
        try {
            const res = await fetch("/api/portal/data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: pwd || password }),
            });

            if (res.ok) {
                const fullData = await res.json();
                setData(fullData);
                setIsVerified(true);
                if (pwd) setPassword(pwd);
            } else {
                setError("Failed to load portal data. Please try again.");
            }
        } catch (err) {
            setError("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData.isProtected) {
            fetchFullData();
        }
    }, []);

    if (!isVerified) {
        return (
            <PortalLogin
                token={token}
                businessName={initialData.businessName}
                onVerified={(pwd) => fetchFullData(pwd)}
            />
        );
    }

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-slate-500">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                <p className="font-medium">Securing your session and loading documents...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Access Error</h2>
                <p className="text-slate-400 mb-6">{error || "Unable to display portal documents."}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
                >
                    Retry Access
                </button>
            </div>
        );
    }

    const { client, user, invoices, contracts, projects } = data;

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Hero / Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-bold mb-2 text-white">Welcome, {client.name}</h1>
                    <p className="text-white/40 max-w-lg">
                        Manage your invoices, view active contracts, and keep track of your project progress with {user.businessName || user.name}.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-4 rounded-xl backdrop-blur-sm">
                    <div className="text-right">
                        <div className="text-xs text-white/40 uppercase font-bold tracking-wider">Service Provider</div>
                        <div className="font-semibold text-lg text-white">{user.businessName || user.name}</div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-400">
                            <CreditCard size={20} />
                        </div>
                        <h3 className="text-white/60 font-medium">Pending Payments</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {invoices.filter((i: any) => i.status !== 'Paid').length} Invoices
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-400">
                            <FileText size={20} />
                        </div>
                        <h3 className="text-white/60 font-medium">Active Contracts</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {contracts.filter((c: any) => c.status === 'Signed').length} Signed
                    </div>
                </div>
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-6 glass-card">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-400">
                            <Briefcase size={20} />
                        </div>
                        <h3 className="text-white/60 font-medium">Active projects</h3>
                    </div>
                    <div className="text-2xl font-bold text-white">
                        {projects.filter((p: any) => p.status === 'Active').length}
                    </div>
                </div>
            </div>

            {/* Projects Section */}
            {projects.length > 0 && (
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-l-4 border-emerald-500 pl-4 py-1">
                        <h2 className="text-2xl font-bold text-white">Active Projects</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {projects.map((project: any) => {
                            const completedTasks = project.tasks.filter((t: any) => t.completed).length;
                            const totalTasks = project.tasks.length;
                            const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

                            return (
                                <div key={project._id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 glass-card">
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="space-y-1">
                                            <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                                            <StatusBadge status={project.status} />
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[10px] text-white/30 uppercase font-bold tracking-widest mb-1">Overall Progress</div>
                                            <div className="text-xl font-bold text-emerald-400">{Math.round(progress)}%</div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        {project.milestones?.length > 0 && (
                                            <div className="space-y-3">
                                                <div className="text-xs text-white/30 uppercase font-bold tracking-widest flex items-center gap-2">
                                                    <Flag size={12} /> Upcoming Milestones
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    {project.milestones.slice(0, 2).map((ms: any, idx: number) => (
                                                        <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                                                            <span className={`text-sm ${ms.completed ? 'text-white/20 line-through' : 'text-white/70'}`}>
                                                                {ms.title}
                                                            </span>
                                                            <span className="text-[10px] text-white/30">
                                                                {ms.dueDate ? format(new Date(ms.dueDate), "MMM d") : ""}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            {/* Invoices Section */}
            <section className="space-y-6">
                <div className="flex items-center gap-3 border-l-4 border-indigo-500 pl-4 py-1">
                    <h2 className="text-2xl font-bold text-white">Invoices & Billing</h2>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {invoices.length > 0 ? invoices.map((invoice: any) => (
                        <div key={invoice._id} className="group bg-white/[0.03] border border-white/10 rounded-2xl p-6 transition-all duration-300">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40">
                                        <Package size={24} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-bold text-lg text-white">Invoice #{invoice.invoiceNumber}</span>
                                            <StatusBadge status={invoice.status} />
                                        </div>
                                        <div className="text-white/40 text-sm">
                                            <span>Issued: {format(new Date(invoice.issuedAt), "PPP")}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <div className="text-2xl font-bold text-indigo-400">
                                            {invoice.total.toLocaleString()} {invoice.currency}
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <PortalDownloadButton
                                            type="invoice"
                                            data={invoice}
                                            businessDetails={user}
                                            clientName={client.name}
                                            clientAddress={client.address}
                                            clientEmail={client.email}
                                        />
                                        {invoice.status !== 'Paid' && (
                                            <RazorpayPaymentButton
                                                invoice={invoice}
                                                businessDetails={user}
                                                portalToken={token}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="py-12 text-center text-white/30 font-medium">No invoices yet.</div>
                    )}
                </div>
            </section>

            {/* Contracts Section */}
            <section className="space-y-6 pb-20">
                <div className="flex items-center gap-3 border-l-4 border-purple-500 pl-4 py-1">
                    <h2 className="text-2xl font-bold text-white">Contracts</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {contracts.length > 0 ? contracts.map((contract: any) => (
                        <div key={contract._id} className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 glass-card">
                            <h3 className="text-2xl font-bold mb-4 text-white">{contract.title}</h3>
                            <div className="flex items-center justify-between">
                                <StatusBadge status={contract.status} />
                                <PortalViewButton
                                    type="contract"
                                    data={contract}
                                    businessDetails={user}
                                    clientName={client.name}
                                    clientAddress={client.address}
                                    clientEmail={client.email}
                                />
                            </div>
                        </div>
                    )) : (
                        <div className="col-span-full py-12 text-center text-white/30 font-medium">No contracts yet.</div>
                    )}
                </div>
            </section>
        </div>
    );
}
