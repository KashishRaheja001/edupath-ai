"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Compass, Clock, Sparkles } from "lucide-react";
import * as Icons from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { curatedSkills, type SkillData } from "@/lib/skills-data";
import Link from "next/link";
import { useEduPathStore } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ExploreSkillsPage() {
  const router = useRouter();
  const { guestId } = useEduPathStore(); // Just to ensure store is hydrated
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("All Levels");

  const categories = ["All Categories", "Frontend", "Backend", "AI/ML", "Design", "Mobile", "Cloud", "Data"];
  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const filteredSkills = useMemo(() => {
    return curatedSkills.filter((skill) => {
      const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            skill.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || skill.category === selectedCategory;
      const matchesDifficulty = selectedDifficulty === "All Levels" || skill.difficulty === selectedDifficulty;
      
      return matchesSearch && matchesCategory && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const handleStartLearning = (skillName: string) => {
    // We pass the skill via query param to the dashboard generator
    router.push(`/dashboard/learning-path?preset=${encodeURIComponent(skillName)}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto">
      {/* Header section */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
        >
          <Compass className="w-4 h-4" />
          Skill Navigator
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold mb-6 tracking-tight"
        >
          Explore Skills
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-muted-foreground"
        >
          Find the perfect skill to advance your career. Browse our curated library of in-demand technologies and instantly generate AI learning paths.
        </motion.p>
      </div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4 md:p-6 mb-12 shadow-sm border border-border/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search for skills, technologies, or topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50 h-12 text-base rounded-xl"
            />
          </div>
          <div className="md:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background/50 border border-input text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-3">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-background/50 border border-input text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Skills</h2>
        <span className="text-muted-foreground text-sm">{filteredSkills.length} results</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredSkills.map((skill, index) => {
            // @ts-ignore - Dynamic icon rendering
            const Icon = Icons[skill.iconName] || Icons.Code;
            
            return (
              <motion.div
                key={skill.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group"
              >
                <Card className="h-full glass hover:border-primary/50 transition-all duration-300 flex flex-col group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:group-hover:shadow-[0_8px_30px_rgb(255,255,255,0.04)]">
                  <CardContent className="p-6 flex flex-col h-full">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center mb-5">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${skill.color} p-[1px] mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                        <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-foreground" />
                        </div>
                      </div>
                      <h3 className="text-xl font-bold mb-1">{skill.name}</h3>
                      <div className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground flex items-center justify-center gap-1">
                        {skill.category} {skill.popular && <span className="text-amber-500 flex items-center gap-0.5"><Sparkles className="w-3 h-3"/> Popular</span>}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-muted-foreground text-center mb-6 flex-grow">
                      {skill.description}
                    </p>

                    {/* Meta tags */}
                    <div className="flex items-center justify-between mb-6 pt-4 border-t border-border/50">
                      <Badge variant="secondary" className={`
                        ${skill.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20' : ''}
                        ${skill.difficulty === 'Intermediate' ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20' : ''}
                        ${skill.difficulty === 'Advanced' ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' : ''}
                      `}>
                        {skill.difficulty}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        {skill.estimatedTime}
                      </div>
                    </div>

                    {/* Action */}
                    <Button 
                      onClick={() => handleStartLearning(skill.name)}
                      className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground border-0 transition-colors"
                    >
                      View Learning Path
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No skills found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
