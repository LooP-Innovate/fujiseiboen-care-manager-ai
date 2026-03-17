import React, { useState, useEffect, useRef } from 'react';
import { ChatSession } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onRenameSession: (id: string, newTitle: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sessions, activeSessionId, onNewChat, onSelectSession, onDeleteSession, onRenameSession }) => {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null);

  useEffect(() => {
    if (editingSessionId && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingSessionId]);

  const handleStartEditing = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditingTitle(session.title);
  };

  const handleCancelEditing = () => {
    setEditingSessionId(null);
    setEditingTitle('');
  };

  const handleSaveTitle = () => {
    if (editingSessionId && editingTitle.trim()) {
      onRenameSession(editingSessionId, editingTitle);
    }
    handleCancelEditing();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      handleCancelEditing();
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, session: ChatSession) => {
    e.stopPropagation();
    setSessionToDelete(session);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (sessionToDelete) {
      onDeleteSession(sessionToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSessionToDelete(null);
  };


  return (
    <>
      <aside className="w-64 bg-slate-800 text-white flex flex-col">
        <div className="p-4 border-b border-slate-700">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors text-sm font-semibold"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span>新しいチャット</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto">
          <ul className="p-2 space-y-1">
            {sessions.map((session) => (
              <li key={session.id} className="relative group">
                {editingSessionId === session.id ? (
                  <input
                    ref={inputRef}
                    type="text"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onBlur={handleSaveTitle}
                    onKeyDown={handleKeyDown}
                    className="w-full px-3 py-2 text-sm bg-slate-700 border border-slate-500 rounded-md outline-none text-white"
                  />
                ) : (
                  <>
                    <button
                      onClick={() => onSelectSession(session.id)}
                      className={`w-full text-left pr-16 px-3 py-2 text-sm rounded-md truncate transition-colors ${
                        session.id === activeSessionId ? 'bg-slate-900 font-semibold' : 'hover:bg-slate-700'
                      }`}
                      title={session.title}
                    >
                      {session.title}
                    </button>
                    <div className="absolute inset-y-0 right-0 items-center pr-2 hidden group-hover:flex">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEditing(session);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                        title="名称変更"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, session)}
                        className="p-1 text-slate-400 hover:text-white"
                        title="削除"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09.92-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="チャットの削除"
        message={
          sessionToDelete ? (
            <p>
              「<span className="font-semibold">{sessionToDelete.title}</span>」を削除してもよろしいですか？<br/>
              この操作は元に戻せません。
            </p>
          ) : null
        }
      />
    </>
  );
};

export default Sidebar;