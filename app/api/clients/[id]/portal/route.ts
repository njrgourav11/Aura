import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import { Client } from "@/lib/models/UserClient";
import crypto from "crypto";
import bcrypt from "bcryptjs";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { active, password } = body;

        console.log(`[Portal API] Processing request for client ID: ${id}`);
        console.log(`[Portal API] User ID from session: ${(session.user as any).id}`);
        console.log(`[Portal API] Request Body:`, body);

        await connectToDatabase();

        // Find the client first to check state
        const client = await Client.findOne({
            _id: id,
            userId: (session.user as any).id
        });

        if (!client) {
            console.error(`[Portal API] Client NOT FOUND: ID=${id}, UserID=${(session.user as any).id}`);
            return NextResponse.json({ error: "Client not found or access denied" }, { status: 404 });
        }

        const updates: any = { portalActive: active };

        // Generate token if activating or if current token is invalid/missing
        const currentToken = client.portalToken;
        const isInvalidToken = !currentToken || currentToken === "undefined" || currentToken === "null";

        if (active && isInvalidToken) {
            updates.portalToken = crypto.randomBytes(16).toString('hex');
            console.log(`[Portal API] Generating new token for ${client.name}: ${updates.portalToken}`);
        }

        // Handle password update
        if (password !== undefined) {
            if (password === "") {
                updates.portalPassword = null;
            } else {
                updates.portalPassword = await bcrypt.hash(password, 10);
            }
        }

        console.log(`[Portal API] Applying updates:`, updates);

        const updatedClient = await Client.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        );

        if (!updatedClient) {
            console.error(`[Portal API] Update FAILED for ID=${id}`);
            return NextResponse.json({ error: "Update failed" }, { status: 500 });
        }

        console.log(`[Portal API] Successfully updated ${updatedClient.name}. Active: ${updatedClient.portalActive}`);

        return NextResponse.json(updatedClient);
    } catch (error: any) {
        console.error("[Portal API] ERROR:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
