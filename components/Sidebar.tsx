"use client";
import { 
  Home, 
  MessageSquare, 
  User, 
  Settings, 
  Plus, 
  Stethoscope, 
  Activity,
  FileText
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navItems = [
  { name: "Overview", icon: Home, href: "/" },
  { name: "Consultations", icon: MessageSquare, href: "/" },
  { name: "Medical Records", icon: FileText, href: "/" },
  { name: "Vitals Tracker", icon: Activity, href: "/" },
];

const bottomNav = [
  { name: "Profile", icon: User, href: "/" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col bg-white border-r border-slate-200/60 shadow-sm">
      {/* Logo Area */}
      <div className="flex h-20 items-center gap-3 px-6 border-b border-slate-100 bg-slate-50/30">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-500/30">
          <Stethoscope size={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">MediAI</h1>
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Clinical Expert</p>
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto py-6 px-3">
        <div className="mb-2 px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Menu
        </div>
        <div className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-medical-50 text-medical-700"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                <div className={clsx(
                  "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
                  isActive ? "bg-white text-medical-600 shadow-sm" : "text-slate-400 group-hover:text-medical-500"
                )}>
                  <item.icon size={18} />
                </div>
                {item.name}
                {isActive && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-medical-500" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button 
          onClick={() => window.location.reload()}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 p-3.5 text-sm font-semibold text-white hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          <span>New Consultation</span>
        </button>
      </div>

      {/* Settings Modal (Simplified) */}
      <button 
        onClick={() => {
          const key = prompt("Enter your Gemini API Key:", localStorage.getItem("gemini_api_key") || "");
          if (key !== null) {
            localStorage.setItem("gemini_api_key", key);
            if (key) {
              alert("API Key saved locally!");
              window.location.reload();
            } else {
              alert("API Key cleared. Using environment default if available.");
              window.location.reload();
            }
          }
        }}
        className="border-t border-slate-100 p-4 w-full group transition-colors hover:bg-slate-50"
      >
        <div className="flex items-center gap-3 rounded-xl p-2 transition cursor-pointer">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
            <Settings size={20} />
          </div>
          <div className="flex-1 text-left">
            <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-700">Settings</p>
            <p className="text-xs text-slate-400">Configure API Key</p>
          </div>
        </div>
      </button>

      {/* User Profile */}
      <div className="p-4 pt-0">
        <div className="flex items-center gap-3 rounded-xl p-2 hover:bg-slate-50 transition cursor-pointer">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="User" 
            className="h-10 w-10 rounded-full bg-slate-100"
          />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-slate-700 truncate">Dr. Sarah J.</p>
            <p className="text-xs text-slate-400">General Practitioner</p>
          </div>
        </div>
      </div>
    </div>
  );
}