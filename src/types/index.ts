import { ReactNode } from 'react';

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    content: string;
    isError?: boolean;
    validation?: {
        isValid: boolean;
        errors: string[];
    };
    metadata?: {
        provider: string;
        model: string;
    };
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    task?: TaskType;
    aiModelId?: string; // e.g. 'gemini-2.5-flash-lite' or 'gpt-4o-mini'
}

export interface Suggestion {
    title: string;
    command: string;
    description: string;
    icon: ReactNode;
}

export interface SuggestionCategory {
    name: string;
    suggestions: Suggestion[];
}

import { TaskType as AI_TaskType } from '../prompts';
export type TaskType = AI_TaskType;
