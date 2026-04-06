import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Automation } from "@/lib/models/Automation";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const automations = await Automation.find({
            userId: (session.user as any).id
        }).sort({ createdAt: -1 });

        return NextResponse.json(automations);
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

        const automation = await Automation.create({
            ...data,
            userId: (session.user as any).id
        });

        return NextResponse.json(automation);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
