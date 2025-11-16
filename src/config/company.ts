import { Team } from "../types.js";

export const COMPANY = {
	name: "Your Real Estate Co.",
	timezone: "America/Toronto",
	businessHours: {
		days: [1, 2, 3, 4, 5] as number[], // Mon-Fri
		open: { hour: 8, minute: 0 },
		close: { hour: 16, minute: 0 }
	},
	emergency: {
		phone: "+1-800-555-0000",
		instructions:
			"If you are in immediate danger, call 911 first. For building emergencies, call our emergency line."
	},
	links: {
		rentCafe: "https://rentcafe.com",
		rentCafePasswordReset: "https://www.rentcafe.com/user/forgotpassword.aspx",
		videotronSupport: "https://videotron.com/en/support/helix",
		tenantPortalHelp: "https://rentcafe.com/help"
	},
	routing(intent: string): Team {
		switch (intent) {
			case "maintenance":
			case "noise":
			case "move":
			case "parking":
			case "internet":
			case "status":
				return "service";
			case "billing":
			case "portal":
			case "documents":
			case "lease":
				return "admin";
			case "emergency":
				return "emergency";
			default:
				return "service";
		}
	}
} as const;

