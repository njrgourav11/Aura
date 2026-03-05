import mongoose, { Schema, Document } from "mongoose";

export interface ITask {
    title: string;
    completed: boolean;
    dueDate?: Date;
}

export interface INote {
    content: string;
    createdAt: Date;
}

export interface IMilestone {
    title: string;
    dueDate?: Date;
    completed: boolean;
}

export interface IProject extends Document {
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    title: string;
    description?: string;
    status: 'Planning' | 'Active' | 'Completed' | 'On Hold';
    startDate?: Date;
    endDate?: Date;
    tasks: ITask[];
    notes: INote[];
    milestones: IMilestone[];
    createdAt: Date;
    updatedAt: Date;
}

const TaskSchema = new Schema({
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: Date }
});

const NoteSchema = new Schema({
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MilestoneSchema = new Schema({
    title: { type: String, required: true },
    dueDate: { type: Date },
    completed: { type: Boolean, default: false }
});

const ProjectSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        clientId: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
        title: { type: String, required: true },
        description: { type: String },
        status: {
            type: String,
            enum: ['Planning', 'Active', 'Completed', 'On Hold'],
            default: 'Planning'
        },
        startDate: { type: Date },
        endDate: { type: Date },
        tasks: [TaskSchema],
        notes: [NoteSchema],
        milestones: [MilestoneSchema]
    },
    { timestamps: true }
);

export const Project = mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
