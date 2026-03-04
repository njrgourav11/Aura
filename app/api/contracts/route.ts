import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Contract } from "@/lib/models/Contract";
import "@/lib/models/UserClient"; // Ensure Client model is registered

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const contracts = await Contract.find({ userId: (session.user as any).id })
            .populate('clientId', 'name email company')
            .sort({ createdAt: -1 });

        return NextResponse.json(contracts);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await connectToDatabase();

        const contract = await Contract.create({
            ...data,
            userId: (session.user as any).id
        });

        return NextResponse.json(contract, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
