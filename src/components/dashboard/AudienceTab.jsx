import React from "react";
import { TrendingUp, Eye, Heart, UserPlus, FileDown, Info } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";

function Sparkline({ data, color }) {
  if (!data || data.length === 0) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const norm = data.map(v => (v - min) / (max - min || 1));
  const w = 180, h = 32;
  const pts = norm.map((v, i) => `${(i / (norm.length - 1)) * w},${h - v * h}`).join(" ");
  return (
    <svg className="w-full h-8" viewBox={`0 0 ${w} ${h}`} fill="none" preserveAspectRatio="none">
      <polyline points={pts} stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={w} cy={h - norm[norm.length - 1] * h} r={3} fill={color} />
    </svg>
  );
}


const getKpiIcon = (label) => {
    switch (label) {
      case "Engagement Rate": return <TrendingUp size={16} />;
      case "Total Reach": return <Eye size={16} />;
      case "Total Interactions": return <Heart size={16} />;
      case "Followers": return <UserPlus size={16} />;
      case "Followers Count": return <UserPlus size={16} />;
      case "Followers Gained": return <TrendingUp size={16} />;
      case "Unfollowers (Lost)": return <TrendingUp size={16} className="rotate-180" />;
      case "Net Growth": return <TrendingUp size={16} />;
      default: return <TrendingUp size={16} />;
    }
};

function KpiCard({ label, value, sub, trend, trendUp, data, color }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm min-h-[145px] group hover:border-rose-100 transition-all duration-300">
      {/* Header: Label + Info icon & Icon Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 tracking-wide">
          {label}
          <Info size={10} className="text-slate-300" title={sub} />
        </div>
        <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-100/50 flex items-center justify-center flex-shrink-0">
          {getKpiIcon(label)}
        </div>
      </div>

      {/* Middle: Value & Trend */}
      <div className="mt-2">
        <div className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
          {value}
        </div>
        <div className="text-[10px] text-rose-500 font-extrabold mt-1 flex items-center gap-1">
          {trend}
        </div>
      </div>

      {/* Bottom: Sparkline */}
      <div className="mt-3 w-full flex justify-start">
        <Sparkline data={data} color="#f43f5e" />
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, beta }) {
  return (
    <button className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${
      active
        ? "bg-rose-50/70 text-rose-600 border border-rose-100/30 shadow-[0_2px_8px_rgba(225,29,72,0.02)]"
        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50/50"
    }`}>
      <span className={active ? "text-rose-500" : "text-slate-400 group-hover:text-slate-600"}>{icon}</span>
      <span className="flex-1 text-left">{label}</span>
      {beta && <span className="text-[8px] font-bold uppercase tracking-wider bg-rose-50 text-rose-500 border border-rose-100 rounded px-1.5 py-0.5 ml-auto">Beta</span>}
    </button>
  );
}


const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const total = payload.reduce((sum, p) => sum + Number(p.value || 0), 0);
  const formatVal = (v) => v >= 1000 ? `${(v/1000).toFixed(1)}K` : v;
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-3 text-xs shadow-xl min-w-[130px] relative z-50">
      <div className="text-slate-800 font-extrabold mb-1.5" style={{ fontFamily: "Outfit, sans-serif" }}>{label}</div>
      <div className="flex flex-col gap-1.5">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: p.color || p.fill }} />
              <span className="text-slate-500 font-medium">{p.name}</span>
            </div>
            <span className="font-bold text-slate-800">{formatVal(p.value)}</span>
          </div>
        ))}
        <div className="border-t border-slate-100 mt-1.5 pt-1.5 flex items-center justify-between font-bold text-slate-800">
          <span>Total</span>
          <span>{formatVal(total)}</span>
        </div>
      </div>
    </div>
  );
};

// --- Main Dashboard Component ---


export default function AudienceTab({ 
  followerStats, 
  followerSparkline,
  engagementSparkline,
  interactSparkline,
  reachSparkline,
  audienceGrowthDataMapped
}) {
  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
          {/* Dynamic Header */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Audience Insights 👋</h1>
                <p className="text-sm text-slate-500 mt-0.5">Demographics and growth trajectory of your channels.</p>
              </div>

              {/* KPI Cards Row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Followers Count" value={followerStats.total.toLocaleString()} sub="Lifetime followers" trend="+4.2% milestone" trendUp={true} data={followerSparkline} color="#8b5cf6" />
                <KpiCard label="Followers Gained" value={`+${followerStats.gained.toLocaleString()}`} sub="Net new joins" trend="+12.3% peak" trendUp={true} data={engagementSparkline} color="#10b981" />
                <KpiCard label="Unfollowers (Lost)" value={`-${followerStats.lost.toLocaleString()}`} sub="Audience churn rate" trend="-1.5% average" trendUp={false} data={interactSparkline} color="#f43f5e" />
                <KpiCard label="Net Growth" value={followerStats.net >= 0 ? `+${followerStats.net.toLocaleString()}` : followerStats.net.toLocaleString()} sub="Growth speed vector" trend="+6.4% momentum" trendUp={true} data={reachSparkline} color="#06b6d4" />
              </div>

              {/* Audience growth timeline area chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Audience Growth Timeline</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Follower snapshot trends showing monthly acquisition speed</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={audienceGrowthDataMapped} margin={{ top: 10, right: 15, left: -10, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorInsta" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorLink" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                        <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                        <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconSize={10} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                        <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#ec4899" strokeWidth={2.2} fillOpacity={1} fill="url(#colorInsta)" />
                        <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#a855f7" strokeWidth={1.8} fillOpacity={1} fill="url(#colorLink)" />
                        <Area type="monotone" dataKey="youtube" name="YouTube" stroke="#f43f5e" strokeWidth={1.8} fillOpacity={0} />
                        <Area type="monotone" dataKey="twitter" name="Twitter" stroke="#38bdf8" strokeWidth={1.8} fillOpacity={0} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Live Activity feed */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>⚡ Live Activity Feed</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Real-time signals and database hooks</p>
                  </div>
                  <div className="flex-1 flex flex-col gap-4 mt-5">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse"></div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-700 block">Instagram creator handle synced</span>
                        <span className="text-[10px] text-slate-400 font-medium">2 min ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-violet-500"></div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-700 block">Weekly SQL analytics report ready</span>
                        <span className="text-[10px] text-slate-400 font-medium">10 min ago</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                      <div className="flex-1">
                        <span className="text-xs font-semibold text-slate-700 block">Follower milestone reached (+5k)</span>
                        <span className="text-[10px] text-slate-400 font-medium">Yesterday</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => alert("Activity log details is locked on Pro Plan.")}
                    className="w-full text-xs font-bold py-2.5 rounded-xl text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100/50 transition-all shadow-sm">
                    View Full System Log
                  </button>
                </div>
              </div>

              {/* Gained vs Lost List Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Followers gained */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Recent Followers Gained</h3>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {followerStats.gainedList?.map(f => (
                      <div key={f.handle} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xs">
                            {f.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{f.handle}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{f.name}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          Followed {f.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Followers lost */}
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>Recent Unfollowers (Lost)</h3>
                  <div className="divide-y divide-slate-100 max-h-[300px] overflow-y-auto" style={{ scrollbarWidth: "none" }}>
                    {followerStats.lostList?.map(f => (
                      <div key={f.handle} className="flex items-center justify-between py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center font-bold text-xs">
                            {f.avatar}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-800">{f.handle}</div>
                            <div className="text-[10px] text-slate-400 font-medium">{f.name}</div>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200/60">
                          Unfollowed {f.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
    </div>
  );
}
