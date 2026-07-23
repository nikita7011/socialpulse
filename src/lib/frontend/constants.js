import React from "react";
import { Instagram, Linkedin, Youtube, Twitter, Threads, Facebook } from "../components/icons/Icons";

export const platformColors = {
  Instagram: "from-pink-500 to-rose-500",
  LinkedIn:  "from-blue-600 to-cyan-600",
  YouTube:   "from-red-600 to-rose-600",
  Twitter:   "from-slate-800 to-slate-950",
  Threads:   "from-slate-900 to-black",
  Facebook:  "from-blue-600 to-indigo-600",
};

export const platformIcons = {
  Instagram: <Instagram size={13} colorful={true} />,
  LinkedIn:  <Linkedin size={13} colorful={true} />,
  YouTube:   <Youtube size={13} colorful={true} />,
  Twitter:   <Twitter size={13} colorful={true} />,
  Threads:   <Threads size={13} colorful={true} />,
  Facebook:  <Facebook size={13} colorful={true} />,
};

export const typeColors = {
  video: "from-purple-500 to-indigo-500",
  image: "from-blue-500 to-cyan-500",
  carousel: "from-orange-400 to-amber-500",
  text: "from-slate-400 to-slate-500"
};
