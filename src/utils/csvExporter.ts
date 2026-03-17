import { ChatSession } from '../types';
import { sanitizeFilename } from './filename';

const escapeCSVField = (field: string): string => {
  // Wrap in quotes if it contains a comma, a double quote, or a newline
  if (/[",\n]/.test(field)) {
    // Escape double quotes by doubling them up
    const escapedField = field.replace(/"/g, '""');
    return `"${escapedField}"`;
  }
  return field;
};

export const exportToCSV = (session: ChatSession) => {
  if (!session) {
    alert('エクスポートするセッションが見つかりません。');
    return;
  }
  
  const messagesToExport = session.messages.filter(
    msg => msg.id !== 'initial' && msg.id !== 'loading'
  );

  if (messagesToExport.length === 0) {
    alert('エクスポートするメッセージがありません。');
    return;
  }

  const headers = ['Sender', 'Content'];
  const rows = messagesToExport.map(msg => [
    escapeCSVField(msg.sender),
    escapeCSVField(msg.content),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(',')),
  ].join('\n');
  
  // Add BOM for Excel to recognize UTF-8 correctly
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  
  const sanitizedTitle = sanitizeFilename(session.title);
  link.setAttribute('download', `FujiseiboenCopilot_${sanitizedTitle || 'chat'}.csv`);
  
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
