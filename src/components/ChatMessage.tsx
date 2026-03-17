import React from 'react';
import { ChatMessage } from '../types';
import { parseAIContent } from '../utils/contentParser';
import { renderBody, renderSectionContent } from '../utils/contentRenderer';

const ChatMessageComponent: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAi = message.sender === 'ai';
  
  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="bg-blue-600 text-white p-3 rounded-lg max-w-lg shadow">
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  const parsed = parseAIContent(message.content);

  return (
    <div className="flex justify-start">
      <div className={`bg-white text-slate-900 border ${message.isError ? 'border-red-400' : 'border-slate-200'} p-4 rounded-lg max-w-2xl shadow-sm w-full space-y-4`}>
        {message.isError ? (
          <div className='prose prose-sm max-w-none text-red-800'>
             <p className='font-bold'>エラーが発生しました</p>
             <p className='text-xs'>{message.content}</p>
          </div>
        ) : parsed ? ( // If content is successfully parsed, render structured view
          <>
            {parsed.other && <div className="prose prose-sm max-w-none prose-slate">{renderBody(parsed.other)}</div>}
            
            {parsed.summary && (
              <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 rounded-r-md">
                <h3 className="font-bold mb-2 text-slate-900">要点サマリ</h3>
                <div className="prose prose-sm max-w-none prose-slate">{renderSectionContent(parsed.summary)}</div>
              </div>
            )}

            {parsed.body && (
              <div>
                <h3 className="font-bold mb-2 text-slate-900">本文/資料</h3>
                <div className="prose prose-sm max-w-none prose-slate">{renderBody(parsed.body)}</div>
              </div>
            )}
            
            {parsed.actions && (
              <div className="border-l-4 border-green-500 pl-4 py-2 bg-green-50 rounded-r-md">
                <h3 className="font-bold mb-2 text-slate-900">アクション (ToDo)</h3>
                <div className="prose prose-sm max-w-none prose-slate">{renderSectionContent(parsed.actions)}</div>
              </div>
            )}
          </>
        ) : ( // Fallback for unparsed or empty content
            <div className="prose prose-sm max-w-none prose-slate whitespace-pre-wrap">
              {message.content}
            </div>
        )}

        {isAi && message.metadata && (
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium italic">
            <span>Powered by {message.metadata.provider === 'vertex' ? 'Google Gemini' : 'OpenAI ChatGPT'}</span>
            <span>{message.metadata.model}</span>
          </div>
        )}

        {message.validation && !message.validation.isValid && (
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
            <div className="flex items-center space-x-2 text-amber-800 mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-wider">Validation Warning</span>
            </div>
            <ul className="list-disc list-inside text-xs text-amber-700 space-y-1">
              {message.validation.errors.map((err, i) => (
                <li key={i}>{err}</li>
              ))}
            </ul>
            <p className="mt-2 text-[10px] text-amber-600 italic">
              ※AIの生成内容に不備がある可能性があります。下書きとして利用し、必要に応じて修正してください。
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessageComponent;