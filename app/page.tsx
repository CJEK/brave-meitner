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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedStyleId={selectedStyleId}
        setSelectedStyleId={setSelectedStyleId}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Hero Overview & Quick Metric Strip */}
      <section className="border-b border-slate-200 bg-white py-3 sm:py-4 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
            {/* Left Property Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse" />
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-slate-900">
                  {PROPERTY_DATA.projectName}
                </span>
                <span className="text-slate-500 ml-2">
                  Tower A · 24楼 · <strong>{PROPERTY_DATA.unitNo}</strong> (Type B 6,900×9,725mm)
                </span>
              </div>
            </div>

            {/* Right Microclimate & Value KPI Chips */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium">
              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-slate-700">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                <span>SSE 165° (零西晒·全天漫射)</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-slate-700">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>648 sq ft (60.22 ㎡)</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-3 py-1 rounded-xl text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>永久地契 Freehold</span>
              </div>

              <div className="flex items-center space-x-1.5 bg-blue-50 border border-blue-200 px-3 py-1 rounded-xl text-blue-800 font-bold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
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
      <footer className="border-t border-slate-200 py-6 mt-12 bg-white text-xs text-slate-500 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold flex items-center justify-center text-[10px]">
              PG
            </div>
            <span className="text-slate-700 font-medium">Paragon Gateway (A-24-10) 3D 空间与室内风格决策 SaaS 平台</span>
          </div>

          <div className="flex items-center space-x-4">
            <span>
              Vercel Ready · Next.js 14 · Three.js Architectural Engine
            </span>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-blue-600 hover:text-blue-800 font-bold underline underline-offset-4"
            >
              查看决策终审报告 →
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
