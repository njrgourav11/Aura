"use client";

import { useState, useEffect } from "react";

const steps = [
    {
        step: "01",
        title: "Add a Client",
        desc: "Easily organize contact details and project history.",
        image: "/demo-step1.png",
        color: "from-blue-500/20 to-transparent",
        dot: "bg-blue-500",
    },
    {
        step: "02",
        title: "Create a Contract",
        desc: "Generate ironclad agreements with pre-built clauses.",
        image: "/demo-step2.png",
        color: "from-indigo-500/20 to-transparent",
        dot: "bg-indigo-500",
    },
    {
        step: "03",
        title: "Send Invoice",
        desc: "Beautiful, tax-compliant invoices sent in one click.",
        image: "/demo-step3.png",
        color: "from-fuchsia-500/20 to-transparent",
        dot: "bg-fuchsia-500",
    },
    {
        step: "04",
        title: "Log Payment",
        desc: "Track revenue and update your dashboard automatically.",
        image: "/demo-step4.png",
        color: "from-emerald-500/20 to-transparent",
        dot: "bg-emerald-500",
    },
];

export default function DemoSlideshow() {
    const [active, setActive] = useState(0);
    const [fading, setFading] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setFading(true);
            setTimeout(() => {
                setActive((prev) => (prev + 1) % steps.length);
                setFading(false);
            }, 350);
        }, 3200);
        return () => clearInterval(timer);
    }, []);

    const goTo = (i: number) => {
        if (i === active) return;
        setFading(true);
        setTimeout(() => {
            setActive(i);
            setFading(false);
        }, 350);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            {/* Steps list */}
            <div className="lg:col-span-5 space-y-3 md:space-y-4">
                {steps.map((item, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className={`w-full flex gap-4 md:gap-6 group text-left rounded-2xl p-4 transition-all duration-300 cursor-pointer ${active === i
                            ? "bg-white/5 border border-white/10"
                            : "hover:bg-white/3 border border-transparent"
                            }`}
                    >
                        <div
                            className={`text-xl md:text-2xl font-black flex-shrink-0 transition-colors duration-300 ${active === i ? "text-indigo-400" : "text-white/10 group-hover:text-white/20"
                                }`}
                        >
                            {item.step}
                        </div>
                        <div>
                            <h3 className={`text-base md:text-lg font-bold mb-1 transition-colors duration-300 ${active === i ? "text-white" : "text-slate-400 group-hover:text-slate-300"}`}>
                                {item.title}
                            </h3>
                            <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                            {/* Progress bar for active step */}
                            {active === i && (
                                <div className="mt-3 h-0.5 bg-white/5 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-indigo-500 rounded-full"
                                        style={{
                                            animation: "progressBar 3.2s linear forwards",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </button>
                ))}
            </div>

            {/* Screenshot display */}
            <div className="lg:col-span-7 bg-slate-950 border border-white/5 rounded-2xl md:rounded-3xl p-3 shadow-2xl relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-br ${steps[active].color} opacity-30 transition-all duration-700`} />

                {/* Browser chrome */}
                <div className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-900/80 border-b border-white/5 rounded-t-xl mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                    <div className="flex-1 mx-3 h-5 bg-white/5 rounded-md text-[10px] text-slate-500 flex items-center px-2">
                        freelanceos.app/{steps[active].title.toLowerCase().replace(/ /g, "-")}
                    </div>
                </div>

                <div
                    className="relative rounded-xl overflow-hidden"
                    style={{
                        opacity: fading ? 0 : 1,
                        transition: "opacity 0.35s ease",
                    }}
                >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={steps[active].image}
                        alt={`Step ${steps[active].step}: ${steps[active].title}`}
                        className="w-full h-auto block"
                    />
                    {/* Step badge overlay */}
                    <div className="absolute top-3 right-3 flex items-center gap-2 bg-slate-950/80 border border-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <div className={`w-1.5 h-1.5 rounded-full ${steps[active].dot}`} />
                        <span className="text-white text-xs font-bold">{steps[active].step} / {steps[active].title}</span>
                    </div>
                </div>

                {/* Dot indicators */}
                <div className="flex items-center justify-center gap-2 mt-3">
                    {steps.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goTo(i)}
                            className={`rounded-full transition-all duration-300 ${active === i ? "w-6 h-1.5 bg-indigo-500" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                                }`}
                        />
                    ))}
                </div>
            </div>

            <style jsx>{`
        @keyframes progressBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
}
