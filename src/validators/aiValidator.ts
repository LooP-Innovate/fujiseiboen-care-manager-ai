import { CarePlanSchema } from '../types/schema';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class AIValidator {
  private static readonly PROHIBITED_TERMS = [
    '不明', '適当に', '〜かもしれない', 'たぶん', // 曖昧な表現
    '絶対に', '必ず治る', // 過度な保証
    'ダメ', '無理', // ネガティブすぎる表現
  ];

  public static validateCarePlan(data: any): ValidationResult {
    const errors: string[] = [];
    
    // 1. Schema Check (Simple implementation for now)
    const requiredFields = CarePlanSchema.required;
    for (const field of requiredFields) {
      if (!data[field]) {
        errors.push(`Missing required field: ${field}`);
      } else if (field === 'issues' || field === 'services') {
        if (!Array.isArray(data[field]) || data[field].length === 0) {
          errors.push(`Field ${field} must be a non-empty array`);
        }
      } else if (typeof data[field] !== 'string' || data[field].trim() === '') {
        errors.push(`Field ${field} must be a non-empty string`);
      }
    }

    // 2. Prohibited Terms Check
    const fullText = JSON.stringify(data);
    for (const term of this.PROHIBITED_TERMS) {
      if (fullText.includes(term)) {
        errors.push(`Contains prohibited term: ${term}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
