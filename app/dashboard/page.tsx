'use client';

import { useEffect, useState } from 'react';
import { Anta } from 'next/font/google';
import Link from 'next/link';
import { supabase } from '../utils/supabaseClient';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('events');
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error || !data.session) {
        router.push('/login');
        return;
      }
      
      setUser(data.session.user);
      await fetchUserProfile(data.session.user.id);
      await fetchRegisteredEvents(data.session.user.id);
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (data) setProfile(data);
  };

  const fetchRegisteredEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('*, events(*)')
      .eq('user_id', userId);
      
    if (data) setRegisteredEvents(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse text-2xl text-blue-300">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[10%] left-[20%] w-96 h-96 bg-blue-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slower"></div>
        <div className="absolute bottom-[30%] right-[20%] w-80 h-80 bg-purple-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute bottom-[10%] left-[30%] w-72 h-72 bg-pink-700 rounded-full filter blur-3xl opacity-10 animate-pulse-slower"></div>
      </div>
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 py-4 backdrop-blur-md bg-black/70 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className={`text-xl font-bold text-blue-300 ${anta.className}`}>TEXPERIA</h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="text-blue-300">
              Welcome, {profile?.name || user?.email}
            </div>
            <button 
              onClick={handleLogout}
              className="text-blue-300 hover:text-blue-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1 className={`text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>
          Your Dashboard
        </h1>
        
        {/* Dashboard Tabs */}
        <div className="flex gap-4 mb-8 border-b border-blue-500/20 pb-4">
          <button 
            onClick={() => setActiveTab('events')} 
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'events' ? 'bg-blue-900/50 text-blue-200' : 'text-blue-400 hover:text-blue-300'}`}
          >
            My Events
          </button>
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-blue-900/50 text-blue-200' : 'text-blue-400 hover:text-blue-300'}`}
          >
            Profile
          </button>
          <button 
            onClick={() => setActiveTab('teams')} 
            className={`px-4 py-2 rounded-lg transition-colors ${activeTab === 'teams' ? 'bg-blue-900/50 text-blue-200' : 'text-blue-400 hover:text-blue-300'}`}
          >
            Teams
          </button>
        </div>
        
        {/* Events Tab Content */}
        {activeTab === 'events' && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-blue-300">Registered Events</h2>
              <Link 
                href="/events" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white font-medium"
              >
                Browse More Events
              </Link>
            </div>
            
            {registeredEvents.length === 0 ? (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">No Events Registered</h3>
                <p className="text-blue-200 mb-6">You haven't registered for any events yet.</p>
                <Link 
                  href="/events" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-lg text-white font-medium inline-block"
                >
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registeredEvents.map((registration) => (
                  <div 
                    key={registration.id}
                    className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-green-500/20 text-green-300 px-3 py-1 text-xs font-medium rounded-bl-lg">
                      Registered
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-300">{registration.events?.title}</h3>
                    <div 
                      className="h-1 w-10 rounded mb-3 transition-all duration-300 group-hover:w-3/4"
                      style={{ background: `linear-gradient(to right, ${registration.events?.color || '#4fd1c5'}, #805ad5)` }}  
                    ></div>
                    <p className="text-blue-100/70 text-sm mb-4">{registration.events?.description?.substring(0, 100)}...</p>
                    
                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-300">
                          <span className="font-medium">Status:</span> {registration.status || 'Confirmed'}
                        </div>
                        <Link 
                          href={`/events/${registration.events?.id}`}
                          className="text-purple-400 hover:text-purple-300 text-sm"
                        >
                          View Details →
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-blue-300 mb-6">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-400">March 15, 2025</div>
                    <div className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs font-medium rounded-lg">
                      Day 1
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">Opening Ceremony</h3>
                  <p className="text-blue-200/70 text-sm mt-2">Join us for the grand opening of Texperia 2025 featuring keynote speakers and special performances.</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-400">March 16, 2025</div>
                    <div className="bg-purple-500/20 text-purple-300 px-2 py-1 text-xs font-medium rounded-lg">
                      Day 2
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">Closing Ceremony & Awards</h3>
                  <p className="text-blue-200/70 text-sm mt-2">The final event of Texperia 2025 with prize distribution and closing remarks.</p>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">Your Profile</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Email Address</label>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded p-3 text-blue-200">
                    {user?.email}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.name || ''}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">College/Institution</label>
                  <input 
                    type="text" 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.college || ''}
                    placeholder="Enter your college name"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Phone Number</label>
                  <input 
                    type="text" 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.phone || ''}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              
              <div>
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Department/Major</label>
                  <input 
                    type="text" 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.department || ''}
                    placeholder="Enter your department or major"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Year of Study</label>
                  <select 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.year || ''}
                  >
                    <option value="">Select year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                    <option value="5">5th Year</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">Bio</label>
                  <textarea 
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white h-32"
                    defaultValue={profile?.bio || ''}
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-lg text-white font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
        
        {/* Teams Tab Content */}
        {activeTab === 'teams' && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">Your Teams</h2>
            
            <div className="mb-8">
              <div className="bg-blue-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-300">Team Quantum</h3>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-medium rounded-lg">
                    Active
                  </span>
                </div>
                <p className="text-blue-200/70 text-sm mb-4">Participating in: Hackathon</p>
                
                <h4 className="text-blue-400 text-sm font-medium mb-2">Members:</h4>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 font-medium">
                        JD
                      </div>
                      <div>
                        <div className="text-blue-200">John Doe (You)</div>
                        <div className="text-blue-400 text-xs">Team Leader</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 font-medium">
                        AS
                      </div>
                      <div>
                        <div className="text-blue-200">Alice Smith</div>
                        <div className="text-blue-400 text-xs">Member</div>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                  
                  <div className="flex items-center justify-between bg-blue-900/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 font-medium">
                        RJ
                      </div>
                      <div>
                        <div className="text-blue-200">Robert Johnson</div>
                        <div className="text-blue-400 text-xs">Member</div>
                      </div>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                </div>
                
                <div className="flex justify-end gap-4 mt-6">
                  <button className="border border-red-500/30 text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm">
                    Delete Team
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm">
                    Invite Member
                  </button>
                </div>
              </div>
              
              <button className="w-full border border-dashed border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 p-4 rounded-xl">
                + Create New Team
              </button>
            </div>
          </div>
        )}
      </main>
      
      {/* Notification Panel */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-sm p-4 rounded-xl border border-blue-500/30 shadow-lg max-w-xs w-full">
        <div className="flex items-start justify-between mb-2">
          <div className="font-semibold text-blue-300">Important Updates</div>
          <button className="text-blue-400 hover:text-blue-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-blue-200/90 mb-3">Don't forget to complete your team registration for the Hackathon by March 1st!</p>
        <div className="flex justify-end">
          <button className="text-sm text-purple-400 hover:text-purple-300">Dismiss</button>
        </div>
      </div>
    </div>
  );
}