import connectToDatabase from "./db";
import { Automation, TriggerType } from "./models/Automation";
import { Project } from "./models/Project";
import { Invoice } from "./models/InvoicePayment";
import { User, Client } from "./models/UserClient";
import {
    sendContractSignedEmail,
    sendInvoiceEmail,
    sendPaymentConfirmedEmail
} from "./email";

export async function processTrigger(userId: string, trigger: TriggerType, data: any) {
    console.log(`[Automation Engine] Processing trigger: ${trigger} for user: ${userId}`);

    await connectToDatabase();

    // Find all active automations for this trigger and user
    const automations = await Automation.find({
        userId,
        trigger,
        isActive: true
    });

    if (automations.length === 0) {
        console.log(`[Automation Engine] No active automations for trigger: ${trigger}`);
        return;
    }

    for (const automation of automations) {
        try {
            console.log(`[Automation Engine] Executing action: ${automation.action} for automation: "${automation.name}"`);

            switch (automation.action) {
                case 'CREATE_PROJECT':
                    await handleCreateProject(userId, trigger, data);
                    break;
                case 'CREATE_INVOICE':
                    await handleCreateInvoice(userId, trigger, data);
                    break;
                case 'SEND_EMAIL':
                    await handleSendEmail(userId, trigger, data);
                    break;
                default:
                    console.warn(`[Automation Engine] Unknown action: ${automation.action}`);
            }
        } catch (error) {
            console.error(`[Automation Engine] Error executing automation ${automation._id}:`, error);
        }
    }
}

// ─── Handlers ───────────────────────────────────────────────────────────────

async function handleCreateProject(userId: string, trigger: TriggerType, data: any) {
    if (trigger === 'CONTRACT_SIGNED') {
        const contract = data.contract;
        if (!contract) return;

        // Extract raw ID to ensure robust comparison (especially if clientId was populated)
        const clientId = contract.clientId?._id || contract.clientId;
        if (!clientId) return;

        const existingProject = await Project.findOne({
            userId,
            clientId,
            title: contract.title
        });

        if (existingProject) {
            console.log(`[Automation Engine] Project already exists for contract: ${contract.title}`);
            return;
        }

        // Handle structured JSON scope if it exists
        let projectDescription = contract.scope;
        try {
            if (typeof contract.scope === 'string' && (contract.scope.trim().startsWith('[') || contract.scope.trim().startsWith('{'))) {
                const parsedScope = JSON.parse(contract.scope);
                if (Array.isArray(parsedScope)) {
                    projectDescription = parsedScope.map((s: any) => 
                        `${s.title?.toUpperCase() || 'Section'}:\n${(s.items || []).map((i: string) => `• ${i}`).join('\n')}`
                    ).join('\n\n');
                }
            }
        } catch (e) {
            // Fallback to raw scope if parsing fails
            projectDescription = contract.scope;
        }

        await Project.create({
            userId,
            clientId,
            title: contract.title,
            description: `Auto-created from contract: ${contract.title}\n\nScope Summary:\n${projectDescription}`,
            status: 'Planning',
            startDate: contract.startDate || new Date(),
            endDate: contract.endDate,
            tasks: [
                { title: 'Setup project workspace', completed: false },
                { title: 'Initial client kick-off', completed: false },
                { title: 'Project requirements review', completed: false }
            ]
        });
        console.log(`[Automation Engine] Created project: ${contract.title}`);
    }
}

async function handleCreateInvoice(userId: string, trigger: TriggerType, data: any) {
    if (trigger === 'PROJECT_COMPLETED') {
        const project = data.project;
        if (!project) return;

        const invoiceNumber = `INV-${Math.floor(Math.random() * 1000000)}`;

        await Invoice.create({
            userId,
            clientId: project.clientId,
            invoiceNumber,
            items: [
                {
                    description: `Project Completion: ${project.title}`,
                    quantity: 1,
                    rate: 0,
                    amount: 0
                }
            ],
            subtotal: 0,
            total: 0,
            currency: 'USD',
            status: 'Draft',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });
        console.log(`[Automation Engine] Created draft invoice for project: ${project.title}`);
    }
}

async function handleSendEmail(userId: string, trigger: TriggerType, data: any) {
    // Fetch the freelancer (user) details
    const user = await User.findById(userId);
    if (!user) {
        console.warn(`[Automation Engine] User not found: ${userId}`);
        return;
    }

    const freelancerName = user.businessName || user.name;

    if (trigger === 'CONTRACT_SIGNED') {
        const contract = data.contract;
        if (!contract) return;

        // Fetch client info
        const client = await Client.findById(contract.clientId);
        if (!client?.email) {
            console.warn(`[Automation Engine] Client not found or no email for contract: ${contract.title}`);
            return;
        }

        await sendContractSignedEmail({
            to: client.email,
            clientName: client.name,
            contractTitle: contract.title,
            amount: contract.amount,
            currency: contract.currency || 'USD',
            startDate: new Date(contract.startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            freelancerName,
        });
        console.log(`[Automation Engine] Sent CONTRACT_SIGNED email to: ${client.email}`);
    }

    else if (trigger === 'PROJECT_COMPLETED') {
        const project = data.project;
        if (!project) return;

        const client = await Client.findById(project.clientId);
        if (!client?.email) {
            console.warn(`[Automation Engine] Client not found or no email for project: ${project.title}`);
            return;
        }

        // Find the latest invoice for this client/project to send details
        const invoice = await Invoice.findOne({ userId, clientId: client._id }).sort({ createdAt: -1 });
        if (!invoice) return;

        await sendInvoiceEmail({
            to: client.email,
            clientName: client.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.total,
            currency: invoice.currency || 'USD',
            dueDate: new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            freelancerName,
        });
        console.log(`[Automation Engine] Sent PROJECT_COMPLETED invoice email to: ${client.email}`);
    }

    else if (trigger === 'INVOICE_PAID') {
        const invoice = data.invoice;
        if (!invoice) return;

        const client = await Client.findById(invoice.clientId);
        if (!client?.email) {
            console.warn(`[Automation Engine] Client not found or no email for invoice: ${invoice.invoiceNumber}`);
            return;
        }

        await sendPaymentConfirmedEmail({
            to: client.email,
            clientName: client.name,
            invoiceNumber: invoice.invoiceNumber,
            amount: invoice.total,
            currency: invoice.currency || 'USD',
            freelancerName,
        });
        console.log(`[Automation Engine] Sent INVOICE_PAID email to: ${client.email}`);
    }
}
