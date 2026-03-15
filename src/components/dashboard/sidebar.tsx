"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Brain,
  LayoutDashboard,
  MessageSquare,
  Route,
  Target,
  Network,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/mentor", icon: MessageSquare, label: "AI Mentor" },
  { href: "/dashboard/learning-path", icon: Route, label: "Learning Path" },
  { href: "/dashboard/simulator", icon: Target, label: "Career Simulator" },
  { href: "/dashboard/skill-graph", icon: Network, label: "Skill Graph" },
];

export function DashboardSidebar({ user }: { user: any }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const userName = user?.name || "User";
  const userImage = user?.image || "";
  const userEmail = user?.email || "";
  const initials = userName.charAt(0).toUpperCase();

  const SidebarContent = () => (
    <div className="h-full flex flex-col pt-4 md:pt-0">
      <div className="p-6 pt-2 md:pt-6">
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">EduPath</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary glow"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {user ? (
        <div className="p-4 m-4 rounded-xl glass border-border/50 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 border border-primary/20">
              <AvatarImage src={userImage} alt={userName} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-col flex flex-1 min-w-0">
              <span className="text-sm font-semibold truncate">{userName}</span>
              <span className="text-xs text-muted-foreground truncate">
                {userEmail}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      ) : (
        <div className="p-4 m-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-indigo-600/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-primary font-semibold">Google Gemini</span>
          </p>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden fixed top-0 w-full glass z-40 border-b border-border/50 p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold">EduPath</span>
        </Link>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger>
            <div className="md:hidden inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground h-9 w-9">
              <Menu className="w-6 h-6" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 glass w-72 border-r-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="w-64 border-r border-border/50 glass fixed h-full z-40 hidden md:flex flex-col">
        <SidebarContent />
      </aside>
    </>
  );
}
