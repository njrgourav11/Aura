"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PieChart, Download, DollarSign, Calculator, Loader2 } from "lucide-react";

export default function TaxPage() {
    const [payments, setPayments] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [paymentsRes, settingsRes] = await Promise.all([
                    fetch("/api/payments"),
                    fetch("/api/settings")
                ]);

                if (paymentsRes.ok) {
                    const data = await paymentsRes.json();
                    setPayments(data);
                }

                if (settingsRes.ok) {
                    const data = await settingsRes.json();
                    setSettings(data);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTaxRate = (country: string) => {
        switch (country) {
            case "India": return 0.18; // GST
            case "United Kingdom": return 0.20; // VAT
            case "United States": return 0.15; // Estimated
            case "Canada": return 0.13; // HST/GST
            default: return 0.20; // Default
        }
    };

    const currency = settings?.defaultCurrency || "USD";
    const country = settings?.country || "Default";
    const taxRate = getTaxRate(country);

    const grossIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    const estTax = grossIncome * taxRate;
    const netIncome = grossIncome - estTax;

    const getQuarterlyData = () => {
        const quarters = [
            { id: 1, name: "Q1 (Jan - Mar)", months: [0, 1, 2], income: 0 },
            { id: 2, name: "Q2 (Apr - Jun)", months: [3, 4, 5], income: 0 },
            { id: 3, name: "Q3 (Jul - Sep)", months: [6, 7, 8], income: 0 },
            { id: 4, name: "Q4 (Oct - Dec)", months: [9, 10, 11], income: 0 },
        ];

        payments.forEach(p => {
            const date = new Date(p.paidAt);
            const month = date.getMonth();
            const quarter = quarters.find(q => q.months.includes(month));
            if (quarter) quarter.income += p.amount;
        });

        return quarters;
    };

    const quarterlyData = getQuarterlyData();

    return (
        <div className="w-full max-w-full space-y-6 md:space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-2xl md:text-3xl font-bold text-white tracking-tight flex items-center gap-3"
                    >
                        <PieChart className="w-8 h-8 text-amber-400" />
                        Tax Reports
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Real-time tax estimates for <span className="text-white font-medium">{country}</span> ({taxRate * 100}%)
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button className="btn-secondary w-full md:w-auto">
                        <Download className="w-4 h-4" />
                        Export Annual Report
                    </button>
                </motion.div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-500" />
                    <p>Calculating your tax liability...</p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { title: "Gross Income (YTD)", value: grossIncome.toLocaleString(undefined, { style: 'currency', currency }), icon: DollarSign, color: "text-emerald-400", bg: "bg-emerald-400/10" },
                            { title: `Est. Tax Liability (${taxRate * 100}%)`, value: estTax.toLocaleString(undefined, { style: 'currency', currency }), icon: Calculator, color: "text-amber-400", bg: "bg-amber-400/10" },
                            { title: "Net Income", value: netIncome.toLocaleString(undefined, { style: 'currency', currency }), icon: PieChart, color: "text-indigo-400", bg: "bg-indigo-400/10" },
                        ].map((stat, i) => (
                            <motion.div
                                key={stat.title}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (0.1 * i) }}
                                className="glass-card p-6"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-sm font-medium text-slate-400">{stat.title}</h3>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                </div>
                                <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight">{stat.value}</div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Quarterly Breakdown */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="glass-card overflow-hidden"
                    >
                        <div className="p-6 border-b border-white/5 bg-slate-900/40 font-semibold text-white">
                            Quarterly Breakdown ({new Date().getFullYear()})
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-slate-400">
                                <thead className="text-xs uppercase bg-slate-900/20 text-slate-500 border-b border-white/5">
                                    <tr>
                                        <th className="px-6 py-4">Quarter</th>
                                        <th className="px-6 py-4">Gross Income</th>
                                        <th className="px-6 py-4 text-right">Est. Tax ({taxRate * 100}%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {quarterlyData.map((row) => (
                                        <tr key={row.name} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-200">{row.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {row.income.toLocaleString(undefined, { style: 'currency', currency })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right font-medium text-white">
                                                {(row.income * taxRate).toLocaleString(undefined, { style: 'currency', currency })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}
        </div>
    );
}

