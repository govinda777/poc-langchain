export interface SupportTicket {
    id: string;
    description: string;
    status: 'open' | 'closed';
    createdAt: Date;
}

export function createSupportTicket(description: string): SupportTicket {
    const id = "TICKET-" + Math.floor(Math.random() * 100000).toString();
    console.log(`Audit: Created Support Ticket ${id} for issue: "${description}"`);
    return {
        id,
        description,
        status: 'open',
        createdAt: new Date()
    };
}
