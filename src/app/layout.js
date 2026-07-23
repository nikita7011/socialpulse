import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "SocialPulse — Professional Social Media Analytics Dashboard",
  description: "Track content performance, reach efficiency, and audience growth across Instagram, LinkedIn, YouTube, and Twitter.",
  metadataBase: new URL("https://socialpulse.vercel.app"),
  openGraph: {
    title: "SocialPulse Analytics Dashboard",
    description: "Track content performance, reach efficiency, and audience growth across platforms.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}
