import { useState } from 'react';
import { AIService } from '../services/aiService';
import { ExcelService } from '../services/excelService';
import { excelExportPrompt } from '../prompts/excelPrompt';
import { CarePlan2AiResponse, CarePlan2ExportData } from '../types/excel';
import { AiModel } from '../types';

interface UseExcelExportProps {
  userName: string;
}

export const useExcelExport = ({ userName }: UseExcelExportProps) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToExcel = async (planContent: string, selectedModel: AiModel) => {
    // 必須チェック
    if (!planContent) {
      alert('プレーンなケアプラン原案がまだ生成されていません。先に「生成」してください。');
      return;
    }
    
    // ユーザー名などは外部からPropsで貰う（あるいは入力フォームから）
    // （今回はuserNameだけ必須としています）

    setIsExporting(true);
    try {
      // 1. AIを使って自然文を帳票用JSONデータ構造に変換
      const aiResponse = await AIService.runChat(
        'excel-export-session', // dummy session ID
        'excel_export' as any, // Needs to trick type if not added to TaskType
        `以下のケアプラン原案を、短く簡素化して指定のJSON配列構造に要約してください。
        
        【ケアプラン原案】
        ${planContent}`,
        [],
        selectedModel
      );

      // 2. parse JSON
      let rawJsonText = aiResponse.content;
      // markdownの ```json ... ``` を除去
      rawJsonText = rawJsonText.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedData = JSON.parse(rawJsonText) as CarePlan2AiResponse;
      
      const exportData: CarePlan2ExportData = {
        userName: userName || '未入力',
        createdDate: new Date().toLocaleDateString('ja-JP'),
        planItems: parsedData.planItems || []
      };

      // 3. ダウンロード処理
      await ExcelService.exportCarePlan2(exportData);

    } catch (error) {
      console.error('Export Error:', error);
      alert('帳票出力中にエラーが発生しました。\n長すぎたか、AIの一時的な不具合の可能性があります。\n詳細: ' + (error as Error).message);
    } finally {
      setIsExporting(false);
    }
  };

  return {
    isExporting,
    exportToExcel
  };
};
