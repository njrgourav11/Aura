import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/lib/models/InvoicePayment";
import { razorpay } from "@/lib/razorpay";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { invoiceId } = await req.json();

        if (!invoiceId) {
            return NextResponse.json({ error: "Invoice ID is required" }, { status: 400 });
        }

        await connectToDatabase();
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
