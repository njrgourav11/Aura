"use client"
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ScopeCanvasEditor, { ScopeSection } from "../editor/ScopeCanvasEditor";

interface ContractModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    contract?: any;
}

export default function ContractModal({ isOpen, onClose, onSuccess, contract }: ContractModalProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [formData, setFormData] = useState<{
        clientId: string;
        title: string;
        amount: string;
        currency: string;
        scope: any;
        paymentTerms: string;
        startDate: string;
        endDate: string;
        status: string;
        clauses: string[];
    }>({
        clientId: "",
        title: "",
        amount: "",
        currency: "USD",
        scope: [],
        paymentTerms: "Net 30",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
        status: "Draft",
        clauses: [""]
    });

    const parseScope = (scope: any): ScopeSection[] => {
        if (!scope) return [];
        if (Array.isArray(scope)) return scope;
        try {
            const parsed = JSON.parse(scope);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            // If it's a plain string, convert it to a single section
            return [{
                id: 'legacy',
                title: 'Project Scope',
                items: scope.split('\n').filter((l: string) => l.trim() !== '')
            }];
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetch("/api/clients")
                .then(res => res.json())
                .then(data => setClients(data))
                .catch(err => console.error("Failed to fetch clients:", err));

            if (contract) {
                setFormData({
                    clientId: contract.clientId?._id || contract.clientId || "",
                    title: contract.title || "",
                    amount: contract.amount?.toString() || "",
                    currency: contract.currency || "USD",
                    scope: parseScope(contract.scope),
                    paymentTerms: contract.paymentTerms || "Net 30",
                    startDate: contract.startDate ? new Date(contract.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                    endDate: contract.endDate ? new Date(contract.endDate).toISOString().split('T')[0] : "",
                    status: contract.status || "Draft",
                    clauses: contract.clauses?.length > 0 ? contract.clauses : [""]
                });
            } else {
                setFormData({
                    clientId: "",
                    title: "",
                    amount: "",
                    currency: "USD",
                    scope: [],
                    paymentTerms: "Net 30",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: "",
                    status: "Draft",
                    clauses: [""]
                });
            }
        }
    }, [isOpen, contract]);

    const handleAddClause = () => {
        setFormData({ ...formData, clauses: [...formData.clauses, ""] });
    };

    const handleRemoveClause = (index: number) => {
        const newClauses = formData.clauses.filter((_, i) => i !== index);
        setFormData({ ...formData, clauses: newClauses.length > 0 ? newClauses : [""] });
    };

    const handleUpdateClause = (index: number, value: string) => {
        const newClauses = [...formData.clauses];
        newClauses[index] = value;
        setFormData({ ...formData, clauses: newClauses });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const url = contract ? `/api/contracts/${contract._id}` : "/api/contracts";
            const method = contract ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount),
                    scope: JSON.stringify(formData.scope),
                    clauses: formData.clauses.filter(c => c.trim() !== "")
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const errorData = await res.json();
                console.error("Contract operation failed:", errorData);
                alert(`Error: ${errorData.error || "Failed to process contract"}`);
            }
        } catch (error) {
            console.error("Failed to process contract:", error);
            alert("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-2xl glass-card p-8 overflow-hidden flex flex-col max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{contract ? "Edit Contract" : "New Contract"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Project Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        placeholder="e.g. Website Redesign"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Client</label>
                                    <select
                                        required
                                        value={formData.clientId}
                                        onChange={(e) => {
                                            const client = clients.find(c => c._id === e.target.value);
                                            setFormData({
                                                ...formData,
                                                clientId: e.target.value,
                                                currency: client?.currency || formData.currency
                                            });
                                        }}
                                        className="input-field bg-slate-900"
                                    >
                                        <option value="">Select a client</option>
                                        {clients.map(client => (
                                            <option key={client._id} value={client._id}>{client.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="input-field bg-slate-900"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Sent">Sent</option>
                                        <option value="Signed">Signed</option>
                                        <option value="Expired">Expired</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Amount</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        className="input-field"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Currency</label>
                                    <select
                                        value={formData.currency}
                                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                                        className="input-field bg-slate-900"
                                    >
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                        <option value="GBP">GBP (£)</option>
                                        <option value="INR">INR (₹)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Start Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">End Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Payment Terms</label>
                                <select
                                    value={formData.paymentTerms}
                                    onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
                                    className="input-field bg-slate-900"
                                >
                                    <option value="Net 0">Due on receipt</option>
                                    <option value="Net 15">Net 15</option>
                                    <option value="Net 30">Net 30</option>
                                    <option value="Net 60">Net 60</option>
                                    <option value="50/50">50% Upfront / 50% Completion</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-3">Scope of Work</label>
                                <ScopeCanvasEditor 
                                    value={formData.scope} 
                                    onChange={(newScope) => setFormData({ ...formData, scope: newScope })} 
                                />
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-slate-400">Custom Clauses</label>
                                    <button
                                        type="button"
                                        onClick={handleAddClause}
                                        className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Add Clause
                                    </button>
                                </div>
                                {formData.clauses.map((clause, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={clause}
                                            onChange={(e) => handleUpdateClause(index, e.target.value)}
                                            className="input-field text-sm"
                                            placeholder={`Clause ${index + 1}...`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveClause(index)}
                                            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 flex gap-3 border-t border-white/5">
                                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (contract ? "Update Contract" : "Create Contract")}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
