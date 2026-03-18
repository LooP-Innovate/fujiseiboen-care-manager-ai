import React from 'react';
import { FormData, ResidentInfo, NeedsInfo, CareLevel } from '../types';

interface InputFormProps {
  formData: FormData;
  onUpdateResident: (field: keyof ResidentInfo, value: string) => void;
  onUpdateNeeds: (field: keyof NeedsInfo, value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

// セクションタイトル
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-5">
    <h3 className="text-xs font-bold uppercase tracking-wider text-teal-700 border-b border-teal-100 pb-1 mb-3">
      {title}
    </h3>
    {children}
  </div>
);

// 1行ラベル＋入力
const Field: React.FC<{
  label: string;
  required?: boolean;
  children: React.ReactNode;
}> = ({ label, required, children }) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
  </div>
);

const inputClass =
  'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent';
const textareaClass =
  'w-full text-sm rounded border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent resize-none';

const careLevels: CareLevel[] = [
  '', '要支援1', '要支援2', '要介護1', '要介護2', '要介護3', '要介護4', '要介護5',
];

const InputForm: React.FC<InputFormProps> = ({
  formData,
  onUpdateResident,
  onUpdateNeeds,
  onGenerate,
  isLoading,
}) => {
  const { resident, needs } = formData;

  return (
    <div className="p-4 md:p-5">
      <h2 className="text-base font-bold text-slate-800 mb-4">利用者情報・課題入力</h2>

      {/* グループ1：プランの前提 */}
      <Section title="1. プランの前提">
        <div className="mb-3">
          <Field label="要介護度" required>
            <select
              value={resident.careLevel}
              onChange={(e) => onUpdateResident('careLevel', e.target.value)}
              className={inputClass}
            >
              {careLevels.map((l) => (
                <option key={l} value={l}>{l || '選択してください'}</option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="本人・家族の希望" required>
          <textarea
            rows={2}
            value={needs.wishes}
            onChange={(e) => onUpdateNeeds('wishes', e.target.value)}
            placeholder="例：「できるだけ家で過ごしたい」。家族は転倒・誤嚥が心配"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ2：対象者の現状 */}
      <Section title="2. 対象者の現状">
        <Field label="主疾患・医療的ケア" required>
          <input
            type="text"
            value={resident.mainDiagnosis}
            onChange={(e) => onUpdateResident('mainDiagnosis', e.target.value)}
            placeholder="例：アルツハイマー型認知症。降圧剤を腹薬中"
            className={inputClass}
          />
        </Field>
        <Field label="ADL・身体状況" required>
          <textarea
            rows={3}
            value={needs.physicalStatus}
            onChange={(e) => onUpdateNeeds('physicalStatus', e.target.value)}
            placeholder="例：移動は杖歩行で不安定。入浴は見守り。排泄はリハパン使用で時々失敗あり。"
            className={textareaClass}
          />
        </Field>
        <Field label="認知機能・精神状況" required>
          <textarea
            rows={2}
            value={needs.cognition}
            onChange={(e) => onUpdateNeeds('cognition', e.target.value)}
            placeholder="例：直前のことを忘れる。夕方不穏になることがある。"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ3：取り巻く環境とリスク */}
      <Section title="3. 取り巻く環境とリスク">
        <Field label="家族・支援体制" required>
          <textarea
            rows={2}
            value={needs.familySupport}
            onChange={(e) => onUpdateNeeds('familySupport', e.target.value)}
            placeholder="例：長女と同居だが日中は仕事で不在。近隣に親族なし。"
            className={textareaClass}
          />
        </Field>
        <Field label="リスク・留意点" required>
          <textarea
            rows={2}
            value={needs.otherRisks}
            onChange={(e) => onUpdateNeeds('otherRisks', e.target.value)}
            placeholder="例：過去半年で2回戦倒。段差でのつまづきリスク高。"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ4：基本属性（任意） */}
      <Section title="4. 基本属性（任意）">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="氏名">
            <input
              type="text"
              value={resident.name}
              onChange={(e) => onUpdateResident('name', e.target.value)}
              placeholder="例：山田 花子"
              className={inputClass}
            />
          </Field>
          <Field label="年齢">
            <input
              type="text"
              value={resident.age}
              onChange={(e) => onUpdateResident('age', e.target.value)}
              placeholder="例：82"
              className={inputClass}
            />
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="性別">
            <select
              value={resident.gender}
              onChange={(e) => onUpdateResident('gender', e.target.value)}
              className={inputClass}
            >
              <option value="">選択</option>
              <option value="女性">女性</option>
              <option value="男性">男性</option>
            </select>
          </Field>
        </div>
      </Section>

      {/* ─── 生成ボタン ─── */}
      <button
        onClick={onGenerate}
        disabled={isLoading || !resident.careLevel}
        className="w-full py-3 rounded-lg font-bold text-white bg-teal-600 hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {isLoading ? '生成中...' : '✨ ケアプラン草案を生成'}
      </button>
      {!resident.careLevel && (
        <p className="text-xs text-slate-500 text-center mt-2">※ 要介護度を選択してください</p>
      )}
    </div>
  );
};

export default InputForm;
