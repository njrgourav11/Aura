"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, User, Building2, CreditCard, Bell, Shield, Palette, Loader2, Save } from "lucide-react";

export default function SettingsPage() {
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'profile' | 'business' | 'integrations'>('profile');
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        businessName: "",
        businessAddress: "",
        businessEmail: "",
        businessPhone: "",
        taxId: "",
        country: "",
        defaultCurrency: "USD",
    });

    useEffect(() => {
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => {
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    businessName: data.businessName || "",
                    businessAddress: data.businessAddress || "",
                    businessEmail: data.businessEmail || "",
                    businessPhone: data.businessPhone || "",
                    taxId: data.taxId || "",
                    country: data.country || "",
                    defaultCurrency: data.defaultCurrency || "USD",
                });
            })
            .catch(err => console.error("Failed to fetch settings:", err))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setSuccess(false);

        try {
            const res = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
            } else {
                alert("Failed to save settings");
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("An error occurred while saving.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
            </div>
        );
    }

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
                        <Settings className="w-8 h-8 text-slate-400" />
                        Settings
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Manage your account preferences and business details
                    </motion.p>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-1 space-y-1"
                >
                    {[
                        { id: 'profile', name: 'Profile & Regional', icon: User },
                        { id: 'business', name: 'Business Details', icon: Building2 },
                        { id: 'integrations', name: 'Integrations', icon: Shield },
                    ].map((item) => (
                        <button
                            key={item.id}
                            type="button"
                            onClick={() => setActiveTab(item.id as any)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </button>
                    ))}
                </motion.div>

                {/* Form Content */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="lg:col-span-3 space-y-6"
                >
                    <div className="glass-card p-6 md:p-8">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">Personal & Regional Information</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Full Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Email Address</label>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            readOnly
                                            disabled
                                            className="input-field opacity-60 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Country (Tax Locale)</label>
                                        <select
                                            value={formData.country}
                                            onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                                            className="input-field bg-slate-900"
                                            required
                                        >
                                            <option value="">Select Country</option>
                                            <option value="United States">United States</option>
                                            <option value="India">India</option>
                                            <option value="United Kingdom">United Kingdom</option>
                                            <option value="Canada">Canada</option>
                                            <option value="Australia">Australia</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Default Currency</label>
                                        <select
                                            value={formData.defaultCurrency}
                                            onChange={(e) => setFormData({ ...formData, defaultCurrency: e.target.value })}
                                            className="input-field bg-slate-900"
                                            required
                                        >
                                            <option value="USD">USD ($)</option>
                                            <option value="INR">INR (₹)</option>
                                            <option value="EUR">EUR (€)</option>
                                            <option value="GBP">GBP (£)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'business' && (
                            <div className="space-y-6">
                                <h2 className="text-xl font-bold text-white mb-6">Business Operations</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-400">Legal Business Name</label>
                                        <input
                                            type="text"
                                            value={formData.businessName}
                                            onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                            className="input-field"
                                            placeholder="e.g. FreelanceOS Creative Studio"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Business Public Email</label>
                                        <input
                                            type="email"
                                            value={formData.businessEmail}
                                            onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
                                            className="input-field"
                                            placeholder="hello@FreelanceOS.com"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Business Phone</label>
                                        <input
                                            type="text"
                                            value={formData.businessPhone}
                                            onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                                            className="input-field"
                                            placeholder="+1 (555) 000-0000"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-400">Tax ID / VAT Registration #</label>
                                        <input
                                            type="text"
                                            value={formData.taxId}
                                            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                                            className="input-field"
                                            placeholder="Tax Identification Number"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm font-medium text-slate-400">Business Address (Display on Invoices)</label>
                                        <textarea
                                            value={formData.businessAddress}
                                            onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                                            className="input-field min-h-[100px]"
                                            placeholder="Full registerd address..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'integrations' && (
                            <div className="space-y-6 min-h-[300px] flex flex-col items-center justify-center text-center">
                                <div className="p-4 bg-indigo-500/10 rounded-full mb-4">
                                    <Shield className="w-8 h-8 text-indigo-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white">Trust & Integrations</h2>
                                <p className="text-slate-400 max-w-sm">Connect your bank account, payment gateways, and accounting software.</p>
                                <button type="button" className="text-indigo-400 text-sm font-semibold hover:text-indigo-300 mt-2">Coming Soon &rarr;</button>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-8 mt-8 border-t border-white/5">
                            {success && (
                                <motion.span
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-emerald-400 text-sm font-medium flex items-center gap-2"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    Changes saved successfully!
                                </motion.span>
                            )}
                            {!success && <div></div>}
                            <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2 min-w-[140px] justify-center">
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </div>

                    {activeTab === 'profile' && (
                        <div className="glass-card p-6 md:p-8 border-red-500/20">
                            <h2 className="text-xl font-bold text-white mb-2">Danger Zone</h2>
                            <p className="text-slate-400 text-sm mb-6">Irreversibly delete your account and all associated data.</p>
                            <button type="button" className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl text-sm font-semibold transition-all">
                                Delete Account
                            </button>
                        </div>
                    )}
                </motion.div>
            </form>
        </div>
    );
}
