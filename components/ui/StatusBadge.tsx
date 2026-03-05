import { cn } from "@/lib/utils";

type Status =
    | 'Draft' | 'Sent' | 'Signed' | 'Expired'
    | 'Paid' | 'Overdue' | 'Pending' | 'Received' | 'Failed'
    | 'Planning' | 'Active' | 'Completed' | 'On Hold';

export function StatusBadge({ status, className }: { status: Status | string; className?: string }) {
    let badgeClass = "badge-neutral";

    switch (status) {
        case 'Signed':
        case 'Paid':
        case 'Received':
        case 'Active':
        case 'Completed':
            badgeClass = "badge-success";
            break;
        case 'Overdue':
        case 'Failed':
        case 'Expired':
            badgeClass = "badge-danger";
            break;
        case 'Sent':
        case 'Pending':
        case 'On Hold':
            badgeClass = "badge-warning";
            break;
        case 'Draft':
        case 'Planning':
        default:
            badgeClass = "badge-neutral";
            break;
    }

    return (
        <span className={cn("badge", badgeClass, className)}>
            {status}
        </span>
    );
}
