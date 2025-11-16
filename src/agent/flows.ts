import { COMPANY } from "../config/company.js";
import { rentCafeLink, rentCafeResetLink, tenantPortalHelpLink, videotronSupportLink } from "../services/links.js";
import { createTicket } from "../services/tickets.js";
import { AgentSession, ChatResponse, Intent, MessageInput } from "../types.js";

export function ensureSession(sessionId: string, context?: AgentSession["context"]): AgentSession {
	const existing = sessions.get(sessionId);
	if (existing) {
		if (context) existing.context = { ...existing.context, ...context };
		return existing;
	}
	const s: AgentSession = { id: sessionId, context: context ?? {} };
	sessions.set(sessionId, s);
	return s;
}

const sessions = new Map<string, AgentSession>();

export function getSession(sessionId: string): AgentSession | undefined {
	return sessions.get(sessionId);
}

export function setLastIntent(session: AgentSession, intent: Intent): void {
	session.lastIntent = intent;
}

export function flowEmergency(session: AgentSession): ChatResponse {
	const reply =
		"Is this a true emergency affecting life, safety, or severe property damage (e.g., active water leak, smell of gas, fire, no heat in winter)?\n" +
		`If YES: Call ${COMPANY.emergency.phone} immediately. ${COMPANY.emergency.instructions}\n` +
		"If NO: I can help you create a maintenance request. Please describe the issue.";
	return { reply, session, handoff: { to: "emergency", reason: "Emergency screening" } };
}

export function flowMaintenance(session: AgentSession, message: string): ChatResponse {
	const hasBasics = !!(session.context.unit && session.context.building && session.context.contact?.phone);
	if (!hasBasics) {
		const ask = [
			session.context.building ? "" : "What building are you in?",
			session.context.unit ? "" : "What is your unit number?",
			session.context.contact?.phone ? "" : "What is the best phone number to reach you?"
		]
			.filter(Boolean)
			.join(" ");
		return {
			reply: ask || "Please provide a brief description of the issue, access permission, and best time to attend.",
			session,
			handoff: { to: "none" }
		};
	}
	// Create ticket
	const ticket = createTicket({
		type: "maintenance",
		unit: session.context.unit,
		building: session.context.building,
		status: "open",
		details: message,
		contact: session.context.contact
	});
	const reply =
		`Thanks. I created a maintenance ticket ${ticket.id}. ` +
		"Do we have permission to enter if you’re not home? And what is the best time to attend?";
	return { reply, session, handoff: { to: "service" } };
}

export function flowBilling(): ChatResponse {
	const reply =
		"Billing & Payments:\n" +
		`- Check balance or pay via RentCafe: ${rentCafeLink()}\n` +
		`- Reset password: ${rentCafeResetLink()}\n` +
		"- NSF/service fees are applied per lease policy. If you'd like to dispute a fee, please share the fee and date; I’ll route your request to the Admin team.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "admin" } };
}

export function flowLease(): ChatResponse {
	const reply =
		"Lease Management Options:\n" +
		"- Transfers/Assignments\n" +
		"- Add/Remove Occupants\n" +
		"- Renewals\n" +
		"- Early Termination\n" +
		"Please specify your request with your building, unit, and preferred contact. I’ll route this to Admin.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "admin" } };
}

export function flowMove(): ChatResponse {
	const reply =
		"Move-In/Move-Out:\n" +
		"- Share your move-in/out date, building, unit, and contact.\n" +
		"- We’ll provide instructions (elevator booking, keys, walkthroughs) and coordinate with Service.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "service" } };
}

export function flowParking(): ChatResponse {
	const reply =
		"Parking:\n" +
		"- Provide vehicle make/model, color, plate, and unit/building.\n" +
		"- I can place you on a waitlist if no spots are available, and share parking rules.\n" +
		"- For billing of parking, I’ll route to Admin; for allocation and rules, Service will assist.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "service" } };
}

export function flowNoise(session: AgentSession, message: string): ChatResponse {
	const ticket = createTicket({
		type: "noise",
		unit: session.context.unit,
		building: session.context.building,
		status: "open",
		details: message,
		contact: session.context.contact
	});
	const reply =
		`Noise complaint logged as ${ticket.id}. ` +
		"Please share dates/times, nature of disturbance, and if this is a repeat occurrence. Repeated cases are escalated.";
	return { reply, session, handoff: { to: "service" } };
}

export function flowInternet(): ChatResponse {
	const reply =
		"Internet/Cable:\n" +
		`- For Videotron HELIX, see support: ${videotronSupportLink()}\n` +
		"- If this seems building-wide, I’ll notify Service. If it’s isolated to your unit, try rebooting equipment and checking cables. Share building/unit to proceed.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "service" } };
}

export function flowPortal(): ChatResponse {
	const reply =
		"Tenant Portal Access:\n" +
		`- Login/reset via RentCafe: ${rentCafeLink()} | Reset: ${rentCafeResetLink()}\n` +
		`- Browser issues: try private/incognito or another browser. Help: ${tenantPortalHelpLink()}\n` +
		"- Share your email/phone on file if issues persist; Admin can assist.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "admin" } };
}

export function flowStatus(): ChatResponse {
	const reply =
		"Work Order Status:\n" +
		"- Provide ticket ID to retrieve status, or share unit and date to search recent tickets.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "service" } };
}

export function flowDocuments(): ChatResponse {
	const reply =
		"Documents:\n" +
		"- I can generate rent receipts, proof of tenancy, and attestations. Share building, unit, names on lease, and the month(s)/year needed.";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "admin" } };
}

export function flowFallback(): ChatResponse {
	const reply =
		"I can assist with emergencies, maintenance, payments, leases, move-in/out, parking, noise, internet/cable, portal access, work order status, and documents. How can I help today?";
	return { reply, session: { id: "n/a", context: {} }, handoff: { to: "none" } };
}

