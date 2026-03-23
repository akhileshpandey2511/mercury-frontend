import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export default function SettingsPanel({ isOpen, onClose }) {
  const { user, updateSettings } = useAuth();
  const { theme, setTheme } = useTheme();

  const [systemPrompt, setSystemPrompt] = useState(user?.settings?.systemPrompt || 'You are a helpful assistant.');
  const [temperature, setTemperature] = useState(user?.settings?.temperature || 0.75);
  const [maxTokens, setMaxTokens] = useState(user?.settings?.maxTokens || 8192);
  const [reasoningEffort, setReasoningEffort] = useState(user?.settings?.reasoningEffort || 'medium');
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings({ systemPrompt, temperature, maxTokens, reasoningEffort, theme });
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-chat-sidebar z-50 shadow-xl overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-chat-border">
          <h2 className="text-lg font-semibold text-white">Settings</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Theme */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Theme</label>
            <div className="flex gap-2">
              {['dark', 'light'].map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 py-2 rounded-lg text-sm capitalize transition-colors ${
                    theme === t
                      ? 'bg-white text-black'
                      : 'bg-chat-input text-gray-300 hover:bg-chat-hover'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* System Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">System Prompt</label>
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-chat-input border border-chat-border rounded-lg text-white text-sm focus:outline-none focus:border-gray-500 resize-none"
            />
          </div>

          {/* Reasoning Effort */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Reasoning Effort
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['instant', 'low', 'medium', 'high'].map((level) => (
                <button
                  key={level}
                  onClick={() => setReasoningEffort(level)}
                  className={`py-2 rounded-lg text-xs capitalize transition-colors ${
                    reasoningEffort === level
                      ? 'bg-white text-black'
                      : 'bg-chat-input text-gray-300 hover:bg-chat-hover'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Temperature: {temperature}
            </label>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={temperature}
              onChange={(e) => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Focused (0.5)</span>
              <span>Creative (1.0)</span>
            </div>
          </div>

          {/* Max Tokens */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Max Tokens: {maxTokens.toLocaleString()}
            </label>
            <input
              type="range"
              min="256"
              max="50000"
              step="256"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value))}
              className="w-full accent-white"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>256</span>
              <span>50,000</span>
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </>
  );
}
