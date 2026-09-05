import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-text flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <h1 className="font-mono font-bold text-lg">Data Tool AI</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <a
            href="/resources"
            className="flex items-center gap-3 px-3 py-2 rounded-[--radius-sm] hover:bg-white/10 transition-colors text-sm"
          >
            <span className="w-4 h-4">📚</span>
            Resources
          </a>
          <a
            href="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-[--radius-sm] hover:bg-white/10 transition-colors text-sm"
          >
            <span className="w-4 h-4">⚙️</span>
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-white/10">
          <div className="text-xs text-white/50 truncate">
            {session.user?.email}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
