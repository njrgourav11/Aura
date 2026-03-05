import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import { Client, User, IUser } from "@/lib/models/UserClient";
import { Invoice } from "@/lib/models/InvoicePayment";
import { Contract } from "@/lib/models/Contract";
import { Project } from "@/lib/models/Project";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        await connectToDatabase();

        // Use Mongoose model for client lookup
        const client = await Client.findOne({
            portalToken: token,
            portalActive: true
        }).lean();

        if (!client) {
            return NextResponse.json({ error: "Portal access denied" }, { status: 403 });
        }

        // If password protected, verify it again
        if (client.portalPassword) {
            if (!password) {
                return NextResponse.json({ error: "Password required" }, { status: 401 });
            }
            const isValid = await bcrypt.compare(password, client.portalPassword);
            if (!isValid) {
                return NextResponse.json({ error: "Invalid passcode" }, { status: 401 });
            }
        }

        // Fetch remaining data
        const user = await User.findById(client.userId).lean() as IUser;
        const invoices = await Invoice.find({ clientId: client._id }).sort({ createdAt: -1 }).lean();
        const contracts = await Contract.find({ clientId: client._id }).sort({ createdAt: -1 }).lean();
        const projects = await Project.find({ clientId: client._id }).sort({ updatedAt: -1 }).lean();

        return NextResponse.json({
            client,
            user: {
                name: user.name,
                businessName: user.businessName,
                businessEmail: user.businessEmail,
                businessPhone: user.businessPhone,
            },
            invoices,
            contracts,
            projects
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
