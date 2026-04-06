import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Contract } from "@/lib/models/Contract";
import { User, Client } from "@/lib/models/UserClient";
import { sendContractSignedEmail } from "@/lib/email";
import { format } from "date-fns";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { contractId } = await req.json();
        if (!contractId) {
            return NextResponse.json({ error: "contractId is required" }, { status: 400 });
        }

        if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === "SG.your_key_here") {
            return NextResponse.json({ error: "SENDGRID_API_KEY is not configured. Please add it to your .env file." }, { status: 500 });
        }

        await connectToDatabase();
        const userId = (session.user as any).id;

        const [contract, user] = await Promise.all([
            Contract.findOne({ _id: contractId, userId }).populate("clientId"),
            User.findById(userId)
        ]);

        if (!contract) return NextResponse.json({ error: "Contract not found" }, { status: 404 });

        const client = contract.clientId as any;
        if (!client?.email) return NextResponse.json({ error: "Client has no email address" }, { status: 400 });

        const freelancerName = (user as any)?.businessName || (user as any)?.name || "Your Freelancer";

        await sendContractSignedEmail({
            to: client.email,
            clientName: client.name,
            contractTitle: contract.title,
            amount: contract.amount,
            currency: contract.currency,
            startDate: format(new Date(contract.startDate), "MMMM d, yyyy"),
            freelancerName,
        });

        return NextResponse.json({ success: true, message: `Contract sent to ${client.email}` });
    } catch (error: any) {
        console.error("[Send Contract Email Error]", error);
        return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
    }
}
