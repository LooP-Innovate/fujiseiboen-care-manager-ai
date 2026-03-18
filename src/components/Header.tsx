import React from 'react';
import { AiModel } from '../types';

interface HeaderProps {
  selectedModel: AiModel;
  onModelChange: (model: AiModel) => void;
  onClear: () => void;
}

const Header: React.FC<HeaderProps> = ({ selectedModel, onModelChange, onClear }) => {
  return (
    <header className="flex items-center justify-between px-4 py-3 bg-teal-700 text-white shadow-md flex-shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xl font-bold tracking-tight">🩺 ケアプランAI支援</span>
        <span className="text-xs text-teal-200 hidden sm:block">藤聖母園 介護支援専門員向け</span>
        <span className="text-[10px] text-teal-300 ml-1 border border-teal-400 px-1.5 py-0.5 rounded bg-teal-800/30">RC 2026-03-18</span>
      </div>
      <div className="flex items-center gap-3">
        {/* AIモデル選択 */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-teal-200 whitespace-nowrap">AIモデル</label>
          <select
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value as AiModel)}
            className="text-sm rounded px-2 py-1 bg-teal-600 text-white border border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-300"
          >
            <option value="gemini">Gemini (Flash)</option>
            <option value="openai">GPT-4o mini</option>
          </select>
        </div>
        {/* クリアボタン */}
        <button
          onClick={onClear}
          className="text-xs px-3 py-1 rounded border border-teal-400 hover:bg-teal-600 transition-colors"
          title="入力・結果をクリア"
        >
          クリア
        </button>
      </div>
    </header>
  );
};

export default Header;
