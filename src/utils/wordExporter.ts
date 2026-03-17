import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { ChatSession } from '../types';
import { parseAIContent } from './contentParser';
import { sanitizeFilename } from './filename';

export const exportHistoryToWord = async (session: ChatSession) => {
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

  const doc = new Document({
    creator: "Fujiseiboen AI Assistant",
    title: session.title,
    description: `Chat history for session: ${session.title}`,
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: session.title,
          heading: HeadingLevel.HEADING_1,
        }),
        new Paragraph({ text: '' }), // Spacer
        ...messagesToExport.flatMap(msg => [
          new Paragraph({
            children: [
              new TextRun({
                text: msg.sender === 'user' ? 'あなた: ' : 'AIアシスタント: ',
                bold: true,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun(msg.content),
            ],
            style: "Normal",
          }),
          new Paragraph({ text: '' }), // Spacer between messages
        ]),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  const sanitizedTitle = sanitizeFilename(session.title);
  link.setAttribute('download', `FujiseiboenCopilot_${sanitizedTitle || 'chat'}.docx`);

  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportArtifactToWord = async (session: ChatSession) => {
    const lastAiMessage = [...session.messages].reverse().find(msg => msg.sender === 'ai' && !msg.isError && msg.id !== 'initial');

    if (!lastAiMessage) {
        alert('エクスポート対象のAIの応答が見つかりません。');
        return;
    }

    const parsed = parseAIContent(lastAiMessage.content);
    if (!parsed) {
        alert('AIの応答内容を解析できませんでした。');
        return;
    }

    const children: Paragraph[] = [
        new Paragraph({ text: session.title, heading: HeadingLevel.HEADING_1 }),
        new Paragraph({ text: '' }), // Spacer
    ];

    const addSection = (title: string, content: string) => {
        if (content.trim()) {
            children.push(new Paragraph({ text: title, heading: HeadingLevel.HEADING_2, spacing: { before: 240 } }));
            content.trim().split('\n').forEach(line => {
                children.push(new Paragraph({ text: line, style: "Normal" }));
            });
        }
    };

    if (parsed.other.trim()) {
        parsed.other.trim().split('\n').forEach(line => {
            children.push(new Paragraph({ text: line, style: "Normal" }));
        });
    }

    addSection('要点サマリ', parsed.summary);
    addSection('本文/資料', parsed.body);
    addSection('アクション (ToDo)', parsed.actions);

    const doc = new Document({
        creator: "Fujiseiboen AI Assistant",
        title: `${session.title} (成果物)`,
        sections: [{ children }],
    });

    const blob = await Packer.toBlob(doc);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    const sanitizedTitle = sanitizeFilename(session.title);
    link.setAttribute('download', `FujiseiboenCopilot_${sanitizedTitle || 'artifact'}.docx`);

    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
