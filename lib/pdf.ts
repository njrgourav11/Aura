import { jsPDF } from "jspdf";
import { format } from "date-fns";

export interface ContractData {
    title: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    amount: number;
    currency: string;
    startDate: Date;
    endDate?: Date;
    scope: string;
    clauses: string[];
    businessDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        taxId?: string;
    };
}

export interface InvoiceData {
    invoiceNumber: string;
    clientName: string;
    clientAddress?: string;
    items: { description: string; quantity: number; rate: number; amount: number }[];
    total: number;
    currency: string;
    issuedAt: Date;
    dueDate: Date;
    businessDetails?: {
        name?: string;
        email?: string;
        phone?: string;
        address?: string;
        taxId?: string;
    };
}

/* -------------------------------- */
/* Shared Helpers */
/* -------------------------------- */

const drawLogo = (doc: jsPDF, x: number, y: number) => {
    doc.setFillColor(79, 70, 229);
    doc.circle(x + 10, y + 10, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("A", x + 7.5, y + 13.5);
};

const addDocumentHeader = (doc: jsPDF, title: string, sub: string, ref?: string) => {
    const pageWidth = 210;
    const margin = 20;

    // Background Accent
    doc.setFillColor(249, 250, 251);
    doc.rect(0, 0, pageWidth, 40, "F");

    // Brand Logo & Name
    drawLogo(doc, margin, 10);
    doc.setTextColor(79, 70, 229);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("FreelanceOS Documents", margin + 22, 23);

    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(sub.toUpperCase(), margin + 22, 28);

    // Right Side Metadata
    doc.setFontSize(9);
    doc.setTextColor(75, 85, 99);
    if (ref) doc.text(`REF: ${ref}`, 190, 20, { align: "right" });
    doc.text(`ISSUED: ${format(new Date(), "PP")}`, 190, 25, { align: "right" });
};

const addDocumentFooter = (doc: jsPDF, page: number) => {
    const margin = 20;
    doc.setDrawColor(229, 231, 235);
    doc.line(margin, 282, 190, 282);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text("FreelanceOS Freelancer OS • Professional Services Cloud", margin, 288);
    doc.text(`Page ${page}`, 190, 288, { align: "right" });
};

/* -------------------------------- */
/* Contract Generation */
/* -------------------------------- */

export const generateContractPDF = (data: ContractData) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = 170;

    let yPos = 55;
    let pageNumber = 1;

    const refreshHeader = () => {
        addDocumentHeader(doc, "Agreement", "Legal & Binding Service Agreement", `CTR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`);
    };

    const checkPageBreak = (space: number) => {
        if (yPos + space > 270) {
            addDocumentFooter(doc, pageNumber);
            doc.addPage();
            pageNumber++;
            refreshHeader();
            yPos = 55;
        }
    };

    const drawSectionHeader = (title: string, subtitle?: string) => {
        checkPageBreak(25);
        // Explicit light background instead of questionable alpha
        doc.setFillColor(243, 244, 252);
        doc.rect(margin, yPos - 5, contentWidth, 10, "F");

        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(67, 56, 202); // Darker indigo for high contrast
        doc.text(title.toUpperCase(), margin + 3, yPos + 1.5);

        if (subtitle) {
            doc.setFontSize(8);
            doc.setFont("helvetica", "italic");
            doc.setTextColor(156, 163, 175);
            doc.text(subtitle, 187, yPos + 1.5, { align: "right" });
        }

        yPos += 12;
    };

    refreshHeader();

    // Document Title
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(17, 24, 39);
    doc.text(data.title.toUpperCase(), margin, yPos);

    yPos += 15;

    /* ARTICLE 1: THE PARTIES */
    drawSectionHeader("ARTICLE 1: THE PARTIES");
    const sectionStartY = yPos;
    const colWidth = 75;
    const leftColX = margin;
    const rightColX = 110;

    // Left Column: Service Provider
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(156, 163, 175);
    doc.text("SERVICE PROVIDER", leftColX, yPos);

    yPos += 5;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(data.businessDetails?.name || "Independent Contractor", leftColX, yPos);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    if (data.businessDetails?.address) {
        yPos += 5;
        const addr = doc.splitTextToSize(data.businessDetails.address, colWidth);
        doc.text(addr, leftColX, yPos);
        yPos += (addr.length * 4);
    }
    if (data.businessDetails?.taxId) {
        yPos += 5;
        doc.text(`Tax ID: ${data.businessDetails.taxId}`, leftColX, yPos);
    }
    const leftColEndY = yPos;

    // Right Column: Client
    yPos = sectionStartY;
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(156, 163, 175);
    doc.text("CLIENT / BUYER", rightColX, yPos);

    yPos += 5;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(data.clientName, rightColX, yPos);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    yPos += 5;
    doc.text(data.clientEmail, rightColX, yPos);
    if (data.clientAddress) {
        yPos += 5;
        const cAddr = doc.splitTextToSize(data.clientAddress, colWidth);
        doc.text(cAddr, rightColX, yPos);
        yPos += (cAddr.length * 4);
    }

    yPos = Math.max(leftColEndY, yPos) + 15;

    /* ARTICLE 2: SCOPE */
    drawSectionHeader("ARTICLE 2: SCOPE OF SERVICES", `Project start: ${format(data.startDate, "PPP")}`);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);
    const scopeLines = doc.splitTextToSize(data.scope, contentWidth);
    doc.text(scopeLines, margin, yPos);
    yPos += (scopeLines.length * 6) + 15;

    /* ARTICLE 3: COMPENSATION */
    drawSectionHeader("ARTICLE 3: COMPENSATION");
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(margin, yPos - 5, contentWidth, 20, 2, 2, "F");
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Total Project Value:", margin + 5, yPos + 7);
    doc.setFontSize(14);
    doc.setTextColor(79, 70, 229);
    doc.text(`${data.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${data.currency}`, 185, yPos + 8, { align: "right" });
    yPos += 25;

    /* ARTICLE 4: TERMS */
    drawSectionHeader("ARTICLE 4: TERMS & CONDITIONS");
    const standardClauses = [
        { title: "Intellectual Property", text: "All work product created under this agreement shall be the property of the Client upon full payment of the consideration described in Article 3." },
        { title: "Confidentiality", text: "Both parties agree to maintain strict confidentiality regarding proprietary information shared. This obligation survives termination." },
        { title: "Indemnification", text: "Provider shall indemnify Client against third-party claims arising from a breach of warranties or intellectual property infringement." },
        { title: "Termination", text: "Either party may terminate this agreement with 14 days written notice. Payment for work delivered up to termination remains due." },
        { title: "Governing Law", text: "This agreement shall be governed by laws of the Provider's registered jurisdiction. Both parties submit to local court authority." }
    ];
    const allClauses = [
        ...data.clauses.map(c => ({ title: "Custom Provision", text: c })),
        ...standardClauses
    ];
    allClauses.forEach((item, idx) => {
        checkPageBreak(25);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(31, 41, 55);
        doc.text(`${idx + 1}. ${item.title}`, margin, yPos);
        yPos += 5;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(75, 85, 99);
        const clauseText = doc.splitTextToSize(item.text, contentWidth);
        doc.text(clauseText, margin, yPos);
        yPos += (clauseText.length * 5) + 6;
    });

    /* ARTICLE 5: SIGNATURES */
    checkPageBreak(60);
    drawSectionHeader("ARTICLE 5: SIGNATURES");
    yPos += 10;
    doc.setDrawColor(209, 213, 219);

    // Provider Side
    doc.line(margin, yPos + 15, margin + 75, yPos + 15);
    doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text("SIGNATURE (PROVIDER)", margin, yPos + 20);
    doc.setFont("helvetica", "normal");
    doc.text("Printed Name: ________________________", margin, yPos + 25);
    doc.text("Title: ________________________", margin, yPos + 30);
    doc.text("Date: ________________________", margin, yPos + 35);

    // Client Side
    doc.line(110, yPos + 15, 185, yPos + 15);
    doc.setFontSize(8); doc.setFont("helvetica", "bold");
    doc.text("SIGNATURE (CLIENT)", 110, yPos + 20);
    doc.setFont("helvetica", "normal");
    doc.text("Printed Name: ________________________", 110, yPos + 25);
    doc.text("Title: ________________________", 110, yPos + 30);
    doc.text("Date: ________________________", 110, yPos + 35);

    addDocumentFooter(doc, pageNumber);
    doc.save(`Contract_${data.title.replace(/\s+/g, "_")}.pdf`);
};

/* -------------------------------- */
/* Invoice Generation */
/* -------------------------------- */

export const generateInvoicePDF = (data: InvoiceData) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = 170;

    let yPos = 55;
    let pageNumber = 1;

    const refreshHeader = () => {
        addDocumentHeader(doc, "Invoice", "Professional Billing Statement", data.invoiceNumber);
    };

    const checkPageBreak = (space: number) => {
        if (yPos + space > 270) {
            addDocumentFooter(doc, pageNumber);
            doc.addPage();
            pageNumber++;
            refreshHeader();
            yPos = 55;
        }
    };

    refreshHeader();

    /* BILLING INFO CARD */
    doc.setFillColor(243, 244, 252);
    doc.roundedRect(margin, yPos, contentWidth, 35, 2, 2, "F");

    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(156, 163, 175);
    doc.text("BILL TO:", margin + 5, yPos + 8);
    doc.text("FROM:", 115, yPos + 8);

    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.text(data.clientName, margin + 5, yPos + 14);
    doc.text(data.businessDetails?.name || "Service Provider", 115, yPos + 14);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(75, 85, 99);
    if (data.clientAddress) {
        const lines = doc.splitTextToSize(data.clientAddress, 80);
        doc.text(lines, margin + 5, yPos + 19);
    }
    if (data.businessDetails?.address) {
        const lines = doc.splitTextToSize(data.businessDetails.address, 80);
        doc.text(lines, 115, yPos + 19);
    }

    yPos += 45;

    /* INVOICE DETAILS */
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(107, 114, 128);
    doc.text("INVOICE DATE", margin, yPos);
    doc.text("DUE DATE", 70, yPos);
    doc.text("TAX ID", 130, yPos);

    yPos += 6;
    doc.setFontSize(10);
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    doc.text(format(data.issuedAt, "MMM dd, yyyy"), margin, yPos);
    doc.text(format(data.dueDate, "MMM dd, yyyy"), 70, yPos);
    doc.text(data.businessDetails?.taxId || "N/A", 130, yPos);

    yPos += 15;

    /* ITEMS TABLE */
    doc.setFillColor(79, 70, 229);
    doc.rect(margin, yPos, contentWidth, 10, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text("Description", margin + 3, yPos + 7);
    doc.text("Qty", margin + 100, yPos + 7, { align: "right" });
    doc.text("Rate", margin + 130, yPos + 7, { align: "right" });
    doc.text("Amount", margin + 167, yPos + 7, { align: "right" });

    yPos += 12;
    doc.setTextColor(31, 41, 55);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);

    data.items.forEach((item, idx) => {
        checkPageBreak(15);
        if (idx % 2 === 0) {
            doc.setFillColor(249, 250, 251);
            doc.rect(margin, yPos - 5, contentWidth, 10, "F");
        }
        const lines = doc.splitTextToSize(item.description, 90);
        doc.text(lines, margin + 3, yPos);
        doc.text(item.quantity.toString(), margin + 100, yPos, { align: "right" });
        doc.text(item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 }), margin + 130, yPos, { align: "right" });
        doc.text(item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 }), margin + 167, yPos, { align: "right" });
        yPos += (lines.length * 5) + 5;
    });

    /* TOTAL BOX */
    checkPageBreak(40);
    yPos += 10;
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(0.5);
    doc.line(125, yPos, 185, yPos);
    yPos += 8;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PAYMENT DUE", 125, yPos);
    doc.setFontSize(16);
    doc.setTextColor(79, 70, 229);
    doc.text(`${data.total.toLocaleString(undefined, { minimumFractionDigits: 2 })} ${data.currency}`, 185, yPos, { align: "right" });

    yPos += 20;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(107, 114, 128);
    doc.text("Please complete payment within 14 days of receipt via bank transfer or online portal.", margin, yPos);
    doc.text("Thank you for your business!", margin, yPos + 5);

    addDocumentFooter(doc, pageNumber);
    doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};
