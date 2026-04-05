import React from 'react';
import { GeneratedPlan, AiModel } from '../types';
import { useExcelExport } from '../hooks/useExcelExport';

interface ResultPanelProps {
  plan: GeneratedPlan;
  isLoading: boolean;
  userName: string;
  selectedModel: AiModel;
}

const parseContent = (text: string) => {
  if (!text) return [];
  // 見出し番号（1. 〇〇）で区切る
  const regex = /^(\d+\.\s+.*)$/m;
  const parts = text.split(regex);
  
  const sections = [];
  // 最初の見出しよりも前にあるテキスト（挨拶など）
  if (parts[0] && parts[0].trim()) {
    sections.push({ heading: '', content: parts[0].trim() });
  }
  
  for (let i = 1; i < parts.length; i += 2) {
    sections.push({
      heading: parts[i].trim(),
      content: (parts[i+1] || '').trim()
    });
  }
  
  return sections.length > 0 ? sections : [{ heading: '', content: text }];
};

const ResultPanel: React.FC<ResultPanelProps> = ({ plan, isLoading, userName, selectedModel }) => {
  const { isExporting, exportToExcel } = useExcelExport({ userName });
  const handleCopy = () => {
    if (plan.content) {
      navigator.clipboard.writeText(plan.content);
      alert('クリップボードにコピーしました');
    }
  };

  const sections = parseContent(plan.content);

  // 未入力・未生成の初期状態
  if (!plan.content && !isLoading && !plan.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 mx-auto opacity-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
          </svg>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-1">ケアプラン草案はまだ生成されていません</p>
        <p className="text-xs">左側のフォームを入力して「生成」ボタンを押してください</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-4 md:pt-5 bg-slate-50">
      {/* ヘッダーエリア */}
      <div className="flex items-center justify-between px-4 md:px-5 pb-3 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-base font-bold text-slate-800">📋 生成されたケアプラン草案</h2>
        <div className="flex gap-2">
          <button
            onClick={() => exportToExcel(plan.content, selectedModel)}
            disabled={!plan.content || isLoading || isExporting}
            className="text-xs font-medium px-4 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded shadow-sm hover:bg-indigo-100 transition-colors flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isExporting ? '出力中...' : '帳票出力 (Excel)'}
          </button>
          <button
            onClick={handleCopy}
            disabled={!plan.content || isLoading}
            className="text-xs font-medium px-4 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
            </svg>
            草案をコピー
          </button>
        </div>
      </div>

      {/* メインコンテンツ（スクロール領域） */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-b-teal-600 mb-3"></div>
            <p className="text-sm font-bold text-teal-700">AIがケアプランを専門的に考案中...</p>
            <p className="text-xs text-slate-500 mt-1">数秒から十数秒お待ちください</p>
          </div>
        )}
        
        {plan.error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200 flex flex-col gap-2">
            <div className="font-bold flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
              </svg>
              生成エラー
            </div>
            <div>{plan.error}</div>
            <p className="text-xs opacity-80 mt-2">※しばらく待ってから再度「生成」をお試しください。</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sections.map((section, idx) => {
              if (!section.heading && !section.content) return null;
              
              const isMissingInfo = section.heading.includes('不足情報');
              const isCaution = section.heading.includes('注意点');
              
              // セクションのスタイル決定
              let containerClass = "bg-white border rounded-lg p-4 shadow-sm ";
              let headingClass = "text-sm font-bold pb-2 mb-2 border-b ";
              
              if (isMissingInfo) {
                containerClass += "border-rose-200 bg-rose-50/50";
                headingClass += "text-rose-800 border-rose-200 flex items-center gap-1";
              } else if (isCaution) {
                containerClass += "border-amber-200 bg-amber-50/50";
                headingClass += "text-amber-800 border-amber-200 flex items-center gap-1";
              } else {
                containerClass += "border-slate-200";
                headingClass += "text-teal-800 border-slate-100";
              }

              return (
                <div key={idx} className={containerClass}>
                  {section.heading && (
                    <h3 className={headingClass}>
                      {isMissingInfo && "⚠️ "}
                      {isCaution && "🚨 "}
                      {section.heading}
                    </h3>
                  )}
                  <div className={`text-sm leading-relaxed whitespace-pre-wrap ${isMissingInfo || isCaution ? 'text-slate-800' : 'text-slate-700'}`}>
                    {section.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* 画面下の固定注意書き */}
      {!isLoading && !plan.error && plan.content && (
         <div className="p-3 bg-slate-200/50 border-t border-slate-200 text-xs text-slate-600 flex-shrink-0 text-center leading-relaxed">
           この生成結果はAIによる草案作成支援です。<br className="md:hidden" />必ず専門職（ケアマネジャー）の目で事実確認と評価・修正を行ってください。
         </div>
      )}
    </div>
  );
};

export default ResultPanel;
