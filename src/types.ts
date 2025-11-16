export type Team = "service" | "admin" | "emergency";

export interface ContactInfo {
	name?: string;
	email?: string;
	phone?: string;
}

export interface SessionContext {
	language?: "en" | "fr";
	building?: string;
	unit?: string;
	contact?: ContactInfo;
	consentToEnter?: boolean;
	bestTime?: string;
	// Profile/global slots
	tenant_name?: string;
	building_address?: string;
	contact_email?: string;
	contact_phone?: string;
	preferred_contact?: "phone" | "email";
	portal_user?: boolean;
}

export type Intent =
	| "emergency"
	| "maintenance"
	| "billing"
	| "lease"
	| "move" // legacy
	| "move_in"
	| "move_out"
	| "parking"
	| "noise" // legacy
	| "noise_complaint"
	| "internet" // legacy
	| "internet_cable"
	| "portal" // legacy
	| "portal_access"
	| "status" // legacy
	| "status_update"
	| "documents"
	| "greet"
	| "human_agent"
	| "fallback"
	| "other";

export interface ParsedMessage {
	intent: Intent;
	entities: Record<string, string | boolean | undefined>;
	isEmergency?: boolean;
}

export interface MessageInput {
	sessionId: string;
	message: string;
	context?: SessionContext;
}

export interface Handoff {
	to: "service" | "admin" | "emergency" | "queue" | "none";
	reason?: string;
}

export interface ChatResponse {
	reply: string;
	session: AgentSession;
	handoff: Handoff;
}

export interface AgentSession {
	id: string;
	context: SessionContext;
	lastIntent?: Intent;
}

export interface Ticket {
	id: string;
	type:
		| "maintenance"
		| "noise"
		| "parking"
		| "move"
		| "internet"
		| "documents"
		| "billing"
		| "lease";
	unit?: string;
	building?: string;
	status: "open" | "in_progress" | "completed" | "on_hold";
	createdAt: string;
	updatedAt: string;
	details?: string;
	contact?: ContactInfo;
}

