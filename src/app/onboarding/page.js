"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import { SmokeyBackground } from "../login/page";

import { SiInstagram, SiYoutube, SiX, SiFacebook } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

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

const Facebook = ({ size = 16, className = "", colorful = false }) => (
  colorful ? (
    <SiFacebook size={size} color="#1877F2" className={className} />
  ) : <SiFacebook size={size} className={className} />
);

const platforms = [
  { id: "Instagram", name: "Instagram", Icon: Instagram, color: "from-pink-500 to-rose-500", shadow: "shadow-pink-500/20" },
  { id: "LinkedIn", name: "LinkedIn", Icon: Linkedin, color: "from-blue-600 to-cyan-600", shadow: "shadow-blue-500/20" },
  { id: "Twitter", name: "X (Twitter)", Icon: Twitter, color: "from-slate-800 to-slate-950", shadow: "shadow-slate-800/20" },
  { id: "Facebook", name: "Facebook", Icon: Facebook, color: "from-blue-600 to-indigo-600", shadow: "shadow-indigo-500/20" },
  { id: "YouTube", name: "YouTube", Icon: Youtube, color: "from-red-600 to-rose-600", shadow: "shadow-red-500/20" }
];

export default function OnboardingPage() {
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Load existing selection if any
  useEffect(() => {
    try {
      const stored = localStorage.getItem("socialpulse_connected_platforms");
      if (stored) {
        setSelectedPlatforms(JSON.parse(stored));
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  const togglePlatform = (id) => {
    setSelectedPlatforms(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selectedPlatforms.length === 0) return;
    setIsSubmitting(true);
    
    // Save to local storage for the mock data generator to pick up
    localStorage.setItem("socialpulse_connected_platforms", JSON.stringify(selectedPlatforms));
    
    // Simulate connection delay
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFF7FB] animate-fadeIn p-4">
      <SmokeyBackground backdropBlurAmount="xl" color="#FF2E88" baseColor="#FFF7FB" />
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-[#FF2E88]/15 to-[#FF5AAE]/15 rounded-full filter blur-[90px] opacity-85 pointer-events-none" style={{ animation: 'blobFloat 12s infinite ease-in-out' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-[#FF5AAE]/15 to-rose-300/10 rounded-full filter blur-[90px] opacity-85 pointer-events-none" style={{ animation: 'blobFloat 12s infinite ease-in-out 4s' }}></div>

      <main className="relative z-10 w-full max-w-[560px] p-8 sm:p-10 bg-white/85 backdrop-blur-2xl rounded-[28px] border border-[#E9E9EF]/80 shadow-[0_32px_80px_-16px_rgba(255,46,136,0.18)] text-center animate-slideUp">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-[16px] bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] text-white shadow-xl shadow-[#FF2E88]/30 mb-5">
          <Sparkles size={28} />
        </div>

        <h1 className="text-[28px] sm:text-[32px] font-extrabold text-[#231F2D] leading-tight tracking-tight mb-2">
          Connect Your Accounts
        </h1>
        <p className="text-[15px] font-medium text-[#7A7A87] mb-8 max-w-sm mx-auto">
          Choose the platforms you want to pull data from. You can always change this later in settings.
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-10 text-left">
          {platforms.map((platform) => {
            const isSelected = selectedPlatforms.includes(platform.id);
            return (
              <button
                key={platform.id}
                onClick={() => togglePlatform(platform.id)}
                className={`relative overflow-hidden flex items-center justify-between p-4 rounded-[16px] border-2 transition-all duration-200 ${
                  isSelected 
                    ? 'border-[#FF2E88] bg-[#FFF7FB] shadow-[0_8px_20px_-6px_rgba(255,46,136,0.2)]' 
                    : 'border-[#E9E9EF] bg-white hover:border-[#FF2E88]/40 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${platform.color} flex items-center justify-center shadow-lg ${platform.shadow}`}>
                    <platform.Icon size={22} colorful={false} className="text-white" />
                  </div>
                  <span className={`font-bold text-[15px] ${isSelected ? 'text-[#231F2D]' : 'text-[#475569]'}`}>
                    {platform.name}
                  </span>
                </div>
                
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-[#FF2E88] bg-[#FF2E88]' : 'border-[#CBD5E1]'
                }`}>
                  {isSelected && <CheckCircle2 size={12} className="text-white" strokeWidth={4} />}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={selectedPlatforms.length === 0 || isSubmitting}
          className="group w-full h-[52px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] rounded-[16px] text-white font-bold text-[16px] shadow-[0_12px_32px_-6px_rgba(255,46,136,0.35)] hover:shadow-[0_18px_40px_-6px_rgba(255,46,136,0.5)] hover:-translate-y-0.5 focus:outline-none transition-all duration-250 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {isSubmitting ? (
            <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          ) : (
            <>
              <span>{selectedPlatforms.length === 0 ? "Select at least one" : "Connect & Continue"}</span>
              {selectedPlatforms.length > 0 && <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />}
            </>
          )}
        </button>
      </main>
    </div>
  );
}
