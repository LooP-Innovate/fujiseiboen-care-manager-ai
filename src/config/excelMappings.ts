// Excelマッピング定義
// テンプレートの物理セル位置とシステム上のデータプロパティ層を分離する

export const CarePlan2Mappings = {
  // 基本情報のセル位置
  basicInfo: {
    userName: 'C4',
    createdDate: 'J2',
  },
  // 表の開始行と各列のセルアルファベット
  table: {
    startRow: 8,
    maxRows: 7, // テンプレートに事前に用意されている行数 (適当に7行を仮定)
    columns: {
      needs: 'B',           // ニーズ
      longTermGoal: 'D',    // 長期目標
      longTermPeriod: 'F',  // 長期期間
      shortTermGoal: 'G',   // 短期目標
      shortTermPeriod: 'I', // 短期期間
      serviceContent: 'J',  // サービス内容
      serviceType: 'L',     // サービス種別
      frequency: 'N',       // 頻度
      period: 'P',          // 期間
    }
  }
};
