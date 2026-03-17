import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  onFileSelect: (file: File) => void;
  onFileRemove: () => void;
  selectedFile: File | null;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSendMessage(text);
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex p-4 border-t">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 border p-2 rounded"
        placeholder="Type a message..."
        disabled={isLoading}
      />
      <button type="submit" disabled={isLoading} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded">
        Send
      </button>
    </form>
  );
};

export default ChatInput;
