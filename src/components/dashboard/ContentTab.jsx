import React from "react";
import { MessageCircle, Heart, Share2, Crown, LayoutDashboard } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import { Instagram, Linkedin } from "@/components/icons/Icons";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700/50 p-3 rounded-xl shadow-xl text-white">
        <p className="text-xs font-bold mb-2 pb-2 border-b border-slate-700">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex flex-col gap-1 mb-1.5 last:mb-0 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </div>
            <div className="font-bold text-xs pl-3">
              {entry.value >= 1000 ? `${(entry.value/1000).toFixed(1)}K` : entry.value}
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};


export default function ContentTab({ 
  data, 
  isDefault, 
  postTypeChartData,
  currentUsername
}) {
  
  const topPostsMapped = isDefault ? [
    { rank: 1, platform: "Instagram", date: "Oct 12", type: "Video", summary: "Building a SaaS from scratch", reach: "142.5K", interactions: "14.2K", eng: "10.0%" },
    { rank: 2, platform: "LinkedIn", date: "Oct 10", type: "Text", summary: "Hot take: CSS > Tailwind", reach: "112.1K", interactions: "10.7K", eng: "9.5%" },
    { rank: 3, platform: "LinkedIn", date: "Oct 08", type: "Carousel", summary: "5 SQL Queries I use every day", reach: "89.2K", interactions: "8.6K", eng: "9.6%" },
    { rank: 4, platform: "Instagram", date: "Oct 05", type: "Image", summary: "Why your dashboard looks cluttered", reach: "64.8K", interactions: "5.8K", eng: "9.1%" },
    { rank: 5, platform: "Twitter", date: "Oct 01", type: "Text", summary: "10 years of coding, 10 lessons", reach: "58.2K", interactions: "4.9K", eng: "8.4%" },
    { rank: 6, platform: "YouTube", date: "Sep 28", type: "Video", summary: "Next.js 14 full course", reach: "45.1K", interactions: "3.8K", eng: "8.4%" },
    { rank: 7, platform: "Instagram", date: "Sep 22", type: "Video", summary: "My desk setup tour 2026", reach: "38.5K", interactions: "3.2K", eng: "8.3%" },
    { rank: 8, platform: "LinkedIn", date: "Sep 18", type: "Carousel", summary: "How to negotiate your salary", reach: "32.4K", interactions: "2.7K", eng: "8.3%" },
    { rank: 9, platform: "Twitter", date: "Sep 12", type: "Text", summary: "Stop using useEffect", reach: "28.9K", interactions: "2.4K", eng: "8.3%" },
    { rank: 10, platform: "Instagram", date: "Sep 05", type: "Image", summary: "Coffee shop coding aesthetic", reach: "24.5K", interactions: "1.9K", eng: "7.8%" }
  ] : [
    { rank: 1, platform: "Instagram", date: "Oct 12", type: "Video", summary: "Building a SaaS from scratch", reach: "142.5K", interactions: "14.2K", eng: "10.0%" },
    { rank: 2, platform: "LinkedIn", date: "Oct 10", type: "Text", summary: "Hot take: CSS > Tailwind", reach: "112.1K", interactions: "10.7K", eng: "9.5%" },
    { rank: 3, platform: "LinkedIn", date: "Oct 08", type: "Carousel", summary: "5 SQL Queries I use every day", reach: "89.2K", interactions: "8.6K", eng: "9.6%" },
    { rank: 4, platform: "Instagram", date: "Oct 05", type: "Image", summary: "Why your dashboard looks cluttered", reach: "64.8K", interactions: "5.8K", eng: "9.1%" },
    { rank: 5, platform: "Twitter", date: "Oct 01", type: "Text", summary: "10 years of coding, 10 lessons", reach: "58.2K", interactions: "4.9K", eng: "8.4%" },
    { rank: 6, platform: "YouTube", date: "Sep 28", type: "Video", summary: "Next.js 14 full course", reach: "45.1K", interactions: "3.8K", eng: "8.4%" },
    { rank: 7, platform: "Instagram", date: "Sep 22", type: "Video", summary: "My desk setup tour 2026", reach: "38.5K", interactions: "3.2K", eng: "8.3%" },
    { rank: 8, platform: "LinkedIn", date: "Sep 18", type: "Carousel", summary: "How to negotiate your salary", reach: "32.4K", interactions: "2.7K", eng: "8.3%" },
    { rank: 9, platform: "Twitter", date: "Sep 12", type: "Text", summary: "Stop using useEffect", reach: "28.9K", interactions: "2.4K", eng: "8.3%" },
    { rank: 10, platform: "Instagram", date: "Sep 05", type: "Image", summary: "Coffee shop coding aesthetic", reach: "24.5K", interactions: "1.9K", eng: "7.8%" }
  ];

  const platformColors = {
    "Instagram": "from-[#FF2E88] to-[#FF5AAE]",
    "LinkedIn": "from-blue-500 to-blue-400",
    "Twitter": "from-sky-400 to-sky-300",
    "YouTube": "from-red-500 to-red-400",
  };
  const platformIcons = {
    "Instagram": <Instagram size={10} color="white" />,
    "LinkedIn": <Linkedin size={10} color="white" />,
    "Twitter": <MessageCircle size={10} color="white" />,
    "YouTube": <LayoutDashboard size={10} color="white" />,
  };
  const typeColors = {
    "video": "bg-pink-50 text-pink-600 border-pink-200",
    "carousel": "bg-purple-50 text-purple-600 border-purple-200",
    "image": "bg-cyan-50 text-cyan-600 border-cyan-200",
    "text": "bg-amber-50 text-amber-600 border-amber-200"
  };

  const postsList = isDefault ? [
    { title: "Building a SaaS from scratch (Part 1)", post_type: "Video", reach: 142000, likes: 12500, comments: 840, shares: 1200, retention: 64, engagement_rate_pct: 10.2 },
    { title: "5 SQL Queries I use every day 📊", post_type: "Carousel", reach: 89000, likes: 7200, comments: 410, shares: 980, retention: 58, engagement_rate_pct: 9.6 },
    { title: "Why your dashboard looks cluttered", post_type: "Image", reach: 64000, likes: 5100, comments: 320, shares: 450, retention: 42, engagement_rate_pct: 9.1 },
    { title: "Hot take: CSS is better than Tailwind", post_type: "Text", reach: 112000, likes: 8900, comments: 1200, shares: 620, retention: 85, engagement_rate_pct: 9.5 }
  ] : (data?.posts || []);

  const heatmapRaw = isDefault ? [
    [1,1,2,3,4,3,2,1],
    [2,3,4,6,8,5,3,2],
    [3,5,6,9,9,7,4,2],
    [2,4,5,8,7,5,3,2],
    [1,3,4,6,6,4,2,1],
    [1,2,3,4,4,3,2,1],
    [1,1,2,2,3,2,1,1]
  ] : [
    [1,1,2,3,4,3,2,1],
    [2,3,4,6,8,5,3,2],
    [3,5,6,9,9,7,4,2],
    [2,4,5,8,7,5,3,2],
    [1,3,4,6,6,4,2,1],
    [1,2,3,4,4,3,2,1],
    [1,1,2,2,3,2,1,1]
  ]; // Add real generation if needed later

  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const hours = ["6am","9am","12pm","3pm","6pm","9pm","12am","3am"];

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      
          {/* Dynamic Header */}
              <div>
                <h1 className="text-2xl font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Posts &amp; Reach Efficiency 🏆</h1>
                <p className="text-sm text-slate-500 mt-0.5">Optimize reach and review content formatting metrics.</p>
              </div>

              {/* Format Efficiency by Platform Bar Chart */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Format Efficiency by Platform</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Average engagement rates (%) broken down by post content formats</p>
                </div>
                <div className="h-64 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={postTypeChartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                      <XAxis dataKey="platform" stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} axisLine={false} tickLine={false} unit="%" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend iconSize={10} wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                      <Bar dataKey="video" name="Video/Reels" fill="#ec4899" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="carousel" name="Carousel" fill="#a855f7" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="image" name="Single Image" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="text" name="Text Thread" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Performing Content Highlight cards */}
              <div>
                <h3 className="text-sm font-bold text-slate-800 mb-1" style={{ fontFamily: "Outfit, sans-serif" }}>Top Performing Content</h3>
                <p className="text-xs text-slate-500 mb-4">Highest reaching and most liked posts in the system</p>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  
                  {/* Post 1: Highest Reach */}
                  <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-gradient-to-br from-pink-500/10 to-violet-600/15 border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white border border-pink-100 p-2.5">
                        <Instagram size={40} colorful={true} />
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-pink-500 shadow-sm">
                          <Instagram size={12} colorful={true} /> Instagram
                        </span>
                        <p className="text-xs text-slate-700 font-medium italic leading-relaxed mt-2.5">
                          &ldquo;{data?.highestViewPost?.caption || "Aesthetic workspace overview video showing database logs..."}&rdquo;
                        </p>
                      </div>
                      <div>
                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Reach</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestViewPost?.reach || 124500).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Likes</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestViewPost?.likes || 8400).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Shares</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestViewPost?.shares || 450).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
                          <span className="text-[10px] text-slate-400 font-semibold">Engagement Rate</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">{(data?.highestViewPost?.engagement_rate_pct || 9.42).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Post 2: Highest Likes */}
                  <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3 flex items-center justify-center p-8 bg-gradient-to-br from-blue-500/10 to-emerald-600/15 border-b md:border-b-0 md:border-r border-slate-100">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg bg-white border border-blue-100 p-2.5">
                        <Linkedin size={40} colorful={true} />
                      </div>
                    </div>
                    <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold text-white bg-blue-600 shadow-sm">
                          <Linkedin size={12} colorful={true} /> LinkedIn
                        </span>
                        <p className="text-xs text-slate-700 font-medium italic leading-relaxed mt-2.5">
                          &ldquo;{data?.highestLikesPost?.caption || "Why database query speeds matter in creator analytics workflows..."}&rdquo;
                        </p>
                      </div>
                      <div>
                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Reach</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestLikesPost?.reach || 98000).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Likes</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestLikesPost?.likes || 12100).toLocaleString()}</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 font-semibold block">Shares</span>
                            <span className="text-xs font-bold text-slate-800">{(data?.highestLikesPost?.shares || 610).toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between border-t border-slate-100 mt-3 pt-3">
                          <span className="text-[10px] text-slate-400 font-semibold">Engagement Rate</span>
                          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">{(data?.highestLikesPost?.engagement_rate_pct || 12.35).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Top 10 Posts Section */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="mb-4">
                  <h3 className="text-sm font-bold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>Top 10 Posts Overview</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Top performing content ranked by engagement efficiency</p>
                </div>
                <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  <table className="w-full text-xs min-w-[600px] text-left">
                    <thead>
                      <tr className="border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider font-bold">
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">Platform</th>
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Type</th>
                        <th className="px-4 py-3">Summary</th>
                        <th className="px-4 py-3">Reach</th>
                        <th className="px-4 py-3">Interactions</th>
                        <th className="px-4 py-3">Eng %</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPostsMapped.map((p) => (
                        <tr key={p.rank} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-bold text-slate-400">{p.rank}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r ${platformColors[p.platform]} shadow-xs`}>
                              {platformIcons[p.platform]}{p.platform}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 font-medium whitespace-nowrap">{p.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold ${typeColors[p.type.toLowerCase()] || "bg-slate-100 text-slate-700 border-slate-200"}`}>{p.type}</span>
                          </td>
                          <td className="px-4 py-3 text-slate-700 font-medium max-w-[160px] truncate" title={p.summary}>{p.summary}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold whitespace-nowrap">{p.reach}</td>
                          <td className="px-4 py-3 text-slate-800 font-bold whitespace-nowrap">{p.interactions}</td>
                          <td className="px-4 py-3 font-bold text-emerald-600">{p.eng}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Best Posting Times Heatmap */}
              <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="text-sm font-bold text-slate-800 mb-0.5" style={{ fontFamily: "Outfit, sans-serif" }}>Best Posting Times</div>
                <div className="text-xs text-slate-500 mb-4">Engagement intensity by day & hour</div>
                <div className="overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                  <div className="min-w-[420px]">
                    <div className="flex gap-1 mb-1 pl-10">
                      {hours.map(h => <div key={h} className="flex-1 text-center text-[9px] text-slate-500 font-bold">{h}</div>)}
                    </div>
                    {heatmapRaw.map((row, di) => (
                      <div key={di} className="flex items-center gap-1 mb-1">
                        <div className="w-9 text-[10px] text-slate-500 text-right pr-2 flex-shrink-0 font-bold">{days[di]}</div>
                        {row.map((val, hi) => {
                          const intensity = val / 9;
                          return (
                            <div key={hi} className="flex-1 h-7 rounded transition-all hover:scale-110 cursor-default relative group"
                              style={{
                                background: val === 0
                                  ? "rgba(0,0,0,0.03)"
                                  : `rgba(${Math.round(244 - intensity * 60)}, ${Math.round(63 + intensity * 10)}, ${Math.round(94 + intensity * 60)}, ${0.15 + intensity * 0.75})`
                              }}>
                              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] rounded-lg p-2.5 hidden group-hover:block z-20 shadow-xl border border-white/10 w-32 text-center pointer-events-none">
                                <div className="font-bold">{days[di]} at {hours[hi]}</div>
                                <div className="text-pink-400 font-semibold mt-0.5">Intensity: {["Low","Low","Moderate","Moderate","Good","Good","High","High","High","Peak"][val]}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    <div className="flex items-center justify-end gap-2 mt-3 pl-10">
                      <span className="text-[10px] text-slate-500 font-bold">Low</span>
                      {[0.15, 0.35, 0.55, 0.75, 0.9].map((o, i) => (
                        <div key={i} className="w-4 h-3 rounded-sm" style={{ background: `rgba(244,63,94,${o})` }} />
                      ))}
                      <span className="text-[10px] text-slate-500 font-bold">Peak</span>
                    </div>
                  </div>
                </div>
              </div>
    </div>
  );
}
