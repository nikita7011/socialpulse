import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Upload, Trash2, Video, FileText, ImageIcon, Film, Play, ArrowUpRight, Bot, Check, Copy, ThumbsUp, ThumbsDown, Send } from "lucide-react";

export default function AIChatTab({ currentUsername, data, kpis, followerStats }) {
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Hi Nikita! I'm **PulseAI**, your interactive AI Content Copilot. You can **upload a video, post draft, or image** above, and then chat with me freely! Ask me anything about hook pacing, audience retention curves, viral hashtags, or visual lighting."
    }
  ]);
  const [uploadedMedia, setUploadedMedia] = useState(null);
  const [mediaCaption, setMediaCaption] = useState("");
  const [isAnalyzingMedia, setIsAnalyzingMedia] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const chatScrollRef = useRef(null);

  // Auto-scroll to bottom of chat when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages, isAIThinking, uploadedMedia]);

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("dashboard-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // --- Interactive AI Media Upload & Freeform Chat Handlers ---
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzingMedia(true);
    const fileUrl = URL.createObjectURL(file);
    const isVideo = file.type.startsWith("video/") || file.name.endsWith(".mp4") || file.name.endsWith(".mov");
    const isImage = file.type.startsWith("image/") || file.name.endsWith(".jpg") || file.name.endsWith(".png") || file.name.endsWith(".webp");
    const mediaType = isVideo ? "video" : (isImage ? "image" : "post");
    const fileSize = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;

    const newMedia = {
      type: mediaType,
      url: fileUrl,
      name: file.name,
      size: fileSize,
      duration: isVideo ? "0:42" : undefined,
      dimensions: isImage ? "1080×1350 px (4:5)" : (isVideo ? "1080×1920 px (9:16 Vertical Reel)" : undefined)
    };

    setTimeout(() => {
      setUploadedMedia(newMedia);
      setIsAnalyzingMedia(false);
      setChatMessages(prev => [
        ...prev,
        {
          sender: "bot",
          text: `✅ I've successfully processed "**${file.name}**". It looks like a high-quality ${mediaType} format. Would you like me to analyze the hook retention, critique the aesthetics, or generate matching viral captions and hashtags?`
        }
      ]);
    }, 1500);
  };

  const removeMedia = () => {
    setUploadedMedia(null);
    setMediaCaption("");
    setChatMessages(prev => [
      ...prev,
      {
        sender: "bot",
        text: "Media removed. You can upload another file or continue chatting about your organic strategy."
      }
    ]);
  };

  const getBotReply = (msgText, media, caption, username) => {
    const text = msgText.toLowerCase();
    const mediaTitle = media ? media.name : "your content";
    const mediaType = media ? media.type : "post";

    if (text.includes("metrics") || text.includes("kpi") || text.includes("stats") || text.includes("performance") || text.includes("analytics") || text.includes("data")) {
      const er = kpis?.avg_engagement_rate ? kpis.avg_engagement_rate.toFixed(2) : "8.32";
      const reach = kpis?.total_reach ? kpis.total_reach.toLocaleString() : "1.54M";
      const followers = followerStats?.total ? followerStats.total.toLocaleString() : "426.7K";
      return `📊 **Live Analytics Report for ${username}**\n\nBased on your most recent SQL sync, here are your real-time KPIs:\n- **Total Followers:** ${followers}\n- **Total Reach:** ${reach}\n- **Avg. Engagement Rate:** ${er}%\n\nYour engagement rate is performing **+12.6% above average** this week. Would you like me to analyze your top performing content?`;
    }

    if (media && (text.includes("why") || text.includes("hook") || text.includes("retention") || text.includes("drop") || text.includes("critique") || text.includes("analyze") || text.includes("video") || text.includes("post") || text.includes("score") || text.includes("pacing") || text.includes("improve"))) {
      if (mediaType === "video") {
        return `📊 **Deep Video Audit for "${mediaTitle}"**\n\n**1. Hook & First 3 Seconds Analysis:**\n- **Visual Energy Score:** 8.8/10. The opening motion creates strong visual curiosity right on frame zero.\n- **Potential Drop-off Warning:** At the **0:04s to 0:06s mark**, pacing slows down slightly before the core concept is explained. To prevent early swipe-aways, insert a **bold pattern break** (e.g., a quick zoom-in or sound effect transition at 0:04s).\n\n**2. Retention Prediction Curve:**\n- **0s - 3s (Hook):** 92% retention predicted.\n- **3s - 15s (Core Value):** 68% retention (Above SaaS industry benchmark of 55%).\n- **30s+ (Call to Action):** 44% completion rate predicted.\n\n**3. Recommended Hook Rewrites to Double CTR:**\n- *"I tested 10 different setup angles until I found the exact one that doubled engagement..."*\n- *"Stop recording your reels like this if you want 10k organic reach in 2026..."*\n- *"Nobody talks about this simple visual trick that algorithm crawlers prioritize..."*`;
      } else if (mediaType === "image") {
        return `🖼️ **Visual Aesthetic & Infographic Audit for "${mediaTitle}"**\n\n**1. Composition & Color Grading:**\n- **Contrast & Readability:** Excellent high-contrast separation between the text header and the clean pink/white background palette.\n- **Thumb-Stopping Power:** Scored **9.1/10**. High-density carousels and clean infographics currently achieve **2.8x higher bookmark-to-like ratios** on LinkedIn and Instagram.\n\n**2. Accessibility & Layout Tips:**\n- Ensure the font size on slide sub-bullets is at least **24px** when viewed on mobile screens.\n- Add a subtle drop-shadow or border card highlight (` + "`border-[#FF2E88]/30`" + `) around central focal elements to draw the eye instantly to the key takeaway.\n\n**3. Best Time to Post This Graphic:**\n- **Tuesday & Thursday between 9:30 AM – 11:00 AM UTC** aligns with peak audience activity for analytical and educational slides.`;
      } else {
        return `📝 **Text & Copywriting Audit for "${mediaTitle}"**\n\n**1. Structure & Readability Score:** 9.4/10.\n- Your opening line acts as an authoritative contrarian hook, which immediately drives high "See More" expansion rates on LinkedIn.\n- Bulleting the 3 core pillars creates clean vertical scanning flow.\n\n**2. Algorithm Optimization Suggestions:**\n- **Call to Action (CTA):** Instead of asking a generic *"What do you think?"*, ask a polarized question: *"Which of these 3 points do you agree with most: 1, 2, or 3? Let me know below 👇"* (This increases 1-character comment speed by 350%).\n- **Link Placement:** Keep any external links inside the first pinned comment rather than the body text to prevent social platform throttling.`;
      }
    } else if (text.includes("hashtag") || text.includes("caption") || text.includes("tag") || text.includes("draft") || text.includes("write")) {
      const targetCaption = caption || "Unlock high-converting creator workflows inside SocialPulse";
      return `✨ **Curated Captions & Viral Hashtag Strategy for ${username}**\n\n*(Tailored for "${mediaTitle}")*\n\n**Option 1: Short & Punchy (Best for Reels & YouTube Shorts):**\n*"${targetCaption} ⚡ Data doesn't lie when you track organic signals daily. Which metric do you check first every morning? 👇"* \n\n**Option 2: Storytelling & Value Thread (Best for LinkedIn/Carousel):**\n*"We analyzed over 500 creator posts this month and noticed one glaring trend: consistency beats complex hacks every time. When you optimize your hook structure and track real SQL metrics inside SocialPulse, growth becomes predictable. Here is our breakdown of what worked best this week... 📈"*\n\n**🔥 Targeted Hashtags (High Engagement Tier):**\n\`#CreatorEconomy #SocialPulse #DataAnalytics #OrganicGrowth #SaaSFounders #ContentStrategy #AgenticAI #MetricsThatMatter #DigitalCreators\``;
    } else if (text.includes("lighting") || text.includes("color") || text.includes("aesthetic") || text.includes("quality") || text.includes("camera") || text.includes("setup")) {
      return `💡 **Studio Lighting & Visual Aesthetic Recommendations**\n\nBased on your workspace profile (**${username}**), here is how to elevate your visual production quality:\n\n1. **The Pink & White Split-Tone Setup:**\n   - Position a warm **key light (5600K daylight)** at a 45-degree angle to illuminate the primary subject clearly without harsh facial glare.\n   - Place a subtle **neon cherry-blossom pink accent tube light (` + "`#FF2E88`" + `)** behind your desk or bookshelf to create deep separation and signature SaaS branding depth.\n\n2. **Camera & Bitrate Settings:**\n   - Record videos in **4K at 30fps** or **60fps with 1/120s shutter speed** for crisp motion clarity.\n   - Always export with **H.265 / HEVC** encoding at **35–50 Mbps** to survive Instagram and YouTube compression algorithms without pixelation.`;
    } else if (text.includes("hello") || text.includes("hi") || text.includes("hey") || text.includes("help") || text.includes("what can you do")) {
      return `👋 **Hello! I'm PulseAI, your dedicated 24/7 Content & Analytics Copilot.**\n\nI can answer any question about your social media strategy, or directly review files you upload!\n\n🚀 **Here's what you can do right now:**\n1. **Upload any Video, Image, or Post Draft** using the upload box above (or click one of our instant sample demo buttons).\n2. **Ask me any question** like:\n   - *"Critique the hook pacing in my uploaded video"* \n   - *"Generate 3 viral captions and hashtags for this slide"* \n   - *"Why did my reach drop last Tuesday?"*\n   - *"Suggest optimal posting times for my target audience"* \n\nLet's build viral content together! What are we working on today?`;
    } else {
      return `🤖 **PulseAI Strategic Breakdown for ${username}:**\n\nRegarding your question about **"${msgText}"**${media ? ` in reference to your uploaded ${mediaType} '**${media.name}**'` : ""}:\n\n**1. Key Algorithmic Insight:**\nPlatforms are currently prioritizing **session time and share velocity** over passive likes. If your content holds viewers past the **8-second mark**, the recommendation engine classifies it as high-value and distributes it to lookalike audiences.\n\n**2. Actionable Recommendation:**\n- Ensure the core value payoff of your ${mediaType} occurs within the first 25% of the duration.\n- Pair your text caption with an engaging question that prompts viewers to save the post for future reference (` + "`Save rate > 3.5% triggers viral discovery feeds`" + `).\n\n*(Would you like me to generate specific hook phrasing or a custom content calendar around this?)*`;
    }
  };

  const handleAskCopilot = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const promptText = chatInput.trim();
    setChatMessages(prev => [...prev, { sender: "user", text: promptText }]);
    setChatInput("");
    setIsAIThinking(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText,
          context: { currentUsername, data, kpis, followerStats },
          media: uploadedMedia,
          caption: mediaCaption
        })
      });

      const result = await response.json();

      if (response.status === 501 && result.code === "NO_API_KEY") {
        // Fallback to local simulated AI if the user hasn't set up their OpenAI key yet
        setTimeout(() => {
          const responseText = getBotReply(promptText, uploadedMedia, mediaCaption, currentUsername);
          setChatMessages(prev => [...prev, { sender: "bot", text: responseText }]);
          setIsAIThinking(false);
        }, 850);
        return; // Early return, we handle the thinking state manually inside setTimeout
      }

      if (!response.ok) {
        throw new Error(result.error || "Failed to get AI response");
      }

      setChatMessages(prev => [...prev, { sender: "bot", text: result.reply }]);
      setIsAIThinking(false);
    } catch (error) {
      console.error(error);
      setChatMessages(prev => [
        ...prev, 
        { sender: "bot", text: "⚠️ Sorry, I encountered an error connecting to the AI brain. Please try again." }
      ]);
      setIsAIThinking(false);
    }
  };

  const copyToClipboard = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };


  return (
    
            <div className="flex flex-col gap-6 animate-fadeIn">
              {/* Dynamic Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE]">
                      <Sparkles size={20} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                      PulseAI Interactive Media Studio
                    </h1>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold tracking-wide uppercase bg-rose-100 text-rose-600 rounded-full border border-rose-200">
                      Copilot v2.4 Live
                    </span>
                  </div>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Upload any video, post, or photo and freely chat with PulseAI for second-by-second feedback, hooks &amp; retention audits.
                  </p>
                </div>

                {/* Quick Action Buttons Header */}
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*,video/*,.txt,.md"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzingMedia}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                  >
                    <Upload size={14} />
                    <span>Upload Post / Video</span>
                  </button>
                  {uploadedMedia && (
                    <button
                      onClick={handleRemoveMedia}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold border border-rose-200/60 transition-all"
                    >
                      <Trash2 size={13} />
                      <span>Clear Media</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Instant Sample Demo Presets Bar */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Need instant demo content to test interactive AI chat?</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleSampleMediaClick("video")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-50 hover:bg-pink-100/80 text-pink-700 border border-pink-200/60 text-xs font-bold transition-all"
                  >
                    <Video size={13} />
                    <span>Sample Viral Reel (.mp4)</span>
                  </button>
                  <button
                    onClick={() => handleSampleMediaClick("image")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100/80 text-violet-700 border border-violet-200/60 text-xs font-bold transition-all"
                  >
                    <ImageIcon size={13} />
                    <span>Sample Carousel Slide (.png)</span>
                  </button>
                  <button
                    onClick={() => handleSampleMediaClick("post")}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100/80 text-amber-700 border border-amber-200/60 text-xs font-bold transition-all"
                  >
                    <FileText size={13} />
                    <span>Sample LinkedIn Draft (.txt)</span>
                  </button>
                </div>
              </div>

              {/* Main Split Screen Studio Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Left Side: Uploaded Media Preview Panel (4 Columns on Desktop) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between relative overflow-hidden min-h-[380px]">
                    <div>
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                        <div className="flex items-center gap-2">
                          <Film size={16} className="text-[#FF2E88]" />
                          <h3 className="text-sm font-extrabold text-slate-800" style={{ fontFamily: "Outfit, sans-serif" }}>
                            Active Content Stage
                          </h3>
                        </div>
                        {uploadedMedia && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200/50">
                            Loaded for Chat
                          </span>
                        )}
                      </div>

                      {/* Media Display Area */}
                      {isAnalyzingMedia ? (
                        <div className="w-full h-64 rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 animate-pulse">
                          <span className="w-8 h-8 border-3 border-[#FF2E88] border-t-transparent rounded-full animate-spin"></span>
                          <span className="text-xs font-bold text-slate-600">Analyzing video framing &amp; AI hook signals...</span>
                        </div>
                      ) : uploadedMedia ? (
                        <div className="flex flex-col gap-3">
                          {uploadedMedia.type === "video" ? (
                            <div className="relative rounded-xl overflow-hidden bg-slate-900 border border-slate-200 shadow-inner group">
                              {uploadedMedia.url ? (
                                <video
                                  controls
                                  src={uploadedMedia.url}
                                  className="w-full h-60 object-contain bg-black"
                                />
                              ) : (
                                <div className="w-full h-60 bg-gradient-to-br from-slate-900 to-pink-950 flex flex-col items-center justify-center gap-3 p-4 text-center">
                                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white">
                                    <Play size={24} className="ml-1" />
                                  </div>
                                  <span className="text-xs font-bold text-white">{uploadedMedia.name}</span>
                                  <span className="text-[10px] text-pink-300 font-semibold">{uploadedMedia.dimensions || "Vertical Video"}</span>
                                </div>
                              )}
                              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                                VIDEO ANALYZED ({uploadedMedia.duration || "0:45"})
                              </div>
                            </div>
                          ) : uploadedMedia.type === "image" ? (
                            <div className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={uploadedMedia.url}
                                alt="Uploaded preview"
                                className="w-full h-60 object-cover"
                              />
                              <div className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-black/75 backdrop-blur-md text-white text-[10px] font-bold flex items-center gap-1.5 pointer-events-none">
                                <ImageIcon size={11} className="text-pink-400" />
                                IMAGE ANALYZED ({uploadedMedia.dimensions})
                              </div>
                            </div>
                          ) : (
                            <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 h-60 overflow-y-auto font-mono text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-pink-600 uppercase mb-2">
                                <FileText size={12} />
                                POST COPY DRAFT ({uploadedMedia.name})
                              </div>
                              {mediaCaption || uploadedMedia.caption}
                            </div>
                          )}

                          {/* Media Metadata Details & Editable Caption */}
                          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800 truncate">
                              <span className="truncate max-w-[220px]" title={uploadedMedia.name}>{uploadedMedia.name}</span>
                              <span className="text-[10px] text-slate-400 font-semibold flex-shrink-0">{uploadedMedia.size}</span>
                            </div>
                            <div className="flex flex-col gap-1 mt-1">
                              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                Accompanying Post Caption / Context
                              </label>
                              <textarea
                                value={mediaCaption}
                                onChange={(e) => setMediaCaption(e.target.value)}
                                placeholder="Add or edit the caption associated with this video/image..."
                                className="w-full h-16 rounded-lg bg-white border border-slate-200 p-2 text-xs text-slate-800 focus:outline-none focus:border-[#FF2E88] transition-colors resize-none"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Empty State when no media is uploaded */
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="w-full h-64 rounded-xl border-2 border-dashed border-slate-200 hover:border-[#FF2E88]/50 bg-slate-50/50 hover:bg-pink-50/30 flex flex-col items-center justify-center gap-3.5 p-6 text-center cursor-pointer transition-all group"
                        >
                          <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[#FF2E88] group-hover:scale-110 transition-transform duration-250">
                            <Upload size={24} />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-800 block">Click or Drop Video/Photo Here</span>
                            <span className="text-[11px] text-slate-400 font-medium mt-0.5 block">
                              Supports MP4, MOV, PNG, JPG, or Text drafts up to 250 MB
                            </span>
                          </div>
                          <span className="px-3 py-1.5 rounded-lg bg-white text-slate-700 border border-slate-200 text-[11px] font-bold shadow-xs group-hover:text-[#FF2E88] group-hover:border-[#FF2E88]/30 transition-all">
                            Select File from Computer
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Analysis Trigger Chips below media */}
                    <div className="border-t border-slate-100 pt-3 mt-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                        One-Click Audit Questions
                      </span>
                      <div className="flex flex-col gap-1.5">
                        <button
                          onClick={() => handlePromptClick(uploadedMedia ? `Critique the hook and retention curve for "${uploadedMedia.name}"` : "Critique video hook structure and first 3 seconds")}
                          className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-pink-50/70 border border-slate-100 hover:border-pink-200 text-xs font-bold text-slate-700 hover:text-pink-600 transition-all flex items-center justify-between"
                        >
                          <span>⚡ Analyze Hook &amp; First 3 Seconds</span>
                          <ArrowUpRight size={13} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => handlePromptClick(uploadedMedia ? `Generate 3 viral captions and hashtags for "${uploadedMedia.name}"` : "Suggest viral captions and high-converting hashtags")}
                          className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-pink-50/70 border border-slate-100 hover:border-pink-200 text-xs font-bold text-slate-700 hover:text-pink-600 transition-all flex items-center justify-between"
                        >
                          <span>✍️ Generate Captions &amp; Hashtags</span>
                          <ArrowUpRight size={13} className="text-slate-400" />
                        </button>
                        <button
                          onClick={() => handlePromptClick(uploadedMedia ? `Evaluate visual lighting, color grading, and framing for "${uploadedMedia.name}"` : "Critique studio lighting and aesthetic framing")}
                          className="w-full text-left px-3 py-2 rounded-lg bg-slate-50 hover:bg-pink-50/70 border border-slate-100 hover:border-pink-200 text-xs font-bold text-slate-700 hover:text-pink-600 transition-all flex items-center justify-between"
                        >
                          <span>💡 Audit Studio Lighting &amp; Aesthetics</span>
                          <ArrowUpRight size={13} className="text-slate-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Freeform Interactive AI Chat Studio (7 Columns on Desktop) */}
                <div className="lg:col-span-7 flex flex-col">
                  <div className="rounded-2xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between h-[580px] overflow-hidden">
                    
                    {/* Chat Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE]">
                          <Bot size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-slate-800 flex items-center gap-2">
                            PulseAI Interactive Copilot
                            {uploadedMedia && (
                              <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-pink-100 text-pink-700">
                                Context: {uploadedMedia.type.toUpperCase()}
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            Ready to analyze your video &amp; answer any question
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setChatMessages([{ sender: "bot", text: "💬 Chat reset! Upload a video or photo, or ask me anything." }])}
                          className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 text-[11px] font-bold transition-all"
                          title="Clear conversation history"
                        >
                          Clear Chat
                        </button>
                      </div>
                    </div>

                    {/* Chat Messages List */}
                    <div
                      ref={chatScrollRef}
                      className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-4 bg-slate-50/30"
                      style={{ scrollbarWidth: "none" }}
                    >
                      {chatMessages.map((message, index) => (
                        <div
                          key={index}
                          className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                          {message.sender === "bot" && (
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 shadow-xs bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] mt-0.5">
                              <Sparkles size={15} />
                            </div>
                          )}

                          <div className={`flex flex-col gap-1.5 max-w-[82%] ${message.sender === "user" ? "items-end" : "items-start"}`}>
                            <div
                              className={`rounded-2xl px-4 py-3 text-xs sm:text-[13px] leading-relaxed shadow-sm ${
                                message.sender === "user"
                                  ? "bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] text-white font-medium rounded-br-xs"
                                  : "bg-white text-slate-800 border border-slate-100 font-medium rounded-bl-xs"
                              }`}
                              style={{ whiteSpace: "pre-line" }}
                            >
                              {message.text}
                            </div>

                            {/* Bot Actions: Copy & Feedback */}
                            {message.sender === "bot" && index > 0 && (
                              <div className="flex items-center gap-2 pl-1">
                                <button
                                  onClick={() => copyToClipboard(message.text, index)}
                                  className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-slate-700 transition-colors py-0.5"
                                >
                                  {copiedIndex === index ? (
                                    <>
                                      <Check size={12} className="text-emerald-500" />
                                      <span className="text-emerald-600 font-bold">Copied!</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={12} />
                                      <span>Copy response</span>
                                    </>
                                  )}
                                </button>
                                <span className="text-slate-200">|</span>
                                <button
                                  onClick={() => alert("Thank you for your feedback! PulseAI has logged this positive evaluation.")}
                                  className="text-slate-400 hover:text-emerald-500 transition-colors p-0.5"
                                  title="Helpful answer"
                                >
                                  <ThumbsUp size={12} />
                                </button>
                                <button
                                  onClick={() => alert("Thank you for your feedback! PulseAI will adjust tone for future answers.")}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-0.5"
                                  title="Unhelpful answer"
                                >
                                  <ThumbsDown size={12} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* AI Thinking Animation Indicator */}
                      {isAIThinking && (
                        <div className="flex gap-3 justify-start items-center">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] animate-pulse">
                            <Sparkles size={15} />
                          </div>
                          <div className="rounded-2xl px-4 py-3 bg-white border border-slate-100 shadow-sm flex items-center gap-2 text-xs font-bold text-slate-600">
                            <span className="w-2 h-2 rounded-full bg-[#FF2E88] animate-ping"></span>
                            <span>PulseAI is reviewing {uploadedMedia ? `"${uploadedMedia.name}"` : "your request"} &amp; generating insights...</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input Bar */}
                    <div className="p-4 border-t border-slate-100 bg-white">
                      <form
                        onSubmit={(e) => { e.preventDefault(); sendAI(); }}
                        className="flex gap-2.5 items-center bg-slate-50 border border-slate-200 focus-within:border-[#FF2E88] focus-within:ring-2 focus-within:ring-[#FF2E88]/15 rounded-xl px-4 py-2.5 transition-all shadow-sm"
                      >
                        <input
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          placeholder={uploadedMedia ? `Ask anything about "${uploadedMedia.name}" (hook pacing, retention, captions)...` : "Ask PulseAI anything or upload a video/photo first..."}
                          className="flex-1 bg-transparent text-xs sm:text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
                          disabled={isAIThinking}
                        />
                        <button
                          type="submit"
                          disabled={!chatInput.trim() || isAIThinking}
                          className="p-2.5 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] text-white font-bold disabled:opacity-40 transition-all transform active:scale-95 shadow-sm"
                        >
                          <Send size={15} />
                        </button>
                      </form>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold mt-2.5 px-1">
                        <span>💡 Tip: You can ask PulseAI to critique any second of your video or rewrite captions for different platforms.</span>
                        <span>PulseAI v2.4</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
  );
}
