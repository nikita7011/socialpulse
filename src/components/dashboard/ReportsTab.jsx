import React, { useState } from "react";
import { FileDown, RefreshCw, CheckCircle2, Sparkles, Download } from "lucide-react";

export default function ReportsTab() {
  const [reportPeriod, setReportPeriod] = useState("July 2026 (Current)");
  const [reportFormat, setReportFormat] = useState("Executive PDF Deck");
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [generatedReports, setGeneratedReports] = useState([
    { id: 101, title: "July 2026 Executive Analytics Deck", date: "Jul 15, 2026", pages: "12 pages", size: "4.8 MB", format: "PDF Deck", status: "Ready" },
    { id: 102, title: "Q2 2026 Cross-Platform Growth Summary", date: "Jul 1, 2026", pages: "24 pages", size: "8.2 MB", format: "PDF Deck", status: "Ready" },
    { id: 103, title: "Stripe API White-Label Client Portal Audit", date: "Jun 28, 2026", pages: "16 pages", size: "6.1 MB", format: "PDF Deck", status: "Ready" }
  ]);

  const handleGenerateReport = () => {
    setIsGeneratingReport(true);
    setTimeout(() => {
      const newRep = {
        id: Date.now(),
        title: `${reportPeriod} - ${reportFormat.split(" ")[0]} Report`,
        date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        pages: "14 pages",
        size: "5.4 MB",
        format: reportFormat.includes("PDF") ? "PDF Deck" : "Spreadsheet",
        status: "Ready"
      };
      setGeneratedReports(prev => [newRep, ...prev]);
      setIsGeneratingReport(false);
    }, 1100);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md text-white bg-gradient-to-tr from-[#FF2E88] to-[#f59e0b]">
              <FileDown size={20} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
              Monthly Analytics Reports
            </h1>
          </div>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Generate custom, boardroom-ready PDF analytics decks instantly via SQL aggregation.
          </p>
        </div>
        <button
          onClick={handleGenerateReport}
          disabled={isGeneratingReport}
          className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF2E88] to-[#FF5AAE] text-white font-extrabold shadow-[0_4px_14px_rgba(255,46,136,0.3)] hover:shadow-[0_6px_20px_rgba(255,46,136,0.4)] hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isGeneratingReport ? (
            <>
              <RefreshCw size={18} className="animate-spin" /> Compiling SQL...
            </>
          ) : (
            <>
              <FileDown size={18} /> Generate New Report
            </>
          )}
        </button>
      </div>

      {/* Custom Report Configuration Panel */}
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-4" style={{ fontFamily: "Outfit, sans-serif" }}>
          Report Builder Configuration
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Column 1: Period Selection */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Target Period</label>
            {["July 2026 (Current)", "Q2 2026 Comprehensive", "Full Year 2025-2026 Audit"].map(per => (
              <button
                key={per}
                type="button"
                onClick={() => setReportPeriod(per)}
                className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${reportPeriod === per ? "border-[#FF2E88] bg-pink-50/50 text-[#FF2E88] shadow-xs" : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200"}`}
              >
                <span>{per}</span>
                {reportPeriod === per && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>

          {/* Column 2: Export Format */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Select Output Format</label>
            {["Executive PDF Deck", "CSV Spreadsheet (Raw SQL)", "Agency White-Label Link"].map(fmt => (
              <button
                key={fmt}
                type="button"
                onClick={() => setReportFormat(fmt)}
                className={`p-3 rounded-xl border text-left font-bold transition-all flex items-center justify-between ${reportFormat === fmt ? "border-[#FF2E88] bg-pink-50/50 text-[#FF2E88] shadow-xs" : "border-slate-100 bg-slate-50/50 text-slate-700 hover:border-slate-200"}`}
              >
                <span>{fmt}</span>
                {reportFormat === fmt && <CheckCircle2 size={15} />}
              </button>
            ))}
          </div>

          {/* Column 3: Included Modules */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">Included Analytics Modules</label>
            <div className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col gap-2 font-medium text-slate-700">
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 size={14} /> Audience Growth &amp; Net Churn
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 size={14} /> Format Efficiency by Platform
              </div>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <CheckCircle2 size={14} /> Top 10 Posts &amp; Heatmap Timings
              </div>
              <div className="flex items-center gap-2 text-[#FF2E88] font-bold">
                <Sparkles size={14} /> PulseAI Recommendations Summary
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ready-to-Download Report Archives Grid */}
      <div>
        <h3 className="text-sm font-bold text-slate-800 mb-3" style={{ fontFamily: "Outfit, sans-serif" }}>
          Generated Reports Archive
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {generatedReports.map(rep => (
            <div key={rep.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-pink-50 text-[#FF2E88] border border-pink-100">
                    {rep.format}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">{rep.date}</span>
                </div>
                <h4 className="text-sm font-extrabold text-slate-800 leading-snug">{rep.title}</h4>
                <p className="text-xs text-slate-500 font-medium mt-1">Includes full Recharts snapshots &amp; SQL metrics.</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="text-[11px] font-bold text-slate-400">
                  {rep.pages} • {rep.size}
                </div>
                <button
                  onClick={() => alert(`Downloading "${rep.title}" (${rep.size})...`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download size={13} />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
