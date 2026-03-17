import { PIIMasker } from '../src/security/piiMasker';

const testInputs = [
  "利用者名は田中太郎さんです。",
  "住所は東京都港区芝公園4-2-8です。",
  "電話番号は090-1234-5678です。",
  "ID番号は1234567890です。",
  "田中太郎さんの住所は東京都港区芝公園で、電話番号は090-1234-5678、IDは1234567890です。"
];

console.log("PII Masking Test Results:");
testInputs.forEach(input => {
  const result = PIIMasker.mask(input);
  console.log(`Original: ${input}`);
  console.log(`Masked:   ${result.maskedText}`);
  console.log(`Placeholders:`, result.placeholders);
  console.log('---');
});
