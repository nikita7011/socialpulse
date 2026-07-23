import React, { useState } from "react";
import { CalendarDays, CheckSquare, Layers, Plus, X, Sparkles, Zap, Trash2, Clock, Send } from "lucide-react";
import { platformColors } from "@/lib/frontend/constants";

export default function CampaignsTab({ session }) {
  const [campaignView, setCampaignView] = useState("kanban"); // "kanban" or "list"
  const [showNewCampaignModal, setShowNewCampaignModal] = useState(false);
  const [newCampaignTitle, setNewCampaignTitle] = useState("");
  const [newCampaignPlatform, setNewCampaignPlatform] = useState("Instagram");
  const [newCampaignDate, setNewCampaignDate] = useState("2026-07-24");
  const [newCampaignTime, setNewCampaignTime] = useState("10:30 AM");
  const [newCampaignCaption, setNewCampaignCaption] = useState("");
  const [scheduledCampaigns, setScheduledCampaigns] = useState([
    { id: 1, title: "Q3 Brand Partnership Teaser", platform: "Instagram", status: "scheduled", date: "Jul 24, 2026 @ 10:30 AM", caption: "Big things dropping this quarter with our partners! ⚡ #CreatorEconomy", author: "Nikita G.", estReach: "45.2K" },
    { id: 2, title: "SQL Analytics Tip Carousel", platform: "LinkedIn", status: "review", date: "Jul 26, 2026 @ 2:00 PM", caption: "5 hidden SQL queries top creators use to audit audience drop-offs 📊", author: "Alex R.", estReach: "62.8K" },
    { id: 3, title: "Behind the Scenes Workspace Reel", platform: "YouTube", status: "published", date: "Jul 18, 2026 @ 11:00 AM", caption: "How we built our studio lighting setup for under $300 💡", author: "Nikita G.", actualReach: "42.5K views" },
    { id: 4, title: "Algorithm Mythbusting Thread", platform: "Twitter", status: "draft", date: "Jul 29, 2026 @ 4:15 PM", caption: "Stop chasing shadowban fixes. Here is what algorithm crawlers actually check...", author: "Nikita G.", estReach: "28.1K" }
  ]);

  const handleCreateCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignTitle.trim()) return;
    const newCamp = {
      id: Date.now(),
      title: newCampaignTitle.trim(),
      platform: newCampaignPlatform,
      status: "scheduled",
      date: `${newCampaignDate} @ ${newCampaignTime}`,
      caption: newCampaignCaption.trim() || `Excited to share our new ${newCampaignTitle} drops! 🚀`,
      author: session?.user?.user_metadata?.full_name?.split(" ")[0] || "Nikita G.",
      estReach: "38.5K"
    };
    setScheduledCampaigns(prev => [newCamp, ...prev]);
    setNewCampaignTitle("");
    setNewCampaignCaption("");
    setShowNewCampaignModal(false);
  };

  const handleTriggerCampaignNow = (campId) => {
    setScheduledCampaigns(prev => prev.map(c => c.id === campId ? { ...c, status: "published", actualReach: "1.2K initial views" } : c));
  };

  const handleDeleteCampaign = (campId) => {
    setScheduledCampaigns(prev => prev.filter(c => c.id !== campId));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white bg-gradient-to-tr from-[#FF2E88] to-[#a855f7]">
              <CalendarDays size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Campaign Scheduler &amp; Auto-Publisher
            </h1>
            <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-purple-100 text-purple-700 rounded-full border border-purple-200">
              Cross-Platform Pipeline
            </span>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Plan cross-platform content drops, manage team review stages, and let PulseAI trigger posts at peak engagement windows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
            <button
              onClick={() => setCampaignView("kanban")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${campaignView === "kanban" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
            >
              <CheckSquare size={13} />
              <span>Kanban Board</span>
            </button>
            <button
              onClick={() => setCampaignView("list")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${campaignView === "list" ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Layers size={13} />
              <span>List View</span>
            </button>
          </div>

          <button
            onClick={() => setShowNewCampaignModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <Plus size={15} />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Inline Schedule Modal Card when open */}
      {showNewCampaignModal && (
        <div className="rounded-2xl border-2 border-pink-300 bg-gradient-to-br from-white to-pink-50/30 p-6 shadow-xl relative animate-fadeIn">
          <button
            onClick={() => setShowNewCampaignModal(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-[#FF2E88]" />
            <h3 className="text-base font-extrabold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>
              Create &amp; Schedule New Content Drop
            </h3>
          </div>

          <form onSubmit={handleCreateCampaign} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Campaign Title</label>
              <input
                required
                value={newCampaignTitle}
                onChange={e => setNewCampaignTitle(e.target.value)}
                placeholder="e.g. Q3 Feature Announcement Reel"
                className="w-full bg-white border border-slate-200 focus:border-[#FF2E88] rounded-xl px-3.5 py-2 text-slate-800 font-medium focus:outline-none shadow-xs"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Target Platform</label>
              <select
                value={newCampaignPlatform}
                onChange={e => setNewCampaignPlatform(e.target.value)}
                className="w-full bg-white border border-slate-200 focus:border-[#FF2E88] rounded-xl px-3.5 py-2 text-slate-800 font-medium focus:outline-none shadow-xs"
              >
                <option value="Instagram">Instagram (Reels / Carousels)</option>
                <option value="LinkedIn">LinkedIn (Thought Leadership)</option>
                <option value="YouTube">YouTube (Shorts / Long-form)</option>
                <option value="Threads">Threads (Meta Conversations)</option>
                <option value="Twitter">Twitter / X (Thread)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px] flex items-center justify-between">
                <span>Schedule Date &amp; Time</span>
                <span className="text-[10px] text-pink-600 font-bold flex items-center gap-1">
                  <Zap size={10} /> AI Optimal: Tue 10:30 AM
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={newCampaignDate}
                  onChange={e => setNewCampaignDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none shadow-xs"
                />
                <input
                  type="text"
                  value={newCampaignTime}
                  onChange={e => setNewCampaignTime(e.target.value)}
                  placeholder="10:30 AM"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none shadow-xs"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Post Caption / Hook Outline</label>
              <textarea
                value={newCampaignCaption}
                onChange={e => setNewCampaignCaption(e.target.value)}
                placeholder="Write your hook or paste PulseAI generated caption here..."
                rows={2}
                className="w-full bg-white border border-slate-200 focus:border-[#FF2E88] rounded-xl px-3.5 py-2 text-slate-800 font-medium focus:outline-none shadow-xs resize-none"
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowNewCampaignModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] text-white font-bold shadow-md hover:opacity-95 transition-all"
              >
                Schedule Campaign →
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kanban Board View */}
      {campaignView === "kanban" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: "draft", label: "Drafting", badgeColor: "bg-amber-100 text-amber-700 border-amber-200", dot: "bg-amber-500" },
            { id: "review", label: "In Review", badgeColor: "bg-purple-100 text-purple-700 border-purple-200", dot: "bg-purple-500" },
            { id: "scheduled", label: "Scheduled for Release", badgeColor: "bg-blue-100 text-blue-700 border-blue-200", dot: "bg-blue-500" },
            { id: "published", label: "Published Live", badgeColor: "bg-emerald-100 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" }
          ].map(column => {
            const colItems = scheduledCampaigns.filter(c => c.status === column.id);
            return (
              <div key={column.id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 flex flex-col gap-3 min-h-[420px]">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.dot}`} />
                    <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{column.label}</h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${column.badgeColor}`}>
                    {colItems.length}
                  </span>
                </div>

                {colItems.length === 0 ? (
                  <div className="flex-1 rounded-xl border border-dashed border-slate-200 bg-white/50 flex flex-col items-center justify-center p-6 text-center">
                    <span className="text-[11px] font-semibold text-slate-400">No campaigns in {column.label.toLowerCase()}</span>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {colItems.map(item => (
                      <div key={item.id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-all flex flex-col gap-2.5 group relative">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-wider text-white bg-gradient-to-tr ${platformColors[item.platform] || "from-pink-500 to-rose-500"}`}>
                            {item.platform}
                          </span>
                          <button
                            onClick={() => handleDeleteCampaign(item.id)}
                            className="text-slate-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Delete campaign"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <h4 className="text-xs font-bold text-slate-800 leading-snug">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 bg-slate-50 p-2 rounded-lg italic">
                          &ldquo;{item.caption}&rdquo;
                        </p>

                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-2 border-t border-slate-100">
                          <span className="flex items-center gap-1 truncate max-w-[140px]" title={item.date}>
                            <Clock size={11} className="text-slate-400" />
                            {item.date}
                          </span>
                          <span className="font-bold text-slate-700">
                            {item.actualReach ? item.actualReach : `Est: ${item.estReach}`}
                          </span>
                        </div>

                        {item.status !== "published" && (
                          <div className="flex gap-1.5 pt-1">
                            <button
                              onClick={() => handleTriggerCampaignNow(item.id)}
                              className="flex-1 py-1 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-[10px] border border-pink-200/60 transition-colors flex items-center justify-center gap-1"
                            >
                              <Send size={10} /> Trigger Now
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* List View Table */
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <table className="w-full text-xs min-w-[650px] text-left">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                  <th className="px-4 py-3">Campaign Title</th>
                  <th className="px-4 py-3">Platform</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Scheduled Date</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Est/Actual Reach</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scheduledCampaigns.map(camp => (
                  <tr key={camp.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-800">{camp.title}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-tr ${platformColors[camp.platform] || "from-pink-500 to-rose-500"}`}>
                        {camp.platform}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${camp.status === "published" ? "bg-emerald-100 text-emerald-700" : (camp.status === "scheduled" ? "bg-blue-100 text-blue-700" : "bg-purple-100 text-purple-700")}`}>
                        {camp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-500 font-medium">{camp.date}</td>
                    <td className="px-4 py-3 text-slate-700 font-bold">{camp.author}</td>
                    <td className="px-4 py-3 text-emerald-600 font-bold">{camp.actualReach || camp.estReach}</td>
                    <td className="px-4 py-3 text-right">
                      {camp.status !== "published" && (
                        <button
                          onClick={() => handleTriggerCampaignNow(camp.id)}
                          className="px-2.5 py-1 rounded bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-[10px] mr-2"
                        >
                          Publish Now
                        </button>
                      )}
                      <button onClick={() => handleDeleteCampaign(camp.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
