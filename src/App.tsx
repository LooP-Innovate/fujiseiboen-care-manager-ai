import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import AuthScreen from './components/AuthScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { useChatManager } from './hooks/useChatManager';

/**
 * This component encapsulates the main application logic and is only rendered when authenticated.
 * This ensures that `useChatManager` and its deep dependencies (like the GenAI SDK)
 * are only initialized when necessary, preventing potential load-time errors.
 */
const AuthenticatedApp: React.FC = () => {
  const {
    sessions,
    activeSession,
    activeSessionId,
    isInitialized,
    isLoading,
    setActiveSessionId,
    handleNewChat,
    handleSendMessage,
    setAiModelId,
    handleDeleteSession,
    handleRenameSession,
    selectedFile,
    handleFileSelect,
    handleFileRemove,
  } = useChatManager();

  // Prevents flicker or rendering with incomplete state while localStorage is being read.
  if (!isInitialized) {
    return null;
  }

  return (
    <div className="flex h-full">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewChat={handleNewChat}
        onSelectSession={setActiveSessionId}
        onDeleteSession={handleDeleteSession}
        onRenameSession={handleRenameSession}
      />
      <MainContent
        activeSession={activeSession}
        isLoading={isLoading}
        handleNewChat={handleNewChat}
        handleSendMessage={handleSendMessage}
        onModelSelect={setAiModelId}
        selectedFile={selectedFile}
        onFileSelect={handleFileSelect}
        onFileRemove={handleFileRemove}
      />
    </div>
  );
};


const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Render the AuthScreen if the user is not authenticated.
  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={setIsAuthenticated} />;
  }

  // Once authenticated, render the main application.
  return <AuthenticatedApp />;
};

export default App;
