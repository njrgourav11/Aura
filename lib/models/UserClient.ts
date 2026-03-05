import mongoose, { Schema, Document } from "mongoose";

// --- User Model ---
export interface IUser extends Document {
    name: string;
    email: string;
    password?: string;
    businessName?: string;
    businessAddress?: string;
    businessEmail?: string;
    businessPhone?: string;
    taxId?: string;
    country?: string;
    signatureUrl?: string;
    defaultCurrency: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String },
        businessName: { type: String },
        businessAddress: { type: String },
        businessEmail: { type: String },
        businessPhone: { type: String },
        taxId: { type: String },
        country: { type: String },
        signatureUrl: { type: String },
        defaultCurrency: { type: String, default: 'USD' },
    },
    { timestamps: true }
);

// Fix for Next.js hot-reloading: remove cached models if they exist
if (mongoose.models.User) {
    delete mongoose.models.User;
}
export const User = mongoose.model<IUser>("User", UserSchema);

// --- Client Model ---
export interface IClient extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    address?: string;
    currency: string;
    portalToken?: string;
    portalPassword?: string;
    portalActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ClientSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        company: { type: String },
        phone: { type: String },
        address: { type: String },
        currency: { type: String, default: 'USD' }, // Multi-currency support
        portalToken: { type: String, unique: true, sparse: true },
        portalPassword: { type: String }, // Optional password protection
        portalActive: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// We will handle token generation in the dedicated activation API

// Fix for Next.js hot-reloading: remove cached model
if (mongoose.models.Client) {
    delete mongoose.models.Client;
}
export const Client = mongoose.model<IClient>("Client", ClientSchema);
