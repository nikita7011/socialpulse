import React, { useState } from "react";
import { Search, ChevronDown, TrendingUp, Eye, Heart, UserPlus, Info } from "lucide-react";
import {
  BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
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


export default function OverviewTab({ 
  data, 
  isDefault, 
  kpis, 
  followerStats, 
  followersChartData,
  engagementSparkline,
  reachSparkline,
  interactSparkline,
  followerSparkline,
  platformBarDataMapped,
  audienceGrowthDataMapped,
  formatDataFallback,
  testerUsername, 
  setTesterUsername, 
  triggerSeededProfile, 
  handleTestUsername 
}) {
  const [chartTab, setChartTab] = useState("bar");
  
  const getFormatDonutData = () => {
    if (!data || !data.posts) return formatDataFallback;
    const counts = { video: 0, carousel: 0, image: 0, text: 0 };
    let total = 0;
    data.posts.forEach(p => {
      const type = p.post_type?.toLowerCase();
      if (type in counts) {
        counts[type]++;
        total++;
      }
    });
    if (total === 0) return formatDataFallback;
    return [
      { name: "Videos", value: Math.round((counts.video / total) * 100), color: "#ec4899" },
      { name: "Carousels", value: Math.round((counts.carousel / total) * 100), color: "#8b5cf6" },
      { name: "Images", value: Math.round((counts.image / total) * 100), color: "#06b6d4" },
      { name: "Text", value: Math.round((counts.text / total) * 100), color: "#f59e0b" },
    ];
  };

  
  const formatDonutData = getFormatDonutData();

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
          {/* Creator Handle Analyzer Search Bar Card */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Left Column (Search Input) */}
                  <div className="lg:col-span-3 flex flex-col justify-between">
                    <h3 className="text-xs font-black text-rose-500 mb-2.5 uppercase tracking-wider" style={{ fontFamily: "Outfit, sans-serif" }}>
                      Analyze any creator
                    </h3>
                    <form onSubmit={handleTestUsername} className="relative w-full mb-2">
                      <input
                        value={testerUsername}
                        onChange={e => setTesterUsername(e.target.value)}
                        placeholder="Enter handle (e.g. @mrbeast, @nike)"
                        className="w-full bg-white border border-slate-200 focus:border-rose-300 focus:ring-1 focus:ring-rose-300 rounded-xl pl-4 pr-10 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-colors shadow-sm"
                      />
                      <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-rose-500 hover:text-rose-600 transition-colors">
                        <Search size={14} />
                      </button>
                    </form>
                    <p className="text-[10px] text-slate-400 font-semibold">Sync metrics instantly and get AI-powered insights.</p>
                  </div>
                  
                  {/* Right Column (Popular Tags) */}
                  <div className="lg:col-span-2 flex flex-col justify-start">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">Popular right now</span>
                    <div className="flex flex-wrap gap-1.5">
                      {["@mrbeast", "@nike", "@natgeo", "@chrisbrownofficial", "@garyvee"].map(tag => (
                        <button key={tag} onClick={() => triggerSeededProfile(tag)}
                          className="text-[10px] font-bold text-rose-600 bg-rose-50/40 hover:bg-rose-50 border border-rose-100/50 rounded-xl px-2.5 py-1.5 transition-all">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* KPI Cards Row (Exact Figma metrics) */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <KpiCard label="Engagement Rate" value={isDefault ? "8.32%" : `${kpis.avg_engagement_rate.toFixed(2)}%`} sub="avg across platforms" trend="↑ 12.6% vs last 7 days" trendUp={true} data={engagementSparkline} color="#f43f5e" />
                <KpiCard label="Total Reach" value={isDefault ? "1.54M" : (kpis.total_reach >= 1000000 ? `${(kpis.total_reach / 1000000).toFixed(1)}M` : kpis.total_reach.toLocaleString())} sub="unique impressions" trend="↑ 18.7% vs last 7 days" trendUp={true} data={reachSparkline} color="#f43f5e" />
                <KpiCard label="Total Interactions" value={isDefault ? "128.4K" : (kpis.total_interactions >= 1000 ? `${(kpis.total_interactions / 1000).toFixed(1)}K` : kpis.total_interactions.toLocaleString())} sub="likes · comments · shares" trend="↑ 16.3% vs last 7 days" trendUp={true} data={interactSparkline} color="#f43f5e" />
                <KpiCard label="Followers" value={isDefault ? "426.7K" : followerStats.total.toLocaleString()} sub="lifetime audience" trend="↑ 9.8% vs last 7 days" trendUp={true} data={followerSparkline} color="#f43f5e" />
              </div>

              {/* Charts Row - Side-by-Side (Figma Layout) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                
                {/* Platform Distribution / Growth Area Chart - Left (2/3 width) */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-sm font-bold text-rose-600" style={{ fontFamily: "Outfit, sans-serif" }}>
                        Platform Engagement Distribution
                      </div>
                    </div>
                    <div className="flex gap-1.5 items-center">
                      {/* Tab Selector matching Figma */}
                      <div className="flex gap-1 bg-slate-50 border border-slate-200/50 rounded-xl p-0.5">
                        {["Engagement", "Audience Growth"].map(t => {
                          const tabId = t === "Engagement" ? "bar" : "line";
                          const isActive = chartTab === tabId;
                          return (
                            <button key={t} onClick={() => setChartTab(tabId)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                                isActive 
                                  ? "bg-rose-500 text-white shadow-sm" 
                                  : "text-slate-400 hover:text-slate-600"
                              }`}>
                              {t}
                            </button>
                          );
                        })}
                      </div>

                      {/* Period Dropdown matching Figma */}
                      <button className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50/30 border border-rose-100/50 hover:bg-rose-50 rounded-xl px-2.5 py-1.5 transition-all shadow-sm"
                        onClick={() => alert("Period range is locked on Pro Plan.")}>
                        Last 7 Days
                        <ChevronDown size={11} className="text-rose-400" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Legend list matching Figma */}
                  <div className="flex gap-4 mb-4 text-[10px] font-bold text-slate-500 pl-1">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-[#ec4899]" />
                      Likes
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-[#fecdd3]" />
                      Comments
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-sm bg-[#a855f7]" />
                      Shares
                    </div>
                  </div>
                  
                  <div className="h-48 mt-2">
                    <ResponsiveContainer key={chartTab} width="100%" height="100%">
                      {chartTab === "bar" ? (
                        <BarChart data={platformBarDataMapped} barSize={18} barGap={2}>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                          <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                          <Tooltip content={<CustomTooltip />} cursor={false} />
                          <Bar dataKey="shares" name="Shares" stackId="a" fill="#a855f7" radius={[0,0,0,0]} />
                          <Bar dataKey="comments" name="Comments" stackId="a" fill="#fecdd3" radius={[0,0,0,0]} />
                          <Bar dataKey="likes" name="Likes" stackId="a" fill="#ec4899" radius={[4,4,0,0]} />
                        </BarChart>
                      ) : (
                        <AreaChart data={audienceGrowthDataMapped}>
                          <defs>
                            <linearGradient id="sp-gig" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient>
                            <linearGradient id="sp-gli" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#a855f7" stopOpacity={0.25}/><stop offset="95%" stopColor="#a855f7" stopOpacity={0}/></linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                          <XAxis dataKey="month" tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : v} />
                          <Tooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="instagram" name="Instagram" stroke="#ec4899" strokeWidth={1.8} fill="url(#sp-gig)" dot={false} />
                          <Area type="monotone" dataKey="linkedin" name="LinkedIn" stroke="#a855f7" strokeWidth={1.8} fill="url(#sp-gli)" dot={false} />
                        </AreaChart>
                      )}
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="text-[9px] text-slate-400 font-bold mt-3 pl-1">All times are in UTC</div>
                </div>

                {/* Format Efficiency Donut - Right (1/3 width) */}
                <div className="lg:col-span-1 rounded-2xl border border-slate-100 bg-white p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
                  <div>
                    <div className="text-sm font-bold text-rose-600 mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>Format Efficiency</div>
                    <div className="text-[10px] text-slate-400 font-semibold">Engagement by content type</div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-4 mt-3">
                    <div className="relative h-36 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={formatDonutData} cx="50%" cy="50%" innerRadius={42} outerRadius={62} paddingAngle={3} dataKey="value">
                            {formatDonutData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
                          </Pie>
                          <Tooltip content={({ active, payload }) => active && payload?.length ? (
                            <div className="bg-white border border-slate-100 rounded-xl p-2 text-xs shadow-lg text-slate-800 font-bold">
                              {payload[0].name}: {payload[0].value}%
                            </div>
                          ) : null} />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      {/* Total interactions in center matching Figma */}
                      <div className="absolute text-center pointer-events-none">
                        <div className="text-lg font-black text-slate-800 leading-none" style={{ fontFamily: "Outfit, sans-serif" }}>128.4K</div>
                        <div className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-1.5 leading-tight">Total<br/>Interactions</div>
                      </div>
                    </div>

                    {/* Legend list matching Figma */}
                    <div className="flex flex-col w-full gap-1.5 pt-1.5 relative z-10 border-t border-slate-100/50">
                      {formatDonutData.map(f => (
                        <div key={f.name} className="flex items-center justify-between text-xs w-full py-0.5">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: f.color }} />
                            <span className="text-slate-600 font-semibold">{f.name}</span>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-semibold">{f.raw || `${(128.4 * f.value / 100).toFixed(1)}K`}</span>
                            <span className="text-slate-700 font-black w-10 text-right">{f.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Cherry Blossom SVG pattern matching Figma */}
                  <div className="absolute -bottom-6 -right-6 w-20 h-20 opacity-20 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full fill-rose-300">
                      {/* Flower 1 */}
                      <g transform="translate(30, 30) scale(0.6)">
                        <path d="M 0 0 C -10 -20, -20 -20, -20 -10 C -20 0, -10 0, 0 0 Z" />
                        <path d="M 0 0 C 10 -20, 20 -20, 20 -10 C 20 0, 10 0, 0 0 Z" transform="rotate(72)" />
                        <path d="M 0 0 C 10 -20, 20 -20, 20 -10 C 20 0, 10 0, 0 0 Z" transform="rotate(144)" />
                        <path d="M 0 0 C 10 -20, 20 -20, 20 -10 C 20 0, 10 0, 0 0 Z" transform="rotate(216)" />
                        <path d="M 0 0 C 10 -20, 20 -20, 20 -10 C 20 0, 10 0, 0 0 Z" transform="rotate(288)" />
                      </g>
                      {/* Flower 2 */}
                      <g transform="translate(60, 60) scale(0.85)">
                        <path d="M 0 0 C -10 -25, -25 -25, -25 -10 C -25 0, -10 0, 0 0 Z" />
                        <path d="M 0 0 C 10 -25, 25 -25, 25 -10 C 25 0, 10 0, 0 0 Z" transform="rotate(72)" />
                        <path d="M 0 0 C 10 -25, 25 -25, 25 -10 C 25 0, 10 0, 0 0 Z" transform="rotate(144)" />
                        <path d="M 0 0 C 10 -25, 25 -25, 25 -10 C 25 0, 10 0, 0 0 Z" transform="rotate(216)" />
                        <path d="M 0 0 C 10 -25, 25 -25, 25 -10 C 25 0, 10 0, 0 0 Z" transform="rotate(288)" />
                      </g>
                    </svg>
                  </div>
                </div>

              </div>
    </div>
  );
}
