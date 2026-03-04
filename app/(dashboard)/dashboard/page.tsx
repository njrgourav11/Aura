"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DollarSign, FileSignature, Receipt, TrendingUp, Loader2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Dashboard() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const firstName = session?.user?.name?.split(" ")[0] || "User";

    useEffect(() => {
        fetch("/api/dashboard/stats")
            .then(res => res.json())
            .then(data => setData(data))
            .catch(err => console.error("Error fetching dashboard stats:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading || !data) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-fuchsia-500 mb-4" />
                <p className="text-slate-400 animate-pulse font-medium text-lg">Analyzing your success...</p>
            </div>
        );
    }

    const { stats, chartData, recentActivity } = data;
    const currency = stats.currency || 'USD';

    const kpiCards = [
        { title: "Total Revenue", value: stats.totalRevenue.toLocaleString(undefined, { style: 'currency', currency }), trend: "Gross completed payments", icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
        { title: "Unpaid Invoices", value: stats.unpaidCount.toString(), trend: `${stats.unpaidAmount.toLocaleString(undefined, { style: 'currency', currency })} pending`, icon: Receipt, color: "text-amber-400", bg: "bg-amber-400/10" },
        { title: "Active Contracts", value: stats.activeContracts.toString(), trend: "Signed agreements", icon: FileSignature, color: "text-indigo-400", bg: "bg-indigo-400/10" },
        { title: "Tax Estimate", value: stats.taxEstimate.toLocaleString(undefined, { style: 'currency', currency }), trend: `${stats.taxRateText} estimate`, icon: TrendingUp, color: "text-fuchsia-400", bg: "bg-fuchsia-400/10" },
    ];

    const maxRevenue = Math.max(...chartData.map((d: any) => d.revenue), 1);

    return (
        <div className="w-full max-w-full space-y-6 md:space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white tracking-tight"
                    >
                        Welcome back, {firstName} <span className="text-fuchsia-400">👋</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Here&apos;s what&apos;s happening with your freelance business today.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3"
                >
                    <Link href="/invoices" className="btn-secondary w-full md:w-auto text-center px-4">Invoices</Link>
                    <Link href="/contracts" className="btn-primary w-full md:w-auto text-center px-4"><span>New Contract</span></Link>
                </motion.div>
            </div>

            {/* KPI Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {kpiCards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index + 0.3 }}
                        className="glass-card p-5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -z-10 transition-transform group-hover:scale-110" />
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <p className="text-xs text-slate-500 font-medium">{stat.trend}</p>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Charts & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="lg:col-span-2 glass-card p-6 min-h-[400px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-white">Revenue Overview</h3>
                            <p className="text-xs text-slate-500">Monthly gross income for the last 6 months</p>
                        </div>
                    </div>

                    <div className="flex-1 flex items-end justify-between gap-4 pt-4 px-2">
                        {chartData.map((d: any, i: number) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 px-1 py-0.5 rounded">
                                    {d.revenue.toLocaleString(undefined, { style: 'currency', currency, maximumFractionDigits: 0 })}
                                </span>
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(d.revenue / maxRevenue) * 200}px` }}
                                    className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600/50 to-indigo-400 rounded-t-lg"
                                />
                                <span className="text-xs font-medium text-slate-400">{d.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass-card p-6 min-h-[400px] flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
                        <Link href="/payments" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">View All</Link>
                    </div>

                    <div className="flex-1 space-y-6">
                        {recentActivity.map((activity: any, i: number) => (
                            <div key={i} className="flex items-start gap-3">
                                <div className={`mt-1 p-1.5 rounded-lg ${activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-400' :
                                    activity.type === 'invoice' ? 'bg-amber-500/10 text-amber-400' :
                                        'bg-indigo-500/10 text-indigo-400'
                                    }`}>
                                    {activity.type === 'payment' ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                                        activity.type === 'invoice' && activity.status === 'pending' ? <Clock className="w-3.5 h-3.5" /> :
                                            <FileSignature className="w-3.5 h-3.5" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-200 truncate">{activity.title}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-[11px] text-slate-500">
                                            {new Date(activity.date).toLocaleDateString()}
                                        </span>
                                        <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                                            {activity.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-sm font-semibold text-slate-300">
                                    {activity.amount?.toLocaleString(undefined, {
                                        style: 'currency',
                                        currency: activity.currency || currency
                                    })}
                                </div>
                            </div>
                        ))}

                        {recentActivity.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
                                No recent activity to show
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

