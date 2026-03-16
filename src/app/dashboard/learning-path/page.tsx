"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Route,
  Loader2,
  BookOpen,
  Video,
  FileText,
  Code,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Plus,
  X,
  ExternalLink,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LearningPath } from "@/lib/schemas";
import { useEduPathStore } from "@/lib/store";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

const skillSuggestions = [
  "HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js",
  "Node.js", "Python", "SQL", "Git", "Docker", "AWS",
];

const difficultyColors = {
  beginner: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  intermediate: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  advanced: "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const resourceIcons = {
  video: Video,
  article: FileText,
  course: BookOpen,
  project: Code,
};

function LearningPathContent() {
  const { lastPath, setLastPath } = useEduPathStore();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [goalRole, setGoalRole] = useState("");
  const [timeframe, setTimeframe] = useState("6 months");
  const [path, setPath] = useState<LearningPath | null>(lastPath);
  const [loading, setLoading] = useState(false);
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  const searchParams = useSearchParams();
  const preset = searchParams?.get("preset");

  // Auto-start generation if preset query parameter is present
  useEffect(() => {
    if (preset && !path && !loading) {
      setGoalRole(preset);
      // Wait a tiny bit for state to settle, then auto-generate
      const timer = setTimeout(() => {
        handleGenerate(preset);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [preset, path, loading]);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput("");
  };

  const togglePhase = (i: number) => {
    const next = new Set(expandedPhases);
    if (next.has(i)) next.delete(i);
    else next.add(i);
    setExpandedPhases(next);
  };

  const handleGenerate = async (overrideRole?: string) => {
    setLoading(true);
    const targetRole = overrideRole || goalRole;
    try {
      const res = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentSkills: skills, goalRole: targetRole, timeframe }),
      });
      const data = await res.json();
      if (data.error) {
        console.error("API Error:", data.error);
        alert("Failed to generate path. Please try again.");
        return;
      }
      setPath(data);
      setLastPath(data);
      // Add to gamified store
      const { addActivePath } = useEduPathStore.getState();
      addActivePath(data);
      setExpandedPhases(new Set([0]));
      setExpandedPhases(new Set([0]));
    } catch (err) {
      console.error("Failed to generate path:", err);
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
          <Route className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">AI Learning Path Generator</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Tell us your skills and goals — AI will create a structured roadmap for you.
        </p>
      </motion.div>

      {/* Input Form */}
      {!path && (
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Current Skills */}
          <div>
            <label className="text-sm font-medium mb-2 block">Your Current Skills</label>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="Type a skill and press Enter..."
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill(skillInput.trim());
                  }
                }}
                className="glass border-border/50"
              />
              <Button
                size="icon"
                variant="outline"
                onClick={() => addSkill(skillInput.trim())}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {skills.map((s) => (
                  <Badge
                    key={s}
                    variant="secondary"
                    className="gap-1 cursor-pointer hover:bg-destructive/20"
                    onClick={() => setSkills(skills.filter((x) => x !== s))}
                  >
                    {s}
                    <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
            <div className="flex flex-wrap gap-1.5">
              {skillSuggestions
                .filter((s) => !skills.includes(s))
                .map((s) => (
                  <button
                    key={s}
                    className="text-xs px-3 py-1.5 rounded-full glass hover:border-primary/30 transition-all border border-transparent text-muted-foreground hover:text-foreground"
                    onClick={() => addSkill(s)}
                  >
                    + {s}
                  </button>
                ))}
            </div>
          </div>

          {/* Goal Role */}
          <div>
            <label className="text-sm font-medium mb-2 block">Career Goal</label>
            <Input
              placeholder="e.g. Full-Stack Developer, Data Scientist, DevOps Engineer"
              value={goalRole}
              onChange={(e) => setGoalRole(e.target.value)}
              className="glass border-border/50"
            />
          </div>

          {/* Timeframe */}
          <div>
            <label className="text-sm font-medium mb-2 block">Timeframe</label>
            <div className="flex gap-2">
              {["3 months", "6 months", "12 months"].map((t) => (
                <button
                  key={t}
                  className={`px-4 py-2 rounded-xl text-sm transition-all ${
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

          <Button
            onClick={() => handleGenerate()}
            disabled={loading || !goalRole.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-6 text-base"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Sparkles className="w-5 h-5 mr-2" />
            )}
            {loading ? "AI is crafting your personalized roadmap..." : "Generate Learning Path"}
          </Button>
        </motion.div>
      )}

      {/* Generated Path */}
      {path && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">{path.goalTitle}</h2>
              <p className="text-sm text-muted-foreground">
                {path.estimatedWeeks} weeks • {path.phases.length} phases
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => { setPath(null); setLastPath(null); }}
            >
              New Path
            </Button>
          </div>

          <div className="space-y-4">
            {path.phases.map((phase, i) => {
              const expanded = expandedPhases.has(i);
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="glass border-border/50 overflow-hidden">
                    <button
                      className="w-full p-5 flex items-center justify-between text-left hover:bg-accent/30 transition-colors"
                      onClick={() => togglePhase(i)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                          {i + 1}
                        </div>
                        <div>
                          <div className="font-semibold">{phase.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {phase.weekRange} • {phase.skills.length} skills
                          </div>
                        </div>
                      </div>
                      {expanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    <AnimatePresence>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <CardContent className="pt-0 pb-5 px-5 space-y-4">
                            {/* Skills */}
                            {phase.skills.map((skill, si) => {
                              const ResIcon = resourceIcons;
                              return (
                                <div
                                  key={si}
                                  className="p-4 rounded-xl bg-accent/30 border border-border/50"
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="font-medium text-sm">
                                      {skill.name}
                                    </div>
                                    <Badge
                                      variant="outline"
                                      className={`text-[10px] ${difficultyColors[skill.difficulty]}`}
                                    >
                                      {skill.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground mb-3">
                                    {skill.description}
                                  </p>
                                  {skill.suggestedResources.length > 0 && (
                                    <div className="space-y-2 mt-3 pt-3 border-t border-border/30">
                                      <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                                        <Youtube className="w-3 h-3" />
                                        Learning Resources
                                      </div>
                                      {skill.suggestedResources.map((r, ri) => {
                                        const Icon = resourceIcons[r.type] || BookOpen;
                                        const hasUrl = r.url && r.url.length > 0 && r.url !== "";
                                        return (
                                          <div
                                            key={ri}
                                            className={`flex items-center gap-2 text-xs p-2 rounded-lg ${hasUrl ? 'bg-blue-500/5 border border-blue-500/10 hover:border-blue-500/30' : 'bg-accent/20'} transition-all`}
                                          >
                                            <Icon className="w-4 h-4 flex-shrink-0 text-blue-400" />
                                            <div className="flex-1 min-w-0">
                                              {hasUrl ? (
                                                <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 hover:underline font-medium flex items-center gap-1">
                                                  {r.title}
                                                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                                </a>
                                              ) : (
                                                <span className="text-muted-foreground">{r.title}</span>
                                              )}
                                            </div>
                                            <Badge variant="outline" className="text-[9px] flex-shrink-0 border-blue-500/20 text-blue-400">
                                              {r.type}
                                            </Badge>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}

                            {/* Milestone */}
                            <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                🎯
                              </div>
                              <div>
                                <div className="text-xs font-medium text-primary">
                                  Milestone
                                </div>
                                <div className="text-sm">{phase.milestone}</div>
                              </div>
                            </div>
                          </CardContent>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function LearningPathPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <LearningPathContent />
    </Suspense>
  );
}
