import { create } from "zustand";
import type { LearningPath, CareerSimulation } from "./schemas";

// Generate a unique guest ID per browser tab/session
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

  // Learning Path Persistence
  lastPath: LearningPath | null;
  setLastPath: (path: LearningPath | null) => void;

  // Career Simulation Persistence
  lastSimulation: CareerSimulation | null;
  setLastSimulation: (sim: CareerSimulation | null) => void;
}

export const useEduPathStore = create<EduPathStore>((set) => ({
  guestId: typeof window !== "undefined" ? getGuestId() : "server",

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

  // Learning Path
  lastPath: null,
  setLastPath: (path) => set({ lastPath: path }),

  // Simulation
  lastSimulation: null,
  setLastSimulation: (sim) => set({ lastSimulation: sim }),
}));
