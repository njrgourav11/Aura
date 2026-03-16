"use client"
import { useState, useEffect } from "react";
import PortalLogin from "./PortalLogin";
import { Loader2, ShieldAlert, LayoutDashboard, Briefcase, FileText, CreditCard, CheckCircle2, Circle, Flag, StickyNote, ChevronDown, ChevronUp, Calendar, Package, Download, Eye } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
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

type Tab = "overview" | "projects" | "invoices" | "contracts";

function ProgressRing({ progress }: { progress: number }) {
    const r = 26;
    const circ = 2 * Math.PI * r;
    const offset = circ - (progress / 100) * circ;
    return (
        <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
            {/* SVG rotated so arc starts at top */}
            <svg width="64" height="64" className="absolute inset-0 rotate-[-90deg]">
                <circle cx="32" cy="32" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                <circle
                    cx="32" cy="32" r={r} fill="none"
                    stroke="#10b981" strokeWidth="5"
                    strokeDasharray={circ}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.8s ease" }}
                />
            </svg>
            {/* Text overlay — not affected by SVG rotation */}
            <span className="relative text-xs font-black text-white z-10">
                {Math.round(progress)}%
            </span>
        </div>
    );
}

function ProjectCard({ project, client, user }: { project: any; client: any; user: any }) {
    const [expanded, setExpanded] = useState(false);
    const completedTasks = project.tasks.filter((t: any) => t.completed).length;
    const totalTasks = project.tasks.length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const completedMilestones = project.milestones?.filter((m: any) => m.completed).length || 0;
    const totalMilestones = project.milestones?.length || 0;

    const statusColors: Record<string, string> = {
        Active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        Planning: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        Completed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        "On Hold": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    return (
        <div className="bg-slate-900 border border-white/8 rounded-2xl overflow-hidden transition-all duration-300">
            {/* Card Header */}
            <div className="p-6">
                <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[project.status] || statusColors.Planning}`}>
                                {project.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white truncate">{project.title}</h3>
                        {project.description && (
                            <p className="text-slate-400 text-sm mt-1 line-clamp-2">{project.description}</p>
                        )}
                    </div>
                    <div className="flex-shrink-0">
                        <ProgressRing progress={progress} />
                    </div>
                </div>

                {/* Quick stat pills */}
                <div className="flex flex-wrap gap-2 mb-5">
                    {totalTasks > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 border border-white/5">
                            <CheckCircle2 size={12} className="text-emerald-400" />
                            {completedTasks}/{totalTasks} tasks
                        </div>
                    )}
                    {totalMilestones > 0 && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 border border-white/5">
                            <Flag size={12} className="text-amber-400" />
                            {completedMilestones}/{totalMilestones} milestones
                        </div>
                    )}
                    {project.endDate && (
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs text-slate-400 border border-white/5">
                            <Calendar size={12} className="text-blue-400" />
                            Due {format(new Date(project.endDate), "MMM d, yyyy")}
                        </div>
                    )}
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-700"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Expandable Details */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between px-6 py-3 border-t border-white/5 text-xs text-slate-500 hover:text-slate-300 hover:bg-white/3 transition-colors"
            >
                <span>{expanded ? "Hide details" : "View tasks & milestones"}</span>
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {expanded && (
                <div className="px-6 pb-6 space-y-6 border-t border-white/5 pt-5">
                    {/* Tasks */}
                    {project.tasks.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Tasks</p>
                            <div className="space-y-2">
                                {project.tasks.map((task: any, i: number) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${task.completed ? "bg-emerald-500/5 border-emerald-500/10" : "bg-white/3 border-white/5"}`}>
                                        <div className="mt-0.5 flex-shrink-0">
                                            {task.completed
                                                ? <CheckCircle2 size={16} className="text-emerald-500" />
                                                : <Circle size={16} className="text-slate-600" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm font-medium ${task.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                                {task.title}
                                            </p>
                                            {task.dueDate && (
                                                <p className="text-xs text-slate-600 mt-0.5">
                                                    Due {format(new Date(task.dueDate), "MMM d, yyyy")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Milestones */}
                    {project.milestones?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <Flag size={11} className="text-amber-400" /> Milestones
                            </p>
                            <div className="space-y-2">
                                {project.milestones.map((ms: any, i: number) => (
                                    <div key={i} className={`flex items-center justify-between gap-3 p-3 rounded-xl border ${ms.completed ? "bg-amber-500/5 border-amber-500/10" : "bg-white/3 border-white/5"}`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ms.completed ? "bg-amber-400" : "bg-slate-600"}`} />
                                            <span className={`text-sm font-medium ${ms.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                                                {ms.title}
                                            </span>
                                        </div>
                                        {ms.dueDate && (
                                            <span className="text-xs text-slate-600 flex-shrink-0">
                                                {format(new Date(ms.dueDate), "MMM d")}
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notes (client-visible updates) */}
                    {project.notes?.length > 0 && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <StickyNote size={11} className="text-blue-400" /> Project Updates
                            </p>
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                                {[...project.notes].reverse().map((note: any, i: number) => (
                                    <div key={i} className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10">
                                        <p className="text-sm text-slate-300 leading-relaxed">{note.content}</p>
                                        <p className="text-xs text-slate-600 mt-1">
                                            {format(new Date(note.createdAt), "MMM d, yyyy · h:mm a")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {project.analysis && (
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                <FileText size={11} className="text-purple-400" /> Project Analysis
                            </p>
                            <div className="flex gap-2">
                                <PortalViewButton
                                    type="project"
                                    data={project}
                                    businessDetails={user}
                                    clientName={client.name}
                                />
                                <PortalDownloadButton
                                    type="project"
                                    data={project}
                                    businessDetails={user}
                                    clientName={client.name}
                                />
                            </div>
                        </div>
                    )}

                    {totalTasks === 0 && !project.milestones?.length && !project.notes?.length && !project.analysis && (
                        <p className="text-slate-600 text-sm text-center py-4">No details added yet.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default function PortalContainer({ token, initialData }: PortalContainerProps) {
    const [isVerified, setIsVerified] = useState(!initialData.isProtected);
    const [password, setPassword] = useState("");
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(initialData.isProtected ? false : true);
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState<Tab>("overview");

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
        } catch {
            setError("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!initialData.isProtected) fetchFullData();
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
                <p className="font-medium">Loading your portal...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
                <ShieldAlert className="w-16 h-16 text-red-500 mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-2">Access Error</h2>
                <p className="text-slate-400 mb-6">{error || "Unable to display portal."}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors">
                    Retry Access
                </button>
            </div>
        );
    }

    const { client, user, invoices, contracts, projects } = data;

    const pendingInvoices = invoices.filter((i: any) => i.status !== "Paid");
    const totalOwed = pendingInvoices.reduce((sum: number, i: any) => sum + i.total, 0);
    const activeProjects = projects.filter((p: any) => p.status === "Active");

    const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
        { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
        { id: "projects", label: "Projects", icon: <Briefcase size={16} />, count: projects.length },
        { id: "invoices", label: "Invoices", icon: <CreditCard size={16} />, count: invoices.length },
        { id: "contracts", label: "Contracts", icon: <FileText size={16} />, count: contracts.length },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/5">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Client Portal</div>
                    <h1 className="text-3xl md:text-4xl font-black text-white">Welcome, {client.name} 👋</h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Your project hub with <span className="text-white font-semibold">{user.businessName || user.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-400">Portal Active</span>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Active Projects", value: activeProjects.length, icon: <Briefcase size={18} />, color: "text-emerald-400", bg: "bg-emerald-500/10" },
                    { label: "Pending Invoices", value: pendingInvoices.length, icon: <CreditCard size={18} />, color: "text-indigo-400", bg: "bg-indigo-500/10" },
                    {
                        label: "Amount Due",
                        value: totalOwed > 0 ? `${totalOwed.toLocaleString()} ${invoices[0]?.currency || ""}` : "All Paid",
                        icon: <Package size={18} />,
                        color: totalOwed > 0 ? "text-amber-400" : "text-emerald-400",
                        bg: totalOwed > 0 ? "bg-amber-500/10" : "bg-emerald-500/10"
                    },
                    { label: "Contracts", value: contracts.length, icon: <FileText size={18} />, color: "text-purple-400", bg: "bg-purple-500/10" },
                ].map((stat, i) => (
                    <div key={i} className="bg-slate-900 border border-white/8 rounded-2xl p-5">
                        <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color} mb-3`}>
                            {stat.icon}
                        </div>
                        <div className="text-xl font-black text-white">{stat.value}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 bg-slate-900 border border-white/8 rounded-2xl w-full overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${activeTab === tab.id
                            ? "bg-white/10 text-white shadow"
                            : "text-slate-500 hover:text-slate-300"
                            }`}
                    >
                        {tab.icon}
                        <span>{tab.label}</span>
                        {tab.count !== undefined && tab.count > 0 && (
                            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-white/5 text-slate-500"}`}>
                                {tab.count}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Tab Content */}

            {/* Overview Tab */}
            {activeTab === "overview" && (
                <div className="space-y-8">
                    {/* Active project snapshot */}
                    {activeProjects.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-4">Active Projects</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {activeProjects.slice(0, 2).map((project: any) => (
                                    <ProjectCard key={project._id} project={project} client={client} user={user} />
                                ))}
                            </div>
                            {activeProjects.length > 2 && (
                                <button onClick={() => setActiveTab("projects")} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                    View all {activeProjects.length} projects →
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pending invoices snapshot */}
                    {pendingInvoices.length > 0 && (
                        <div>
                            <h2 className="text-lg font-bold text-white mb-4">Pending Payments</h2>
                            <div className="space-y-3">
                                {pendingInvoices.slice(0, 3).map((invoice: any) => (
                                    <div key={invoice._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900 border border-white/8 rounded-2xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                                                <Package size={16} />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-white">Invoice #{invoice.invoiceNumber}</p>
                                                <p className="text-xs text-slate-500">Due: {format(new Date(invoice.dueDate), "PPP")}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-lg font-black text-indigo-400">
                                                {invoice.total.toLocaleString()} {invoice.currency}
                                            </span>
                                            <RazorpayPaymentButton invoice={invoice} businessDetails={user} portalToken={token} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            {pendingInvoices.length > 3 && (
                                <button onClick={() => setActiveTab("invoices")} className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">
                                    View all {pendingInvoices.length} invoices →
                                </button>
                            )}
                        </div>
                    )}

                    {projects.length === 0 && invoices.length === 0 && contracts.length === 0 && (
                        <div className="text-center py-20 text-slate-600">
                            <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
                            <p className="font-medium">Nothing here yet.</p>
                            <p className="text-sm mt-1">Your service provider will share documents here soon.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Projects Tab */}
            {activeTab === "projects" && (
                <div className="space-y-4">
                    {projects.length > 0 ? (
                        projects.map((project: any) => (
                            <ProjectCard key={project._id} project={project} client={client} user={user} />
                        ))
                    ) : (
                        <div className="text-center py-20 text-slate-600">
                            <Briefcase size={40} className="mx-auto mb-4 opacity-30" />
                            <p className="font-medium">No projects yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Invoices Tab */}
            {activeTab === "invoices" && (
                <div className="space-y-4">
                    {invoices.length > 0 ? invoices.map((invoice: any) => (
                        <div key={invoice._id} className="bg-slate-900 border border-white/8 rounded-2xl p-5">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-400 flex-shrink-0">
                                        <Package size={20} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-white">Invoice #{invoice.invoiceNumber}</span>
                                            <StatusBadge status={invoice.status} />
                                        </div>
                                        <div className="text-sm text-slate-500 space-x-4">
                                            <span>Issued: {format(new Date(invoice.issuedAt), "PPP")}</span>
                                            <span>Due: {format(new Date(invoice.dueDate), "PPP")}</span>
                                        </div>
                                        {invoice.items && invoice.items.length > 0 && (
                                            <div className="mt-3 space-y-1">
                                                {invoice.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-center justify-between text-xs text-slate-500 bg-white/3 px-3 py-1.5 rounded-lg">
                                                        <span className="truncate max-w-[200px]">{item.description}</span>
                                                        <span className="font-mono ml-4 flex-shrink-0">{item.quantity} × {item.rate} = {item.amount}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <div className="text-2xl font-black text-indigo-400">
                                        {invoice.total.toLocaleString()} {invoice.currency}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PortalDownloadButton
                                            type="invoice"
                                            data={invoice}
                                            businessDetails={user}
                                            clientName={client.name}
                                            clientAddress={client.address}
                                            clientEmail={client.email}
                                        />
                                        {invoice.status !== "Paid" && (
                                            <RazorpayPaymentButton invoice={invoice} businessDetails={user} portalToken={token} />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-20 text-slate-600">
                            <CreditCard size={40} className="mx-auto mb-4 opacity-30" />
                            <p className="font-medium">No invoices yet.</p>
                        </div>
                    )}
                </div>
            )}

            {/* Contracts Tab */}
            {activeTab === "contracts" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contracts.length > 0 ? contracts.map((contract: any) => (
                        <div key={contract._id} className="bg-slate-900 border border-white/8 rounded-2xl p-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className="w-11 h-11 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400 flex-shrink-0">
                                    <FileText size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-white text-lg leading-tight mb-1">{contract.title}</h3>
                                    <StatusBadge status={contract.status} />
                                </div>
                            </div>
                            <div className="text-xs text-slate-600 space-y-1 mb-5">
                                {contract.startDate && <div>Start: {format(new Date(contract.startDate), "PPP")}</div>}
                                {contract.amount && <div className="text-base font-bold text-purple-400">{contract.amount.toLocaleString()} {contract.currency}</div>}
                            </div>
                            <div className="flex gap-2">
                                <PortalViewButton
                                    type="contract"
                                    data={contract}
                                    businessDetails={user}
                                    clientName={client.name}
                                    clientAddress={client.address}
                                    clientEmail={client.email}
                                />
                                <PortalDownloadButton
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
                        <div className="col-span-full text-center py-20 text-slate-600">
                            <FileText size={40} className="mx-auto mb-4 opacity-30" />
                            <p className="font-medium">No contracts yet.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
