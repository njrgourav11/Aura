import jsPDF from "jspdf";

interface InvoiceData {
    id: string;
    clientName: string;
    clientEmail: string;
    clientAddress?: string;
    items: Array<{ description: string; quantity: number; rate: number; amount: number }>;
    subtotal: number;
    taxAmount: number;
    total: number;
    currency: string;
    issuedAt: string;
    dueDate: string;
}

export function generateInvoicePDF(data: InvoiceData) {
    // Create a new PDF document
    const doc = new jsPDF();

    // Colors
    const primaryColor = "#4f46e5"; // indigo-600
    const textColor = "#1e293b"; // slate-800
    const lightTextColor = "#64748b"; // slate-500

    // Helper for currency formatting
    const formatCurrency = (amount: number) => {
        return amount.toLocaleString(undefined, { style: 'currency', currency: data.currency });
    }

    // Header Banner
    doc.setFillColor(primaryColor);
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor("#ffffff");
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 140, 25);

    // Company Info (Yours)
    doc.setFontSize(16);
    doc.text("Aura Freelance", 15, 20);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("hello@aura.inc", 15, 27);
    doc.text("123 Business Rd, Valley, CA", 15, 32);

    // Invoice Details
    doc.setTextColor(textColor);
    doc.setFontSize(10);
    doc.text(`Invoice Number:`, 140, 55);
    doc.text(`Issued Date:`, 140, 62);
    doc.text(`Due Date:`, 140, 69);

    doc.setFont("helvetica", "bold");
    doc.text(data.id, 175, 55);
    doc.text(data.issuedAt, 175, 62);
    doc.text(data.dueDate, 175, 69);

    // Client Details
    doc.setFont("helvetica", "normal");
    doc.setTextColor(lightTextColor);
    doc.text("Bill To:", 15, 55);

    doc.setTextColor(textColor);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text(data.clientName, 15, 62);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(data.clientEmail, 15, 68);
    if (data.clientAddress) {
        doc.text(data.clientAddress, 15, 74);
    }

    // Table Header
    const startY = 90;
    doc.setFillColor("#f1f5f9"); // slate-100
    doc.rect(15, startY, 180, 10, 'F');

    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, startY + 7);
    doc.text("Qty", 120, startY + 7);
    doc.text("Rate", 140, startY + 7);
    doc.text("Amount", 175, startY + 7);

    // Table Items
    doc.setFont("helvetica", "normal");
    let currentY = startY + 18;

    data.items.forEach((item) => {
        doc.text(item.description, 20, currentY);
        doc.text(item.quantity.toString(), 120, currentY);
        doc.text(formatCurrency(item.rate), 140, currentY);
        doc.text(formatCurrency(item.amount), 175, currentY);
        currentY += 10;
    });

    // Divider
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.line(15, currentY, 195, currentY);
    currentY += 10;

    // Totals Area
    doc.text("Subtotal:", 140, currentY);
    doc.text(formatCurrency(data.subtotal), 175, currentY);
    currentY += 8;

    doc.text(`Tax:`, 140, currentY);
    doc.text(formatCurrency(data.taxAmount), 175, currentY);
    currentY += 10;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Total:", 140, currentY);
    doc.setTextColor(primaryColor);
    doc.text(formatCurrency(data.total), 175, currentY);

    // Footer / Payment terms
    doc.setTextColor(lightTextColor);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Payment Terms: Please pay within 14 days of receiving this invoice.", 15, 270);
    doc.text("Thank you for your business!", 15, 275);

    // Save PDF
    doc.save(`${data.id}_Invoice.pdf`);
}
