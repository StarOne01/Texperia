'use client';

import { useState, useEffect } from 'react';
import { Anta } from 'next/font/google';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabaseClient';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

// Event data
const events = [
  {
    id: 1,
    title: "Paper Presentation",
    description: "Present your research papers and innovative ideas to experts in the field. Showcase your technical knowledge and research skills through well-structured presentations.",
    icon: "/icons/paper.svg",
    color: "#4fd1c5",
    date: "March 15, 2025",
    time: "10:00 AM - 2:00 PM",
    venue: "Main Auditorium",
    prizes: "₹10,000",
    teamSize: "1-2 members",
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
    icon: "/icons/prototype.svg",
    color: "#285e61",
    date: "March 15, 2025",
    time: "10:00 AM - 4:00 PM",
    venue: "Workshop Area",
    prizes: "₹10,000",
    teamSize: "2-3 members",
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

export default function Events() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      
      if (data.user) {
        await fetchRegisteredEvents(data.user.id);
      }
    };
    
    checkUser();
  }, []);

  const fetchRegisteredEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from('event_registrations')
      .select('event_id')
      .eq('user_id', userId);
      
    if (data) {
      setRegisteredEvents(data.map(item => item.event_id));
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
        .insert([
          { user_id: user.id, event_id: eventId, status: 'registered' }
        ]);
        
      if (error) throw error;
      
      setRegisteredEvents([...registeredEvents, eventId]);
    } catch (error) {
      console.error('Error registering for event:', error);
    }
  };

  const openEventDetails = (event: typeof events[0]) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          event.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterCategory === 'all') {
      return matchesSearch;
    }
    
    // Here you would add logic to filter by category if categories were defined
    return matchesSearch;
  });

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
            <Link href="/" className="text-blue-300 hover:text-blue-200">Home</Link>
            <Link href="/events" className="text-blue-300 hover:text-blue-200">Events</Link>
            <Link href="#about" className="text-blue-300 hover:text-blue-200">About</Link>
            
            {user ? (
              <Link 
                href="/dashboard" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white"
              >
                Dashboard
              </Link>
            ) : (
              <Link 
                href="/login" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white"
              >
                Login / Register
              </Link>
            )}
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

        {/* Search and Filter */}
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
            
            <div className="md:w-64">
              <select
                className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 text-white"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="technical">Technical</option>
                <option value="presentation">Presentation</option>
                <option value="workshop">Workshops</option>
              </select>
            </div>
          </div>
        </div>

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
                      width={24}
                      height={24}
                      className="text-white"
                    />
                  </div>
                  <div className="text-sm text-blue-300">{event.date}</div>
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
                  
                  {registeredEvents.includes(event.id) ? (
                    <button
                      className="flex-1 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium cursor-default"
                    >
                      Registered
                    </button>
                  ) : (
                    <button
                      onClick={() => handleRegister(event.id)}
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white text-sm font-medium"
                    >
                      Register
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
                <h2 className={`text-3xl font-bold text-blue-300 ${anta.className}`}>{selectedEvent.title}</h2>
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
                
                {registeredEvents.includes(selectedEvent.id) ? (
                  <button
                    className="px-6 py-3 bg-green-900/20 border border-green-500/30 rounded-lg text-green-400 cursor-default"
                  >
                    Already Registered
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      handleRegister(selectedEvent.id);
                      setIsModalOpen(false);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg text-white"
                  >
                    Register Now
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
          <p>© 2025 Texperia. All rights reserved. For inquiries, contact <a href="mailto:info@texperia.org" className="text-blue-400">info@texperia.org</a></p>
        </div>
      </footer>
    </div>
  );
}