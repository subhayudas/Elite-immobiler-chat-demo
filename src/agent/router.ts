import { decideHandoff } from "./handoff.js";
import { parseMessage } from "./nlu.js";
import {
	ensureSession,
	flowBilling,
	flowDocuments,
	flowEmergency,
	flowFallback,
	flowInternet,
	flowLease,
	flowMaintenance,
	flowMove,
	flowNoise,
	flowParking,
	flowStatus,
	setLastIntent
} from "./flows.js";
import { AgentSession, ChatResponse, MessageInput } from "../types.js";

export function handleChat(input: MessageInput): ChatResponse {
	const session = ensureSession(input.sessionId, input.context);
	const parsed = parseMessage(input.message);

	let response: ChatResponse;
	switch (parsed.intent) {
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
		case "parking":
			response = flowParking();
			break;
		case "noise":
			response = flowNoise(session, input.message);
			break;
		case "internet":
			response = flowInternet();
			break;
		case "portal":
			response = flowPortal();
			break;
		case "status":
			response = flowStatus();
			break;
		case "documents":
			response = flowDocuments();
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

