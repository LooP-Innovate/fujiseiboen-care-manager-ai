import { ProviderFactory } from '../providers/factory';
import { PIIMasker } from '../security/piiMasker';
import { AuditLogger } from './auditLogger';
import { AIValidator } from '../validators/aiValidator';
import { prompts, TaskType } from '../prompts';
import { AIRequest, AIResponse } from '../types/ai';

export class AIService {
  public static async runChat(
    sessionId: string,
    task: TaskType,
    userPrompt: string,
    history: any[],
    onChunk: (chunk: string) => void,
    modelId?: string
  ): Promise<AIResponse> {
    const requestId = `req-${Date.now()}`;
    
    // Allowlist check
    const allowedModels = ['gemini-2.5-flash-lite', 'gpt-4o-mini'];
    const targetModel = modelId || 'gemini-2.5-flash-lite';
    
    if (!allowedModels.includes(targetModel)) {
      throw new Error(`許可されていないモデルです: ${targetModel}`);
    }

    const provider = ProviderFactory.getProvider(targetModel);
    
    // 1. PII Masking
    const { maskedText, placeholders } = PIIMasker.mask(userPrompt);
    
    // 2. Prepare Request DTO
    const request: AIRequest = {
      sessionId,
      messages: history,
      systemInstruction: prompts[task] || prompts['default'],
      userPrompt: maskedText,
      responseFormat: 'text',
    };

    const start = Date.now();
    try {
      // 3. Provider Call
      const response = await provider.generateStream(request, (chunk) => {
        onChunk(chunk);
      });

      // 4. Structured Data Parsing & Validation (Phase 2 Enhancement)
      let structuredData = response.structuredData;
      // Skip parsing if task is 'default' or if it's an intermediate step without JSON
      if (!structuredData && task === 'ケアプラン案') {
        const jsonMatch = response.content.match(/```json\n([\s\S]*?)\n```/) || 
                          response.content.match(/{[\s\S]*}/);
        if (jsonMatch) {
          try {
            // Defensive JSON parsing
            const jsonText = jsonMatch[1] ? jsonMatch[1].trim() : jsonMatch[0].trim();
            if (jsonText.startsWith('{') && jsonText.endsWith('}')) {
              structuredData = JSON.parse(jsonText);
            }
          } catch (e) {
            console.warn('[PARSE_ERROR] Failed to parse AI JSON response:', e);
          }
        }
      }

      let validation = { isValid: true, errors: [] as string[] };
      if (task === 'ケアプラン案' && structuredData) {
        validation = AIValidator.validateCarePlan(structuredData);
      }

      // 5. Audit Logging
      AuditLogger.log({
        timestamp: new Date().toISOString(),
        requestId,
        provider: response.metadata.provider,
        model: response.metadata.model,
        latencyMs: Date.now() - start,
        success: true,
        usage: response.metadata.usage,
        metadata: {
          validationErrors: validation.errors.length > 0 ? validation.errors : undefined,
          structuredDetected: !!structuredData
        }
      });

      return {
        ...response,
        structuredData,
        metadata: {
          ...response.metadata,
          validation
        }
      } as any;
    } catch (error: any) {
      AuditLogger.log({
        timestamp: new Date().toISOString(),
        requestId,
        provider: provider.name,
        model: 'unknown',
        latencyMs: Date.now() - start,
        success: false,
        errorType: error.name || 'ProviderError',
        errorMessage: error.message,
      });
      throw error;
    }
  }

  /**
   * Chained multi-step generation
   * STEP 1: Deep Analysis of assessment data
   * STEP 2: Goal setting based on analysis
   * STEP 3: Detailed Care Plan / Service draft
   */
  public static async runMultiStepChat(
    sessionId: string,
    userInput: string,
    onChunk: (chunk: string) => void,
    modelId?: string
  ): Promise<AIResponse> {
    const history: any[] = [];
    
    // Step 1: Deep Analysis
    onChunk('\n> **[STEP 1/3] アセスメント内容の深掘り分析中...**\n\n');
    const analysisResponse = await this.runChat(
      sessionId,
      'default',
      `以下のアセスメントデータを詳細に分析し、主要な生活課題を3つ、その背景要因（身体・精神・環境）とともに整理してください。必ず[根拠:...]を用いて事実に基づき分析してください。\n\n${userInput}`,
      [],
      onChunk,
      modelId
    );
    
    onChunk('\n\n---\n\n> **[STEP 2/3] 分析に基づいた目標設定中...**\n\n');
    history.push({ role: 'user', content: userInput });
    history.push({ role: 'assistant', content: analysisResponse.content });
    
    const goalResponse = await this.runChat(
      sessionId,
      'default',
      `上記の分析に基づき、それぞれの課題に対する「長期目標」と「短期目標」を提案してください。利用者本人の意向を尊重した内容にしてください。`,
      history,
      onChunk,
      modelId
    );
    
    onChunk('\n\n---\n\n> **[STEP 3/3] 具体的なサービス計画を作成中...**\n\n');
    history.push({ role: 'assistant', content: goalResponse.content });
    
    const finalPlanResponse = await this.runChat(
      sessionId,
      'ケアプラン案',
      `最終的なケアプラン案（サービス内容・頻度・留意点）を作成してください。これまでの分析と目標設定に矛盾がないようにしてください。最後に必ずJSONを出力してください。`,
      history,
      onChunk,
      modelId
    );

    return finalPlanResponse;
  }
}
