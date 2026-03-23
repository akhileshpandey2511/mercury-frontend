export function formatDate(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return 'Previous 7 Days';
  if (diffDays <= 30) return 'Previous 30 Days';
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function groupChatsByDate(chats) {
  const groups = {};
  for (const chat of chats) {
    const label = formatDate(chat.updatedAt || chat.createdAt);
    if (!groups[label]) groups[label] = [];
    groups[label].push(chat);
  }
  return groups;
}

export function truncate(str, maxLen = 30) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}
