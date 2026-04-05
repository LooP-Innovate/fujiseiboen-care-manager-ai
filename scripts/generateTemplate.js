import path from 'path';
import fs from 'fs';
import exceljs from 'exceljs';

async function createTemplate() {
  const workbook = new exceljs.Workbook();
  const sheet = workbook.addWorksheet('居宅サービス計画書（2）');

  // Fix column widths for A4 Landscape
  // Total width should be around 130-140 for A4 Landscape fit
  sheet.columns = [
    { key: 'A', width: 3 },   // Margin
    { key: 'B', width: 12 },  // Needs (Part 1)
    { key: 'C', width: 15 },  // Needs (Part 2)
    { key: 'D', width: 22 },  // Long Goal
    { key: 'E', width: 8 },   // Period
    { key: 'F', width: 22 },  // Short Goal
    { key: 'G', width: 8 },   // Period
    { key: 'H', width: 35 },  // Service Content
    { key: 'I', width: 15 },  // Service Type
    { key: 'J', width: 10 },  // Frequency
    { key: 'K', width: 10 },  // Period
    { key: 'L', width: 5 },   // Extra margin
  ];

  // Title
  sheet.mergeCells('B2:K2');
  const titleCell = sheet.getCell('B2');
  titleCell.value = '居宅サービス計画書（２）';
  titleCell.font = { name: 'MS PGothic', size: 16, bold: true };
  titleCell.alignment = { horizontal: 'center' };

  // Creation Date
  sheet.getCell('J1').value = '作成年月日';
  sheet.getCell('K1').value = '　　年　月　日';

  // Resident Name
  sheet.getCell('B4').value = '利用者名';
  sheet.mergeCells('C4:E4');
  sheet.getCell('C4').value = '　　　　　　　　　　様';
  sheet.getCell('C4').border = { bottom: { style: 'thin' } };

  // Common Header Style
  const headerStyle = {
    fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE0E0E0' } },
    font: { name: 'MS PGothic', size: 9 },
    alignment: { horizontal: 'center', vertical: 'middle', wrapText: true },
    border: {
       top: { style: 'thin' },
       left: { style: 'thin' },
       bottom: { style: 'thin' },
       right: { style: 'thin' }
    }
  };

  // Build Headers
  // Needs
  sheet.mergeCells('B6:C7');
  sheet.getCell('B6').value = '生活全般の解決すべき課題\n（ニーズ）';
  
  // Goals block
  sheet.mergeCells('D6:G6');
  sheet.getCell('D6').value = '目標';
  sheet.mergeCells('D7:D7'); sheet.getCell('D7').value = '長期目標';
  sheet.mergeCells('E7:E7'); sheet.getCell('E7').value = '（期間）';
  sheet.mergeCells('F7:F7'); sheet.getCell('F7').value = '短期目標';
  sheet.mergeCells('G7:G7'); sheet.getCell('G7').value = '（期間）';

  // Assistance block
  sheet.mergeCells('H6:K6');
  sheet.getCell('H6').value = '援助内容';
  sheet.getCell('H7').value = 'サービス内容';
  sheet.getCell('I7').value = 'サービス種別';
  sheet.getCell('J7').value = '頻度';
  sheet.getCell('K7').value = '期間';

  ['B6', 'D6', 'H6', 'D7', 'E7', 'F7', 'G7', 'H7', 'I7', 'J7', 'K7'].forEach(addr => {
    sheet.getCell(addr).style = headerStyle;
  });

  // Data Rows (8 to 20)
  // Each "Row" in data will occupy 1 Excel physical row, but with merged cells
  const dataStyle = {
    font: { name: 'MS PGothic', size: 10 },
    alignment: { vertical: 'top', horizontal: 'left', wrapText: true },
    border: {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  };

  for (let r = 8; r <= 20; r++) {
    sheet.getRow(r).height = 100;
    // Merge Needs
    sheet.mergeCells(`B${r}:C${r}`);
    
    // Apply style to all cells in range B-K
    for (let c = 2; c <= 11; c++) {
      sheet.getRow(r).getCell(c).style = dataStyle;
    }
  }

  // Page Setup
  sheet.pageSetup = {
    paperSize: 9, // A4
    orientation: 'landscape',
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 1,
    margins: { left: 0.5, right: 0.5, top: 0.5, bottom: 0.5, header: 0.3, footer: 0.3 }
  };

  const publicDir = path.resolve(process.cwd(), 'public');
  const tempDir = path.resolve(publicDir, 'templates');
  if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const outputPath = path.resolve(tempDir, 'careplan2_template.xlsx');
  await workbook.xlsx.writeFile(outputPath);
  console.log(`[FINAL] Generated professional template at ${outputPath}`);
}

createTemplate().catch(console.error);
