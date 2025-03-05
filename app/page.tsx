'use client'
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Head from 'next/head';
import { Anta } from 'next/font/google';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { TextPlugin } from 'gsap/TextPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
}

const anta = Anta({
  weight: '400',
  subsets: ['latin'],
});

const events = [
  {
    id: 1,
    title: "Paper Presentation",
    description: "Present your research papers and innovative ideas to experts in the field.",
    icon: "/icons/paper.svg",
    color: "#4fd1c5"
  },
  {
    id: 2,
    title: "Technical Quiz",
    description: "Test your technical knowledge in this fast-paced, challenging quiz competition.",
    icon: "/icons/quiz.svg",
    color: "#38b2ac"
  },
  {
    id: 3,
    title: "Hackathon",
    description: "48 hours of coding, innovation, and problem-solving. Build solutions that matter.",
    icon: "/icons/code.svg",
    color: "#319795"
  },
  {
    id: 4,
    title: "Project Presentation",
    description: "Showcase your engineering projects and get feedback from industry experts.",
    icon: "/icons/project.svg",
    color: "#2c7a7b"
  },
  {
    id: 5,
    title: "Rapid Prototype Challenge",
    description: "Design, build and demonstrate a working prototype within a limited timeframe.",
    icon: "/icons/prototype.svg",
    color: "#285e61"
  },
  {
    id: 6,
    title: "Poster Presentation",
    description: "Visualize your ideas through creative posters and win exciting prizes.",
    icon: "/icons/poster.svg",
    color: "#234e52"
  },
  {
    id: 7,
    title: "Circuit Debugging",
    description: "Find and fix errors in complex electrical circuits against the clock.",
    icon: "/icons/circuit.svg",
    color: "#805ad5"
  },
  {
    id: 8,
    title: "Sketch Your Creativity",
    description: "Express your technical concepts through artistic sketches and diagrams.",
    icon: "/icons/sketch.svg",
    color: "#6b46c1"
  },
  {
    id: 9,
    title: "CEO Talk",
    description: "Hear industry leaders share insights on technology trends and career paths.",
    icon: "/icons/talk.svg",
    color: "#553c9a"
  },
  {
    id: 10,
    title: "Workshop",
    description: "Hands-on sessions on cutting-edge technologies and engineering practices.",
    icon: "/icons/workshop.svg",
    color: "#44337a"
  },
  {
    id: 11,
    title: "Electrical Safety Mime",
    description: "Creative performances highlighting the importance of electrical safety.",
    icon: "/icons/safety.svg",
    color: "#3c366b"
  },
];

// Add this function at the top level
const generateElectronPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Use seeded random numbers or fixed positions
    left: `${((i * 13) % 100)}%`,
    top: `${((i * 17) % 100)}%`,
  }));
};

// Add this constant at the top level
const ELECTRON_POSITIONS = generateElectronPositions(30);

// Add this constant at the top level with your other constants
const faqs = [
  {
    question: "What is Texperia?",
    answer: "Texperia is a national-level technical symposium that brings together brilliant minds to showcase their technical prowess through various events and competitions."
  },
  {
    question: "Who can participate?",
    answer: "Students from any recognized educational institution can participate. Both undergraduate and postgraduate students are welcome."
  },
  {
    question: "Is there a registration fee?",
    answer: "Yes, there is a nominal registration fee that varies by event. Early bird registrations get special discounts."
  },
  {
    question: "Can I participate in multiple events?",
    answer: "Yes, you can participate in multiple events as long as there are no schedule conflicts."
  },
  {
    question: "How do I form a team?",
    answer: "You can either register with your own team or request to join other participants. Team size requirements vary by event."
  },
  {
    question: "What are the accommodation arrangements?",
    answer: "We provide accommodation facilities for outstation participants at nominal charges. Book early to ensure availability."
  }
];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null);
  const headerRef = useRef(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const electronRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to handle mouse move for interactive elements
  const handleMouseMove = (e:any) => {
    const { clientX, clientY } = e;
    const x = (clientX / window.innerWidth) - 0.5;
    const y = (clientY / window.innerHeight) - 0.5;
    
    if (headerRef.current) {
      gsap.to(headerRef.current, {
        duration: 1.5,
        backgroundPositionX: `${x * 20}px`,
        backgroundPositionY: `${y * 20}px`,
        ease: "power2.out"
      });
    }

    // Move electrons toward mouse position
    electronRefs.current.forEach(electron => {
      if (electron) {
        const electronX = electron.getBoundingClientRect().left;
        const electronY = electron.getBoundingClientRect().top;
        const distX = clientX - electronX;
        const distY = clientY - electronY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        
        if (dist < 300) {
          gsap.to(electron, {
            duration: 0.8,
            x: `+=${distX * 0.05}`,
            y: `+=${distY * 0.05}`,
            ease: "power2.out"
          });
        }
      }
    });
  };

  // Initialize GSAP animations
  useEffect(() => {
    // Animate title with text reveal effect
    const tl = gsap.timeline();
    tl.from(titleRef.current, {
      duration: 1.2,
      opacity: 0,
      y: -100,
      ease: "power4.out"
    })
    .from(subtitleRef.current, {
      duration: 1,
      opacity: 0,
      y: 50,
      ease: "power3.out"
    }, "-=0.5");

    // Circuit paths animation
    if (circuitRef.current) {
      const paths = circuitRef.current.querySelectorAll('.circuit-path');
      gsap.set(paths, { strokeDasharray: "100%", strokeDashoffset: "100%" });
      gsap.to(paths, {
        duration: 3,
        strokeDashoffset: 0,
        ease: "power3.inOut",
        stagger: 0.2
      });
    }

    // Animate event cards when they appear in viewport
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll('.event-box');
      ScrollTrigger.batch(eventCards, {
        start: "top bottom-=100px",
        onEnter: batch => {
          gsap.to(batch, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: "power2.out"
          });
        },
        onLeaveBack: batch => {
          gsap.to(batch, {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1
          });
        }
      });
    }

    // Create floating electrons
    electronRefs.current.forEach((electron, index) => {
      if (electron) {
        gsap.to(electron, {
          x: `random(-50, 50)`,
          y: `random(-50, 50)`,
          duration: `random(3, 8)`,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.1
        });
      }
    });

    // Clean up
    return () => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      }
    };
  }, []);

  return (
    <div 
      className="relative min-h-screen bg-black text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap" rel="stylesheet" />
      </Head>
      
      {/* SVG Circuit Background */}
      <div className="absolute inset-0 z-0 opacity-30">
        <svg width="100%" height="100%" ref={circuitRef}>
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path className="circuit-path" d="M0,100 Q50,50 100,100 T200,100" stroke="#4fd1c5" strokeWidth="2" fill="none" filter="url(#glow)" />
          <path className="circuit-path" d="M50,0 Q100,50 150,0" stroke="#805ad5" strokeWidth="2" fill="none" filter="url(#glow)" />
          <path className="circuit-path" d="M200,50 Q150,100 100,50 T0,50" stroke="#4fd1c5" strokeWidth="2" fill="none" filter="url(#glow)" />
        </svg>
        <div className="circuit-lines"></div>
        {ELECTRON_POSITIONS.map((position) => (
          <div
            key={position.id}
            className="electron"
            ref={el => { electronRefs.current[position.id] = el }}
            style={{
              left: position.left,
              top: position.top,
            }}
          />
        ))}
      </div>

      <main className=" z-10 mx-auto">
        <div className="fixed z-0 overflow-hidden h-screen">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="fixed z-[-10] w-full h-full object-cover opacity-60"
          >
            <source src="/tech-backgroud.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <div className="fixed z-[-10]  inset-0 bg-gradient-to-b from-black/50 to-black/70 "></div>
        </div>
        
        <header 
          ref={headerRef}
          className="text-center flex justify-center items-center flex-col min-h-screen mb-20 relative z-10 overflow-hidden"
        >
          <div className="absolute inset-0 z-0">
            {/* Animated circuit board patterns */}
            <div className="absolute w-40 h-40 border border-blue-500/30 rounded-full top-1/4 left-1/4 animate-pulse-slow"></div>
            <div className="absolute w-60 h-60 border border-purple-500/20 rounded-full bottom-1/4 right-1/4 animate-pulse-slower"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 animate-pulse-fast"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-20 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 animate-pulse-fast"></div>
          </div>
          
          <h1 
            ref={titleRef}
            className={`text-7xl md:text-9xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider relative`}
          >
            TEXPERIA
            <span className="absolute p-2 -inset-0.5 bg-blue-500/10 blur-xl opacity-30"></span>
          </h1>
          
          <p
            ref={subtitleRef}
            className="text-xl md:text-2xl text-blue-300 max-w-2xl mx-auto px-4 relative"
          >
            Unleash your technical prowess in our electrifying celebration of innovation and technology
            <span className="block h-1 w-20 mx-auto mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
          </p>
          
          {/* Replace your existing buttons with these */}
          <div className="mt-10 flex gap-4">
            <button 
              className="px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <span>Register Now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </button>
            <button 
              className="px-8 py-4 bg-transparent border-2 border-blue-500/30 hover:border-purple-500/50 rounded-full text-blue-300 hover:text-purple-300 font-bold transition-all transform hover:scale-105 backdrop-blur-sm"
            >
              <span className="flex items-center gap-2">
                <span>Explore Events</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
          </div>
        </header>

        <AnimatePresence>
          {selectedEvent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="fixed overflow-scroll inset-0 z-50 flex items-center justify-center bg-black/90 p-4 md:p-10 backdrop-blur-lg"
              onClick={() => setSelectedEvent(null)}
            >
              
              
              <div 
          className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 rounded-2xl max-w-5xl w-full backdrop-blur-md border border-blue-500/30 relative overflow-hidden"
          onClick={(e) => e.stopPropagation()}
              >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl"></div>

          {/* Header Section */}
          <div className="border-b border-blue-500/30 p-6 md:p-8">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="w-16 h-16 rounded-xl flex items-center justify-center"
                style={{ background: `${selectedEvent.color}30` }}
              >
                <div className="w-10 h-10 rounded flex items-center justify-center text-xl"
               style={{ background: `${selectedEvent.color}50` }}>
            {selectedEvent.id}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-blue-300">{selectedEvent.title}</h2>
            </div>
            <p className="text-xl text-blue-100/90">{selectedEvent.description}</p>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">

            {/* Event Details */}
            <div className="space-y-6">
              <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 text-blue-200">Event Details</h3>
                <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">📅</span> 
              <span>March 15-16, 2025</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">🏆</span>
              <span>Prizes worth ₹50,000</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">👥</span>
              <span>Team size: 2-4 members</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">⏰</span>
              <span>Duration: 6 hours</span>
            </li>
                </ul>
              </div>

              {/* Rules Section */}
              <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/20">
                <h3 className="text-xl font-semibold mb-4 text-purple-200">Rules</h3>
                <ul className="list-disc list-inside space-y-2 text-purple-100/90">
            <li>All team members must be registered</li>
            <li>Original work only</li>
            <li>Follow submission guidelines</li>
            <li>Judges decision is final</li>
                </ul>
              </div>
            </div>

            {/* Timeline & Requirements */}
            <div className="space-y-6">
              <div className="bg-cyan-900/30 p-6 rounded-xl border border-cyan-500/20">
                <h3 className="text-xl font-semibold mb-4 text-cyan-200">Timeline</h3>
                <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400"></div>
              <div>
                <p className="font-semibold text-cyan-300">Registration Deadline</p>
                <p className="text-cyan-100/70">March 10, 2025</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400"></div>
              <div>
                <p className="font-semibold text-cyan-300">Event Start</p>
                <p className="text-cyan-100/70">March 15, 9:00 AM</p>
              </div>
            </div>
                </div>
              </div>

              {/* Requirements Section */}
              <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/20">
                <h3 className="text-xl font-semibold mb-4 text-blue-200">Requirements</h3>
                <ul className="space-y-2 text-blue-100/90">
            <li>• Valid college ID</li>
            <li>• Laptop with required software</li>
            <li>• Preliminary project abstract</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-blue-500/30 p-6 md:p-8 flex flex-wrap gap-4 justify-between items-center">
            <button 
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-full text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              onClick={() => {/* Registration logic */}}
            >
              Register Now
            </button>
            <button 
              className="px-6 py-3 border border-blue-500/30 hover:border-blue-400 rounded-full text-blue-300 hover:text-blue-200 transition-all"
              onClick={() => setSelectedEvent(null)}
            >
              Close Details
            </button>
          </div>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
        <h1 
            className={`text-4xl mt-1 text-center md:text-5xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider relative`}
          >
            Events
          </h1>
        <div className="relative min-h-screen overflow-hidden py-20">
  <div className="solar-system">
    {/* Center sun */}
    <div 
      className="absolute w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full 
                 flex items-center justify-center z-10 shadow-lg shadow-blue-500/50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    >
      <span className={`text-2xl font-bold text-white ${anta.className}`}>EVENTS</span>
    </div>

    {/* Orbiting events */}
    {events.map((event, index) => {
      const orbitSize = 150 + (index * 100);
      const orbitDuration = 20 + (index * 5);
      const eventPosition = (360 / events.length) * index;

      return (
        <div key={event.id}>
          <div 
            className="orbit absolute border border-blue-500/10 rounded-full"
            style={{
              width: `${orbitSize}px`,
              height: `${orbitSize}px`,
              left: `calc(50% - ${orbitSize/2}px)`,
              top: `calc(50% - ${orbitSize/2}px)`,
              animationDuration: `${orbitDuration}s`
            }}
          />

          <motion.div
            className="event-planet absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${eventPosition}deg) translateY(-${orbitSize/2}px)`
            }}
            whileHover={{
              scale: 1.2,
              filter: 'brightness(1.2)'
            }}
            onClick={() => setSelectedEvent(event)}
          >
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center transform -rotate-[var(--rotation)]"
              style={{
                background: `linear-gradient(45deg, ${event.color}, ${event.color}90)`,
                boxShadow: `0 0 15px ${event.color}50`,
                '--rotation': `${eventPosition}deg`
              }}
            >
              <span className="text-white font-bold">{event.id}</span>
            </div>

            <motion.div
              className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full 
                         bg-gradient-to-r from-blue-900/90 to-purple-900/90 backdrop-blur-md
                         p-3 rounded-lg border border-blue-500/30 w-48 pointer-events-none
                         opacity-0 transform -rotate-[var(--rotation)]"
              initial={{ opacity: 0, y: 10 }}
              whileHover={{ opacity: 1, y: -5 }}
              style={{
                '--rotation': `${eventPosition}deg`
              }}
            >
              <p className="text-sm font-semibold text-blue-300">{event.title}</p>
              <p className="text-xs text-blue-400/80">{event.description.substring(0, 50)}...</p>
            </motion.div>
          </motion.div>
        </div>
      );
    })}
  </div>

  {/* Event details popup */}
  <AnimatePresence>
    {selectedEvent && (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
        onClick={() => setSelectedEvent(null)}
      >
        <div 
          className="bg-gradient-to-br from-blue-900/95 to-purple-900/95 p-6 rounded-xl
                     backdrop-blur-md border border-blue-500/30 max-w-md w-full mx-4"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-4">
            <div 
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ background: `${selectedEvent.color}30` }}
            >
              <span className="text-2xl">{selectedEvent.id}</span>
            </div>
            <h3 className="text-xl font-bold text-blue-300">{selectedEvent.title}</h3>
          </div>
          <p className="text-blue-100/80 mb-6">{selectedEvent.description}</p>
          <div className="flex justify-end gap-3">
            <button
              className="px-4 py-2 bg-blue-600/30 hover:bg-blue-600/50 rounded-lg
                         text-blue-300 transition-colors"
              onClick={() => setSelectedEvent(null)}
            >
              Close
            </button>
            <button
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600
                         hover:from-blue-700 hover:to-purple-700 rounded-lg text-white"
              onClick={() => {/* Registration logic */}}
            >
              Register
            </button>
          </div>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</div>
      </main>

      {/* FAQ Section */}
      <div className="relative z-10 px-6 py-16 bg-gradient-to-b from-transparent to-blue-900/20">
        <h2 className={`text-4xl text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}>
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-4xl mx-auto grid gap-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl p-6 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 transition-all"
            >
              <h3 className="text-xl font-semibold text-blue-300 mb-3 group-hover:text-blue-200">
                {faq.question}
              </h3>
              <p className="text-blue-100/70 group-hover:text-blue-100/90 transition-colors">
                {faq.answer}
              </p>
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-blue-400/50 group-hover:animate-ping"></div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer className="relative z-10 py-8 mt-20 border-t border-blue-900/30 text-center text-blue-300/70">
        <p>TECHXPERIA © {new Date().getFullYear()} | Where Technology Meets Imagination</p>
      </footer>

      {/* CSS for electrical elements */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-10px) rotate(5deg); }
          75% { transform: translateY(10px) rotate(-5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.8; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.05); }
        }
        
        @keyframes pulse-slower {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.7; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s infinite;
        }
        
        .animate-pulse-slower {
          animation: pulse-slower 8s infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 3s infinite;
        }
        
        .circuit-lines {
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(90deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px),
            linear-gradient(0deg, rgba(56, 189, 248, 0.07) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        
        .electron {
          position: absolute;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #4fd1c5;
          box-shadow: 0 0 10px 2px rgba(79, 209, 197, 0.7);
        }

        .font-orbitron {
          font-family: 'Orbitron', sans-serif;
        }

        .solar-system {
          position: relative;
          width: 100%;
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .orbit {
          position: absolute;
          animation: rotate linear infinite;
        }

        .event-planet {
          transform-origin: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
    
  );
}
