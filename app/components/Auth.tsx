'use client';
import { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';

interface AuthProps {
  initialMode?: 'login' | 'register';
}

export default function Auth({ initialMode = 'login' }: AuthProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [phone, setPhone] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('');
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();

  // Validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Common validation for both login and register
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Please enter a valid email";
    
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";
    
    // Registration-specific validation
    if (!isLogin) {
      if (!name.trim()) newErrors.name = "Full name is required";
      if (!college.trim()) newErrors.college = "College name is required";
      
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[0-9]{10}$/.test(phone)) newErrors.phone = "Please enter a valid 10-digit number";
      
      if (!yearOfStudy) newErrors.yearOfStudy = "Please select your year of study";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before proceeding
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        // Sign up the user
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              college: college,
              phone: phone,
              year_of_study: yearOfStudy
            },
            emailRedirectTo: `${window.location.origin}/dashboard`,
          }
        });
        
        if (error) throw error;
        
        // Also create a profile entry in the profiles table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: email,
                full_name: name,
                college: college,
                phone: phone,
                year_of_study: yearOfStudy,
                created_at: new Date().toISOString()
              },
            ]);
            
          if (profileError) {
            console.error('Error creating profile:', profileError);
            toast.error('Registration completed, but profile setup failed. Please contact support.');
          }
        }
        
        toast.success('Check your email for the confirmation link');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to display field error
  const fieldError = (field: string) => {
    return errors[field] ? (
      <p className="text-red-400 text-xs mt-1">{errors[field]}</p>
    ) : null;
  };

  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm max-w-md mx-auto">
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
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-300">
        {isLogin ? 'Login' : 'Register'} for Texperia
      </h2>
      
      <form onSubmit={handleAuth} className="space-y-4">
        <div>
          <label className="block text-blue-300 mb-1">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) {
                const newErrors = {...errors};
                delete newErrors.email;
                setErrors(newErrors);
              }
            }}
            className={`w-full bg-blue-900/30 border ${
              errors.email ? 'border-red-400' : 'border-blue-500/30'
            } rounded p-2 text-white`}
            required
          />
          {fieldError('email')}
        </div>
        
        <div>
          <label className="block text-blue-300 mb-1">
            Password <span className="text-red-400">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) {
                const newErrors = {...errors};
                delete newErrors.password;
                setErrors(newErrors);
              }
            }}
            className={`w-full bg-blue-900/30 border ${
              errors.password ? 'border-red-400' : 'border-blue-500/30'
            } rounded p-2 text-white`}
            required
          />
          {fieldError('password')}
        </div>
        
        {!isLogin && (
          <>
            <div>
              
              <label className="block text-blue-300 mb-1">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) {
                    const newErrors = {...errors};
                    delete newErrors.name;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full bg-blue-900/30 border ${
                  errors.name ? 'border-red-400' : 'border-blue-500/30'
                } rounded p-2 text-white`}
                required
              />
              {fieldError('name')}
            </div>
            
            <div>
              <label className="block text-blue-300 mb-1">
                College <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={college}
                onChange={(e) => {
                  setCollege(e.target.value);
                  if (errors.college) {
                    const newErrors = {...errors};
                    delete newErrors.college;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full bg-blue-900/30 border ${
                  errors.college ? 'border-red-400' : 'border-blue-500/30'
                } rounded p-2 text-white`}
                required
              />
              {fieldError('college')}
            </div>
            
            <div>
              <label className="block text-blue-300 mb-1">
                Phone Number <span className="text-red-400">*</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) {
                    const newErrors = {...errors};
                    delete newErrors.phone;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full bg-blue-900/30 border ${
                  errors.phone ? 'border-red-400' : 'border-blue-500/30'
                } rounded p-2 text-white`}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                title="Please enter a 10-digit phone number"
                required
              />
              {fieldError('phone')}
            </div>
            
            <div>
              <label className="block text-blue-300 mb-1">
                Year of Study <span className="text-red-400">*</span>
              </label>
              <select
                value={yearOfStudy}
                onChange={(e) => {
                  setYearOfStudy(e.target.value);
                  if (errors.yearOfStudy) {
                    const newErrors = {...errors};
                    delete newErrors.yearOfStudy;
                    setErrors(newErrors);
                  }
                }}
                className={`w-full bg-blue-900/30 border ${
                  errors.yearOfStudy ? 'border-red-400' : 'border-blue-500/30'
                } rounded p-2 text-white`}
                required
              >
                <option className='bg-black' value="">Select Year</option>
                <option className='bg-black' value="1">1st Year</option>
                <option className='bg-black' value="2">2nd Year</option>
                <option className='bg-black' value="3">3rd Year</option>
                <option className='bg-black' value="4">4th Year</option>
                <option className='bg-black' value="5">5th Year</option>
                <option className='bg-black' value="pg">Post Graduate</option>
              </select>
              {fieldError('yearOfStudy')}
            </div>
            <p className='text-red-300'>Don't forget to check your spam too!</p>

          </>
        )}
        
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setErrors({});
          }}
          className="text-blue-300 hover:underline"
        >
          {isLogin ? 'Need to register?' : 'Already have an account?'}
        </button>
      </div>
      
      {isLogin && (
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {/* Add forgot password handler */}}
            className="text-blue-300 hover:underline text-sm"
          >
            Forgot password?
          </button>
        </div>
      )}
    </div>
  );
}
