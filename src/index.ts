import express from "express";
import { handleChat } from "./agent/router.js";
import { getTicket, findTicketsByUnitAndDate } from "./services/tickets.js";
import { MessageInput } from "./types.js";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
	res.json({ ok: true, name: "Real Estate AI Agent" });
});

app.post("/chat", (req, res) => {
	const body = req.body as MessageInput;
	if (!body?.sessionId || !body?.message) {
		return res.status(400).json({ error: "Missing sessionId or message" });
	}
	const result = handleChat(body);
	return res.json(result);
});

app.get("/status", (req, res) => {
	const ticketId = String(req.query.ticketId || "");
	const unit = String(req.query.unit || "");
	const date = String(req.query.date || "");
	if (ticketId) {
		const t = getTicket(ticketId);
		if (!t) return res.status(404).json({ error: "Ticket not found" });
		return res.json({ ticket: t });
	}
	if (unit && date) {
		const list = findTicketsByUnitAndDate(unit, date);
		return res.json({ tickets: list });
	}
	return res.status(400).json({ error: "Provide ticketId or unit+date" });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
	console.log(`AI Agent listening on http://localhost:${PORT}`);
});

