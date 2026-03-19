import React, { useState } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import MonitoringForm from './components/MonitoringForm';
import ResultPanel from './components/ResultPanel';
import MonitoringResultPanel from './components/MonitoringResultPanel';
import MonitoringSimpleForm from './components/MonitoringSimpleForm';
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
    inputMode,
    generatedRecord,
    isMonitoringLoading,
    setInputMode,
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
              {/* サブモード切替 */}
              <div className="px-4 pt-4 flex gap-2">
                <button 
                  onClick={() => setInputMode('detailed')}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${inputMode === 'detailed' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}
                >
                  詳細入力
                </button>
                <button 
                  onClick={() => setInputMode('simple')}
                  className={`px-3 py-1 text-xs font-bold rounded-full border transition-colors ${inputMode === 'simple' ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-300 text-slate-600 hover:border-indigo-400'}`}
                >
                  コピペ簡易入力
                </button>
              </div>

              {inputMode === 'detailed' ? (
                <MonitoringForm
                  formData={monitoringData}
                  onUpdateField={updateMonitoringField}
                  onGenerate={() => handleGenerateMonitoring(selectedModel)}
                  onClear={handleClearMonitoring}
                  isLoading={isMonitoringLoading}
                />
              ) : (
                <MonitoringSimpleForm
                  formData={monitoringData}
                  onUpdateField={updateMonitoringField}
                  onGenerate={() => handleGenerateMonitoring(selectedModel)}
                  onClear={handleClearMonitoring}
                  isLoading={isMonitoringLoading}
                />
              )}
            </div>
            {/* 右ペイン: モニタリング生成結果 */}
            <div className="w-full md:w-1/2 overflow-y-auto bg-slate-50">
              <MonitoringResultPanel
                plan={generatedRecord}
                isLoading={isMonitoringLoading}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default App;
