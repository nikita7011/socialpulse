"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, Mail, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/lib/frontend/supabase";
import { SmokeyBackground } from "../login/page";

export default function SignupPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            full_name: fullName,
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
      } else if (data?.user && data?.session === null) {
        setSuccess("Registration successful! Please check your email to confirm your account, then sign in.");
        setFullName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setAgreeTerms(false);
      } else {
        setSuccess("Registration successful! Redirecting to dashboard...");
        const isMockSession = data?.session?.access_token === "mock-token" || !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("your-project-id");
        if (isMockSession) {
          localStorage.setItem("socialpulse_mock_user", JSON.stringify({
            username: `@${email.split("@")[0]}`,
            isMock: true,
            email: email
          }));
        }
        setTimeout(() => {
          const storedPlatforms = localStorage.getItem("socialpulse_connected_platforms");
          let connectedPlatforms = null;
          if (storedPlatforms) {
            try { connectedPlatforms = JSON.parse(storedPlatforms); } catch(e) {}
          }
          if (!connectedPlatforms || connectedPlatforms.length === 0) {
            router.push("/onboarding");
          } else {
            router.push("/dashboard");
          }
        }, 1500);
      }
    } catch (err) {
      setError("An unexpected error occurred during registration.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-theme relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFF7FB] animate-fadeIn p-4 sm:p-6">
      {/* Global CSS overrides for browser autofill and exact animations/durations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }
        .animate-fadeIn {
          animation: fadeIn 250ms ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 250ms ease-out forwards;
        }
        .animate-blob {
          animation: blobFloat 12s infinite ease-in-out;
        }
        input:-webkit-autofill,
        input:-webkit-autofill:hover, 
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #ffffff inset !important;
          -webkit-text-fill-color: #231F2D !important;
          transition: background-color 5000s ease-in-out 0s;
        }
        .auth-theme h1, .auth-theme h2, .auth-theme h3 {
          color: #231F2D !important;
        }
      `}</style>

      {/* Smokey WebGL Background with Cherry Blossom / Pink White Palette */}
      <SmokeyBackground
        backdropBlurAmount="md"
        color="#FF2E88"       // Primary Pink (#FF2E88)
        baseColor="#FFF7FB"   // Background (#FFF7FB)
      />

      {/* Large blurred blobs and glowing accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-[#FF2E88]/15 to-[#FF5AAE]/15 rounded-full filter blur-[100px] pointer-events-none animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-tr from-[#FF5AAE]/15 to-rose-300/10 rounded-full filter blur-[100px] pointer-events-none animate-blob" style={{ animationDelay: "4s" }}></div>

      {/* Top Navbar */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between h-20 px-6 sm:px-12 w-full max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] flex items-center justify-center text-white font-bold shadow-md shadow-[#FF2E88]/20 group-hover:scale-105 transition-transform duration-250">
            SP
          </div>
          <span className="font-display font-extrabold text-2xl text-[#231F2D] tracking-tight" style={{ color: "#231F2D" }}>
            Social<span className="text-[#FF2E88]">Pulse</span>
          </span>
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 hover:bg-white text-[#231F2D] text-sm font-semibold border border-[#E9E9EF] shadow-sm hover:shadow transition-all duration-250"
          style={{ color: "#231F2D" }}
        >
          &larr; Home
        </Link>
      </header>

      {/* Centered Signup Card */}
      <main className="relative z-10 w-full flex items-center justify-center py-6 sm:py-8">
        <div className="w-full max-w-[440px] p-6 sm:p-8 bg-white/85 backdrop-blur-2xl rounded-[24px] border border-[#E9E9EF]/80 shadow-[0_32px_80px_-16px_rgba(255,46,136,0.18)] relative z-10 text-left animate-slideUp flex flex-col">
          
          {/* Header */}
          <div className="text-center flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-[14px] bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] text-white shadow-xl shadow-[#FF2E88]/30 mb-3 transition-transform duration-250 hover:scale-105">
              <Sparkles size={24} />
            </div>

            <h2 className="text-[26px] sm:text-[28px] font-extrabold text-[#231F2D] leading-tight tracking-tight font-display mb-1.5">
              Create Account
            </h2>

            <p className="text-[14px] font-medium text-[#7A7A87] mb-5">
              Join SocialPulse to access insights and analytics
            </p>
          </div>

          <form onSubmit={handleSignup} className="flex flex-col gap-4" suppressHydrationWarning>
            {error && (
              <div className="p-4 text-sm font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-[16px] animate-fadeIn">
                {error}
              </div>
            )}
            {success && (
              <div className="p-4 text-sm font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-[16px] animate-fadeIn">
                {success}
              </div>
            )}

            <div className="flex flex-col gap-3">
              {/* Full Name Input */}
              <div className="relative w-full">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
                  <User size={22} />
                </div>
                <input
                  suppressHydrationWarning
                  id="fullName"
                  type="text"
                  className="w-full h-[44px] pl-[46px] pr-[16px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
                  style={{ paddingLeft: "46px", paddingRight: "16px", color: "#231F2D" }}
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div className="relative w-full">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
                  <Mail size={22} />
                </div>
                <input
                  suppressHydrationWarning
                  id="email"
                  type="email"
                  className="w-full h-[44px] pl-[46px] pr-[16px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
                  style={{ paddingLeft: "46px", paddingRight: "16px", color: "#231F2D" }}
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="relative w-full">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
                  <Lock size={22} />
                </div>
                <input
                  suppressHydrationWarning
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className="w-full h-[44px] pl-[46px] pr-[46px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
                  style={{ paddingLeft: "46px", paddingRight: "46px", color: "#231F2D" }}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-[18px] top-1/2 -translate-y-1/2 p-2 text-[#7A7A87] hover:text-[#FF2E88] focus:outline-none transition-colors duration-250 rounded-lg hover:bg-[#FFF7FB] z-10 flex items-center justify-center"
                  tabIndex="-1"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="relative w-full">
                <div className="absolute left-[18px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
                  <Lock size={22} />
                </div>
                <input
                  suppressHydrationWarning
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  className="w-full h-[44px] pl-[46px] pr-[46px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
                  style={{ paddingLeft: "46px", paddingRight: "46px", color: "#231F2D" }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-[18px] top-1/2 -translate-y-1/2 p-2 text-[#7A7A87] hover:text-[#FF2E88] focus:outline-none transition-colors duration-250 rounded-lg hover:bg-[#FFF7FB] z-10 flex items-center justify-center"
                  tabIndex="-1"
                >
                  {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center px-1 mt-1 mb-1">
              <label className="flex items-start gap-3 text-[13px] font-medium text-[#231F2D] cursor-pointer select-none" style={{ color: "#231F2D" }}>
                <input
                  id="agreeTerms"
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 w-[16px] h-[16px] rounded-[4px] text-[#FF2E88] border-[#E9E9EF] focus:ring-[#FF2E88] cursor-pointer accent-[#FF2E88] transition-all duration-250 flex-shrink-0"
                />
                <span className="leading-tight">
                  I agree to the <Link href="#" className="font-semibold text-[#FF2E88] hover:underline">Terms of Service</Link> and <Link href="#" className="font-semibold text-[#FF2E88] hover:underline">Privacy Policy</Link>
                </span>
              </label>
            </div>
            
            {/* Submit Button */}
                <button
              suppressHydrationWarning
              type="submit"
              disabled={loading}
              className="group w-full h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] rounded-[14px] text-white font-bold text-[15px] shadow-[0_12px_32px_-6px_rgba(255,46,136,0.35)] hover:shadow-[0_18px_40px_-6px_rgba(255,46,136,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#FF2E88]/30 transition-all duration-250 ease-out disabled:opacity-70"
            >
              {loading ? (
                <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1"></span>
              ) : null}
              <span>Get Started</span>
              <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-250 ease-out" />
            </button>
          </form>

          {/* Footer */}
          <div className="mt-4 pt-4 text-center border-t border-[#E9E9EF]/50">
            <p className="text-[13px] text-[#7A7A87] font-medium" style={{ color: "#7A7A87" }}>
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="font-bold text-[#FF2E88] hover:text-[#FF5AAE] hover:underline transition-all duration-250"
                style={{ color: "#FF2E88" }}
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
