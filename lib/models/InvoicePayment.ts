import mongoose, { Schema, Document } from "mongoose";

// --- Invoice Model ---
export interface IInvoiceItem {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
}

export interface IInvoice extends Document {
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    contractId?: mongoose.Types.ObjectId;
    invoiceNumber: string;
    items: IInvoiceItem[];
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    discount: number;
    total: number;
    currency: string;
    status: 'Draft' | 'Sent' | 'Paid' | 'Overdue';
    dueDate: Date;
    issuedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
    description: { type: String, required: true },
    quantity: { type: Number, required: true },
    rate: { type: Number, required: true },
    amount: { type: Number, required: true },
});

const InvoiceSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        contractId: { type: Schema.Types.ObjectId, ref: 'Contract' }, // Optional link to contract
        invoiceNumber: { type: String, required: true },
        items: [InvoiceItemSchema],
        subtotal: { type: Number, required: true },
        taxRate: { type: Number, default: 0 },
        taxAmount: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        currency: { type: String, default: 'USD', required: true },
        status: {
            type: String,
            enum: ['Draft', 'Sent', 'Paid', 'Overdue'],
            default: 'Draft'
        },
        dueDate: { type: Date, required: true },
        issuedAt: { type: Date },
    },
    { timestamps: true }
);

export const Invoice = mongoose.models.Invoice || mongoose.model<IInvoice>("Invoice", InvoiceSchema);

// --- Payment Model ---
export interface IPayment extends Document {
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    invoiceId?: mongoose.Types.ObjectId;
    amount: number;
    currency: string;
    method: 'Bank Transfer' | 'UPI' | 'PayPal' | 'Crypto' | 'Card' | 'Other';
    status: 'Pending' | 'Received' | 'Failed';
    paidAt?: Date;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

const PaymentSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        invoiceId: { type: Schema.Types.ObjectId, ref: 'Invoice' }, // Optional, can be direct payment
        amount: { type: Number, required: true },
        currency: { type: String, default: 'USD', required: true },
        method: {
            type: String,
            enum: ['Bank Transfer', 'UPI', 'PayPal', 'Crypto', 'Card', 'Other'],
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Received', 'Failed'],
            default: 'Pending'
        },
        paidAt: { type: Date },
        notes: { type: String },
    },
    { timestamps: true }
);

export const Payment = mongoose.models.Payment || mongoose.model<IPayment>("Payment", PaymentSchema);
