import OpenAI from "openai";
import { NextResponse } from "next/server";

const COMPANY_CONTEXT = `
Discover excellence in property management in Gatineau

About ELITE
Discover excellence in property management in Gatineau
Based in Gatineau, we offer comprehensive and personalized services. Our experts handle everything from tenant communication to property maintenance. Our goal is to ensure your peace of mind and worry-free management.

You are... Investor | Tenant
Your tenants, our priority
Having happy tenants is the key to successful property management. We are committed to providing exceptional service to our tenants. We ensure clear communication, prompt responses, and regular property maintenance.

Our property management services in Gatineau include: rental management, property maintenance, rent collection, administrative management, and more. We work transparently with our clients to ensure their property is well-maintained and tenants are comfortable, maximizing income.

A team dedicated to your peace of mind
The Elite Immobilier team has over 30 years of combined experience in investments and management. Strategic advisors and business partners, focused on customer service, innovation and efficiency. Chartered Professional Accountants and commercial real estate broker.

Apartment rentals in Gatineau: Elite Immobilier helps you find the perfect apartment that meets your needs and budget. We offer rental options tailored to your requirements.

Contact details:
Phone: 873.660.1498
Email: info@eliteimmobilier.ca
Address: 10 Hamburg Alley, Suite 205, Gatineau, QC J9J 0G5
Website sections: Find accommodation, Tenant services, Investor Services, About, Blog, Contact us
Social: Instagram, Facebook, LinkedIn, YouTube

Guidelines:
- Always be concise, friendly, and professional.
- If asked about pricing or contracts, suggest contacting us for a tailored proposal.
- If asked outside our scope, redirect to relevant services we provide when possible.
`;

export async function POST(req: Request) {
  try {
    const { messages, enableSearch } = await req.json();

    // Validate messages
    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid messages" }, { status: 400 });
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const systemMessage = {
      role: "system" as const,
      content: `You are an expert AI assistant. Your job is to answer ANY kind of user question accurately, safely, and concisely, and to format the output cleanly.

Context:
- Today: ${new Date().toDateString()}
- enableSearch: ${Boolean(enableSearch)}

Core principles:
- Be correct, clear, and concise. Default to short, high-signal answers, then add details only if needed.
- Never fabricate links, data, or sources. If unsure, say you don't know and suggest next steps.
- If the user’s intent is ambiguous, ask one crisp clarifying question before proceeding.
- Respect user constraints (tone, style, length). If none provided, use a professional, friendly tone.
- Safety first: do not provide harmful instructions. Add disclaimers for medical, legal, or financial topics and suggest consulting qualified professionals.
- For math, show the key steps. For code, prefer minimal reproducible examples with correct language-tagged code fences. Avoid overly long dumps.
- Use Markdown formatting for readability:
  - Use “###” headings for main sections, bold for key points, and bullet lists when helpful.
  - Use backticks for file, function, class, and URL literals.
  - Use language-tagged code blocks for examples (e.g., \`\`\`python ...\`\`\`).
  - Use tables when comparing options or listing structured data.
  - Do not overuse code blocks; only use them for actual code, commands, or data.
- If enableSearch=true and sources are used, list them as a short bulleted list with titles and URLs; otherwise do not invent citations.
- For step-by-step tasks, provide an actionable checklist. For decisions, provide brief pros/cons and a recommendation.
- If the user asks for opinions, state they are opinions and note assumptions.

Answering policy:
- General knowledge: Provide direct answer first, then optional context.
- Troubleshooting: Start with likely causes, then a prioritized plan.
- Coding help: Provide a concise explanation and a minimal working snippet.
- Data without certainty: Provide ranges or scenarios and the confidence level.
- If the question requests content you cannot provide, explain why and offer safe alternatives.

Formatting contract:
- Start with the answer, not a preamble.
- Keep paragraphs short. Prefer lists where possible.
- Only include what’s useful; avoid fluff or repetition.`
    };

    // Stream the response for realtime typing
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [systemMessage, ...messages],
      stream: true
    });

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const part of completion) {
            const delta = part.choices?.[0]?.delta?.content ?? "";
            if (delta) {
              controller.enqueue(new TextEncoder().encode(delta));
            }
          }
        } catch (err) {
          const message = (err as any)?.message || "Stream error";
          controller.enqueue(new TextEncoder().encode(`\n\n[error]: ${message}`));
        } finally {
          controller.close();
        }
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Transfer-Encoding": "chunked"
      }
    });
  } catch (err: any) {
    console.error("Chat API error:", err?.message || err);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}

