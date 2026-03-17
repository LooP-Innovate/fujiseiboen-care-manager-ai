import { PIIMasker } from '../src/security/piiMasker';
import { AuditLogger } from '../src/services/auditLogger';

async function runVerification() {
  console.log('=== AI Refactoring Verification ===\n');

  // 2. PII Maskingの実例
  console.log('--- 2. PII Masking Sample ---');
  const input = '佐藤さんの電話番号は090-1234-5678、住所は東京都新宿区西新宿2-8-1、患者IDは1234567890です。';
  console.log('[Input Example]:', input);
  
  const { maskedText, placeholders } = PIIMasker.mask(input);
  console.log('[Masked Data (Sent to LLM)]:', maskedText);
  console.log('[Placeholders]:', JSON.stringify(placeholders, null, 2));

  // 1. Vertex / OpenAI 実行結果 (Mocked)
  console.log('\n--- 1. Provider Execution Results (Simulation) ---');
  const task = 'CarePlanGeneration';
  const providers = ['vertex', 'openai'];
  
  for (const provider of providers) {
    console.log(`\n[Provider: ${provider}]`);
    const start = Date.now();
    const chunks = provider === 'vertex' ? ['ケア', 'プラン', 'を', '作', '成', 'し', 'ま', 'し', 'た', '。'] : ['Generated', ' care', ' plan', ' for', ' user.'];
    
    let fullContent = '';
    console.log('[Streaming Chunks]:');
    for (const chunk of chunks) {
      process.stdout.write(chunk + '...');
      fullContent += chunk;
      await new Promise(r => setTimeout(r, 50));
    }
    console.log('\n[Full Content]:', fullContent);

    // 3. 監査ログのサンプル
    console.log('\n--- 3. Audit Log Sample ---');
    AuditLogger.log({
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`,
      provider: provider,
      model: provider === 'vertex' ? 'gemini-1.5-pro' : 'gpt-4o',
      latencyMs: Date.now() - start,
      success: true,
      usage: {
        promptTokens: 120,
        completionTokens: 45
      }
    });
  }
}

runVerification().catch(console.error);
