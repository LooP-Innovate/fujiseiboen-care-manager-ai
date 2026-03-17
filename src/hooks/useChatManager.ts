import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChatMessage, ChatSession, TaskType } from '../types';
import { prompts } from '../prompts';
import { readFileAsText } from '../utils/fileReader';

const commandList = Object.keys(prompts) as TaskType[];

export const useChatManager = () => {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Load state from localStorage on initial mount
    useEffect(() => {
        try {
            const storedSessions = localStorage.getItem('chatSessions');
            const loadedSessions: ChatSession[] = storedSessions ? JSON.parse(storedSessions) : [];

            if (Array.isArray(loadedSessions) && loadedSessions.length > 0) {
                setSessions(loadedSessions);

                const storedActiveId = localStorage.getItem('activeSessionId');
                const parsedActiveId = storedActiveId ? JSON.parse(storedActiveId) : null;
                
                if (parsedActiveId && loadedSessions.some(s => s.id === parsedActiveId)) {
                    setActiveSessionId(parsedActiveId);
                } else {
                    setActiveSessionId(loadedSessions[0].id);
                }
            } else if (sessions.length === 0) {
                // If there's nothing in storage and nothing in state, ensure activeId is null.
                setActiveSessionId(null);
            }
        } catch (error) {
            console.error("Failed to load sessions from localStorage:", error);
            localStorage.removeItem('chatSessions');
            localStorage.removeItem('activeSessionId');
        } finally {
            setIsInitialized(true);
        }
    }, []);

    // Save state to localStorage whenever it changes
    useEffect(() => {
        if (!isInitialized) return;

        if (sessions.length > 0) {
            localStorage.setItem('chatSessions', JSON.stringify(sessions));
        } else {
            localStorage.removeItem('chatSessions');
        }

        if (activeSessionId) {
            localStorage.setItem('activeSessionId', JSON.stringify(activeSessionId));
        } else {
            localStorage.removeItem('activeSessionId');
        }
    }, [sessions, activeSessionId, isInitialized]);
    

    const activeSession = useMemo(() => {
        return sessions.find(s => s.id === activeSessionId) || null;
    }, [sessions, activeSessionId]);

    const handleNewChat = useCallback(() => {
        const newSession: ChatSession = {
            id: `session-${Date.now()}`,
            title: '新規チャット',
            messages: [
                {
                    id: 'initial',
                    sender: 'ai',
                    content: 'こんにちは！私は「藤聖母園 介護支援専門員向けAIアシスタント」です。藤聖母園のケアマネジャーさんをサポートします。どのようなご用件でしょうか？',
                },
            ],
            task: undefined,
            aiModelId: 'gemini-2.5-flash-lite',
        };
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);
        setIsLoading(false); // Reset loading on new chat
    }, []);

    const updateSessionState = useCallback((sessionId: string, updates: Partial<ChatSession>) => {
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === sessionId
                    ? { ...session, ...updates }
                    : session
            )
        );
    }, []);

    const setAiModelId = useCallback((sessionId: string, modelId: string) => {
        updateSessionState(sessionId, { aiModelId: modelId });
    }, [updateSessionState]);

    const handleFileSelect = useCallback((file: File) => {
        setSelectedFile(file);
    }, []);

    const handleFileRemove = useCallback(() => {
        setSelectedFile(null);
    }, []);

    const handleSendMessage = useCallback(async (text: string) => {
        if ((!text.trim() && !selectedFile) || !activeSessionId) return;
        
        const currentSession = sessions.find(s => s.id === activeSessionId);
        if (!currentSession) return;

        setIsLoading(true);

        let userMessageContent = text;
        let fileContent: string | undefined = undefined;

        if (selectedFile) {
            try {
                fileContent = await readFileAsText(selectedFile);
                userMessageContent = text 
                    ? `${text}\n\n(ファイル: ${selectedFile.name} の内容を考慮)` 
                    : `ファイル: ${selectedFile.name} の内容を分析してください。`;
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'ファイルの読み込みに失敗しました。';
                const errorObject: ChatMessage = { id: `error-${Date.now()}`, sender: 'ai', content: errorMessage, isError: true };
                updateSessionState(activeSessionId, { messages: [...currentSession.messages, errorObject]});
                setSelectedFile(null);
                setIsLoading(false);
                return;
            }
        }
        
        const userMessage: ChatMessage = { id: `user-${Date.now()}`, sender: 'user', content: userMessageContent };
        const isFirstUserMessage = currentSession.messages.filter(m => m.sender === 'user').length === 0;
        const newTitle = isFirstUserMessage ? text.substring(0, 30) + (text.length > 30 ? '…' : '') : undefined;
        let task = currentSession.task;
        if (!task) {
            const isCommand = (command: string): command is TaskType => commandList.includes(command.trim() as TaskType);
            task = isCommand(text) ? text.trim() as TaskType : 'default';
        }

        const updatedMessages = [...currentSession.messages, userMessage];
        const aiMessageId = `ai-${Date.now()}`;
        const initialAiMessage: ChatMessage = { id: aiMessageId, sender: 'ai', content: '' };
        
        // Initial UI update: Add user message and empty AI placeholder
        setSessions(prev => prev.map(s => {
            if (s.id === activeSessionId) {
                return {
                    ...s,
                    title: newTitle || s.title,
                    task: task,
                    messages: [...s.messages, userMessage, initialAiMessage]
                };
            }
            return s;
        }));

        setSelectedFile(null);

        try {
            const { AIService } = await import('../services/aiService');

            const onChunk = (chunk: string) => {
                setSessions(prev => prev.map(s => {
                    if (s.id === activeSessionId) {
                        const messages = [...s.messages];
                        const lastMsg = messages[messages.length - 1];
                        if (lastMsg && lastMsg.id === aiMessageId) {
                            messages[messages.length - 1] = { ...lastMsg, content: lastMsg.content + chunk };
                            return { ...s, messages };
                        }
                    }
                    return s;
                }));
            };
            
            // Map UI messages to AI DTO roles
            // We use currentSession.messages because updatedMessages might not be in state yet
            const historyDto = [...currentSession.messages, userMessage].map(m => ({
                role: m.sender === 'user' ? 'user' : 'assistant' as any,
                content: m.content
            }));

            const response = task === 'ケアプラン案' 
                ? await AIService.runMultiStepChat(
                    activeSessionId, 
                    text || fileContent || '', 
                    onChunk,
                    currentSession.aiModelId
                  )
                : await AIService.runChat(
                    activeSessionId, 
                    task, 
                    text, 
                    historyDto, 
                    onChunk,
                    currentSession.aiModelId
                );

            // Final UI update: Add metadata
            setSessions(prev => prev.map(s => {
                if (s.id === activeSessionId) {
                    const messages = [...s.messages];
                    const lastIdx = messages.length - 1;
                    if (messages[lastIdx] && messages[lastIdx].id === aiMessageId) {
                        messages[lastIdx] = { 
                            ...messages[lastIdx], 
                            validation: response.metadata.validation,
                            metadata: {
                                provider: response.metadata.provider,
                                model: response.metadata.model
                            }
                        };
                        return { ...s, messages };
                    }
                }
                return s;
            }));

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '不明なエラーが発生しました。';
            const errorContent = `申し訳ありませんが、エラーが発生しました。後でもう一度お試しください。(エラー: ${errorMessage})`;
            
            setSessions(prev => prev.map(s => {
                 if (s.id === activeSessionId) {
                    const lastMsg = s.messages[s.messages.length - 1];
                    if (lastMsg && lastMsg.id === aiMessageId) {
                        return {
                            ...s,
                            messages: [
                                ...s.messages.slice(0, -1),
                                { ...lastMsg, content: errorContent, isError: true }
                            ]
                        };
                    }
                }
                return s;
            }));
        } finally {
            setIsLoading(false);
        }
    }, [activeSessionId, sessions, updateSessionState, selectedFile]);

    const handleDeleteSession = useCallback((sessionId: string) => {
        const newSessions = sessions.filter(s => s.id !== sessionId);

        // If the active session was the one that was deleted, we must select a new one.
        if (activeSessionId === sessionId) {
            if (newSessions.length > 0) {
                // Default to selecting the first available session.
                setActiveSessionId(newSessions[0].id);
            } else {
                // If no sessions are left, clear the active session.
                setActiveSessionId(null);
            }
        }
        // If a non-active session was deleted, the activeSessionId is still valid and no change is needed.
        
        // Update the state with the new list of sessions.
        setSessions(newSessions);
    }, [sessions, activeSessionId]);

    const handleRenameSession = useCallback((sessionId: string, newTitle: string) => {
        if (!newTitle.trim()) return;
        setSessions(prevSessions =>
            prevSessions.map(session =>
                session.id === sessionId ? { ...session, title: newTitle.trim() } : session
            )
        );
    }, []);
    
    return {
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
    };
};