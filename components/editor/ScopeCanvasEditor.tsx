"use client"
import { Plus, Trash2, GripVertical, Type } from "lucide-react";
import { motion, Reorder, AnimatePresence } from "framer-motion";

export interface ScopeSection {
    id: string;
    title: string;
    items: string[];
}

interface ScopeCanvasEditorProps {
    value: ScopeSection[];
    onChange: (value: ScopeSection[]) => void;
}

export default function ScopeCanvasEditor({ value, onChange }: ScopeCanvasEditorProps) {
    const addSection = () => {
        const newSection: ScopeSection = {
            id: Math.random().toString(36).substr(2, 9),
            title: "",
            items: [""]
        };
        onChange([...value, newSection]);
    };

    const removeSection = (id: string) => {
        onChange(value.filter(s => s.id !== id));
    };

    const updateSection = (id: string, updates: Partial<ScopeSection>) => {
        onChange(value.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const addItem = (sectionId: string) => {
        onChange(value.map(s => {
            if (s.id === sectionId) {
                return { ...s, items: [...s.items, ""] };
            }
            return s;
        }));
    };

    const updateItem = (sectionId: string, itemIndex: number, text: string) => {
        onChange(value.map(s => {
            if (s.id === sectionId) {
                const newItems = [...s.items];
                newItems[itemIndex] = text;
                return { ...s, items: newItems };
            }
            return s;
        }));
    };

    const removeItem = (sectionId: string, itemIndex: number) => {
        onChange(value.map(s => {
            if (s.id === sectionId) {
                const newItems = s.items.filter((_, i) => i !== itemIndex);
                return { ...s, items: newItems.length > 0 ? newItems : [""] };
            }
            return s;
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-white/5 mb-4">
                <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Scope Canvas</span>
                <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20"
                >
                    <Plus className="w-4 h-4" /> Add Section
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {value.map((section, sIdx) => (
                        <motion.div
                            key={section.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="p-4 rounded-xl border border-white/5 bg-slate-900/20 group relative"
                        >
                            <div className="flex gap-3 mb-4 items-center">
                                <div className="flex-1 relative">
                                    <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                    <input
                                        type="text"
                                        placeholder="Section Title (e.g. Design Phase)"
                                        value={section.title}
                                        onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                        className="w-full bg-slate-950/50 border border-slate-700/50 rounded-lg py-2 pl-10 pr-4 text-sm font-bold text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSection(section.id)}
                                    className="p-2 text-slate-600 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-2 ml-4 border-l border-slate-800/50 pl-4">
                                {section.items.map((item, iIdx) => (
                                    <div key={iIdx} className="flex gap-2 group/item">
                                        <div className="pt-2 text-slate-600">•</div>
                                        <textarea
                                            value={item}
                                            onChange={(e) => updateItem(section.id, iIdx, e.target.value)}
                                            placeholder="Detail or deliverable..."
                                            rows={1}
                                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-slate-300 placeholder:text-slate-600 resize-none py-1.5 focus:outline-none min-h-[36px]"
                                            onInput={(e) => {
                                                const target = e.target as HTMLTextAreaElement;
                                                target.style.height = 'auto';
                                                target.style.height = target.scrollHeight + 'px';
                                            }}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeItem(section.id, iIdx)}
                                            className="p-1.5 text-slate-700 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addItem(section.id)}
                                    className="mt-2 flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-indigo-400 transition-colors"
                                >
                                    <Plus className="w-3.5 h-3.5" /> Add Point
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {value.length === 0 && (
                    <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                        <div className="p-4 bg-slate-800/50 rounded-full mb-4">
                            <Plus className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm mb-4">No sections added to the scope yet.</p>
                        <button
                            type="button"
                            onClick={addSection}
                            className="btn-secondary text-sm"
                        >
                            Start Building Scope
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
