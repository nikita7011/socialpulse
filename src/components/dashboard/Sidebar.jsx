import React from "react";
import {
  LayoutDashboard,
  Users,
  FileText,
  Sparkles,
  CalendarDays,
  FileDown,
  Settings,
  Zap,
  Crown
} from "lucide-react";

export const sidebarItems = [
  { id: "overview", icon: <LayoutDashboard size={16} />, label: "Overview" },
  { id: "audience", icon: <Users size={16} />, label: "Audience" },
  { id: "content", icon: <FileText size={16} />, label: "Posts & Reach" },
  { id: "copilot", icon: <Sparkles size={16} />, label: "AI Insights", beta: true },
  { id: "campaigns", icon: <CalendarDays size={16} />, label: "Campaign Scheduler" },
  { id: "reports", icon: <FileDown size={16} />, label: "Monthly Reports" },
  { id: "settings", icon: <Settings size={16} />, label: "Settings" },
];

const NavItem = ({ icon, label, active, beta }) => (
  <div className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all duration-200 group ${active ? "bg-rose-50 text-rose-600" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
    <div className="flex items-center gap-3">
      <div className={`${active ? "text-rose-500" : "text-slate-400 group-hover:text-slate-600"}`}>
        {icon}
      </div>
      <span className={`text-[12px] font-semibold tracking-wide ${active ? "font-bold" : ""}`}>{label}</span>
    </div>
    {beta && (
      <span className="text-[9px] font-extrabold uppercase tracking-wider bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-md">
        BETA
      </span>
    )}
  </div>
);

export default function Sidebar({ activeTab, handleNavClick }) {
  return (
    <aside className="relative z-10 w-60 flex-shrink-0 flex flex-col border-r border-slate-100 bg-white">
      {/* Brand Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #f43f5e, #a855f7)" }}>
          <Zap size={16} className="text-white" />
        </div>
        <span className="text-base font-bold text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>SocialPulse</span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2">Analytics</div>
        {sidebarItems.slice(0, 4).map((item) => (
          <div key={item.id} onClick={() => handleNavClick(item.id)}>
            <NavItem icon={item.icon} label={item.label} active={activeTab === item.id} beta={item.beta} />
          </div>
        ))}
        
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 mb-2 mt-4">Management</div>
        {sidebarItems.slice(4).map((item) => (
          <div key={item.id} onClick={() => handleNavClick(item.id)}>
            <NavItem icon={item.icon} label={item.label} active={activeTab === item.id} beta={item.beta} />
          </div>
        ))}
      </nav>

      {/* Pro Plan Card */}
      <div className="m-3 rounded-2xl p-4.5 relative overflow-hidden border border-rose-100/10 shadow-md" style={{ background: "linear-gradient(145deg, #ff5e97, #e11d48)" }}>
        <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 -translate-y-6 translate-x-6 bg-white" />
        <div className="flex items-center gap-2 mb-2">
          <Crown size={14} className="text-white" />
          <span className="text-xs font-extrabold text-white">Pro Plan</span>
        </div>
        <p className="text-[10px] text-white/90 mb-3.5 leading-relaxed font-medium">Unlock advanced insights, custom reports & more.</p>
        <div className="text-[9px] text-white/70 mb-0.5 font-medium">Billing Period</div>
        <div className="text-xs font-bold text-white mb-2.5">May 1 - May 31, 2025</div>
        <div className="text-[9px] text-white/70 mb-0.5 font-medium">Next Billing Date</div>
        <div className="text-xs font-bold text-white mb-4.5">June 1, 2025</div>
        
        <button onClick={() => alert("You are already on the Pro Plan!")} className="w-full text-[11px] font-bold py-2 rounded-xl text-rose-600 bg-white hover:bg-rose-50 transition-all shadow-sm mb-2.5">
          Manage Plan
        </button>
        
        <div className="text-center">
          <button onClick={() => alert("Showing plan benefits...")} className="text-[10px] font-semibold text-white/90 hover:text-white transition-colors flex items-center justify-center gap-1 mx-auto">
            View Plan Benefits →
          </button>
        </div>
      </div>
    </aside>
  );
}
