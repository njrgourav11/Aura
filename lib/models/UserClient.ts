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

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

// --- Client Model ---
export interface IClient extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    email: string;
    company?: string;
    phone?: string;
    address?: string;
    currency: string;
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
    },
    { timestamps: true }
);

export const Client = mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema);
