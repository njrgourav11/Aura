import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import mongoose from "mongoose";

export async function GET() {
    try {
        await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) throw new Error("Database connection failed");

        console.log("[Debug API] Starting Database Cleanup...");

        // 1. Convert all invalid string tokens to null
        const result = await db.collection('clients').updateMany(
            { portalToken: { $in: ["undefined", "null", "", "undefined (string)"] } },
            { $set: { portalToken: null, portalActive: false } }
        );

        console.log(`[Debug API] Cleaned up ${result.modifiedCount} records.`);

        // 2. Drop the index to be sure
        try {
            await db.collection('clients').dropIndex("portalToken_1");
        } catch (e) {
            console.log("[Debug API] portalToken index not found/already dropped");
        }

        // 3. Re-create the sparse unique index
        await db.collection('clients').createIndex(
            { portalToken: 1 },
            { unique: true, sparse: true }
        );

        return NextResponse.json({
            message: "Database cleanup and indexing successful",
            cleanedCount: result.modifiedCount,
            status: "ready"
        });

    } catch (error: any) {
        console.error("[Debug API] Cleanup FAILED:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
