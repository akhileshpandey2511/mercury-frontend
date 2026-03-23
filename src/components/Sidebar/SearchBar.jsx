import { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="px-2 mb-2">
      <input
        type="text"
        placeholder="Search chats..."
        value={query}
        onChange={handleChange}
        className="w-full px-3 py-2 bg-chat-input border border-chat-border rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
      />
    </div>
  );
}
