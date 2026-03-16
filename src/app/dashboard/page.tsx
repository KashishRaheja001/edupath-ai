"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Route,
  Target,
  Network,
  ArrowRight,
  Sparkles,
  Trophy,
  Flame,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  PlayCircle,
  Compass
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEduPathStore } from "@/lib/store";
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const allAchievements = [
  { id: "first-step", title: "First Step", icon: Trophy, color: "text-amber-500", bg: "bg-amber-500/10" },
  { id: "goal-setter", title: "Goal Setter", icon: Target, color: "text-rose-500", bg: "bg-rose-500/10" },
  { id: "consistent-learner", title: "Consistent Learner", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
  { id: "fast-learner", title: "Fast Learner", icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
];

export default function DashboardPage() {
  const { 
    activePaths, 
    completedSkillsCount, 
    achievements, 
    streak,
    checkAndUpdateStreak 
  } = useEduPathStore();

  // Update streak on mount
  useEffect(() => {
    checkAndUpdateStreak();
  }, [checkAndUpdateStreak]);

  // Calculate overall progress across all active paths
  const calculateOverallProgress = () => {
    if (activePaths.length === 0) return 0;
    const totalProgress = activePaths.reduce((acc, path) => acc + path.progress, 0);
    return Math.round(totalProgress / activePaths.length);
  };

  const overallProgress = calculateOverallProgress();

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <LayoutDashboard className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-bold">My Learning Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Track your progress, achievements, and active learning paths.
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/explore">
            <Button variant="outline" className="glass">
              <Sparkles className="w-4 h-4 mr-2 text-primary" />
              Explore Skills
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Top Stats Row */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass border-primary/20 bg-primary/5">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Overall Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedSkillsCount}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Skills Completed</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
              <Clock className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{activePaths.length}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Paths In Progress</div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <div className="text-2xl font-bold">{achievements.length}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Achievements</div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Active Paths */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Active Learning Paths
            </h2>
            <Link href="/dashboard/learning-path">
              <Button variant="ghost" size="sm">Create New</Button>
            </Link>
          </div>

          <div className="space-y-4">
            {activePaths.length === 0 ? (
              <Card className="glass border-dashed">
                <CardContent className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Compass className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">No active paths yet</h3>
                  <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                    Start a learning path to track your progress and unlock achievements.
                  </p>
                  <Link href="/explore">
                    <Button>Explore Skills</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              activePaths.map((path) => (
                <Card key={path.id} className="glass hover:border-primary/30 transition-colors group">
                  <CardContent className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg">{path.goalTitle} Path</h3>
                          {path.progress === 100 && (
                            <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/30">Completed</Badge>
                          )}
                          {path.progress > 0 && path.progress < 100 && (
                            <Badge variant="secondary" className="text-primary bg-primary/10">In Progress</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          Started: {new Date(path.startedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Link href="/dashboard/learning-path" className="w-full sm:w-auto">
                        <Button variant={path.progress === 100 ? "outline" : "default"} className="flex-shrink-0 w-full">
                          {path.progress === 100 ? 'Review Path' : 'Continue Learning'}
                          <PlayCircle className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="text-muted-foreground">{path.completedSteps} of {path.totalSteps} skills completed</span>
                        <span className="text-primary">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2.5 bg-secondary" />
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Sidebar: Gamification & Quick Links */}
        <div className="space-y-6">
          {/* AI Mentor Ad */}
          <Card className="border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4">
              <MessageSquare className="w-32 h-32" />
            </div>
            <CardContent className="p-6 relative z-10">
              <Badge className="bg-white/20 text-white hover:bg-white/30 border-0 mb-3">24/7 Support</Badge>
              <h3 className="text-xl font-bold mb-2">AI Career Mentor</h3>
              <p className="text-white/80 text-sm mb-6">
                Stuck on a concept? Need project ideas? Your AI mentor is ready to help right now.
              </p>
              <Link href="/dashboard/mentor" className="block w-full">
                <Button variant="secondary" className="w-full text-indigo-600 border border-white/50 hover:bg-white/90 bg-white">
                  Chat Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Streak Tracker */}
          <Card className="glass">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500/10 mb-4">
                <Flame className={`w-8 h-8 ${streak.days > 0 ? 'text-orange-500' : 'text-muted-foreground'}`} />
              </div>
              <h3 className="font-bold text-lg mb-1">Learning Streak</h3>
              <div className="text-3xl font-black text-foreground mb-1">
                {streak.days} <span className="text-lg text-muted-foreground font-medium">Days</span>
              </div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                {streak.days > 0 ? "Keep it up! 🔥" : "Start your streak today!"}
              </p>
            </CardContent>
          </Card>

          {/* Achievements Grid */}
          <Card className="glass">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold">Achievements</h3>
                <span className="text-xs font-semibold text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                  {achievements.length} / {allAchievements.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {allAchievements.map((badge) => {
                  const isUnlocked = achievements.includes(badge.id);
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                        isUnlocked 
                          ? `${badge.bg} border-transparent` 
                          : 'bg-background/50 border-border/50 grayscale opacity-40'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isUnlocked ? badge.color : 'text-muted-foreground'}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider leading-tight">
                        {badge.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Other Tools */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/simulator" className="block w-full">
              <Button variant="outline" className="glass h-auto w-full py-4 flex flex-col gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                <span className="text-xs">Simulator</span>
              </Button>
            </Link>
            <Link href="/dashboard/skill-graph" className="block w-full">
              <Button variant="outline" className="glass h-auto w-full py-4 flex flex-col gap-2">
                <Network className="w-5 h-5 text-amber-500" />
                <span className="text-xs">Skill Graph</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
