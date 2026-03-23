import { createContext, useContext, useState, useCallback } from 'react';
import {
  fetchChats as apiFetchChats,
  fetchChat as apiFetchChat,
  createChat as apiCreateChat,
  renameChat as apiRenameChat,
  deleteChat as apiDeleteChat,
} from '../utils/api';

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');

  const loadChats = useCallback(async () => {
    const data = await apiFetchChats();
    setChats(data);
    return data;
  }, []);

  const loadChat = useCallback(async (chatId) => {
    const data = await apiFetchChat(chatId);
    setActiveChat(data);
    setMessages(data.messages || []);
    return data;
  }, []);

  const newChat = useCallback(async () => {
    const chat = await apiCreateChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChat(chat);
    setMessages([]);
    return chat;
  }, []);

  const removeChat = useCallback(
    async (chatId) => {
      await apiDeleteChat(chatId);
      setChats((prev) => prev.filter((c) => c._id !== chatId));
      if (activeChat?._id === chatId) {
        setActiveChat(null);
        setMessages([]);
      }
    },
    [activeChat]
  );

  const editChatTitle = useCallback(async (chatId, title) => {
    const updated = await apiRenameChat(chatId, title);
    setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, title } : c)));
    if (activeChat?._id === chatId) {
      setActiveChat((prev) => ({ ...prev, title }));
    }
    return updated;
  }, [activeChat]);

  const addMessage = useCallback((message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateChatTitle = useCallback((chatId, title) => {
    setChats((prev) => prev.map((c) => (c._id === chatId ? { ...c, title } : c)));
    if (activeChat?._id === chatId) {
      setActiveChat((prev) => (prev ? { ...prev, title } : prev));
    }
  }, [activeChat]);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChat,
        messages,
        isStreaming,
        streamingContent,
        setIsStreaming,
        setStreamingContent,
        loadChats,
        loadChat,
        newChat,
        removeChat,
        editChatTitle,
        addMessage,
        setMessages,
        setActiveChat,
        updateChatTitle,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
}
