// Excelマッピング定義
// テンプレートの物理セル位置とシステム上のデータプロパティ層を分離する

export const CarePlan2Mappings = {
  // 基本情報のセル位置
  basicInfo: {
    userName: 'C4',      // 結合セル C4:E4 の左上
    createdDate: 'K1',   // メルアド等がある表外の作成日
  },
  // 表の開始行と各列のセルアルファベット
  table: {
    startRow: 8,
    maxRows: 13, // 8行目〜20行目まで
    columns: {
      needs: 'B',           // ニーズ (Merged B:C)
      longTermGoal: 'D',    // 長期目標
      longTermPeriod: 'E',  // 長期期間
      shortTermGoal: 'F',   // 短期目標
      shortTermPeriod: 'G', // 短期期間
      serviceContent: 'H',  // サービス内容
      serviceType: 'I',     // サービス種別
      frequency: 'J',       // 頻度
      period: 'K',          // 期間
    }
  }
};
