"use client"
import { useState, useEffect } from "react";
import { X, Loader2, Plus, Trash2, CheckCircle2, Circle, Flag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    project?: any;
}

export default function ProjectModal({ isOpen, onClose, onSuccess, project }: ProjectModalProps) {
    const [loading, setLoading] = useState(false);
    const [clients, setClients] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        title: "",
        clientId: "",
        description: "",
        status: "Planning",
        startDate: "",
        endDate: "",
        tasks: [] as any[],
        milestones: [] as any[]
    });

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch("/api/clients");
                if (res.ok) {
                    const data = await res.json();
                    setClients(data);
                }
            } catch (err) {
                console.error("Failed to fetch clients:", err);
            }
        };

        if (isOpen) {
            fetchClients();
            if (project) {
                setFormData({
                    title: project.title || "",
                    clientId: project.clientId?._id || project.clientId || "",
                    description: project.description || "",
                    status: project.status || "Planning",
                    startDate: project.startDate ? new Date(project.startDate).toISOString().split('T')[0] : "",
                    endDate: project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "",
                    tasks: project.tasks || [],
                    milestones: project.milestones || []
                });
            } else {
                setFormData({
                    title: "",
                    clientId: "",
                    description: "",
                    status: "Planning",
                    startDate: new Date().toISOString().split('T')[0],
                    endDate: "",
                    tasks: [],
                    milestones: []
                });
            }
        }
    }, [project, isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const url = project ? `/api/projects/${project._id}` : "/api/projects";
        const method = project ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            }
        } catch (error) {
            console.error("Failed to save project:", error);
        } finally {
            setLoading(false);
        }
    };

    const addTask = () => {
        setFormData({
            ...formData,
            tasks: [...formData.tasks, { title: "", completed: false }]
        });
    };

    const removeTask = (index: number) => {
        const newTasks = [...formData.tasks];
        newTasks.splice(index, 1);
        setFormData({ ...formData, tasks: newTasks });
    };

    const updateTask = (index: number, field: string, value: any) => {
        const newTasks = [...formData.tasks];
        newTasks[index][field] = value;
        setFormData({ ...formData, tasks: newTasks });
    };

    const addMilestone = () => {
        setFormData({
            ...formData,
            milestones: [...formData.milestones, { title: "", dueDate: "", completed: false }]
        });
    };

    const removeMilestone = (index: number) => {
        const newMilestones = [...formData.milestones];
        newMilestones.splice(index, 1);
        setFormData({ ...formData, milestones: newMilestones });
    };

    const updateMilestone = (index: number, field: string, value: any) => {
        const newMilestones = [...formData.milestones];
        newMilestones[index][field] = value;
        setFormData({ ...formData, milestones: newMilestones });
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
                        className="relative w-full max-w-2xl glass-card p-8 overflow-y-auto max-h-[90vh]"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">{project ? "Edit Project" : "New Project"}</h2>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-lg text-slate-400">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Basic Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Project Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="input-field"
                                        placeholder="E.g., Website Redesign"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Client</label>
                                    <select
                                        required
                                        value={formData.clientId}
                                        onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
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
                                        <option value="Planning">Planning</option>
                                        <option value="Active">Active</option>
                                        <option value="Completed">Completed</option>
                                        <option value="On Hold">On Hold</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">Start Date</label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-1.5">End Date</label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="input-field"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1.5">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input-field min-h-[80px]"
                                    placeholder="Project goals, scope, and initial notes..."
                                />
                            </div>

                            {/* Tasks Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <CheckCircle2 size={16} className="text-indigo-400" />
                                        Initial Tasks
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addTask}
                                        className="text-xs font-bold text-indigo-400 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Add Task
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.tasks.map((task, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={task.title}
                                                onChange={(e) => updateTask(idx, "title", e.target.value)}
                                                className="input-field py-2"
                                                placeholder="Task title..."
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeTask(idx)}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Milestones Section */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <label className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                                        <Flag size={16} className="text-fuchsia-400" />
                                        Milestones
                                    </label>
                                    <button
                                        type="button"
                                        onClick={addMilestone}
                                        className="text-xs font-bold text-fuchsia-400 hover:text-white flex items-center gap-1 transition-colors"
                                    >
                                        <Plus size={14} /> Add Milestone
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.milestones.map((ms, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={ms.title}
                                                onChange={(e) => updateMilestone(idx, "title", e.target.value)}
                                                className="input-field py-2 flex-grow"
                                                placeholder="Milestone title..."
                                            />
                                            <input
                                                type="date"
                                                value={ms.dueDate ? new Date(ms.dueDate).toISOString().split('T')[0] : ""}
                                                onChange={(e) => updateMilestone(idx, "dueDate", e.target.value)}
                                                className="input-field py-2 w-36"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeMilestone(idx)}
                                                className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
                                <button type="submit" disabled={loading} className="btn-primary flex-1">
                                    {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (project ? "Update Project" : "Create Project")}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
