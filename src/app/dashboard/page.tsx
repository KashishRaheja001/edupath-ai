"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Route,
  Target,
  Network,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const quickActions = [
  {
    href: "/dashboard/mentor",
    icon: MessageSquare,
    title: "AI Mentor",
    description: "Chat with your AI career advisor",
    color: "from-purple-500 to-pink-600",
    tag: "Chat",
  },
  {
    href: "/dashboard/learning-path",
    icon: Route,
    title: "Learning Path",
    description: "Generate a personalized learning roadmap",
    color: "from-blue-500 to-indigo-600",
    tag: "Generate",
  },
  {
    href: "/dashboard/simulator",
    icon: Target,
    title: "Career Simulator",
    description: "Simulate your career transition plan",
    color: "from-emerald-500 to-teal-600",
    tag: "Simulate",
  },
  {
    href: "/dashboard/skill-graph",
    icon: Network,
    title: "Skill Graph",
    description: "Visualize your skills and learning path",
    color: "from-amber-500 to-orange-600",
    tag: "Explore",
  },
];

export default function DashboardPage() {
  return (
    <div className="max-w-5xl">
      {/* Header */}
      <motion.div
        className="mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <Badge variant="outline" className="text-xs text-primary border-primary/30">
            AI Powered
          </Badge>
        </div>
        <h1 className="text-3xl font-bold mb-2">Welcome to EduPath</h1>
        <p className="text-muted-foreground">
          Your AI-powered career navigation dashboard. Choose a tool below to get started.
        </p>
      </motion.div>

      {/* Quick Actions Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {quickActions.map((action, i) => (
          <motion.div
            key={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Link href={action.href}>
              <Card className="glass border-border/50 hover:border-primary/30 transition-all duration-300 group cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}
                    >
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {action.tag}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{action.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {action.description}
                  </p>
                  <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                    Open
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
