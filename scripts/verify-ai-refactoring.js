const CONTEXT_NAME_PATTERN = /(?:利用者名|氏名|家族名|担当者名)[:：]\s*([一-龠]{1,4}|[ぁ-んァ-ヶ]{1,8})/g;
const HONORIFIC_NAME_PATTERN = /([一-龠]{1,4}|[ぁ-んァ-ヶ]{1,8})(?:様|さん|氏|殿|君|ちゃん)/g;
const ADDR_PATTERN = /(?:東京都|道|府|県|市|区|町|村).{1,20}[0-9-]{1,10}/g;
const TEL_PATTERN = /0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}/g;
const ID_PATTERN = /[0-9]{10}/g;

function mask(text) {
  const placeholders = {};
  let counter = 1;

  let maskedText = text
    .replace(TEL_PATTERN, (match) => {
      const key = `{TEL_${counter++}}`;
      placeholders[key] = match;
      return key;
    })
    .replace(ADDR_PATTERN, (match) => {
      const key = `{住所_${counter++}}`;
      placeholders[key] = match;
      return key;
    })
    .replace(ID_PATTERN, (match) => {
      const key = `{ID_${counter++}}`;
      placeholders[key] = match;
      return key;
    })
    .replace(CONTEXT_NAME_PATTERN, (match, p1) => {
      const key = `{氏名_${counter++}}`;
      placeholders[key] = p1;
      return match.replace(p1, key);
    })
    .replace(HONORIFIC_NAME_PATTERN, (match, p1) => {
      const key = `{氏名_${counter++}}`;
      placeholders[key] = p1;
      return match.replace(p1, key);
    });

  return { maskedText, placeholders };
}

async function runVerification() {
  console.log('=== PII Enhancement Verification ===\n');

  // 2. PII Maskingの実例 (Enhanced)
  console.log('--- 2. Enhanced PII Masking Sample ---');
  const input = '利用者名：佐藤様。付添いの田中さん（長女）と来院。担当者名：鈴木氏。住所：東京都新宿区西新宿2-8-1、電話：090-1234-5678。';
  console.log('[Input Example]:', input);
  
  const { maskedText, placeholders } = mask(input);
  console.log('[Masked Data (Sent to LLM)]:', maskedText);
  console.log('[Placeholders]:', JSON.stringify(placeholders, null, 2));

  // 1. Vertex / OpenAI 実行結果 (Simulation)
  console.log('\n--- 1. Provider Execution Results (Simulation) ---');
  const providers = ['vertex', 'openai'];
  
  for (const provider of providers) {
    console.log(`\n[Provider: ${provider}]`);
    const start = Date.now();
    const chunks = provider === 'vertex' ? ['承知', 'しました', '。', 'ケア', 'プラン', 'の', '素案', 'を', '作成', 'します', '。'] : ['I', ' understand.', ' I', ' will', ' create', ' a', ' draft', ' care', ' plan.'];
    
    let fullContent = '';
    console.log('[Streaming Chunks]:');
    for (const chunk of chunks) {
      process.stdout.write(chunk + '...');
      fullContent += chunk;
      await new Promise(r => setTimeout(r, 80));
    }
    console.log('\n[Full Content]:', fullContent);

    // 3. 監査ログのサンプル
    console.log('\n--- 3. Audit Log Sample ---');
    const logEntry = {
      timestamp: new Date().toISOString(),
      requestId: `req-${Date.now()}`,
      provider: provider,
      model: provider === 'vertex' ? 'gemini-1.5-pro' : 'gpt-4o',
      latencyMs: Date.now() - start + 420,
      success: true,
      usage: {
        promptTokens: 156,
        completionTokens: 82
      }
    };
    console.log('[AUDIT_LOG]', JSON.stringify(logEntry, null, 2));
  }
}

runVerification().catch(console.error);
