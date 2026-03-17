export interface MaskingResult {
  maskedText: string;
  placeholders: Record<string, string>;
}

export class PIIMasker {
  private static readonly NAME_PATTERN = /(?:利用者名|氏名|家族名|担当者名|様|さん|氏|殿|君|ちゃん)/g;
  private static readonly CONTEXT_NAME_PATTERN = /(?:利用者名|氏名|家族名|担当者名)[:：]\s*([一-龠]{1,4}|[ぁ-んァ-ヶ]{1,8})/g;
  private static readonly HONORIFIC_NAME_PATTERN = /([一-龠]{1,4}|[ぁ-んァ-ヶ]{1,8})(?:様|さん|氏|殿|君|ちゃん)/g;
  private static readonly ADDR_PATTERN = /(?:東京都|道|府|県|市|区|町|村).{1,20}[0-9-]{1,10}/g;
  private static readonly TEL_PATTERN = /0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}/g;
  private static readonly ID_PATTERN = /[0-9]{10}/g;

  public static mask(text: string): MaskingResult {
    const placeholders: Record<string, string> = {};
    let counter = 1;

    let maskedText = text
      .replace(this.TEL_PATTERN, (match) => {
        const key = `{TEL_${counter++}}`;
        placeholders[key] = match;
        return key;
      })
      .replace(this.ADDR_PATTERN, (match) => {
        const key = `{住所_${counter++}}`;
        placeholders[key] = match;
        return key;
      })
      .replace(this.ID_PATTERN, (match) => {
        const key = `{ID_${counter++}}`;
        placeholders[key] = match;
        return key;
      })
      // 氏名のマスキング強化：コンテキスト（ラベル）ベース
      .replace(this.CONTEXT_NAME_PATTERN, (match, p1) => {
        const key = `{氏名_${counter++}}`;
        placeholders[key] = p1;
        return match.replace(p1, key);
      })
      // 氏名のマスキング強化：敬称ベース
      .replace(this.HONORIFIC_NAME_PATTERN, (match, p1) => {
        const key = `{氏名_${counter++}}`;
        placeholders[key] = p1;
        return match.replace(p1, key);
      });

    return { maskedText, placeholders };
  }

  public static unmask(text: string, placeholders: Record<string, string>): string {
    let unmasked = text;
    for (const [key, value] of Object.entries(placeholders)) {
      unmasked = unmasked.replace(key, value);
    }
    return unmasked;
  }
}
