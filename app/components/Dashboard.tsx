'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  
  useEffect(() => {
    // Get the current user
    const fetchUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (user) {
          // Fetch the user's registered events
          const { data, error } = await supabase
          .from('event_registrations')
          .select('event_id')
          .eq('user_id', user.id);
          
            console.log(user.id)
            
          if (error) throw error;
          setRegisteredEvents(data || []);
          console.log(data)
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUser();
    
    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session)=> {
      setUser(session?.user ?? null);
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!user) {
    return null; // Auth component will handle this case
  }
  
  return (
    <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-blue-300">My Dashboard</h2>
        <button 
          onClick={handleLogout}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded border border-red-500/30 transition-colors"
        >
          Logout
        </button>
      </div>
      
      <div className="bg-blue-900/20 rounded-lg p-4 mb-8 border border-blue-500/20">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Profile Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-blue-400 text-sm">Name:</p>
            <p className="text-white">{user.user_metadata?.name || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-blue-400 text-sm">Email:</p>
            <p className="text-white">{user.email}</p>
          </div>
          <div>
            <p className="text-blue-400 text-sm">College/Institution:</p>
            <p className="text-white">{user.user_metadata?.college || 'Not provided'}</p>
          </div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-blue-300 mb-4">Registered Events</h3>
      
      {registeredEvents.length === 0 ? (
        <div className="bg-blue-900/20 rounded-lg p-6 text-center border border-blue-500/20">
          <p className="text-blue-300 mb-4">You haven't registered for any events yet.</p>
          <a href="#events" className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold py-2 px-4 rounded transition-all duration-300">
            Explore Events
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {registeredEvents.map((registration) => (
            <motion.div
              key={registration.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-blue-900/20 rounded-lg p-4 border border-blue-500/20 hover:border-blue-400/40 transition-colors"
            >
              <h4 className="text-lg font-medium text-blue-300">{registration.id}</h4>
              <p className="text-sm text-blue-100 mb-2">{registration.events.description}</p>
              <div className="flex justify-between text-xs text-blue-400">
                <span>Date: {new Date(registration.events.date).toLocaleDateString()}</span>
                <span>{registration.events.location}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-xl font-semibold text-blue-300 mb-4">Recommended Events</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* This would be populated with events the user hasn't registered for yet */}
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <h4 className="text-lg font-medium text-purple-300">Hackathon</h4>
            <p className="text-sm text-blue-100 mb-2">48 hours of coding, innovation, and problem-solving.</p>
            <button className="text-sm bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 px-3 py-1 rounded transition-colors">
              Register
            </button>
          </div>
          <div className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20 hover:border-purple-400/40 transition-colors">
            <h4 className="text-lg font-medium text-purple-300">Technical Quiz</h4>
            <p className="text-sm text-blue-100 mb-2">Test your technical knowledge in this fast-paced competition.</p>
            <button className="text-sm bg-purple-500/30 hover:bg-purple-500/50 text-purple-200 px-3 py-1 rounded transition-colors">
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
