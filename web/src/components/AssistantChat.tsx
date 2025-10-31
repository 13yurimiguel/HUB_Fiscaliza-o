"use client";

import { FormEvent, useState } from "react";
import type { AssistantContext, ChatResponse } from "@/services/api/assistant";
import { sendChatMessage } from "@/services/api/assistant";

export interface AssistantChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface AssistantChatProps {
  conversationId: string;
  context: AssistantContext;
  onAssistantResponse?: (message: ChatResponse) => void;
}

export function AssistantChat({ conversationId, context, onAssistantResponse }: AssistantChatProps) {
  const [messages, setMessages] = useState<AssistantChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: AssistantChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await sendChatMessage({
        conversation_id: conversationId,
        query: input,
        context
      });

      const assistantMessage: AssistantChatMessage = {
        role: "assistant",
        content: response.response
      };
      setMessages((prev) => [...prev, assistantMessage]);
      onAssistantResponse?.(response);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setInput("");
      setIsLoading(false);
    }
  };

  return (
    <div className="card" style={{ marginTop: "2rem" }}>
      <h3>Assistente ISO 9001</h3>
      <div style={{ maxHeight: "320px", overflowY: "auto", marginBottom: "1rem", border: "1px solid #cbd5f5", borderRadius: "8px", padding: "1rem" }}>
        {messages.length === 0 && (
          <p style={{ color: "#64748b" }}>
            Compartilhe dúvidas sobre a obra ou peça apoio para redigir seções do relatório seguindo a norma ISO 9001.
          </p>
        )}
        {messages.map((message, index) => (
          <div key={`${message.role}-${index}`} style={{ marginBottom: "0.75rem" }}>
            <strong>{message.role === "assistant" ? "Assistente" : "Você"}</strong>
            <p style={{ whiteSpace: "pre-wrap", margin: "0.25rem 0 0" }}>{message.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "0.5rem" }}>
        <textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          rows={2}
          placeholder="Pergunte ao assistente..."
          style={{ flex: 1, borderRadius: "8px", border: "1px solid #cbd5f5", padding: "0.75rem" }}
        />
        <button className="button" type="submit" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar"}
        </button>
      </form>
      {error && <p style={{ color: "#ef4444", marginTop: "0.5rem" }}>{error}</p>}
    </div>
  );
}
