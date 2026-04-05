import path from 'path';
import fs from 'fs';
import exceljs from 'exceljs';

async function createTemplate() {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet('居宅サービス計画書（2）');

  // Set column widths approximately
  sheet.columns = [
    { key: 'A', width: 2 },
    { key: 'B', width: 20 },
    { key: 'C', width: 2 },
    { key: 'D', width: 20 },
    { key: 'E', width: 2 },
    { key: 'F', width: 10 },
    { key: 'G', width: 20 },
    { key: 'H', width: 2 },
    { key: 'I', width: 10 },
    { key: 'J', width: 25 },
    { key: 'K', width: 2 },
    { key: 'L', width: 15 },
    { key: 'M', width: 2 },
    { key: 'N', width: 10 },
    { key: 'O', width: 2 },
    { key: 'P', width: 15 },
  ];

  sheet.getCell('E2').value = '居宅サービス計画書（2）';
  sheet.getCell('E2').font = { size: 16, bold: true };

  sheet.getCell('I2').value = '作成年月日';
  sheet.getCell('B4').value = '利用者名';
  sheet.getCell('E4').value = '様';

  const headerRow1 = ['', '生活全般の解決すべき課題(ニーズ)', '', '目標', '', '', '', '', '', '援助内容', '', '', '', '', '', ''];
  sheet.getRow(6).values = headerRow1;
  
  const headerRow2 = ['', '', '', '長期目標', '', '(期間)', '短期目標', '', '(期間)', 'サービス内容', '', 'サービス種別', '', '頻度', '', '期間'];
  sheet.getRow(7).values = headerRow2;

  for (let r = 6; r <= 15; r++) {
    const row = sheet.getRow(r);
    for (let c = 2; c <= 16; c++) {
      const cell = row.getCell(c);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
      if (r >= 8) {
        cell.alignment = { vertical: 'top', wrapText: true };
      }
    }
    if (r >= 8) row.height = 60;
  }

  const publicDir = path.resolve(process.cwd(), 'public');
  const tempDir = path.resolve(publicDir, 'templates');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const outputPath = path.resolve(tempDir, 'careplan2_template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`Generated template at ${outputPath}`);
}

createTemplate().catch(console.error);
