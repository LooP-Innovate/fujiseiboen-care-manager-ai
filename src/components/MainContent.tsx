import React from 'react';
import WelcomeScreen from './WelcomeScreen';
import ChatView from './ChatView';
import { ChatSession } from '../types';

interface MainContentProps {
  activeSession: ChatSession | null;
  isLoading: boolean;
  handleNewChat: () => void;
  handleSendMessage: (text: string) => void;
  onModelSelect: (sessionId: string, modelId: string) => void;
  selectedFile: File | null;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
}

const MainContent: React.FC<MainContentProps> = ({ activeSession, isLoading, handleNewChat, handleSendMessage, onModelSelect, selectedFile, onFileSelect, onFileRemove }) => {
  return (
    <div className="flex flex-col flex-1 bg-white overflow-hidden">
      {activeSession ? (
        // Render WelcomeScreen for new chats until the first user message is sent.
        activeSession.messages.filter(m => m.sender === 'user').length > 0 ? (
          <ChatView
            session={activeSession}
            onSendMessage={handleSendMessage}
            onModelSelect={(modelId) => onModelSelect(activeSession.id, modelId)}
            isLoading={isLoading}
            selectedFile={selectedFile}
            onFileSelect={onFileSelect}
            onFileRemove={onFileRemove}
          />
        ) : (
          <WelcomeScreen onSelectSuggestion={handleSendMessage} />
        )
      ) : (
        // If there's no active session, show a welcome message prompting to start a new chat.
        <div className="flex-1 flex items-center justify-center bg-slate-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">ようこそ</h2>
            <p className="text-slate-800 mb-6">左のパネルから新しいチャットを開始してください。</p>
            <button onClick={handleNewChat} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg">
              新しいチャットを開始
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainContent;