// 利用者の基本情報
export interface ResidentInfo {
  name: string;           // 利用者氏名（任意）
  age: string;            // 年齢
  gender: '男性' | '女性' | '';
  careLevel: CareLevel;   // 要介護度
  mainDiagnosis: string;  // 主疾患・医療的ケア
}

// 要介護度
export type CareLevel =
  | ''
  | '要支援1'
  | '要支援2'
  | '要介護1'
  | '要介護2'
  | '要介護3'
  | '要介護4'
  | '要介護5';

// 課題・状況
export interface NeedsInfo {
  wishes: string;         // 本人・家族の希望
  physicalStatus: string; // ADL・身体状況（移動・食事・排泄・入浴など）
  cognition: string;      // 認知・精神状況
  familySupport: string;  // 家族・支援体制
  otherRisks: string;     // リスク・留意点
}

// フォームデータ全体
export interface FormData {
  resident: ResidentInfo;
  needs: NeedsInfo;
  referenceText: string;
}

// モニタリング用フォームデータ
export interface MonitoringFormData {
  caseNumber: string;
  basicStatus: string;
  currentIssues: string;
  goals: string;
  currentServices: string;
  monitoringStatus: string;
  meals: string;
  excretion: string;
  bathing: string;
  skin: string;
  mobility: string;
  rehabilitation: string;
  health: string;
  psychological: string;
  notes: string;
}

// AI生成結果
export interface GeneratedPlan {
  content: string;
  isStreaming: boolean;
  error: string | null;
}

// AIモデル選択
export type AiModel = 'gemini' | 'openai';
