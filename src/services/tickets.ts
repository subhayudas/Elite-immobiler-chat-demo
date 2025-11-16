import { Ticket, ContactInfo } from "../types.js";

const tickets = new Map<string, Ticket>();

function genId(): string {
	return Math.random().toString(36).slice(2, 10);
}

export function createTicket(data: Omit<Ticket, "id" | "createdAt" | "updatedAt">): Ticket {
	const id = genId();
	const now = new Date().toISOString();
	const ticket: Ticket = { id, createdAt: now, updatedAt: now, ...data };
	tickets.set(id, ticket);
	return ticket;
}

export function updateTicket(id: string, updates: Partial<Ticket>): Ticket | undefined {
	const current = tickets.get(id);
	if (!current) return undefined;
	const updated: Ticket = { ...current, ...updates, updatedAt: new Date().toISOString() };
	tickets.set(id, updated);
	return updated;
}

export function getTicket(id: string): Ticket | undefined {
	return tickets.get(id);
}

export function findTicketsByUnitAndDate(unit: string, dateISO: string): Ticket[] {
	const day = new Date(dateISO);
	return [...tickets.values()].filter((t) => {
		if (t.unit !== unit) return false;
		const created = new Date(t.createdAt);
		return (
			created.getFullYear() === day.getFullYear() &&
			created.getMonth() === day.getMonth() &&
			created.getDate() === day.getDate()
		);
	});
}

export function attachContact(id: string, contact: ContactInfo): Ticket | undefined {
	return updateTicket(id, { contact });
}

