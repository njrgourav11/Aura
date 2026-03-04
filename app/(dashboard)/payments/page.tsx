"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, DollarSign, ArrowUpRight, ArrowDownRight, MoreVertical, Loader2, X } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import PaymentModal from "@/components/modals/PaymentModal";

export default function PaymentsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [payments, setPayments] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<any>(null);

    const fetchData = async () => {
        setLoading(true);
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

    useEffect(() => {
        fetchData();
    }, []);

    const filteredPayments = payments.filter(p =>
        p.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.invoiceId?.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
    const currency = settings?.defaultCurrency || "USD";

    const handleEditPayment = (payment: any) => {
        setSelectedPayment(payment);
        setIsModalOpen(true);
    };

    const handleDeletePayment = async (id: string) => {
        if (!confirm("Are you sure you want to delete this payment record?")) return;
        try {
            const res = await fetch(`/api/payments/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedPayment(null);
    };

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
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <DollarSign className="w-6 h-6 text-emerald-400" />
                        </div>
                        Payments
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Track your income and transaction history
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary w-full md:w-auto"
                    >
                        <span>
                            <Plus className="w-4 h-4" />
                            Log Payment
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                        </div>
                    </div>
                    <p className="text-sm text-slate-400 font-medium">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-white mt-1">
                        {totalRevenue.toLocaleString(undefined, { style: 'currency', currency })}
                    </h3>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="glass-card flex flex-col overflow-hidden min-h-[400px]"
            >
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
                    <div className="relative w-full sm:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all sm:text-sm font-sans"
                            placeholder="Search by client or invoice #..."
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                            <p>Loading transactions...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 border-b border-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Date</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Client</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Invoice</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Method</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Amount</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300">
                                            {format(new Date(payment.paidAt), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-200">
                                            {payment.clientId?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 font-mono text-xs">
                                            {payment.invoiceId?.invoiceNumber || "General"}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {payment.method}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right font-bold text-emerald-400">
                                            +{payment.amount.toLocaleString(undefined, { style: 'currency', currency: payment.currency })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleEditPayment(payment)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeletePayment(payment._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredPayments.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            {searchQuery
                                                ? `No payments found matching your search`
                                                : "No payment history recorded yet."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>

            <PaymentModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchData}
                payment={selectedPayment}
            />
        </div>
    );
}
