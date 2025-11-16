import { decideHandoff } from "./handoff.js";
import { parseMessage } from "./nlu.js";
import {
	ensureSession,
	flowBilling,
	flowDocuments,
	flowEmergency,
	flowEmergencyNow,
	flowFallback,
	flowInternet,
	flowLease,
	flowMaintenance,
	flowMove,
	flowMoveIn,
	flowMoveOut,
	flowNoise,
	flowParking,
	flowStatus,
	flowStart,
	setLastIntent
} from "./flows.js";
import { AgentSession, ChatResponse, MessageInput } from "../types.js";

export function handleChat(input: MessageInput): ChatResponse {
	const session = ensureSession(input.sessionId, input.context);
	const parsed = parseMessage(input.message);

	// Simple emergency gate follow-ups (Yes/No)
	if (session.lastIntent === "emergency") {
		if (/^\s*(yes|oui)\s*$/i.test(input.message)) {
			const emergencyNow = flowEmergencyNow();
			setLastIntent(session, "emergency");
			return { ...emergencyNow, session, handoff: { to: "emergency" } };
		}
		if (/^\s*(no|non)\s*$/i.test(input.message)) {
			const maint = flowMaintenance(session, "Non-emergency follow-up");
			setLastIntent(session, "maintenance");
			return { ...maint, session };
		}
	}

	let response: ChatResponse;
	switch (parsed.intent) {
		case "greet":
			response = flowStart();
			break;
		case "emergency":
			response = flowEmergency(session);
			break;
		case "maintenance":
			response = flowMaintenance(session, input.message);
			break;
		case "billing":
			response = flowBilling();
			break;
		case "lease":
			response = flowLease();
			break;
		case "move":
			response = flowMove();
			break;
		case "move_in":
			response = flowMoveIn();
			break;
		case "move_out":
			response = flowMoveOut();
			break;
		case "parking":
			response = flowParking();
			break;
		case "noise":
		case "noise_complaint":
			response = flowNoise(session, input.message);
			break;
		case "internet":
		case "internet_cable":
			response = flowInternet();
			break;
		case "portal":
		case "portal_access":
			response = flowPortal();
			break;
		case "status":
		case "status_update":
			response = flowStatus();
			break;
		case "documents":
			response = flowDocuments();
			break;
		case "human_agent":
			// For now, send fallback with handoff suggestion; dedicated handoff flow can be added.
			response = {
				reply:
					"I’ll connect you to our team. If outside Mon–Fri 08:00–16:00 America/Toronto, we’ll reply next business day. " +
					"If this is a true emergency, call the emergency line.",
				session,
				handoff: { to: "queue", reason: "User requested human" }
			};
			break;
		default:
			response = flowFallback();
	}

	setLastIntent(session, parsed.intent);
	const handoff = decideHandoff(parsed.intent, parsed.isEmergency);
	return { ...response, session, handoff };
}

function flowPortal(): ChatResponse {
	// alias to avoid circular import; implemented in flows.ts but referenced here
	const { flowPortal: impl } = require("./flows.js");
	return impl();
}

