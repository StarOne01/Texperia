"use client";

import { useEffect, useState, useMemo } from "react";
import { Anta } from "next/font/google";
import Link from "next/link";
import { supabase } from "../utils/supabaseClient";
import Image from "next/image";
import { useRouter } from "next/navigation";
import events from "../data/events";
import toast, { Toaster } from "react-hot-toast"; // Add this import
import { User } from "@supabase/supabase-js";
import { v4 as uuidv4 } from 'uuid';
import MemberDetailsModal from './components/MemberDetailsModal';

const anta = Anta({
  weight: "400",
  subsets: ["latin"],
});
// Add Team type definition
type TeamMember = {
  id: string;
  email: string;
  name?: string;
  role: 'leader' | 'member';
  department?: string;
  skills?: string[];
  phone?: string;
  position?: string;
  bio?: string;
  status?: 'active' | 'invited' | 'pending';
  joinedAt?: string;
};

type Team = {
  id: string;
  name: string;
  event_id: number;
  created_at: string;
  created_by: string;
  members: TeamMember[];
};
type MemberDetailsModalProps = {
  member: TeamMember | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedMember: TeamMember) => Promise<void>;
};
export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("events");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  // Add team state
  const [teams, setTeams] = useState<Team[]>([]);
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamEventId,  setNewTeamEventId] = useState<number | null>(null);
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const [loadingTeams, setLoadingTeams] = useState(false);

  // Add new state variables
  const [isEditingMember, setIsEditingMember] = useState(false);
  const [currentEditMember, setCurrentEditMember] = useState<TeamMember | null>(null);
  const [currentEditTeamId, setCurrentEditTeamId] = useState<string | null>(null);

  // Replace the random circuit nodes with deterministic values
  const circuitNodes = useMemo(() => {
    return [
      { top: 73.34, left: 46.93, animationDelay: 0.2, animationDuration: 3.92 },
      {
        top: 17.52,
        left: 42.49,
        animationDelay: 1.57,
        animationDuration: 3.81,
      },
      {
        top: 57.25,
        left: 28.34,
        animationDelay: 0.97,
        animationDuration: 4.46,
      },
      { top: 31.7, left: 18.09, animationDelay: 0.04, animationDuration: 3.75 },
      { top: 72.29, left: 40.78, animationDelay: 1.0, animationDuration: 3.73 },
      {
        top: 42.62,
        left: 32.98,
        animationDelay: 0.57,
        animationDuration: 3.53,
      },
      {
        top: 56.41,
        left: 49.69,
        animationDelay: 0.47,
        animationDuration: 4.56,
      },
      {
        top: 60.31,
        left: 22.91,
        animationDelay: 1.46,
        animationDuration: 4.93,
      },
      {
        top: 74.08,
        left: 61.88,
        animationDelay: 0.88,
        animationDuration: 4.08,
      },
      {
        top: 25.29,
        left: 15.74,
        animationDelay: 0.29,
        animationDuration: 3.91,
      },
      {
        top: 82.11,
        left: 84.44,
        animationDelay: 1.87,
        animationDuration: 4.05,
      },
      {
        top: 75.61,
        left: 46.38,
        animationDelay: 0.37,
        animationDuration: 4.24,
      },
    ];
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        toast.error("Session expired. Please log in again.");
        router.push("/login");
        return;
      }

      setUser(data.session.user);

      // Pass both the ID and the email to fetchRegisteredEvents
      await fetchRegisteredEvents(
        data.session.user.id,
        data.session.user.email
      );
      
      // Fetch teams when user is authenticated
      await fetchUserTeams(data.session.user.id);
      
      setLoading(false);
    };

    checkSession();
  }, [router]);

  const fetchRegisteredEvents = async (userId: string, userEmail?: string) => {
    // Use the email parameter instead of user.email
    const { data, error } = await supabase
      .from("event_registrations")
      .select("event_ids, payment_status")
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to load your data, please check your network");
      return;
    }

    if (data && data.length > 0) {
      console.log(data);
      setRegisteredEvents(data[0].event_ids || []);
      setPaymentStatus(data[0].payment_status || []);
      
      // Show appropriate toast based on payment status
      if (data[0].payment_status === "verified") {
        toast.success("Your payment has been verified!", { duration: 4000 });
      } else if (data[0].payment_status === "paid") {
        toast("Payment verification in progress", { 
          icon: "⏳",
          duration: 4000
        });
      } else if (data[0].payment_status === "failed") {
        toast.error("Payment verification failed. Please try again.", { duration: 4000 });
      }
    } else {
      // Create new entry if none exists
      const { data: newEntry, error: createError } = await supabase
        .from("event_registrations")
        .insert({
          user_id: userId,
          email: userEmail, // Use the passed email instead of user.email
          event_ids: [],
          status: "inactive",
          payment_status: "unpaid",
          created_at: new Date().toISOString(),
        })
        .select();

      if (createError) {
        toast.error("Failed to initialize your profile");
        return;
      }

      if (!createError) {
        setRegisteredEvents([]);
        setPaymentStatus("unpaid");
      }
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to log out");
      return;
    }
    toast.success("Successfully logged out");
    router.push("/");
  };

  // Add profile update handler
  const handleProfileUpdate = async () => {
    // Code to update profile in Supabase
    
    // Show loading toast during API call
    const toastId = toast.loading("Updating your profile...");
    
    // Simulate API delay (replace with real update code)
    setTimeout(() => {
      toast.success("Profile updated successfully!", {
        id: toastId,
      });
    }, 1000);
  };

  // Team management handlers
  const handleRemoveTeamMember = (memberName: string) => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Remove {memberName} from team?</span>
        <button 
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          onClick={() => {
            toast.dismiss(t.id);
            toast.success(`${memberName} removed from team`);
          }}
        >
          Confirm
        </button>
        <button 
          className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    ), { duration: 5000 });
  };

  const handleDeleteTeam = () => {
    toast((t) => (
      <div className="flex items-center gap-3">
        <span>Delete Team Quantum? This cannot be undone.</span>
        <button 
          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
          onClick={() => {
            toast.dismiss(t.id);
            toast.success("Team deleted successfully");
          }}
        >
          Delete
        </button>
        <button 
          className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
          onClick={() => toast.dismiss(t.id)}
        >
          Cancel
        </button>
      </div>
    ), { duration: 5000 });
  };

  const handleCreateTeam = () => {
    toast.success("New team created successfully!");
  };

  // Add function to fetch user teams
  const fetchUserTeams = async (userId: string) => {
    setLoadingTeams(true);
    
    try {
      // Get teams where the user is either creator or member
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .or(`created_by.eq.${userId},members.cs.{"email":"${user?.email}"}`)
        
      if (error) {
        toast.error("Failed to load your teams");
        console.error("Team fetch error:", error);
        return;
      }
      
      setTeams(data || []);
    } catch (err) {
      console.error("Error fetching teams:", err);
      toast.error("Something went wrong while loading your teams");
    } finally {
      setLoadingTeams(false);
    }
  };

  // Add function to create a team
  const createTeam = async () => {
    if (!user || !newTeamName || !newTeamEventId) {
      toast.error("Please provide a team name and select an event");
      return;
    }
    
    const toastId = toast.loading("Creating your team...");
    
    try {
      // Create team with leader as first team member
      const newTeam = {
        name: newTeamName,
        event_id: newTeamEventId,
        created_by: user.id,
        created_at: new Date().toISOString(),
        members: [{
          id: uuidv4(), // You'll need to import { v4 as uuidv4 } from 'uuid'
          email: user.email || '',
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'Team Leader',
          role: 'leader'
        }]
      };
      
      const { data, error } = await supabase
        .from('teams')
        .insert(newTeam)
        .select();
        
      if (error) {
        toast.error("Failed to create team", { id: toastId });
        console.error("Team creation error:", error);
        return;
      }
      
      // Update local state
      await fetchUserTeams(user.id);
      
      toast.success("Team created successfully!", { id: toastId });
      setIsCreatingTeam(false);
      setNewTeamName('');
      setNewTeamEventId(null);
    } catch (err) {
      console.error("Error creating team:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // Function to add a team member
  const addMember = async (teamId: string | undefined) => {
    if (!newMemberEmail || !teamId) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newMemberEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    setIsInviting(true);
    const toastId = toast.loading(`Adding ${newMemberEmail}...`);
    
    try {
      // 1. Get the current team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (teamError) {
        toast.error("Failed to find team", { id: toastId });
        setIsInviting(false);
        return;
      }
      
      // 2. Check if member already exists
      const isAlreadyMember = teamData.members.some(
        (member: TeamMember) => member.email === newMemberEmail
      );
      
      if (isAlreadyMember) {
        toast.error("This person is already in the team", { id: toastId });
        setIsInviting(false);
        return;
      }
      
      // 3. Add the new member to the members array with enhanced fields
      const updatedMembers = [
        ...teamData.members, 
        {
          id: uuidv4(),
          email: newMemberEmail,
          role: 'member',
          status: 'invited',
          joinedAt: new Date().toISOString()
        }
      ];
      
      // 4. Update the team record
      const { error: updateError } = await supabase
        .from('teams')
        .update({ members: updatedMembers })
        .eq('id', teamId);
        
      if (updateError) {
        toast.error("Failed to add team member", { id: toastId });
        setIsInviting(false);
        return;
      }
      
      // 5. Refresh teams data
      await fetchUserTeams(user!.id);
      
      toast.success(`${newMemberEmail} added to team`, { id: toastId });
      setNewMemberEmail(''); // Clear the input field
    } catch (err) {
      console.error("Error adding team member:", err);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsInviting(false);
    }
  };

  // Function to remove team member
  const removeTeamMember = async (teamId: string, memberEmail: string) => {
    const toastId = toast.loading(`Removing ${memberEmail}...`);
    
    try {
      // 1. Get the current team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();
        
      if (teamError) {
        toast.error("Failed to find team", { id: toastId });
        return;
      }
      
      // 2. Filter out the member to remove
      const updatedMembers = teamData.members.filter(
        (member: TeamMember) => member.email !== memberEmail
      );
      
      // 3. Update the team record
      const { error: updateError } = await supabase
        .from('teams')
        .update({ members: updatedMembers })
        .eq('id', teamId);
        
      if (updateError) {
        toast.error("Failed to remove team member", { id: toastId });
        return;
      }
      
      // 4. Refresh teams data
      await fetchUserTeams(user!.id);
      
      toast.success(`${memberEmail} removed from team`, { id: toastId });
    } catch (err) {
      console.error("Error removing team member:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // Function to delete team
  const deleteTeam = async (teamId: string) => {
    const toastId = toast.loading("Deleting team...");
    
    try {
      // Simple delete since all team info is in one row
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);
        
      if (error) {
        toast.error("Failed to delete team", { id: toastId });
        return;
      }
      
      // Update state
      setTeams(prevTeams => prevTeams.filter(team => team.id !== teamId));
      
      toast.success("Team deleted successfully", { id: toastId });
    } catch (err) {
      console.error("Error deleting team:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  // Function to update member details
  const updateMemberDetails = async (updatedMember: TeamMember) => {
    if (!currentEditTeamId) return;
    
    const toastId = toast.loading("Updating member details...");
    
    try {
      // 1. Get the current team
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', currentEditTeamId)
        .single();
        
      if (teamError) {
        toast.error("Failed to find team", { id: toastId });
        return;
      }
      
      // 2. Update the member in the members array
      const updatedMembers = teamData.members.map((member: TeamMember) => 
        member.id === updatedMember.id ? updatedMember : member
      );
      
      // 3. Update the team record
      const { error: updateError } = await supabase
        .from('teams')
        .update({ members: updatedMembers })
        .eq('id', currentEditTeamId);
        
      if (updateError) {
        toast.error("Failed to update member details", { id: toastId });
        return;
      }
      
      // 4. Refresh teams data
      await fetchUserTeams(user!.id);
      
      toast.success("Member details updated successfully", { id: toastId });
      setIsEditingMember(false);
      setCurrentEditMember(null);
      setCurrentEditTeamId(null);
    } catch (err) {
      console.error("Error updating member details:", err);
      toast.error("Something went wrong", { id: toastId });
    }
  };
  
  // Function to open member details modal
  const openMemberDetailsModal = (teamId: string, member: TeamMember) => {
    setCurrentEditTeamId(teamId);
    setCurrentEditMember(member);
    setIsEditingMember(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <Toaster
          position="top-right"
          toastOptions={{
            className: "backdrop-blur-md bg-blue-900/50 text-blue-200 border border-blue-500/30",
            duration: 3000,
          }}
        />
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-black text-white">
      {/* Toast Component */}
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

      {/* Animated Background Elements */}
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
            <div className="text-blue-300">
              Welcome, {user?.user_metadata.name || user?.email || "User"}
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
              Welcome, {user?.user_metadata?.name || user?.email || "User"}
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

              {paymentStatus === "verified" ? (
                <button
                  className="bg-green-500/20 text-green-300 px-4 py-2 rounded-lg font-medium"
                  disabled
                >
                  Payment Verified
                </button>
              ) : paymentStatus === "paid" ? (
                <button 
                  onClick={() => {
                    router.push("/payment");
                    toast("Checking payment status...", { icon: "⏳" });
                  }}
                  className="bg-yellow-500/20 text-blue-300 px-4 py-2 rounded-lg font-medium"
                >
                  Verifying Payment
                </button>
              ) : paymentStatus === "failed" ? (
                <button 
                  onClick={() => {
                    router.push("/payment");
                    toast.error("Sorry, we couldn't verify your payment. Please contact our co-ordinators.");
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Payment Verification Failed
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/payment");
                    toast("Redirecting to payment page...");
                  }}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white font-medium"
                >
                  Pay Now
                </button>
              )}
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
                    key={registration}
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
                          { "Confirmed"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8">
            <Link
              href="/events"
              className="bg-gradient-to-r mt-120 from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 px-4 py-2 rounded-lg text-white font-medium"
            >
              Browse More Events
            </Link>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-semibold text-blue-300 mb-6">
                Upcoming Events
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-6 border border-blue-500/30">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-blue-400">March 19, 2025</div>
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
                    <div className="text-sm text-blue-400">March 20, 2025</div>
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


        {/* Teams Tab Content */}
        {activeTab === "teams" && (
          <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-8 border border-blue-500/30 backdrop-blur-sm">
            <h2 className="text-2xl font-semibold text-blue-300 mb-6">
              Your Teams
            </h2>

            {loadingTeams ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="mb-8">
                {teams.length > 0 ? (
                  teams.map((team) => (
                    <div key={team.id} className="bg-blue-900/30 border border-blue-500/20 rounded-xl p-6 mb-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-blue-300">
                          {team.name}
                        </h3>
                        <span className="bg-green-500/20 text-green-300 px-3 py-1 text-xs font-medium rounded-lg">
                          Active
                        </span>
                      </div>
                      <p className="text-blue-200/70 text-sm mb-4">
                        Participating in: {events.find(e => e.id === team.event_id)?.title || 'Unknown Event'}
                      </p>

                      <h4 className="text-blue-400 text-sm font-medium mb-2">
                        Members:
                      </h4>
                      <div className="space-y-2 mb-4">
                        {team.members.map((member) => (
                          <div key={member.email} className="flex flex-col bg-blue-900/20 rounded-lg p-4 mb-2">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-300 font-medium">
                                  {member.name?.substring(0, 2).toUpperCase() || member.email.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-blue-200 font-medium">
                                    {member.name || member.email.split('@')[0]}
                                    {member.email === user?.email && " (You)"}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      member.role === 'leader' 
                                        ? 'bg-purple-500/20 text-purple-300' 
                                        : 'bg-blue-500/20 text-blue-300'
                                    }`}>
                                      {member.role}
                                    </span>
                                    {member.status && (
                                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        member.status === 'active' ? 'bg-green-500/20 text-green-300' : 
                                        member.status === 'invited' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-gray-500/20 text-gray-300'
                                      }`}>
                                        {member.status}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => openMemberDetailsModal(team.id, member)}
                                  className="text-blue-400 hover:text-blue-300 text-sm"
                                >
                                  Edit
                                </button>
                                
                                {member.role !== 'leader' && member.email !== user?.email && (
                                  <button 
                                    onClick={() => {
                                      toast((t) => (
                                        <div className="flex items-center gap-3">
                                          <span>Remove {member.name || member.email} from team?</span>
                                          <button 
                                            className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => {
                                              toast.dismiss(t.id);
                                              removeTeamMember(team.id, member.email);
                                            }}
                                          >
                                            Confirm
                                          </button>
                                          <button 
                                            className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                                            onClick={() => toast.dismiss(t.id)}
                                          >
                                            Cancel
                                          </button>
                                        </div>
                                      ), { duration: 5000 });
                                    }}
                                    className="text-red-400 hover:text-red-300 text-sm"
                                  >
                                    Remove
                                  </button>
                                )}
                              </div>
                            </div>
                            
                            {/* Additional member details */}
                            {(member.department || member.position || member.skills?.length) && (
                              <div className="pl-12 mt-1 space-y-1">
                                {member.department && member.position && (
                                  <div className="text-xs text-blue-300/80">
                                    {member.position} at {member.department}
                                  </div>
                                )}
                                
                                {member.department && !member.position && (
                                  <div className="text-xs text-blue-300/80">
                                    {member.department}
                                  </div>
                                )}
                                
                                {!member.department && member.position && (
                                  <div className="text-xs text-blue-300/80">
                                    {member.position}
                                  </div>
                                )}
                                
                                {member.skills && member.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {member.skills.map(skill => (
                                      <span key={skill} className="text-xs bg-blue-800/30 text-blue-300 px-2 py-0.5 rounded">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Invite member form */}
                      <div className="mt-4 pt-4 border-t border-blue-500/20">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <input
                            type="email"
                            placeholder="team.member@example.com"
                            className="flex-grow bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-sm text-blue-200 focus:outline-none focus:border-blue-400"
                            value={newMemberEmail}
                            onChange={(e) => setNewMemberEmail(e.target.value)}
                          />
                          <button 
                            onClick={() => addMember(team.id)} 
                            disabled={isInviting}
                            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900 disabled:opacity-50 px-4 py-2 rounded-lg text-white text-sm"
                          >
                            {isInviting ? "Adding..." : "Add Member"}
                          </button>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4 mt-6">
                        <button 
                          onClick={() => {
                            toast((t) => (
                              <div className="flex items-center gap-3">
                                <span>Delete {team.name}? This cannot be undone.</span>
                                <button 
                                  className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                  onClick={() => {
                                    toast.dismiss(t.id);
                                    deleteTeam(team.id);
                                  }}
                                >
                                  Delete
                                </button>
                                <button 
                                  className="bg-gray-500 text-white px-2 py-1 rounded text-xs"
                                  onClick={() => toast.dismiss(t.id)}
                                >
                                  Cancel
                                </button>
                              </div>
                            ), { duration: 5000 });
                          }}
                          className="border border-red-500/30 text-red-400 hover:bg-red-900/20 px-4 py-2 rounded-lg text-sm"
                        >
                          Delete Team
                        </button>
                      </div>
                    </div>
                    
                  ))
                ) : (
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 text-center">
                    <div className="text-5xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-blue-300 mb-2">
                      No Teams Yet
                    </h3>
                    <p className="text-blue-200 mb-6">
                      Create a team to participate in team events
                    </p>
                  </div>
                )}

                {isCreatingTeam ? (
                  <div className="bg-blue-900/30 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-4">Create New Team</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">Team Name</label>
                        <input 
                          type="text"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                          className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
                          placeholder="Enter team name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-blue-300 text-sm mb-2">Select Event</label>
                        <select
                          value={newTeamEventId || ''}
                          onChange={(e) => setNewTeamEventId(Number(e.target.value))}
                          className="w-full bg-blue-900/20 border border-blue-500/30 rounded-lg px-3 py-2 text-blue-200 focus:outline-none focus:border-blue-400"
                        >
                          <option className="bg-black">Select</option>
                          {events.filter(event => event.isTeamEvent).map(event => (
                            <option className="bg-black" key={event.id} value={event.id}>
                              {event.title}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex justify-end gap-3 mt-4">
                        <button
                          onClick={() => setIsCreatingTeam(false)}
                          className="border border-blue-500/30 text-blue-300 hover:bg-blue-900/20 px-4 py-2 rounded-lg text-sm"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={createTeam}
                          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-white text-sm"
                        >
                          Create Team
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsCreatingTeam(true)}
                    className="w-full border border-dashed border-blue-500/30 text-blue-400 hover:text-blue-300 hover:border-blue-500/50 p-4 rounded-xl"
                  >
                    + Create New Team
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
    {isEditingMember && (
      <MemberDetailsModal 
        member={currentEditMember} 
        isOpen={isEditingMember}
        onClose={() => {
          setIsEditingMember(false);
          setCurrentEditMember(null);
        }}
        onSave={updateMemberDetails}
      />
    )}
    </>
  );
}
