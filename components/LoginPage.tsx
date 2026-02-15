'use client';

import { useState } from 'react';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('mesi_auth_token', data.token);
        onLogin();
      } else {
        setError('Wrong password. Try again.');
      }
    } catch {
      setError('Something broke. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(59,130,246,0.10),transparent_55%),radial-gradient(900px_circle_at_80%_20%,rgba(16,185,129,0.08),transparent_55%),linear-gradient(to_bottom_right,#050608,#070A0F,#050608)] text-white p-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-zinc-100 mb-2">Mesi Command</h1>
          <p className="text-sm text-zinc-400">Dashboard access</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-zinc-950/40 backdrop-blur-sm p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-white/10 text-zinc-100 text-sm focus:outline-none focus:border-white/30 placeholder-zinc-600"
                placeholder="Enter password..."
                autoFocus
              />
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-sm font-medium text-zinc-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Checking...' : 'Enter'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-500 mt-6">
          Private dashboard. Ask Mesi for access.
        </p>
      </div>
    </div>
  );
}
