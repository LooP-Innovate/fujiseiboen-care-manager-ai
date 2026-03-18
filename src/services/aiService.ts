import { ProviderFactory } from '../providers/factory';
import { AuditLogger } from './auditLogger';
import { prompts, TaskType } from '../prompts';
import { AIRequest, AIResponse } from '../types/ai';

export class AIService {
  /**
   * Run a simple chat request using Gemini only (Phase 1 MVP)
   */
  public static async runChat(
    sessionId: string,
    task: TaskType,
    userPrompt: string,
    history: any[],
    modelId?: string
  ): Promise<AIResponse> {
    const requestId = `req-${Date.now()}`;
    
    // Allow model selection, fallback to Gemini MVP default
    const targetModel = modelId || 'gemini-2.5-flash-lite';
    const provider = ProviderFactory.getProvider(targetModel);
    
    // Prepare Request DTO
    const request: AIRequest = {
      sessionId,
      messages: history,
      systemInstruction: prompts[task] || prompts['default'],
      userPrompt: userPrompt, // PII Masking moved to Phase 2
      responseFormat: 'text',
    };

    const start = Date.now();
    try {
      // Provider Call (Non-streaming for MVP)
      const response = await provider.generate(request);

      // Audit Logging
      AuditLogger.log({
        timestamp: new Date().toISOString(),
        requestId,
        provider: response.metadata.provider,
        model: response.metadata.model,
        latencyMs: Date.now() - start,
        success: true,
        usage: response.metadata.usage
      });

      return response;
    } catch (error: any) {
      AuditLogger.log({
        timestamp: new Date().toISOString(),
        requestId,
        provider: provider.name,
        model: targetModel,
        latencyMs: Date.now() - start,
        success: false,
        errorType: error.name || 'ProviderError',
        errorMessage: error.message,
      });
      throw error;
    }
  }
}
