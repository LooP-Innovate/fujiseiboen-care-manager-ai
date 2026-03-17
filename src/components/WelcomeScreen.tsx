import React from 'react';
import { suggestionCategories } from '../constants';

interface WelcomeScreenProps {
  onSelectSuggestion: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectSuggestion }) => {
  return (
    <div className="flex-1 flex flex-col items-center bg-slate-50 p-6 overflow-y-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-800">アシスタントに何から始めますか？</h2>
        <p className="text-slate-800 mt-2">以下の提案を選択するか、ご自身のメッセージを入力してください。</p>
      </div>
      <div className="w-full max-w-5xl space-y-8">
        {suggestionCategories.map((category) => (
          <div key={category.name}>
            <h3 className="text-lg font-semibold text-slate-800 mb-4 px-2">{category.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {category.suggestions.map((suggestion) => (
                <button
                  key={suggestion.title}
                  onClick={() => onSelectSuggestion(suggestion.command)}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer flex items-start space-x-4 text-left border border-slate-200 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-full"
                >
                  <div className="flex-shrink-0 mt-1">{suggestion.icon}</div>
                  <div>
                    <p className="font-semibold text-slate-800">{suggestion.title}</p>
                    <p className="text-sm text-slate-800 mt-1">{suggestion.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeScreen;