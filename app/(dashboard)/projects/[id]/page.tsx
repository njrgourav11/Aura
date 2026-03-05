"use client"
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    Calendar,
    Clock,
    CheckCircle2,
    Circle,
    Flag,
    MessageSquare,
    Plus,
    Trash2,
    Loader2,
    ArrowLeft,
    Users,
    ChevronRight,
    StickyNote
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ProjectDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [newNote, setNewNote] = useState("");
    const [saving, setSaving] = useState(false);

    const fetchProject = async () => {
        try {
            const res = await fetch(`/api/projects/${id}`);
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            } else {
                router.push("/projects");
            }
        } catch (error) {
            console.error("Failed to fetch project:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProject();
    }, [id]);

    const updateProjectData = async (updatedData: any) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedData),
            });
            if (res.ok) {
                const data = await res.json();
                setProject(data);
            }
        } catch (error) {
            console.error("Failed to update project:", error);
        } finally {
            setSaving(false);
        }
    };

    const toggleTask = (idx: number) => {
        const updatedTasks = [...project.tasks];
        updatedTasks[idx].completed = !updatedTasks[idx].completed;
        updateProjectData({ tasks: updatedTasks });
    };

    const addTask = (e: React.FormEvent) => {
        e.preventDefault();
        const input = (e.target as any).taskTitle;
        if (!input.value.trim()) return;

        const updatedTasks = [...project.tasks, { title: input.value, completed: false }];
        updateProjectData({ tasks: updatedTasks });
        input.value = "";
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newNote.trim()) return;

        const updatedNotes = [{ content: newNote, createdAt: new Date() }, ...project.notes];
        await updateProjectData({ notes: updatedNotes });
        setNewNote("");
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 text-slate-500 min-h-[60vh]">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                <p>Loading project details...</p>
            </div>
        );
    }

    if (!project) return null;

    const completedTasks = project.tasks.filter((t: any) => t.completed).length;
    const progress = project.tasks.length > 0 ? (completedTasks / project.tasks.length) * 100 : 0;

    return (
        <div className="w-full max-w-full space-y-8 pb-20">
            {/* Breadcrumbs & Header */}
            <div className="flex flex-col gap-4">
                <Link
                    href="/projects"
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-medium w-fit"
                >
                    <ArrowLeft size={16} />
                    Back to Projects
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-bold text-white tracking-tight">{project.title}</h1>
                            <StatusBadge status={project.status} />
                        </div>
                        <p className="text-slate-400 flex items-center gap-2">
                            <Users size={16} />
                            {project.clientId?.name} {project.clientId?.company && `· ${project.clientId.company}`}
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        {saving && <div className="text-xs text-indigo-400 font-medium animate-pulse">Saving changes...</div>}
                        <button className="btn-secondary">Edit Project</button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Description Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-6"
                    >
                        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 text-indigo-400">
                            <Clock size={16} />
                            Project Overview
                        </h2>
                        <p className="text-slate-300 leading-relaxed whitespace-pre-wrap rounded-xl bg-white/5 p-4 border border-white/5">
                            {project.description || "No description provided for this project."}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Start Date</p>
                                <p className="text-sm text-white font-medium">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">End Date</p>
                                <p className="text-sm text-white font-medium">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Tasks</p>
                                <p className="text-sm text-white font-medium">{completedTasks}/{project.tasks.length}</p>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Progress</p>
                                <p className="text-sm text-indigo-400 font-bold">{Math.round(progress)}%</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Task List */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <CheckCircle2 size={20} className="text-indigo-400" />
                                Project Tasks
                            </h2>
                            <span className="text-xs text-slate-500 font-mono">{Math.round(progress)}% Complete</span>
                        </div>

                        <div className="space-y-2 mb-6">
                            {project.tasks.map((task: any, idx: number) => (
                                <div
                                    key={idx}
                                    onClick={() => toggleTask(idx)}
                                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer group ${task.completed
                                            ? 'bg-emerald-500/5 border-emerald-500/10 text-slate-400'
                                            : 'bg-white/5 border-white/5 text-slate-200 hover:border-indigo-500/30'
                                        }`}
                                >
                                    {task.completed ? (
                                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                                            <CheckCircle2 size={14} className="text-white" />
                                        </div>
                                    ) : (
                                        <Circle size={20} className="text-slate-600 group-hover:text-indigo-400" />
                                    )}
                                    <span className={`flex-1 ${task.completed ? 'line-through opacity-50' : ''}`}>{task.title}</span>
                                </div>
                            ))}
                        </div>

                        <form onSubmit={addTask} className="relative">
                            <input
                                name="taskTitle"
                                type="text"
                                placeholder="Add a quick task..."
                                className="input-field pr-12"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1.5 p-2 text-indigo-400 hover:text-white transition-colors"
                            >
                                <Plus size={20} />
                            </button>
                        </form>
                    </motion.div>

                    {/* Progress Notes */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h2 className="text-xl font-bold text-white flex items-center gap-2 px-1">
                            <MessageSquare size={22} className="text-indigo-400" />
                            Progress Tracking
                        </h2>

                        <div className="glass-card p-6">
                            <form onSubmit={handleAddNote} className="space-y-4 mb-8">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Add a progress update or note..."
                                    className="input-field min-h-[100px] bg-slate-900/50"
                                />
                                <div className="flex justify-end">
                                    <button
                                        disabled={!newNote.trim() || saving}
                                        className="btn-primary"
                                    >
                                        Post Update
                                    </button>
                                </div>
                            </form>

                            <div className="space-y-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-white/5">
                                {project.notes && project.notes.length > 0 ? project.notes.map((note: any, idx: number) => (
                                    <div key={idx} className="relative pl-10">
                                        <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-indigo-500 border-4 border-slate-900 z-10" />
                                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                                            <div className="text-xs text-slate-500 font-medium mb-2">
                                                {new Date(note.createdAt).toLocaleString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <p className="text-slate-300 text-sm leading-relaxed">
                                                {note.content}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10">
                                        <StickyNote size={32} className="text-slate-800 mx-auto mb-3" />
                                        <p className="text-slate-500 text-sm italic">No progress updates yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Sidebar Context */}
                <div className="space-y-8">
                    {/* Client Context */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Client Detail</h3>
                        <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white font-bold">
                                    {project.clientId?.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-white font-bold">{project.clientId?.name}</p>
                                    <p className="text-xs text-slate-500">{project.clientId?.email}</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-white/5 space-y-2">
                                <Link
                                    href={`/clients`}
                                    className="flex items-center justify-between text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                    View full profile
                                    <ChevronRight size={14} />
                                </Link>
                                <Link
                                    href={`/invoices`}
                                    className="flex items-center justify-between text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                                >
                                    Client billing history
                                    <ChevronRight size={14} />
                                </Link>
                            </div>
                        </div>
                    </motion.div>

                    {/* Milestones Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass-card p-6"
                    >
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center justify-between">
                            Milestones
                            <Flag size={14} />
                        </h3>
                        <div className="space-y-4">
                            {project.milestones && project.milestones.length > 0 ? project.milestones.map((ms: any, idx: number) => (
                                <div key={idx} className="flex gap-3">
                                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${ms.completed ? 'bg-emerald-500' : 'bg-slate-700'}`} />
                                    <div>
                                        <p className={`text-sm font-medium ${ms.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                                            {ms.title}
                                        </p>
                                        <p className="text-[10px] text-slate-500">
                                            {ms.dueDate ? `Due: ${new Date(ms.dueDate).toLocaleDateString()}` : 'No date'}
                                        </p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-xs text-slate-600 italic">No milestones set.</p>
                            )}
                        </div>
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-3xl p-6 border border-white/10"
                    >
                        <h3 className="text-sm font-bold text-white mb-4">Focus Goal</h3>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                            You're currently <span className="text-white font-bold">{completedTasks}</span> tasks into this project.
                            {progress >= 100 ? " Excellent work! Project is fully complete." : " Keep pushing to hit your next milestone."}
                        </p>
                        <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
