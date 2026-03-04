import mongoose, { Schema, Document } from "mongoose";

export interface IContract extends Document {
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    title: string;
    scope: string;
    paymentTerms: string;
    amount: number;
    currency: string;
    status: 'Draft' | 'Sent' | 'Signed' | 'Expired';
    startDate: Date;
    endDate?: Date;
    clauses: string[];
    createdAt: Date;
    updatedAt: Date;
}

const ContractSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        title: { type: String, required: true },
        scope: { type: String, required: true },
        paymentTerms: { type: String, required: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD', required: true },
        status: {
            type: String,
            enum: ['Draft', 'Sent', 'Signed', 'Expired'],
            default: 'Draft'
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        clauses: [{ type: String }],
    },
    { timestamps: true }
);

export const Contract = mongoose.models.Contract || mongoose.model<IContract>("Contract", ContractSchema);
