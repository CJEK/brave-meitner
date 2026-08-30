"use client";

import React from "react";
import { 
  Building2, 
  Compass, 
  Layers, 
  Palette, 
  Cpu, 
  Calculator, 
  Download, 
  Sparkles, 
  Ruler, 
  Droplets 
} from "lucide-react";
import { STYLES_DATA, PROPERTY_DATA } from "@/data/projectData";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
  onOpenReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedStyleId,
  setSelectedStyleId,
  onOpenReport
}) => {
  const navItems = [
    { id: "3d-bim", label: "3D 空间推演", icon: Layers },
    { id: "style-matrix", label: "4大风格决策舱", icon: Palette },
    { id: "ergo-lighting", label: "卫浴大平台与工学", icon: Ruler },
    { id: "material-matrix", label: "有温度易打理材质", icon: Droplets },
    { id: "visual-gallery", label: "全景设计画廊", icon: Sparkles },
    { id: "smart-home", label: "Aqara 智能模拟", icon: Cpu },
    { id: "budget-bom", label: "马币造价核算", icon: Calculator },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Property Meta */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/10 text-white font-black tracking-wider">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm sm:text-base tracking-wide">
                  Paragon Gateway
                </span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                  {PROPERTY_DATA.unitNo}
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Type B 右向 · 648 sq ft (60.22 ㎡) · 24F 高层无遮挡
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Style Selector & Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Quick Style Switcher */}
            <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider px-1.5 hidden md:inline-block font-semibold">
                风格:
              </span>
              <select
                value={selectedStyleId}
                onChange={(e) => setSelectedStyleId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
              >
                {STYLES_DATA.map((s) => (
                  <option key={s.id} value={s.id} className="bg-white text-slate-800">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Decision Report Button */}
            <button
              onClick={onOpenReport}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-all shadow-sm shadow-blue-500/20 active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">导出决策报告</span>
              <span className="sm:hidden">报告</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Medium Screen Sub-Navigation */}
      <div className="flex xl:hidden overflow-x-auto px-4 py-2 bg-slate-50 border-t border-slate-200 space-x-2 no-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:bg-slate-200/60"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
