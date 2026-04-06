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
    scope: string | any[];
    clauses: string[];
    businessDetails?: {
        name?: string;
        businessName?: string;
        title?: string;
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
/* Shared Helpers                   */
/* -------------------------------- */

// Color palette
const INK: [number, number, number] = [15, 12, 9];
const SLATE: [number, number, number] = [45, 42, 55];
const MIST: [number, number, number] = [120, 115, 130];
const FOG: [number, number, number] = [200, 196, 206];
const PAPER: [number, number, number] = [250, 248, 245];
const CREAM: [number, number, number] = [238, 234, 226];
const ACCENT: [number, number, number] = [220, 90, 60];  // terracotta
const SAGE: [number, number, number] = [60, 130, 110];  // sage green
const INDIGO: [number, number, number] = [75, 65, 180];
const GOLD: [number, number, number] = [190, 155, 85];

const fmtNum = (n: number) =>
    n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const addDocumentHeader = (
    doc: jsPDF,
    type: string,
    ref?: string,
    sub?: string
) => {
    const W = 210;
    const margin = 20;

    // Deep ink header band
    doc.setFillColor(...INK);
    doc.rect(0, 0, W, 46, "F");

    // Subtle horizontal rules for texture
    doc.setDrawColor(28, 25, 32);
    doc.setLineWidth(0.25);
    for (let i = 1; i <= 5; i++) doc.line(0, i * 8, W, i * 8);

    // Brand circle mark
    doc.setFillColor(...ACCENT);
    const circleX = margin + 10;
    const circleY = 23;
    doc.circle(circleX, circleY, 10, "F");
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    // Centering "F" both horizontally and vertically
    doc.text("F", circleX, circleY + 3.5, { align: "center" });

    // Company name & tagline
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("FreelanceOS", margin + 24, 21);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...FOG);
    doc.text("PROFESSIONAL DOCUMENT SERVICES", margin + 24, 28);

    // Document type badge (right side)
    const typeLabel = type.toUpperCase();
    doc.setFontSize(8);
    const textWidth = doc.getTextWidth(typeLabel);
    const badgeW = textWidth + 12;
    const badgeX = W - margin - badgeW;
    const badgeY = 16; // Lifted slightly
    const badgeH = 10;
    
    doc.setFillColor(...ACCENT);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    // Centering text in the badge
    doc.text(typeLabel, badgeX + badgeW / 2, badgeY + 6.5, { align: "center" });

    // Ref & date
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...FOG);
    if (ref) doc.text(`REF: ${ref}`, W - margin, 31, { align: "right" });
    doc.text(`ISSUED: ${format(new Date(), "PP")}`, W - margin, 38, { align: "right" });

    // Bottom accent stripe
    doc.setFillColor(...ACCENT);
    doc.rect(0, 46, W, 1.5, "F");
};

const addDocumentFooter = (doc: jsPDF, page: number) => {
    const margin = 20;
    const W = 210;
    doc.setFillColor(...INK);
    doc.rect(0, 278, W, 20, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...FOG);
    doc.text("FreelanceOS · Professional Document Services · Confidential", margin, 289);
    doc.setTextColor(...ACCENT);
    doc.text(`Page ${page}`, W - margin, 289, { align: "right" });
};

const drawSectionBar = (
    doc: jsPDF,
    yPos: number,
    label: string,
    margin = 20,
    contentWidth = 170
): number => {
    doc.setFillColor(...CREAM);
    doc.rect(margin, yPos - 1, contentWidth, 9, "F");
    doc.setFillColor(...ACCENT);
    doc.rect(margin, yPos - 1, 3, 9, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...ACCENT);
    doc.text(label.toUpperCase(), margin + 7, yPos + 5);
    return yPos + 14;
};

/* -------------------------------- */
/* Contract Generation              */
/* -------------------------------- */

export const generateContractPDF = (data: ContractData) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = 170;

    let yPos = 56;
    let pageNumber = 1;
    const ref = `CTR-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    const refreshHeader = () => {
        addDocumentHeader(doc, "Contract", ref, "Legal & Binding Service Agreement");
    };

    const checkPageBreak = (space: number) => {
        if (yPos + space > 268) {
            addDocumentFooter(doc, pageNumber);
            doc.addPage();
            pageNumber++;
            refreshHeader();
            yPos = 56;
        }
    };

    refreshHeader();

    // ── Document title ──────────────────────────────────────────────────────
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(data.title.toUpperCase(), margin, yPos);
    yPos += 3;
    doc.setFillColor(...ACCENT);
    doc.rect(margin, yPos, 36, 1.5, "F");
    yPos += 12;

    // ── ARTICLE 1: THE PARTIES ───────────────────────────────────────────────
    yPos = drawSectionBar(doc, yPos, "Article I · The Parties");

    const cardH = 40;
    const colWidth = 80;

    // Provider card
    doc.setFillColor(...PAPER);
    doc.roundedRect(margin, yPos, colWidth, cardH, 2, 2, "F");
    doc.setDrawColor(...CREAM);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, yPos, colWidth, cardH, 2, 2);
    // Colored cap
    doc.setFillColor(...SAGE);
    doc.roundedRect(margin, yPos, colWidth, 7, 2, 2, "F");
    doc.rect(margin, yPos + 3.5, colWidth, 3.5, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("SERVICE PROVIDER", margin + 4, yPos + 5.2);

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(data.businessDetails?.name || "Independent Contractor", margin + 4, yPos + 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MIST);
    if (data.businessDetails?.email) {
        doc.text(data.businessDetails.email, margin + 4, yPos + 20);
    }
    if (data.businessDetails?.address) {
        const addrLines = doc.splitTextToSize(data.businessDetails.address, colWidth - 8);
        doc.text(addrLines, margin + 4, yPos + 27);
    }
    if (data.businessDetails?.taxId) {
        doc.text(`Tax ID: ${data.businessDetails.taxId}`, margin + 4, yPos + 36);
    }

    // Client card
    const rightX = margin + colWidth + 10;
    doc.setFillColor(...PAPER);
    doc.roundedRect(rightX, yPos, colWidth, cardH, 2, 2, "F");
    doc.setDrawColor(...CREAM);
    doc.roundedRect(rightX, yPos, colWidth, cardH, 2, 2);
    doc.setFillColor(...INDIGO);
    doc.roundedRect(rightX, yPos, colWidth, 7, 2, 2, "F");
    doc.rect(rightX, yPos + 3.5, colWidth, 3.5, "F");
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("CLIENT / BUYER", rightX + 4, yPos + 5.2);

    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(data.clientName, rightX + 4, yPos + 14);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MIST);
    doc.text(data.clientEmail, rightX + 4, yPos + 20);
    if (data.clientAddress) {
        const cAddrLines = doc.splitTextToSize(data.clientAddress, colWidth - 8);
        doc.text(cAddrLines, rightX + 4, yPos + 27);
    }

    yPos += cardH + 14;

    // ── ARTICLE 2: SCOPE ─────────────────────────────────────────────────────
    checkPageBreak(30);
    yPos = drawSectionBar(doc, yPos, `Article II · Scope of Services  ·  Start: ${format(data.startDate, "PPP")}`);

    let scopeData = data.scope;
    if (typeof scopeData === 'string' && (scopeData.trim().startsWith('[') || scopeData.trim().startsWith('{'))) {
        try {
            scopeData = JSON.parse(scopeData);
        } catch (e) {
            // Keep as string
        }
    }

    if (Array.isArray(scopeData)) {
        scopeData.forEach((section: any) => {
            checkPageBreak(15);
            if (section.title) {
                doc.setFontSize(9.5);
                doc.setFont("helvetica", "bold");
                doc.setTextColor(...INK);
                const titleLines = doc.splitTextToSize(section.title.toUpperCase(), contentWidth);
                doc.text(titleLines, margin, yPos);
                yPos += titleLines.length * 5.5 + 2;
            }

            if (Array.isArray(section.items)) {
                section.items.forEach((item: string) => {
                    doc.setFontSize(9);
                    doc.setFont("helvetica", "normal");
                    doc.setTextColor(...SLATE);
                    const itemLines = doc.splitTextToSize(item, contentWidth - 8);
                    const itemH = itemLines.length * 4.8;
                    checkPageBreak(itemH + 3);

                    doc.text("•", margin + 3, yPos);
                    doc.text(itemLines, margin + 8, yPos);
                    yPos += itemH + 3;
                });
            }
            yPos += 5; // spacing between sections
        });
        yPos += 4;
    } else {
        doc.setFontSize(9.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...SLATE);
        const scopeLines = doc.splitTextToSize(scopeData, contentWidth);
        const scopeH = scopeLines.length * 5.5;
        checkPageBreak(scopeH + 10);
        doc.text(scopeLines, margin, yPos);
        yPos += scopeH + 14;
    }

    // ── ARTICLE 3: COMPENSATION ───────────────────────────────────────────────
    checkPageBreak(30);
    yPos = drawSectionBar(doc, yPos, "Article III · Compensation");
    doc.setFillColor(...INK);
    doc.roundedRect(margin, yPos, contentWidth, 20, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...FOG);
    doc.text("TOTAL PROJECT VALUE", margin + 6, yPos + 8);
    doc.setFontSize(18);
    doc.setTextColor(...ACCENT);
    doc.text(
        `${data.currency} ${fmtNum(data.amount)}`,
        margin + contentWidth - 4,
        yPos + 13,
        { align: "right" }
    );
    yPos += 30;

    // ── ARTICLE 4: TERMS & CONDITIONS ─────────────────────────────────────────
    checkPageBreak(20);
    yPos = drawSectionBar(doc, yPos, "Article IV · Terms & Conditions");

    const standardClauses = [
        {
            title: "Intellectual Property",
            text: "All work product created under this agreement shall be the property of the Client upon full payment of the consideration described in Article 3."
        },
        {
            title: "Confidentiality",
            text: "Both parties agree to maintain strict confidentiality regarding proprietary information shared. This obligation survives termination."
        },
        {
            title: "Indemnification",
            text: "Provider shall indemnify Client against third-party claims arising from a breach of warranties or intellectual property infringement."
        },
        {
            title: "Termination",
            text: "Either party may terminate this agreement with 14 days written notice. Payment for work delivered up to termination remains due."
        },
        {
            title: "Governing Law",
            text: "This agreement shall be governed by laws of the Provider's registered jurisdiction. Both parties submit to local court authority."
        }
    ];
    const allClauses = [
        ...data.clauses.map(c => ({ title: "Custom Provision", text: c })),
        ...standardClauses
    ];

    allClauses.forEach((item, idx) => {
        const bodyLines = doc.splitTextToSize(item.text, contentWidth - 12);
        const rowH = bodyLines.length * 5 + 16;
        checkPageBreak(rowH);

        doc.setFillColor(...(idx % 2 === 0 ? PAPER : ([255, 255, 255] as [number, number, number])));
        doc.rect(margin, yPos - 3, contentWidth, rowH, "F");
        // Left accent rule
        doc.setFillColor(...ACCENT);
        doc.rect(margin, yPos - 3, 2.5, rowH, "F");

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...INK);
        doc.text(`${idx + 1}. ${item.title}`, margin + 7, yPos + 5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...MIST);
        doc.text(bodyLines, margin + 7, yPos + 11);
        yPos += rowH + 2;
    });

    // ── ARTICLE 5: SIGNATURES ─────────────────────────────────────────────────
    checkPageBreak(65);
    yPos += 6;
    yPos = drawSectionBar(doc, yPos, "Article V · Signatures");
    yPos += 10;

    const sigPairs: [string, number][] = [
        ["SERVICE PROVIDER", margin],
        ["CLIENT / BUYER", margin + colWidth + 10]
    ];

    sigPairs.forEach(([label, x]) => {
        doc.setDrawColor(...FOG);
        doc.setLineWidth(0.4);
        doc.line(x, yPos + 18, x + 75, yPos + 18);
        doc.setFontSize(7.5);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...MIST);
        doc.text(label, x, yPos + 23);
        doc.setFont("helvetica", "normal");

        let name = "_____________________________";
        let title = "_____________________________";
        let date = "_____________________________";

        if (label === "SERVICE PROVIDER" && data.businessDetails) {
            name = data.businessDetails.name || name;
            title = data.businessDetails.title || "Software Developer";
            date = format(new Date(), "PPP");
        }

        doc.text(`Name: ${name}`, x, yPos + 30);
        doc.text(`Title: ${title}`, x, yPos + 37);
        doc.text(`Date:  ${date}`, x, yPos + 44);
    });

    addDocumentFooter(doc, pageNumber);
    doc.save(`Contract_${data.title.replace(/\s+/g, "_")}.pdf`);
};

/* -------------------------------- */
/* Invoice Generation               */
/* -------------------------------- */

export const generateInvoicePDF = (data: InvoiceData) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageWidth = 210;
    const contentWidth = 170;

    let yPos = 56;
    let pageNumber = 1;

    const refreshHeader = () => {
        addDocumentHeader(doc, "Invoice", data.invoiceNumber, "Professional Billing Statement");
    };

    const checkPageBreak = (space: number) => {
        if (yPos + space > 268) {
            addDocumentFooter(doc, pageNumber);
            doc.addPage();
            pageNumber++;
            refreshHeader();
            yPos = 56;
        }
    };

    refreshHeader();

    // ── Billing info card ─────────────────────────────────────────────────────
    doc.setFillColor(...PAPER);
    doc.roundedRect(margin, yPos, contentWidth, 34, 2, 2, "F");
    doc.setDrawColor(...CREAM);
    doc.setLineWidth(0.4);
    doc.roundedRect(margin, yPos, contentWidth, 34, 2, 2);

    // Vertical divider
    doc.setDrawColor(...CREAM);
    doc.line(margin + 90, yPos + 6, margin + 90, yPos + 30);

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...MIST);
    doc.text("BILL TO", margin + 5, yPos + 8);
    doc.text("FROM", margin + 95, yPos + 8);

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...INK);
    doc.text(data.clientName, margin + 5, yPos + 15);
    doc.text(data.businessDetails?.name || "Service Provider", margin + 95, yPos + 15);

    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...MIST);
    if (data.clientAddress) {
        const lines = doc.splitTextToSize(data.clientAddress, 82);
        doc.text(lines, margin + 5, yPos + 21);
    }
    if (data.businessDetails?.address) {
        const lines = doc.splitTextToSize(data.businessDetails.address, 72);
        doc.text(lines, margin + 95, yPos + 21);
    }

    yPos += 42;

    // ── Invoice meta strip ────────────────────────────────────────────────────
    const metaLabels: [string, number, string][] = [
        ["INVOICE DATE", margin, format(data.issuedAt, "MMM dd, yyyy")],
        ["DUE DATE", margin + 60, format(data.dueDate, "MMM dd, yyyy")],
        ["TAX ID", margin + 120, data.businessDetails?.taxId || "N/A"]
    ];

    metaLabels.forEach(([label, x, value]) => {
        doc.setFontSize(7);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...MIST);
        doc.text(label, x, yPos);
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...INK);
        doc.text(value, x, yPos + 6);
    });
    yPos += 18;

    // ── Line-items table ──────────────────────────────────────────────────────
    // Table header
    doc.setFillColor(...INK);
    doc.rect(margin, yPos, contentWidth, 10, "F");
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Description", margin + 4, yPos + 7);
    doc.text("Qty", margin + 102, yPos + 7, { align: "right" });
    doc.text("Rate", margin + 132, yPos + 7, { align: "right" });
    doc.text("Amount", margin + 168, yPos + 7, { align: "right" });
    yPos += 12;

    // Rows
    data.items.forEach((item, idx) => {
        const lines = doc.splitTextToSize(item.description, 90);
        const rowH = lines.length * 5.5 + 7;
        checkPageBreak(rowH);

        if (idx % 2 === 0) {
            doc.setFillColor(...PAPER);
            doc.rect(margin, yPos - 4, contentWidth, rowH, "F");
        }

        doc.setFontSize(8.5);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...SLATE);
        doc.text(lines, margin + 4, yPos);

        doc.setTextColor(...INK);
        doc.text(item.quantity.toString(), margin + 102, yPos, { align: "right" });
        doc.text(fmtNum(item.rate), margin + 132, yPos, { align: "right" });
        doc.setFont("helvetica", "bold");
        doc.text(fmtNum(item.amount), margin + 168, yPos, { align: "right" });

        yPos += rowH;
    });

    // ── Total block ───────────────────────────────────────────────────────────
    checkPageBreak(36);
    yPos += 8;

    doc.setFillColor(...INK);
    doc.roundedRect(margin + 95, yPos, 75, 22, 2, 2, "F");
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...FOG);
    doc.text("TOTAL DUE", margin + 95 + 75 - 4, yPos + 8, { align: "right" });
    doc.setFontSize(16);
    doc.setTextColor(...ACCENT);
    doc.text(
        `${data.currency} ${fmtNum(data.total)}`,
        margin + 95 + 75 - 4,
        yPos + 17,
        { align: "right" }
    );

    yPos += 32;

    // ── Payment note ──────────────────────────────────────────────────────────
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(...MIST);
    doc.text(
        "Please complete payment within 14 days of receipt via bank transfer or online portal.",
        margin,
        yPos
    );
    doc.text("Thank you for your business!", margin, yPos + 6);

    addDocumentFooter(doc, pageNumber);
    doc.save(`Invoice_${data.invoiceNumber}.pdf`);
};