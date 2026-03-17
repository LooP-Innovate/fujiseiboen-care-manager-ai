
import React from 'react';
import { SuggestionCategory } from './types';

export const suggestionCategories: SuggestionCategory[] = [
  {
    name: 'プランニング',
    suggestions: [
      {
        title: 'ケアプラン草案',
        command: 'ケアプラン案',
        description: '利用者様の課題や目標に基づき、ケアプランの草案を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 5.25 6h.008a2.25 2.25 0 0 1 2.242 2.15 2.25 2.25 0 0 0 2.25 2.25h1.5m-3.75.75h3.75a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08" })
        ),
      },
      {
        title: '要介護認定チェック',
        command: '要介護認定チェック',
        description: '新規/更新/区分変更の申請書類や手順、依頼文を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" })
        ),
      },
      {
        title: '福祉用具/住宅改修 理由書',
        command: '福祉用具/住宅改修 理由書テンプレ',
        description: '福祉用具のレンタルや住宅改修に必要な理由書の骨子を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
           'svg',
           { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
           React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" })
        ),
      },
    ],
  },
  {
    name: '連絡・調整',
    suggestions: [
      {
        title: '家族連絡文',
        command: '家族連絡文',
        description: 'ご家族への近況報告や、ケアに関する提案の連絡文を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" })
        ),
      },
      {
        title: '事業所連絡文',
        command: '事業所連絡文',
        description: 'サービス変更や加算の確認など事業所への連絡文を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6h1.5m-1.5 3h1.5m-1.5 3h1.5M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" })
        ),
      },
      {
        title: '主治医照会文',
        command: '主治医照会文',
        description: '服薬の相談や診療情報提供依頼など、主治医への照会文を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" })
        ),
      },
      {
        title: '退院・退所調整',
        command: '退院調整',
        description: '退院前カンファのアジェンダや在宅受け入れ体制案を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M12 6v12m-3-9l-3 3 3 3m6-6l3 3-3 3" })
        ),
      },
    ],
  },
  {
    name: '記録・会議',
    suggestions: [
       {
        title: 'モニタリング記録',
        command: 'モニタリング記録',
        description: '面談の要点や利用者の変化、今後の対応案などを記録します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" })
        ),
      },
      {
        title: '会議アジェンダ',
        command: 'サービス担当者会議アジェンダ',
        description: 'サービス担当者会議などの目的や議題をまとめたアジェンダを作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
           'svg',
           { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
           React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m-7.5-2.962A3.75 3.75 0 0 1 15 10.5c1.453 0 2.74-.672 3.5-1.688m-3.5 1.688c-.337.087-.686.134-1.043.134m-4.043 0a3.75 3.75 0 0 1-7.5 0c0-.592.134-1.153.37-1.688m5.5 0c.358.114.73.178 1.125.178m-1.125 0c-.666 0-1.295-.126-1.88-.354M4.5 6.75v1.5a2.25 2.25 0 0 0 2.25 2.25h1.5a2.25 2.25 0 0 0 2.25-2.25v-1.5m-3.75 0h3.75a2.25 2.25 0 0 0 2.25-2.25V5.25a2.25 2.25 0 0 0-2.25-2.25h-1.5A2.25 2.25 0 0 0 6 5.25v1.5" })
        ),
      },
      {
        title: '会議録',
        command: '会議録',
        description: '会議の議事メモから、決定事項やToDoを整理した会議録を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" })
        ),
      },
    ],
  },
  {
    name: '運用・月次',
    suggestions: [
      {
        title: '給付管理チェック',
        command: '給付管理チェック',
        description: '予定と実績の差分を確認し、事業所への照会文を作成します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm0 3h.008v.008H8.25v-.008Zm3-6h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm0 3h.008v.008H11.25v-.008Zm3-6h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008Zm0 3h.008v.008H14.25v-.008ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" })
        ),
      },
      {
        title: '訪問スケジュール',
        command: '訪問スケジュール',
        description: '複数案件の訪問計画を、移動時間や天候を考慮して効率化します。',
        // FIX: Replaced JSX with React.createElement to be compatible with .ts file extension.
        icon: React.createElement(
          'svg',
          { xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", strokeWidth: 1.5, stroke: "currentColor", className: "w-8 h-8 text-slate-700" },
          React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18M12 12.75h.008v.008H12v-.008Z" })
        ),
      },
    ],
  },
];