import { AIRequest, AIResponse } from '../types/ai';

export interface IAIProvider {
  readonly name: string;
  generate(request: AIRequest): Promise<AIResponse>;
  generateStream(request: AIRequest, onChunk: (chunk: string) => void): Promise<AIResponse>;
  generateStructured(request: AIRequest, schema: any): Promise<AIResponse>;
}
