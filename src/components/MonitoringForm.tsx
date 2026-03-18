import React from 'react';
import { MonitoringFormData } from '../types';

interface MonitoringFormProps {
  formData: MonitoringFormData;
  onUpdateField: (field: keyof MonitoringFormData, value: string) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading?: boolean;
}

// セクションタイトル
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-700 border-b border-indigo-100 pb-1 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

// 1行ラベル＋入力
const Field: React.FC<{
  label: string;
  required?: boolean;
  helperText?: string;
  children: React.ReactNode;
}> = ({ label, required, helperText, children }) => (
  <div className="mb-4">
    <div className="flex items-center mb-1">
      <label className="block text-sm font-bold text-slate-700">
        {label}
      </label>
      {required ? (
        <span className="ml-2 text-[10px] font-bold text-white bg-red-500 rounded px-1.5 py-0.5">必須</span>
      ) : (
        <span className="ml-2 text-[10px] font-bold text-slate-500 bg-slate-200 rounded px-1.5 py-0.5">任意</span>
      )}
    </div>
    {helperText && <p className="text-xs text-slate-500 mb-1.5">{helperText}</p>}
    {children}
  </div>
);

const inputClass =
  'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent';
const textareaClass =
  'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-y min-h-[60px]';

const MonitoringForm: React.FC<MonitoringFormProps> = ({
  formData,
  onUpdateField,
  onGenerate,
  onClear,
  isLoading = false,
}) => {
  return (
    <div className="p-4 md:p-5">
      <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="text-xl">🔍</span> 
        モニタリング情報入力
      </h2>

      {/* グループ1：基本状況と方針 */}
      <Section title="1. 基本状況と方針">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="ケース番号/氏名" required>
            <input
              type="text"
              value={formData.caseNumber}
              onChange={(e) => onUpdateField('caseNumber', e.target.value)}
              className={inputClass}
              placeholder="例: 山田花子"
            />
          </Field>
          <Field label="対象月・実施状況" required>
            <input
              type="text"
              value={formData.monitoringStatus}
              onChange={(e) => onUpdateField('monitoringStatus', e.target.value)}
              className={inputClass}
              placeholder="例: R5年10月 自宅訪問"
            />
          </Field>
        </div>
        <Field label="利用者の基本状況">
          <textarea
            value={formData.basicStatus}
            onChange={(e) => onUpdateField('basicStatus', e.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="現在の課題・目標" helperText="ケアプラン上の短期目標や課題">
          <textarea
            value={formData.goals}
            onChange={(e) => onUpdateField('goals', e.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="利用中サービス">
          <textarea
            value={formData.currentServices}
            onChange={(e) => onUpdateField('currentServices', e.target.value)}
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ2：ADL・身体面（ICF等に基づく項目） */}
      <Section title="2. ADL・身体面の変化">
        <Field label="食事・水分摂取">
          <textarea
            value={formData.meals}
            onChange={(e) => onUpdateField('meals', e.target.value)}
            className={textareaClass}
            placeholder="例: むせ込みなし。水分量は1日800ml程度。"
          />
        </Field>
        <Field label="排泄">
          <textarea
            value={formData.excretion}
            onChange={(e) => onUpdateField('excretion', e.target.value)}
            className={textareaClass}
            placeholder="例: 夜間頻尿あり（3回）。トイレ誘導不可欠。"
          />
        </Field>
        <Field label="入浴・皮膚状態">
          <textarea
            value={formData.bathing}
            onChange={(e) => onUpdateField('bathing', e.target.value)}
            className={textareaClass}
            placeholder="例: デイサービスで週2回入浴。臀部に軽い発赤あり処置中。"
          />
        </Field>
        <Field label="基本動作・リハビリ" helperText="移乗、歩行、リハビリの進捗など">
          <textarea
            value={formData.mobility}
            onChange={(e) => onUpdateField('mobility', e.target.value)}
            className={textareaClass}
            placeholder="例: 杖歩行安定。転倒なし。"
          />
        </Field>
      </Section>

      {/* グループ3：医療・心理社会面 */}
      <Section title="3. 医療・心理社会面">
        <Field label="医療・健康管理" helperText="バイタル、受診状況、服薬など">
          <textarea
            value={formData.health}
            onChange={(e) => onUpdateField('health', e.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="心理・社会面" helperText="意欲、家族関係、他者交流など">
          <textarea
            value={formData.psychological}
            onChange={(e) => onUpdateField('psychological', e.target.value)}
            className={textareaClass}
          />
        </Field>
        <Field label="その他補足・特記事項">
          <textarea
            value={formData.notes}
            onChange={(e) => onUpdateField('notes', e.target.value)}
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* ─── アクションボタン ─── */}
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
          disabled={isLoading || !formData.caseNumber}
          className="w-2/3 py-3 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>{isLoading ? '生成準備中...' : '記録案を生成(準備中)'}</span>
        </button>
      </div>
      {!formData.caseNumber && (
        <p className="text-xs text-slate-500 text-center mt-2">※ ケース番号/氏名を入力してください</p>
      )}
    </div>
  );
};

export default MonitoringForm;
