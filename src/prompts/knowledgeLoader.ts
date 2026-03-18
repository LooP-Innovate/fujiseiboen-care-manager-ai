import { FormData } from '../types';
// @ts-ignore
import careLimitsRaw from './knowledge/care_limits.md?raw';
// @ts-ignore
import informalResourcesRaw from './knowledge/informal_resources.sample.md?raw';
// @ts-ignore
import medicalCheckpointsRaw from './knowledge/medical_checkpoints.md?raw';

export const loadRelevantKnowledge = (formData: FormData): string => {
  const { resident, needs } = formData;
  
  // 判定用に全テキストを結合
  const combinedInput = `${resident.careLevel} ${resident.mainDiagnosis} ${needs.physicalStatus} ${needs.cognition} ${needs.familySupport} ${needs.wishes} ${needs.otherRisks}`;
  
  const selectedKnowledge: string[] = [];
  const referencePoints: string[] = []; // 「参考にした観点」出力用のログ

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

  if (selectedKnowledge.length === 0) return '';

  return `
### 【厳守事項：参照知識（ナレッジプラグイン）】
以下の内部ルールや地域データベースの内容を厳密に参照し、支給限度額の超過や適用外のサービス提案を行わないこと。
また、「9. 参考にした観点」の出力時には、これらの知識ソース名（${referencePoints.join('、')}）を活用した旨を含めること。

<ReferenceKnowledge>
${selectedKnowledge.join('\n\n---\n\n')}
</ReferenceKnowledge>
`.trim();
};
