import React, { useState } from 'react';
import { Lock, User, KeyRound, X, LogIn, AlertCircle, ShieldCheck } from 'lucide-react';

interface AdminLoginModalProps {
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal. Periksa username & password.');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-emerald-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-emerald-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-emerald-900/80 text-emerald-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/30 text-amber-300 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6" />
          </div>

          <h3 className="text-xl font-extrabold text-white tracking-tight">
            Login System Admin
          </h3>
          <p className="text-xs text-emerald-200 mt-1">
            Masuk untuk mengelola data peserta & mengedit konten landing page.
          </p>
        </div>

        {/* Security Notice */}
        <div className="bg-emerald-50/70 px-6 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-900 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Area Terproteksi Administrator. Silakan masukkan kredensial Anda.</span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Username Admin
            </label>
            <div className="relative">
              <User className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
              Password Admin
            </label>
            <div className="relative">
              <KeyRound className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Memverifikasi Akses...</span>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                Masuk ke Admin Dashboard
              </>
            )}
          </button>

        </form>

        <div className="bg-slate-100 px-6 py-3 text-center text-[11px] text-slate-500 border-t border-slate-200 flex items-center justify-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Sistem Autentikasi Terproteksi Pegadaian
        </div>

      </div>
    </div>
  );
};
