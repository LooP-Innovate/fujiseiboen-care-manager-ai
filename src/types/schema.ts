export interface CarePlan {
  assessment: string;    // アセスメント要約
  issues: string[];      // 解決すべき課題 (生活全般の解決すべき課題)
  longTermGoal: string;  // 長期目標
  shortTermGoal: string; // 短期目標
  services: string[];    // サービス内容
  monitoring: string;    // モニタリングの観点
}

export const CarePlanSchema = {
  type: "object",
  properties: {
    assessment: { type: "string", description: "利用者の状態や生活環境の要約" },
    issues: { 
      type: "array", 
      items: { type: "string" }, 
      description: "アセスメントから抽出された解決すべき課題" 
    },
    longTermGoal: { type: "string", description: "概ね6ヶ月から1年後に達成したい状態" },
    shortTermGoal: { type: "string", description: "長期目標を達成するために直近数ヶ月で目指す状態" },
    services: { 
      type: "array", 
      items: { type: "string" }, 
      description: "目標達成のために具体的に提供されるサービス内容" 
    },
    monitoring: { type: "string", description: "計画の進捗を確認するための具体的な観察項目" }
  },
  required: ["assessment", "issues", "longTermGoal", "shortTermGoal", "services", "monitoring"],
  additionalProperties: false
};
