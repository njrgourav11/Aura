import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/lib/models/InvoicePayment";
import { Client } from "@/lib/models/UserClient";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { invoiceId, portalToken } = body;

        if (!invoiceId) {
            return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
        }

        await connectToDatabase();

        // Accept either a valid NextAuth session OR a valid portal token
        if (portalToken) {
            // Portal auth: verify the token belongs to an active portal
            const client = await Client.findOne({ portalToken, portalActive: true }).lean();
            if (!client) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        } else {
            // Dashboard auth: require NextAuth session
            const session = await getServerSession(authOptions);
            if (!session || !session.user) {
                return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
            }
        }

        const invoice = await Invoice.findById(invoiceId).populate('clientId');

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        const options = {
            amount: Math.round(invoice.total * 100),
            currency: invoice.currency === 'INR' ? 'INR' : 'USD',
            receipt: `rcpt_${invoice.invoiceNumber}`,
        };

        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Razorpay Order Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
