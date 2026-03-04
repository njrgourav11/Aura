import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Client, User } from "@/lib/models/UserClient";
import { Contract } from "@/lib/models/Contract";
import { Invoice, Payment } from "@/lib/models/InvoicePayment";
import { subMonths, startOfMonth, endOfMonth } from "date-fns";

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id;
        await connectToDatabase();

        // Fetch User settings for tax rate and currency
        const user = await User.findById(userId);
        const country = user?.country || "United States";
        const currency = user?.defaultCurrency || "USD";

        const getTaxRate = (country: string) => {
            switch (country) {
                case "India": return 0.18;
                case "United Kingdom": return 0.20;
                case "United States": return 0.15;
                case "Canada": return 0.13;
                default: return 0.20;
            }
        };
        const taxRate = getTaxRate(country);

        // 1. KPI Stats
        const [clients, contracts, invoices, payments] = await Promise.all([
            Client.find({ userId }),
            Contract.find({ userId }),
            Invoice.find({ userId }),
            Payment.find({ userId })
        ]);

        const totalRevenue = payments
            .filter(p => p.status === 'Received')
            .reduce((sum, p) => sum + p.amount, 0);

        const unpaidInvoices = invoices.filter(i => i.status !== 'Paid');
        const unpaidAmount = unpaidInvoices.reduce((sum, i) => sum + (i.total || 0), 0);

        const activeContracts = contracts.filter(c => c.status === 'signed').length;

        // 2. Revenue Graph Data (Last 6 months)
        const chartData = [];
        for (let i = 5; i >= 0; i--) {
            const date = subMonths(new Date(), i);
            const start = startOfMonth(date);
            const end = endOfMonth(date);

            const monthRevenue = payments
                .filter(p => p.status === 'Received' && (p.paidAt || p.createdAt) >= start && (p.paidAt || p.createdAt) <= end)
                .reduce((sum, p) => sum + p.amount, 0);

            chartData.push({
                name: date.toLocaleString('default', { month: 'short' }),
                revenue: monthRevenue
            });
        }

        // 3. Recent Activity
        const recentActivity = [
            ...invoices.map(i => ({ type: 'invoice', title: `Invoice #${i.invoiceNumber}`, date: i.createdAt, amount: i.total, status: i.status, currency: i.currency })),
            ...payments.map(p => ({ type: 'payment', title: `Payment received`, date: p.paidAt || p.createdAt, amount: p.amount, status: p.status, currency: p.currency })),
            ...contracts.map(c => ({ type: 'contract', title: `Contract: ${c.title}`, date: c.createdAt, amount: c.amount, status: c.status, currency: c.currency }))
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);

        return NextResponse.json({
            stats: {
                totalRevenue,
                unpaidCount: unpaidInvoices.length,
                unpaidAmount,
                activeContracts,
                taxEstimate: totalRevenue * taxRate,
                currency,
                taxRateText: `${taxRate * 100}% (${country})`
            },
            chartData,
            recentActivity
        });
    } catch (error: any) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
