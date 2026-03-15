"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ReactFlow,
  Panel,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Network,
  Loader2,
  Sparkles,
  Plus,
  X,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Custom node component
function SkillNode({ data }: { data: { label: string; difficulty: string; category: string; phase: string } }) {
  const colorMap: Record<string, string> = {
    beginner: "from-emerald-500/30 to-emerald-600/10 border-emerald-500/40",
    intermediate: "from-amber-500/30 to-amber-600/10 border-amber-500/40",
    advanced: "from-rose-500/30 to-rose-600/10 border-rose-500/40",
  };

  const glowMap: Record<string, string> = {
    beginner: "shadow-emerald-500/20",
    intermediate: "shadow-amber-500/20",
    advanced: "shadow-rose-500/20",
  };

  return (
    <div
      className={`px-5 py-3.5 rounded-xl bg-gradient-to-br ${
        colorMap[data.difficulty] || colorMap.beginner
      } border backdrop-blur-sm shadow-lg ${glowMap[data.difficulty] || ""}`}
    >
      <Handle type="target" position={Position.Left} className="!bg-primary !w-2 !h-2" />
      <div className="text-sm font-semibold text-foreground">{data.label}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{data.phase}</div>
      <Handle type="source" position={Position.Right} className="!bg-primary !w-2 !h-2" />
    </div>
  );
}

const nodeTypes = { skillNode: SkillNode };

// Skeleton loader for the graph
function GraphSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <div className="relative">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
      </div>
      <div className="text-center">
        <div className="text-sm font-medium mb-1">Building your Skill Graph...</div>
        <div className="text-xs text-muted-foreground">
          AI is analyzing your skills and creating connections
        </div>
      </div>
      {/* Skeleton nodes */}
      <div className="flex gap-8 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="w-28 h-14 rounded-xl bg-accent/30 animate-pulse border border-border/30"
            style={{ animationDelay: `${i * 200}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export default function SkillGraphPage() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [goalRole, setGoalRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const addSkill = (skill: string) => {
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
    }
    setSkillInput("");
  };

  const skillSuggestions = [
    "HTML", "CSS", "JavaScript", "React", "Python", "Node.js", "SQL", "Git",
  ];

  const handleGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: skills,
          goalRole,
          timeframe: "6 months",
        }),
      });
      const path = await res.json();

      if (path.error) {
        setError(path.error);
        setLoading(false);
        return;
      }

      if (!path.phases || !Array.isArray(path.phases)) {
        setError("Invalid response from AI. Please try again.");
        setLoading(false);
        return;
      }

      // Convert learning path to graph nodes and edges
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const PHASE_GAP_X = 350;
      const SKILL_GAP_Y = 120;

      path.phases.forEach((phase: any, pi: number) => {
        if (!phase.skills || !Array.isArray(phase.skills)) return;
        
        phase.skills.forEach((skill: any, si: number) => {
          const nodeId = `${skill.name.replace(/\s+/g, "-").toLowerCase()}`;
          newNodes.push({
            id: nodeId,
            type: "skillNode",
            position: {
              x: pi * PHASE_GAP_X + 50,
              y: si * SKILL_GAP_Y + 50,
            },
            data: {
              label: skill.name,
              difficulty: skill.difficulty || "beginner",
              category: skill.category || "",
              phase: phase.name,
            },
          });

          // Create edges from prerequisites
          if (skill.prerequisites && Array.isArray(skill.prerequisites)) {
            skill.prerequisites.forEach((prereq: string) => {
              const sourceId = prereq.replace(/\s+/g, "-").toLowerCase();
              const sourceExists = newNodes.find((n) => n.id === sourceId);
              if (sourceExists) {
                newEdges.push({
                  id: `${sourceId}-${nodeId}`,
                  source: sourceId,
                  target: nodeId,
                  animated: true,
                  style: { stroke: "oklch(0.72 0.19 265 / 0.5)", strokeWidth: 2 },
                });
              }
            });
          }
        });

        // Connect skills within phase sequentially
        if (phase.skills.length > 1) {
          for (let i = 0; i < phase.skills.length - 1; i++) {
            const fromId = phase.skills[i].name.replace(/\s+/g, "-").toLowerCase();
            const toId = phase.skills[i + 1].name.replace(/\s+/g, "-").toLowerCase();
            const edgeId = `seq-${fromId}-${toId}`;
            if (!newEdges.find((e) => e.id === edgeId)) {
              newEdges.push({
                id: edgeId,
                source: fromId,
                target: toId,
                style: { stroke: "oklch(0.5 0.05 270 / 0.3)", strokeWidth: 1 },
              });
            }
          }
        }

        // Connect last skill of phase to first skill of next phase
        if (pi < path.phases.length - 1) {
          const lastSkill = phase.skills[phase.skills.length - 1];
          const nextPhase = path.phases[pi + 1];
          if (lastSkill && nextPhase?.skills?.[0]) {
            const fromId = lastSkill.name.replace(/\s+/g, "-").toLowerCase();
            const toId = nextPhase.skills[0].name.replace(/\s+/g, "-").toLowerCase();
            newEdges.push({
              id: `phase-${fromId}-${toId}`,
              source: fromId,
              target: toId,
              animated: true,
              style: { stroke: "oklch(0.72 0.19 265 / 0.6)", strokeWidth: 2 },
            });
          }
        }
      });

      setNodes(newNodes);
      setEdges(newEdges);
      setGenerated(true);
    } catch (err: any) {
      console.error("Failed to generate graph:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [skills, goalRole, setNodes, setEdges]);

  return (
    <div className="h-[calc(100vh-6rem)]">
      {/* Header */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Network className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold">Interactive Skill Graph</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Visualize your learning path as a dynamic skill tree.
        </p>
      </motion.div>

      {!generated ? (
        <motion.div
          className="max-w-xl space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <label className="text-sm font-medium mb-2 block">Your Skills</label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add skill..."
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
              <Button size="icon" variant="outline" onClick={() => addSkill(skillInput.trim())}>
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
                    {s} <X className="w-3 h-3" />
                  </Badge>
                ))}
              </div>
            )}
            {/* Quick add skill suggestions */}
            <div className="flex flex-wrap gap-1.5">
              {skillSuggestions.filter(s => !skills.includes(s)).map(s => (
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
          <div>
            <label className="text-sm font-medium mb-2 block">Career Goal</label>
            <Input
              placeholder="e.g. Full-Stack Developer"
              value={goalRole}
              onChange={(e) => setGoalRole(e.target.value)}
              className="glass border-border/50"
            />
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-sm text-destructive"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Loading Skeleton */}
          {loading && <GraphSkeleton />}

          <Button
            onClick={handleGenerate}
            disabled={loading || !goalRole.trim()}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 py-6"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
            {loading ? "AI is mapping your skill connections..." : "Generate Skill Graph"}
          </Button>
        </motion.div>
      ) : (
        <motion.div
          className="h-[calc(100%-4rem)] rounded-2xl overflow-hidden border border-border/50 glass"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="oklch(0.3 0.02 270)" gap={30} size={1} />
            <Controls className="!bg-card !border-border/50 !rounded-xl" />
            <Panel position="top-right">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setGenerated(false);
                  setNodes([]);
                  setEdges([]);
                  setError(null);
                }}
                className="glass"
              >
                New Graph
              </Button>
            </Panel>
            <Panel position="top-left">
              <div className="flex gap-2">
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                  ● Beginner
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  ● Intermediate
                </Badge>
                <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">
                  ● Advanced
                </Badge>
              </div>
            </Panel>
          </ReactFlow>
        </motion.div>
      )}
    </div>
  );
}
