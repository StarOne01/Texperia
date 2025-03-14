'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  // Validate the hash parameter from URL when component mounts
  useEffect(() => {
    const checkSession = async () => {
      // When a user clicks the reset password link, Supabase Auth will handle
      // the initial token validation automatically
      const { data, error } = await supabase.auth.getSession();
      
      // If we don't have a valid session with a user,
      // the password reset link might be invalid or expired
      if (error || !data.session) {
        setError('Your password reset link appears to be invalid or has expired.');
      }
    };

    checkSession();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate passwords
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    
    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) throw error;
      
      setMessage('Your password has been updated successfully');
      toast.success('Password updated successfully!');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to update password');
      toast.error(error.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-purple-900">
      <Toaster
        position="top-right"
        toastOptions={{
          className: "backdrop-blur-md bg-blue-900/50 text-blue-200 border border-blue-500/30",
          duration: 3000,
          style: {
            background: "rgba(26, 32, 44, 0.8)",
            color: "#90cdf4",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(66, 153, 225, 0.3)",
          },
        }}
      />
      
      <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">
          Reset Your Password
        </h2>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded p-3 mb-4">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}
        
        {message && (
          <div className="bg-green-500/20 border border-green-500/50 rounded p-3 mb-4">
            <p className="text-green-300 text-sm">{message}</p>
            <p className="text-green-300 text-sm mt-2">Redirecting you to login...</p>
          </div>
        )}
        
        {!message && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-300 mb-1">
                New Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
                required
                minLength={6}
              />
              <p className="text-blue-400 text-xs mt-1">
                Must be at least 6 characters
              </p>
            </div>
            
            <div>
              <label className="block text-blue-300 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-2 text-white"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}