import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import MonitoringForm from './components/MonitoringForm';
import ResultPanel from './components/ResultPanel';
import { useCarePlan } from './hooks/useCarePlan';
import { useMonitoring } from './hooks/useMonitoring';

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

  const {
    monitoringData,
    updateMonitoringField,
    handleClearMonitoring,
    handleGenerateMonitoring,
  } = useMonitoring();

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
          <>
            {/* 左ペイン: モニタリング用入力フォーム */}
            <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-200 bg-white">
              <MonitoringForm
                formData={monitoringData}
                onUpdateField={updateMonitoringField}
                onGenerate={handleGenerateMonitoring}
                onClear={handleClearMonitoring}
              />
            </div>
            {/* 右ペイン: プレースホルダ */}
            <div className="w-full md:w-1/2 overflow-y-auto bg-slate-50 relative">
              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-slate-50/80 backdrop-blur-sm z-10">
                <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-200 max-w-sm">
                  <span className="text-4xl mb-4 block">🚧</span>
                  <h2 className="text-lg font-bold text-slate-800 mb-2">生成機能は開発中です</h2>
                  <p className="text-sm text-slate-500">
                    現在、入力フォームのみテスト公開しています。<br />
                    AIによる文章生成機能は近日対応予定です。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
