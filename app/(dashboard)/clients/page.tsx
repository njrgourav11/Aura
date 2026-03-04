"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Search, Users, Mail, Phone, MoreVertical, Loader2, X } from "lucide-react";
import ClientModal from "@/components/modals/ClientModal";

export default function ClientsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<any>(null);

    const fetchClients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/clients");
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error("Failed to fetch clients:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEditClient = (client: any) => {
        setSelectedClient(client);
        setIsModalOpen(true);
    };

    const handleDeleteClient = async (id: string) => {
        if (!confirm("Are you sure you want to delete this client? This will not delete their contracts or invoices but may cause reference issues.")) return;

        try {
            const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
            if (res.ok) fetchClients();
        } catch (error) {
            console.error("Delete error:", error);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedClient(null);
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
                        <Users className="w-8 h-8 text-blue-400" />
                        Clients
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Manage your client relationships and contact details
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
                            Add Client
                        </span>
                    </button>
                </motion.div>
            </div>

            {/* Toolbar */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-4"
            >
                <div className="relative w-full sm:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all shadow-sm font-sans"
                        placeholder="Search clients by name or email..."
                    />
                </div>
            </motion.div>

            {/* Client Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-500" />
                    <p>Loading your clients...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredClients.map((client, i) => (
                        <motion.div
                            key={client._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 flex flex-col group hover:border-blue-500/30 transition-colors relative h-full"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20">
                                        {client.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">{client.name}</h3>
                                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">ID: {client._id.slice(-6)}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClient(client)}
                                        className="p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <MoreVertical className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClient(client._id)}
                                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3 mb-6 flex-1 text-slate-300">
                                <div className="flex items-center gap-2.5 text-sm font-sans">
                                    <Mail className="w-4 h-4 flex-shrink-0 text-slate-500" />
                                    <a href={`mailto:${client.email}`} className="truncate hover:text-blue-400 transition-colors">{client.email}</a>
                                </div>
                                {client.phone && (
                                    <div className="flex items-center gap-2.5 text-sm font-sans">
                                        <Phone className="w-4 h-4 flex-shrink-0 text-slate-500" />
                                        <span>{client.phone}</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-tight">Currency</p>
                                    <p className="text-sm font-bold text-white tracking-widest">{client.currency}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-slate-500 font-medium mb-1 uppercase tracking-tight">Company</p>
                                    <p className="text-sm font-semibold text-slate-100 truncate">{client.company || "Personal"}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {filteredClients.length === 0 && (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 glass-card p-12 flex flex-col items-center justify-center text-center">
                            <Users className="w-12 h-12 text-slate-600 mb-4" />
                            <h3 className="text-lg font-medium text-white mb-2">No clients found</h3>
                            <p className="text-slate-400 text-sm max-w-xs mx-auto">
                                {searchQuery ? "No clients matched your search query. Try adjusting your filters." : "You haven't added any clients yet. Click 'Add Client' to get started."}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <ClientModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchClients}
                client={selectedClient}
            />
        </div>
    );
}

