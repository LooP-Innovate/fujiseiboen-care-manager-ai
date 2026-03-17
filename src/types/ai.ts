export type AIRole = "user" | "assistant" | "system";

export interface AIMessage {
  role: AIRole;
  content: string;
}

export interface AIRequest {
  sessionId: string;
  messages: AIMessage[];
  systemInstruction: string;
  userPrompt: string;
  responseFormat?: "text" | "json";
  schemaName?: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    fallbackEnabled?: boolean;
  };
  metadata?: Record<string, any>;
}

export interface AIResponse {
  content: string;
  structuredData?: any;
  metadata: {
    provider: string;
    model: string;
    latencyMs: number;
    usage?: {
      promptTokens: number;
      completionTokens: number;
    };
    finishReason: string;
    validation?: {
      isValid: boolean;
      errors: string[];
    };
  };
}
