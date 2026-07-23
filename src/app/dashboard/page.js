"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import SettingsTab from "@/components/dashboard/SettingsTab";
import ReportsTab from "@/components/dashboard/ReportsTab";
import CampaignsTab from "@/components/dashboard/CampaignsTab";
import AIChatTab from "@/components/dashboard/AIChatTab";
import OverviewTab from "@/components/dashboard/OverviewTab";
import AudienceTab from "@/components/dashboard/AudienceTab";
import ContentTab from "@/components/dashboard/ContentTab";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/frontend/supabase";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, Legend
} from "recharts";
import {
  LayoutDashboard, Users, FileText, Sparkles, CalendarDays,
  FileDown, Settings, Bell, Search, ChevronDown, RefreshCw,
  Download, TrendingUp, Eye, Heart, UserPlus, Send, Zap,
  MessageCircle, Crown, ArrowUpRight, ArrowDownRight, Plus, X, Bot, LogOut, Info, User,
  Upload, Video, Image as ImageIcon, Play, Pause, Trash2, Check, Copy, ThumbsUp, ThumbsDown, AlertCircle, CheckCircle2, Film,
  Calendar, Clock, Sliders, Shield, Mail, Share2, ExternalLink, CheckSquare, Square, Filter, Layers, SlidersHorizontal
} from "lucide-react";

import { SiInstagram, SiYoutube, SiX, SiThreads, SiFacebook } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

// --- Custom Brand SVG Icons (Official Real Vector Logos) ---
const Instagram = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: size, height: size, borderRadius: size * 0.25, background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}>
      <SiInstagram size={size * 0.65} color="white" />
    </div>
  ) : <SiInstagram size={size} className={className} />
);

const Linkedin = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <FaLinkedin size={size} color="#0A66C2" className={className} />
  ) : <FaLinkedin size={size} className={className} />
);

const Youtube = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <SiYoutube size={size} color="#FF0000" className={className} />
  ) : <SiYoutube size={size} className={className} />
);

const Twitter = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <SiX size={size} color="#000000" className={className} />
  ) : <SiX size={size} className={className} />
);

const Threads = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <SiThreads size={size} color="#000000" className={className} />
  ) : <SiThreads size={size} className={className} />
);

const Facebook = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <SiFacebook size={size} color="#1877F2" className={className} />
  ) : <SiFacebook size={size} className={className} />
);

import { generateSeededStats, generateSeededHeatmap } from '@/lib/shared/mockData';

const platformColors = {
  Instagram: "from-pink-500 to-rose-500",
  LinkedIn:  "from-blue-600 to-cyan-600",
  YouTube:   "from-red-600 to-rose-600",
  Twitter:   "from-slate-800 to-slate-950",
  Threads:   "from-slate-900 to-black",
  Facebook:  "from-blue-600 to-indigo-600",
};

const platformIcons = {
  Instagram: <Instagram size={13} colorful={true} />,
  LinkedIn:  <Linkedin size={13} colorful={true} />,
  YouTube:   <Youtube size={13} colorful={true} />,
  Twitter:   <Twitter size={13} colorful={true} />,
  Threads:   <Threads size={13} colorful={true} />,
  Facebook:  <Facebook size={13} colorful={true} />,
};

const typeColors = {
  video:    "bg-pink-500/20 text-pink-300 border-pink-500/30",
  carousel: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  image:    "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  text:     "bg-amber-500/20 text-amber-300 border-amber-500/30",
};

// --- Reusable Sub-components from design ---
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
    case "Engagement Rate":
      return <span className="text-xs font-black text-rose-500">%</span>;
    case "Total Reach":
      return <Eye size={12} className="text-rose-500" />;
    case "Total Interactions":
      return <Heart size={12} className="text-rose-500" />;
    case "Followers":
    case "Followers Count":
      return <User size={12} className="text-rose-500" />;
    default:
      return <Zap size={12} className="text-rose-500" />;
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
export default function DashboardPage() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [fetchError, setFetchError] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Active view tab state (controlled by left sidebar)
  const [activeTab, setActiveTab] = useState("overview");
  const [testerUsername, setTesterUsername] = useState("");
  const [currentUsername, setCurrentUsername] = useState("@nikita7011");

  // Chart toggles & internal panel state
  const [chartTab, setChartTab] = useState("bar"); // "bar" = Platforms, "line" = Growth
  const [activeSection, setActiveSection] = useState("posts"); // "posts" = Top 10 Posts, "followers" = Follower Activity

  // AI Chatbot States (PulseAI Copilot & Interactive Studio)
  

  useEffect(() => {
    setMounted(true);
    
    const checkSession = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);
        
        const storedPlatforms = localStorage.getItem("socialpulse_connected_platforms");
        let connectedPlatforms = null;
        if (storedPlatforms) {
          try { connectedPlatforms = JSON.parse(storedPlatforms); } catch(e) {}
        }
        
        if (!connectedPlatforms || connectedPlatforms.length === 0) {
          router.push("/onboarding");
          return;
        }

        setData({ isDefault: true, ...generateSeededStats("@nikita7011", connectedPlatforms) });
      } catch (err) {
        console.error("Session fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem("socialpulse_mock_user");
      localStorage.removeItem("socialpulse_connected_platforms");
      router.push("/login");
    } catch (error) {
      console.error(error);
    }
  };

  const handleTestUsername = (e) => {
    e.preventDefault();
    setTesterUsername(e.target.value);
  };

  const triggerSeededProfile = (tag) => {
    const handleToUse = typeof tag === "string" ? tag : testerUsername;
    if (!handleToUse) return;
    setCurrentUsername(handleToUse.startsWith("@") ? handleToUse : `@${handleToUse}`);
    setLoading(true);
    setTimeout(() => {
      const storedPlatforms = localStorage.getItem("socialpulse_connected_platforms");
      let connectedPlatforms = null;
      if (storedPlatforms) {
        try { connectedPlatforms = JSON.parse(storedPlatforms); } catch(e) {}
      }
      setData({ isDefault: false, ...generateSeededStats(handleToUse, connectedPlatforms) });
      setLoading(false);
    }, 800);
  };

  // --- Dynamic Data Mapping Helpers ---
  const getFollowersChartData = () => {
    if (!data || !data.followersGrowth) return [];
    const datesMap = {};
    data.followersGrowth.forEach((item) => {
      const dateStr = item.snapshot_date;
      if (!datesMap[dateStr]) {
        const dObj = new Date(dateStr);
        const formatted = dObj.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
        datesMap[dateStr] = { date: formatted, rawDate: dateStr };
      }
      datesMap[dateStr][item.platform] = item.follower_count;
    });
    return Object.values(datesMap).sort((a, b) => new Date(a.rawDate) - new Date(b.rawDate));
  };

  const getPostTypeChartData = () => {
    if (!data || !data.postTypes) return [];
    const platformMap = {};
    ["Instagram", "LinkedIn", "YouTube", "Twitter"].forEach((p) => {
      platformMap[p] = { platform: p, video: 0, image: 0, carousel: 0, text: 0 };
    });

    data.postTypes.forEach((item) => {
      const p = item.platform;
      if (platformMap[p]) {
        platformMap[p][item.post_type] = item.avg_engagement_rate_pct;
      }
    });
    return Object.values(platformMap);
  };

  const getFormatDonutData = () => {
    const formatDataFallback = [
      { name: "Videos", value: 38, color: "#ec4899" },
      { name: "Carousels", value: 27, color: "#8b5cf6" },
      { name: "Images", value: 22, color: "#06b6d4" },
      { name: "Text", value: 13, color: "#f59e0b" },
    ];
    if (!data || !data.topPosts) return formatDataFallback;
    const counts = { video: 0, carousel: 0, image: 0, text: 0 };
    let total = 0;
    data.topPosts.forEach(p => {
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

  if (!mounted) return null;

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ background: "#0b0f1a" }}>
        <div className="flex flex-col items-center gap-5">
          <span className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></span>
          <p className="text-pink-400 font-semibold tracking-wide">Syncing secure workspace...</p>
        </div>
      </div>
    );
  }

  // Loaded state metrics
  const isDefault = data?.isDefault || false;
  const kpis = data?.kpis || { total_posts: 0, total_reach: 0, total_interactions: 0, avg_engagement_rate: 0 };
  const followerStats = data?.followers || { total: 0, gained: 0, lost: 0, net: 0, gainedList: [], lostList: [] };
  const followersChartData = getFollowersChartData();
  const postTypeChartData = getPostTypeChartData();

  // --- Dynamic Sparkline Mappers ---
  const engagementSparkline = isDefault ? [2.1, 3.4, 2.9, 4.2, 5.1, 4.8, 6.2, 7.1, 8.32] : (data?.engagementTimeline?.slice(-9)?.map(t => t.engagement) || [2.1, 3.4, 2.9, 4.2, 5.1, 4.8, 6.2, 7.1, 8.32]);
  const reachSparkline = isDefault ? [820, 950, 1100, 980, 1240, 1350, 1490, 1520, 1540] : (data?.topPosts?.slice().reverse()?.map(p => p.reach / 1000) || [820, 950, 1100, 980, 1240, 1350, 1490, 1520, 1540]);
  const interactSparkline = isDefault ? [85, 92, 101, 94, 108, 117, 124, 126, 128] : (data?.topPosts?.slice().reverse()?.map(p => p.likes + p.comments + p.shares) || [85, 92, 101, 94, 108, 117, 124, 126, 128]);
  const followerSparkline = isDefault ? [22.1, 22.4, 22.8, 23.0, 23.4, 23.8, 24.1, 24.3, 24.5] : (followersChartData?.slice(-9)?.map(f => (f.Instagram || f.LinkedIn || 10000) / 1000) || [22.1, 22.4, 22.8, 23.0, 23.4, 23.8, 24.1, 24.3, 24.5]);

  // --- Recharts mapping for platform & growth ---
  const platformBarDataMapped = isDefault
    ? [
        { name: "Instagram", likes: 42000, comments: 8200, shares: 6100 },
        { name: "LinkedIn",  likes: 18000, comments: 5100, shares: 9300 },
        { name: "YouTube",   likes: 31000, comments: 12000, shares: 4700 },
        { name: "Twitter",   likes: 24000, comments: 6800, shares: 11200 },
      ]
    : (data?.platformPerformance?.map(p => ({
        name: p.platform,
        likes: p.total_likes,
        comments: p.total_comments,
        shares: p.total_shares
      })) || []);

  const audienceGrowthDataMapped = isDefault
    ? [
        { month: "Jan", instagram: 18200, linkedin: 4200, youtube: 9100, twitter: 6800 },
        { month: "Feb", instagram: 19500, linkedin: 4800, youtube: 9800, twitter: 7300 },
        { month: "Mar", instagram: 20100, linkedin: 5200, youtube: 10400, twitter: 7900 },
        { month: "Apr", instagram: 21400, linkedin: 5700, youtube: 11200, twitter: 8600 },
        { month: "May", instagram: 21900, linkedin: 6100, youtube: 12100, twitter: 9200 },
        { month: "Jun", instagram: 22800, linkedin: 6800, youtube: 13000, twitter: 10100 },
        { month: "Jul", instagram: 23200, linkedin: 7400, youtube: 13900, twitter: 10800 },
        { month: "Aug", instagram: 23900, linkedin: 8000, youtube: 14600, twitter: 11500 },
        { month: "Sep", instagram: 24100, linkedin: 8700, youtube: 15200, twitter: 12100 },
        { month: "Oct", instagram: 24300, linkedin: 9300, youtube: 15800, twitter: 12700 },
        { month: "Nov", instagram: 24480, linkedin: 9900, youtube: 16300, twitter: 13200 },
        { month: "Dec", instagram: 24500, linkedin: 10200, youtube: 16800, twitter: 13800 },
      ]
    : (followersChartData.map(f => ({
        month: f.date,
        instagram: f.Instagram || 0,
        linkedin: f.LinkedIn || 0,
        youtube: f.YouTube || 0,
        twitter: f.Twitter || 0
      })) || []);

  const formatDonutData = isDefault
    ? [
        { name: "Videos", value: 38, color: "#ec4899" },
        { name: "Carousels", value: 27, color: "#8b5cf6" },
        { name: "Images", value: 22, color: "#06b6d4" },
        { name: "Text", value: 13, color: "#f59e0b" },
      ]
    : getFormatDonutData();

  // --- Heatmap configuration exact to design ---
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const hours = ["6am", "9am", "12pm", "3pm", "6pm", "9pm", "12am"];
  const heatmapRaw = isDefault
    ? [
        [1,2,3,2,1,1,0],[2,4,7,6,5,4,2],[3,6,9,8,7,5,3],
        [2,5,8,9,6,4,2],[1,3,6,7,8,6,3],[2,4,5,4,3,2,1],[1,1,2,2,1,1,0],
      ]
    : (data?.heatmap || generateSeededHeatmap(currentUsername));

  // --- Top Posts mapped for the table ---
  const topPostsMapped = isDefault
    ? [
        { rank: 1, platform: "Instagram", date: "Dec 12", type: "Video", summary: "Behind the scenes: product launch day", reach: "248K", interactions: "21,400", eng: "8.6%" },
        { rank: 2, platform: "YouTube",   date: "Dec 8",  type: "Video", summary: "Full tutorial: advanced analytics workflows", reach: "192K", interactions: "18,200", eng: "9.5%" },
        { rank: 3, platform: "LinkedIn",  date: "Dec 5",  type: "Carousel", summary: "10 metrics every creator must track in 2025", reach: "156K", interactions: "14,800", eng: "9.5%" },
        { rank: 4, platform: "Twitter",   date: "Dec 3",  type: "Text", summary: "The engagement rate myth — a thread", reach: "134K", interactions: "12,600", eng: "9.4%" },
        { rank: 5, platform: "Instagram", date: "Nov 29", type: "Carousel", summary: "Year in data: what we learned from 500 posts", reach: "121K", interactions: "11,300", eng: "9.3%" },
        { rank: 6, platform: "LinkedIn",  date: "Nov 24", type: "Image", summary: "Announcing SocialPulse AI — beta is open", reach: "108K", interactions: "10,100", eng: "9.4%" },
        { rank: 7, platform: "YouTube",   date: "Nov 19", type: "Video", summary: "Deep dive: LinkedIn algorithm changes Dec 2024", reach: "97K",  interactions: "8,900",  eng: "9.2%" },
      ]
    : (data?.topPosts 
        ? [...data.topPosts]
            .sort((a, b) => b.reach - a.reach)
            .slice(0, 10)
            .map((p, idx) => ({
              rank: idx + 1,
              platform: p.platform,
              date: new Date(p.post_date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              type: p.post_type.charAt(0).toUpperCase() + p.post_type.slice(1).toLowerCase(),
              summary: p.caption,
              reach: p.reach >= 1000000 ? `${(p.reach / 1000000).toFixed(1)}M` : (p.reach >= 1000 ? `${(p.reach / 1000).toFixed(0)}K` : p.reach),
              interactions: (p.likes + p.comments + p.shares).toLocaleString(),
              eng: `${p.engagement_rate_pct.toFixed(2)}%`
            }))
        : []);

  // --- Followers activity mapped ---
  const followerActivityMapped = isDefault
    ? [
        { name: "maya_creates", action: "followed", time: "2m ago", avatar: "MC" },
        { name: "tech.insider_", action: "followed", time: "8m ago", avatar: "TI" },
        { name: "growthlab.io", action: "unfollowed", time: "14m ago", avatar: "GL" },
        { name: "brandnomics", action: "followed", time: "21m ago", avatar: "BN" },
        { name: "alex_d_media", action: "followed", time: "35m ago", avatar: "AD" },
        { name: "contentOps", action: "unfollowed", time: "51m ago", avatar: "CO" },
      ]
    : [];

  if (!isDefault && followerStats.gainedList) {
    followerStats.gainedList.forEach(f => {
      followerActivityMapped.push({
        name: f.handle.replace("@", ""),
        action: "followed",
        time: f.date,
        avatar: f.avatar
      });
    });
  }
  if (!isDefault && followerStats.lostList) {
    followerStats.lostList.forEach(f => {
      followerActivityMapped.push({
        name: f.handle.replace("@", ""),
        action: "unfollowed",
        time: f.date,
        avatar: f.avatar
      });
    });
  }

  const sidebarItems = [
    { id: "overview", icon: <LayoutDashboard size={16} />, label: "Overview" },
    { id: "audience", icon: <Users size={16} />, label: "Audience" },
    { id: "content", icon: <FileText size={16} />, label: "Posts & Reach" },
    { id: "copilot", icon: <Sparkles size={16} />, label: "AI Insights", beta: true },
    { id: "campaigns", icon: <CalendarDays size={16} />, label: "Campaign Scheduler" },
    { id: "reports", icon: <FileDown size={16} />, label: "Monthly Reports" },
    { id: "settings", icon: <Settings size={16} />, label: "Settings" },
  ];

  const handleNavClick = (id) => {
    setActiveTab(id);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden text-slate-800 bg-[#f8fafc]" style={{ fontFamily: "Inter, sans-serif" }}>
      <Sidebar activeTab={activeTab} handleNavClick={handleNavClick} />
      
      {/* Main Container */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white/50 relative">
        {/* Top Header */}
        <header className="h-16 flex-shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-6 flex-1">
            <h2 className="text-lg font-black text-slate-800 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              {activeTab === "overview" && "Analytics Overview"}
              {activeTab === "audience" && "Audience Insights"}
              {activeTab === "content" && "Content & Reach"}
              {activeTab === "copilot" && "PulseAI Copilot"}
              {activeTab === "campaigns" && "Campaign Manager"}
              {activeTab === "reports" && "Export Reports"}
              {activeTab === "settings" && "Workspace Settings"}
            </h2>
            
            <div className="hidden md:flex items-center gap-2 bg-slate-50/80 border border-slate-100 rounded-full px-3 py-1.5 flex-1 max-w-md focus-within:ring-2 focus-within:ring-rose-100 focus-within:border-rose-200 transition-all">
              <Search size={14} className="text-slate-400" />
              <input 
                id="dashboard-search"
                placeholder="Search campaigns, posts, or hit ⌘K..." 
                className="bg-transparent border-none focus:outline-none text-xs w-full text-slate-700 placeholder-slate-400 font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-6 w-px bg-slate-200"></div>
            <div className="flex items-center gap-3 pl-1">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{currentUsername || "Creator"}</div>
                <div className="text-[10px] font-semibold text-rose-500">Pro Plan</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-pink-500 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white cursor-pointer hover:scale-105 transition-transform" onClick={handleLogout}>
                {currentUsername?.slice(1, 3).toUpperCase() || "CR"}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col gap-6 pt-6" style={{ scrollbarWidth: "none" }}>
          <div className="max-w-7xl mx-auto w-full">
            {activeTab === "overview" && (
              <OverviewTab 
                data={data}
                isDefault={isDefault}
                kpis={kpis}
                followerStats={followerStats}
                followersChartData={followersChartData}
                engagementSparkline={engagementSparkline}
                reachSparkline={reachSparkline}
                interactSparkline={interactSparkline}
                followerSparkline={followerSparkline}
                platformBarDataMapped={platformBarDataMapped}
                audienceGrowthDataMapped={audienceGrowthDataMapped}
                testerUsername={testerUsername}
                setTesterUsername={setTesterUsername}
                triggerSeededProfile={triggerSeededProfile}
                handleTestUsername={handleTestUsername}
              />
            )}
            
            {activeTab === "audience" && (
              <AudienceTab 
                followerStats={followerStats}
                followerSparkline={followerSparkline}
                engagementSparkline={engagementSparkline}
                interactSparkline={interactSparkline}
                reachSparkline={reachSparkline}
                audienceGrowthDataMapped={audienceGrowthDataMapped}
              />
            )}
            
            {activeTab === "content" && (
              <ContentTab 
                data={data}
                isDefault={isDefault}
                postTypeChartData={postTypeChartData}
                currentUsername={currentUsername}
              />
            )}
            
            {activeTab === "copilot" && <AIChatTab 
              currentUsername={currentUsername} 
              data={data}
              kpis={kpis}
              followerStats={followerStats}
            />}
            {activeTab === "campaigns" && <CampaignsTab session={session} />}
            {activeTab === "reports" && <ReportsTab />}
            {activeTab === "settings" && <SettingsTab />}
          </div>
        </main>
      </div>
    </div>
  );
}
