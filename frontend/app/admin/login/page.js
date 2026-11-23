'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, AlertCircle, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('admin_token');
    if (token) {
      verifyToken(token);
    } else {
      setCheckingAuth(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        router.replace('/admin');
      } else {
        localStorage.removeItem('admin_token');
        setCheckingAuth(false);
      }
    } catch (error) {
      localStorage.removeItem('admin_token');
      setCheckingAuth(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('admin_token', data.access_token);
        router.replace('/admin');
      } else {
        setError(data.detail || 'Invalid credentials');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-pulse text-white">Checking authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e88e5] rounded-2xl mb-4">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Jaipur Elite Homes</h1>
          <p className="text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/10">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white">Welcome Back</h2>
            <p className="text-slate-400 text-sm mt-1">Sign in to access the admin panel</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-slate-300">Username</Label>
              <div className="relative">
                <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="username"
                  data-testid="admin-login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#1e88e5] focus:ring-[#1e88e5]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-slate-300">Password</Label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  data-testid="admin-login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-slate-500 focus:border-[#1e88e5] focus:ring-[#1e88e5]"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              data-testid="admin-login-submit"
              disabled={loading}
              className="w-full bg-[#1e88e5] hover:bg-[#1565c0] text-white h-11 font-medium"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign In
                  <ArrowRight size={18} />
                </span>
              )}
            </Button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-sm mt-6">
          Protected area. Authorized access only.
        </p>
      </div>
    </div>
  );
}
