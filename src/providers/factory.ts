import { config } from '../config/env';
import { IAIProvider } from './base';
import { OpenAIProvider } from './openai';
import { VertexProvider } from './vertex';

export class ProviderFactory {
  private static providers: Record<string, IAIProvider> = {};

  public static getProvider(modelId?: string): IAIProvider {
    const defaultProvider = config.aiProvider;
    
    // If a specific modelId is provided, we map it to a provider
    let providerName = defaultProvider;
    if (modelId === 'gpt-4o-mini' || modelId?.startsWith('gpt-')) {
      providerName = 'openai';
    } else if (modelId === 'gemini-2.5-flash-lite' || modelId?.includes('gemini-')) {
      providerName = 'vertex';
    }

    if (this.providers[providerName]) {
      return this.providers[providerName];
    }

    let provider: IAIProvider;
    switch (providerName) {
      case 'openai':
        provider = new OpenAIProvider();
        break;
      case 'vertex':
        provider = new VertexProvider();
        break;
      default:
        console.error(`[ProviderFactory] Unknown provider requested: "${providerName}"`);
        throw new Error(`Unknown AI provider: ${providerName}`);
    }

    this.providers[providerName] = provider;
    return provider;
  }
}
