import Sidebar from "@/components/Sidebar";
import ChatInterface from "@/components/ChatInterface";

export default function Home() {
  return (
    <main className="flex h-screen w-full bg-slate-50 overflow-hidden">
      {/* Left Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block h-full">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <section className="flex-1 flex flex-col h-full relative">
        <ChatInterface />
      </section>
    </main>
  );
}