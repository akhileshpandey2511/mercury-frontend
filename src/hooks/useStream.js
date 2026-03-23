import { useRef, useCallback } from 'react';
import { streamCompletion } from '../utils/api';
import { useChat } from '../context/ChatContext';

export function useStream() {
  const controllerRef = useRef(null);
  const { addMessage, setIsStreaming, setStreamingContent, updateChatTitle, activeChat } = useChat();

  const sendMessage = useCallback(
    async (chatId, content, options = {}) => {
      setIsStreaming(true);
      setStreamingContent('');

      // Add user message optimistically
      addMessage({
        _id: Date.now().toString(),
        chatId,
        role: 'user',
        content,
        createdAt: new Date().toISOString(),
      });

      try {
        const { promise, controller } = streamCompletion(chatId, content, options);
        controllerRef.current = controller;

        const response = await promise;

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Request failed');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || !trimmed.startsWith('data: ')) continue;

            const data = trimmed.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);

              // Title update from server
              if (parsed.type === 'title_update') {
                updateChatTitle(chatId, parsed.title);
                continue;
              }

              const delta = parsed.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                setStreamingContent(fullContent);
              }
            } catch {
              // skip malformed chunks
            }
          }
        }

        // Add complete assistant message
        if (fullContent) {
          addMessage({
            _id: Date.now().toString() + '-assistant',
            chatId,
            role: 'assistant',
            content: fullContent,
            createdAt: new Date().toISOString(),
          });
        }

        setStreamingContent('');
      } catch (err) {
        if (err.name !== 'AbortError') {
          addMessage({
            _id: Date.now().toString() + '-error',
            chatId,
            role: 'assistant',
            content: `⚠️ Error: ${err.message}`,
            createdAt: new Date().toISOString(),
          });
        }
      } finally {
        setIsStreaming(false);
        setStreamingContent('');
        controllerRef.current = null;
      }
    },
    [addMessage, setIsStreaming, setStreamingContent, updateChatTitle]
  );

  const stopStreaming = useCallback(() => {
    if (controllerRef.current) {
      controllerRef.current.abort();
      controllerRef.current = null;
    }
  }, []);

  return { sendMessage, stopStreaming };
}
