import React from 'react';
import { GeneratedPlan } from '../types';

interface MonitoringResultPanelProps {
  plan: GeneratedPlan;
  isLoading: boolean;
}

interface ParsedMonitoring {
  status: string;
  evaluationItems: { label: string; content: string }[];
  discussion: string;
  summary: string;
  isParsed: boolean;
}

const parseMonitoringContent = (text: string): ParsedMonitoring => {
  const result: ParsedMonitoring = {
    status: '',
    evaluationItems: [],
    discussion: '',
    summary: '',
    isParsed: false
  };

  if (!text) return result;

  try {
    // 1. モニタリング実施状況
    const statusMatch = text.match(/1\.\s*モニタリング実施状況([\s\S]*?)(?=2\.\s*評価と考察|$)/);
    if (statusMatch) result.status = statusMatch[1].trim();

    // 2. 評価と考察
    const evalSectionMatch = text.match(/2\.\s*評価と考察([\s\S]*?)(?=3\.\s*総括|$)/);
    if (evalSectionMatch) {
      const evalText = evalSectionMatch[1];
      
      // ①〜⑧の抽出
      const items = [
        { key: '①', label: '食事・水分摂取' },
        { key: '②', label: '排泄' },
        { key: '③', label: '入浴' },
        { key: '④', label: '皮膚状態' },
        { key: '⑤', label: '基本動作' },
        { key: '⑥', label: 'リハビリ' },
        { key: '⑦', label: '医療・健康' },
        { key: '⑧', label: '心理・社会面' },
      ];

      items.forEach((item, index) => {
        const nextItem = items[index + 1];
        const regex = new RegExp(`${item.key}\\s*${item.label}\\s*([\\s\\S]*?)(?=${nextItem ? nextItem.key : '考察|\\n\\s*\\n'}|$)`);
        const match = evalText.match(regex);
        if (match) {
          result.evaluationItems.push({ label: item.label, content: match[1].trim() });
        }
      });

      // 考察の抽出
      const discussionMatch = evalText.match(/考察([\s\S]*?)$/);
      if (discussionMatch) result.discussion = discussionMatch[1].trim();
    }

    // 3. 総括
    const summaryMatch = text.match(/3\.\s*総括([\s\S]*?)$/);
    if (summaryMatch) result.summary = summaryMatch[1].trim();

    // 基本的なセクションが取れていればパース成功とみなす
    if (result.status || result.evaluationItems.length > 0 || result.summary) {
      result.isParsed = true;
    }
  } catch (e) {
    console.error('Parsing failed:', e);
    result.isParsed = false;
  }

  return result;
};

const MonitoringResultPanel: React.FC<MonitoringResultPanelProps> = ({ plan, isLoading }) => {
  const handleCopy = () => {
    if (plan.content) {
      navigator.clipboard.writeText(plan.content);
      alert('クリップボードにコピーしました');
    }
  };

  const parsed = parseMonitoringContent(plan.content);

  // 未入力・未生成の初期状態
  if (!plan.content && !isLoading && !plan.error) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-slate-400">
        <div className="mb-4">
          <span className="text-5xl opacity-20 block mb-2">📋</span>
        </div>
        <p className="text-sm font-medium text-slate-500 mb-1">モニタリング結果はまだ生成されていません</p>
        <p className="text-xs">左側のフォームを入力して「記録案を生成」ボタンを押してください</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col pt-4 md:pt-5 bg-slate-50">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 md:px-5 pb-3 border-b border-slate-200 flex-shrink-0">
        <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
          <span className="text-indigo-600">📊</span>
          生成されたモニタリング記録案
        </h2>
        <button
          onClick={handleCopy}
          disabled={!plan.content || isLoading}
          className="text-xs font-medium px-4 py-2 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          記録をコピー
        </button>
      </div>

      {/* メインコンテンツ */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 relative">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-sm z-10">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-200 border-b-indigo-600 mb-3"></div>
            <p className="text-sm font-bold text-indigo-700">モニタリング情報を分析・要約中...</p>
          </div>
        )}

        {plan.error ? (
          <div className="p-4 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            <div className="font-bold mb-1">生成エラー</div>
            <div>{plan.error}</div>
          </div>
        ) : !parsed.isParsed ? (
          /* パース失敗時のフォールバック表示 */
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">生成結果（生テキスト）</h3>
            <div className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700">
              {plan.content}
            </div>
          </div>
        ) : (
          /* 構造化表示 */
          <div className="flex flex-col gap-5">
            {/* 3. 総括（最優先表示） */}
            {parsed.summary && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-5 shadow-sm ring-1 ring-indigo-500/10">
                <h3 className="text-sm font-bold text-indigo-800 mb-3 flex items-center gap-1.5">
                  <span>✨</span> 3. 総括（生活像と今後の方針）
                </h3>
                <div className="text-[14px] leading-relaxed font-bold text-slate-800">
                  {parsed.summary}
                </div>
              </div>
            )}

            {/* 1. 実施状況 */}
            {parsed.status && (
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-2 pb-2 border-b border-slate-100">
                  1. モニタリング実施状況
                </h3>
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {parsed.status}
                </div>
              </div>
            )}

            {/* 2. 評価項目 */}
            {parsed.evaluationItems.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 pb-2 border-b border-slate-100">
                  2. 評価（8項目詳細）
                </h3>
                <div className="grid grid-cols-1 gap-y-3">
                  {parsed.evaluationItems.map((item, idx) => (
                    <div key={idx} className="flex gap-3 text-sm leading-relaxed">
                      <span className="font-bold text-indigo-700 w-28 flex-shrink-0">
                        {idx + 1}. {item.label}
                      </span>
                      <span className="text-slate-700">{item.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 考察 */}
            {parsed.discussion && (
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 shadow-sm italic">
                <h3 className="text-sm font-bold text-slate-700 mb-2">考察</h3>
                <div className="text-sm leading-relaxed text-slate-600 whitespace-pre-wrap">
                  {parsed.discussion}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 注釈 */}
      {!isLoading && !plan.error && plan.content && (
        <div className="p-3 bg-slate-200/50 border-t border-slate-200 text-xs text-slate-600 text-center leading-relaxed">
          この生成結果はモニタリング報告書の草案です。<br />
          必ず内容を確認し、実態に合わせて修正した上で記録として採用してください。
        </div>
      )}
    </div>
  );
};

export default MonitoringResultPanel;
