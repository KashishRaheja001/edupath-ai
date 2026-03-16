export interface SkillData {
  id: string;
  name: string;
  category: "Frontend" | "Backend" | "AI/ML" | "Design" | "Mobile" | "Cloud" | "Data";
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  description: string;
  iconName: string; // We'll map this to Lucide icons in the UI
  popular: boolean;
  color: string;
}

export const curatedSkills: SkillData[] = [
  {
    id: "react",
    name: "React Development",
    category: "Frontend",
    difficulty: "Intermediate",
    estimatedTime: "3-4 months",
    description: "Build modern, interactive user interfaces with React and its massive ecosystem.",
    iconName: "Atom",
    popular: true,
    color: "from-blue-500 to-cyan-400"
  },
  {
    id: "python",
    name: "Python Programming",
    category: "Backend",
    difficulty: "Beginner",
    estimatedTime: "2-3 months",
    description: "Master Python for web development, data science, automation, and AI.",
    iconName: "Terminal",
    popular: true,
    color: "from-yellow-400 to-amber-500"
  },
  {
    id: "ml",
    name: "Machine Learning",
    category: "AI/ML",
    difficulty: "Advanced",
    estimatedTime: "6-8 months",
    description: "Learn to build intelligent systems using algorithms and statistical models.",
    iconName: "BrainCircuit",
    popular: true,
    color: "from-purple-500 to-indigo-500"
  },
  {
    id: "ui-ux",
    name: "UI/UX Design",
    category: "Design",
    difficulty: "Beginner",
    estimatedTime: "2-3 months",
    description: "Design beautiful, user-centric interfaces and map out seamless user journeys.",
    iconName: "Palette",
    popular: true,
    color: "from-pink-500 to-rose-400"
  },
  {
    id: "node",
    name: "Node.js Backend",
    category: "Backend",
    difficulty: "Intermediate",
    estimatedTime: "3-4 months",
    description: "Build scalable network applications and APIs using JavaScript on the server.",
    iconName: "Server",
    popular: true,
    color: "from-green-500 to-emerald-400"
  },
  {
    id: "mobile",
    name: "Mobile Development",
    category: "Mobile",
    difficulty: "Intermediate",
    estimatedTime: "4-5 months",
    description: "Create native and cross-platform mobile apps for iOS and Android.",
    iconName: "Smartphone",
    popular: false,
    color: "from-slate-600 to-slate-800"
  },
  {
    id: "nextjs",
    name: "Next.js Mastery",
    category: "Frontend",
    difficulty: "Intermediate",
    estimatedTime: "2-3 months",
    description: "Build production-ready React applications with server-side rendering and static generation.",
    iconName: "Layers",
    popular: true,
    color: "from-gray-700 to-black"
  },
  {
    id: "sql",
    name: "SQL & Databases",
    category: "Data",
    difficulty: "Beginner",
    estimatedTime: "1-2 months",
    description: "Master relational databases, complex queries, and data architecture.",
    iconName: "Database",
    popular: false,
    color: "from-blue-600 to-indigo-600"
  },
  {
    id: "aws",
    name: "AWS Cloud Architect",
    category: "Cloud",
    difficulty: "Advanced",
    estimatedTime: "4-6 months",
    description: "Design, deploy, and manage highly scalable cloud infrastructure on Amazon Web Services.",
    iconName: "Cloud",
    popular: false,
    color: "from-orange-400 to-orange-500"
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Frontend",
    difficulty: "Intermediate",
    estimatedTime: "1-2 months",
    description: "Add static typing to JavaScript to build more robust and maintainable applications.",
    iconName: "Code2",
    popular: true,
    color: "from-blue-500 to-blue-600"
  },
  {
    id: "docker",
    name: "Docker & Containers",
    category: "Cloud",
    difficulty: "Intermediate",
    estimatedTime: "1-2 months",
    description: "Learn containerization to build, ship, and run applications anywhere consistently.",
    iconName: "Box",
    popular: false,
    color: "from-cyan-500 to-blue-500"
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity Basics",
    category: "Backend",
    difficulty: "Beginner",
    estimatedTime: "3-5 months",
    description: "Learn the fundamentals of securing networks, applications, and sensitive data.",
    iconName: "Shield",
    popular: false,
    color: "from-red-500 to-rose-600"
  }
];
