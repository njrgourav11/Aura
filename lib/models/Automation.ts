import mongoose, { Schema, Document } from "mongoose";

export type TriggerType = 'CONTRACT_SIGNED' | 'PROJECT_COMPLETED' | 'INVOICE_PAID';
export type ActionType = 'CREATE_PROJECT' | 'CREATE_INVOICE' | 'SEND_EMAIL';

export interface IAutomation extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    trigger: TriggerType;
    action: ActionType;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const AutomationSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        trigger: {
            type: String,
            enum: ['CONTRACT_SIGNED', 'PROJECT_COMPLETED', 'INVOICE_PAID'],
            required: true
        },
        action: {
            type: String,
            enum: ['CREATE_PROJECT', 'CREATE_INVOICE', 'SEND_EMAIL'],
            required: true
        },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const Automation = mongoose.models.Automation || mongoose.model<IAutomation>("Automation", AutomationSchema);
