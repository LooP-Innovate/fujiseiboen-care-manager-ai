export interface CarePlan2Row {
  needs: string;             // 生活全般の解決すべき課題（ニーズ）
  longTermGoal: string;      // 長期目標
  longTermPeriod: string;    // 長期目標（期間）
  shortTermGoal: string;     // 短期目標
  shortTermPeriod: string;   // 短期目標（期間）
  serviceContent: string;    // サービス内容
  serviceType: string;       // サービス種別
  frequency: string;         // 頻度
  period: string;            // 期間
}

export interface CarePlan2ExportData {
  userName: string;          // 利用者名
  createdDate: string;       // 作成年月日
  planItems: CarePlan2Row[]; // 援助内容などのリスト
}

// AIが出力するJSONの型としてもこれを利用します。
export interface CarePlan2AiResponse {
  planItems: CarePlan2Row[];
}
