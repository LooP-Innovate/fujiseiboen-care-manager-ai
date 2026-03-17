import React from 'react';

interface ModelSelectorProps {
  selectedModelId: string | undefined;
  onModelSelect: (modelId: string) => void;
  disabled?: boolean;
}

const MODELS = [
  { id: 'gemini-2.5-flash-lite', name: 'Gemini (Flash-Lite)', provider: 'Google' },
  { id: 'gpt-4o-mini', name: 'ChatGPT (4o-mini)', provider: 'OpenAI' },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModelId, onModelSelect, disabled }) => {
  return (
    <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
      {MODELS.map((model) => (
        <button
          key={model.id}
          disabled={disabled}
          onClick={() => onModelSelect(model.id)}
          className={`flex-1 px-3 py-1.5 text-[11px] font-bold rounded-md transition-all duration-200 ${
            selectedModelId === model.id || (!selectedModelId && model.id === 'gemini-2.5-flash-lite')
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
        >
          <span className="truncate">{model.name}</span>
        </button>
      ))}
    </div>
  );
};

export default ModelSelector;
