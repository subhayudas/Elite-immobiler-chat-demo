import { Handoff, Intent } from "../types.js";
import { COMPANY } from "../config/company.js";
import { isWithinBusinessHours, nextBusinessOpen } from "../services/hours.js";

export function decideHandoff(intent: Intent, emergencyFlag: boolean | undefined): Handoff {
	if (intent === "emergency" || emergencyFlag) {
		return { to: "emergency", reason: "Emergency keyword detected" };
	}
	const team = COMPANY.routing(intent);
	if (isWithinBusinessHours(new Date())) {
		return { to: "none" };
	}
	// Outside hours
	if (team === "emergency") {
		return { to: "emergency", reason: "Emergency outside hours" };
	}
	return { to: "queue", reason: "Outside business hours until " + nextBusinessOpen().toISOString() };
}

