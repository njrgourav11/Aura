import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Automation } from "@/lib/models/Automation";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const data = await req.json();
        await connectToDatabase();

        const automation = await Automation.findOneAndUpdate(
            { _id: id, userId: (session.user as any).id },
            { $set: data },
            { new: true }
        );

        if (!automation) {
            return NextResponse.json({ error: "Automation not found" }, { status: 404 });
        }

        return NextResponse.json(automation);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const automation = await Automation.findOneAndDelete({
            _id: id,
            userId: (session.user as any).id
        });

        if (!automation) {
            return NextResponse.json({ error: "Automation not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Automation deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
