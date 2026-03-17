import React from 'react';

interface SuggestionChipsProps {
  onSuggestionClick: (text: string) => void;
}

const SUGGESTIONS = [
  { label: 'マルチステップ生成', icon: '🚀', text: 'ケアプラン案: マルチステップでお願いします。' },
  { label: 'ケアプラン案作成', icon: '📝', text: 'ケアプラン案: ' },
  { label: '認定調査票チェック', icon: '🔍', text: '要介護認定チェック: ' },
  { label: '家族への連絡文案', icon: '✉️', text: '家族連絡文: ' },
];

const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onSuggestionClick }) => {
  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {SUGGESTIONS.map((s, i) => (
        <button
          key={i}
          onClick={() => onSuggestionClick(s.text)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-all shadow-sm active:scale-95"
        >
          <span>{s.icon}</span>
          <span className="font-medium">{s.label}</span>
        </button>
      ))}
    </div>
  );
};

export default SuggestionChips;
