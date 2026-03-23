import { useEffect, useRef } from 'react';
import { useChat } from '../../context/ChatContext';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

export default function MessageList() {
  const { messages, isStreaming, streamingContent } = useChat();
  const bottomRef = useRef(null);

  // Auto-scroll to bottom on new messages or streaming
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((msg) => (
        <Message key={msg._id} message={msg} />
      ))}

      {/* Streaming message */}
      {isStreaming && streamingContent && (
        <Message
          message={{
            _id: 'streaming',
            role: 'assistant',
            content: streamingContent,
          }}
          isStreaming={true}
        />
      )}

      {/* Typing indicator when streaming starts but no content yet */}
      {isStreaming && !streamingContent && <TypingIndicator />}

      <div ref={bottomRef} />
    </div>
  );
}
