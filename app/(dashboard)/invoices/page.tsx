"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Receipt, Download, ExternalLink, Loader2, MoreVertical, X, Mail, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { generateInvoicePDF } from "@/lib/pdf";
import InvoiceModal from "@/components/modals/InvoiceModal";

export default function InvoicesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [invoices, setInvoices] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);
    const [emailFeedback, setEmailFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [invoicesRes, settingsRes] = await Promise.all([
                fetch("/api/invoices"),
                fetch("/api/settings")
            ]);

            if (invoicesRes.ok) {
                const data = await invoicesRes.json();
                setInvoices(data);
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

    const filteredInvoices = invoices.filter(invoice => {
        const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            invoice.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || invoice.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleDownloadInvoice = (invoice: any) => {
        generateInvoicePDF({
            invoiceNumber: invoice.invoiceNumber,
            clientName: invoice.clientId?.name || "Client",
            clientAddress: invoice.clientId?.address || "",
            items: invoice.items,
            total: invoice.total,
            currency: invoice.currency,
            issuedAt: new Date(invoice.issuedAt),
            dueDate: new Date(invoice.dueDate),
            businessDetails: {
                name: settings?.businessName,
                address: settings?.businessAddress,
                email: settings?.businessEmail,
                phone: settings?.businessPhone,
                taxId: settings?.taxId
            }
        });
    };

    const handleEditInvoice = (invoice: any) => {
        setSelectedInvoice(invoice);
        setIsModalOpen(true);
    };

    const handleDeleteInvoice = async (id: string) => {
        if (!confirm("Are you sure you want to delete this invoice?")) return;
        try {
            const res = await fetch(`/api/invoices/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInvoice(null);
    };

    const handleSendEmail = async (invoice: any) => {
        setSendingEmail(invoice._id);
        setEmailFeedback(null);
        try {
            const res = await fetch('/api/invoices/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ invoiceId: invoice._id })
            });
            const data = await res.json();
            setEmailFeedback({ id: invoice._id, message: res.ok ? data.message : data.error, ok: res.ok });
            setTimeout(() => setEmailFeedback(null), 4000);
        } catch (err) {
            setEmailFeedback({ id: invoice._id, message: 'Failed to send email', ok: false });
        } finally {
            setSendingEmail(null);
        }
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
                        <Receipt className="w-8 h-8 text-indigo-400" />
                        Invoices
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Create and track professional invoices for your clients
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
                            Create Invoice
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Main Content Area */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card flex flex-col overflow-hidden min-h-[400px]"
            >
                {/* Toolbar */}
                <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-900/30">
                    <div className="relative w-full sm:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all sm:text-sm font-sans"
                            placeholder="Search by invoice # or client..."
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 font-sans"
                        >
                            <option value="all">All Invoices</option>
                            <option value="pending">Pending</option>
                            <option value="paid">Paid</option>
                            <option value="overdue">Overdue</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                            <p>Loading invoices...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 border-b border-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Invoice #</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Client</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Amount</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Due Date</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredInvoices.map((invoice) => (
                                    <tr key={invoice._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-mono font-medium text-slate-200">
                                            {invoice.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4">
                                            {invoice.clientId?.name || "N/A"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-white font-semibold">
                                            {invoice.total.toLocaleString(undefined, { style: 'currency', currency: invoice.currency })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {format(new Date(invoice.dueDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={invoice.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={() => handleDownloadInvoice(invoice)}
                                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSendEmail(invoice)}
                                                    disabled={sendingEmail === invoice._id}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors disabled:opacity-50"
                                                    title={emailFeedback?.id === invoice._id ? emailFeedback.message : "Send via Email"}
                                                >
                                                    {sendingEmail === invoice._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : emailFeedback?.id === invoice._id && emailFeedback.ok ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEditInvoice(invoice)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteInvoice(invoice._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredInvoices.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            {searchQuery || statusFilter !== "all"
                                                ? `No invoices found matching your filters`
                                                : "You haven't created any invoices yet."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>

            <InvoiceModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchData}
                invoice={selectedInvoice}
            />
        </div>
    );
}
