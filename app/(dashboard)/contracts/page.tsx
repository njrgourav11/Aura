"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, FileSignature, Download, MoreVertical, Loader2, X, Mail, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { generateContractPDF } from "@/lib/pdf";
import ContractModal from "@/components/modals/ContractModal";

export default function ContractsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [contracts, setContracts] = useState<any[]>([]);
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContract, setSelectedContract] = useState<any>(null);
    const [sendingEmail, setSendingEmail] = useState<string | null>(null);
    const [emailFeedback, setEmailFeedback] = useState<{ id: string; message: string; ok: boolean } | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [contractsRes, settingsRes] = await Promise.all([
                fetch("/api/contracts"),
                fetch("/api/settings")
            ]);

            if (contractsRes.ok) {
                const data = await contractsRes.json();
                setContracts(data);
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

    const filteredContracts = contracts.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === "all" || c.status.toLowerCase() === statusFilter.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const handleEditContract = (contract: any) => {
        setSelectedContract(contract);
        setIsModalOpen(true);
    };

    const handleDeleteContract = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contract?")) return;
        try {
            const res = await fetch(`/api/contracts/${id}`, { method: "DELETE" });
            if (res.ok) fetchData();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedContract(null);
    };

    const handleDownloadContract = (contract: any) => {
        generateContractPDF({
            title: contract.title,
            clientName: contract.clientId?.name || "Client",
            clientEmail: contract.clientId?.email || "N/A",
            clientAddress: contract.clientId?.address,
            amount: contract.amount,
            currency: contract.currency,
            startDate: new Date(contract.startDate),
            endDate: contract.endDate ? new Date(contract.endDate) : undefined,
            scope: contract.scope,
            clauses: contract.clauses?.length > 0 ? contract.clauses : [
                "The Provider shall perform the services described in the scope of work with reasonable care and skill.",
                "Intellectual property rights created under this agreement shall transfer to the Client upon receipt of final payment.",
                "Either party may terminate this agreement with 14 days written notice.",
                "Liability for either party is limited to the total value of this contract."
            ],
            businessDetails: {
                name: settings?.name || settings?.businessName,
                businessName: settings?.businessName,
                address: settings?.businessAddress,
                email: settings?.businessEmail,
                phone: settings?.businessPhone,
                taxId: settings?.taxId
            }
        });
    };

    const handleSendEmail = async (contract: any) => {
        setSendingEmail(contract._id);
        setEmailFeedback(null);
        try {
            const res = await fetch('/api/contracts/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contractId: contract._id })
            });
            const data = await res.json();
            setEmailFeedback({ id: contract._id, message: res.ok ? data.message : data.error, ok: res.ok });
            setTimeout(() => setEmailFeedback(null), 4000);
        } catch (err) {
            setEmailFeedback({ id: contract._id, message: 'Failed to send email', ok: false });
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
                        <div className="p-2 bg-fuchsia-500/10 rounded-lg">
                            <FileSignature className="w-6 h-6 text-fuchsia-400" />
                        </div>
                        Contracts
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Manage your legal agreements and project scopes
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
                            New Contract
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
                            placeholder="Search by title or client..."
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-slate-800/50 border border-slate-700/50 text-slate-300 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 font-sans"
                        >
                            <option value="all">All Statuses</option>
                            <option value="draft">Draft</option>
                            <option value="sent">Sent</option>
                            <option value="signed">Signed</option>
                            <option value="expired">Expired</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto w-full flex-1">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-fuchsia-500" />
                            <p>Loading agreements...</p>
                        </div>
                    ) : (
                        <table className="w-full text-sm text-left text-slate-400">
                            <thead className="text-xs text-slate-400 uppercase bg-slate-900/40 border-b border-white/5">
                                <tr>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-slate-100">Contract Title</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-slate-100">Client</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-slate-100">Amount</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-slate-100">Date</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-slate-100">Status</th>
                                    <th scope="col" className="px-6 py-4 font-semibold tracking-wider text-right text-slate-100">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {filteredContracts.map((contract) => (
                                    <tr key={contract._id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-4 font-medium text-slate-100 whitespace-nowrap">
                                            {contract.title}
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {contract.clientId?.name || "Deleted Client"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                                            {contract.amount.toLocaleString(undefined, { style: 'currency', currency: contract.currency })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                                            {format(new Date(contract.startDate), "MMM dd, yyyy")}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={contract.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                <button
                                                    className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 rounded-lg transition-colors"
                                                    title="Download PDF"
                                                    onClick={() => handleDownloadContract(contract)}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleSendEmail(contract)}
                                                    disabled={sendingEmail === contract._id}
                                                    className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-lg transition-colors disabled:opacity-50"
                                                    title={emailFeedback && emailFeedback.id === contract._id ? emailFeedback.message : "Send via Email"}
                                                >
                                                    {sendingEmail === contract._id ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : emailFeedback && emailFeedback.id === contract._id && emailFeedback.ok ? (
                                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    ) : (
                                                        <Mail className="w-4 h-4" />
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => handleEditContract(contract)}
                                                    className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <MoreVertical className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteContract(contract._id)}
                                                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {filteredContracts.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-sans">
                                            {searchQuery || statusFilter !== "all"
                                                ? `No contracts found matching your filters`
                                                : "You haven't created any contracts yet."}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </motion.div>

            <ContractModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchData}
                contract={selectedContract}
            />
        </div>
    );
}

