import path from 'path';
import fs from 'fs';
import exceljs from 'exceljs';

async function createTemplate() {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet('居宅サービス計画書（2）');

  // Set column widths to match a professional form layout
  sheet.columns = [
    { key: 'A', width: 3 },  // Margin
    { key: 'B', width: 25 }, // Needs
    { key: 'C', width: 22 }, // Long Term Goal
    { key: 'D', width: 8 },  // Period
    { key: 'E', width: 22 }, // Short Term Goal
    { key: 'F', width: 8 },  // Period
    { key: 'G', width: 30 }, // Service Content
    { key: 'H', width: 15 }, // Service Type
    { key: 'I', width: 12 }, // Frequency
    { key: 'J', width: 12 }, // Period
  ];

  // Title
  sheet.mergeCells('B2:J2');
  const titleCell = sheet.getCell('B2');
  titleCell.value = '居宅サービス計画書（２）';
  titleCell.font = { name: 'MS PGothic', size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };

  // Creation Date
  sheet.getCell('I1').value = '作成年月日';
  sheet.getCell('J1').value = '　　年　月　日';

  // Resident Name
  sheet.getCell('B4').value = '利用者名';
  sheet.getCell('C4').value = '　　　　　　　　　　　　様';
  sheet.getCell('C4').border = { bottom: { style: 'thin' } };

  // Table Headers
  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } },
    font: { name: 'MS PGothic', size: 9, bold: true },
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  // Row 6 & 7: Headers
  sheet.mergeCells('B6:B7');
  sheet.getCell('B6').value = '生活全般の解決すべき課題\n（ニーズ）';
  
  sheet.mergeCells('C6:F6');
  sheet.getCell('C6').value = '目標';
  
  sheet.mergeCells('G6:J6');
  sheet.getCell('G6').value = '援助内容';

  sheet.getCell('C7').value = '長期目標';
  sheet.getCell('D7').value = '（期間）';
  sheet.getCell('E7').value = '短期目標';
  sheet.getCell('F7').value = '（期間）';
  sheet.getCell('G7').value = 'サービス内容';
  sheet.getCell('H7').value = 'サービス種別';
  sheet.getCell('I7').value = '頻度';
  sheet.getCell('J7').value = '期間';

  // Apply header style
  ['B6', 'C6', 'G6', 'B7', 'C7', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7', 'J7'].forEach(addr => {
    sheet.getCell(addr).style = headerStyle;
  });

  // Data Rows (8 to 20 for MVP)
  const dataStyle = {
    font: { name: 'MS PGothic', size: 10 },
    alignment: { vertical: 'top', wrapText: true, indent: 1 },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  for (let r = 8; r <= 20; r++) {
    const row = sheet.getRow(r);
    row.height = 80;
    for (let c = 2; c <= 10; c++) {
      row.getCell(c).style = dataStyle;
    }
  }

  // Footer Disclaimer
  const footerRow = 22;
  sheet.mergeCells(`B${footerRow}:J${footerRow}`);
  const footerCell = sheet.getCell(`B${footerRow}`);
  footerCell.value = '※本計画書はAIによる支援原案です。適切なアセスメントに基づき、介護支援専門員が最終的な確認・修正を行ってください。';
  footerCell.font = { name: 'MS PGothic', size: 9, italic: true, color: { argb: 'FFFF0000' } };

  const publicDir = path.resolve(process.cwd(), 'public');
  const tempDir = path.resolve(publicDir, 'templates');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const outputPath = path.resolve(tempDir, 'careplan2_template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Generated professional template at ${outputPath}`);
}

createTemplate().catch(console.error);
