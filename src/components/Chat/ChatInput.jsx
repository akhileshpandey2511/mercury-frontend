import { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useStream } from '../../hooks/useStream';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const { activeChat, isStreaming, newChat } = useChat();
  const { sendMessage, stopStreaming } = useStream();

  // Focus textarea on mount and chat change
  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeChat]);

  const handleSubmit = async () => {
    const content = input.trim();
    if (!content || isStreaming) return;

    let chatId = activeChat?._id;

    // If no active chat, create one first
    if (!chatId) {
      const chat = await newChat();
      chatId = chat._id;
    }

    setInput('');
    await sendMessage(chatId, content);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="border-t border-chat-border bg-chat-bg px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="relative flex items-end bg-chat-input rounded-2xl border border-chat-border focus-within:border-gray-500 transition-colors">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message Mercury..."
            rows={1}
            className="flex-1 bg-transparent text-white text-[15px] px-4 py-3.5 resize-none focus:outline-none placeholder-gray-500 max-h-48 overflow-y-auto"
            disabled={isStreaming}
          />

          <div className="flex items-center pr-3 pb-3">
            {isStreaming ? (
              <button
                onClick={stopStreaming}
                className="p-1.5 bg-white rounded-full hover:bg-gray-200 transition-colors"
                title="Stop generating"
              >
                <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="6" width="12" height="12" rx="1" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!input.trim()}
                className={`p-1.5 rounded-full transition-colors ${
                  input.trim()
                    ? 'bg-white hover:bg-gray-200 text-black'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="text-xs text-gray-600 text-center mt-2">
          Mercury can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}
