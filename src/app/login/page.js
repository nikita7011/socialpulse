"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { supabase } from "@/lib/frontend/supabase";

// Vertex shader source code
const vertexSmokeySource = `
  attribute vec4 a_position;
  void main() {
    gl_Position = a_position;
  }
`;

// Fragment shader source code for the smokey background effect (Cherry Blossom / SaaS Pink White theme)
const fragmentSmokeySource = `
precision mediump float;

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec3 u_color;
uniform vec3 u_base_color;

void mainImage(out vec4 fragColor, in vec2 fragCoord){
    vec2 uv = fragCoord / iResolution;
    vec2 centeredUV = (2.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);

    float time = iTime * 0.35;

    // Normalize mouse input (0.0 - 1.0) and remap to -1.0 ~ 1.0
    vec2 mouse = iMouse / iResolution;
    vec2 rippleCenter = 2.0 * mouse - 1.0;

    vec2 distortion = centeredUV;
    // Apply distortion for a gentle, subtle wavy effect
    for (float i = 1.0; i < 8.0; i++) {
        distortion.x += 0.35 / i * cos(i * 2.2 * distortion.y + time + rippleCenter.x * 3.1415);
        distortion.y += 0.35 / i * cos(i * 2.2 * distortion.x + time + rippleCenter.y * 3.1415);
    }

    // Create a subtle, clean wave pattern
    float wave = abs(sin(distortion.x + distortion.y + time));
    float glow = smoothstep(0.95, 0.20, wave);

    // Mix between soft pink-white canvas and cherry blossom pink ripples with clean opacity
    vec3 finalColor = mix(u_base_color, u_color, glow * 0.70);

    fragColor = vec4(finalColor, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;

/**
 * A mapping from blur size names to Tailwind CSS classes.
 */
const blurClassMap = {
  none: "backdrop-blur-none",
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
  "2xl": "backdrop-blur-2xl",
  "3xl": "backdrop-blur-3xl",
};

/**
 * A React component that renders an interactive WebGL shader background.
 */
export function SmokeyBackground({
  backdropBlurAmount = "xl",
  color = "#FF2E88",      // Primary Pink (#FF2E88)
  baseColor = "#FFF7FB",  // Background (#FFF7FB)
  className = "",
}) {
  const canvasRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Helper to convert hex color to RGB (0-1 range)
  const hexToRgb = (hex) => {
    const cleanHex = hex.replace("#", "");
    const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
    return [r, g, b];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl");
    if (!gl) {
      console.error("WebGL not supported");
      return;
    }

    const compileShader = (type, source) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSmokeySource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSmokeySource);
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program linking error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");
    const iMouseLocation = gl.getUniformLocation(program, "iMouse");
    const uColorLocation = gl.getUniformLocation(program, "u_color");
    const uBaseColorLocation = gl.getUniformLocation(program, "u_base_color");

    let startTime = Date.now();
    const [r, g, b] = hexToRgb(color);
    const [br, bg, bb] = hexToRgb(baseColor);
    gl.uniform3f(uColorLocation, r, g, b);
    gl.uniform3f(uBaseColorLocation, br, bg, bb);

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);

      const currentTime = (Date.now() - startTime) / 1000;

      gl.uniform2f(iResolutionLocation, width, height);
      gl.uniform1f(iTimeLocation, currentTime);
      gl.uniform2f(iMouseLocation, isHovering ? mousePosition.x : width / 2, isHovering ? height - mousePosition.y : height / 2);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      requestAnimationFrame(render);
    };

    const handleMouseMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      setMousePosition({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    };
    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseenter", handleMouseEnter);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    render();

    return () => {
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseenter", handleMouseEnter);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isHovering, mousePosition, color, baseColor]);

  const finalBlurClass = blurClassMap[backdropBlurAmount] || blurClassMap["xl"];

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden opacity-85 ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className={`absolute inset-0 ${finalBlurClass}`}></div>
    </div>
  );
}

/**
 * Compact Balanced SaaS Login Form (scaled down further for clean, modern screen aesthetics):
 * Card Width: 420px, Padding: 44px 32px 28px, Floating Icon: 56px (-28px top), Heading: 32px, Inputs: 46px height.
 */
export function LoginForm({
  email = "",
  setEmail = () => {},
  password = "",
  setPassword = () => {},
  showPassword = false,
  setShowPassword = () => {},
  rememberMe = false,
  setRememberMe = () => {},
  error = "",
  loading = false,
  onSubmit = (e) => e?.preventDefault(),
  onGoogleLogin = () => {}
}) {
  return (
    /* Card: Width 420px, Padding 32px 32px 24px, Border Radius 24px */
    <div className="w-full max-w-[400px] pt-[32px] px-[32px] pb-[24px] bg-white/85 backdrop-blur-2xl rounded-[24px] border border-[#E9E9EF]/80 shadow-[0_32px_80px_-16px_rgba(255,46,136,0.18)] relative z-10 text-left animate-slideUp flex flex-col justify-between my-4">
      
      {/* Floating Icon: 48×48px, Border Radius 14px, Top -24px, Center Aligned */}
      <div className="absolute top-[-24px] left-1/2 -translate-x-1/2 w-[48px] h-[48px] rounded-[14px] bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] text-white shadow-xl shadow-[#FF2E88]/30 flex items-center justify-center transition-transform duration-250 hover:scale-105 z-20">
        <Sparkles size={22} />
      </div>

      <div>
        {/* Welcome Heading: Font Size 28px, Line Height 34px, Weight 800, Margin Top 8px */}
        <div className="text-center">
          <h1 
            className="text-[26px] sm:text-[28px] leading-[34px] font-extrabold text-[#231F2D] tracking-tight font-display mt-[8px]"
            style={{ color: "#231F2D" }}
          >
            Welcome Back
          </h1>

          {/* Subtitle: Font Size 14px, Margin Top 4px, Margin Bottom 16px */}
          <p 
            className="text-[14px] font-medium text-[#7A7A87] mt-[4px] mb-[16px]"
            style={{ color: "#7A7A87" }}
          >
            Sign in to your SocialPulse workspace
          </p>
        </div>

        {error && (
          <div className="mb-[14px] p-3 text-[14px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-[14px] animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} suppressHydrationWarning>
          {/* Email Input */}
          <div className="relative w-full mb-[10px]">
            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
              <User size={20} />
            </div>
            <input
              suppressHydrationWarning
              id="email"
              type="text"
              className="w-full h-[44px] pl-[42px] pr-[16px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
              style={{ paddingLeft: "42px", paddingRight: "16px", color: "#231F2D" }}
              placeholder="Email or username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div className="relative w-full mb-[10px]">
            <div className="absolute left-[16px] top-1/2 -translate-y-1/2 text-[#7A7A87] pointer-events-none z-10 flex items-center justify-center">
              <Lock size={20} />
            </div>
            <input
              suppressHydrationWarning
              id="password"
              type={showPassword ? "text" : "password"}
              className="w-full h-[44px] pl-[42px] pr-[42px] rounded-[14px] bg-white border border-[#E9E9EF] text-[#231F2D] text-[15px] font-medium placeholder-[#7A7A87]/65 focus:bg-white focus:outline-none focus:border-[#FF2E88] focus:ring-4 focus:ring-[#FF2E88]/15 transition-all duration-250 ease-out shadow-sm"
              style={{ paddingLeft: "42px", paddingRight: "42px", color: "#231F2D" }}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-[14px] top-1/2 -translate-y-1/2 p-1.5 text-[#7A7A87] hover:text-[#FF2E88] focus:outline-none transition-colors duration-250 rounded-lg hover:bg-[#FFF7FB] z-10 flex items-center justify-center"
              tabIndex="-1"
              title={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Remember Me Row */}
          <div className="flex items-center justify-between mt-[2px] mb-[12px] text-[13px]">
            <label className="flex items-center gap-2 font-medium text-[#231F2D] cursor-pointer select-none" style={{ color: "#231F2D" }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-[14px] h-[14px] rounded-[4px] text-[#FF2E88] border-[#E9E9EF] focus:ring-[#FF2E88] cursor-pointer accent-[#FF2E88] transition-all duration-250"
              />
              <span>Remember me</span>
            </label>
            <Link 
              href="#" 
              className="font-semibold text-[#FF2E88] hover:text-[#FF5AAE] transition-colors duration-250"
              style={{ color: "#FF2E88" }}
            >
              Forgot Password?
            </Link>
          </div>
          
          {/* Sign In Button */}
          <button
            suppressHydrationWarning
            type="submit"
            disabled={loading}
            className="group w-full h-[44px] flex items-center justify-center gap-2 bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] hover:from-[#e6207a] hover:to-[#f0499e] rounded-[14px] text-white font-bold text-[15px] shadow-[0_12px_32px_-6px_rgba(255,46,136,0.35)] hover:shadow-[0_18px_40px_-6px_rgba(255,46,136,0.5)] hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-[#FF2E88]/30 transition-all duration-250 ease-out disabled:opacity-70"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            ) : null}
            <span>Sign In</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform duration-250 ease-out" />
          </button>
        </form>


      </div>

      {/* Footer */}
      <div className="mt-[12px] text-center">
        <p className="text-[13px] text-[#7A7A87] font-medium" style={{ color: "#7A7A87" }}>
          New to SocialPulse?{" "}
          <Link 
            href="/signup" 
            className="font-bold text-[#FF2E88] hover:text-[#FF5AAE] hover:underline transition-all duration-250"
            style={{ color: "#FF2E88" }}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

/**
 * Main Login Page rendering the Compact Balanced Size (~15% scaled further for clean modal aesthetics).
 */
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const clearSession = async () => {
      try {
        localStorage.removeItem("socialpulse_mock_user");
        localStorage.removeItem("socialpulse_connected_platforms");
        await supabase.auth.signOut();
      } catch (err) {
        console.error("Error clearing session:", err);
      }
    };
    clearSession();
  }, []);

  const handleLogin = async (e) => {
    e?.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (loginError) {
        setError(loginError.message || "Invalid username/email or password.");
      } else if (data.session) {
        if (data.session.isMock) {
          localStorage.setItem("socialpulse_mock_user", JSON.stringify({
            username: data.session.user.user_metadata?.username || `@${email.split("@")[0]}`,
            isMock: true,
            email: data.session.user.email
          }));
        } else {
          localStorage.removeItem("socialpulse_mock_user");
        }

        // Check if platforms are connected
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
      } else {
        setError("Unable to authenticate. Please check your credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setError("Google OAuth is currently disabled in this demo environment. Please sign in with username or email.");
  };

  return (
    <div className="auth-theme relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#FFF7FB] animate-fadeIn">
      {/* Global CSS overrides and animations */}
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

      {/* Smokey WebGL Background with Cherry Blossom Palette */}
      <SmokeyBackground
        backdropBlurAmount="xl"
        color="#FF2E88"       // Primary Pink (#FF2E88)
        baseColor="#FFF7FB"   // Background (#FFF7FB)
      />

      {/* Large blurred shapes: filter: blur(90px); opacity: .85 */}
      <div className="absolute top-1/4 left-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-[#FF2E88]/15 to-[#FF5AAE]/15 rounded-full filter blur-[90px] opacity-85 pointer-events-none animate-blob"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[380px] h-[380px] bg-gradient-to-tr from-[#FF5AAE]/15 to-rose-300/10 rounded-full filter blur-[90px] opacity-85 pointer-events-none animate-blob" style={{ animationDelay: "4s" }}></div>

      {/* Header: Fixed top 0, height 64px, padding 0 48px, z-index 100 */}
      <header className="fixed top-0 left-0 w-full h-[64px] px-6 sm:px-[48px] flex items-center justify-between z-[100]">
        {/* Logo: gap 12px, icon 36×36px radius 10px, text 26px weight 700 */}
        <Link href="/" className="flex items-center gap-[12px] group">
          <div className="w-[36px] h-[36px] rounded-[10px] bg-gradient-to-tr from-[#FF2E88] to-[#FF5AAE] flex items-center justify-center text-white font-bold text-[16px] shadow-md shadow-[#FF2E88]/20 group-hover:scale-105 transition-transform duration-250">
            SP
          </div>
          <span className="font-display font-bold text-[26px] text-[#231F2D] leading-none tracking-tight" style={{ color: "#231F2D" }}>
            Social<span className="text-[#FF2E88]">Pulse</span>
          </span>
        </Link>
        {/* Home Button: height 34px, padding 0 14px, radius 999px, font size 13px, weight 600 */}
        <Link
          href="/"
          className="h-[34px] px-[14px] rounded-full bg-white/90 hover:bg-white text-[#231F2D] text-[13px] font-semibold border border-[#E9E9EF] shadow-sm hover:shadow flex items-center justify-center gap-2 transition-all duration-250"
          style={{ color: "#231F2D" }}
        >
          &larr; Home
        </Link>
      </header>

      {/* Main Container: min-height 100vh, padding-top 64px, centered */}
      <main className="min-h-screen w-full flex items-center justify-center pt-[64px] px-4">
        <LoginForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          rememberMe={rememberMe}
          setRememberMe={setRememberMe}
          error={error}
          loading={loading}
          onSubmit={handleLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      </main>
    </div>
  );
}
