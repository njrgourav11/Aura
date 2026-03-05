"use client"
import { useState, useEffect } from "react";
import { X, Loader2, Shield, Globe, Lock, Key, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PortalSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    client: any;
    onUpdate: () => void;
}

export default function PortalSettingsModal({ isOpen, onClose, client, onUpdate }: PortalSettingsModalProps) {
    const [mounted, setMounted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(false);
    const [password, setPassword] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Only initialize state when the modal OPENS
    useEffect(() => {
        if (isOpen && client) {
            setActive(client.portalActive);
            setPassword("");
        }
    }, [isOpen]);

    const handleToggle = async () => {
        if (loading) return;

        const nextState = !active;
        setActive(nextState);
        setLoading(true);

        try {
            const res = await fetch(`/api/clients/${client._id}/portal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: nextState }),
            });

            if (res.ok) {
                const updatedClient = await res.json();
                setActive(updatedClient.portalActive);
                onUpdate();
            } else {
                setActive(!nextState);
                const errorData = await res.json();
                alert(`Error: ${errorData.error || "Failed to update portal status"}`);
            }
        } catch (err) {
            setActive(!nextState);
            console.error("Failed to toggle portal:", err);
            alert("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSavePassword = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/clients/${client._id}/portal`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active, password }),
            });
            if (res.ok) {
                setPassword("");
                alert("Portal password updated successfully!");
                onUpdate();
            }
        } catch (err) {
            console.error("Failed to save password:", err);
        } finally {
            setLoading(false);
        }
    };

    const portalUrl = (mounted && client?.portalToken)
        ? `${window.location.origin}/portal/${client.portalToken}`
        : "";

    const copyToClipboard = () => {
        if (!mounted) return;
        navigator.clipboard.writeText(portalUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="relative w-full max-w-md glass-card p-8 overflow-hidden"
                    >
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-400">
                                    <Shield size={20} />
                                </div>
                                <h2 className="text-xl font-bold text-white">Portal Settings</h2>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-8">
                            {/* Status Toggle */}
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <Globe className={active ? "text-emerald-400" : "text-slate-500"} size={20} />
                                    <div>
                                        <div className="font-bold text-white">Client Portal</div>
                                        <div className="text-xs text-slate-500">{active ? "Active & Visible" : "Disabled"}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleToggle}
                                    disabled={loading}
                                    className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${active ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                >
                                    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
                                </button>
                            </div>

                            {active && (
                                <>
                                    {/* Link Display */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Portal Link</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-slate-900 border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-400 truncate">
                                                {portalUrl}
                                            </div>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white transition-colors"
                                            >
                                                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Password Section */}
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center gap-2 text-white/60 mb-1 px-1">
                                            <Lock size={14} />
                                            <span className="text-sm font-medium">Access Protection</span>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="relative group">
                                                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={16} />
                                                <input
                                                    type="password"
                                                    value={password}
                                                    onChange={(e) => setPassword(e.target.value)}
                                                    className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 transition-all"
                                                    placeholder="Enter a passcode..."
                                                />
                                            </div>
                                            <button
                                                onClick={handleSavePassword}
                                                disabled={loading || !password}
                                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Update Passcode"}
                                            </button>
                                            <p className="text-[10px] text-slate-500 text-center px-4">
                                                Leave blank and save to remove password protection.
                                            </p>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
