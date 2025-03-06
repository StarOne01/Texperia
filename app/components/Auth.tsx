'use client';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';

interface AuthProps {
  initialMode?: 'login' | 'register';
}

export default function Auth({ initialMode = 'login' }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        setMessage('Login successful!');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
              college,
            },
          },
        });
        
        if (error) throw error;
        
        if (data.user) {
          setMessage('Registration successful! Check your email for confirmation.');
        }
      }
    } catch (error: any) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">
        {isLogin ? 'Login' : 'Register'} for Texperia
      </h2>
      
      {error && <div className="bg-red-500/20 border border-red-500 text-red-200 p-3 rounded mb-4">{error}</div>}
      {message && <div className="bg-green-500/20 border border-green-500 text-green-200 p-3 rounded mb-4">{message}</div>}
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-blue-300 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
            required
          />
        </div>
        
        <div>
          <label className="block text-blue-300 mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
            required
          />
        </div>
        
        {!isLogin && (
          <>
            <div>
              <label className="block text-blue-300 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-blue-300 mb-1">College</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
                required
              />
            </div>
          </>
        )}
        
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-300 hover:underline"
        >
          {isLogin ? 'Need to register?' : 'Already have an account?'}
        </button>
      </div>
    </div>
  );
}
