# Real Estate AI Agent

A rule-based conversational agent for a real estate/property management company. Handles emergencies, maintenance, billing/payments, lease management, move-in/out, parking, noise complaints, internet/cable issues, tenant portal access, work order status, document generation, and human handoffs.

## Quick start

1) Install
```
npm install
```

2) Run in dev
```
npm run dev
```

The server starts on http://localhost:3000

## API

- POST `/chat`
  - Body:
    ```
    {
      "sessionId": "uuid-or-any",
      "message": "user message",
      "context": { "unit": "...", "building": "...", "contact": { "name": "...", "email": "...", "phone": "..." } }
    }
    ```
  - Response:
    ```
    {
      "reply": "assistant response",
      "session": { ... },
      "handoff": { "to": "service|admin|emergency|queue|none", "reason": "..." }
    }
    ```

- GET `/status?ticketId=...` or `/status?unit=...&date=YYYY-MM-DD`
  - Returns ticket/work order status.

## Customization
- Edit `src/config/company.ts` to set business hours, emergency number, and routing rules.
- Update text and flows in `src/agent/flows.ts`.
- Extend intent rules in `src/agent/nlu.ts`.

## Notes
- This is a starter implementation with in-memory storage. Replace ticket services with your systems.
*** End Patch***  }{
## Elite Immobilier • Chat Agent (Next.js)

A chat assistant for a real estate property management company in Gatineau, themed in deep blue and white.

### Prerequisites
- Node.js 18+

### Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env.local` with your OpenAI key (already added in this repo for convenience):
   ```
   OPENAI_API_KEY=YOUR_KEY_HERE
   ```
3. Run the app:
   ```bash
   npm run dev
   ```

### Tech
- Next.js App Router, TypeScript
- TailwindCSS
- OpenAI SDK
- Framer Motion, Lucide Icons

### Notes
- The chat API uses a company-specific system prompt to keep responses on-brand and within scope.
- The UI is inspired by the provided design and follows a deep blue and white theme.

