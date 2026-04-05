import { GoogleGenerativeAI } from '@google/generative-ai';
import { IAIProvider } from './base';
import { AIRequest, AIResponse } from '../types/ai';
import { config } from '../config/env';

export class VertexProvider implements IAIProvider {
  public readonly name = 'vertex';
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(config.vertex.apiKey || '');
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    console.log(`[VertexProvider] Generating text with model: ${config.vertex.model}`);
    console.log(`[VertexProvider] API Key length: ${config.vertex.apiKey?.length}, Prefix: ${config.vertex.apiKey?.substring(0, 4)}`);

    try {
      const model = this.genAI.getGenerativeModel({ 
        model: config.vertex.model,
        systemInstruction: request.systemInstruction,
      });

      const result = await model.generateContent(request.userPrompt);
      const response = await result.response;
      return {
        content: response.text(),
        metadata: {
          provider: this.name,
          model: config.vertex.model,
          latencyMs: Date.now() - start,
          usage: {
            promptTokens: response.usageMetadata?.promptTokenCount || 0,
            completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
          },
          finishReason: 'stop',
        },
      };
    } catch (error: any) {
      console.error('[VertexProvider] Error in generateText:', error);
      throw error;
    }
  }

  async generateStream(request: AIRequest, onChunk: (chunk: string) => void): Promise<AIResponse> {
    const start = Date.now();
    const model = this.genAI.getGenerativeModel({ 
      model: config.vertex.model, 
      systemInstruction: request.systemInstruction 
    });

    const result = await model.generateContentStream(request.userPrompt);
    
    let fullContent = '';
    for await (const chunk of result.stream) {
      const text = chunk.text();
      fullContent += text;
      onChunk(text);
    }

    const response = await result.response;

    return {
      content: fullContent,
      metadata: {
        provider: this.name,
        model: config.vertex.model,
        latencyMs: Date.now() - start,
        usage: {
          promptTokens: response.usageMetadata?.promptTokenCount || 0,
          completionTokens: response.usageMetadata?.candidatesTokenCount || 0,
        },
        finishReason: 'stop',
      },
    };
  }

  async generateStructured(request: AIRequest, schema: any): Promise<AIResponse> {
    const start = Date.now();
    const model = this.genAI.getGenerativeModel({
      model: config.vertex.model,
      systemInstruction: request.systemInstruction,
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(request.userPrompt);
    const text = result.response.text();

    return {
      content: text,
      structuredData: JSON.parse(text),
      metadata: {
        provider: this.name,
        model: config.vertex.model,
        latencyMs: Date.now() - start,
        finishReason: 'stop',
      },
    };
  }
}
