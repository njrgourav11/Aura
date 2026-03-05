"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Briefcase,
    Calendar,
    Clock,
    CheckCircle2,
    MoreHorizontal,
    Loader2,
    X,
    FolderOpen,
    ArrowRight,
    Edit2,
    Trash2
} from "lucide-react";
import Link from "next/link";
import ProjectModal from "@/components/modals/ProjectModal";
import { StatusBadge } from "@/components/ui/StatusBadge";

export default function ProjectsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/projects");
            if (res.ok) {
                const data = await res.json();
                setProjects(data);
            }
        } catch (error) {
            console.error("Failed to fetch projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const filteredProjects = projects.filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.clientId?.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProject(null);
    };

    const handleDelete = async (projectId: string) => {
        if (!confirm("Are you sure you want to delete this project? This action cannot be undone.")) return;
        try {
            const res = await fetch(`/api/projects/${projectId}`, { method: "DELETE" });
            if (res.ok) {
                fetchProjects();
            }
        } catch (error) {
            console.error("Failed to delete project:", error);
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
                        <Briefcase className="w-8 h-8 text-indigo-400" />
                        Projects
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 mt-1 md:mt-2 text-sm md:text-base"
                    >
                        Track your client projects, tasks, and notes
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
                            New Project
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
                        <Search className="h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-slate-700/50 rounded-xl leading-5 bg-slate-800/50 text-slate-300 placeholder-slate-500 focus:outline-none focus:bg-slate-800 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm font-sans"
                        placeholder="Search projects or clients..."
                    />
                </div>
            </motion.div>

            {/* Project Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-20 text-slate-500">
                    <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                    <p>Fetching projects...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.05 }}
                            className="glass-card p-6 flex flex-col group hover:border-indigo-500/30 transition-all relative h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <StatusBadge status={project.status} />
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedProject(project); setIsModalOpen(true); }}
                                        className="p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors"
                                        title="Edit Project"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDelete(project._id); }}
                                        className="p-1.5 bg-white/5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-colors"
                                        title="Delete Project"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <Link href={`/projects/${project._id}`} className="block flex-1 group/title">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover/title:text-indigo-400 transition-colors">
                                    {project.title}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                                    <FolderOpen size={14} />
                                    <span>{project.clientId?.name || "No Client"}</span>
                                </div>

                                <div className="space-y-4 mb-8">
                                    {/* Task Progress */}
                                    <div>
                                        <div className="flex justify-between text-xs text-slate-400 mb-1.5 font-medium">
                                            <span>Tasks</span>
                                            <span>
                                                {project.tasks.filter((t: any) => t.completed).length}/{project.tasks.length}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${project.tasks.length > 0 ? (project.tasks.filter((t: any) => t.completed).length / project.tasks.length) * 100 : 0}%` }}
                                                className="h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="flex -space-x-2">
                                        <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold border-2 border-slate-900">
                                            {project.clientId?.name ? project.clientId.name.charAt(0) : "?"}
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">
                                        Last update: {new Date(project.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <Link
                                    href={`/projects/${project._id}`}
                                    className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg group-hover:bg-indigo-500 group-hover:text-white transition-all transform group-hover:translate-x-1"
                                >
                                    <ArrowRight size={18} />
                                </Link>
                            </div>
                        </motion.div>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 glass-card p-16 flex flex-col items-center justify-center text-center">
                            <Briefcase className="w-16 h-16 text-slate-700 mb-6" />
                            <h3 className="text-xl font-bold text-white mb-2">No projects found</h3>
                            <p className="text-slate-500 text-sm max-w-sm mx-auto">
                                {searchQuery ? "No projects match your search criteria." : "Start managing your work by creating your first project."}
                            </p>
                            {!searchQuery && (
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="mt-8 text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-2 transition-colors"
                                >
                                    <Plus className="w-5 h-5" />
                                    Add your first project
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            <ProjectModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchProjects}
                project={selectedProject}
            />
        </div>
    );
}
