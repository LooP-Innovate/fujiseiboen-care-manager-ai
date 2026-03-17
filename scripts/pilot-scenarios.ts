/**
 * Phase 3: Pilot Scenarios Verification Script (TypeScript)
 */
import { PIIMasker } from '../src/security/piiMasker';
import { AIValidator } from '../src/validators/aiValidator';

// Mocked AI Output for Scenario A
const AI_OUTPUT_SCENARIO_A = {
  assessment: "{氏名_1}様は85歳の独居男性。要介護2。最近、歩行時のふらつきが目立ち、転倒への不安から外出を控えている。食事面では火の扱いが危うく、栄養の偏りが懸念される。",
  issues: ["転倒による負傷のリスク", "社会的孤立", "低栄養状態の恐れ"],
  longTermGoal: "住み慣れた地域で、転倒することなく安全に自立した生活を維持する",
  shortTermGoal: "週2回のデイサービス利用で運動習慣をつけ、外出の機会を増やす",
  services: ["通所介護（リハビリ重視型）", "配食サービス"],
  monitoring: "デイサービスでの歩行状態の安定度、体重の変化"
};

// Scenario B: Dementia & Family Stress (PII Stress test)
const INPUT_SCENARIO_B = "利用者名：阿部勘十郎。要介護3。認知症（アルツハイマー型）が進行し、深夜に徘徊することがある。同居する妻の阿部美智子さんは腰痛があり、介護負担が増大している。住所は東京都新宿区上落合3-10-15 第2コーポ藤102号室。電話は03-1234-5678。";

async function runPilot() {
  console.log('=== Phase 3: Pilot Operation Verification (TS) ===\n');

  // 1. PII Stress Test (Complex Names and Addresses)
  console.log('--- 1. PII Masking Stress Test ---');
  console.log('[Original Input]:', INPUT_SCENARIO_B);
  const { maskedText, placeholders } = PIIMasker.mask(INPUT_SCENARIO_B);
  console.log('[Masked Text]:', maskedText);
  console.log('[Detected PII]:', JSON.stringify(Object.keys(placeholders), null, 2));

  // 2. Scenario Execution (Simulated)
  console.log('\n--- 2. Scenario Execution & Validation Simulation ---');
  
  const scenarios = [
    { name: '独居・外出意欲低下', input: '佐藤様、85歳独居。歩行不安で外出控え。' },
    { name: '認知症・介護者負担', input: INPUT_SCENARIO_B }
  ];

  for (const s of scenarios) {
    console.log(`\n[Scenario: ${s.name}]`);
    
    // Validation
    const validationResult = AIValidator.validateCarePlan(AI_OUTPUT_SCENARIO_A);
    console.log('[Validation Status]:', validationResult.isValid ? 'SUCCESS' : 'FAILURE');
    if (!validationResult.isValid) {
      console.log('  Errors:', JSON.stringify(validationResult.errors));
    }

    // Audit Log Entry (Simulated)
    console.log('[AUDIT_LOG_ENTRY]:', JSON.stringify({
       timestamp: new Date().toISOString(),
       provider: 'vertex',
       success: true,
       metadata: {
         validationPassed: validationResult.isValid,
         piiCount: Object.keys(placeholders).length
       }
    }));
  }

  console.log('\n=== Pilot Verification Completed ===');
}

runPilot().catch(console.error);
