import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bold, Italic, List, ListOrdered, Type, Code, FileText, Download, Check, Save } from 'lucide-react';

interface CanvasEditorProps {
    initialContent: string;
    onSave: (content: string) => Promise<void>;
    onGenerateDocument?: () => void;
    isSaving: boolean;
}

export function CanvasEditor({ initialContent, onSave, onGenerateDocument, isSaving }: CanvasEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isPreview, setIsPreview] = useState(false);
    const [savedState, setSavedState] = useState(true);

    const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setContent(e.target.value);
        setSavedState(false);
    };

    const handleSave = async () => {
        await onSave(content);
        setSavedState(true);
    };

    // Very basic markdown formatting helpers
    const insertFormat = (prefix: string, suffix: string = '') => {
        const textarea = document.getElementById('canvas-textarea') as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;
        const selectedText = text.substring(start, end);

        const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end);
        setContent(newText);
        setSavedState(false);

        // Return focus carefully
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + prefix.length, end + prefix.length);
        }, 0);
    };

    // Basic markdown to HTML renderer for preview
    const renderMarkdown = (text: string) => {
        if (!text) return <span className="text-slate-500 italic">No content</span>;

        // This is a highly simplified parser just for basic display
        // In a real app, use react-markdown
        return text.split('\n').map((line, i) => {
            if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold mt-4 mb-2 text-white">{line.replace('# ', '')}</h1>;
            if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold mt-3 mb-2 text-white">{line.replace('## ', '')}</h2>;
            if (line.startsWith('- ')) return <li key={i} className="ml-4 list-disc text-slate-300 my-1">{line.replace('- ', '')}</li>;
            if (line.startsWith('1. ')) return <li key={i} className="ml-4 list-decimal text-slate-300 my-1">{line.replace('1. ', '')}</li>;
            if (line.trim() === '') return <br key={i} />;

            // Bold handling
            let formattedLine = line;
            return <p key={i} className="text-slate-300 mb-2 leading-relaxed">{formattedLine}</p>;
        });
    };

    return (
        <div className="flex flex-col h-full min-h-[500px] border border-white/10 rounded-2xl overflow-hidden bg-slate-950 shadow-2xl">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-white/10 bg-slate-900/50">
                <div className="flex items-center gap-1">
                    <button onClick={() => insertFormat('# ', '')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Heading">
                        <Type size={16} />
                    </button>
                    <button onClick={() => insertFormat('**', '**')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Bold">
                        <Bold size={16} />
                    </button>
                    <button onClick={() => insertFormat('*', '*')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Italic">
                        <Italic size={16} />
                    </button>
                    <div className="w-px h-5 bg-white/10 mx-2" />
                    <button onClick={() => insertFormat('- ', '')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Bullet List">
                        <List size={16} />
                    </button>
                    <button onClick={() => insertFormat('1. ', '')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Numbered List">
                        <ListOrdered size={16} />
                    </button>
                    <button onClick={() => insertFormat('```\n', '\n```')} className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors" title="Code Block">
                        <Code size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-900 rounded-lg p-1 border border-white/5">
                        <button
                            onClick={() => setIsPreview(false)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${!isPreview ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'}`}
                        >
                            Write
                        </button>
                        <button
                            onClick={() => setIsPreview(true)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${isPreview ? 'bg-fuchsia-500/20 text-fuchsia-300' : 'text-slate-400 hover:text-white'}`}
                        >
                            Preview
                        </button>
                    </div>

                    <div className="w-px h-5 bg-white/10 mx-1" />

                    <button
                        onClick={handleSave}
                        disabled={isSaving || savedState}
                        className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${savedState
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]'
                            }`}
                    >
                        {isSaving ? (
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : savedState ? (
                            <Check size={14} />
                        ) : (
                            <Save size={14} />
                        )}
                        {savedState ? 'Saved' : 'Save'}
                    </button>

                    {onGenerateDocument && (
                        <button
                            onClick={onGenerateDocument}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-colors"
                        >
                            <Download size={14} />
                            Export
                        </button>
                    )}
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative bg-[#0f111a]">
                {isPreview ? (
                    <div className="absolute inset-0 overflow-y-auto p-8 custom-scrollbar">
                        <div className="max-w-3xl mx-auto prose prose-invert">
                            {renderMarkdown(content)}
                        </div>
                    </div>
                ) : (
                    <textarea
                        id="canvas-textarea"
                        value={content}
                        onChange={handleContentChange}
                        placeholder="Start typing your analysis, strategy or report... (Markdown supported)"
                        className="absolute inset-0 w-full h-full p-8 bg-transparent text-slate-300 resize-none focus:outline-none custom-scrollbar leading-relaxed font-mono text-sm"
                        spellCheck={false}
                    />
                )}
            </div>
        </div>
    );
}
