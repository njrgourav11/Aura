import React from "react";
import connectToDatabase from "@/lib/db";
import { Client, User, IUser } from "@/lib/models/UserClient";
import PortalContainer from "@/components/portal/PortalContainer";
import { ShieldX } from "lucide-react";

async function getSafePortalMetadata(token: string) {
    await connectToDatabase();

    // Use Mongoose model which handles collection names and connections properly
    console.log(`[Portal] Attempting lookup for token: ${token}`);
    const client = await Client.findOne({
        portalToken: token,
        portalActive: true
    }).lean();

    if (!client) {
        console.log(`[Portal] Access DENIED for token: ${token}. Client not found or inactive.`);
        // Optional: Log if token exists but is inactive
        const inactiveClient = await Client.findOne({ portalToken: token }).lean();
        if (inactiveClient) {
            console.log(`[Portal] Token "${token}" exists for ${inactiveClient.name} but portalActive is FALSE`);
        }
        return null;
    }

    // Find Owner (User) business details
    const user = await User.findById(client.userId).lean() as IUser;

    return {
        isProtected: !!client.portalPassword,
        businessName: user.businessName || user.name,
        clientName: client.name,
    };
}

export default async function PortalPage({
    params,
}: {
    params: Promise<{ token: string }>;
}) {
    const { token } = await params;
    const meta = await getSafePortalMetadata(token);

    if (!meta) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center py-20 text-center px-6">
                <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center text-red-500 mb-8 border border-red-500/20">
                    <ShieldX size={40} />
                </div>
                <h1 className="text-3xl font-bold text-white mb-4 tracking-tight">Access Denied</h1>
                <p className="text-slate-400 max-w-sm leading-relaxed">
                    This portal link is invalid, has been deactivated, or redirected. Please contact your service provider for assistance.
                </p>
                <div className="mt-10 p-4 rounded-xl bg-white/5 border border-white/5 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                    Security Error: INVALID_OR_INACTIVE_TOKEN
                </div>
            </div>
        );
    }

    return (
        <PortalContainer
            token={token}
            initialData={meta}
        />
    );
}
