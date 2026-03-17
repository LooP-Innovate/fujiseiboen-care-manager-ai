// Phase 2 Verification Suite (Self-contained)

const PROHIBITED_TERMS = ['不明', '適当に', '〜かもしれない', 'たぶん', '絶対に', '必ず治る', 'ダメ', '無理'];

function validateCarePlan(data) {
  const errors = [];
  const requiredFields = ["assessment", "issues", "longTermGoal", "shortTermGoal", "services", "monitoring"];
  
  for (const field of requiredFields) {
    if (!data[field]) {
      errors.push(`Missing required field: ${field}`);
    } else if (field === 'issues' || field === 'services') {
      if (!Array.isArray(data[field]) || data[field].length === 0) {
        errors.push(`Field ${field} must be a non-empty array`);
      }
    }
  }

  const fullText = JSON.stringify(data);
  for (const term of PROHIBITED_TERMS) {
    if (fullText.includes(term)) {
      errors.push(`Contains prohibited term: ${term}`);
    }
  }

  return { isValid: errors.length === 0, errors };
}

async function runTests() {
  console.log('=== Phase 2 Verification Suite ===\n');

  // 1. Schema Validation Test
  console.log('--- Test 1: Schema Validation ---');
  const validData = {
    assessment: "ADLは自立しているが、認知機能の低下が見られる。",
    issues: ["独居による孤立感", "転倒のリスク"],
    longTermGoal: "住み慣れた地域で安心して暮らし続ける",
    shortTermGoal: "週2回のデイサービス利用で交流を深める",
    services: ["通所介護", "訪問介護"],
    monitoring: "デイサービスでの表情や発言"
  };
  const validResult = validateCarePlan(validData);
  console.log('[Valid Data Case]:', validResult.isValid ? 'OK' : 'FAIL');
  if (!validResult.isValid) console.log('  Errors:', validResult.errors);

  const invalidData = {
    assessment: "不明です", // Contains prohibited term '不明'
    issues: [], // Empty array
    // Missing other fields
  };
  const invalidResult = validateCarePlan(invalidData);
  console.log('[Invalid Data Case]:', !invalidResult.isValid ? 'OK (Correctly rejected)' : 'FAIL');
  console.log('  Errors:', JSON.stringify(invalidResult.errors));

  // 2. Prohibited Expressions Test
  console.log('\n--- Test 2: Prohibited Expressions ---');
  const badText = { ...validData, assessment: "絶対に大丈夫です" }; // '絶対に' is prohibited
  console.log('[Prohibited Case]:', !validateCarePlan(badText).isValid ? 'OK (Correctly rejected)' : 'FAIL');

  console.log('\n=== All Tests Completed ===');
}

runTests().catch(console.error);
