import React, { useState } from "react";
import { Settings, Trash2, Mail, Users, CheckCircle2, AlertCircle } from "lucide-react";
import { Instagram, Linkedin, Youtube, Twitter } from "../icons/Icons";

export default function SettingsTab() {
  const [settingsTab, setSettingsTab] = useState("channels"); // "channels", "ai", "team", "notifications"
  const [brandTone, setBrandTone] = useState("Authoritative & Data-Driven");
  const [autoHashtagCount, setAutoHashtagCount] = useState(6);
  const [autoReplyComments, setAutoReplyComments] = useState(true);
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: "Nikita Gandhi", email: "nikita@socialpulse.dev", role: "Owner & Admin", avatar: "NG" },
    { id: 2, name: "Alex Rivera", email: "alex.r@socialpulse.dev", role: "Content Editor", avatar: "AR" },
    { id: 3, name: "Sam Chen", email: "sam.c@socialpulse.dev", role: "Data Analyst", avatar: "SC" }
  ]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("Content Editor");

  const handleInviteTeamMember = (e) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes("@")) return;
    const namePart = inviteEmail.split("@")[0];
    const cleanName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newMember = {
      id: Date.now(),
      name: cleanName,
      email: inviteEmail.trim(),
      role: inviteRole,
      avatar: cleanName.substring(0, 2).toUpperCase()
    };
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteEmail("");
    alert(`Invite sent to ${inviteEmail} for role ${inviteRole}!`);
  };

  const handleRemoveMember = (id) => {
    if (teamMembers.length <= 1) {
      alert("Cannot remove the last team member (Owner).");
      return;
    }
    setTeamMembers((prev) => prev.filter(m => m.id !== id));
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn p-8">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white bg-gradient-to-tr from-[#FF2E88] to-[#f59e0b]">
              <Settings size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Workspace &amp; Account Settings
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Manage connected social APIs, configure PulseAI tone preferences, and invite team members.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60 self-start">
          {[
            { id: "channels", label: "Connected Channels" },
            { id: "ai", label: "PulseAI Settings" },
            { id: "team", label: "Team Members" },
            { id: "notifications", label: "Notifications" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setSettingsTab(t.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${settingsTab === t.id ? "bg-white text-slate-800 shadow-xs" : "text-slate-500 hover:text-slate-700"}`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Tab 1: Connected Social Channels */}
      {settingsTab === "channels" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: "Instagram Business", handle: "@nikita7011", status: "Connected", sync: "Auto-syncing every 15m", icon: <Instagram size={30} colorful={true} /> },
            { name: "LinkedIn Creator Profile", handle: "Nikita Gandhi", status: "Connected", sync: "Auto-syncing every 15m", icon: <Linkedin size={30} colorful={true} /> },
            { name: "YouTube Studio API", handle: "Nikita Gandhi Tech", status: "Connected", sync: "Token expires in 64 days", icon: <Youtube size={30} colorful={true} /> },
            { name: "X (Twitter) Developer API", handle: "@nikita7011_x", status: "Connected", sync: "Auto-syncing every 15m", icon: <Twitter size={30} colorful={true} /> }
          ].map((ch, i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-13 h-13 rounded-2xl bg-white border border-slate-100 p-2.5 flex items-center justify-center shadow-md flex-shrink-0">
                    {ch.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">{ch.name}</h4>
                    <span className="text-xs text-slate-500 font-medium">{ch.handle}</span>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${ch.status === "Connected" ? "bg-emerald-50 text-emerald-600 border border-emerald-200/60" : "bg-slate-100 text-slate-500"}`}>
                  {ch.status}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                <span className="text-[11px] text-slate-400 font-semibold">{ch.sync}</span>
                <button
                  onClick={() => alert(ch.status === "Connected" ? `Refreshed API OAuth token for ${ch.name}!` : `Connecting to ${ch.name} via secure OAuth...`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold border border-slate-200/60 transition-colors"
                >
                  {ch.status === "Connected" ? "Refresh Token" : "+ Connect Account"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sub-Tab 2: PulseAI Copilot Settings */}
      {settingsTab === "ai" && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">PulseAI Tone &amp; Generation Rules</h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-700">Default Brand Tone of Voice</label>
              <select
                value={brandTone}
                onChange={e => setBrandTone(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#FF2E88]"
              >
                <option value="Authoritative & Data-Driven">Authoritative &amp; Data-Driven (Tech Founders / SaaS)</option>
                <option value="Casual & Storytelling">Casual &amp; Storytelling (Personal Branding)</option>
                <option value="Viral & Fast-Paced">Viral &amp; Fast-Paced (High-Energy Reels / YouTube Shorts)</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5 mt-2">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Auto-Hashtag Recommendation Count</span>
                <span className="text-[#FF2E88]">{autoHashtagCount} Hashtags</span>
              </div>
              <input
                type="range"
                min="3"
                max="15"
                value={autoHashtagCount}
                onChange={e => setAutoHashtagCount(Number(e.target.value))}
                className="w-full accent-[#FF2E88]"
              />
              <span className="text-[11px] text-slate-400 font-medium">Controls how many curated tags PulseAI appends to generated captions.</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Automation &amp; Engagement Assistant</h3>
            
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <h4 className="text-xs font-bold text-slate-800">AI Auto-Reply Suggestions</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Draft instant 1-click comment replies inside live activity feed.</p>
              </div>
              <button
                onClick={() => setAutoReplyComments(!autoReplyComments)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${autoReplyComments ? "bg-emerald-500 text-white" : "bg-slate-300 text-slate-700"}`}
              >
                {autoReplyComments ? "Enabled" : "Disabled"}
              </button>
            </div>

            <div className="flex justify-end mt-auto pt-4">
              <button
                onClick={() => alert("✅ PulseAI Preferences saved across all workspace models!")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
              >
                Save AI Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sub-Tab 3: Team Members */}
      {settingsTab === "team" && (
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Invite New Workspace Member</h3>
            <form onSubmit={handleInviteTeamMember} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="colleague@example.com"
                value={inviteEmail}
                onChange={e => setInviteEmail(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#FF2E88] focus:bg-white transition-all"
              />
              <select
                value={inviteRole}
                onChange={e => setInviteRole(e.target.value)}
                className="sm:w-48 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#FF2E88] focus:bg-white transition-all"
              >
                <option value="Admin">Admin</option>
                <option value="Content Editor">Content Editor</option>
                <option value="Data Analyst">Data Analyst</option>
                <option value="Viewer">Viewer Only</option>
              </select>
              <button
                type="submit"
                disabled={!inviteEmail}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs shadow-md hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex flex-shrink-0 items-center justify-center gap-2"
              >
                <Mail size={14} /> Send Invite
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3.5">Team Member</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {teamMembers.map(member => (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-[10px] shadow-sm bg-gradient-to-tr from-[#FF2E88] to-[#f59e0b]">
                        {member.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-slate-800">{member.name}</div>
                        <div className="text-[11px] text-slate-500 font-medium">{member.email}</div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md text-[11px]">
                        {member.role}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span className="font-bold text-emerald-600 text-[11px]">Active</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remove member"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-Tab 4: Notifications */}
      {settingsTab === "notifications" && (
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center gap-3 min-h-[300px]">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <AlertCircle size={28} className="text-slate-300" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-800">Notification Preferences</h4>
            <p className="text-xs text-slate-500 font-medium mt-1 max-w-sm">
              Push notifications and email digest routing controls will be available in the upcoming v1.2 release.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
