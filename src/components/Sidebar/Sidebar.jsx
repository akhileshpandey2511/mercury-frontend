import { useState, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import SearchBar from './SearchBar';
import ChatList from './ChatList';

export default function Sidebar({ isOpen, onToggle }) {
  const { chats, activeChat, loadChats, loadChat, newChat, removeChat, editChatTitle } = useChat();
  const { user, logout } = useAuth();
  const [filteredChats, setFilteredChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredChats(
        chats.filter((c) => c.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    } else {
      setFilteredChats(chats);
    }
  }, [chats, searchQuery]);

  const handleNewChat = async () => {
    await newChat();
  };

  const handleSelectChat = async (chatId) => {
    await loadChat(chatId);
  };

  const handleDeleteChat = async (chatId) => {
    if (window.confirm('Delete this conversation?')) {
      await removeChat(chatId);
    }
  };

  const handleRenameChat = async (chatId, title) => {
    await editChatTitle(chatId, title);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onToggle} />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-chat-sidebar flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* New Chat button */}
        <div className="p-2">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-3 rounded-lg border border-chat-border hover:bg-chat-hover text-sm text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </button>
        </div>

        {/* Search */}
        <SearchBar onSearch={setSearchQuery} />

        {/* Chat list */}
        <ChatList
          chats={filteredChats}
          activeChatId={activeChat?._id}
          onSelect={handleSelectChat}
          onDelete={handleDeleteChat}
          onRename={handleRenameChat}
        />

        {/* User info & logout */}
        <div className="p-3 border-t border-chat-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            <button
              onClick={logout}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
