"use client";

import React from "react";
import { generateInvoicePDF, generateContractPDF } from "@/lib/pdf";
import { FileText, Download } from "lucide-react";

interface PortalActionsProps {
    type: "invoice" | "contract";
    data: any;
    businessDetails: any;
}

export function PortalDownloadButton({ type, data, businessDetails }: PortalActionsProps) {
    const handleDownload = () => {
        if (type === "invoice") {
            generateInvoicePDF({
                ...data,
                issuedAt: new Date(data.issuedAt),
                dueDate: new Date(data.dueDate),
                businessDetails
            });
        } else {
            generateContractPDF({
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                businessDetails
            });
        }
    };

    return (
        <button
            onClick={handleDownload}
            className="h-11 px-6 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400"
        >
            <Download size={16} />
            Download PDF
        </button>
    );
}

export function PortalViewButton({ type, data, businessDetails }: PortalActionsProps) {
    const handleView = () => {
        if (type === "invoice") {
            generateInvoicePDF({
                ...data,
                issuedAt: new Date(data.issuedAt),
                dueDate: new Date(data.dueDate),
                businessDetails
            });
        } else {
            generateContractPDF({
                ...data,
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                businessDetails
            });
        }
    };

    return (
        <button
            onClick={handleView}
            className="text-purple-400 hover:text-white transition-colors text-sm font-bold flex items-center gap-2"
        >
            <FileText size={16} />
            View Document
        </button>
    );
}
