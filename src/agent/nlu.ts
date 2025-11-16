import { Intent, ParsedMessage } from "../types.js";

const EMERGENCY_KEYWORDS = [
	"water leak",
	"pipe burst",
	"flood",
	"gas",
	"smell gas",
	"fire",
	"smoke",
	"no heat",
	"no heating",
	"carbon monoxide",
	// FR
	"fuite",
	"fuite d’eau",
	"incendie",
	"fumée",
	"odeur de gaz",
	"pas de chauffage"
];

const INTENT_PATTERNS: Array<{ intent: Intent; patterns: RegExp[] }> = [
	// Greetings
	{ intent: "greet", patterns: [/^\s*(hi|hello|hey|bonjour|allo|salut)\b/i] },
	// Emergencies
	{
		intent: "emergency",
		patterns: [
			/(water|gas|fire|smoke|heat|incendie|gaz|fum(é|e)e?)/i,
			/(leak|burst|smell|emergency|no heat|fuite|odeur|urgence|pas de chauffage)/i
		]
	},
	// Maintenance
	{
		intent: "maintenance",
		patterns: [
			/\b(maint(en(ance)?)?|repair|work\s?order|fix|toilet|drain|electric|electricit(é|e)|infestation|plumbing|plomberie)\b/i,
			/\b(casser|cass(é|e)e?|porte|internet (down|panne)|appareil|serrure|chauffage|pests?)\b/i
		]
	},
	// Billing/Payment
	{
		intent: "billing",
		patterns: [/\b(pay(ment)?|fee|balance|nsf|charge|rent|payer|frais|solde|loyer|RentCafe)\b/i]
	},
	// Lease changes
	{
		intent: "lease",
		patterns: [/\b(lease|assign(ment)?|transfer|renew(al)?|terminate|occupant|cession|assignation|renouvellement|résiliation)\b/i]
	},
	// Move in/out
	{ intent: "move_in", patterns: [/\b(move\s?in|emm(é|e)nagement|clé|key pickup)\b/i] },
	{ intent: "move_out", patterns: [/\b(move\s?out|d(é|e)m(é|e)nagement|quitter|pr(é|e)avis)\b/i] },
	// Parking
	{ intent: "parking", patterns: [/\b(parking|vehicle|car|spot|permit|waitlist|vignette|immatriculation)\b/i] },
	// Noise complaint
	{ intent: "noise_complaint", patterns: [/\b(noise|bruit|party|chien qui jappe|loud|disturb(ance)?)\b/i] },
	// Internet / Cable
	{ intent: "internet_cable", patterns: [/\b(internet|cable|wifi|videotron|helix|modem|rendu d[’']?équipement)\b/i] },
	// Portal access
	{
		intent: "portal_access",
		patterns: [/\b(portal|login|password|mot de passe|RentCafe|portail locataire|portail)\b/i]
	},
	// Status update
	{ intent: "status_update", patterns: [/\b(status|ticket|work\s?order|update|suivi|où en est)\b/i] },
	// Documents
	{ intent: "documents", patterns: [/\b(receipt|tenancy|attestation|proof|re(ç|c)us|preuve)\b/i] },
	// Human agent
	{ intent: "human_agent", patterns: [/\b(human|agent|someone|reception|parler à un humain)\b/i] }
];

export function parseMessage(text: string): ParsedMessage {
	const normalized = text.trim();

	// Emergency fast-path
	const lower = normalized.toLowerCase();
	if (EMERGENCY_KEYWORDS.some((k) => lower.includes(k))) {
		return { intent: "emergency", entities: detectEntities(normalized), isEmergency: true };
	}

	for (const entry of INTENT_PATTERNS) {
		if (entry.patterns.every((p) => p.test(normalized))) {
			return { intent: entry.intent, entities: detectEntities(normalized) };
		}
		if (entry.patterns.some((p) => p.test(normalized))) {
			return { intent: entry.intent, entities: detectEntities(normalized) };
		}
	}

	return { intent: "fallback", entities: detectEntities(normalized) };
}

function detectEntities(text: string): Record<string, string | boolean | undefined> {
	const entities: Record<string, string | boolean | undefined> = {};
	// Language
	if (/\b(bonjour|allo|salut|fuite|urgence|portail|loyer|solde|renouvellement|résiliation)\b/i.test(text)) {
		entities.language = "fr";
	} else if (/\b(hi|hello|rent|portal|balance|fee|renewal|termination)\b/i.test(text)) {
		entities.language = "en";
	}
	// Unit (e.g., A12, 305B, 1204)
	const unitMatch = text.match(/\b([A-Za-z]?\d{1,4}[A-Za-z]?)\b/);
	if (unitMatch) entities.unit = unitMatch[1];
	// Email
	const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
	if (emailMatch) entities.email = emailMatch[0];
	// Phone
	const phoneMatch = text.match(/(\+?\d[\d\s().-]{7,}\d)/);
	if (phoneMatch) entities.phone = phoneMatch[1];
	return entities;
}

