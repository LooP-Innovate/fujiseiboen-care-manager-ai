import { useState, useCallback } from 'react';
import { MonitoringFormData, GeneratedPlan, AiModel, MonitoringInputMode } from '../types';
import { AIService } from '../services/aiService';
import { loadRelevantKnowledge } from '../prompts/knowledgeLoader';

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
  pasteText: '',
};

export const useMonitoring = () => {
  const [monitoringData, setMonitoringData] = useState<MonitoringFormData>(initialMonitoringData);
  const [inputMode, setInputMode] = useState<MonitoringInputMode>('detailed');
  const [generatedRecord, setGeneratedRecord] = useState<GeneratedPlan>({
    content: '',
    isStreaming: false,
    error: null,
  });
  const [isMonitoringLoading, setIsMonitoringLoading] = useState(false);

  const updateMonitoringField = useCallback((field: keyof MonitoringFormData, value: string) => {
    setMonitoringData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleClearMonitoring = useCallback(() => {
    if (window.confirm('モニタリングの入力内容をすべてクリアしますか？')) {
      setMonitoringData({ ...initialMonitoringData });
      setGeneratedRecord({ content: '', isStreaming: false, error: null });
    }
  }, []);

  const handleGenerateMonitoring = useCallback(async (selectedModel: AiModel) => {
    if (!monitoringData.caseNumber) return;
    
    setIsMonitoringLoading(true);
    setGeneratedRecord({ content: '', isStreaming: false, error: null });

    try {
      const knowledgeContext = loadRelevantKnowledge(monitoringData, 'monitoring');
      let prompt = '';
      
      if (inputMode === 'detailed') {
        prompt = `
以下のモニタリング入力情報に基づき、指定されたフォーマットでモニタリング記録を作成してください。

${knowledgeContext ? knowledgeContext + '\n' : ''}

【基本状況】
ケース番号/識別子: ${monitoringData.caseNumber}
実施状況: ${monitoringData.monitoringStatus}
利用者の基本状況: ${monitoringData.basicStatus || '未記入'}
課題と目標: ${monitoringData.goals || '未記入'}
利用中サービス: ${monitoringData.currentServices || '未記入'}

【アセスメント項目】
食事・水分摂取: ${monitoringData.meals || '未記入'}
排泄: ${monitoringData.excretion || '未記入'}
入浴: ${monitoringData.bathing || '未記入'}
皮膚状態: ${monitoringData.skin || '未記入'}
基本動作: ${monitoringData.mobility || '未記入'}
リハビリ: ${monitoringData.rehabilitation || '未記入'}
医療・健康: ${monitoringData.health || '未記入'}
心理・社会面: ${monitoringData.psychological || '未記入'}

【その他特記事項】
補足メモ: ${monitoringData.notes || '未記入'}
        `.trim();
      } else {
        // Simple Mode (Paste Mode)
        prompt = `
以下の貼り付けられた原文情報に基づき、指定されたフォーマットでモニタリング記録を構造化・整理してください。

${knowledgeContext ? knowledgeContext + '\n' : ''}

【制約事項】
- 原文にある情報を最優先し、原文にない事実を勝手に推測して補完しないでください。
- 特定の項目（食事、排泄等）について原文に記載がない場合は、「不明」「記載なし」として扱ってください。
- 根拠に基づかない断定を避け、客観的な事実を中心に整理してください。
- 1ケース分の情報として処理してください。

【基本状況】
ケース番号/識別子: ${monitoringData.caseNumber}
実施状況: ${monitoringData.monitoringStatus}

【貼り付け原文】
${monitoringData.pasteText || '（原文なし）'}
        `.trim();
      }

      const response = await AIService.runChat(
        'session-monitoring',
        'モニタリング記録',
        prompt,
        [],
        selectedModel === 'openai' ? 'gpt-4o-mini' : 'gemini-2.5-flash-lite'
      );

      setGeneratedRecord({ 
        content: response.content, 
        isStreaming: false, 
        error: null 
      });
    } catch (err) {
      setGeneratedRecord({
        content: '',
        isStreaming: false,
        error: err instanceof Error ? err.message : '予期せぬエラーが発生しました',
      });
    } finally {
      setIsMonitoringLoading(false);
    }
  }, [monitoringData]);

  return {
    monitoringData,
    inputMode,
    generatedRecord,
    isMonitoringLoading,
    setInputMode,
    updateMonitoringField,
    handleClearMonitoring,
    handleGenerateMonitoring,
  };
};
