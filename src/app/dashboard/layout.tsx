import { Sidebar } from "@/components/dashboard/layout/Sidebar";
import { TopBar } from "@/components/dashboard/layout/TopBar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#09090b]">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <TopBar />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
