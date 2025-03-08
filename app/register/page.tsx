'use client';
import { Anta } from 'next/font/google';
import Auth from '../components/Auth';
import Link from 'next/link';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

export default function Register() {
  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/#events" className="inline-block mb-10 text-blue-300 hover:text-blue-200">
          ← Back to home
        </Link>
        
        <h1 className={`text-4xl text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>
          Register for Texperia
        </h1>
        
        <Auth initialMode="register" />
        
        <p className="text-center mt-8 text-blue-200">
          Already have an account? <Link href="/login" className="text-purple-400 hover:text-purple-300">Login here</Link>
        </p>
      </div>
    </div>
  );
}
