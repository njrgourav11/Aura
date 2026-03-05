import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { User, Client } from "@/lib/models/UserClient";
import { Contract } from "@/lib/models/Contract";
import { Invoice, Payment } from "@/lib/models/InvoicePayment";
import bcrypt from "bcryptjs";

export async function POST() {
    try {
        await connectToDatabase();

        // 1. Clear existing data
        await User.deleteMany({});
        await Client.deleteMany({});
        await Contract.deleteMany({});
        await Invoice.deleteMany({});
        await Payment.deleteMany({});

        // 2. Create Demo User
        const hashedPassword = await bcrypt.hash("FreelanceOS123", 10);
        const demoUser = await User.create({
            name: "Alex Freelancer",
            email: "alex@example.com",
            password: hashedPassword,
            businessName: "FreelanceOS Creative Studio",
            defaultCurrency: "USD"
        });

        // 3. Create Demo Clients
        const clients = await Client.insertMany([
            {
                userId: demoUser._id,
                name: "Sarah Johnson",
                email: "sarah@techflow.com",
                company: "TechFlow Inc.",
                currency: "USD"
            },
            {
                userId: demoUser._id,
                name: "Michael Chen",
                email: "m.chen@luminlab.io",
                company: "LuminLab",
                currency: "USD"
            },
            {
                userId: demoUser._id,
                name: "Emma Wilson",
                email: "emma@vanguard.com",
                company: "Vanguard Marketing",
                currency: "GBP"
            }
        ]);

        // 4. Create Demo Contracts
        const contracts = await Contract.insertMany([
            {
                userId: demoUser._id,
                clientId: clients[0]._id,
                title: "Website Redesign",
                scope: "Complete redesign of the corporate website using Next.js and Tailwind CSS.",
                paymentTerms: "50% upfront, 50% on completion",
                amount: 5000,
                currency: "USD",
                status: "Signed",
                startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
                clauses: [
                    "All source code is owned by the client upon final payment.",
                    "Contractor is responsible for 3 months of maintenance post-launch."
                ]
            },
            {
                userId: demoUser._id,
                clientId: clients[1]._id,
                title: "UI/UX Consultation",
                scope: "Review and optimize the user flow for the mobile banking app.",
                paymentTerms: "Net 15",
                amount: 2500,
                currency: "USD",
                status: "Sent",
                startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
                clauses: ["Confidentiality agreement applies to all project data."]
            }
        ]);

        // 5. Create Demo Invoices
        const invoices = await Invoice.insertMany([
            {
                userId: demoUser._id,
                clientId: clients[0]._id,
                contractId: contracts[0]._id,
                invoiceNumber: "INV-2026-001",
                items: [
                    { description: "Website Redesign - Phase 1", quantity: 1, rate: 2500, amount: 2500 }
                ],
                subtotal: 2500,
                taxRate: 5,
                taxAmount: 125,
                total: 2625,
                currency: "USD",
                status: "Paid",
                dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
                issuedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000)
            },
            {
                userId: demoUser._id,
                clientId: clients[1]._id,
                contractId: contracts[1]._id,
                invoiceNumber: "INV-2026-002",
                items: [
                    { description: "UI Review Workshop", quantity: 2, rate: 500, amount: 1000 },
                    { description: "UX Audit Report", quantity: 1, rate: 1500, amount: 1500 }
                ],
                subtotal: 2500,
                taxRate: 0,
                taxAmount: 0,
                total: 2500,
                currency: "USD",
                status: "Sent",
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
                issuedAt: new Date()
            }
        ]);

        // 6. Create Demo Payments
        await Payment.create({
            userId: demoUser._id,
            clientId: clients[0]._id,
            invoiceId: invoices[0]._id,
            amount: 2625,
            currency: "USD",
            method: "Bank Transfer",
            status: "Received",
            paidAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            notes: "Full payment for invoice INV-2026-001"
        });

        return NextResponse.json({ message: "Database seeded successfully!" }, { status: 200 });

    } catch (error: any) {
        console.error("Seeding error:", error);
        return NextResponse.json({ message: "Seeding failed", error: error.message }, { status: 500 });
    }
}
