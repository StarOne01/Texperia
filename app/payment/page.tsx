'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Anta } from 'next/font/google';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

export default function PaymentPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const events = [
    {
      id: 1,
      title: "Paper Presentation",
      description: "Present your research papers and innovative ideas to experts in the field. Showcase your technical knowledge and research skills through well-structured presentations.",
      color: "#4fd1c5",
      date: "March 15, 2025",
      time: "10:00 AM - 2:00 PM",
      venue: "Main Auditorium",
      prizes: "₹10,000",
      teamSize: "1-2 members",
      category: "technical",
      rules: [
        "Submit abstract before February 15, 2025",
        "Presentation duration: 10 minutes",
        "Q&A session: 5 minutes",
        "Judgement based on innovation, clarity, and technical depth"
      ],
      coordinators: [
        { name: "Mr. James", phone: "+917598813368" },
        { name: "Ms. Keerthana", phone: "+916369306410" }
      ]
    },
    {
      id: 2,
      title: "Technical Quiz",
      description: "Test your technical knowledge in this fast-paced, challenging quiz competition. Cover topics from electronics, programming, mathematics, and general engineering principles.",
      icon: "/icons/quiz.svg",
      color: "#38b2ac",
      date: "March 15, 2025",
      time: "3:00 PM - 5:00 PM",
      venue: "Seminar Hall B",
      prizes: "₹8,000",
      teamSize: "2 members",
      category: "technical",
      rules: [
        "Multiple rounds including rapid fire, buzzer, and visual rounds",
        "Team elimination after each round",
        "No electronic gadgets allowed during competition",
        "Judge's decision is final"
      ],
      coordinators: [
        { name: "Prof. Akash Verma", phone: "akash@texperia.org" }
      ]
    },
    {
      id: 3,
      title: "Hackathon",
      description: "48 hours of coding, innovation, and problem-solving. Build solutions that matter in this intensive development marathon focused on real-world challenges.",
      icon: "/icons/code.svg",
      color: "#319795",
      date: "March 15-16, 2025",
      time: "Starts at 9:00 AM",
      venue: "Innovation Hub",
      prizes: "₹15,000",
      teamSize: "3-4 members",
      category: "flagship",
      rules: [
        "Teams must develop solutions aligned with provided themes",
        "All code must be written during the event",
        "Final presentations limited to 5 minutes",
        "Solutions evaluated on innovation, technical complexity, and practicality"
      ],
      coordinators: [
        { name: "Rahul Sharma", phone: "rahul@texperia.org" }
      ]
    },
    {
      id: 4,
      title: "Project Presentation",
      description: "Showcase your engineering projects and get feedback from industry experts. Present working prototypes or detailed models of your innovative engineering solutions.",
      icon: "/icons/project.svg",
      color: "#2c7a7b",
      date: "March 16, 2025",
      time: "11:00 AM - 4:00 PM",
      venue: "Exhibition Hall",
      prizes: "₹12,000",
      teamSize: "1-4 members",
      category: "flagship",
      rules: [
        "Projects must be original work of the participants",
        "Physical demonstration preferred but not mandatory",
        "10 minutes for presentation followed by Q&A",
        "Judging based on innovation, execution, and potential impact"
      ],
      coordinators: [
        { name: "Sneha Patel", phone: "sneha@texperia.org" }
      ]
    },
    {
      id: 5,
      title: "Rapid Prototype Challenge",
      description: "Design, build and demonstrate a working prototype within a limited timeframe. Test your quick thinking and hands-on skills in this exciting time-bound challenge.",
      icon: "/public/prototype.svg",
      color: "#285e61",
      date: "March 15, 2025",
      time: "10:00 AM - 4:00 PM",
      venue: "Workshop Area",
      prizes: "₹10,000",
      teamSize: "2-3 members",
      category: "technical",
      rules: [
        "Materials will be provided at the venue",
        "6 hours to complete the prototype",
        "Design should solve the specified problem statement",
        "Judging based on functionality, design, and innovation"
      ],
      coordinators: [
        { name: "Arjun Mehta", phone: "arjun@texperia.org" }
      ]
    },
    {
      id: 6,
      title: "Poster Presentation",
      description: "Visualize your ideas through creative posters and win exciting prizes. Present complex technical concepts through effective visual communication.",
      icon: "/icons/poster.svg",
      color: "#234e52",
      date: "March 16, 2025",
      time: "9:00 AM - 1:00 PM",
      venue: "Gallery Hall",
      prizes: "₹5,000",
      teamSize: "1-2 members",
      category: "non-technical",
      rules: [
        "Poster size: A1 (594 x 841 mm)",
        "Content must be original and technically accurate",
        "Brief 3-minute explanation to judges",
        "Judging based on content clarity, visual appeal, and technical depth"
      ],
      coordinators: [
        { name: "Meera Kapoor", phone: "meera@texperia.org" }
      ]
    },
    {
      id: 7,
      title: "Circuit Debugging",
      description: "Find and fix errors in complex electrical circuits against the clock. Test your troubleshooting skills and theoretical knowledge in this practical challenge.",
      icon: "/icons/circuit.svg",
      color: "#805ad5",
      date: "March 15, 2025",
      time: "2:00 PM - 5:00 PM",
      venue: "Electronics Lab",
      prizes: "₹7,000",
      teamSize: "2 members",
      category: "technical",
      rules: [
        "Teams will receive faulty circuits to debug",
        "Limited time per circuit (30 minutes)",
        "Only provided tools can be used",
        "Judging based on accuracy and time taken"
      ],
      coordinators: [
        { name: "Dr. Vijay Kumar", phone: "vijay@texperia.org" }
      ]
    },
    {
      id: 8,
      title: "Sketch Your Creativity",
      description: "Express your technical concepts through artistic sketches and diagrams. Blend art with engineering in this unique competition focusing on technical illustration.",
      icon: "/icons/sketch.svg",
      color: "#6b46c1",
      date: "March 16, 2025",
      time: "10:00 AM - 1:00 PM",
      venue: "Design Studio",
      prizes: "₹5,000",
      teamSize: "1 member",
      category: "non-technical",
      rules: [
        "Topic will be provided on the spot",
        "3 hours to complete the sketch",
        "All materials must be brought by participants",
        "Judging based on creativity, technical accuracy, and execution"
      ],
      coordinators: [
        { name: "Neha Sharma", phone: "neha@texperia.org" }
      ]
    },
    {
      id: 9,
      title: "CEO Talk",
      description: "Hear industry leaders share insights on technology trends and career paths. Engage with top executives and gain valuable perspective on the future of engineering and technology.",
      icon: "/icons/talk.svg",
      color: "#553c9a",
      date: "March 16, 2025",
      time: "2:00 PM - 4:00 PM",
      venue: "Conference Hall",
      prizes: "Certificate of Participation",
      teamSize: "Individual Registration",
      category: "non-technical",
      rules: [
        "Pre-registration required due to limited seating",
        "Questions must be submitted in advance",
        "Professional etiquette expected",
        "Recording permitted only with prior permission"
      ],
      coordinators: [
        { name: "Amit Singh", phone: "amit@texperia.org" }
      ]
    },
    {
      id: 10,
      title: "Workshop",
      description: "Hands-on sessions on cutting-edge technologies and engineering practices. Learn practical skills from industry experts in specialized areas of technology.",
      icon: "/icons/workshop.svg",
      color: "#44337a",
      date: "Both Days",
      time: "Various Timings",
      venue: "Multiple Locations",
      prizes: "Certificate of Completion",
      teamSize: "Individual Registration",
      category: "non-technical",
      rules: [
        "Separate registration required for each workshop",
        "Materials will be provided",
        "Limited seats available",
        "Prior knowledge requirements vary by workshop"
      ],
      coordinators: [
        { name: "Divya Reddy", phone: "divya@texperia.org" }
      ]
    },
    {
      id: 11,
      title: "Electrical Safety Mime",
      description: "Creative performances highlighting the importance of electrical safety. Communicate important safety concepts through the art of mime and non-verbal expression.",
      icon: "/icons/safety.svg",
      color: "#3c366b",
      date: "March 15, 2025",
      time: "5:00 PM - 7:00 PM",
      venue: "Open Air Theater",
      prizes: "₹6,000",
      teamSize: "3-5 members",
      category: "non-technical",
      rules: [
        "Performance duration: 5-7 minutes",
        "No dialogues allowed",
        "Background music permitted",
        "Props should be minimal and relevant",
        "Judging based on clarity of message, creativity, and execution"
      ],
      coordinators: [
        { name: "Pradeep Nair", phone: "pradeep@texperia.org" }
      ]
    }
  ];
  const [isLoading, setIsLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState('gpay');
  const [transactionId, setTransactionId] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Registration fee per event
  const EVENT_FEE = 150;

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
      if (registrationData?.payment_status === 'complete') {
        setIsLoading(false);
        setSuccessMessage('You have already completed payment for all registered events.');
        return;
      }
      
      setIsLoading(false);
      setRegisteredEvents(registrationData?.event_ids || []);   
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false);
    }
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
    
    try {
      let fileUrl = null;
      
      // Upload file if provided
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}-payment-proof-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, file);
          
        if (uploadError) throw uploadError;
        
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(fileName);
          
        fileUrl = publicUrl;
      }
      
      // Update payment details in the database
      const { error: updateError } = await supabase
        .from('event_registrations')
        .update({
          payment_method: paymentMethod,
          transaction_id: transactionId,
          payment_proof_url: fileUrl,
          payment_status: 'complete',
          payment_date: new Date().toISOString()
        })
        .eq('user_id', user.id);
        
      if (updateError) throw updateError;
      
      setSuccessMessage('Payment information submitted successfully! Our team will verify and update your registration status.');
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error submitting payment:', error);
      setFileError('Failed to submit payment information. Please try again.');
      setIsSubmitting(false);
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

  console.log(registeredEvents)

  const registeredEventDetails = events.filter(event => registeredEvents.includes(event.id));
  const totalAmount = 300;

  return (
    <div className="min-h-screen bg-black text-white p-8">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-black/70 border-b border-blue-500/20 mb-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className={`text-xl font-bold text-blue-300 ${anta.className}`}>TEXPERIA</h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/" className="text-blue-300 hover:text-blue-200">Home</Link>
            <Link href="/events" className="text-blue-300 hover:text-blue-200">Events</Link>
            <Link href="/dashboard" className="text-blue-300 hover:text-blue-200">Dashboard</Link>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto">
        <h1 className={`text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>Complete Your Registration</h1>
        
        {/* Registered Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-300">Your Registered Events</h2>
          {registeredEventDetails.length > 0 ? (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 p-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-blue-400">
                    <th className="py-2">Event</th>
                    <th className="py-2">Category</th>
                    <th className="py-2 text-right">Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredEventDetails.map((event) => (
                    <tr key={event.id} className="border-t border-blue-500/20">
                      <td className="py-3 text-blue-200">{event.title}</td>
                      <td className="py-3 capitalize text-blue-200">{event.category}</td>
                      <td className="py-3 text-right text-blue-200">₹{EVENT_FEE}</td>
                    </tr>
                  ))}
                  <tr className="border-t border-blue-500/20 font-bold">
                    <td className="py-3 text-blue-300" colSpan={2}>Total</td>
                    <td className="py-3 text-right text-blue-300">₹{totalAmount}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 text-center border border-blue-500/30">
              <div className="text-blue-400">You haven't registered for any events yet.</div>
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
              
              <div className="space-y-4 text-blue-200">
                <div>
                  <h4 className="font-medium text-blue-300">GPay / UPI</h4>
                  <p>UPI ID: texperia@example</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-blue-300">Direct Bank Transfer</h4>
                  <p>Account Name: Texperia Events</p>
                  <p>Account Number: 1234567890</p>
                  <p>IFSC Code: ABCD0001234</p>
                  <p>Bank: Example Bank</p>
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
                className={`w-full px-6 py-3 rounded-lg text-white font-medium ${
                  isSubmitting 
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
          <p>© {new Date().getFullYear()} Texperia. All rights reserved. For inquiries, contact <a href="mailto:info@texperia.org" className="text-blue-400">info@texperia.org</a></p>
        </div>
      </footer>
    </div>
  );
}
