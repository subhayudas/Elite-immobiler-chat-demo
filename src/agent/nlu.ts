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
	"carbon monoxide"
];

const INTENT_PATTERNS: Array<{ intent: Intent; patterns: RegExp[] }> = [
	{ intent: "emergency", patterns: [/(water|gas|fire|smoke|heat)/i, /(leak|burst|smell|emergency|no heat)/i] },
	{ intent: "maintenance", patterns: [/\b(maint(en(ance)?)?|repair|work order|fix)\b/i] },
	{ intent: "billing", patterns: [/\b(pay(ment)?|fee|balance|nsf|charge|rent)\b/i] },
	{ intent: "lease", patterns: [/\b(lease|assign(ment)?|transfer|renew(al)?|terminate|occupant)\b/i] },
	{ intent: "move", patterns: [/\b(move[-\s]?(in|out)|elevator|booking)\b/i] },
	{ intent: "parking", patterns: [/\b(parking|vehicle|car|spot|permit|waitlist)\b/i] },
	{ intent: "noise", patterns: [/\b(noise|loud|party|disturb(ance)?)\b/i] },
	{ intent: "internet", patterns: [/\b(internet|cable|wifi|videotron|helix)\b/i] },
	{ intent: "portal", patterns: [/\b(portal|login|password|rentcafe|browser)\b/i] },
	{ intent: "status", patterns: [/\b(status|ticket|work order|update)\b/i] },
	{ intent: "documents", patterns: [/\b(receipt|tenancy|attestation|proof)\b/i] }
];

export function parseMessage(text: string): ParsedMessage {
	const normalized = text.trim();

	// Emergency fast-path
	const lower = normalized.toLowerCase();
	if (EMERGENCY_KEYWORDS.some((k) => lower.includes(k))) {
		return { intent: "emergency", entities: {}, isEmergency: true };
	}

	for (const entry of INTENT_PATTERNS) {
		if (entry.patterns.every((p) => p.test(normalized))) {
			return { intent: entry.intent, entities: {} };
		}
		if (entry.patterns.some((p) => p.test(normalized))) {
			return { intent: entry.intent, entities: {} };
		}
	}

	return { intent: "fallback", entities: {} };
}

