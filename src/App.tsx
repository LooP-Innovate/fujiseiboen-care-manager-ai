import React from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultPanel from './components/ResultPanel';
import { useCarePlan } from './hooks/useCarePlan';

const App: React.FC = () => {
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
      <main className="flex flex-1 overflow-hidden gap-0">
        {/* 左ペイン: 入力フォーム */}
        <div className="w-full md:w-1/2 overflow-y-auto border-r border-slate-200 bg-white">
          <InputForm
            formData={formData}
            onUpdateResident={updateResident}
            onUpdateNeeds={updateNeeds}
            onUpdateReference={updateReference}
            onGenerate={handleGenerate}
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
      </main>
    </div>
  );
};

export default App;
