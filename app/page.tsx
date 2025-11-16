/* "use client" */
"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import type { ReactNode, HTMLAttributes } from "react";
import { AIInputWithSearch } from "@/components/AIInputWithSearch";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Logo from "../logo.png";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  quickReplies?: Array<{ label: string; value: string }>;
  requiresInput?: boolean;
  inputType?: string;
};

type CodeRendererProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
  node?: unknown;
};

export default function HomePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "hello",
      role: "assistant",
      content: "Hello! I'm your Elite Immobilier assistant. I can help with maintenance requests, billing, lease questions, and more. How can I assist you today?",
      quickReplies: [
        { label: "🔧 Maintenance", value: "maintenance" },
        { label: "💳 Billing", value: "billing" },
        { label: "📄 Lease", value: "lease" },
        { label: "🚨 Emergency", value: "emergency" },
        { label: "👤 Talk to Person", value: "handoff" }
      ]
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useCallback(async (value: string, withSearch: boolean = false) => {
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: value };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    
    try {
      const payload = {
        messages: messages
          .concat(userMsg)
          .map((m) => ({ role: m.role, content: m.content })),
        sessionId: sessionId,
        userId: undefined // Could be set from auth context
      };
      
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const responseData = await res.json();
      
      if (responseData.error) {
        throw new Error(responseData.error);
      }

      // Update session ID
      if (responseData.sessionId && !sessionId) {
        setSessionId(responseData.sessionId);
      }

      // Create assistant message
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: responseData.message,
        quickReplies: responseData.quickReplies || [],
        requiresInput: responseData.requiresInput,
        inputType: responseData.inputType
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // Auto-scroll to bottom
      setTimeout(() => {
        scrollerRef.current?.scrollTo({ 
          top: scrollerRef.current.scrollHeight, 
          behavior: "smooth" 
        });
      }, 100);

    } catch (error) {
      console.error('Chat error:', error);
      const errMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I encountered a problem. Please try again or contact us directly at 873.660.1498."
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
      setStreamingId(null);
    }
  }, [messages, sessionId]);

  // Handle quick reply button clicks
  const handleQuickReply = useCallback((value: string) => {
    sendMessage(value, false);
  }, [sendMessage]);

  const Header = useMemo(
    () => (
      <div className="container-max px-6 pt-12 pb-6">
        <div className="rounded-3xl bg-deep-blue-gradient bg-brand-deep text-white p-8 md:p-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <Image src={Logo} alt="Elite Immobilier" width={20} height={20} className="rounded-[3px]" />
              <p className="uppercase tracking-widest text-brand-light/90 text-xs md:text-sm">Elite Immobilier</p>
            </div>
            <h1 className="mt-3 text-3xl md:text-5xl font-semibold leading-tight">
              Discover excellence in property management in Gatineau
            </h1>
            <p className="mt-4 text-brand-light/90">
              From tenant communication to property maintenance, our dedicated team ensures your peace of mind and
              maximizes your returns.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1 rounded-full bg-white/10 text-brand-light border border-white/20 text-xs">
                Investor Services
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-brand-light border border-white/20 text-xs">
                Tenant Services
              </span>
              <span className="px-3 py-1 rounded-full bg-white/10 text-brand-light border border-white/20 text-xs">
                Building Management
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    []
  );

  return (
    <main className="min-h-screen bg-white">
      {Header}

      <section className="container-max px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <aside className="lg:col-span-1">
            <div className="rounded-2xl border border-brand-deep/10 p-6 sticky top-6">
              <h2 className="text-xl font-semibold text-brand-deep">Contact details</h2>
              <ul className="mt-4 space-y-2 text-brand-deep/80">
                <li><strong>Phone:</strong> 873.660.1498</li>
                <li><strong>Email:</strong> info@eliteimmobilier.ca</li>
                <li><strong>Address:</strong> 10 Hamburg Alley, Suite 205, Gatineau, QC J9J 0G5</li>
              </ul>
              <div className="mt-6 text-sm text-brand-deep/70">
                Have questions? Ask the assistant below for quick guidance.
              </div>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-brand-deep/10 overflow-hidden flex flex-col">
              <div className="bg-brand-light/60 px-4 py-3 text-sm text-brand-deep/70">
                Chat with our assistant about services, rentals, or consultations.
              </div>

              <div
                ref={scrollerRef}
                className="h-[560px] overflow-y-auto p-4 bg-neutral-50"
              >
                <div className="space-y-4">
                  {messages.map((m) => (
                    <div key={m.id} className={cn(
                      "flex w-full",
                      m.role === "user" ? "justify-end" : "justify-start"
                    )}>
                      <div className={cn(
                        "flex items-start gap-3 max-w-[85%] md:max-w-[70%]",
                        m.role === "user" ? "flex-row-reverse" : "flex-row"
                      )}>
                        <div className={cn(
                          "w-8 h-8 rounded-full overflow-hidden text-xs font-semibold select-none",
                          m.role === "user" ? "bg-brand-accent/20 text-brand-accent flex items-center justify-center" : "relative bg-white border border-brand-deep/10 flex-none shrink-0"
                        )}>
                          {m.role === "user" ? "You" : (
                            <Image
                              src={Logo}
                              alt="Elite assistant"
                              fill
                              sizes="32px"
                              className="object-contain"
                            />
                          )}
                        </div>
                        <div className={cn(
                          "rounded-2xl px-4 py-3 border",
                          m.role === "user"
                            ? "bg-white text-brand-deep border-brand-accent/30"
                            : "bg-white text-brand-deep border-brand-deep/10"
                        )}>
                          {m.role === "assistant" ? (
                            <div className="leading-relaxed markdown-body">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeSanitize]}
                                components={{
                                  h3: ({ node, ...props }) => <h3 className="text-[15px] font-semibold mt-2 mb-1" {...props} />,
                                  h4: ({ node, ...props }) => <h4 className="text-[14px] font-semibold mt-2 mb-1" {...props} />,
                                  p: ({ node, ...props }) => <p className="mt-2 text-[14px] leading-[1.6]" {...props} />,
                                  strong: ({ node, ...props }) => <strong className="font-semibold" {...props} />,
                                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                                  ul: ({ node, ...props }) => <ul className="list-disc pl-5 my-2 space-y-1" {...props} />,
                                  ol: ({ node, ...props }) => <ol className="list-decimal pl-5 my-2 space-y-1" {...props} />,
                                  li: ({ node, ...props }) => <li className="text-[14px]" {...props} />,
                                  code: ({ inline, className, children, ...props }: CodeRendererProps) => {
                                    const isInline = inline ?? false;
                                    if (isInline) {
                                      return <code className="px-1.5 py-[1px] rounded bg-neutral-100 text-[12px]" {...props}>{children}</code>;
                                    }
                                    return (
                                      <pre className="bg-neutral-900 text-neutral-100 rounded-lg p-3 overflow-x-auto text-[12px]">
                                        <code {...props} className={className}>{children}</code>
                                      </pre>
                                    );
                                  },
                                  blockquote: ({ node, ...props }) => (
                                    <blockquote className="border-l-4 border-neutral-200 pl-3 my-2 text-neutral-700" {...props} />
                                  ),
                                  table: ({ node, ...props }) => (
                                    <div className="overflow-x-auto my-3">
                                      <table className="min-w-full text-left text-[13px] border-collapse" {...props} />
                                    </div>
                                  ),
                                  thead: ({ node, ...props }) => <thead className="bg-neutral-50" {...props} />,
                                  th: ({ node, ...props }) => <th className="border px-2 py-1 font-semibold" {...props} />,
                                  td: ({ node, ...props }) => <td className="border px-2 py-1 align-top" {...props} />,
                                  a: ({ node, ...props }) => <a className="text-brand-accent underline underline-offset-2" target="_blank" rel="noreferrer" {...props} />
                                }}
                              >
                                {m.content}
                              </ReactMarkdown>
                              {streamingId === m.id && (
                                <span className="inline-block w-[6px] h-4 align-baseline bg-brand-deep/60 ml-0.5 animate-pulse" />
                              )}
                              
                              {/* Quick Reply Buttons */}
                              {m.quickReplies && m.quickReplies.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {m.quickReplies.map((reply, index) => (
                                    <button
                                      key={index}
                                      onClick={() => handleQuickReply(reply.value)}
                                      className="px-3 py-1.5 text-sm bg-brand-accent/10 text-brand-accent border border-brand-accent/30 rounded-full hover:bg-brand-accent/20 transition-colors duration-200"
                                      disabled={loading}
                                    >
                                      {reply.label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap leading-relaxed">
                              {m.content}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {loading && !streamingId && (
                    <div className="flex items-center gap-2 text-brand-deep/60 pl-11">
                      <span className="inline-block w-2 h-2 rounded-full bg-brand-deep/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="inline-block w-2 h-2 rounded-full bg-brand-deep/40 animate-bounce" style={{ animationDelay: "120ms" }} />
                      <span className="inline-block w-2 h-2 rounded-full bg-brand-deep/40 animate-bounce" style={{ animationDelay: "240ms" }} />
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-brand-deep/10 bg-white px-3 py-3">
                <AIInputWithSearch
                  placeholder="Ask about property management, rentals, or consultations..."
                  onSubmit={sendMessage}
                  onFileSelect={() => {}}
                  className="bg-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-brand-deep/10 p-6">
            <h3 className="font-semibold text-brand-deep">Tenant services</h3>
            <p className="mt-2 text-sm text-brand-deep/70">
              Clear communication, quick responses, and regular maintenance—your comfort is our priority.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-deep/10 p-6">
            <h3 className="font-semibold text-brand-deep">Building management</h3>
            <p className="mt-2 text-sm text-brand-deep/70">
              Rental management, maintenance, rent collection, and admin—handled with transparency.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-deep/10 p-6">
            <h3 className="font-semibold text-brand-deep">About ELITE</h3>
            <p className="mt-2 text-sm text-brand-deep/70">
              30+ years of combined experience. Strategic, client-focused, efficient, and professional.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

