
const events = [
    {
      id: 1,
      title: "Ink Sight (Paper Presentation)",
      description: "Present your research papers and innovative ideas to experts in the field. Showcase your technical knowledge and research skills through well-structured presentations.",
      color: "#4fd1c5",
      email: "texperia2k25.inksight@gmail.com",
      isTeamEvent: true,
      date: "March 19, 2025",
      time: "09:15 AM - 2:30 PM",
      venue: "Power System Simulation Laboratory",
      prizes: "Attractive prizes will be given",
      teamSize: "2-4 members",
      category: "flagship",
      rules: [
        "Once the teams are selected team members have to pay the registration amount for the event to participate in the event",
        "On-spot registrations are not encouraged",
        "Presentation duration: 7 minutes",
        "Q&A session: 3 minutes",
        "Judgement based on innovation, clarity, and technical depth",
        "Judge's decision will be final"
      ],
      staffCoordinators: [
        { name: "Dr.R.Senthil Kumar ASP/EEE"}
      ],
      coordinators: [
        { name: "Mr. James.P", phone: "75988 13368" },
        { name: "Ms. Keerthana.L", phone: "63693 06410" }
      ]
    },
    {
      id: 2,
      title: "War of Witz (Technical Quiz)",
      description: "Test your technical knowledge in this fast-paced, challenging quiz competition. Cover topics from electronics, programming, mathematics, and general engineering principles.",
      icon: "/icons/quiz.svg",
      color: "#38b2ac",
      isTeamEvent: true,
      date: "March 19, 2025",
      time: "9.15 AM - 1:25 PM",
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "2-3 members",
      category: "technical",
      rules: [
        "Multiple rounds including MCQ, rapid fire, and buzzer",
        "Team elimination after each round",
        "On-spot registration can be done",
        "No electronic gadgets allowed during competition",
        "Time Limits",
        "Round 1 (MCQ): 30-40 sec per question",
        "Round 2 (Rapid Fire): 15-20 sec per question",
        "Round 3 (Buzzer): 5-7 sec per question",
        "Negative Marking: Only in the final round",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mrs.C.Ramya AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Arjun. K. M", phone: "63826 04483" },
        { name: "Mr.Mariprasath.D", phone: "93453 98217" }
      ]
    },
    {
      id: 3,
      title: "Solvelt hack (Hackathon)",
      description: "24 hours of coding, innovation, and problem-solving. Build solutions that matter in this intensive development marathon focused on real-world challenges.",
      icon: "/icons/code.svg",
      color: "#319795",
      isTeamEvent: true,
      date: "March 20, 2025",
      email: "texperia2k25.solvelthack@gmail.com",
      time: "Starts at 9:00 AM",
      venue: "Power System Simulation Laboratory",
      prizes: "Attractive prizes will be given",
      teamSize: "3-4 members",
      category: "flagship",
      rules: [
        "Submit abstract with a premliminary payment of ₹30 before March 16 ,2025",
        "Once the teams are selected team members have to pay the registration amount for the event to participate in the event",
        "On-spot registrations are not encouraged",
        "Teams must develop solutions aligned with provided themes",
        "Teams with prototype can present it to the jury ",
        "Final presentations limited to 5 minutes",
        "Solutions evaluated on innovation, technical complexity, and practicality",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mrs.S.Sharmila AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Krishnakumar.G", phone: "89254 93097" },
        { name: "Ms.Rakshitha.S", phone: "63797 95079" }
      ]
    },
    {
      id: 4,
      title: "Plan Pro (Project Presentation)",
      description: "Showcase your engineering projects and get feedback from industry experts. Present working prototypes or detailed models of your innovative engineering solutions.",
      icon: "/icons/project.svg",
      color: "#2c7a7b",
      date: "March 20, 2025",
      time: "09:00 AM - 4:00 PM",
      venue: "Machines laboratory",
      email: "texperia2k25.inksight@gmail.com",
      prizes: "Attractive prizes will be given",
      isTeamEvent: true,
      teamSize: "2-4 members",
      category: "flagship",
      rules: [
        "Submit abstract with a premliminary payment of ₹30 before March 16 ,2025",
        "Once the teams are selected team members have to pay the registration amount for the event to participate in the event",
        "On-spot registrations are not encouraged",
        "Projects must be original work of the participants",
        "Physical demonstration is reuired",
        "10 minutes for presentation followed by Q&A",
        "Judging based on innovation, execution, and potential impact",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mrs.B.Christyjuliet AP/EEE"}
      ],
      coordinators: [
        { name: "Ms.Devadharshini.A ", phone: "63817 18945" },
        { name: "Ms.Kanikasri.S", phone: "63748 98975" }
      ]
    },
    {
      id: 5,
      title: "Blink and Build (Rapid Prototype Challenge)",
      description: "Design, build and demonstrate a working prototype within a limited timeframe. Test your quick thinking and hands-on skills in this exciting time-bound challenge.",
      icon: "/public/prototype.svg",
      color: "#285e61",
      date: "March 19, 2025",
      isTeamEvent: true,
      time: "10:00 AM - 1:30 PM",
      venue: "Power Electronics and Drives Laboratory",
      prizes: "Attractive prizes will be given",
      teamSize: "2-3 members",
      category: "technical",
      rules: [
        "Materials will be provided at the venue",
        "On-spot registration can be done",
        "3 hours to complete the prototype",
        "Design should be solved within the specified time limit",
        "Judging based on functionality, design, and innovation",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mr.S.Bharath AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Manjunath.M", phone: "73970 98992" },
        { name: "Ms.Nandhini.R", phone: "94874 50985" }
      ]
    },
    {
      id: 6,
      title: "Poster Perspective (Poster Presentation)",
      description: "Visualize your ideas through creative posters and win exciting prizes. Present complex technical concepts through effective visual communication.",
      icon: "/icons/poster.svg",
      color: "#234e52",
      date: "March 19, 2025",
      time: "1:00 PM - 4:00 PM",
      isTeamEvent: true,
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "1-2 members",
      category: "flagship",
      rules: [
        "Poster size: 36 inches x 48 inches or 48 inches x 36 inches",
        "Content must be original and technically accurate",
        "On-spot registration can be done",
        "Participants should not show any pre-designed posters",
        "Use of software can be canva or adobe illustator",
        "Brief 3-minute explanation to judges",
        "Judging based on content clarity, visual appeal, and technical depth",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mr.R.Satheeshkumar AP/EEE"}
      ],
      coordinators: [
        { name: "Ms.Abisha.V.U", phone: "88256 41048" },
        { name: "Ms.Sudhiksha.G", phone: "98940 32882" }
      ]
    },
    {
      id: 7,
      title: "Mission Debuggable (Circuit Debugging)",
      description: "Find and fix errors in complex electrical circuits against the clock. Test your troubleshooting skills and theoretical knowledge in this practical challenge.",
      icon: "/icons/circuit.svg",
      color: "#805ad5",
      isTeamEvent: true,
      date: "March 20, 2025",
      time: "9:00 AM - 12:45 PM",
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "2 members",
      category: "technical",
      rules: [
        "Teams will receive faulty circuits to debug",
        "On-spot registration can be done",
        "Limited time per circuit (30 minutes)",
        "Only provided tools can be used",
        "Judging based on accuracy and time taken",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mr.R.Vijayakumar AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Jayanta Rohieth.P", phone: "90252 53457" },
      ]
    },
    {
      id: 8,
      title: "Sketch Your Creativity (Drawing)",
      description: "Express your technical concepts through artistic sketches and diagrams. Blend art with engineering in this unique competition focusing on technical illustration.",
      icon: "/icons/sketch.svg",
      color: "#6b46c1",
      date: "March 20, 2025",
      time: "10:00 AM - 1:00 PM",
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "1 member",
      isTeamEvent: false,
      category: "non-technical",
      rules: [
        "Topic will be provided on the spot",
        "3 hours to complete the sketch",
        "On-spot registration can be done",
        "All materials must be brought by participants(except drawing sheet)",
        "Judging based on creativity, technical accuracy, and execution",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mrs.B.Christyjuliet AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Dinesh.G", phone: "81224 35767" },
        { name: "Mr.Sri Veda Vikas.C", phone: "86100 39927" }
      ]
    },
    {
      id: 9,
      title: "CEO Talk",
      isTeamEvent: false,
      description: "Maha Vignesh N is the founder and CEO of Spacim,a Company at the forefront of Space Technology Innovation. Engage with Top Executive and Gain Valueable perspective on the future of Technology",
      icon: "/icons/talk.svg",
      color: "#553c9a",
      date: "March 19, 2025",
      time: "11:30 AM - 01:00 PM",
      venue: "B block Simulation Lab",
      prizes: "N/A",
      teamSize: "Individual Registration",
      category: "non-technical",
      rules: [
        "Professional etiquette expected",
        "Recording permitted only with prior permission"
      ],
      staffCoordinators: [
        { name: "Mr.R.Vijayakumar AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Mithun Kumar.M.R", phone: "96778 87047" },
        { name: "Ms.Sasmidha. C", phone: "63801 09324" }
      ]
    },

    // Workshop Day 1 - Embedded Systems
    {
      id: 10,
      title: "Workshop - Embedded Systems",
      description: "Hands-on sessions on embedded systems technology. Learn practical skills from industry experts covering microcontrollers, sensors, and IoT applications.",
      icon: "/icons/workshop.svg",
      color: "#44337a",
      isTeamEvent: false,
      date: "March 19, 2025",
      time: "9.00 AM - 4.30 PM",
      venue: "Will be announced on the day of event",
      prizes: "Certificate of Completion",
      teamSize: "Individual Registration",
      category: "technical",
      rules: [
        "Registration required in advance",
        "On-spot registration available subject to seat availability",
        "Materials will be provided",
        "Hands-on training with practical exercises",
        "Limited seats available (50 participants)",
        "Basic knowledge of electronics recommended",
        "Registration fee: ₹300",
        "Lunch will be provided"
      ],
      staffCoordinators: [
        { name: "Dr.D.Revathi AP/EEE"}
      ],
      coordinators: [
        { name: "Ms.Monika.M", phone: "75399 94722" },
        { name: "Ms.Monika sree.D", phone: "87540 17645" }
      ]
    },


    {
      id: 11,
      title: "Short Film and Mime Content",
      description: "showcase your creativity and storytelling skills through mime performances. Engage the audience with expressive gestures and movements in this silent yet powerful art form.",
      icon: "/icons/safety.svg",
      color: "#3c366b",
      isTeamEvent: true,
      date: "March 20, 2025",
      time: "9:00 AM - 4:30 PM",
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "3-5 members",
      category: "non-technical",
      rules: [
        "Performance duration: 5-7 minutes",
        "No dialogues allowed",
        "On-spot registration can be done",
        "Background music permitted",
        "Props should be minimal and relevant",
        "If there are any video to be played during the play kindly submit it to the respective co-ordinator",
        "Judging based on clarity of message, creativity, and execution",
        "Judge's decision is final"
      ],
      staffCoordinators: [
        { name: "Mr.R.Satheeshkumar AP/EEE"}
      ],
      coordinators: [
        { name: "Mr.Arivarasu.T", phone: "93457 31127" },
        { name: "Ms.Harshini.S", phone: "73588 82559" }
      ]
    },

    // Workshop Day 2 - PCB Design
    {
      id: 12,  // Using ID 12 since 11 is already used
      title: "Workshop - PCB Design",
      description: "Master the art of PCB design in this intensive workshop. Learn industry-standard design techniques, component selection, layout optimization, and manufacturing considerations.",
      icon: "/icons/workshop.svg",
      color: "#44337a",
      isTeamEvent: false,
      date: "March 20, 2025",
      time: "9.00 AM - 4.30 PM",
      venue: "Will be announced on the day of event",
      prizes: "Certificate of Completion",
      teamSize: "Individual Registration",
      category: "technical",
      rules: [
        "Registration required in advance",
        "On-spot registration available subject to seat availability",
        "Materials will be provided",
        "Hands-on training with industry-standard software",
        "Limited seats available (50 participants)",
        "Basic knowledge of electronics recommended",
        "Registration fee: ₹300",
        "Lunch will be provided"
      ],
      staffCoordinators: [
        { name: "Dr.D.Revathi AP/EEE"}
      ],
      coordinators: [
        { name: "Ms.Monika.M", phone: "75399 94722" },
        { name: "Ms.Monika sree.D", phone: "87540 17645" }
      ]
    },
    {
      id: 13,
      title: "Free Fire",
      description: "Gear up for the ultimate Free Fire Battle Fest, where players from all around gather to test their skills, win exclusive rewards, and dominate the battleground!",
      icon: "/icons/safety.svg",
      color: "#3c366b",
      isTeamEvent: true,
      date: "March 20, 2025",
      time: "9:00 AM - 4:30 PM",
      venue: "Will be announced on the day of event",
      prizes: "Attractive prizes will be given",
      teamSize: "3-5 members",
      category: "non-technical",
      staffCoordinators: [],
      rules: [
        "Don't break Glow walls",
        "Don't use grenades",
        "On-spot registration can be done",
        "If any cheat detected that team will be disqualified"
      ],
      coordinators: [
        { name: "Mr.Jagadheesh kumar.S", phone: "93610 62776" },
        { name: "Mr.Avinash.V", phone: "88254 97699" }
      ]
    }
  ];

export default events;

