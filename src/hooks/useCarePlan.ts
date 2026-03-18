import { useState, useCallback } from 'react';
import { FormData, ResidentInfo, NeedsInfo, GeneratedPlan, AiModel } from '../types';
import { AIService } from '../services/aiService';

const initialFormData: FormData = {
  resident: {
    name: '',
    age: '',
    gender: '',
    careLevel: '',
    mainDiagnosis: '',
    medication: '',
  },
  needs: {
    mobility: '',
    eating: '',
    toileting: '',
    bathing: '',
    cognition: '',
    livingEnv: '',
    familySupport: '',
    wishes: '',
    otherRisks: '',
  },
};

export const useCarePlan = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan>({
    content: '',
    isStreaming: false,
    error: null,
  });
  const [selectedModel, setSelectedModel] = useState<AiModel>('gemini');
  const [isLoading, setIsLoading] = useState(false);

  const updateResident = useCallback((field: keyof ResidentInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      resident: { ...prev.resident, [field]: value }
    }));
  }, []);

  const updateNeeds = useCallback((field: keyof NeedsInfo, value: string) => {
    setFormData(prev => ({
      ...prev,
      needs: { ...prev.needs, [field]: value }
    }));
  }, []);

  const handleClear = useCallback(() => {
    if (window.confirm('入力内容と生成結果をすべてクリアしますか？')) {
      setFormData(initialFormData);
      setGeneratedPlan({ content: '', isStreaming: false, error: null });
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!formData.resident.careLevel) return;

    setIsLoading(true);
    setGeneratedPlan({ content: '', isStreaming: false, error: null });

    try {
      const prompt = `
以下の利用者情報に基づき、適切なケアプラン草案（解決すべき課題、長期目標、短期目標、サービス内容）を作成してください。

【利用者情報】
氏名: ${formData.resident.name || '未記入'}
年齢: ${formData.resident.age || '未記入'}
性別: ${formData.resident.gender || '未記入'}
要介護度: ${formData.resident.careLevel}
主疾患: ${formData.resident.mainDiagnosis || '未記入'}
服薬: ${formData.resident.medication || '未記入'}

【ADL・身体状況】
移動: ${formData.needs.mobility || '未記入'}
食事: ${formData.needs.eating || '未記入'}
排泄: ${formData.needs.toileting || '未記入'}
入浴: ${formData.needs.bathing || '未記入'}

【認知・精神】
${formData.needs.cognition || '未記入'}

【生活環境・家族】
環境: ${formData.needs.livingEnv || '未記入'}
支援: ${formData.needs.familySupport || '未記入'}

【希望・特記】
希望: ${formData.needs.wishes || '未記入'}
リスク: ${formData.needs.otherRisks || '未記入'}
      `.trim();

      const response = await AIService.runChat(
        'session-1',
        'ケアプラン案',
        prompt,
        []
      );

      setGeneratedPlan({ 
        content: response.content, 
        isStreaming: false, 
        error: null 
      });
    } catch (err) {
      setGeneratedPlan({
        content: '',
        isStreaming: false,
        error: err instanceof Error ? err.message : '予期せぬエラーが発生しました',
      });
    } finally {
      setIsLoading(false);
    }
  }, [formData]);

  return {
    formData,
    generatedPlan,
    selectedModel,
    isLoading,
    updateResident,
    updateNeeds,
    setSelectedModel,
    handleGenerate,
    handleClear,
  };
};
