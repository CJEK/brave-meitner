"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Spatial3DViewer } from "@/components/Spatial3DViewer";
import { StyleComparisonMatrix } from "@/components/StyleComparisonMatrix";
import { ErgonomicsAndLighting } from "@/components/ErgonomicsAndLighting";
import { MaterialComparison } from "@/components/MaterialComparison";
import { VisualGallery } from "@/components/VisualGallery";
import { SmartHomeSimulator } from "@/components/SmartHomeSimulator";
import { BudgetCalculator } from "@/components/BudgetCalculator";
import { DecisionModal } from "@/components/DecisionModal";
import { PROPERTY_DATA, STYLES_DATA } from "@/data/projectData";
import { 
  Building2, 
  Compass, 
  Layers, 
  Palette, 
  Cpu, 
  Calculator, 
  Sparkles, 
  ArrowRight, 
  Sun, 
  ShieldCheck, 
  CheckCircle2, 
  Ruler,
  Droplets
} from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>("3d-bim");
  const [selectedStyleId, setSelectedStyleId] = useState<string>("tech-minimal");
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedStyleId={selectedStyleId}
        setSelectedStyleId={setSelectedStyleId}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Hero Overview & Quick Metric Strip */}
      <section className="border-b border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-transparent py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Left Property Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-200">
                  {PROPERTY_DATA.projectName}
                </span>
                <span className="text-slate-400 ml-2">
                  Tower A · 24楼 · <strong>{PROPERTY_DATA.unitNo}</strong> (Type B 6,900×9,725mm)
                </span>
              </div>
            </div>

            {/* Right Microclimate & Value KPI Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
                <Compass className="w-3.5 h-3.5 text-amber-400" />
                <span>SSE 165° (零西晒·全天漫射)</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>648 sq ft (60.22 ㎡)</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1 rounded-xl text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>永久地契 Freehold</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 rounded-xl text-cyan-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>当前风格: {currentStyle.name}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Tabbed Interactive Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {activeTab === "3d-bim" && (
          <Spatial3DViewer selectedStyleId={selectedStyleId} />
        )}

        {activeTab === "style-matrix" && (
          <StyleComparisonMatrix
            selectedStyleId={selectedStyleId}
            setSelectedStyleId={setSelectedStyleId}
          />
        )}

        {activeTab === "ergo-lighting" && (
          <ErgonomicsAndLighting />
        )}

        {activeTab === "material-matrix" && (
          <MaterialComparison />
        )}

        {activeTab === "visual-gallery" && (
          <VisualGallery
            selectedStyleId={selectedStyleId}
            setSelectedStyleId={setSelectedStyleId}
          />
        )}

        {activeTab === "smart-home" && (
          <SmartHomeSimulator />
        )}

        {activeTab === "budget-bom" && (
          <BudgetCalculator />
        )}
      </main>

      {/* Decision Summary Modal */}
      <DecisionModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        selectedStyleId={selectedStyleId}
      />

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 mt-12 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-[10px]">
              PG
            </div>
            <span>Paragon Gateway (A-24-10) 3D 空间与室内风格决策 SaaS 平台</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-500">
              Vercel Ready · Next.js 14 · Three.js BIM Engine
            </span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-4"
            >
              查看决策终审报告 →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
