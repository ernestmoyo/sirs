"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Brain, X, Send, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { callSIRSAI, buildChatSystemPrompt } from "@/lib/ai";
import type { AIMessage } from "@/lib/ai";

const WELCOME_MESSAGE: AIMessage = {
  role: "assistant",
  content:
    "Hello! I'm your SIRS AI assistant. I can help with risk analysis, event monitoring, trigger assessments, and operational planning across the SADC region. What would you like to know?",
};

export default function AIChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => textareaRef.current?.focus(), 150);
    }
  }, [isOpen]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: AIMessage = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    // Build conversation history for the API (exclude welcome message if it's the first)
    const apiMessages = updatedMessages.filter(
      (_, i) => !(i === 0 && updatedMessages[0] === WELCOME_MESSAGE)
    );

    const result = await callSIRSAI({
      messages: apiMessages,
      systemPrompt: buildChatSystemPrompt(),
      maxTokens: 512,
    });

    const assistantMessage: AIMessage = {
      role: "assistant",
      content: result.error
        ? `⚠ ${result.error}`
        : result.content ||
          "I'm sorry, I couldn't generate a response. Please try again.",
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 ease-in-out",
          "bg-gradient-to-br from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600",
          "hover:shadow-blue-500/25 hover:shadow-xl",
          isOpen && "scale-0 opacity-0",
          !isOpen && "scale-100 opacity-100"
        )}
        aria-label="Open SIRS AI Assistant"
      >
        <Brain className="h-6 w-6" />
      </button>

      {/* Chat Panel */}
      <div
        className={clsx(
          "fixed bottom-6 right-6 z-50 flex w-[400px] flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl shadow-black/50 transition-all duration-300 ease-in-out",
          isOpen
            ? "pointer-events-auto h-[520px] scale-100 opacity-100"
            : "pointer-events-none h-0 scale-95 opacity-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-700 bg-slate-800 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-violet-500">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                SIRS AI Assistant
              </h3>
              <p className="text-xs text-slate-400">Regional risk analyst</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
            aria-label="Close chat"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={clsx(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={clsx(
                  "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-br-md bg-blue-600 text-white"
                    : "rounded-bl-md bg-slate-800 text-slate-200 border border-slate-700"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-slate-700 px-3 py-3">
          <div className="flex items-end gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about risks, events, triggers..."
              rows={1}
              className="max-h-[120px] flex-1 resize-none bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className={clsx(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200",
                input.trim() && !isLoading
                  ? "bg-gradient-to-br from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600"
                  : "text-slate-600 cursor-not-allowed"
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[10px] text-slate-600">
            Shift+Enter for new line
          </p>
        </div>
      </div>
    </>
  );
}
