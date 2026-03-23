import { useChat } from '../../context/ChatContext';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatWindow() {
  const { activeChat, messages } = useChat();
  const hasMessages = messages.length > 0;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {hasMessages ? (
        <MessageList />
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">Mercury Chat</h1>
            <p className="text-gray-500 max-w-md">
              Powered by Inception Labs Mercury-2 model. Ask me anything!
            </p>

            {/* Suggested prompts */}
            <div className="grid grid-cols-2 gap-3 mt-8 max-w-lg mx-auto">
              {[
                'Explain quantum computing',
                'Write a Python script',
                'Help me debug my code',
                'Summarize a complex topic',
              ].map((prompt) => (
                <button
                  key={prompt}
                  className="px-4 py-3 text-sm text-left text-gray-300 bg-chat-input border border-chat-border rounded-xl hover:bg-chat-hover transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <ChatInput />
    </div>
  );
}
