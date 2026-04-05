import { FormData, MonitoringFormData } from '../types';
// @ts-ignore
import careLimitsRaw from './knowledge/care_limits.md?raw';
// @ts-ignore
import informalResourcesRaw from './knowledge/informal_resources.sample.md?raw';
// @ts-ignore
import medicalCheckpointsRaw from './knowledge/medical_checkpoints.md?raw';
// @ts-ignore
import careplanWritingRulesRaw from './knowledge/careplan_writing_rules.md?raw';
// @ts-ignore
import careplanCasePatternsRaw from './knowledge/careplan_case_patterns.md?raw';
// @ts-ignore
import monitoringSummaryExamplesRaw from './knowledge/monitoring_summary_examples.md?raw';

export type KnowledgeMode = 'careplan' | 'monitoring';

export const loadRelevantKnowledge = (
  formData: FormData | MonitoringFormData, 
  mode: KnowledgeMode = 'careplan'
): string => {
  const selectedKnowledge: string[] = [];
  const referencePoints: string[] = [];
  
  // A. 書き方ルール（常に優先・必須）
  selectedKnowledge.push(careplanWritingRulesRaw);
  referencePoints.push('ケアプラン・モニタリング共通書き方ルール');

  if (mode === 'careplan') {
    const data = formData as FormData;
    const { resident, needs } = data;
    const combinedInput = `${resident.careLevel} ${resident.mainDiagnosis} ${needs.physicalStatus} ${needs.cognition} ${needs.familySupport} ${needs.wishes} ${needs.otherRisks}`;

    // 1. 要介護度ルール（必須）
    if (resident.careLevel) {
      selectedKnowledge.push(careLimitsRaw);
      referencePoints.push('介護保険サービスの利用限度額と標準ルール');
    }

    // 2. 医療的チェックポイント
    const medicalKeywords = ['胃ろう', '吸引', '服薬', '肺炎', 'リハビリ', '退院', '骨折', '認知症', 'インスリン', '麻痺'];
    if (medicalKeywords.some(kw => combinedInput.includes(kw))) {
      selectedKnowledge.push(medicalCheckpointsRaw);
      referencePoints.push('医療的ケアとリハビリテーションの留意点');
    }

    // 3. インフォーマル・環境関連
    const informalKeywords = ['独居', '一人暮らし', '仕事', '不在', '負担', 'ボランティア', '配食', '見守り', '老老'];
    if (informalKeywords.some(kw => combinedInput.includes(kw))) {
      selectedKnowledge.push(informalResourcesRaw);
      referencePoints.push('地域のインフォーマルサービス・社会資源（サンプル版）');
    }

    // 4. ケース類型（ケアプランでは優先）
    selectedKnowledge.push(careplanCasePatternsRaw);
    referencePoints.push('ケース類型とアセスメントの観点補助');

  } else {
    // Monitoring Mode
    const data = formData as MonitoringFormData;
    
    // 1. 総括構成補助（モニタリング専用）
    selectedKnowledge.push(monitoringSummaryExamplesRaw);
    referencePoints.push('モニタリング記録の構造と総括の構成例');

    // 2. ケース類型（モニタリングでも補助的に使用）
    selectedKnowledge.push(careplanCasePatternsRaw);
    referencePoints.push('アセスメント観点の補助');
  }

  // TEMPORARILY DISABLED FOR COMPARISON TEST
  return '';
  /*
  if (selectedKnowledge.length === 0) return '';
  // ... rest of code
  */
};
