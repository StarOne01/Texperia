"use client";

import { useEffect, useState, useMemo } from "react";
import { Anta } from "next/font/google";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Event data
const events = [
  {
    id: 1,
    title: "Paper Presentation",
    description:
      "Present your research papers and innovative ideas to experts in the field. Showcase your technical knowledge and research skills through well-structured presentations.",
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
      "Judgement based on innovation, clarity, and technical depth",
    ],
    coordinators: [
      { name: "Mr. James", phone: "+917598813368" },
      { name: "Ms. Keerthana", phone: "+916369306410" },
    ],
  },
  {
    id: 2,
    title: "Technical Quiz",
    description:
      "Test your technical knowledge in this fast-paced, challenging quiz competition. Cover topics from electronics, programming, mathematics, and general engineering principles.",
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
      "Judge's decision is final",
    ],
    coordinators: [{ name: "Prof. Akash Verma", phone: "akash@texperia.org" }],
  },
  {
    id: 3,
    title: "Hackathon",
    description:
      "48 hours of coding, innovation, and problem-solving. Build solutions that matter in this intensive development marathon focused on real-world challenges.",
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
      "Solutions evaluated on innovation, technical complexity, and practicality",
    ],
    coordinators: [{ name: "Rahul Sharma", phone: "rahul@texperia.org" }],
  },
  {
    id: 4,
    title: "Project Presentation",
    description:
      "Showcase your engineering projects and get feedback from industry experts. Present working prototypes or detailed models of your innovative engineering solutions.",
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
      "Judging based on innovation, execution, and potential impact",
    ],
    coordinators: [{ name: "Sneha Patel", phone: "sneha@texperia.org" }],
  },
  {
    id: 5,
    title: "Rapid Prototype Challenge",
    description:
      "Design, build and demonstrate a working prototype within a limited timeframe. Test your quick thinking and hands-on skills in this exciting time-bound challenge.",
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
      "Judging based on functionality, design, and innovation",
    ],
    coordinators: [{ name: "Arjun Mehta", phone: "arjun@texperia.org" }],
  },
  {
    id: 6,
    title: "Poster Presentation",
    description:
      "Visualize your ideas through creative posters and win exciting prizes. Present complex technical concepts through effective visual communication.",
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
      "Judging based on content clarity, visual appeal, and technical depth",
    ],
    coordinators: [{ name: "Meera Kapoor", phone: "meera@texperia.org" }],
  },
  {
    id: 7,
    title: "Circuit Debugging",
    description:
      "Find and fix errors in complex electrical circuits against the clock. Test your troubleshooting skills and theoretical knowledge in this practical challenge.",
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
      "Judging based on accuracy and time taken",
    ],
    coordinators: [{ name: "Dr. Vijay Kumar", phone: "vijay@texperia.org" }],
  },
  {
    id: 8,
    title: "Sketch Your Creativity",
    description:
      "Express your technical concepts through artistic sketches and diagrams. Blend art with engineering in this unique competition focusing on technical illustration.",
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
      "Judging based on creativity, technical accuracy, and execution",
    ],
    coordinators: [{ name: "Neha Sharma", phone: "neha@texperia.org" }],
  },
  {
    id: 9,
    title: "CEO Talk",
    description:
      "Hear industry leaders share insights on technology trends and career paths. Engage with top executives and gain valuable perspective on the future of engineering and technology.",
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
      "Recording permitted only with prior permission",
    ],
    coordinators: [{ name: "Amit Singh", phone: "amit@texperia.org" }],
  },
  {
    id: 10,
    title: "Workshop",
    description:
      "Hands-on sessions on cutting-edge technologies and engineering practices. Learn practical skills from industry experts in specialized areas of technology.",
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
      "Prior knowledge requirements vary by workshop",
    ],
    coordinators: [{ name: "Divya Reddy", phone: "divya@texperia.org" }],
  },
  {
    id: 11,
    title: "Electrical Safety Mime",
    description:
      "Creative performances highlighting the importance of electrical safety. Communicate important safety concepts through the art of mime and non-verbal expression.",
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
      "Judging based on clarity of message, creativity, and execution",
    ],
    coordinators: [{ name: "Pradeep Nair", phone: "pradeep@texperia.org" }],
  },
];

const anta = Anta({
  weight: "400",
  subsets: ["latin"],
});

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [registeredEvents, setRegisteredEvents] = useState<any[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("events");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  // Generate fixed random positions for circuit nodes (solves hydration error)
  const circuitNodes = useMemo(() => {
    return Array.from({ length: 12 }, () => ({
      top: 15 + Math.random() * 70,
      left: 15 + Math.random() * 70,
      animationDelay: Math.random() * 2,
      animationDuration: 3 + Math.random() * 2,
    }));
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        router.push("/login");
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
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (data) setProfile(data);
  };

  const fetchRegisteredEvents = async (userId: string) => {
    const { data, error } = await supabase
      .from("event_registrations")
      .select("event_ids, payment_status")
      .eq("user_id", userId);

    if (data) {
      setRegisteredEvents(data[0].event_ids || []);
      setPaymentStatus(data[0].payment_status || []);
    }

    console.log(data);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        {/* Tech circuit background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute h-[200%] w-px bg-blue-500/50 left-1/4 animate-tech-line-1"></div>
          <div className="absolute h-[200%] w-px bg-purple-500/50 left-1/3 animate-tech-line-2"></div>
          <div className="absolute h-[200%] w-px bg-blue-500/50 left-2/3 animate-tech-line-3"></div>
          <div className="absolute w-[200%] h-px bg-blue-500/50 top-1/4 animate-tech-line-4"></div>
          <div className="absolute w-[200%] h-px bg-purple-500/50 top-2/3 animate-tech-line-5"></div>

          {/* Circuit nodes with pre-generated random values */}
          {circuitNodes.map((node, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-blue-400/80 animate-pulse-random"
              style={{
                top: `${node.top}%`,
                left: `${node.left}%`,
                animationDelay: `${node.animationDelay}s`,
                animationDuration: `${node.animationDuration}s`,
              }}
            ></div>
          ))}
        </div>

        {/* Center glowing element */}
        <div className="relative flex flex-col items-center">
          {/* Outer rings */}
          <div className="absolute w-40 h-40 rounded-full border border-blue-500/30 animate-spin-slow"></div>
          <div className="absolute w-48 h-48 rounded-full border border-purple-500/20 animate-reverse-spin"></div>
          <div className="absolute w-56 h-56 rounded-full border border-blue-500/10 animate-spin-slower"></div>

          {/* Glowing core */}
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-md"></div>
            <div className="absolute inset-2 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full animate-pulse"></div>
            <div className="absolute inset-4 bg-gradient-to-br from-blue-400/40 to-purple-400/40 rounded-full blur-sm"></div>

            {/* Logo */}
            <h1
              className={`relative text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300 ${anta.className}`}
            >
              TEX
            </h1>
          </div>

          {/* Text */}
          <div className="mt-16 text-center">
            <div
              className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 ${anta.className} tracking-wider`}
            >
              TEXPERIA
            </div>
            <div className="mt-3 text-blue-300 flex items-center gap-2">
              <span>Loading</span>
              <span className="inline-block w-1 h-1 bg-blue-300 rounded-full animate-pulse"></span>
              <span className="inline-block w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-100"></span>
              <span className="inline-block w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-200"></span>
            </div>
          </div>
        </div>
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
            <h1 className={`text-xl font-bold text-blue-300 ${anta.className}`}>
              TEXPERIA
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
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
            <div className="text-blue-300 border-b border-blue-500/20 pb-2">
              Welcome, {profile?.name || user?.email}
            </div>
            <div className="flex flex-col gap-3 mb-2">
              <Link href="/" className="text-blue-300 hover:text-blue-200 py-2">
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

      <main className="max-w-6xl mx-auto px-4 py-10">
        <h1
          className={`text-4xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 ${anta.className} tracking-wider`}
        >
          Your Dashboard
        </h1>

        {/* Dashboard Tabs */}
        <div className="flex gap-4 mb-8 border-b border-blue-500/20 pb-4">
          <button
            onClick={() => setActiveTab("events")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "events"
                ? "bg-blue-900/50 text-blue-200"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            My Events
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "profile"
                ? "bg-blue-900/50 text-blue-200"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("teams")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === "teams"
                ? "bg-blue-900/50 text-blue-200"
                : "text-blue-400 hover:text-blue-300"
            }`}
          >
            Teams
          </button>
        </div>

        {/* Events Tab Content */}
        {activeTab === "events" && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-blue-300">
                Registered Events
              </h2>
              <Link
                href="/events"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white font-medium"
              >
                Browse More Events
              </Link>
              {paymentStatus === "complete" ? (
                <button
                  className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-medium"
                  disabled
                >
                  Payment Complete
                </button>
              ) : (
                <button
                  className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-lg font-medium"
                  disabled
                >
                  Payment Pending
                </button>
              )
              }
            </div>

            {registeredEvents.length === 0 ? (
              <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 text-center">
                <div className="text-5xl mb-4">🎯</div>
                <h3 className="text-xl font-semibold text-blue-300 mb-2">
                  No Events Registered
                </h3>
                <p className="text-blue-200 mb-6">
                  You haven't registered for any events yet.
                </p>
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
                    key={registration.event_id}
                    className="group bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 bg-green-500/20 text-green-300 px-3 py-1 text-xs font-medium rounded-bl-lg">
                      Registered
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-blue-300">
                      {events[registration - 1].title}
                    </h3>
                    <div
                      className="h-1 w-10 rounded mb-3 transition-all duration-300 group-hover:w-3/4"
                      style={{
                        background: `linear-gradient(to right, ${
                          events[registration - 1].color || "#4fd1c5"
                        }, #805ad5)`,
                      }}
                    ></div>
                    <p className="text-blue-100/70 text-sm mb-4">
                      {events[registration - 1].description?.substring(0, 100)}
                      ...
                    </p>

                    <div className="mt-4 pt-4 border-t border-blue-500/20">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-blue-300">
                          <span className="font-medium">Status:</span>{" "}
                          {registration.status || "Confirmed"}
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
              <h2 className="text-2xl font-semibold text-blue-300 mb-6">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-400">March 15, 2025</div>
                    <div className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs font-medium rounded-lg">
                      Day 1
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">
                    Opening Ceremony
                  </h3>
                  <p className="text-blue-200/70 text-sm mt-2">
                    Join us for the grand opening of Texperia 2025 featuring
                    keynote speakers and special performances.
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-400">March 16, 2025</div>
                    <div className="bg-purple-500/20 text-purple-300 px-2 py-1 text-xs font-medium rounded-lg">
                      Day 2
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-blue-300">
                    Closing Ceremony & Awards
                  </h3>
                  <p className="text-blue-200/70 text-sm mt-2">
                    The final event of Texperia 2025 with prize distribution and
                    closing remarks.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Profile Tab Content */}
        {activeTab === "profile" && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">
              Your Profile
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    Email Address
                  </label>
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded p-3 text-blue-200">
                    {user?.email}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.name || ""}
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    College/Institution
                  </label>
                  <input
                    type="text"
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.college || ""}
                    placeholder="Enter your college name"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.phone || ""}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              <div>
                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    Department/Major
                  </label>
                  <input
                    type="text"
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.department || ""}
                    placeholder="Enter your department or major"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-blue-400 mb-2 text-sm">
                    Year of Study
                  </label>
                  <select
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white"
                    defaultValue={profile?.year || ""}
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
                  <label className="block text-blue-400 mb-2 text-sm">
                    Bio
                  </label>
                  <textarea
                    className="w-full bg-blue-900/30 border border-blue-500/30 rounded p-3 text-white h-32"
                    defaultValue={profile?.bio || ""}
                    placeholder="Tell us about yourself"
                  ></textarea>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-6 py-3 rounded-lg text-white font-medium">
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Teams Tab Content */}
        {activeTab === "teams" && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">
              Your Teams
            </h2>

            <div className="mb-8">
              <div className="bg-blue-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-blue-300">
                    Team Quantum
                  </h3>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-medium rounded-lg">
                    Active
                  </span>
                </div>
                <p className="text-blue-200/70 text-sm mb-4">
                  Participating in: Hackathon
                </p>

                <h4 className="text-blue-400 text-sm font-medium mb-2">
                  Members:
                </h4>
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
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Remove
                    </button>
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
                    <button className="text-red-400 hover:text-red-300 text-sm">
                      Remove
                    </button>
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
    </div>
  );
}
