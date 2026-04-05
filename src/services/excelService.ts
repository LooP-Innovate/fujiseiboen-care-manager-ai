import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { CarePlan2Mappings } from '../config/excelMappings';
import { CarePlan2ExportData } from '../types/excel';

export class ExcelService {
  /**
   * テンプレートを読み込み、指定セルに書き込む（レイアウト固定）
   */
  public static async exportCarePlan2(data: CarePlan2ExportData) {
    try {
      console.log('Starting Excel export with Fixed Template approach...');

      // 1. Fetch template
      const response = await fetch('/templates/careplan2_template.xlsx');
      if (!response.ok) {
        throw new Error('テンプレートファイルの読み込みに失敗しました。(/templates/careplan2_template.xlsx)');
      }
      
      const arrayBuffer = await response.arrayBuffer();

      // 2. Load Workbook
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(arrayBuffer);
      
      const worksheet = workbook.getWorksheet('居宅サービス計画書（2）') || workbook.worksheets[0];
      if (!worksheet) {
        throw new Error('ワークシートが見つかりません。');
      }

      // 3. ページ設定を強制固定 (A4, 横向き, 1ページに収める)
      worksheet.pageSetup = {
        paperSize: 9, // A4
        orientation: 'landscape',
        fitToPage: true,
        fitToWidth: 1,
        fitToHeight: 1,
        margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 }
      };

      // 4. 基本情報の書き込み
      if (data.userName) {
        this.writeCell(worksheet, CarePlan2Mappings.basicInfo.userName, data.userName);
        console.log(`Writing userName: ${data.userName} to ${CarePlan2Mappings.basicInfo.userName}`);
      }
      if (data.createdDate) {
        this.writeCell(worksheet, CarePlan2Mappings.basicInfo.createdDate, data.createdDate);
        console.log(`Writing createdDate: ${data.createdDate} to ${CarePlan2Mappings.basicInfo.createdDate}`);
      }

      // 5. テーブルデータの差し込み (1行目から最大行数分)
      const { startRow, maxRows, columns } = CarePlan2Mappings.table;
      
      data.planItems.forEach((item, index) => {
        if (index >= maxRows) {
          console.warn(`行数がテンプレートの最大行数(${maxRows})を超過しているため、表示しきれません`);
          return;
        }

        const r = startRow + index;
        
        // 各セルへの書き込み (テンプレートの結合セル・罫線を壊さないよう値をセットするだけ)
        // 文字数制限は各欄の物理サイズに合わせて調整
        this.writeCell(worksheet, `${columns.needs}${r}`, item.needs, 150);
        this.writeCell(worksheet, `${columns.longTermGoal}${r}`, item.longTermGoal, 100);
        this.writeCell(worksheet, `${columns.longTermPeriod}${r}`, item.longTermPeriod, 30);
        this.writeCell(worksheet, `${columns.shortTermGoal}${r}`, item.shortTermGoal, 100);
        this.writeCell(worksheet, `${columns.shortTermPeriod}${r}`, item.shortTermPeriod, 30);
        this.writeCell(worksheet, `${columns.serviceContent}${r}`, item.serviceContent, 200);
        this.writeCell(worksheet, `${columns.serviceType}${r}`, item.serviceType, 50);
        this.writeCell(worksheet, `${columns.frequency}${r}`, item.frequency, 40);
        this.writeCell(worksheet, `${columns.period}${r}`, item.period, 40);

        console.log(`Writing data to row ${r}`);
      });

      // 6. 書き出し
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `居宅サービス計画書2_${data.userName || '未記入'}.xlsx`);
      
    } catch (error) {
      console.error('Excel export failed:', error);
      throw error;
    }
  }

  /**
   * 指定のセルに値を書き込む。結合セルの場合は左上に書き込めば良い。
   * レイアウト（罫線・色・フォント）を維持するため、スタイルの上書きは最小限にする。
   */
  private static writeCell(worksheet: ExcelJS.Worksheet, address: string, value: string, maxLength: number = 255) {
    if (!value) return;
    const cell = worksheet.getCell(address);
    
    // 内容をセット (文字数制限付き)
    cell.value = this.limitText(value, maxLength);

    // 折り返しと上詰め設定だけは、データ量によって必要になるため強制する
    // (テンプレート側で設定済みでも、書き込み時に確実に適用するため)
    cell.alignment = { 
      wrapText: true, 
      vertical: 'top',
      horizontal: 'left' // ニーズや目標は左詰め
    };
  }

  private static limitText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...【要確認: 長文につき一部省略】';
  }
}
