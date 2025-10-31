export interface AssistantPhotoContext {
  url?: string;
  caption?: string;
  tags?: string[];
}

export interface AssistantChecklistContext {
  title?: string;
  status?: string;
  non_conformities?: string[];
}

export interface AssistantWorksiteContext {
  name?: string;
  location?: string;
  status?: string;
  description?: string;
}

export interface AssistantContext {
  worksite?: AssistantWorksiteContext;
  photos?: AssistantPhotoContext[];
  checklists?: AssistantChecklistContext[];
}

export interface ChatRequest {
  conversation_id: string;
  query: string;
  context?: AssistantContext;
}

export interface ChatResponse {
  conversation_id: string;
  response: string;
}

export interface SuggestionRequest {
  conversation_id: string;
  report_section: string;
  summary?: string;
  context?: AssistantContext;
}

export interface SuggestionResponse {
  conversation_id: string;
  section: string;
  suggestion: string;
}

const ASSISTANT_BASE = process.env.NEXT_PUBLIC_ASSISTANT_API_URL || "http://localhost:8001";

async function assistantPost<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${ASSISTANT_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Assistant API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

export function sendChatMessage(payload: ChatRequest) {
  return assistantPost<ChatResponse>("/chat", payload);
}

export function requestReportSuggestion(payload: SuggestionRequest) {
  return assistantPost<SuggestionResponse>("/suggestion", payload);
}
