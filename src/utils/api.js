const API_URL = import.meta.env.VITE_API_URL || '/api';

function getHeaders() {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

// Auth
export async function register(name, email, password) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function getMe() {
  const res = await fetch(`${API_URL}/auth/me`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Not authenticated');
  return data;
}

export async function updateSettings(settings) {
  const res = await fetch(`${API_URL}/auth/settings`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(settings),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update settings');
  return data;
}

// Chats
export async function fetchChats() {
  const res = await fetch(`${API_URL}/chats`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch chats');
  return data;
}

export async function fetchChat(chatId) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, { headers: getHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch chat');
  return data;
}

export async function createChat(title) {
  const res = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create chat');
  return data;
}

export async function renameChat(chatId, title) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ title }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to rename chat');
  return data;
}

export async function deleteChat(chatId) {
  const res = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete chat');
  return data;
}

// Streaming completions
export function streamCompletion(chatId, content, options = {}) {
  const token = localStorage.getItem('token');
  const controller = new AbortController();

  const promise = fetch(`${API_URL}/chats/${chatId}/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content, ...options }),
    signal: controller.signal,
  });

  return { promise, controller };
}
