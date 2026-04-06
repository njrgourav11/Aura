import jsPDF from "jspdf";

interface ScopeSection {
    title: string;
    items: string[];
}

interface ContractData {
    title: string;
    clientName: string;
    clientCompany?: string;
    clientAddress?: string;
    startDate: Date;
    endDate?: Date;
    amount: number;
    currency: string;
    scope: string | ScopeSection[];
    paymentTerms: string;
    clauses: string[];
    businessDetails?: {
        name?: string;
        address?: string;
        email?: string;
        phone?: string;
        taxId?: string;
    };
}

export function generateContractPDF(data: ContractData) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let currentY = 25;

    const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin) {
            doc.addPage();
            currentY = margin + 10;
            return true;
        }
        return false;
    };

    const addHeading = (text: string, size = 14) => {
        checkPageBreak(15);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(size);
        doc.text(text, margin, currentY);
        currentY += 10;
    };

    const addParagraph = (text: string, size = 10, style: "normal" | "bold" = "normal") => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, contentWidth);
        const height = lines.length * (size * 0.5);
        checkPageBreak(height + 5);
        doc.text(lines, margin, currentY);
        currentY += height + 5;
    };

    const addListItem = (text: string, size = 10) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(size);
        const bullet = "• ";
        const bulletWidth = doc.getTextWidth(bullet);
        const lines = doc.splitTextToSize(text, contentWidth - bulletWidth - 5);
        const height = lines.length * (size * 0.5);
        checkPageBreak(height + 3);
        doc.text(bullet, margin + 5, currentY);
        doc.text(lines, margin + 5 + bulletWidth, currentY);
        currentY += height + 3;
    };

    // --- Header ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("INDEPENDENT CONTRACTOR AGREEMENT", pageWidth / 2, currentY, { align: "center" });
    currentY += 20;

    // --- Parties ---
    addHeading("PARTIES", 12);
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    addParagraph(`This Independent Contractor Agreement ("Agreement") is made as of ${dateStr}, by and between:`);

    const clientInfo = [
        data.clientName,
        data.clientCompany,
        data.clientAddress
    ].filter(Boolean).join(", ");
    addParagraph(`CLIENT: ${clientInfo}`, 10, "bold");

    const businessInfo = [
        data.businessDetails?.name || "FreelanceOS",
        data.businessDetails?.address
    ].filter(Boolean).join(", ");
    addParagraph(`CONTRACTOR: ${businessInfo}`, 10, "bold");

    // --- Services ---
    addHeading("1. SERVICES PROVIDED", 12);
    
    let scopeData = data.scope;
    if (typeof scopeData === 'string' && (scopeData.trim().startsWith('[') || scopeData.trim().startsWith('{'))) {
        try {
            scopeData = JSON.parse(scopeData);
        } catch (e) {
            // Keep as string if parsing fails
        }
    }

    if (typeof scopeData === 'string') {
        // Handle legacy string scope or simple text
        const sections = scopeData.split('\n\n');
        sections.forEach(section => {
            const lines = section.split('\n');
            lines.forEach((line, idx) => {
                const cleanLine = line.trim();
                if (cleanLine.startsWith('-') || cleanLine.startsWith('•')) {
                    addListItem(cleanLine.substring(1).trim());
                } else {
                    addParagraph(cleanLine, 10, idx === 0 && lines.length > 1 ? "bold" : "normal");
                }
            });
        });
    } else if (Array.isArray(scopeData)) {
        // Handle structured JSON scope
        scopeData.forEach((section: any) => {
            if (section.title) {
                addParagraph(section.title, 11, "bold");
                currentY -= 2; // tight spacing after sub-heading
            }
            if (Array.isArray(section.items)) {
                section.items.forEach((item: string) => {
                    addListItem(item);
                });
            }
            currentY += 5; // space between sections
        });
    }

    // --- Term ---
    addHeading("2. TERM", 12);
    const startStr = data.startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let termText = `The term of this Agreement shall commence on ${startStr}`;
    if (data.endDate) {
        const endStr = data.endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        termText += ` and shall continue until ${endStr}, unless terminated earlier as provided herein.`;
    } else {
        termText += ` and shall continue until the services are completed to the Client's reasonable satisfaction.`;
    }
    addParagraph(termText);

    // --- Compensation ---
    addHeading("3. COMPENSATION", 12);
    const amountStr = data.amount.toLocaleString('en-US', { style: 'currency', currency: data.currency });
    addParagraph(`Total Amount: ${amountStr}`, 10, "bold");
    addParagraph(`Payment Terms: ${data.paymentTerms}`);

    // --- Clauses ---
    if (data.clauses && data.clauses.length > 0) {
        addHeading("4. GENERAL TERMS", 12);
        data.clauses.forEach((clause, idx) => {
            addParagraph(`${idx + 1}. ${clause}`);
        });
    }

    // --- Signatures ---
    checkPageBreak(60);
    currentY += 10;
    addHeading("SIGNATURES", 12);
    currentY += 10;

    const signatureWidth = 70;
    const col2X = pageWidth - margin - signatureWidth;

    // Client Signature Line
    doc.line(margin, currentY, margin + signatureWidth, currentY);
    doc.text("Client Signature", margin, currentY + 5);
    doc.text("Date", margin + signatureWidth - 10, currentY + 5);

    // Contractor Signature Line
    doc.line(col2X, currentY, col2X + signatureWidth, currentY);
    doc.text("Contractor Signature", col2X, currentY + 5);
    doc.text("Date", col2X + signatureWidth - 10, currentY + 5);

    doc.save(`${data.title.replace(/\s+/g, '_')}_Contract.pdf`);
}

