import { useState, useCallback } from 'react';
import { MonitoringFormData } from '../types';

const initialMonitoringData: MonitoringFormData = {
  caseNumber: '',
  basicStatus: '',
  currentIssues: '',
  goals: '',
  currentServices: '',
  monitoringStatus: '',
  meals: '',
  excretion: '',
  bathing: '',
  skin: '',
  mobility: '',
  rehabilitation: '',
  health: '',
  psychological: '',
  notes: '',
};

export const useMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringFormData>(initialMonitoringData);

  const updateMonitoringField = useCallback((field: keyof MonitoringFormData, value: string) => {
    setMonitoringData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleClearMonitoring = useCallback(() => {
    if (window.confirm('モニタリングの入力内容をすべてクリアしますか？')) {
      setMonitoringData(initialMonitoringData);
    }
  }, []);

  // For future use when AI generation is wired up
  const handleGenerateMonitoring = useCallback(async () => {
    alert('現在開発中です。次期アップデートでAIプロンプトと接続します。');
  }, []);

  return {
    monitoringData,
    updateMonitoringField,
    handleClearMonitoring,
    handleGenerateMonitoring,
  };
};
