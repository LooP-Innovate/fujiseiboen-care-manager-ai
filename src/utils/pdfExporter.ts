
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ChatSession } from '../types';
import { parseAIContent } from './contentParser';
import { sanitizeFilename } from './filename';

export const exportHistoryToPDF = async (session: ChatSession, elementId: string) => {
  if (!session) {
    alert('エクスポートするセッションが見つかりません。');
    return;
  }

  const element = document.getElementById(elementId);
  if (!element) {
    alert('エクスポート対象のチャット内容が見つかりませんでした。');
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher scale for better quality
      useCORS: true,
      scrollY: -window.scrollY,
      windowWidth: document.documentElement.offsetWidth,
      windowHeight: document.documentElement.offsetHeight,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const ratio = canvasWidth / pdfWidth;
    const imgHeight = canvasHeight / ratio;
    
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const sanitizedTitle = sanitizeFilename(session.title);
    pdf.save(`FujiseiboenCopilot_${sanitizedTitle || 'chat'}.pdf`);

  } catch (error) {
    console.error('PDF export failed:', error);
    throw new Error('PDFの生成中にエラーが発生しました。');
  }
};

export const exportArtifactToPDF = async (session: ChatSession) => {
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

    const printableElement = document.createElement('div');
    printableElement.id = 'printable-artifact';
    printableElement.style.position = 'absolute';
    printableElement.style.left = '-9999px';
    printableElement.style.width = '210mm';
    printableElement.style.padding = '20mm';
    printableElement.style.backgroundColor = 'white';
    printableElement.style.color = 'black';
    printableElement.style.fontFamily = 'sans-serif';
    printableElement.style.fontSize = '11pt';
    printableElement.style.lineHeight = '1.6';
    printableElement.style.boxSizing = 'border-box';
    printableElement.style.wordBreak = 'break-word';

    const sanitizeHTML = (str: string) => str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const generateHtml = (p: typeof parsed, title: string) => {
        const section = (heading: string, content: string) => {
            if (!content.trim()) return '';
            const lines = content.trim().split('\n').map(line => `<p style="margin: 0 0 0.5em 0;">${sanitizeHTML(line)}</p>`).join('');
            return `<h2 style="font-size: 14pt; font-weight: 600; margin-top: 1.5em; margin-bottom: 0.8em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; color: #333;">${sanitizeHTML(heading)}</h2>${lines}`;
        };
        const otherContent = p.other.trim().split('\n').map(line => `<p style="margin: 0 0 0.5em 0;">${sanitizeHTML(line)}</p>`).join('');

        return `
            <div style="font-family: 'Hiragino Kaku Gothic ProN', 'Meiryo', sans-serif;">
                <h1 style="font-size: 18pt; font-weight: 600; margin-bottom: 1em; color: #111;">${sanitizeHTML(title)}</h1>
                ${otherContent}
                ${section('要点サマリ', p.summary)}
                ${section('本文/資料', p.body)}
                ${section('アクション (ToDo)', p.actions)}
            </div>
        `;
    };

    printableElement.innerHTML = generateHtml(parsed, session.title);
    document.body.appendChild(printableElement);

    try {
        const canvas = await html2canvas(printableElement, { scale: 2, useCORS: true });
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / pdfWidth;
        const imgHeight = canvasHeight / ratio;
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);

        const sanitizedTitle = sanitizeFilename(session.title);
        pdf.save(`FujiseiboenCopilot_${sanitizedTitle || 'artifact'}.pdf`);

    } catch (error) {
        console.error('Artifact PDF export failed:', error);
        throw new Error('PDFの生成中にエラーが発生しました。');
    } finally {
        document.body.removeChild(printableElement);
    }
};
