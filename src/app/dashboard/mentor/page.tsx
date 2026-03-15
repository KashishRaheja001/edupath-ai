"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  MessageSquare,
  Plus,
  Trash2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useRef, useEffect, useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useEduPathStore, type ChatSession, type ChatMessage } from "@/lib/store";

const suggestedQuestions = [
  "What skills should I learn to become a full-stack developer?",
  "Suggest 3 portfolio projects for a data science career",
  "How do I transition from frontend to backend development?",
  "What's the best way to learn system design?",
  "Find me the best YouTube courses for learning React",
  "What are the highest paying tech roles in 2025?",
];

function formatTime(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday)
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return (
    d.toLocaleDateString([], { month: "short", day: "numeric" }) +
    " " +
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  );
}

// WhatsApp-style typing indicator
function TypingIndicator() {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="glass rounded-2xl rounded-tl-md px-5 py-3 max-w-[80px]">
        <div className="flex items-center gap-[5px]">
          <span className="block w-[7px] h-[7px] rounded-full bg-primary/60 animate-[whatsapp-bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: "0ms" }} />
          <span className="block w-[7px] h-[7px] rounded-full bg-primary/60 animate-[whatsapp-bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: "200ms" }} />
          <span className="block w-[7px] h-[7px] rounded-full bg-primary/60 animate-[whatsapp-bounce_1.4s_infinite_ease-in-out]" style={{ animationDelay: "400ms" }} />
        </div>
      </div>
    </motion.div>
  );
}

// Markdown renderer component for rich chat formatting
function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => <h1 className="text-lg font-bold mt-3 mb-1">{children}</h1>,
        h2: ({ children }) => <h2 className="text-base font-bold mt-3 mb-1">{children}</h2>,
        h3: ({ children }) => <h3 className="text-sm font-bold mt-2 mb-1">{children}</h3>,
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
        li: ({ children }) => <li className="text-sm">{children}</li>,
        strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
        em: ({ children }) => <em className="italic text-foreground/80">{children}</em>,
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
            {children}
          </a>
        ),
        code: ({ children }) => (
          <code className="bg-background/50 text-pink-400 px-1.5 py-0.5 rounded text-xs font-mono">
            {children}
          </code>
        ),
        pre: ({ children }) => (
          <pre className="bg-background/50 rounded-lg p-3 overflow-x-auto mb-2 text-xs">
            {children}
          </pre>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-primary/50 pl-3 italic text-muted-foreground mb-2">
            {children}
          </blockquote>
        ),
        hr: () => <hr className="border-border/50 my-3" />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function MentorPage() {
  const {
    chatSessions,
    activeChatId,
    addChatSession,
    updateChatSession,
    setActiveChatId,
    deleteChatSession,
  } = useEduPathStore();

  const [messages, setMessages] = useState<DisplayMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages from active session on mount or session change
  useEffect(() => {
    if (activeChatId) {
      const session = chatSessions.find((s) => s.id === activeChatId);
      if (session) setMessages(session.messages);
    }
  }, [activeChatId, chatSessions]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const startNewChat = useCallback(() => {
    const newId = `chat-${Date.now()}`;
    const session: ChatSession = {
      id: newId,
      title: "New Conversation",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    addChatSession(session);
    setActiveChatId(newId);
    setMessages([]);
  }, [addChatSession, setActiveChatId]);

  const loadChat = useCallback(
    (session: ChatSession) => {
      setActiveChatId(session.id);
      setMessages(session.messages);
    },
    [setActiveChatId]
  );

  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault?.();
      if (!input.trim() || isStreaming) return;

      const userText = input.trim();
      setInput("");

      let chatId = activeChatId;
      if (!chatId) {
        chatId = `chat-${Date.now()}`;
        const session: ChatSession = {
          id: chatId,
          title: userText.slice(0, 50),
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        addChatSession(session);
        setActiveChatId(chatId);
      }

      const userMsg: DisplayMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: userText,
        timestamp: Date.now(),
      };

      const updatedMsgs = [...messages, userMsg];
      setMessages(updatedMsgs);

      const apiMessages = updatedMsgs.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      setIsStreaming(true);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: apiMessages }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`API error: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();

        const assistantMsg: DisplayMessage = {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "",
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);

        let fullText = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsg.id ? { ...m, content: fullText } : m
            )
          );
        }

        const finalMsgs = [...updatedMsgs, { ...assistantMsg, content: fullText }];
        updateChatSession(chatId, finalMsgs);
      } catch (err) {
        console.error("Chat error:", err);
        const errorMsg: DisplayMessage = {
          id: `error-${Date.now()}`,
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, errorMsg]);
      } finally {
        setIsStreaming(false);
      }
    },
    [input, isStreaming, activeChatId, messages, addChatSession, setActiveChatId, updateChatSession]
  );

  const showTypingIndicator =
    isStreaming && messages.length > 0 && messages[messages.length - 1]?.role === "user";

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-6rem)] flex gap-4">
      {/* Recent Chats Sidebar */}
      <motion.div
        className="hidden lg:flex flex-col w-72 glass rounded-2xl border border-border/50 overflow-hidden flex-shrink-0"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="p-4 border-b border-border/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-muted-foreground" />
            Recent Chats
          </h3>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={startNewChat}>
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {chatSessions.length === 0 ? (
            <div className="text-xs text-muted-foreground text-center py-8 px-4">
              No conversations yet. Start chatting!
            </div>
          ) : (
            chatSessions.map((session) => (
              <div
                key={session.id}
                className={`group flex items-center gap-2 p-3 rounded-xl cursor-pointer transition-all text-sm ${
                  activeChatId === session.id
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-accent/50"
                }`}
                onClick={() => loadChat(session)}
              >
                <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-xs font-medium">{session.title}</div>
                  <div className="text-[10px] text-muted-foreground">
                    {formatTime(session.updatedAt)}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChatSession(session.id);
                    if (activeChatId === session.id) {
                      setMessages([]);
                      setActiveChatId(null);
                    }
                  }}
                >
                  <Trash2 className="w-3 h-3 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </motion.div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <motion.div
          className="mb-4 flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Bot className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold">AI Career Mentor</h1>
              {isStreaming && (
                <Badge variant="outline" className="text-[10px] text-green-400 border-green-500/30 animate-pulse">
                  typing...
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Ask me anything about your career, skills, or learning path.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={startNewChat} className="gap-1">
              <Plus className="w-3.5 h-3.5" />
              New Chat
            </Button>
            {messages.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMessages([]);
                  setActiveChatId(null);
                }}
                className="gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Messages Area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center h-full text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold mb-2">
                Hi! I&apos;m your AI Career Mentor
              </h2>
              <p className="text-muted-foreground mb-8 max-w-md">
                I can help you with career advice, project ideas, skill recommendations,
                YouTube course links, and learning strategies.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
                {suggestedQuestions.map((q, i) => (
                  <motion.button
                    key={i}
                    className="text-left text-sm p-4 rounded-xl glass hover:border-primary/30 transition-all border border-transparent"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    onClick={() => setInput(q)}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}
                >
                  {m.role === "assistant" && (
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-md"
                        : "glass rounded-tl-md"
                    }`}
                  >
                    {m.role === "assistant" ? (
                      <MarkdownContent content={m.content} />
                    ) : (
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    )}
                    <div className={`text-[10px] mt-1.5 ${
                      m.role === "user" ? "text-primary-foreground/50" : "text-muted-foreground/50"
                    }`}>
                      {formatTime(m.timestamp)}
                    </div>
                  </div>
                  {m.role === "user" && (
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {showTypingIndicator && <TypingIndicator />}
        </div>

        {/* Input Area */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="glass rounded-2xl p-2 flex items-end gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about your career, skills, YouTube courses..."
              className="min-h-[48px] max-h-[120px] resize-none border-0 bg-transparent focus-visible:ring-0 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isStreaming || !input.trim()}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-xl h-10 w-10 flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] text-muted-foreground">
              Powered by AI via OpenRouter
            </Badge>
          </div>
        </form>
      </div>
    </div>
  );
}
