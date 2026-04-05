import OpenAI from 'openai';
import { IAIProvider } from './base';
import { AIRequest, AIResponse } from '../types/ai';
import { config } from '../config/env';

export class OpenAIProvider implements IAIProvider {
  public readonly name = 'openai';
  private client: OpenAI;

  constructor() {
    this.client = new OpenAI({
      apiKey: config.openai.apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model: config.openai.model,
      messages: this.mapMessages(request),
      temperature: request.options?.temperature,
      max_tokens: request.options?.maxTokens,
    });

    return {
      content: response.choices[0].message.content || '',
      metadata: {
        provider: this.name,
        model: response.model,
        latencyMs: Date.now() - start,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
        },
        finishReason: response.choices[0].finish_reason || 'stop',
      },
    };
  }

  async generateStream(request: AIRequest, onChunk: (chunk: string) => void): Promise<AIResponse> {
    const start = Date.now();
    const stream = await this.client.chat.completions.create({
      model: config.openai.model,
      messages: this.mapMessages(request),
      stream: true,
      temperature: request.options?.temperature,
      max_tokens: request.options?.maxTokens,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      fullContent += text;
      onChunk(text);
    }

    return {
      content: fullContent,
      metadata: {
        provider: this.name,
        model: config.openai.model,
        latencyMs: Date.now() - start,
        finishReason: 'stop',
      },
    };
  }

  async generateStructured(request: AIRequest, schema: any): Promise<AIResponse> {
    const start = Date.now();
    const response = await this.client.chat.completions.create({
      model: config.openai.model,
      messages: [
        ...this.mapMessages(request),
        { role: 'system', content: `Respond in JSON format according to this schema: ${JSON.stringify(schema)}` }
      ],
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0].message.content || '{}';
    return {
      content,
      structuredData: JSON.parse(content),
      metadata: {
        provider: this.name,
        model: config.openai.model,
        latencyMs: Date.now() - start,
        usage: {
          promptTokens: response.usage?.prompt_tokens || 0,
          completionTokens: response.usage?.completion_tokens || 0,
        },
        finishReason: response.choices[0].finish_reason || 'stop',
      },
    };
  }

  private mapMessages(request: AIRequest): any[] {
    const msgs = request.messages.map(m => ({
      role: m.role,
      content: m.content,
    }));
    if (request.systemInstruction) {
      msgs.unshift({ role: 'system', content: request.systemInstruction });
    }
    return msgs;
  }
}
