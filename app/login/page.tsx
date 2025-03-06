'use client';
import { Anta } from 'next/font/google';
import Auth from '../components/Auth';
import Link from 'next/link';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

export default function Login() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>
          Login to Texperia
        </h1>
        
        <Auth initialMode="login" />
        
        <p className="text-center mt-8 text-blue-200">
          Don't have an account? <Link href="/register" className="text-purple-400 hover:text-purple-300">Register here</Link>
        </p>
      </div>
    </div>
  );
}
