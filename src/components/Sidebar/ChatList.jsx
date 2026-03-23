import ChatItem from './ChatItem';
import { groupChatsByDate } from '../../utils/formatters';

export default function ChatList({ chats, activeChatId, onSelect, onDelete, onRename }) {
  const grouped = groupChatsByDate(chats);
  const groups = Object.entries(grouped);

  if (chats.length === 0) {
    return (
      <div className="px-3 py-8 text-center text-gray-500 text-sm">
        No conversations yet. Start a new chat!
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-2 space-y-4">
      {groups.map(([label, groupChats]) => (
        <div key={label}>
          <h3 className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {label}
          </h3>
          <div className="space-y-0.5">
            {groupChats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isActive={chat._id === activeChatId}
                onSelect={onSelect}
                onDelete={onDelete}
                onRename={onRename}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
