"use client";

import React, { useState } from "react";
import { 
  Palette, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Award, 
  Sliders, 
  Zap, 
  Sun, 
  Maximize, 
  Moon, 
  DollarSign, 
  TrendingUp, 
  Layers, 
  Maximize2,
  AlertCircle
} from "lucide-react";
import { STYLES_DATA, StyleData } from "@/data/projectData";

interface StyleComparisonMatrixProps {
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
}

export const StyleComparisonMatrix: React.FC<StyleComparisonMatrixProps> = ({
  selectedStyleId,
  setSelectedStyleId
}) => {
  // A/B Comparison State (Default to Tech Minimal vs Italian Dark Luxury)
  const [compareStyleA, setCompareStyleA] = useState<string>("tech-minimal");
  const [compareStyleB, setCompareStyleB] = useState<string>("dark-luxury");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [compareRoomIndex, setCompareRoomIndex] = useState<number>(0); // 0: Living, 1: Study, 2: Bedroom

  // Custom User Importance Weights (1-10)
  const [weightGeek, setWeightGeek] = useState<number>(9);
  const [weightOpenness, setWeightOpenness] = useState<number>(8);
  const [weightMaintenance, setWeightMaintenance] = useState<number>(9);
  const [weightBudget, setWeightBudget] = useState<number>(7);
  const [weightSleep, setWeightSleep] = useState<number>(8);

  const styleA = STYLES_DATA.find((s) => s.id === compareStyleA) || STYLES_DATA[0];
  const styleB = STYLES_DATA.find((s) => s.id === compareStyleB) || STYLES_DATA[1];
  const isSameStyle = compareStyleA === compareStyleB;

  // Calculate Weighted Preference Score (Normalized to 100)
  const calculateScore = (style: StyleData) => {
    const r = style.radarScores;
    const totalWeight = weightGeek + weightOpenness + weightMaintenance + weightBudget + weightSleep;
    const weightedSum =
      r.geekSynergy * weightGeek +
      r.openness * weightOpenness +
      r.maintenance * weightMaintenance +
      r.costEfficiency * weightBudget +
      r.sleepComfort * weightSleep;
    return Math.round(weightedSum / totalWeight);
  };

  // Sorted Styles based on user customized weights
  const rankedStyles = [...STYLES_DATA].sort((a, b) => calculateScore(b) - calculateScore(a));

  // High-Fidelity SVG Vector Rendering for A/B Visual Comparison
  const renderRoomIllustration = (style: StyleData, roomIdx: number, isRightLayer: boolean) => {
    const isDark = style.id === "dark-luxury" || style.id === "italian-luxury";
    const isJapandi = style.id === "japandi-wood";
    const isCyber = style.id === "industrial-cyber";

    const wallColor = isDark ? "#1c1917" : isJapandi ? "#fafaf9" : isCyber ? "#334155" : "#f8fafc";
    const floorBg = isDark ? "#09090b" : isJapandi ? "#fef3c7" : isCyber ? "#1e293b" : "#ede8df";
    const sofaColor = isDark ? "#451a03" : isJapandi ? "#e7d8c9" : isCyber ? "#0284c7" : "#e2e8f0";
    const accentLight = isDark ? "#f59e0b" : isJapandi ? "#d4a373" : isCyber ? "#06b6d4" : "#38bdf8";
    const tvBorder = isDark ? "#78350f" : isJapandi ? "#b45309" : isCyber ? "#0284c7" : "#64748b";

    return (
      <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
        {/* Background Wall Texture & Mood Ambient */}
        <rect x="0" y="0" width="800" height="500" fill={wallColor} />
        {/* Architectural Linear Wall Fluting / Sintered Stone Veins */}
        {isDark && (
          <g opacity="0.25">
            <line x1="80" y1="0" x2="200" y2="400" stroke="#f59e0b" strokeWidth="1.5" />
            <line x1="300" y1="0" x2="450" y2="400" stroke="#f59e0b" strokeWidth="1" />
            <line x1="600" y1="0" x2="720" y2="400" stroke="#f59e0b" strokeWidth="2" />
          </g>
        )}
        {isJapandi && (
          <g opacity="0.3">
            {[...Array(20)].map((_, i) => (
              <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="360" stroke="#d4a373" strokeWidth="2" strokeDasharray="6 3" />
            ))}
          </g>
        )}
        {isCyber && (
          <g opacity="0.2">
            {[...Array(12)].map((_, i) => (
              <line key={i} x1="0" y1={i * 35} x2="800" y2={i * 35} stroke="#06b6d4" strokeWidth="1" />
            ))}
          </g>
        )}

        {/* Floor Horizon & Large Format Tiles */}
        <rect x="0" y="360" width="800" height="140" fill={floorBg} />
        {/* Floor Herringbone / Tile Grout Lines */}
        <g opacity="0.35">
          <line x1="0" y1="400" x2="800" y2="400" stroke="#94a3b8" strokeWidth="1.5" />
          <line x1="0" y1="450" x2="800" y2="450" stroke="#94a3b8" strokeWidth="1.5" />
          {[...Array(16)].map((_, i) => (
            <line key={i} x1={i * 50} y1="360" x2={i * 50 + 30} y2="500" stroke="#94a3b8" strokeWidth="1" />
          ))}
        </g>

        {/* 85" Ultra-Slim Floating TV Screen with LED Ambient Halo */}
        <rect x="180" y="70" width="440" height="210" rx="8" fill="#0f172a" stroke={tvBorder} strokeWidth="3" />
        {/* TV Screen Display Mockup */}
        <rect x="188" y="78" width="424" height="194" rx="4" fill={isDark ? "#1e1b4b" : isJapandi ? "#451a03" : isCyber ? "#082f49" : "#0f172a"} />
        <text x="400" y="175" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold" opacity="0.95">
          {style.roomRenderings[roomIdx].title}
        </text>
        <text x="400" y="205" textAnchor="middle" fill={accentLight} fontSize="12" fontWeight="bold" fontFamily="monospace">
          {style.roomRenderings[roomIdx].visualStyle}
        </text>

        {/* Floating TV Console & Dolby Atmos Soundbar */}
        <rect x="140" y="300" width="520" height="35" rx="6" fill={isDark ? "#292524" : isJapandi ? "#d4a373" : isCyber ? "#0284c7" : "#ffffff"} stroke="#64748b" strokeWidth="1.5" />
        <rect x="280" y="288" width="240" height="10" rx="3" fill="#0f172a" />

        {/* Main Furniture: Ergonomic Linen/Leather Sofa */}
        <g transform="translate(100, 320)">
          <rect x="0" y="20" width="320" height="60" rx="8" fill={sofaColor} stroke="#475569" strokeWidth="2" />
          <rect x="10" y="0" width="300" height="30" rx="6" fill={sofaColor} stroke="#475569" strokeWidth="1.5" />
          <rect x="25" y="15" width="80" height="25" rx="4" fill={accentLight} opacity="0.9" />
          <rect x="120" y="15" width="80" height="25" rx="4" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Monolithic Sintered Stone Island Dining Bar */}
        <g transform="translate(520, 270)">
          <rect x="0" y="0" width="220" height="110" rx="8" fill={isDark ? "#09090b" : isJapandi ? "#e8d5b5" : isCyber ? "#cbd5e1" : "#ffffff"} stroke="#64748b" strokeWidth="2" />
          <line x1="0" y1="18" x2="220" y2="18" stroke={accentLight} strokeWidth="3" />
          <text x="110" y="65" textAnchor="middle" fill={isDark ? "#ffffff" : "#0f172a"} fontSize="11" fontWeight="bold">
            {isDark ? "劳伦黑金岩板中岛" : isJapandi ? "原木一体挑台" : "可丽耐无缝中岛"}
          </text>
        </g>

        {/* Spotlight Beams from Ceiling */}
        <polygon points="220,42 160,300 280,300" fill="url(#spotlight-grad)" opacity="0.15" />
        <polygon points="580,42 500,270 660,270" fill="url(#spotlight-grad)" opacity="0.15" />

        {/* Gradients */}
        <defs>
          <linearGradient id="spotlight-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <div className="space-y-8">
      {/* 4 Style Selection Grid Cards */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center">
              <Palette className="w-6 h-6 mr-2 text-blue-600" />
              4 大室内设计风格横向决策舱
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              针对 Paragon Gateway 648 sq ft 单人极致高效生活，深度对比 4 种不同美学路线与材质体系
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-slate-500">当前主推风格:</span>
            <span className="font-bold text-slate-900">
              {STYLES_DATA.find((s) => s.id === selectedStyleId)?.name}
            </span>
          </div>
        </div>

        {/* 4 Style Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {STYLES_DATA.map((style) => {
            const isSelected = selectedStyleId === style.id;
            const score = calculateScore(style);

            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`relative rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "bg-blue-50/50 border-blue-600 shadow-xl ring-2 ring-blue-500 scale-[1.02] -translate-y-1"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5"
                }`}
              >
                {/* Top Badge & Score */}
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                      isSelected ? "bg-blue-600 text-white shadow-2xs" : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}>
                      {style.badge}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded shadow-2xs">
                        ★ 推荐首选
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-xs font-mono font-bold text-blue-600">
                    <Award className="w-3.5 h-3.5" />
                    <span>{score} 分</span>
                  </div>
                </div>

                {/* Style Title & Tagline */}
                <div className="space-y-1 mb-3">
                  <h3 className="text-lg font-black text-slate-900">{style.name}</h3>
                  <div className="text-[11px] font-semibold text-blue-600 font-mono">
                    {style.enName}
                  </div>
                  <p className="text-xs text-slate-800 font-bold leading-snug">
                    {style.tagline}
                  </p>
                </div>

                {/* 3 Structured Key Highlights */}
                <div className="space-y-1.5 mb-3 bg-white/80 p-3 rounded-2xl border border-slate-200/70 text-xs">
                  {style.keyMaterials.slice(0, 3).map((mat, i) => (
                    <div key={i} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500 font-medium">{mat.category}:</span>
                      <span className="font-bold text-slate-800 truncate ml-1">{mat.item}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom Select Action */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStyleId(style.id);
                  }}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-2xs ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? "✓ 当前选定方案" : "切换为此风格"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* A/B Split Screen Visual Comparison */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-600" />
              A/B 风格分屏动态滑块实时对比
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              左右拖动中央分界线，实时对比两种不同风格在同一空间维度下的材质与光影表现
            </p>
          </div>

          {/* Room Viewport Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setCompareRoomIndex(0)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                compareRoomIndex === 0 ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              客厅影音
            </button>
            <button
              onClick={() => setCompareRoomIndex(1)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                compareRoomIndex === 1 ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              极客书房
            </button>
            <button
              onClick={() => setCompareRoomIndex(2)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                compareRoomIndex === 2 ? "bg-white text-slate-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              主卧深睡
            </button>
          </div>
        </div>

        {/* Style A & B Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-blue-700 whitespace-nowrap">左侧风格 (A):</span>
            <select
              value={compareStyleA}
              onChange={(e) => setCompareStyleA(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer flex-1"
            >
              {STYLES_DATA.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900 font-semibold">
                  {s.name} ({s.enName})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-amber-700 whitespace-nowrap">右侧风格 (B):</span>
            <select
              value={compareStyleB}
              onChange={(e) => setCompareStyleB(e.target.value)}
              className="bg-transparent text-xs text-slate-900 font-bold focus:outline-none cursor-pointer flex-1"
            >
              {STYLES_DATA.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-900 font-semibold">
                  {s.name} ({s.enName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Same Style Friendly Warning */}
        {isSameStyle && (
          <div className="flex items-center space-x-2 text-xs bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-2xl">
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>💡 当前两侧已选择相同风格进行同模查看，建议右侧切换为其他风格以对比不同材质与光影差异。</span>
          </div>
        )}

        {/* Interactive Comparison Canvas Container */}
        <div className="relative w-full aspect-video min-h-[380px] rounded-3xl overflow-hidden border-2 border-slate-200 select-none shadow-md bg-slate-100">
          {/* Style B Layer (Right / Background) */}
          <div className="absolute inset-0 w-full h-full">
            {renderRoomIllustration(styleB, compareRoomIndex, true)}

            {/* Style B Floating Info Card */}
            <div className="absolute top-4 right-4 z-10 flex flex-col items-end space-y-2">
              <span className="bg-slate-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md border border-slate-700">
                右侧风格 B: {styleB.name}
              </span>
              <div className="max-w-xs bg-white/95 p-3 rounded-xl border border-slate-200 shadow-lg backdrop-blur-md space-y-1 text-right">
                <div className="text-xs font-black text-slate-900">
                  {styleB.roomRenderings[compareRoomIndex].title}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {styleB.roomRenderings[compareRoomIndex].description}
                </div>
              </div>
            </div>
          </div>

          {/* Style A Layer (Left / Foreground Clipped via Slider) */}
          <div
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            className="absolute inset-0 w-full h-full"
          >
            {renderRoomIllustration(styleA, compareRoomIndex, false)}

            {/* Style A Floating Info Card */}
            <div className="absolute top-4 left-4 z-10 flex flex-col items-start space-y-2">
              <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-md backdrop-blur-md">
                左侧风格 A: {styleA.name}
              </span>
              <div className="max-w-xs bg-white/95 p-3 rounded-xl border border-slate-200 shadow-lg backdrop-blur-md space-y-1 text-left">
                <div className="text-xs font-black text-slate-900">
                  {styleA.roomRenderings[compareRoomIndex].title}
                </div>
                <div className="text-[11px] text-slate-600 line-clamp-2">
                  {styleA.roomRenderings[compareRoomIndex].description}
                </div>
              </div>
            </div>
          </div>

          {/* Divider Line & Interactive Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_rgba(0,0,0,0.6)] cursor-ew-resize flex items-center justify-center pointer-events-none"
          >
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 shadow-2xl flex items-center justify-center text-slate-900 text-sm font-black transform -translate-x-1/2 pointer-events-auto hover:scale-110 transition-transform">
              ↔
            </div>
          </div>

          {/* Invisible Range Slider for Smooth Dragging */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPos}
            onChange={(e) => setSliderPos(Number(e.target.value))}
            className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full z-30"
          />
        </div>

        {/* Structured Bottom Descriptions for Style A and Style B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Style A Card Wrap */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                左侧: {styleA.name} ({styleA.enName})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {styleA.lightingStrategy.cct}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {styleA.roomRenderings[compareRoomIndex].description}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {styleA.roomRenderings[compareRoomIndex].focalPoints.map((fp, i) => (
                <span key={i} className="text-[9px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {fp}
                </span>
              ))}
            </div>
          </div>

          {/* Style B Card Wrap */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                右侧: {styleB.name} ({styleB.enName})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                {styleB.lightingStrategy.cct}
              </span>
            </div>
            <p className="text-xs text-slate-700 font-medium leading-relaxed">
              {styleB.roomRenderings[compareRoomIndex].description}
            </p>
            <div className="flex flex-wrap gap-1 pt-1">
              {styleB.roomRenderings[compareRoomIndex].focalPoints.map((fp, i) => (
                <span key={i} className="text-[9px] bg-white text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                  {fp}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Six-Dimensional Decision Radar & Custom Preference Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Custom Weights Engine (5 Columns) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] text-blue-600 font-mono tracking-widest uppercase font-bold">
              AI DECISION ENGINE
            </span>
            <h3 className="text-lg font-black text-slate-900 flex items-center mt-0.5">
              <Sliders className="w-4 h-4 mr-2 text-blue-600" />
              自定义偏好加权推荐系统
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              调整您对生活维度的考量权重，系统将实时计算最符合您本心的设计风格排名
            </p>
          </div>

          <div className="space-y-4">
            {/* Weight Sliders */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center">
                  <Zap className="w-3.5 h-3.5 mr-1 text-blue-600" />
                  极客工位与科技契合度
                </span>
                <span className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {weightGeek} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weightGeek}
                onChange={(e) => setWeightGeek(Number(e.target.value))}
                className="w-full accent-blue-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center">
                  <Maximize className="w-3.5 h-3.5 mr-1 text-sky-600" />
                  空间通透采光与视觉放大
                </span>
                <span className="font-mono font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                  {weightOpenness} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weightOpenness}
                onChange={(e) => setWeightOpenness(Number(e.target.value))}
                className="w-full accent-sky-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                  极简耐脏与低打理维护
                </span>
                <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {weightMaintenance} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weightMaintenance}
                onChange={(e) => setWeightMaintenance(Number(e.target.value))}
                className="w-full accent-emerald-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center">
                  <DollarSign className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  造价性价比与预算控制
                </span>
                <span className="font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  {weightBudget} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weightBudget}
                onChange={(e) => setWeightBudget(Number(e.target.value))}
                className="w-full accent-amber-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-slate-700 mb-1">
                <span className="flex items-center">
                  <Moon className="w-3.5 h-3.5 mr-1 text-purple-600" />
                  睡眠静音与治愈放松感
                </span>
                <span className="font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                  {weightSleep} / 10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={weightSleep}
                onChange={(e) => setWeightSleep(Number(e.target.value))}
                className="w-full accent-purple-600 bg-slate-200 h-2 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Dynamic Ranking */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              基于权重的智能推荐排名
            </div>
            {rankedStyles.map((style, idx) => {
              const score = calculateScore(style);
              return (
                <div
                  key={style.id}
                  onClick={() => setSelectedStyleId(style.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all duration-150 hover:-translate-y-0.5 ${
                    selectedStyleId === style.id
                      ? "bg-blue-600 text-white font-bold shadow-sm"
                      : "hover:bg-white text-slate-700 border border-transparent hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0 ? "bg-amber-400 text-slate-900" : "bg-slate-200 text-slate-600"
                    }`}>
                      {idx + 1}
                    </span>
                    <span>{style.name}</span>
                  </div>
                  <span className="font-mono font-bold">{score} 分</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: 6-Dimensional Radar Chart & Metrics Breakdown (7 Columns) */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-lg font-black text-slate-900">
              六维综合雷达量化评分
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              对比各风格在通透度、耐脏度、性价比、极客契合度、睡眠舒缓与保值率上的客观量化表现
            </p>
          </div>

          {/* SVG Radar Chart Visualization (52% Radius Calibrated with 100% Zero Overflow Protection) */}
          <div className="relative w-full aspect-[16/10] bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 540 340" className="w-full h-full max-w-[500px]">
              {/* Concentric Hexagonal Grids (Center at 270, 170, Radius 90 = 52% Calibrated) */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => (
                <polygon
                  key={i}
                  points="270,80 348,125 348,215 270,260 192,215 192,125"
                  transform={`scale(${level}) translate(${270 * (1 - level) / level}, ${170 * (1 - level) / level})`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}

              {/* Axis Lines */}
              <line x1="270" y1="170" x2="270" y2="80" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="270" y1="170" x2="348" y2="125" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="270" y1="170" x2="348" y2="215" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="270" y1="170" x2="270" y2="260" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="270" y1="170" x2="192" y2="215" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="270" y1="170" x2="192" y2="125" stroke="#cbd5e1" strokeWidth="1" />

              {/* Dimension Labels with 52% Radius and Ultra-Wide Safe Margin */}
              <text x="270" y="58" textAnchor="middle" fill="#0284c7" fontSize="12" fontWeight="bold">采光通透</text>
              <text x="368" y="129" textAnchor="start" fill="#d97706" fontSize="12" fontWeight="bold">耐脏易打理</text>
              <text x="368" y="219" textAnchor="start" fill="#059669" fontSize="12" fontWeight="bold">造价性价比</text>
              <text x="270" y="288" textAnchor="middle" fill="#7c3aed" fontSize="12" fontWeight="bold">极客工位</text>
              <text x="172" y="219" textAnchor="end" fill="#db2777" fontSize="12" fontWeight="bold">睡眠舒适度</text>
              <text x="172" y="129" textAnchor="end" fill="#4f46e5" fontSize="12" fontWeight="bold">转售流动性</text>

              {/* Render Active Selected Style Radar Polygon */}
              {(() => {
                const s = STYLES_DATA.find((x) => x.id === selectedStyleId) || STYLES_DATA[0];
                const r = s.radarScores;
                const maxR = 90; // 52% radius
                const cx = 270;
                const cy = 170;
                
                const p1 = [cx, cy - (r.openness / 100) * maxR];
                const p2 = [cx + (r.maintenance / 100) * maxR * Math.cos(Math.PI / 6), cy - (r.maintenance / 100) * maxR * Math.sin(Math.PI / 6)];
                const p3 = [cx + (r.costEfficiency / 100) * maxR * Math.cos(Math.PI / 6), cy + (r.costEfficiency / 100) * maxR * Math.sin(Math.PI / 6)];
                const p4 = [cx, cy + (r.geekSynergy / 100) * maxR];
                const p5 = [cx - (r.sleepComfort / 100) * maxR * Math.cos(Math.PI / 6), cy + (r.sleepComfort / 100) * maxR * Math.sin(Math.PI / 6)];
                const p6 = [cx - (r.resaleValue / 100) * maxR * Math.cos(Math.PI / 6), cy - (r.resaleValue / 100) * maxR * Math.sin(Math.PI / 6)];

                const pointsStr = `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]} ${p5[0]},${p5[1]} ${p6[0]},${p6[1]}`;

                return (
                  <>
                    <polygon
                      points={pointsStr}
                      fill="rgba(37, 99, 235, 0.22)"
                      stroke="#2563eb"
                      strokeWidth="2.5"
                    />
                    {[p1, p2, p3, p4, p5, p6].map((p, i) => (
                      <circle key={i} cx={p[0]} cy={p[1]} r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                    ))}
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Active Style Pros and Cons Evaluation */}
          {(() => {
            const s = STYLES_DATA.find((x) => x.id === selectedStyleId) || STYLES_DATA[0];
            return (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros */}
                <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200 space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-800 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>核心设计优势 (Pros)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {s.pros.map((p, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons / Attention */}
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-800 font-bold text-xs">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>施工与维护注意事项 (Notes)</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {s.cons.map((c, idx) => (
                      <li key={idx} className="flex items-start space-x-1.5">
                        <span className="text-amber-600 font-bold">!</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};
