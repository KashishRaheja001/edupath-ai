"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Network,
  Target,
  ArrowRight,
  BookOpen,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Network,
    title: "Dynamic Skill Graph",
    description:
      "Visualize your skills as an interactive graph. See how technologies connect and discover what to learn next.",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: MessageSquare,
    title: "AI Career Mentor",
    description:
      "Chat with an AI mentor that knows your skills and goals. Get project ideas, career advice, and learning guidance.",
    color: "from-purple-500 to-pink-600",
  },
  {
    icon: Target,
    title: "Career Simulator",
    description:
      "Set a career goal and timeframe. Get a week-by-week actionable plan with milestones and checkpoints.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: BookOpen,
    title: "Smart Resources",
    description:
      "AI-curated learning resources ranked by relevance, difficulty, and quality. No more wasting time on bad courses.",
    color: "from-amber-500 to-orange-600",
  },
];

const stats = [
  { value: "50+", label: "Career Paths" },
  { value: "500+", label: "Resources" },
  { value: "AI", label: "Powered" },
  { value: "Free", label: "Always" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen animated-gradient grid-bg">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold">EduPath</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Dashboard
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              AI-Powered Career Navigation
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Learn the{" "}
            <span className="gradient-text">Right Skills</span>
            <br />
            for Your Career
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stop guessing what to learn next. EduPath analyzes your skills,
            maps your career goals, and builds you a personalized learning
            journey — powered by AI.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 text-base px-8 py-6 glow"
              >
                Start Your Journey
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/dashboard/mentor">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 py-6 glass hover:bg-accent/50"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Talk to AI Mentor
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-bold gradient-text">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="gradient-text">Level Up</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From skill discovery to career planning, EduPath guides every
              step of your learning journey.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                className="glass rounded-2xl p-8 hover:border-primary/30 transition-all duration-300 group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center glass rounded-3xl p-12"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">
            Ready to Navigate Your Career?
          </h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Join EduPath and let AI guide you to the skills that matter.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 text-base px-10 py-6 glow"
            >
              Launch Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>Built with ❤️ for students & learners everywhere</p>
        </div>
      </footer>
    </div>
  );
}
