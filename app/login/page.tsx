"use client";
import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handlePinLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const cleanUsername = username.trim().toLowerCase();
    const cleanPin = pin.trim();

    // Instant hardcoded bypass for testing admin access
    if (cleanUsername === 'admin1' && cleanPin === '0000') {
      const adminProfile = {
        id: 'admin-1',
        name: 'Admin One',
        email: 'admin1@plus.org',
        username: 'admin1',
        designation: 'System Administrator',
        role: 'EXECUTIVE',
        posting: 'Karachi HQ',
        reports_to: 'None'
      };
      localStorage.setItem('plus_user', JSON.stringify(adminProfile));
      window.location.href = '/';
      return;
    }

    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', cleanUsername);

      console.log("Profile query result:", { profiles, error });

      if (error || !profiles || profiles.length === 0) {
        setErrorMsg('Invalid username or 4-digit PIN code.');
        setLoading(false);
        return;
      }

      const profile = profiles[0];

      if (profile.access_pin && profile.access_pin !== cleanPin) {
        setErrorMsg('Invalid username or 4-digit PIN code.');
        setLoading(false);
        return;
      }

      localStorage.setItem('plus_user', JSON.stringify(profile));
      window.location.href = '/';
    } catch (err) {
      console.error("Login exception:", err);
      setErrorMsg('Database connection error during login.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl mx-auto flex items-center justify-center shadow-md border border-blue-100 overflow-hidden p-1.5">
            <img 
              src="https://grassrootsjusticenetwork.org/wp-content/uploads/2023/12/PLUS-logo-1.png" 
              alt="PLUS Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">PLUS OPS Portal</h1>
            <p className="text-xs text-slate-500 mt-0.5">Pakistan Legal United Society • Secure Login</p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePinLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Username</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                placeholder="e.g. admin1"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-xs focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">Security PIN (4 digits)</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="password"
                maxLength={4}
                required
                placeholder="0000"
                value={pin}
                onChange={e => setPin(e.target.value)}
                className="w-full rounded-xl border bg-slate-50 py-2.5 pl-10 pr-4 text-xs font-mono tracking-widest focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#0052CC] text-white text-xs font-bold shadow-md hover:bg-[#003d99] transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Verifying PIN...' : 'Access Portal'}
          </button>
        </form>

        <div className="bg-slate-50 p-3 rounded-2xl border text-center">
          <p className="text-[11px] text-slate-500 font-medium">Test Credentials:</p>
          <p className="text-[10px] text-slate-400 font-mono mt-0.5">Username: <strong className="text-slate-700">admin1</strong> | PIN: <strong className="text-slate-700">0000</strong></p>
        </div>
      </div>
    </div>
  );
}
