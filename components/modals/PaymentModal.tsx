"use client"
import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    payment?: any;
}

export default function PaymentModal({ isOpen, onClose, onSuccess, payment }: PaymentModalProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        clientId: "",
        invoiceId: "",
        amount: "",
        currency: "USD",
        method: "Bank Transfer",
        paidAt: new Date().toISOString().split('T')[0],
        status: "Received"
    });

    useEffect(() => {
        if (isOpen) {
            fetch("/api/clients")
                .then(res => res.json())
                .then(data => setClients(data))
                .catch(err => console.error("Failed to fetch clients:", err));
        }

        if (payment) {
            setFormData({
                clientId: payment.clientId?._id || payment.clientId || "",
                invoiceId: payment.invoiceId?._id || payment.invoiceId || "",
                amount: payment.amount.toString(),
                currency: payment.currency || "USD",
                method: payment.method || "Bank Transfer",
                paidAt: new Date(payment.paidAt).toISOString().split('T')[0],
                status: payment.status || "Received"
            });
        } else {
            setFormData({
                clientId: "",
                invoiceId: "",
                amount: "",
                currency: "USD",
                method: "Bank Transfer",
                paidAt: new Date().toISOString().split('T')[0],
                status: "Received"
            });
        }
    }, [isOpen, payment]);

    useEffect(() => {
        if (formData.clientId) {
            fetch("/api/invoices")
                .then(res => res.json())
                .then(data => {
                    // Filter invoices for the specific client, excluding "Paid" ones, BUT include current invoiceId if we're editing
                    const clientInvoices = data.filter((i: any) =>
                        (i.clientId?._id || i.clientId) === formData.clientId &&
                        (i.status !== "Paid" || i._id === payment?.invoiceId?._id || i._id === payment?.invoiceId)
                    );
                    setInvoices(clientInvoices);
                })
                .catch(err => console.error("Failed to fetch invoices:", err));
        } else {
            setInvoices([]);
        }
    }, [formData.clientId, payment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = payment ? `/api/payments/${payment._id}` : "/api/payments";
        const method = payment ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    amount: Number(formData.amount),
                    status: formData.status === "Received" ? "Received" : "Pending"
                }),
            });

            if (res.ok) {
                // If linked to an invoice and status is Received, update invoice status to Paid
                if (formData.invoiceId && formData.status === "Received") {
                    await fetch(`/api/invoices/${formData.invoiceId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "Paid" })
                    });
                }

                onSuccess();
                onClose();
                if (!payment) {
                    setFormData({
                        clientId: "",
                        invoiceId: "",
                        amount: "",
                        currency: "USD",
                        method: "Bank Transfer",
                        paidAt: new Date().toISOString().split('T')[0],
                        status: "Received"
                    });
                }
            } else {
                const errorData = await res.json();
                console.error("Payment save failed:", errorData);
                alert(`Error: ${errorData.error || "Failed to save payment"}`);
            }
        } catch (error) {
            console.error("Failed to save payment:", error);
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
                        className="relative w-full max-w-lg glass-card p-8 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{payment ? "Edit Payment" : "Log Payment"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Invoice (Optional)</label>
                                <select
                                    value={formData.invoiceId}
                                    onChange={(e) => {
                                        const inv = invoices.find(i => i._id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            invoiceId: e.target.value,
                                            amount: inv ? inv.total.toString() : formData.amount
                                        });
                                    }}
                                    className="input-field bg-slate-900"
                                >
                                    <option value="">General Payment</option>
                                    {invoices.map(i => <option key={i._id} value={i._id}>{i.invoiceNumber} - {i.total} {i.currency}</option>)}
                                </select>
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

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Payment Method</label>
                                <select
                                    value={formData.method}
                                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                    className="input-field bg-slate-900"
                                >
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card">Card / Stripe</option>
                                    <option value="PayPal">PayPal</option>
                                    <option value="UPI">UPI / GPay</option>
                                    <option value="Crypto">Crypto</option>
                                    <option value="Other">Other / Cash</option>
                                </select>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (payment ? "Save Changes" : "Log Payment")}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
