import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LearningPath, CareerSimulation } from "./schemas";

// Generate a unique guest ID per browser tab/session (if not using persist)
function getGuestId(): string {
  if (typeof window === "undefined") return "server";
  let id = sessionStorage.getItem("edupath-guest-id");
  if (!id) {
    id = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem("edupath-guest-id", id);
  }
  return id;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

export interface ActivePath extends LearningPath {
  id: string;
  progress: number; // 0 to 100
  startedAt: number;
  completedSteps: number;
  totalSteps: number;
  goalTitle: string;
}

interface EduPathStore {
  // Guest Identity
  guestId: string;

  // Chat History
  chatSessions: ChatSession[];
  activeChatId: string | null;
  addChatSession: (session: ChatSession) => void;
  updateChatSession: (id: string, messages: ChatMessage[]) => void;
  setActiveChatId: (id: string | null) => void;
  deleteChatSession: (id: string) => void;

  // Gamification & Progress
  activePaths: ActivePath[];
  completedSkillsCount: number;
  achievements: string[];
  streak: {
    days: number;
    lastActiveDate: string | null;
  };
  
  // Actions
  addActivePath: (path: LearningPath) => void;
  updatePathProgress: (pathId: string, progress: number, completedSteps: number) => void;
  removePath: (pathId: string) => void;
  incrementCompletedSkills: () => void;
  unlockAchievement: (achievementId: string) => void;
  checkAndUpdateStreak: () => void;

  // Legacy temporary states (can be removed later if fully replaced by activePaths)
  lastPath: LearningPath | null;
  setLastPath: (path: LearningPath | null) => void;
  lastSimulation: CareerSimulation | null;
  setLastSimulation: (sim: CareerSimulation | null) => void;
}

export const useEduPathStore = create<EduPathStore>()(
  persist(
    (set, get) => ({
      guestId: typeof window !== "undefined" ? getGuestId() : "server",

      // Gamification State
      activePaths: [],
      completedSkillsCount: 0,
      achievements: [],
      streak: {
        days: 0,
        lastActiveDate: null,
      },

      addActivePath: (path) => set((state) => {
        // Calculate total steps (skills) in the path
        const totalSteps = path.phases.reduce((acc, phase) => acc + phase.skills.length, 0);
        
        const newPath: ActivePath = {
          ...path,
          id: `path-${Date.now()}`,
          progress: 0,
          startedAt: Date.now(),
          completedSteps: 0,
          totalSteps,
          goalTitle: path.goalTitle || "Custom Skill Path",
        };
        
        // Unlock "Goal Setter" if this is their first path
        const newAchievements = [...state.achievements];
        if (!newAchievements.includes("goal-setter")) {
          newAchievements.push("goal-setter");
        }

        return { 
          activePaths: [newPath, ...state.activePaths],
          achievements: newAchievements,
          lastPath: path // keep legacy for compatibility
        };
      }),

      updatePathProgress: (pathId, progress, completedSteps) => set((state) => {
        const paths = state.activePaths.map(p => 
          p.id === pathId ? { ...p, progress, completedSteps } : p
        );
        
        // Check for "First Step" achievement
        const newAchievements = [...state.achievements];
        if (completedSteps > 0 && !newAchievements.includes("first-step")) {
          newAchievements.push("first-step");
        }
        
        // Check if path is 100% complete
        let newCompletedCount = state.completedSkillsCount;
        if (progress === 100) {
          newCompletedCount += 1;
        }

        return { 
          activePaths: paths,
          achievements: newAchievements,
          completedSkillsCount: newCompletedCount
        };
      }),

      removePath: (pathId) => set((state) => ({
        activePaths: state.activePaths.filter(p => p.id !== pathId)
      })),

      incrementCompletedSkills: () => set((state) => ({ 
        completedSkillsCount: state.completedSkillsCount + 1 
      })),

      unlockAchievement: (achievementId) => set((state) => {
        if (!state.achievements.includes(achievementId)) {
          return { achievements: [...state.achievements, achievementId] };
        }
        return state;
      }),

      checkAndUpdateStreak: () => set((state) => {
        const today = new Date().toDateString();
        const { lastActiveDate, days } = state.streak;

        if (lastActiveDate === today) {
          return state; // Already active today
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActiveDate === yesterday.toDateString()) {
          // Continuous streak
          const newDays = days + 1;
          const newAchievements = [...state.achievements];
          if (newDays >= 3 && !newAchievements.includes("consistent-learner")) {
            newAchievements.push("consistent-learner");
          }
          return {
            streak: { days: newDays, lastActiveDate: today },
            achievements: newAchievements
          };
        } else {
          // Streak broken or first day
          return {
            streak: { days: 1, lastActiveDate: today }
          };
        }
      }),

      // Chat
      chatSessions: [],
      activeChatId: null,
      addChatSession: (session) =>
        set((state) => ({ chatSessions: [session, ...state.chatSessions] })),
      updateChatSession: (id, messages) =>
        set((state) => ({
          chatSessions: state.chatSessions.map((s) =>
            s.id === id
              ? {
                  ...s,
                  messages,
                  updatedAt: Date.now(),
                  title: messages.find((m) => m.role === "user")?.content.slice(0, 50) || s.title,
                }
              : s
          ),
        })),
      setActiveChatId: (id) => set({ activeChatId: id }),
      deleteChatSession: (id) =>
        set((state) => ({
          chatSessions: state.chatSessions.filter((s) => s.id !== id),
          activeChatId: state.activeChatId === id ? null : state.activeChatId,
        })),

      // Legacy
      lastPath: null,
      setLastPath: (path) => set({ lastPath: path }),
      lastSimulation: null,
      setLastSimulation: (sim) => set({ lastSimulation: sim }),
    }),
    {
      name: "edupath-storage", // name of the item in the storage (must be unique)
      partialize: (state) => ({ 
        activePaths: state.activePaths,
        completedSkillsCount: state.completedSkillsCount,
        achievements: state.achievements,
        streak: state.streak,
        chatSessions: state.chatSessions,
        lastPath: state.lastPath,
        lastSimulation: state.lastSimulation
      }), // only save these fields
    }
  )
);

