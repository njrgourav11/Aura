import jsPDF from "jspdf";

interface ContractData {
    title: string;
    clientName: string;
    clientCompany?: string;
    startDate: string;
    endDate?: string;
    amount: number;
    currency: string;
    scope: string;
    paymentTerms: string;
    clauses: string[];
}

export function generateContractPDF(data: ContractData) {
    const doc = new jsPDF();

    const width = doc.internal.pageSize.getWidth();
    let currentY = 20;

    const addText = (text: string, size: number, style: "normal" | "bold", yOffset: number, align: 'left' | 'center' = 'left') => {
        doc.setFont("helvetica", style);
        doc.setFontSize(size);
        if (align === 'center') {
            doc.text(text, width / 2, currentY, { align: 'center' });
        } else {
            // Basic text wrapping
            const lines = doc.splitTextToSize(text, width - 30);
            doc.text(lines, 15, currentY);
            yOffset += (lines.length - 1) * (size * 0.4); // rough estimate for multiline height
        }
        currentY += yOffset;
    };

    // Header
    addText("INDEPENDENT CONTRACTOR AGREEMENT", 16, "bold", 15, 'center');

    // Parties
    addText("This Agreement is entered into on this day by and between:", 10, "normal", 10);

    const clientText = data.clientCompany ? `${data.clientName} (${data.clientCompany})` : data.clientName;
    addText(`Client: ${clientText}`, 11, "bold", 8);
    addText("AND", 10, "normal", 8);
    addText(`Contractor: Aura Freelance`, 11, "bold", 15);

    // Project Title
    addText("1. PROJECT DETAILS", 12, "bold", 8);
    addText(`Title: ${data.title}`, 10, "normal", 10);

    // Scope of Work
    addText("2. SERVICES PROVIDED", 12, "bold", 8);
    addText(data.scope, 10, "normal", 15);

    // Term
    addText("3. TERM", 12, "bold", 8);
    let termText = `The term of this Agreement shall commence on ${data.startDate}`;
    if (data.endDate) {
        termText += ` and shall terminate on ${data.endDate}.`;
    } else {
        termText += ` and shall continue until the Services are completed.`;
    }
    addText(termText, 10, "normal", 15);

    // Payment
    addText("4. COMPENSATION", 12, "bold", 8);
    const formattedAmount = data.amount.toLocaleString(undefined, { style: 'currency', currency: data.currency });
    addText(`Total Compensation: ${formattedAmount}`, 10, "normal", 8);
    addText(`Terms: ${data.paymentTerms}`, 10, "normal", 15);

    // Additional Clauses
    if (data.clauses && data.clauses.length > 0) {
        addText("5. ADDITIONAL TERMS", 12, "bold", 8);
        data.clauses.forEach((clause, index) => {
            addText(`${index + 1}. ${clause}`, 10, "normal", 8);
        });
        currentY += 10;
    }

    // Signatures
    // Ensure signature block isn't split across pages
    if (currentY > 240) {
        doc.addPage();
        currentY = 20;
    }

    addText("SIGNATURES", 12, "bold", 20);

    doc.line(15, currentY, 80, currentY); // Client line
    doc.line(110, currentY, 175, currentY); // Contractor line
    currentY += 5;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Client Signature", 15, currentY);
    doc.text("Date", 65, currentY);

    doc.text("Contractor Signature", 110, currentY);
    doc.text("Date", 160, currentY);

    doc.save(`${data.title.replace(/\s+/g, '_')}_Contract.pdf`);
}
