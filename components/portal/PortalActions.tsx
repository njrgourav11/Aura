"use client";
import React from "react";
import { generateInvoicePDF, generateContractPDF } from "@/lib/pdf";
import { generateAnalysisPDF } from "@/lib/pdf/analysis";
import { FileText, Download } from "lucide-react";

interface PortalActionsProps {
    type: "invoice" | "contract" | "project";
    data: any;
    businessDetails: any;
    clientName?: string;
    clientAddress?: string;
    clientEmail?: string;
}

function buildBusinessDetails(user: any) {
    return {
        name: user?.businessName || user?.name || "Service Provider",
        email: user?.businessEmail || user?.email,
        phone: user?.businessPhone,
        address: user?.businessAddress,
        taxId: user?.taxId,
    };
}

export function PortalDownloadButton({ type, data, businessDetails, clientName, clientAddress, clientEmail }: PortalActionsProps) {
    const handleDownload = async () => {
        const bd = buildBusinessDetails(businessDetails);
        if (type === "invoice") {
            generateInvoicePDF({
                invoiceNumber: data.invoiceNumber || "INV-001",
                clientName: clientName || data.clientName || "Client",
                clientAddress: clientAddress || data.clientAddress || "",
                items: data.items || [],
                total: data.total || 0,
                currency: data.currency || "USD",
                issuedAt: new Date(data.issuedAt),
                dueDate: new Date(data.dueDate),
                businessDetails: bd,
            });
        } else if (type === "contract") {
            generateContractPDF({
                title: data.title || "Service Agreement",
                clientName: clientName || data.clientName || "Client",
                clientEmail: clientEmail || data.clientEmail || "",
                clientAddress: clientAddress || data.clientAddress || "",
                amount: data.amount || 0,
                currency: data.currency || "USD",
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                scope: data.scope || "Professional services as agreed.",
                clauses: data.clauses || [],
                businessDetails: bd,
            });
        } else if (type === "project") {
            // Use premium canvas format
            await generateAnalysisPDF({
                ...data,
                clientId: {
                    name: clientName || data.clientName || "Client",
                }
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

export function PortalViewButton({ type, data, businessDetails, clientName, clientAddress, clientEmail }: PortalActionsProps) {
    const handleView = async () => {
        const bd = buildBusinessDetails(businessDetails);
        if (type === "invoice") {
            generateInvoicePDF({
                invoiceNumber: data.invoiceNumber || "INV-001",
                clientName: clientName || data.clientName || "Client",
                clientAddress: clientAddress || data.clientAddress || "",
                items: data.items || [],
                total: data.total || 0,
                currency: data.currency || "USD",
                issuedAt: new Date(data.issuedAt),
                dueDate: new Date(data.dueDate),
                businessDetails: bd,
            });
        } else if (type === "contract") {
            generateContractPDF({
                title: data.title || "Service Agreement",
                clientName: clientName || data.clientName || "Client",
                clientEmail: clientEmail || data.clientEmail || "",
                clientAddress: clientAddress || data.clientAddress || "",
                amount: data.amount || 0,
                currency: data.currency || "USD",
                startDate: new Date(data.startDate),
                endDate: data.endDate ? new Date(data.endDate) : undefined,
                scope: data.scope || "Professional services as agreed.",
                clauses: data.clauses || [],
                businessDetails: bd,
            });
        } else if (type === "project") {
            // Use premium canvas format
            await generateAnalysisPDF({
                ...data,
                clientId: {
                    name: clientName || data.clientName || "Client",
                }
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
