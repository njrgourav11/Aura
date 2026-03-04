"use client"
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InvoiceModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    invoice?: any;
}

export default function InvoiceModal({ isOpen, onClose, onSuccess, invoice }: InvoiceModalProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [contracts, setContracts] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        invoiceNumber: "",
        clientId: "",
        contractId: "",
        items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
        currency: "USD",
        status: "Draft",
        issuedAt: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    useEffect(() => {
        if (isOpen) {
            fetch("/api/clients")
                .then(res => res.json())
                .then(data => setClients(data))
                .catch(err => console.error("Failed to fetch clients:", err));
        }

        if (invoice) {
            setFormData({
                invoiceNumber: invoice.invoiceNumber || "",
                clientId: invoice.clientId?._id || invoice.clientId || "",
                contractId: invoice.contractId?._id || invoice.contractId || "",
                items: invoice.items || [{ description: "", quantity: 1, rate: 0, amount: 0 }],
                currency: invoice.currency || "USD",
                status: invoice.status || "Draft",
                issuedAt: new Date(invoice.issuedAt).toISOString().split('T')[0],
                dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
            });
        } else {
            setFormData({
                invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
                clientId: "",
                contractId: "",
                items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
                currency: "USD",
                status: "Draft",
                issuedAt: new Date().toISOString().split('T')[0],
                dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            });
        }
    }, [isOpen, invoice]);

    useEffect(() => {
        if (formData.clientId) {
            fetch("/api/contracts")
                .then(res => res.json())
                .then(data => {
                    const clientContracts = data.filter((c: any) => (c.clientId?._id || c.clientId) === formData.clientId);
                    setContracts(clientContracts);
                })
                .catch(err => console.error("Failed to fetch contracts:", err));
        } else {
            setContracts([]);
        }
    }, [formData.clientId]);

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: "", quantity: 1, rate: 0, amount: 0 }]
        });
    };

    const removeItem = (index: number) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const updateItem = (index: number, field: string, value: any) => {
        const newItems = [...formData.items];
        (newItems[index] as any)[field] = value;
        if (field === "quantity" || field === "rate") {
            newItems[index].amount = newItems[index].quantity * newItems[index].rate;
        }
        setFormData({ ...formData, items: newItems });
    };

    const total = formData.items.reduce((sum, item) => sum + item.amount, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = invoice ? `/api/invoices/${invoice._id}` : "/api/invoices";
        const method = invoice ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    subtotal: total,
                    taxRate: invoice?.taxRate || 0,
                    taxAmount: invoice?.taxAmount || 0,
                    discount: invoice?.discount || 0,
                    total
                }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
                if (!invoice) {
                    setFormData({
                        invoiceNumber: `INV-${Math.floor(Math.random() * 9000) + 1000}`,
                        clientId: "",
                        contractId: "",
                        items: [{ description: "", quantity: 1, rate: 0, amount: 0 }],
                        currency: "USD",
                        status: "Draft",
                        issuedAt: new Date().toISOString().split('T')[0],
                        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    });
                }
            } else {
                const errorData = await res.json();
                console.error("Invoice save failed:", errorData);
                alert(`Error: ${errorData.error || "Failed to save invoice"}`);
            }
        } catch (error) {
            console.error("Failed to save invoice:", error);
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
                            <h2 className="text-xl font-bold text-white">{invoice ? "Edit Invoice" : "Create Invoice"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Invoice #</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.invoiceNumber}
                                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                                        className="input-field"
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
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                        className="input-field bg-slate-900 font-medium"
                                    >
                                        <option value="Draft">Draft</option>
                                        <option value="Sent">Sent</option>
                                        <option value="Paid">Paid</option>
                                        <option value="Overdue">Overdue</option>
                                    </select>
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
                                        <option value="">Select client</option>
                                        {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Related Contract</label>
                                    <select
                                        value={formData.contractId}
                                        onChange={(e) => setFormData({ ...formData, contractId: e.target.value })}
                                        className="input-field bg-slate-900"
                                    >
                                        <option value="">None / General</option>
                                        {contracts.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Issued At</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.issuedAt}
                                        onChange={(e) => setFormData({ ...formData, issuedAt: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Due Date</label>
                                    <input
                                        required
                                        type="date"
                                        value={formData.dueDate}
                                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-medium text-slate-400">
                                    <span>Items</span>
                                    <button
                                        type="button"
                                        onClick={addItem}
                                        className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                                    >
                                        <Plus className="w-4 h-4" /> Add Item
                                    </button>
                                </div>

                                {formData.items.map((item, index) => (
                                    <div key={index} className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-6">
                                            <input
                                                required
                                                type="text"
                                                value={item.description}
                                                onChange={(e) => updateItem(index, "description", e.target.value)}
                                                className="input-field text-sm"
                                                placeholder="Description..."
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <input
                                                required
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
                                                className="input-field text-sm"
                                                placeholder="Qty"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <input
                                                required
                                                type="number"
                                                value={item.rate}
                                                onChange={(e) => updateItem(index, "rate", Number(e.target.value))}
                                                className="input-field text-sm"
                                                placeholder="Rate"
                                            />
                                        </div>
                                        <div className="col-span-1">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="p-2.5 text-slate-500 hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5 flex justify-between items-end">
                                <div className="space-y-1">
                                    <div className="text-xs text-slate-500 uppercase font-bold tracking-widest">Total Amount</div>
                                    <div className="text-3xl font-bold text-white">
                                        {total.toLocaleString()} <span className="text-lg text-slate-400 font-normal">{formData.currency}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                                    <button type="submit" disabled={loading} className="btn-primary min-w-[140px]">
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (invoice ? "Save Changes" : "Create Invoice")}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
