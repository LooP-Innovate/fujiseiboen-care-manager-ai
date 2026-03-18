import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultPanel from './components/ResultPanel';
import { useCarePlan } from './hooks/useCarePlan';

export type AppMode = 'care-plan' | 'monitoring';

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<AppMode>('care-plan');
  const {
    formData,
    generatedPlan,
    selectedModel,
    isLoading,
    updateResident,
    updateNeeds,
    updateReference,
    setSelectedModel,
    handleGenerate,
    handleClear,
  } = useCarePlan();

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Header
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        onClear={handleClear}
      />
      
      {/* モード切替タブ */}
      <div className="bg-white border-b border-slate-200 px-4 flex gap-6 flex-shrink-0">
        <button 
          onClick={() => setAppMode('care-plan')}
          className={`text-sm font-bold py-2.5 border-b-2 transition-colors ${appMode === 'care-plan' ? 'text-teal-700 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
        >
          📝 ケアプラン草案作成
        </button>
        <button 
          onClick={() => setAppMode('monitoring')}
          className={`text-sm font-bold py-2.5 border-b-2 transition-colors ${appMode === 'monitoring' ? 'text-teal-700 border-teal-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}
        >
          🔍 モニタリング記録
        </button>
      </div>

      <main className="flex flex-1 overflow-hidden gap-0">
        {appMode === 'care-plan' ? (
          <>
            {/* 左ペイン: 入力フォーム */}
            <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-200 bg-white">
          <InputForm
            formData={formData}
            onUpdateResident={updateResident}
            onUpdateNeeds={updateNeeds}
            onUpdateReference={updateReference}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={generatedPlan.isStreaming}
          />
        </div>
        {/* 右ペイン: 生成結果 */}
        <div className="w-full md:w-1/2 overflow-y-auto bg-slate-50">
          <ResultPanel
            plan={generatedPlan}
            isLoading={isLoading}
          />
        </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center w-full bg-slate-50 h-full p-8 text-center overflow-y-auto">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-lg">
              <span className="text-4xl mb-4 block">🚧</span>
              <h2 className="text-lg font-bold text-slate-800 mb-2">モニタリング記録モード（開発中）</h2>
              <p className="text-sm text-slate-500">
                この画面では、毎月の訪問記録やアセスメント情報を入力し、<br className="hidden sm:block" />
                支援経過記録やモニタリング報告書の仮文章をAIで自動生成する機能を実装予定です。
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
