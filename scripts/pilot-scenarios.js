/**
 * Phase 3: Pilot Scenarios Verification Script (Self-contained JS)
 */

// Ported PII Masking Logic from src/security/piiMasker.ts
const PII_PATTERNS = {
  phone: /(0\d{1,4}[-(]\d{1,4}[-)]\d{3,4}|\d{2,4}-\d{2,4}-\d{4})/g,
  address: /(東京都|大阪府|京都府|北海道|[\u4e00-\u9fa1]{2,3}県)(新宿区|[\u4e00-\u9fa1]{2,10}(市|区|町|村)).*?(\d{1,4}[-－]\d{1,4}([-－]\d{1,4})?|[\d一二三四五六七八九十百千万]{1,10}番(地)?)/g,
  id: /[A-Z]{1,2}\d{5,10}/g,
  labeledName: /(利用者名|家族名|担当者名|氏名)[:：]\s*([\u4e00-\u9fa1\u3040-\u309f\u30a0-\u30ff]{2,10})/g,
  honorificName: /([\u4e00-\u9fa1\u3040-\u309f\u30a0-\u30ff]{2,5})(様|殿|さん|君|くん|ちゃん)/g,
};

function maskPii(text) {
  let masked = text;
  const placeholders = {};
  let counter = 1;

  for (const [type, pattern] of Object.entries(PII_PATTERNS)) {
    masked = masked.replace(pattern, (match, ...args) => {
      const key = `{${type}_${counter++}}`;
      placeholders[key] = match;
      return key;
    });
  }
  return { masked, placeholders };
}

// Logic from AIValidator
const PROHIBITED_TERMS = ['不明', '適当に', '〜かもしれない', 'たぶん', '絶対に', '必ず治る', 'ダメ', '無理'];
function validate(data) {
  const errors = [];
  const fullText = JSON.stringify(data);
  for (const term of PROHIBITED_TERMS) {
    if (fullText.includes(term)) errors.push(`Contains prohibited term: ${term}`);
  }
  return { isValid: errors.length === 0, errors };
}

// Scenarios
const SCENARIOS = [
  {
    name: "Scenario A: 独居高齢者の歩行不安",
    input: "利用者名：田中太郎。85歳。港区芝浦4-1-1居住。電話03-9999-8888。最近歩行が不安定。独居で火の扱いが危ない。デイサービスに通って栄養のある食事をとりたい。",
    output: {
      assessment: "{氏名_1}様は85歳の独居男性。要介護1。歩行が不安定であり、転倒リスクと調理による火災リスクがある。栄養状態の改善を希望されている。",
      issues: ["転倒による事故のリスク", "火不始末の恐れ", "栄養の偏り"],
      longTermGoal: "住み慣れた地域で、健康で安全な生活を維持する",
      shortTermGoal: "デイサービスでのリハビリと栄養バランスの良い食事の摂取",
      services: ["通所介護", "配食サービス"],
      monitoring: "歩行状態の改善と食事摂取状況"
    }
  },
  {
    name: "Scenario B: 認知症と介護者負担",
    input: "利用者名：阿部勘十郎。要介護3。徘徊あり。妻の美智子さんは腰痛。新宿区上落合3-10-15居住。電話080-1111-2222。",
    output: {
        assessment: "{氏名_1}様は要介護3。深夜の徘徊があり、ご家族の介護負担が大きい状態。「絶対に」目を離せない状況が続いている。", // Intentionally includes prohibited term for testing
        issues: ["徘徊による行方不明リスク", "主介護者の腰痛と精神的負担"],
        longTermGoal: "本人と家族が穏やかに生活を続けられる環境を整える",
        shortTermGoal: "ショートステイの利用による介護者の休息",
        services: ["小規模多機能型居宅介護", "短期入所生活介護"],
        monitoring: "徘徊頻度の変化と介護者の状態"
    }
  }
];

function run() {
  console.log('=== Phase 3: Pilot Real-Data Verification Report ===\n');

  SCENARIOS.forEach(s => {
    console.log(`--- ${s.name} ---`);
    const { masked, placeholders } = maskPii(s.input);
    console.log('[1. Masking Test]');
    console.log('   Input:', s.input);
    console.log('   Masked:', masked);
    console.log('   PII Detected:', Object.keys(placeholders).length > 0 ? 'OK' : 'FAIL');

    console.log('[2. Output Validation]');
    const vResult = validate(s.output);
    console.log('   Status:', vResult.isValid ? 'PASSED' : 'WARNING');
    if (!vResult.isValid) {
      console.log('   Validation Errors:', JSON.stringify(vResult.errors));
    }
    console.log();
  });

  console.log('=== End of Report ===');
}

run();
