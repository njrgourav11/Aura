import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Client } from "@/lib/models/UserClient";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "Missing token" }, { status: 400 });
        }

        await connectToDatabase();

        // Use Mongoose for consistency
        const client = await Client.findOne({
            portalToken: token,
            portalActive: true
        }).lean();

        if (!client) {
            return NextResponse.json({ error: "Portal not found" }, { status: 404 });
        }

        // If no password is set on the portal, let them in
        if (!client.portalPassword) {
            return NextResponse.json({ success: true });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, client.portalPassword);

        if (!isValid) {
            return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
