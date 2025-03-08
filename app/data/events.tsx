import paper from "../../public/paper.png";

// Event data
const events = [
    {
      id: 1,
      title: "Paper Presentation",
      description: "Present your research papers and innovative ideas to experts in the field. Showcase your technical knowledge and research skills through well-structured presentations.",
      icon: paper,
      color: "#4fd1c5",
      date: "March 15, 2025",
      time: "10:00 AM - 2:00 PM",
      venue: "Main Auditorium",
      prizes: "₹10,000",
      teamSize: "1-2 members",
      category: "flagship",
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
      category: "flagship",
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

export default events;