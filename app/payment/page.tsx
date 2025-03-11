'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import events from '../data/events';
import Link from 'next/link';
import { Anta } from 'next/font/google';
import toast, { Toaster } from "react-hot-toast";
import { User } from '@supabase/supabase-js';
import Image from 'next/image';
import gpay from '../../public/gpay.jpeg';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push('/login');
        return;
      }

      setUser(data.session.user);
      await fetchRegisteredEvents(data.session.user.id);
    };

    checkUser();
  }, []);

  const fetchRegisteredEvents = async (userId: string) => {
    try {
      // Fetch user's registered events
      const { data: registrationData, error: registrationError } = await supabase
        .from('event_registrations')
        .select('event_ids, payment_status')
        .eq('user_id', userId)
        .single();

      if (registrationError) throw registrationError;

      // If payment is already completed, redirect to dashboard
      if (registrationData?.payment_status === 'paid') {
        setIsLoading(false);
        setSuccessMessage('You have already completed payment for all registered events.');
        toast.success('You have already completed payment for all registered events.');
        return;
      }

      setIsLoading(false);
      setRegisteredEvents(registrationData?.event_ids || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Check file size (5MB limit)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError('File size must be less than 5MB');
      setFile(null);
      return;
    }

    // Check file type (only images and PDFs)
    if (!['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(selectedFile.type)) {
      setFileError('Only images (JPEG, PNG, GIF) and PDF files are allowed');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setFileError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!transactionId && !file) {
      setFileError('Please provide either a transaction ID or upload payment proof');
      return;
    }

    setIsSubmitting(true);

    // Show loading toast
    const loadingToast = toast.loading("Processing payment...");

    try {
      let fileUrl = '';

      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const userFolder = `${user?.id}`;
        const filePath = `${userFolder}/${fileName}`;

        // Check for existing files in user folder
        const { data: existingFiles, error: listError } = await supabase.storage
          .from('payment-proofs')
          .list(userFolder);

        if (!listError && existingFiles?.length > 0) {
          // Delete existing files
          const filesToDelete = existingFiles.map(f => `${userFolder}/${f.name}`);

          const { error: deleteError } = await supabase.storage
            .from('payment-proofs')
            .remove(filesToDelete);

          if (deleteError) {
            console.error('Error deleting previous files:', deleteError);
          }
        }

        // Upload new file
        const { data: _, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
      }

      // Update payment details in the database
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({
          payment_method: paymentMethod,
          transaction_id: transactionId,
          payment_proof_url: fileUrl,
          payment_status: 'paid',
          payment_date: new Date().toISOString()
        })
        .eq('user_id', user?.id);

      if (updateError) throw updateError;

      setIsSubmitting(false);

      // Update toast on success
      toast.success("Payment submitted successfully!", { id: loadingToast });
      router.push("/dashboard");
    } catch (error) {
      console.error('Error submitting payment:', error);
      setFileError('Failed to submit payment information. Please try again.');
      setIsSubmitting(false);

      toast.error("Payment submission failed", { id: loadingToast });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Payment</h1>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  if (successMessage) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className={`text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>Payment</h1>
          <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-6 text-center">
            <div className="text-green-400 text-xl mb-4">{successMessage}</div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }


  const registeredEventDetails = events.filter(event => registeredEvents.includes(event.id));

  const calculateTotalAmount = () => {
    // Check if registered for the workshop (ID: 10)
    const hasWorkshop = registeredEventDetails.some(event => event.id === 10);
    
    if (hasWorkshop) {
      // Workshop pricing: 
      // If user has events on both March 19 and March 20, charge 600
      // Otherwise charge 300 for single day workshop
      
      // Check if the user has registered for events on both days
      const hasMarch19Events = registeredEventDetails.some(
        event => event.id !== 10 || event.date === "March 19, 2025"
      );
      const hasMarch20Events = registeredEventDetails.some(
        event => event.id !== 12 && event.date === "March 20, 2025"
      );
      
      // If planning to attend both days
      if (hasMarch19Events && hasMarch20Events) {
        return 600; // Full price for both days
      }
      
      return 300; // Single day price
    }
    
    // For regular events, check which days have events
    const registeredDays = new Set();
    
    registeredEventDetails.forEach(event => {
      if (event.date === "March 19, 2025") {
        registeredDays.add("day1");
      } else if (event.date === "March 20, 2025") {
        registeredDays.add("day2");
      }
    });
    
    // 300 per day
    return registeredDays.size * 300;
  };
  
  const totalAmount = calculateTotalAmount();


  return (
    <div className="min-h-screen bg-black text-white p-8">
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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-black/70 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/#events" className="flex items-center">
            <h1 className={`text-xl font-bold text-blue-300 ${anta.className}`}>
              TEXPERIA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-blue-300">
              Welcome, {user?.user_metadata.name || user?.email || 'User'}
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-300 hover:text-blue-200"
            >
              Logout
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="md:hidden text-blue-300"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-md border-b border-blue-500/20 transition-all duration-300 ${mobileMenuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
            }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="text-blue-300 border-b border-blue-500/20 pb-2">
              Welcome, {user?.user_metadata?.name || user?.email || 'User'}
            </div>
            <div className="flex flex-col gap-3 mb-2">
              <Link
                href="/#events"
                className="text-blue-300 hover:text-blue-200 py-2"
              >
                Home
              </Link>
              <Link
                href="/events"
                className="text-blue-300 hover:text-blue-200 py-2"
              >
                Events
              </Link>
              <button
                onClick={handleLogout}
                className="text-left text-blue-300 hover:text-blue-200 py-2"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>Complete Your Registration</h1>

        {/* Registered Events */}
        <div className="mb-8">
          {!(registeredEventDetails.length > 0) && (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 text-center border border-blue-500/30">
              <div className="text-blue-400">You haven&apos;t registered for any events yet.</div>
              <Link
                href="/events"
                className="mt-4 inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-lg text-white font-medium"
              >
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* Payment Form */}
        {registeredEventDetails.length > 0 && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
            <h2 className="text-2xl font-semibold mb-4 text-blue-300">Payment Details</h2>

            {/* Payment Instructions */}
            <div className="mb-6 p-4 bg-blue-900/30 rounded-lg border border-blue-500/20">
              <h3 className="font-medium text-blue-400 mb-2">Payment Instructions</h3>
              <p className="mb-3 text-blue-200">Please transfer ₹{totalAmount} using one of the following methods:</p>
              <Image src={gpay} className='mb-5' alt="Payment Methods" width={300} height={300} />
              <div className="space-y-4 text-blue-200">
                <div>
                  <h4 className="font-medium text-blue-300">GPay / UPI</h4>
                  <p>UPI ID: abishree4744@okhdfcbank</p>
                </div>

                <div>
                  <h4 className="font-medium text-blue-300">Direct Bank Transfer</h4>
                  <p>Name: Abishek. </p>
                  <p>A/c no: 18760100031474</p>
                  <p>IFSC Code : FDRL0001876</p>
                  <p>Branch: Kotagiri </p>
                  <p>Bank: Federal Bank</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Payment Method */}
              <div className="mb-4">
                <label className="block text-blue-300 mb-2">Payment Method</label>
                <div className="flex space-x-4">
                  <label className="flex items-center text-blue-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="gpay"
                      checked={paymentMethod === 'gpay'}
                      onChange={() => setPaymentMethod('gpay')}
                      className="mr-2"
                    />
                    GPay / UPI
                  </label>
                  <label className="flex items-center text-blue-200">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={() => setPaymentMethod('bank')}
                      className="mr-2"
                    />
                    Bank Transfer
                  </label>
                </div>
              </div>

              {/* Transaction ID */}
              <div className="mb-4">
                <label className="block text-blue-300 mb-2">Transaction ID (Optional)</label>
                <input
                  type="text"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter transaction ID/reference number"
                  className="w-full bg-blue-900/30 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
              </div>

              {/* File Upload */}
              <div className="mb-6">
                <label className="block text-blue-300 mb-2">
                  Upload Payment Proof (Optional)
                  <span className="text-sm text-blue-400 ml-2">Max 5MB, Images or PDF</span>
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/gif,application/pdf"
                  className="w-full bg-blue-900/30 border border-blue-500/30 rounded-lg px-4 py-2 text-white"
                />
                {fileError && <p className="text-red-500 text-sm mt-1">{fileError}</p>}
                {file && <p className="text-green-500 text-sm mt-1">File selected: {file.name}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full px-6 py-3 rounded-lg text-white font-medium ${isSubmitting
                    ? 'bg-blue-800 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                  }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Payment Information'}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-6 py-10 mt-16 border-t border-blue-500/20">
        <div className="max-w-6xl mx-auto text-center text-blue-400/70 text-sm">
          <p>© {new Date().getFullYear()} Texperia. All rights reserved. For inquiries, contact <Link href="mailto:info@texperia.org" className="text-blue-400">info@texperia.org</Link></p>
        </div>
      </footer>
    </div>
  );
}
