"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Target,
  Loader2,
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Trophy,
  ExternalLink,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CareerSimulation } from "@/lib/schemas";
import { useEduPathStore } from "@/lib/store";

export default function SimulatorPage() {
  const { lastSimulation, setLastSimulation } = useEduPathStore();
  const [currentRole, setCurrentRole] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [timeframe, setTimeframe] = useState("6 months");
  const [hoursPerWeek, setHoursPerWeek] = useState("15");
  const [simulation, setSimulation] = useState<CareerSimulation | null>(lastSimulation);
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/simulate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentRole,
          targetRole,
          timeframe,
          hoursPerWeek: parseInt(hoursPerWeek),
        }),
      });
      const data = await res.json();
      setSimulation(data);
      setLastSimulation(data);
    } catch (err) {
      console.error("Failed to simulate:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Target className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">AI Career Simulator</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Simulate your career transition. Get a week-by-week actionable plan.
        </p>
      </motion.div>

      {/* Input Form */}
      {!simulation && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Current Situation</label>
              <Input
                placeholder="e.g. CS Student, Junior Dev, Career switcher"
                value={currentRole}
                onChange={(e) => setCurrentRole(e.target.value)}
                className="glass border-border/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Target Role</label>
              <Input
                placeholder="e.g. Senior Frontend Developer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="glass border-border/50"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Timeframe</label>
              <div className="flex gap-2">
                {["3 months", "6 months", "12 months"].map((t) => (
                  <button
                    key={t}
                    className={`flex-1 px-3 py-2 rounded-xl text-sm transition-all ${
                      timeframe === t
                        ? "bg-primary text-primary-foreground"
                        : "glass hover:bg-accent/50 text-muted-foreground"
                    }`}
                    onClick={() => setTimeframe(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Hours per Week</label>
              <Input
                type="number"
                placeholder="15"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="glass border-border/50"
              />
            </div>
          </div>

          <Button
            onClick={handleSimulate}
            disabled={loading || !targetRole.trim()}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 py-6 text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {loading ? "Simulating Career Path..." : "Run Career Simulation"}
          </Button>
        </motion.div>
      )}

      {/* Simulation Results */}
      {simulation && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{simulation.targetRole}</h2>
              <p className="text-sm text-muted-foreground">
                {simulation.totalWeeks} weeks plan
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setSimulation(null); setLastSimulation(null); }}
            >
              New Simulation
            </Button>
          </div>

          {/* Key Milestones */}
          {simulation.keyMilestones?.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                Key Milestones
              </h3>
              <div className="grid md:grid-cols-3 gap-3">
                {simulation.keyMilestones.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="glass border-amber-500/20 h-full">
                      <CardContent className="p-4">
                        <Badge variant="outline" className="text-[10px] mb-2 text-amber-400 border-amber-500/30">
                          Week {m.week}
                        </Badge>
                        <div className="text-sm font-medium mb-1">{m.milestone}</div>
                        <div className="text-xs text-muted-foreground">
                          {m.deliverable}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Plan */}
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            Weekly Plan
          </h3>
          <div className="space-y-3">
            {simulation.weeklyPlan.map((week, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="glass border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                          W{week.week}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{week.focus}</div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {week.hoursPerDay}h/day
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="ml-11 space-y-1.5">
                      {week.tasks.map((task, ti) => (
                        <div
                          key={ti}
                          className="flex items-start gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-emerald-400" />
                          <span>{task}</span>
                        </div>
                      ))}
                      <div className="mt-2 text-xs text-primary font-medium">
                        ✓ {week.checkpoint}
                      </div>

                      {/* YouTube & Resource Links */}
                      {week.resources && week.resources.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-border/30 space-y-1.5">
                          <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            Recommended Resources
                          </div>
                          {week.resources.map((resource: any, ri: number) => (
                            <a
                              key={ri}
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                            >
                              <ExternalLink className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{resource.title}</span>
                              <Badge variant="outline" className="text-[9px] ml-auto flex-shrink-0 border-blue-500/30 text-blue-400">
                                {resource.type}
                              </Badge>
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Expected Outcome */}
          {simulation.expectedOutcome && (
            <motion.div
              className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-sm font-semibold mb-1 text-emerald-400">
                🎯 Expected Outcome
              </div>
              <p className="text-sm text-muted-foreground">
                {simulation.expectedOutcome}
              </p>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
