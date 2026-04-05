// Excelマッピング定義
// テンプレートの物理セル位置とシステム上のデータプロパティ層を分離する

export const CarePlan2Mappings = {
  // 基本情報のセル位置
  basicInfo: {
    userName: 'C4',
    createdDate: 'J1',
  },
  // 表の開始行と各列のセルアルファベット
  table: {
    startRow: 8,
    maxRows: 13, // 8行目から20行目まで (20 - 8 + 1 = 13)
    columns: {
      needs: 'B',           // ニーズ
      longTermGoal: 'C',    // 長期目標
      longTermPeriod: 'D',  // 長期期間
      shortTermGoal: 'E',   // 短期目標
      shortTermPeriod: 'F', // 短期期間
      serviceContent: 'G',  // サービス内容
      serviceType: 'H',     // サービス種別
      frequency: 'I',       // 頻度
      period: 'J',          // 期間
    }
  }
};
