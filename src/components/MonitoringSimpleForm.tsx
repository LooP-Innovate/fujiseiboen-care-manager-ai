import React from 'react';
import { MonitoringFormData } from '../types';

interface MonitoringSimpleFormProps {
  formData: MonitoringFormData;
  onUpdateField: (field: keyof MonitoringFormData, value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

const MonitoringSimpleForm: React.FC<MonitoringSimpleFormProps> = ({
  formData,
  onUpdateField,
  onGenerate,
  onClear,
  isLoading = false,
}) => {
  const inputClass = 'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent';
  const textareaClass = 'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y min-h-[300px]';

  return (
    <div className="p-4 md:p-5">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">📋</span> 
        コピペ簡易入力（1ケース分）
      </h2>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            ケース番号・識別子 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.caseNumber}
            onChange={(e) => onUpdateField('caseNumber', e.target.value)}
            className={inputClass}
            placeholder="例: CASE-001, 利用者A"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">
            対象月・実施状況 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.monitoringStatus}
            onChange={(e) => onUpdateField('monitoringStatus', e.target.value)}
            className={inputClass}
            placeholder="例: R5年10月 自宅訪問"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-bold text-slate-700 mb-1">
          貼り付け原文 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-slate-500 mb-2 leading-relaxed">
          東経システム等からコピーした情報をそのまま貼り付けてください。<br />
          箇条書き、時系列メモ、断片的な文章でも構いません。<br />
          <span className="text-amber-600 font-bold">※ 氏名などの個人情報は可能な範囲で伏せてください。</span>
        </p>
        <textarea
          value={formData.pasteText}
          onChange={(e) => onUpdateField('pasteText', e.target.value)}
          className={textareaClass}
          placeholder="ここに記録を貼り付けてください..."
        />
      </div>

      <div className="flex gap-3 mt-6">
        <button
          onClick={onClear}
          disabled={isLoading}
          className="w-1/3 py-3 rounded-lg font-bold text-slate-600 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 transition-colors shadow-sm"
        >
          クリア
        </button>
        <button
          onClick={onGenerate}
          disabled={isLoading || !formData.caseNumber || !formData.monitoringStatus || !formData.pasteText}
          className="w-2/3 py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>{isLoading ? '解析・生成中...' : '記録案を生成'}</span>
        </button>
      </div>
      
      {(!formData.caseNumber || !formData.monitoringStatus || !formData.pasteText) && (
        <p className="text-xs text-slate-500 text-center mt-2 italic">
          ※ 必須項目（*）をすべて入力すると生成ボタンが有効になります
        </p>
      )}
    </div>
  );
};

export default MonitoringSimpleForm;
