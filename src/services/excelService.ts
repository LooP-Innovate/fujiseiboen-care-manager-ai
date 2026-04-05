import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CarePlan2Mappings } from '../config/excelMappings';
import { CarePlan2ExportData } from '../types/excel';

export class ExcelService {
  /**
   * ダウンロードして差し込む処理
   */
  public static async exportCarePlan2(data: CarePlan2ExportData) {
    try {
      // 1. Fetch template from public folder
      const response = await fetch('/templates/careplan2_template.xlsx');
      if (!response.ok) {
        throw new Error('テンプレートファイルの読み込みに失敗しました。(/templates/careplan2_template.xlsx)');
      }
      
      const arrayBuffer = await response.arrayBuffer();

      // 2. Load into ExcelJS Workbook
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.getWorksheet('居宅サービス計画書（2）') || workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('ワークシートが見つかりません。');
      }

      // 3. 基本情報を差し込み
      if (data.userName) {
        let nameCell = worksheet.getCell(CarePlan2Mappings.basicInfo.userName);
        nameCell.value = this.truncateText(data.userName, 20); // 簡単な文字数制限
      }
      if (data.createdDate) {
        let dateCell = worksheet.getCell(CarePlan2Mappings.basicInfo.createdDate);
        dateCell.value = data.createdDate;
      }

      // 4. テーブルデータを差し込み
      const { startRow, maxRows, columns } = CarePlan2Mappings.table;
      
      data.planItems.forEach((item, index) => {
        if (index >= maxRows) {
          console.warn(`行数がテンプレートの最大行数(${maxRows})を超過しているため、表示しきれません`);
          return;
        }

        const currentRow = startRow + index;
        
        this.injectCell(worksheet, `${columns.needs}${currentRow}`, item.needs, 150);
        this.injectCell(worksheet, `${columns.longTermGoal}${currentRow}`, item.longTermGoal, 150);
        this.injectCell(worksheet, `${columns.longTermPeriod}${currentRow}`, item.longTermPeriod, 50);
        this.injectCell(worksheet, `${columns.shortTermGoal}${currentRow}`, item.shortTermGoal, 150);
        this.injectCell(worksheet, `${columns.shortTermPeriod}${currentRow}`, item.shortTermPeriod, 50);
        this.injectCell(worksheet, `${columns.serviceContent}${currentRow}`, item.serviceContent, 200);
        this.injectCell(worksheet, `${columns.serviceType}${currentRow}`, item.serviceType, 50);
        this.injectCell(worksheet, `${columns.frequency}${currentRow}`, item.frequency, 50);
        this.injectCell(worksheet, `${columns.period}${currentRow}`, item.period, 60);

        // 必要に応じて行の高さを自動調整（簡易）
        const rowObj = worksheet.getRow(currentRow);
        rowObj.height = Math.max(rowObj.height || 60, this.calculateRowHeight(item));
      });

      // 5. Download the modified workbook
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `居宅サービス計画書2_${data.userName || '未記入'}.xlsx`);
      
    } catch (error) {
      console.error('Excel export failed:', error);
      throw error;
    }
  }

  /**
   * 文字数を制限してセルに書き込む
   */
  private static injectCell(worksheet: ExcelJS.Worksheet, cellAddress: string, text: string, maxLength: number) {
    if (!text) return;
    const cell = worksheet.getCell(cellAddress);
    // 超過した場合は要確認文字を付ける（コード側での対策）
    cell.value = this.truncateText(text, maxLength);
    cell.alignment = { wrapText: true, vertical: 'top' };
  }

  private static truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...【要確認: 文字数オーバー】';
  }

  /**
   * 簡易的な行の高さ算出（一番文字数が多い列を基準にする）
   */
  private static calculateRowHeight(item: any): number {
    const maxCharsInCell = Math.max(
      ...Object.values(item as Record<string, string>).map(val => val ? val.length : 0)
    );
    // 適当な算出（1行20文字として、15 height * 行数）
    const estimatedLines = Math.max(1, Math.ceil(maxCharsInCell / 15));
    return Math.min(200, Math.max(60, estimatedLines * 20)); 
  }
}
