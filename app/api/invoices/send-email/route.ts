import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/lib/models/InvoicePayment";
import { User, Client } from "@/lib/models/UserClient";
import { sendInvoiceEmail } from "@/lib/email";
import { format } from "date-fns";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { invoiceId } = await req.json();
        if (!invoiceId) {
            return NextResponse.json({ error: "invoiceId is required" }, { status: 400 });
        }

        if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === "SG.your_key_here") {
            return NextResponse.json({ error: "SENDGRID_API_KEY is not configured. Please add it to your .env file." }, { status: 500 });
        }

        await connectToDatabase();
        const userId = (session.user as any).id;

        const [invoice, user] = await Promise.all([
            Invoice.findOne({ _id: invoiceId, userId }).populate("clientId"),
            User.findById(userId)
        ]);

        if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });

        const client = invoice.clientId as any;
        if (!client?.email) return NextResponse.json({ error: "Client has no email address" }, { status: 400 });

        const freelancerName = (user as any)?.businessName || (user as any)?.name || "Your Freelancer";

        await sendInvoiceEmail({
            to: client.email,
            clientName: client.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.total,
            currency: invoice.currency,
            dueDate: format(new Date(invoice.dueDate), "MMMM d, yyyy"),
            freelancerName,
        });

        return NextResponse.json({ success: true, message: `Invoice sent to ${client.email}` });
    } catch (error: any) {
        console.error("[Send Invoice Email Error]", error);
        return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }
}
