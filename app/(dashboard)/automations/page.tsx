"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Zap, 
    Plus, 
    Loader2, 
    CheckCircle2, 
    XCircle, 
    Trash2, 
    ChevronRight,
    Play,
    Settings2,
    Briefcase,
    FileSignature,
    Receipt,
    Mail,
    Clock
} from "lucide-react";
import { useSession } from "next-auth/react";

const triggerIcons = {
    'CONTRACT_SIGNED': FileSignature,
    'PROJECT_COMPLETED': Briefcase,
    'INVOICE_PAID': Receipt
};

const actionIcons = {
    'CREATE_PROJECT': Briefcase,
    'CREATE_INVOICE': Receipt,
    'SEND_EMAIL': Mail
};

const triggerLabels = {
    'CONTRACT_SIGNED': 'Contract Signed',
    'PROJECT_COMPLETED': 'Project Completed',
    'INVOICE_PAID': 'Invoice Paid'
};

const actionLabels = {
    'CREATE_PROJECT': 'Create Project',
    'CREATE_INVOICE': 'Create Invoice',
    'SEND_EMAIL': 'Send Email'
};

export default function AutomationsPage() {
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [automations, setAutomations] = useState<any[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [newAutomation, setNewAutomation] = useState({
        name: '',
        trigger: 'CONTRACT_SIGNED',
        action: 'CREATE_PROJECT'
    });

    useEffect(() => {
        fetchAutomations();
    }, []);

    const fetchAutomations = async () => {
        try {
            const res = await fetch("/api/automations");
            const data = await res.json();
            setAutomations(data);
        } catch (err) {
            console.error("Error fetching automations:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (id: string, currentStatus: boolean) => {
        try {
            await fetch(`/api/automations/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !currentStatus })
            });
            setAutomations(automations.map(a => a._id === id ? { ...a, isActive: !currentStatus } : a));
        } catch (err) {
            console.error("Error toggling automation:", err);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this automation?")) return;
        try {
            await fetch(`/api/automations/${id}`, { method: 'DELETE' });
            setAutomations(automations.filter(a => a._id !== id));
        } catch (err) {
            console.error("Error deleting automation:", err);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/automations", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newAutomation)
            });
            const data = await res.json();
            setAutomations([...automations, data]);
            setIsAdding(false);
            setNewAutomation({ name: '', trigger: 'CONTRACT_SIGNED', action: 'CREATE_PROJECT' });
        } catch (err) {
            console.error("Error adding automation:", err);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-12 h-12 animate-spin text-indigo-500 mb-4" />
                <p className="text-slate-400 font-medium">Loading your workflows...</p>
            </div>
        );
    }

    return (
        <div className="w-full max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Zap className="w-8 h-8 text-indigo-400" />
                        Automations
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Streamline your workflow with automated triggers and actions.
                    </p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Workflow</span>
                </button>
            </div>

            {/* Quick Stats Placeholder */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <Zap className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">{automations.filter(a => a.isActive).length}</div>
                        <p className="text-xs text-slate-500">Active Automations</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">42</div>
                        <p className="text-xs text-slate-500">Tasks Automated</p>
                    </div>
                </div>
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center">
                        <Clock className="w-6 h-6 text-fuchsia-400" />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-white">12.5h</div>
                        <p className="text-xs text-slate-500">Time Saved This Month</p>
                    </div>
                </div>
            </div>

            {/* Add Automation Modal/Form overlay */}
            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-slate-900 border border-white/10 p-8 rounded-3xl w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-white">Create Workflow</h2>
                                <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Workflow Name</label>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="e.g., Auto-create project for signed contracts"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                        value={newAutomation.name}
                                        onChange={e => setNewAutomation({...newAutomation, name: e.target.value})}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Trigger</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            value={newAutomation.trigger}
                                            onChange={e => setNewAutomation({...newAutomation, trigger: e.target.value})}
                                        >
                                            <option value="CONTRACT_SIGNED">Contract Signed</option>
                                            <option value="PROJECT_COMPLETED">Project Completed</option>
                                            <option value="INVOICE_PAID">Invoice Paid</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Action</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                            value={newAutomation.action}
                                            onChange={e => setNewAutomation({...newAutomation, action: e.target.value})}
                                        >
                                            <option value="CREATE_PROJECT">Create Project</option>
                                            <option value="CREATE_INVOICE">Create Invoice</option>
                                            <option value="SEND_EMAIL">Send Email (Phase 3)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button type="submit" className="btn-primary w-full py-4 text-lg font-bold">
                                        Activate Workflow
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Automations List */}
            <div className="space-y-4">
                {automations.map((a, i) => (
                    <motion.div 
                        key={a._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-300 ${!a.isActive ? 'opacity-60' : ''}`}
                    >
                        <div className="flex items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${a.isActive ? 'bg-indigo-500/10' : 'bg-slate-800'}`}>
                                <Zap className={`w-7 h-7 ${a.isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">{a.name}</h3>
                                <div className="flex items-center gap-3 text-sm text-slate-400">
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-white/5">
                                        {/* @ts-ignore */}
                                        {(() => {const Icon = triggerIcons[a.trigger]; return Icon ? <Icon className="w-3.5 h-3.5" /> : null})()}
                                        {/* @ts-ignore */}
                                        {triggerLabels[a.trigger]}
                                    </span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-500/10 text-indigo-300">
                                        {/* @ts-ignore */}
                                        {(() => {const Icon = actionIcons[a.action]; return Icon ? <Icon className="w-3.5 h-3.5" /> : null})()}
                                        {/* @ts-ignore */}
                                        {actionLabels[a.action]}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button 
                                onClick={() => handleToggle(a._id, a.isActive)}
                                className={`
                                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none
                                    ${a.isActive ? 'bg-indigo-500' : 'bg-slate-700'}
                                `}
                            >
                                <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${a.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            
                            <div className="h-8 w-px bg-white/5 mx-2" />
                            
                            <button 
                                onClick={() => handleDelete(a._id)}
                                className="p-2.5 rounded-xl hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-all"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                    </motion.div>
                ))}

                {automations.length === 0 && (
                    <div className="glass-card p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center mb-6">
                            <Zap className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No automations yet</h3>
                        <p className="text-slate-500 max-w-sm">
                            Create your first automation to save time and running your business on autopilot.
                        </p>
                        <button 
                            onClick={() => setIsAdding(true)}
                            className="mt-8 btn-secondary"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
