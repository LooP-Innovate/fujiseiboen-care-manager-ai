import React from 'react';

const MarkdownTable: React.FC<{ content: string }> = ({ content }) => {
  const rows = content.trim().split('\n').map(row => row.split('|').map(cell => cell.trim()).filter(c => c));
  if (rows.length < 2 || !rows[1].some(cell => cell.includes('---'))) return <p>{content}</p>;

  const headerRow = rows[0];
  const bodyRows = rows.slice(2); 

  return (
    <div className="overflow-x-auto my-4">
      <table className="min-w-full text-sm border border-slate-300 divide-y divide-slate-300">
        <thead className="bg-slate-100">
          <tr>
            {headerRow.map((header, index) => (
              <th key={index} className="px-4 py-2 text-left font-semibold text-slate-700">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white text-slate-800">
          {bodyRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className="px-4 py-2 whitespace-pre-wrap">{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export const renderSectionContent = (content: string) => {
    // Regular expression to find [根拠:...] and wrap it in a styled span
    const highlightEvidence = (text: string) => {
        const parts = text.split(/(\[根拠:[^\]]+\])/g);
        return parts.map((part, i) => {
            if (part.startsWith('[根拠:') && part.endsWith(']')) {
                const evidence = part.slice(4, -1);
                return (
                    <span key={i} className="inline-flex items-center mx-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 cursor-help" title={`アセスメント資料内の根拠: ${evidence}`}>
                        <svg className="w-2.5 h-2.5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {evidence}
                    </span>
                );
            }
            return part;
        });
    };

    return content.split('\n').map((line, index) => {
        if (line.trim().startsWith('- ')) {
            return <li key={index} className="ml-5 list-disc">{highlightEvidence(line.substring(2))}</li>;
        }
        return <p key={index}>{highlightEvidence(line)}</p>;
    }).filter(Boolean);
};

export const renderBody = (bodyContent: string) => {
    const blocks = bodyContent.split(/\n{2,}/); // Split by double newlines
    return blocks.map((block, index) => {
        if(block.includes('|--') && block.trim().startsWith('|')){
            return <MarkdownTable key={index} content={block} />;
        }
        return <div key={index} className="space-y-1">{renderSectionContent(block)}</div>
    })
};