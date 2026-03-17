export interface Config {
  aiProvider: 'vertex' | 'openai' | 'mock';
  autoFallback: boolean;
  secondaryProvider?: 'vertex' | 'openai' | 'mock';
  
  vertex: {
    project: string;
    location: string;
    model: string;
    apiKey?: string;
  };
  
  openai: {
    apiKey: string;
    model: string;
  };
}

function getEnv(key: string): string {
  // Vite automatically exposes variables prefixed with VITE_ to the browser
  const envKey = `VITE_${key}`;
  const value = (import.meta as any).env[envKey] || '';
  return value.trim();
}

export const config: Config = {
  aiProvider: (getEnv('AI_PROVIDER') as any) || 'vertex',
  autoFallback: getEnv('AUTO_FALLBACK') === 'true',
  secondaryProvider: getEnv('SECONDARY_PROVIDER') as any,
  
  vertex: {
    project: '', 
    location: getEnv('GOOGLE_CLOUD_LOCATION') || 'us-central1',
    model: getEnv('VERTEX_MODEL') || 'gemini-1.5-pro',
    apiKey: getEnv('GEMINI_API_KEY'),
  },
  
  openai: {
    apiKey: getEnv('OPENAI_API_KEY'),
    model: getEnv('OPENAI_MODEL') || 'gpt-4o',
  },
};

// Debug logs for environment variables
console.log('[CONFIG] AI Provider:', config.aiProvider);
console.log('[CONFIG] Gemini API Key prefix:', config.vertex.apiKey ? `${config.vertex.apiKey.substring(0, 4)}...` : 'MISSING');
console.log('[CONFIG] OpenAI API Key prefix:', config.openai.apiKey ? `${config.openai.apiKey.substring(0, 4)}...` : 'MISSING');

export function validateConfig() {
  if (config.aiProvider === 'vertex') {
    if (!config.vertex.project && !config.vertex.apiKey) {
      throw new Error("Vertex AI requires GOOGLE_CLOUD_PROJECT or GEMINI_API_KEY.");
    }
  } else if (config.aiProvider === 'openai') {
    if (!config.openai.apiKey) {
      throw new Error("OpenAI requires OPENAI_API_KEY.");
    }
  }
}
