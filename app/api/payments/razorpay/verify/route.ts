import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Invoice } from "@/lib/models/InvoicePayment";
import { Payment } from "@/lib/models/InvoicePayment";
import crypto from "crypto";
import { processTrigger } from "@/lib/automation-engine";

export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            invoiceId
        } = await req.json();

        const secret = process.env.RAZORPAY_KEY_SECRET;
        if (!secret) {
            return NextResponse.json({ error: "Razorpay secret missing" }, { status: 500 });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (!isAuthentic) {
            return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
        }

        await connectToDatabase();

        const invoice = await Invoice.findByIdAndUpdate(invoiceId, { status: 'Paid' }, { new: true });

        if (!invoice) {
            return NextResponse.json({ error: "Invoice not found during verification" }, { status: 404 });
        }

        await Payment.create({
            userId: invoice.userId,
            clientId: invoice.clientId,
            invoiceId: invoice._id,
            amount: invoice.total,
            currency: invoice.currency,
            method: 'Card',
            status: 'Received',
            paidAt: new Date(),
            notes: `Razorpay Payment ID: ${razorpay_payment_id}`
        });

        // Trigger automations for Invoice Paid
        await processTrigger(invoice.userId.toString(), 'INVOICE_PAID', { invoice });

        return NextResponse.json({ message: "Payment verified successfully", invoice });
    } catch (error: any) {
        console.error("Razorpay Verification Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
