import jsPDF from "jspdf";
import { format } from "date-fns";

export const generateAnalysisPDF = async (project: any) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // --- Modern Premium Header ---
    doc.setFillColor(15, 23, 42); // slate-900 background for top
    doc.rect(0, 0, pageWidth, 40, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor("#ffffff");
    doc.text("FreelanceOS", margin, 25);

    doc.setFontSize(10);
    doc.setTextColor("#94a3b8"); // slate-400
    doc.text("PROJECT CANVAS", pageWidth - margin, 25, { align: "right" });

    // --- Project Meta Section ---
    let currentY = 55;

    // Title & Client boxes side by side
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(248, 250, 252); // slate-50
    doc.roundedRect(margin, currentY, (pageWidth - margin * 2) / 2 - 5, 25, 3, 3, "FD");
    doc.roundedRect(margin + (pageWidth - margin * 2) / 2 + 5, currentY, (pageWidth - margin * 2) / 2 - 5, 25, 3, 3, "FD");

    // Project Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor("#64748b");
    doc.text("PROJECT INFO", margin + 5, currentY + 8);

    doc.setFontSize(11);
    doc.setTextColor("#0f172a");
    const titleText = doc.splitTextToSize(project.title || "Untiled Project", (pageWidth - margin * 2) / 2 - 15);
    doc.text(titleText[0] + (titleText.length > 1 ? "..." : ""), margin + 5, currentY + 16);

    // Client Info
    const startRightBox = margin + (pageWidth - margin * 2) / 2 + 5;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor("#64748b");
    doc.text("CLIENT INFO", startRightBox + 5, currentY + 8);

    doc.setFontSize(11);
    doc.setTextColor("#0f172a");

    let clientString = project.clientId?.name || "No Client Assigned";
    if (project.clientId?.company) clientString += ` - ${project.clientId.company}`;
    const clientText = doc.splitTextToSize(clientString, (pageWidth - margin * 2) / 2 - 15);
    doc.text(clientText[0] + (clientText.length > 1 ? "..." : ""), startRightBox + 5, currentY + 16);

    currentY += 35;

    // Date & Status
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor("#64748b");
    doc.text(`Generated: ${format(new Date(), "MMM dd, yyyy")}`, margin, currentY);
    doc.text(`Status: ${project.status || "Planning"}`, pageWidth - margin, currentY, { align: "right" });

    currentY += 10;

    // Divider
    doc.setLineWidth(0.5);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, currentY, pageWidth - margin, currentY);

    currentY += 15;

    // --- Analysis Content (Markdown Parser) ---
    const analysisText = project.analysis || "No analysis provided for this project.";
    const lines = analysisText.split('\n');

    const checkPageBreak = (neededHeight: number) => {
        if (currentY + neededHeight > pageHeight - margin - 15) {
            doc.addPage();
            currentY = margin + 10;
            return true;
        }
        return false;
    };

    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];

        // Code block toggle
        if (line.startsWith('```')) {
            inCodeBlock = !inCodeBlock;
            if (inCodeBlock) {
                checkPageBreak(8);
                currentY += 2;
            } else {
                currentY += 2;
            }
            continue;
        }

        if (inCodeBlock) {
            checkPageBreak(5);
            doc.setFont("courier", "normal");
            doc.setFontSize(9);
            doc.setTextColor("#475569");
            doc.text(line, margin + 5, currentY);
            currentY += 5;
            continue;
        }

        // Clean bold/italic asterisks for simple jsPDF drawing
        const cleanLine = line
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/`(.*?)`/g, '$1');

        if (cleanLine.trim() === '') {
            currentY += 4; // empty line spacing
            continue;
        }

        if (cleanLine.startsWith('# ')) {
            currentY += 4;
            checkPageBreak(12);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(16);
            doc.setTextColor("#0f172a");
            doc.text(cleanLine.substring(2).trim(), margin, currentY);
            currentY += 8;
        }
        else if (cleanLine.startsWith('## ')) {
            currentY += 3;
            checkPageBreak(10);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(14);
            doc.setTextColor("#1e293b");
            doc.text(cleanLine.substring(3).trim(), margin, currentY);
            currentY += 7;
        }
        else if (cleanLine.startsWith('### ')) {
            currentY += 2;
            checkPageBreak(8);
            doc.setFont("helvetica", "bold");
            doc.setFontSize(12);
            doc.setTextColor("#334155");
            doc.text(cleanLine.substring(4).trim(), margin, currentY);
            currentY += 6;
        }
        else if (cleanLine.startsWith('- ') || cleanLine.startsWith('* ')) {
            checkPageBreak(6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor("#334155");
            doc.text("•  " + cleanLine.substring(2).trim(), margin + 5, currentY);
            currentY += 6;
        }
        else if (cleanLine.match(/^\d+\.\s/)) {
            checkPageBreak(6);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor("#334155");
            const match = cleanLine.match(/^(\d+\.\s)(.*)/);
            doc.text(match ? match[1] + match[2] : cleanLine, margin + 5, currentY);
            currentY += 6;
        }
        else {
            // Normal paragraph
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor("#334155");

            const splitParagraph = doc.splitTextToSize(cleanLine, pageWidth - (margin * 2));
            for (let j = 0; j < splitParagraph.length; j++) {
                checkPageBreak(6);
                doc.text(splitParagraph[j], margin, currentY);
                currentY += 6;
            }
        }
    }

    // --- Footer ---
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.5);
        doc.line(margin, pageHeight - margin - 5, pageWidth - margin, pageHeight - margin - 5);

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#94a3b8");
        doc.text("Generated by FreelanceOS Canvas", margin, pageHeight - margin + 2);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, pageHeight - margin + 2, { align: "right" });
    }

    // Save
    doc.save(`Analysis_${project.title.replace(/\s+/g, '_')}.pdf`);
};
