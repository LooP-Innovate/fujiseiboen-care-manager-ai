
export interface ParsedContent {
  summary: string;
  body: string;
  actions: string;
  other: string;
}

export const parseAIContent = (content: string | null | undefined): ParsedContent | null => {
  const result: ParsedContent = { summary: '', body: '', actions: '', other: '' };
  if (!content) return null;
  
  // Strip out the JSON block first so it doesn't get rendered
  const prose = content.replace(/```json\n([\s\S]*?)\n```/, '').trim();

  const sections = prose.split(/【(要点サマリ|本文|本文\/資料|アクション|アクション \(ToDo\))】/);

  let currentSection: keyof Omit<ParsedContent, 'other'> | null = null;
  // The first element is anything before the first heading, which we treat as 'other' initially.
  if (sections[0]) {
      result.other = sections[0].trim();
  }
  
  for (let i = 1; i < sections.length; i += 2) {
    const part = sections[i].trim();
    const sectionContent = sections[i + 1] ? sections[i+1].trim() : '';

    if (part === '要点サマリ') {
        result.summary = sectionContent;
    } else if (part === '本文' || part === '本文/資料') {
        result.body = sectionContent;
    } else if (part === 'アクション' || part === 'アクション (ToDo)') {
        result.actions = sectionContent;
    }
  }
  
  // If no sections were found, the entire content is 'other'
  if (!result.summary && !result.body && !result.actions && !result.other) {
      result.other = prose;
  }

  return result;
};
