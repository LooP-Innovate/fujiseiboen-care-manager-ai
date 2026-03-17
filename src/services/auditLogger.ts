export interface AuditLogEntry {
  timestamp: string;
  requestId: string;
  provider: string;
  model: string;
  latencyMs: number;
  success: boolean;
  usage?: {
    promptTokens: number;
    completionTokens: number;
  };
  errorType?: string;
  errorMessage?: string;
  metadata?: Record<string, any>;
}

export class AuditLogger {
  public static log(entry: AuditLogEntry): void {
    console.log('[AUDIT_LOG]', JSON.stringify({
      ...entry,
    }));
  }
}
