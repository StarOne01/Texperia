'use client';

import { useState, useEffect } from 'react';
import { Anta } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import events from '../data/events';
import toast, { Toaster } from 'react-hot-toast';
import { User } from '@supabase/supabase-js';


const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});


export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('unpaid');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        await fetchRegisteredEvents(data.user.id);
        await fetchPaymentStatus(data.user.id);
      }
    };
    
    checkUser();
  }, []);

  const fetchRegisteredEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_ids')
      .eq('user_id', userId);
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
        toast.success("Failed to fetch your registrations");
        return;
      }
    if (data) {
      setRegisteredEvents(data[0].event_ids);
    }
  };

  const fetchPaymentStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('payment_status')
      .eq('user_id', userId)
      .single();
      
    if (!error && data) {
      setPaymentStatus(data.payment_status);
    }
  };

    const handleUnregister = async (eventId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }
  
    try {
      // Filter out the event ID from the registered events array
      const updatedEvents = registeredEvents.filter(id => id !== eventId);
      
      // Update the database
      const { data, error } = await supabase
        .from('event_registrations')
        .update({ 
          event_ids: updatedEvents,
          status: updatedEvents.length === 0 ? 'inactive' : 'registered', 
        })
        .match({ user_id: user.id });
        
      if (error) throw error;
      toast.error(`Unregistered from ${events.find(e => e.id === eventId)?.title}`); 
      // Update the local state
      setRegisteredEvents(updatedEvents);
      
      
    } catch (error) {
      console.error("Error removing event registration:", error);
    }
  };

  const handleRegister = async (eventId: number) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      const { data, error } = await supabase
              .from('event_registrations')
              .update({ 
                event_ids: Array.from(new Set([...registeredEvents,eventId])), 
                status: 'registered', 
                email: user.email 
              })
              .match({ user_id: user.id });
      if (error) throw error;
      toast.success(`Registered in ${events.find(e => e.id === eventId)?.title}`);
      setRegisteredEvents([...registeredEvents, eventId]);
    } catch (error) {
    }
  };

  // Add these functions in the Events component before the return statement

  // Count how many events of each category the user has registered for
  const countRegisteredEventsByCategory = () => {
    const counts = {
      flagship: 0,
      technical: 0,
      nonTechnical: 0
    };
    
    registeredEvents.forEach(eventId => {
      const event = events.find(e => e.id === eventId);
      if (event) {
        if (event.category === 'flagship') counts.flagship++;
        else if (event.category === 'technical') counts.technical++;
        else if (event.category === 'non-technical') counts.nonTechnical++;
      }
    });
    
    return counts;
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };


  // Check if user can register for an event of a given category
  const canRegisterForEvent = (eventCategory: string) => {
    const counts = countRegisteredEventsByCategory();
    
    if (eventCategory === 'flagship') {
      return counts.flagship < 1 && counts.nonTechnical + counts.technical < 2;
    } else {
      // For technical and non-technical combined, limit is 2
      return counts.flagship + counts.technical + counts.nonTechnical < 2 ;
    }
  };

  // Get an appropriate message explaining why registration is disabled
  const getRegistrationDisabledReason = (eventCategory: string) => {
    const counts = countRegisteredEventsByCategory();
    
    if (eventCategory === 'flagship' && counts.flagship >= 1) {
      return "You can register for only 1 flagship event and a tech/non-tech event combined";
    } else if (counts.technical + counts.nonTechnical >= 2) {
      return "You can register for only 2 technical/non-technical events combined";
    }
    
    return "";
  };

  const openEventDetails = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(event => {
    // Text search filter
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = 
      activeTab === 'all' || 
      event.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'flagship':
        return { label: 'Flagship Event', color: 'from-purple-600 to-pink-600' };
      case 'technical':
        return { label: 'Technical Event', color: 'from-blue-600 to-cyan-600' };
      case 'non-technical':
        return { label: 'Non-Technical Event', color: 'from-green-600 to-teal-600' };
      default:
        return { label: 'Event', color: 'from-gray-600 to-gray-600' };
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background Elements */}
      <Toaster
      position="bottom-right"
      toastOptions={{
        className: "backdrop-blur-md bg-blue-900/50 text-blue-200 border border-blue-500/30",
        duration: 3000,
        style: {
          background: "rgba(26, 32, 44, 0.8)",
          color: "#90cdf4",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(66, 153, 225, 0.3)",
        },
        success: {
          iconTheme: {
            primary: "#4fd1c5",
            secondary: "#1a202c",
          },
        },
        error: {
          iconTheme: {
            primary: "#fc8181",
            secondary: "#1a202c",
          },
        },
      }}
    />
    
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slower"></div>
        <div className="absolute bottom-[30%] right-[20%] w-80 h-80 bg-purple-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[30%] w-72 h-72 bg-pink-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slower"></div>
      </div>


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
          className={`md:hidden absolute top-full left-0 w-full bg-black/90 backdrop-blur-md border-b border-blue-500/20 transition-all duration-300 ${
            mobileMenuOpen
              ? "max-h-64 opacity-100"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="px-6 py-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3 mb-2">
              <Link href="/dashboard" className="text-blue-300 hover:text-blue-200 py-2">
                Dashboard
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


      <main className="max-w-6xl mx-auto px-4 py-12">
        <h1 className={`text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider text-center`}>
          Explore Events
        </h1>
        
        <p className="text-blue-200 text-center mb-12 max-w-3xl mx-auto">
          Discover a wide range of technical events designed to challenge your skills, expand your knowledge, and connect with like-minded tech enthusiasts. Register now to participate!
        </p>

        {/* Category Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2 md:gap-4">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'all' 
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' 
                  : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setActiveTab('flagship')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'flagship' 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                  : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'
              }`}
            >
              Flagship Events
            </button>
            <button
              onClick={() => setActiveTab('technical')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'technical' 
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white' 
                  : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'
              }`}
            >
              Technical Events
            </button>
            <button
              onClick={() => setActiveTab('non-technical')}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeTab === 'non-technical' 
                  ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white' 
                  : 'bg-blue-900/30 text-blue-300 hover:bg-blue-800/40'
              }`}
            >
              Non-Technical Events
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 pl-10 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Add this after the search section */}
        {user && (
          <div className="mb-8 bg-blue-900/20 border border-blue-500/20 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-blue-300">Your Registration Status</h3>
              
              {registeredEvents.length > 0 && (
                paymentStatus === 'verified' ? (
                  <div className="px-4 py-2 bg-green-900/20 text-green-400 rounded-lg border border-green-500/30">
                    Payment Verified
                  </div>
                ) : paymentStatus === 'paid' ? (
                  <button
                    onClick={() => {
                      toast.loading("Checking payment status...");
                      router.push('/dashboard');
                    }}
                    className="px-4 py-2 bg-yellow-900/20 text-yellow-400 rounded-lg border border-yellow-500/30"
                  >
                    Payment Under Verification
                  </button>
                ) : paymentStatus === 'failed' ?
                (
                  <button
                    onClick={() => {
                      toast.error("Sorry, We couldn't verify your payment. Please contact our coordinators.");
                      router.push('/payment');
                    }}
                    className="px-4 py-2 bg-red-900/20 text-red-400 rounded-lg border border-red-500/30"
                  >
                    Payment Failed
                  </button>)
                : (
                  <button
                    onClick={() => {
                      toast.success("Redirecting to payment page...");
                      router.push('/payment');
                    }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-lg"
                  >
                    Complete Payment
                  </button>
                )
              )}
            </div>
            
            <h3 className="text-lg font-semibold text-blue-300 mb-3">Your Registration Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-900/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Flagship Events</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    countRegisteredEventsByCategory().flagship === 0 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {countRegisteredEventsByCategory().flagship}/1
                  </span>
                </div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Technical Events</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    countRegisteredEventsByCategory().technical === 0 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {countRegisteredEventsByCategory().technical}
                  </span>
                </div>
              </div>
              <div className="bg-blue-900/30 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-blue-300">Non-Technical Events</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    countRegisteredEventsByCategory().nonTechnical === 0 
                      ? 'bg-blue-500/20 text-blue-300' 
                      : 'bg-green-500/20 text-green-300'
                  }`}>
                    {countRegisteredEventsByCategory().nonTechnical}
                  </span>
                </div>
              </div>
              <div className="col-span-1 md:col-span-3 text-blue-200/70 text-sm mt-2">
                <ul className="list-disc list-inside space-y-1">
                  <li>You can register for maximum 1 flagship event</li>
                  <li>You can register for maximum 2 events total from technical and non-technical categories combined</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredEvents.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl overflow-hidden border border-blue-500/30 hover:border-blue-500/50 transition-all relative"
            >
              {/* Top colored bar */}
              <div 
                className="h-2 w-full" 
                style={{ backgroundColor: event.color }}
              ></div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${event.color}30` }}
                  >
                    <Image
                      src={event.icon}
                      alt={event.title}
                      width={44}
                      height={44}
                      className="text-white"
                    />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {/* Category badge */}
                    <div className={`text-xs px-2 py-1 rounded-full bg-gradient-to-r ${getCategoryInfo(event.category).color} text-white font-medium`}>
                      {getCategoryInfo(event.category).label}
                    </div>
                    <div className="text-sm text-blue-300">{event.date}</div>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-blue-300">{event.title}</h3>
                <div 
                  className="h-1 w-12 rounded mb-3 transition-all duration-300 group-hover:w-24"
                  style={{ background: `linear-gradient(to right, ${event.color}, #805ad5)` }}  
                ></div>
                <p className="text-blue-100/70 text-sm mb-4 h-20 overflow-hidden">{event.description.substring(0, 100)}...</p>
                
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                  <button
                    onClick={() => openEventDetails(event)}
                    className="flex-1 px-4 py-2 bg-blue-900/50 hover:bg-blue-800/50 border border-blue-600/30 rounded-lg text-blue-300 text-sm font-medium"
                  >
                    View Details
                  </button>
                  
                  {/* Replace the existing registration button code in the event card */}
                  {registeredEvents.includes(event.id) ? (
                    <button onClick={()=>handleUnregister(event.id)}
                      className="flex-1 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium cursor-default"
                    >
                      Registered
                    </button>
                  ) : !user ? (
                    <button
                      onClick={() => router.push('/login')}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white text-sm font-medium"
                    >
                      Register
                    </button>
                  ) : canRegisterForEvent(event.category) ? (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white text-sm font-medium"
                    >
                      Register
                    </button>
                  ) : (
                    <button
                      disabled
                      title={getRegistrationDisabledReason(event.category)}
                      className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-500/30 rounded-lg text-gray-400 text-sm font-medium cursor-not-allowed"
                    >
                      Limit Reached
                    </button>
                  )}
                </div>
              </div>
              
              {/* Interactive animation elements */}
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-blue-400/50 group-hover:animate-ping"></div>
              <div className="absolute top-10 left-2 w-2 h-2 rounded-full bg-purple-400/50 group-hover:animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </motion.div>
          ))}
        </div>

        {/* Event Details Modal */}
        {isModalOpen && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            ></div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-xl border border-blue-500/30 p-6 max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 text-blue-400 hover:text-blue-300"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="flex items-center gap-4 mb-6">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${selectedEvent.color}30` }}
                >
                  <Image
                    src={selectedEvent.icon}
                    alt={selectedEvent.title}
                    width={32}
                    height={32}
                  />
                </div>
                <div>
                  <h2 className={`text-3xl font-bold text-blue-300 ${anta.className}`}>{selectedEvent.title}</h2>
                  <div className={`inline-block mt-2 text-xs px-3 py-1 rounded-full bg-gradient-to-r ${getCategoryInfo(selectedEvent.category).color} text-white font-medium`}>
                    {getCategoryInfo(selectedEvent.category).label}
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-blue-400 text-sm mb-1">Date</div>
                  <div className="text-blue-200">{selectedEvent.date}</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-blue-400 text-sm mb-1">Time</div>
                  <div className="text-blue-200">{selectedEvent.time}</div>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-500/20">
                  <div className="text-blue-400 text-sm mb-1">Venue</div>
                  <div className="text-blue-200">{selectedEvent.venue}</div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">Description</h3>
                <p className="text-blue-100/80">{selectedEvent.description}</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-3">Event Details</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-blue-400 text-sm">Prize Pool</div>
                      <div className="text-blue-200 font-medium">{selectedEvent.prizes}</div>
                    </div>
                    <div>
                      <div className="text-blue-400 text-sm">Team Size</div>
                      <div className="text-blue-200 font-medium">{selectedEvent.teamSize}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold text-blue-300 mb-3">Student Coordinators</h3>
                  <div className="space-y-3">
                    {selectedEvent.coordinators.map((coordinator, idx) => (
                      <div key={idx} className="flex flex-col">
                        <div className="text-blue-200 font-medium">{coordinator.name}</div>
                        <div className="text-blue-400 text-sm">{coordinator.phone}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-300 mb-3">Rules & Guidelines</h3>
                <ul className="list-disc list-inside space-y-2 text-blue-100/80">
                  {selectedEvent.rules.map((rule, idx) => (
                    <li key={idx}>{rule}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-900/30"
                >
                  Close
                </button>
                
                {/* Replace the existing registration button in the modal */}
                {registeredEvents.includes(selectedEvent.id) ? (
                  <button
                    className="px-6 py-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 cursor-default"
                  >
                    Already Registered
                  </button>
                ) : !user ? (
                  <button
                    onClick={() => {
                      setIsModalOpen(false);
                      router.push('/login');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white"
                  >
                    Login to Register
                  </button>
                ) : canRegisterForEvent(selectedEvent.category) ? (
                  <button
                    onClick={() => {
                      handleRegister(selectedEvent.id);
                      setIsModalOpen(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white"
                  >
                    Register Now
                  </button>
                ) : (
                  <button
                    disabled
                    title={getRegistrationDisabledReason(selectedEvent.category)}
                    className="px-6 py-3 bg-gray-700/50 border border-gray-500/30 rounded-lg text-gray-400 cursor-not-allowed"
                  >
                    Registration Limit Reached
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="px-6 py-10 border-t border-blue-500/20">
        <div className="max-w-6xl mx-auto text-center text-blue-400/70 text-sm">
          <p>© 2025 Texperia. All rights reserved. For inquiries, <a href="/#footer" className="text-blue-400">Contact Coordinators</a></p>
        </div>
      </footer>
    </div>
  );
}