import React from 'react';
import { FormData, ResidentInfo, NeedsInfo, CareLevel } from '../types';

interface InputFormProps {
  formData: FormData;
  onUpdateResident: (field: keyof ResidentInfo, value: string) => void;
  onUpdateNeeds: (field: keyof NeedsInfo, value: string) => void;
  onUpdateReference: (value: string) => void;
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
  onUpdateReference,
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
          <Field label="要介護度" required helperText="現在の認定状況">
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
        <Field label="本人・家族の希望（意向）" required helperText="今後の生活に対する本人と家族の目標や意向">
          <textarea
            rows={3}
            value={needs.wishes}
            onChange={(e) => onUpdateNeeds('wishes', e.target.value)}
            placeholder="例：【本人】できるだけ住み慣れた家で過ごしたい。&#10;【家族】転倒や誤嚥が心配なので、安全に見守れる体制を作りたい。"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ2：対象者の現状 */}
      <Section title="2. 対象者の現状">
        <Field label="主疾患・医療的ケア・服薬状況" required helperText="病名、治療中の疾患、服薬上の注意点など">
          <textarea
            rows={2}
            value={resident.mainDiagnosis}
            onChange={(e) => onUpdateResident('mainDiagnosis', e.target.value)}
            placeholder="例：アルツハイマー型認知症。高血圧のため降圧剤を朝食後に服薬。インスリン自己注射あり。"
            className={textareaClass}
          />
        </Field>
        <Field label="ADL・身体状況（課題となる点）" required helperText="移動、食事、排泄、入浴などの日常生活動作における課題">
          <textarea
            rows={3}
            value={needs.physicalStatus}
            onChange={(e) => onUpdateNeeds('physicalStatus', e.target.value)}
            placeholder="例：移動は杖歩行だが不安定で転倒リスクあり。排泄はリハパンツ使用、時々失敗あり。入浴は見守りが必要。"
            className={textareaClass}
          />
        </Field>
        <Field label="認知機能・精神状況" required helperText="見当識障害、記憶障害、周辺症状（BPSD）の有無など">
          <textarea
            rows={2}
            value={needs.cognition}
            onChange={(e) => onUpdateNeeds('cognition', e.target.value)}
            placeholder="例：短期記憶の低下あり、直前の出来事を忘れる。夕方になると不穏になることがある。"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ3：取り巻く環境とリスク */}
      <Section title="3. 取り巻く環境とリスク">
        <Field label="家族構成・支援体制" required helperText="キーパーソンの状況、日中・夜間のサポート体制（インフォーマル支援）">
          <textarea
            rows={2}
            value={needs.familySupport}
            onChange={(e) => onUpdateNeeds('familySupport', e.target.value)}
            placeholder="例：長女と同居だが日中はフルタイム勤務のため不在。キーパーソンは長女。近隣に親族なし。"
            className={textareaClass}
          />
        </Field>
        <Field label="リスク・留意点（環境要因含む）" required helperText="段差・住環境・独居・動線などの環境要因、その他の安全リスク">
          <textarea
            rows={3}
            value={needs.otherRisks}
            onChange={(e) => onUpdateNeeds('otherRisks', e.target.value)}
            placeholder="例：【環境】築40年の戸建てで段差が多い。寝室が2階のため階段昇降のリスク高。&#10;【リスク】過去半年で2回転倒。独居時の火の不始末の恐れ。"
            className={textareaClass}
          />
        </Field>
      </Section>

      {/* グループ4：基本属性 */}
      <Section title="4. 基本属性">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Field label="氏名" helperText="イニシャル・識別名でも可">
            <input
              type="text"
              value={resident.name}
              onChange={(e) => onUpdateResident('name', e.target.value)}
              placeholder="例：山田 花子 または Y.H氏"
              className={inputClass}
            />
          </Field>
          <Field label="年齢">
            <input
              type="text"
              value={resident.age}
              onChange={(e) => onUpdateResident('age', e.target.value)}
              placeholder="例：85"
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

      {/* グループ5：補助情報・参考資料 */}
      <Section title="5. 補助情報・参考資料">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center">
              <label className="block text-sm font-bold text-slate-700">参考資料・引継ぎメモ</label>
              <span className="ml-2 text-[10px] font-bold text-slate-500 bg-slate-200 rounded px-1.5 py-0.5">任意</span>
            </div>
            <div>
              <input 
                type="file" 
                accept=".txt,.md" 
                id="file-upload"
                className="hidden" 
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 1024 * 100) { // Limit to 100KB for text
                    alert('ファイルサイズが大きすぎます。100KB以下のテキストファイルを指定してください。');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const text = event.target?.result as string;
                    onUpdateReference(text);
                  };
                  reader.onerror = () => {
                    alert('ファイルの読み込みに失敗しました。');
                  }
                  reader.readAsText(file);
                  // clear input to allow selecting same file again
                  e.target.value = '';
                }}
              />
              <label 
                htmlFor="file-upload" 
                className="cursor-pointer text-xs font-medium px-2 py-1 bg-slate-100 border border-slate-300 rounded hover:bg-slate-200 transition-colors flex items-center gap-1 text-slate-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                ファイル読込
              </label>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-1.5">退院時サマリーや引継ぎメモ等のテキストを貼り付けるか、ファイルを取り込めます（100KBまで）。</p>
          <textarea
            rows={4}
            value={formData.referenceText}
            onChange={(e) => onUpdateReference(e.target.value)}
            placeholder="例：〇〇病院 退院支援サマリー：麻痺側の荷重は〇〇..."
            className={textareaClass}
          />
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
