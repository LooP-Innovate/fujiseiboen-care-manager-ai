
import React, { useRef, useEffect, useState } from 'react';
import { ChatSession } from '../types';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import Spinner from './Spinner';
import ModelSelector from './ModelSelector';

interface ChatViewProps {
  session: ChatSession;
  onSendMessage: (text: string) => void;
  onModelSelect: (modelId: string) => void;
  isLoading: boolean;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const ChatView: React.FC<ChatViewProps> = ({ session, onSendMessage, onModelSelect, isLoading, selectedFile, onFileSelect, onFileRemove }) => {
  const { messages, title } = session;
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const exportMenuRef = useRef<HTMLDivElement>(null);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleExport = async (format: 'csv' | 'word' | 'pdf', type: 'history' | 'artifact') => {
    if (!session || isExporting) return;
    
    setIsExporting(true);
    setIsExportMenuOpen(false); // Close menu
    
    await new Promise(resolve => setTimeout(resolve, 100));

    try {
      if (type === 'history') {
        switch (format) {
            case 'csv': {
                const { exportToCSV } = await import('../utils/csvExporter');
                exportToCSV(session);
                break;
            }
            case 'word': {
                const { exportHistoryToWord } = await import('../utils/wordExporter');
                await exportHistoryToWord(session);
                break;
            }
            case 'pdf': {
                const { exportHistoryToPDF } = await import('../utils/pdfExporter');
                await exportHistoryToPDF(session, `chat-container-${session.id}`);
                break;
            }
        }
      } else { // type === 'artifact'
          if (format === 'word') {
              const { exportArtifactToWord } = await import('../utils/wordExporter');
              await exportArtifactToWord(session);
          } else if (format === 'pdf') {
              const { exportArtifactToPDF } = await import('../utils/pdfExporter');
              await exportArtifactToPDF(session);
          }
      }
    } catch (error) {
        console.error(`Failed to export as ${format} (${type}):`, error);
        alert(`エクスポートに失敗しました: ${(error as Error).message}`);
    } finally {
        setIsExporting(false);
    }
  };


  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="flex flex-col min-w-0 mr-4">
          <h2 className="text-lg font-semibold text-slate-800 truncate" title={title}>
            {title}
          </h2>
          <div className="mt-1">
            <ModelSelector 
              selectedModelId={session.aiModelId} 
              onModelSelect={onModelSelect}
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onSendMessage('これまでの文脈をリセットして、最初からやり直してください。')}
            disabled={isLoading}
            className="p-2 text-slate-400 hover:text-red-500 transition-colors"
            title="チャットをリセット"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          </button>
          <div className="relative" ref={exportMenuRef}>
          <button
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            disabled={isExporting}
            className="flex items-center space-x-2 px-3 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50 disabled:cursor-wait"
          >
            {isExporting ? (
              <>
                <Spinner className="h-4 w-4 text-slate-600" />
                <span>エクスポート中...</span>
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                <span>エクスポート</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-slate-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </>
            )}
          </button>
          
          {isExportMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
              <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">チャット履歴全体</div>
                <button onClick={() => handleExport('csv', 'history')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                  CSV形式
                </button>
                <button onClick={() => handleExport('word', 'history')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                  Word形式 (.docx)
                </button>
                <button onClick={() => handleExport('pdf', 'history')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                  PDF形式 (表示のまま)
                </button>
                <div className="border-t border-slate-200 my-1"></div>
                <div className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">最新のAI応答を文書化</div>
                 <button onClick={() => handleExport('word', 'artifact')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                  Word形式 (.docx)
                </button>
                <button onClick={() => handleExport('pdf', 'artifact')} className="w-full text-left flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-100" role="menuitem">
                  PDF形式
                </button>
              </div>
            </div>
          )}
          </div>
        </div>
      </header>
      <main id={`chat-container-${session.id}`} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={chatEndRef} />
      </main>
      <footer className="p-4 bg-white border-t border-slate-200">
        <ChatInput
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          selectedFile={selectedFile}
          onFileSelect={onFileSelect}
          onFileRemove={onFileRemove}
        />
      </footer>
    </div>
  );
};

export default ChatView;
