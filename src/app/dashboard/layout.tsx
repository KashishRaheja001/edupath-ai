import { auth } from "@/lib/auth";
import { DashboardSidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // HACKATHON DEMO: Provide a default guest user if not logged in
  // Each browser tab gets a unique guest via sessionStorage (handled in Zustand store)
  const user = session?.user || {
    name: "Guest Learner",
    email: "guest@edupath.ai",
    image: "",
  };

  return (
    <div className="flex min-h-screen">
      <DashboardSidebar user={user} />
      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-20 md:pt-0">
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
