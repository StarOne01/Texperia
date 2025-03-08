"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Head from "next/head";
import { Anta } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import { supabase } from "./utils/supabaseClient";
import Link from "next/link";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin, MotionPathPlugin);
}

const anta = Anta({
  weight: "400",
  subsets: ["latin"],
});

const events = [
  {
    id: 1,
    title: "Paper Presentation",
    description:
      "Present your research papers and innovative ideas to experts in the field.",
    icon: "/icons/paper.svg",
    color: "#4fd1c5",
  },
  {
    id: 2,
    title: "Technical Quiz",
    description:
      "Test your technical knowledge in this fast-paced, challenging quiz competition.",
    icon: "/icons/quiz.svg",
    color: "#38b2ac",
  },
  {
    id: 3,
    title: "Hackathon",
    description:
      "48 hours of coding, innovation, and problem-solving. Build solutions that matter.",
    icon: "/icons/code.svg",
    color: "#319795",
  },
  {
    id: 4,
    title: "Project Presentation",
    description:
      "Showcase your engineering projects and get feedback from industry experts.",
    icon: "/icons/project.svg",
    color: "#2c7a7b",
  },
  {
    id: 5,
    title: "Rapid Prototype Challenge",
    description:
      "Design, build and demonstrate a working prototype within a limited timeframe.",
    icon: "/icons/prototype.svg",
    color: "#285e61",
  },
  {
    id: 6,
    title: "Poster Presentation",
    description:
      "Visualize your ideas through creative posters and win exciting prizes.",
    icon: "/icons/poster.svg",
    color: "#234e52",
  },
  {
    id: 7,
    title: "Circuit Debugging",
    description:
      "Find and fix errors in complex electrical circuits against the clock.",
    icon: "/icons/circuit.svg",
    color: "#805ad5",
  },
  {
    id: 8,
    title: "Sketch Your Creativity",
    description:
      "Express your technical concepts through artistic sketches and diagrams.",
    icon: "/icons/sketch.svg",
    color: "#6b46c1",
  },
  {
    id: 9,
    title: "CEO Talk",
    description:
      "Hear industry leaders share insights on technology trends and career paths.",
    icon: "/icons/talk.svg",
    color: "#553c9a",
  },
  {
    id: 10,
    title: "Workshop",
    description:
      "Hands-on sessions on cutting-edge technologies and engineering practices.",
    icon: "/icons/workshop.svg",
    color: "#44337a",
  },
  {
    id: 11,
    title: "Electrical Safety Mime",
    description:
      "Creative performances highlighting the importance of electrical safety.",
    icon: "/icons/safety.svg",
    color: "#3c366b",
  },
];

// Add this function at the top level
const generateElectronPositions = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    // Use seeded random numbers or fixed positions
    left: `${(i * 13) % 100}%`,
    top: `${(i * 17) % 100}%`,
  }));
};

// Add this constant at the top level
const ELECTRON_POSITIONS = generateElectronPositions(30);

// Add this constant at the top level with your other constants
const faqs = [
  {
    question: "What is Texperia?",
    answer:
      "Texperia is a national-level technical symposium that brings together brilliant minds to showcase their technical prowess through various events and competitions.",
  },
  {
    question: "Who can participate?",
    answer:
      "Students from any recognized educational institution can participate. Both undergraduate and postgraduate students are welcome.",
  },
  {
    question: "Is there a registration fee?",
    answer:
      "Yes, there is a nominal registration fee that varies by event. Early bird registrations get special discounts.",
  },
  {
    question: "Can I participate in multiple events?",
    answer:
      "Yes, you can participate in multiple events as long as there are no schedule conflicts.",
  },
  {
    question: "How do I form a team?",
    answer:
      "You can either register with your own team or request to join other participants. Team size requirements vary by event.",
  },
  {
    question: "What are the accommodation arrangements?",
    answer:
      "We provide accommodation facilities for outstation participants at nominal charges. Book early to ensure availability.",
  },
];

export default function Home() {
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(
    null
  );
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const headerRef = useRef(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const circuitRef = useRef<SVGSVGElement>(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const electronRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Function to handle mouse move for interactive elements
  const handleMouseMove = (e: any) => {
    const { clientX, clientY } = e;
    const x = clientX / window.innerWidth - 0.5;
    const y = clientY / window.innerHeight - 0.5;

    if (headerRef.current) {
      gsap.to(headerRef.current, {
        duration: 1.5,
        backgroundPositionX: `${x * 20}px`,
        backgroundPositionY: `${y * 20}px`,
        ease: "power2.out",
      });
    }

    // Move electrons toward mouse position
    electronRefs.current.forEach((electron) => {
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
            ease: "power2.out",
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
      ease: "power4.out",
    }).from(
      subtitleRef.current,
      {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: "power3.out",
      },
      "-=0.5"
    );

    // Circuit paths animation
    if (circuitRef.current) {
      const paths = circuitRef.current.querySelectorAll(".circuit-path");
      gsap.set(paths, { strokeDasharray: "100%", strokeDashoffset: "100%" });
      gsap.to(paths, {
        duration: 3,
        strokeDashoffset: 0,
        ease: "power3.inOut",
        stagger: 0.2,
      });
    }

    // Animate event cards when they appear in viewport
    if (eventsRef.current) {
      const eventCards = eventsRef.current.querySelectorAll(".event-box");
      ScrollTrigger.batch(eventCards, {
        start: "top bottom-=100px",
        onEnter: (batch) => {
          gsap.to(batch, {
            duration: 0.8,
            opacity: 1,
            y: 0,
            stagger: 0.15,
            ease: "power2.out",
          });
        },
        onLeaveBack: (batch) => {
          gsap.to(batch, {
            duration: 0.6,
            opacity: 0,
            y: 30,
            stagger: 0.1,
          });
        },
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
          delay: index * 0.1,
        });
      }
    });

    // Clean up
    return () => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      }
    };
  }, []);

  useEffect(() => {
    const targetDate = new Date("2025-03-19T09:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        ),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    // Auth state check
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      clearInterval(timer);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div
      className="relative min-h-screen bg-black text-white overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      <nav className="fixed top-0 w-full z-50 px-6 py-4 backdrop-blur-md bg-black/40 border-b border-blue-500/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className={`text-xl font-bold text-blue-300 ${anta.className}`}>
              TEXPERIA
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-blue-200 hover:text-blue-300 transition-colors"
            >
              Home
            </a>
            <a
              href="#events"
              className="text-blue-200 hover:text-blue-300 transition-colors"
            >
              Events
            </a>
            <a
              href="#about"
              className="text-blue-200 hover:text-blue-300 transition-colors"
            >
              About
            </a>
            <a
              href="#faq"
              className="text-blue-200 hover:text-blue-300 transition-colors"
            >
              FAQ
            </a>

            {/* Auth Button */}
            {user ? (
              <a
                href="/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white"
              >
                Dashboard
              </a>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2 text-blue-200 hover:text-blue-100 transition-colors"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white"
                >
                  Register
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button 
              className="text-blue-300 hover:text-blue-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="lg:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-blue-500/20 py-4"
            >
              <div className="flex flex-col space-y-3 px-6">
                {["Home", "Events", "About", "Timeline", "FAQ"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-blue-200 hover:text-blue-300 transition-colors py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                
                <div className="pt-2 border-t border-blue-500/20 mt-2">
                  {user ? (
                    <Link
                      href="/dashboard"
                      className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-center rounded-lg text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Link
                        href="/login"
                        className="block w-full py-3 px-4 border border-blue-500/30 text-center rounded-lg text-blue-300"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/register"
                        className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-center rounded-lg text-white"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
      </nav>

      {/* Add padding to the header to account for the fixed navbar */}
      <div className="h-16"></div>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        />
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
          <path
            className="circuit-path"
            d="M0,100 Q50,50 100,100 T200,100"
            stroke="#4fd1c5"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          <path
            className="circuit-path"
            d="M50,0 Q100,50 150,0"
            stroke="#805ad5"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
          <path
            className="circuit-path"
            d="M200,50 Q150,100 100,50 T0,50"
            stroke="#4fd1c5"
            strokeWidth="2"
            fill="none"
            filter="url(#glow)"
          />
        </svg>
        <div className="circuit-lines"></div>
        {ELECTRON_POSITIONS.map((position) => (
          <div
            key={position.id}
            className="electron"
            ref={(el) => {
              electronRefs.current[position.id] = el;
            }}
            style={{
              left: position.left,
              top: position.top,
            }}
          />
        ))}
      </div>
      

      <main className="z-10 mx-auto">
        {/* Remove the fixed video container from here */}

        <header
          ref={headerRef}
          className="text-center flex justify-center items-center flex-col min-h-screen mb-20 relative z-10 overflow-hidden"
        >
          {/* Add the video background inside the header */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute z-0 w-full h-full object-cover opacity-60"
            >
              <source src="/bg.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="absolute z-0 inset-0 bg-gradient-to-b from-black/50 to-black/70"></div>
          </div>

          <div className="absolute z-0">
            {/* Animated circuit board patterns */}
            <div className="absolute w-40 h-40 border border-blue-500/30 rounded-full top-1/4 left-1/4 animate-pulse-slow"></div>
            <div className="absolute w-60 h-60 border border-purple-500/20 rounded-full bottom-1/4 right-1/4 animate-pulse-slower"></div>
            <div className="absolute top-1/3 right-1/3 w-20 h-1 bg-gradient-to-r from-blue-500/0 via-blue-500/50 to-blue-500/0 animate-pulse-fast"></div>
            <div className="absolute bottom-1/3 left-1/3 w-1 h-20 bg-gradient-to-b from-purple-500/0 via-purple-500/50 to-purple-500/0 animate-pulse-fast"></div>
          </div>

          <h1
            ref={titleRef}
            className={`text-5xl md:text-9xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider relative`}
          >
            TEXPERIA
            <span className="absolute p-2 -inset-0.5 bg-blue-500/10 blur-xl opacity-30"></span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-2xl text-blue-300 max-w-2xl mx-auto px-4 relative"
          >
            Unleash your technical prowess in our electrifying celebration of
            innovation and technology
            <span className="block h-1 w-20 mx-auto mt-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded"></span>
          </p>

          {/* Add countdown timer here */}
          <div className="mt-8 mb-6">
            <div className="grid grid-cols-4 gap-3 max-w-md mx-auto backdrop-blur-sm bg-black/20 rounded-xl p-4">
              <div className="bg-blue-900/50 border border-blue-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-300">
                  {timeLeft.days}
                </div>
                <div className="text-blue-400 text-xs">Days</div>
              </div>
              <div className="bg-blue-900/50 border border-blue-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-300">
                  {timeLeft.hours}
                </div>
                <div className="text-blue-400 text-xs">Hours</div>
              </div>
              <div className="bg-blue-900/50 border border-blue-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-300">
                  {timeLeft.minutes}
                </div>
                <div className="text-blue-400 text-xs">Minutes</div>
              </div>
              <div className="bg-blue-900/50 border border-blue-500/30 rounded-lg p-3 text-center">
                <div className="text-2xl md:text-3xl font-bold text-blue-300">
                  {timeLeft.seconds}
                </div>
                <div className="text-blue-400 text-xs">Seconds</div>
              </div>
            </div>
          </div>

          {/* Replace your existing buttons with these */}
          <div className="md:mt-6 flex gap-4">
            {user ? (
              <a
                href="/dashboard"
                className="md:px-8 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <span>Dashboard</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </a>
            ) : (
              <a
                href="/register"
                className="md:px-8 px-6 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 rounded-full text-white font-bold transition-all shadow-lg shadow-blue-500/20 hover:shadow-purple-500/40 transform hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  <span>Register</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </a>
            )}

            <button onClick={()=> window.location.href='#events'} className="px-8 py-4 bg-transparent border-2 border-blue-500/30 hover:border-purple-500/50 rounded-full text-blue-300 hover:text-purple-300 font-bold transition-all transform hover:scale-105 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <span>Explore Events</span>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center text-xl"
                        style={{ background: `${selectedEvent.color}50` }}
                      >
                        {selectedEvent.id}
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-blue-300">
                      {selectedEvent.title}
                    </h2>
                  </div>
                  <p className="text-xl text-blue-100/90">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
                  {/* Event Details */}
                  <div className="space-y-6">
                    <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/20">
                      <h3 className="text-xl font-semibold mb-4 text-blue-200">
                        Event Details
                      </h3>
                      <ul className="space-y-3">
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
                            📅
                          </span>
                          <span>March 15-16, 2025</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
                            🏆
                          </span>
                          <span>Prizes worth ₹50,000</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
                            👥
                          </span>
                          <span>Team size: 2-4 members</span>
                        </li>
                        <li className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-500/20">
                            ⏰
                          </span>
                          <span>Duration: 6 hours</span>
                        </li>
                      </ul>
                    </div>

                    {/* Rules Section */}
                    <div className="bg-purple-900/30 p-6 rounded-xl border border-purple-500/20">
                      <h3 className="text-xl font-semibold mb-4 text-purple-200">
                        Rules
                      </h3>
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
                      <h3 className="text-xl font-semibold mb-4 text-cyan-200">
                        Timeline
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400"></div>
                          <div>
                            <p className="font-semibold text-cyan-300">
                              Registration Deadline
                            </p>
                            <p className="text-cyan-100/70">March 10, 2025</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 mt-2 rounded-full bg-cyan-400"></div>
                          <div>
                            <p className="font-semibold text-cyan-300">
                              Event Start
                            </p>
                            <p className="text-cyan-100/70">
                              March 15, 9:00 AM
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Requirements Section */}
                    <div className="bg-blue-900/30 p-6 rounded-xl border border-blue-500/20">
                      <h3 className="text-xl font-semibold mb-4 text-blue-200">
                        Requirements
                      </h3>
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
                    onClick={() => {
                      /* Registration logic */
                    }}
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
        <div
          ref={eventsRef}
          className="grid p-16 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {events.map((event, index) => (
            <div
              key={event.id}
              className="event-box opacity-0 translate-y-10 relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 cursor-pointer backdrop-blur-sm border border-blue-500/20 overflow-hidden group"
              onClick={() => setSelectedEvent(event)}
              style={{ "--delay": `${index * 0.1}s` } as React.CSSProperties}
            >
              <div
                className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${event.color}20, transparent 70%)`,
                }}
              ></div>

              {/* Event content */}
              <div id="events" className="relative z-10">
                <div
                  className="w-16 h-16 mb-4 rounded-lg flex items-center justify-center"
                  style={{ background: `${event.color}30` }}
                >
                  {/* Replace with your actual icons */}
                  <div
                    className="w-10 h-10 rounded flex items-center justify-center text-xl"
                    style={{ background: `${event.color}50` }}
                  >
                    {event.id}
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 text-blue-300">
                  {event.title}
                </h3>
                <div
                  className="h-1 w-10 rounded mb-3 transition-all duration-300 group-hover:w-3/4"
                  style={{
                    background: `linear-gradient(to right, ${event.color}, #805ad5)`,
                  }}
                ></div>
                <p className="text-blue-100/70 text-sm mb-3">
                  {event.description.substring(0, 60)}...
                </p>
                <p className="text-blue-400 text-sm font-semibold mt-4 group-hover:text-blue-300 transition-colors">
                  Click to explore →
                </p>
              </div>

              {/* Interactive animation elements */}
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-blue-400/50 group-hover:animate-ping"></div>
              <div
                className="absolute top-2 left-2 w-2 h-2 rounded-full bg-purple-400/50 group-hover:animate-ping"
                style={{ animationDelay: "0.5s" }}
              ></div>
            </div>
          ))}
        </div>

        {/* About Section - Add after the Events section */}
        <section id="about" className="relative z-10 px-6 py-20 bg-gradient-to-b from-blue-900/10 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2
              className={`text-4xl text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}
            >
              About Texperia
            </h2>

            <div className="grid md:grid-cols-2 gap-10 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur-xl opacity-30"></div>
                <div className="relative bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl p-6 border border-blue-500/30 backdrop-blur-md">
                  <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                    Texperia is a national-level technical symposium that brings
                    together brilliant minds from across the country to showcase
                    innovation, technical prowess, and creative solutions to
                    real-world problems.
                  </p>
                  <p className="text-lg text-blue-100 mb-6 leading-relaxed">
                    First launched in 2018, our symposium has grown to become
                    one of the most anticipated technical festivals in the
                    region, attracting over 5,000 participants annually from
                    more than 200 educational institutions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-300 mb-2">
                        5000+
                      </div>
                      <div className="text-blue-200">Participants</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-300 mb-2">
                        200+
                      </div>
                      <div className="text-blue-200">Institutions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-300 mb-2">
                        30+
                      </div>
                      <div className="text-purple-200">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-purple-300 mb-2">
                        ₹5L+
                      </div>
                      <div className="text-purple-200">Prize Pool</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="relative aspect-video"
              >
                {/* Replace with your own teaser video */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl blur-xl opacity-30"></div>
                <div className="relative h-full w-full rounded-xl overflow-hidden border border-purple-500/30">
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                      <svg
                        className="w-10 h-10 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* FAQ Section */}
      <div id="faq" className="relative z-10 px-6 py-16 bg-gradient-to-b from-transparent to-blue-900/20">
        <h2
          className={`text-4xl text-center md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}
        >
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

      {/* Update the footer with coordinator contacts */}
      <footer className="relative z-10 py-16 border-t border-blue-900/30 bg-gradient-to-b from-transparent to-blue-950/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
            <div>
              <h3
                className={`text-2xl font-bold mb-4 text-blue-300 ${anta.className}`}
              >
                TEXPERIA
              </h3>
              <p className="text-blue-200/70 mb-6">
                Where technology meets imagination. Join us for an electrifying
                celebration of innovation and engineering excellence.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📘</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📸</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>📺</span>
                </a>
                <a
                  href="#"
                  className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center hover:bg-blue-800/70 transition-colors"
                >
                  <span>🐦</span>
                </a>
              </div>
            </div>

            <div></div>

            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-300">
                Contact Coordinators
              </h3>
              <ul className="space-y-2">
                <li>
                  <p className="text-blue-200/70">Abishek</p>
                  <p className="text-blue-200/50 text-sm">+91 90038 94744</p>
                  <p className="text-blue-200/50 text-sm">@snsct.org</p>
                </li>
                <li>
                  <p className="text-blue-200/70">Jane Smith</p>
                  <p className="text-blue-200/50 text-sm">+1 987 654 321</p>
                  <p className="text-blue-200/50 text-sm">
                    jane.smith@example.com
                  </p>
                </li>
              </ul>
            </div>
          </div>

          <p className="text-center text-blue-300/70">
            TECHXPERIA © {new Date().getFullYear()} | Where Technology Meets
            Imagination
          </p>
        </div>
      </footer>

      {/* CSS for electrical elements */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
          }
          75% {
            transform: translateY(10px) rotate(-5deg);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(1.05);
          }
        }

        @keyframes pulse-slower {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.3;
            transform: scale(1.1);
          }
        }

        @keyframes pulse-fast {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 0.7;
          }
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
          background: linear-gradient(
              90deg,
              rgba(56, 189, 248, 0.07) 1px,
              transparent 1px
            ),
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
          font-family: "Orbitron", sans-serif;
        }
      `}</style>
    </div>
  );
}
