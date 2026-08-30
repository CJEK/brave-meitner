"use client";

import React, { useState } from "react";
import { 
  Palette, 
  Sliders, 
  Check, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Eye,
  Zap,
  DollarSign,
  Maximize,
  Moon,
  SunMedium,
  CheckCircle2,
  Layers,
  Box,
  Image as ImageIcon
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
  const [compareStyleA, setCompareStyleA] = useState<string>("tech-minimal");
  const [compareStyleB, setCompareStyleB] = useState<string>("dark-luxury");
  const [compareRoomIndex, setCompareRoomIndex] = useState<number>(0);
  const [sliderPos, setSliderPos] = useState<number>(50); // 0-100%

  // User Custom Decision Weights (0 - 10)
  const [weightGeek, setWeightGeek] = useState<number>(9);
  const [weightOpenness, setWeightOpenness] = useState<number>(8);
  const [weightMaintenance, setWeightMaintenance] = useState<number>(8);
  const [weightBudget, setWeightBudget] = useState<number>(7);
  const [weightSleep, setWeightSleep] = useState<number>(8);

  const styleA = STYLES_DATA.find((s) => s.id === compareStyleA) || STYLES_DATA[0];
  const styleB = STYLES_DATA.find((s) => s.id === compareStyleB) || STYLES_DATA[1];

  // Calculate Weighted Scores
  const calculateScore = (style: StyleData) => {
    const totalWeights = weightGeek + weightOpenness + weightMaintenance + weightBudget + weightSleep;
    if (totalWeights === 0) return 0;

    const raw = (
      style.radarScores.geekSynergy * weightGeek +
      style.radarScores.openness * weightOpenness +
      style.radarScores.maintenance * weightMaintenance +
      style.radarScores.costEfficiency * weightBudget +
      style.radarScores.sleepComfort * weightSleep
    ) / totalWeights;

    return Math.round(raw);
  };

  const rankedStyles = [...STYLES_DATA].sort((a, b) => calculateScore(b) - calculateScore(a));

  // Helper: Render Rich Architectural Vector Illustration for a given Style & Room
  const renderRoomIllustration = (style: StyleData, roomIdx: number, isRight = false) => {
    const isDark = style.id === "dark-luxury";
    const isJapandi = style.id === "japandi-wood";
    const isCyber = style.id === "industrial-cyber";

    const wallBg = isDark ? "#1c1917" : isJapandi ? "#fef3c7" : isCyber ? "#334155" : "#f1f5f9";
    const floorBg = isDark ? "#292524" : isJapandi ? "#e2cfb5" : isCyber ? "#1e293b" : "#e2e8f0";
    const sofaColor = isDark ? "#451a03" : isJapandi ? "#d6d3d1" : isCyber ? "#0284c7" : "#cbd5e1";
    const accentLight = isDark ? "#f59e0b" : isJapandi ? "#fbbf24" : isCyber ? "#00f0ff" : "#3b82f6";
    const tvBorder = isDark ? "#78350f" : isJapandi ? "#b45309" : isCyber ? "#00f0ff" : "#2563eb";

    return (
      <svg viewBox="0 0 800 500" className="w-full h-full object-cover">
        {/* Background Wall Cladding */}
        <rect x="0" y="0" width="800" height="360" fill={wallBg} />
        
        {/* Wall Texture Patterns */}
        {isDark && (
          <g opacity="0.3">
            {[...Array(40)].map((_, i) => (
              <line key={i} x1={i * 20} y1="0" x2={i * 20} y2="360" stroke="#44403c" strokeWidth="2" />
            ))}
          </g>
        )}
        {isJapandi && (
          <g opacity="0.4">
            {[...Array(50)].map((_, i) => (
              <line key={i} x1={i * 16} y1="0" x2={i * 16} y2="360" stroke="#fcd34d" strokeWidth="1.5" />
            ))}
          </g>
        )}

        {/* Ceiling Drop with Hidden LED Wash Light */}
        <rect x="0" y="0" width="800" height="40" fill={isDark ? "#0c0a09" : "#ffffff"} />
        <line x1="0" y1="42" x2="800" y2="42" stroke={accentLight} strokeWidth="6" opacity="0.8" />

        {/* Flooring */}
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
        <text x="400" y="180" textAnchor="middle" fill="#ffffff" fontSize="18" fontWeight="bold" opacity="0.9">
          {style.roomRenderings[roomIdx].title}
        </text>
        <text x="400" y="210" textAnchor="middle" fill={accentLight} fontSize="12" fontWeight="bold" fontFamily="monospace">
          {style.roomRenderings[roomIdx].visualStyle}
        </text>

        {/* Floating TV Console & Dolby Atmos Soundbar */}
        <rect x="140" y="300" width="520" height="35" rx="6" fill={isDark ? "#292524" : isJapandi ? "#d4a373" : isCyber ? "#0284c7" : "#ffffff"} stroke="#64748b" strokeWidth="1.5" />
        <rect x="280" y="288" width="240" height="10" rx="3" fill="#0f172a" />

        {/* Main Furniture: Ergonomic Linen/Leather Sofa (Left / Front Perspective) */}
        <g transform="translate(100, 320)">
          {/* Base */}
          <rect x="0" y="20" width="320" height="60" rx="8" fill={sofaColor} stroke="#475569" strokeWidth="2" />
          {/* Backrest */}
          <rect x="10" y="0" width="300" height="30" rx="6" fill={sofaColor} stroke="#475569" strokeWidth="1.5" />
          {/* Cushions */}
          <rect x="25" y="15" width="80" height="25" rx="4" fill={accentLight} opacity="0.9" />
          <rect x="120" y="15" width="80" height="25" rx="4" fill="#ffffff" opacity="0.8" />
        </g>

        {/* Monolithic Sintered Stone Island Dining Bar (Right Perspective) */}
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
            <span className="text-slate-500">当前激活风格:</span>
            <span className="font-bold text-slate-900">
              {STYLES_DATA.find((s) => s.id === selectedStyleId)?.name}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STYLES_DATA.map((style) => {
            const isSelected = selectedStyleId === style.id;
            const score = calculateScore(style);

            return (
              <div
                key={style.id}
                onClick={() => setSelectedStyleId(style.id)}
                className={`relative rounded-3xl p-5 border transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden ${
                  isSelected
                    ? "bg-blue-50/40 border-blue-600 shadow-md ring-2 ring-blue-500/20 scale-[1.02]"
                    : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                }`}
              >
                {/* Top Badge & Score */}
                <div className="flex items-center justify-between mb-2.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {style.badge}
                  </span>

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
                  <p className="text-xs text-slate-700 font-medium leading-snug">
                    {style.tagline}
                  </p>
                </div>

                {/* Rich Material & Atmosphere Visual Banner (No empty boxes) */}
                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/80 space-y-2 mb-4">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                    <span>核心主材与质感</span>
                    <span className="font-mono text-blue-600">4大选材</span>
                  </div>

                  {/* Palette Swatches with Name Tooltips */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {style.palette.map((p, idx) => (
                      <div key={idx} className="flex flex-col items-center space-y-1">
                        <div
                          style={{ backgroundColor: p.hex }}
                          className="w-full h-7 rounded-lg border border-slate-300 shadow-2xs"
                          title={`${p.name} (${p.role})`}
                        />
                        <span className="text-[9px] text-slate-600 truncate w-full text-center font-medium">
                          {p.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Key Tech & Ergonomic Highlight Chips */}
                  <div className="flex flex-wrap gap-1 pt-1 border-t border-slate-200/60">
                    {style.keyMaterials.slice(0, 2).map((m, idx) => (
                      <span key={idx} className="text-[9px] bg-white text-slate-700 px-1.5 py-0.5 rounded border border-slate-200 font-mono truncate">
                        {m.item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Select Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStyleId(style.id);
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>已选定此风格为主推演</span>
                    </>
                  ) : (
                    <span>切换至此风格</span>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split-Screen Interactive Comparison Slider (Architectural Vector Renderings) */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center">
              <Eye className="w-5 h-5 mr-2 text-blue-600" />
              分屏滑块视觉比对 (Split-Screen Comparison)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              左右拖动中缝滑块，在同一空间视角下直接对比两种设计风格的材质质感与氛围
            </p>
          </div>

          {/* Room Perspective Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            {["客厅与中岛", "极客工作站", "主卧深睡", "卫浴与阳台"].map((room, idx) => (
              <button
                key={idx}
                onClick={() => setCompareRoomIndex(idx)}
                className={`px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  compareRoomIndex === idx
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {room}
              </button>
            ))}
          </div>
        </div>

        {/* Style A & B Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center space-x-2 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-blue-700">左侧风格 (A):</span>
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
            <span className="text-xs font-bold text-amber-700">右侧风格 (B):</span>
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

        {/* Interactive Comparison Canvas Container (Rich SVG Vector Elevation) */}
        <div className="relative w-full aspect-[16/9] min-h-[380px] rounded-3xl overflow-hidden border-2 border-slate-200 select-none shadow-md bg-slate-100">
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
            <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-900 shadow-2xl flex items-center justify-center text-slate-900 text-sm font-black transform -translate-x-1/2 pointer-events-auto">
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
                  className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
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

          {/* SVG Radar Chart Visualization */}
          <div className="relative w-full aspect-[16/10] bg-slate-50 rounded-2xl border border-slate-200 p-4 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 400 320" className="w-full h-full max-w-[460px]">
              {/* Concentric Hexagonal Grids */}
              {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => (
                <polygon
                  key={i}
                  points="200,30 330,95 330,225 200,290 70,225 70,95"
                  transform={`scale(${level}) translate(${200 * (1 - level) / level}, ${160 * (1 - level) / level})`}
                  fill="none"
                  stroke="#cbd5e1"
                  strokeWidth="1"
                />
              ))}

              {/* Axis Lines */}
              <line x1="200" y1="160" x2="200" y2="30" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="160" x2="330" y2="95" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="160" x2="330" y2="225" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="160" x2="200" y2="290" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="160" x2="70" y2="225" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="200" y1="160" x2="70" y2="95" stroke="#cbd5e1" strokeWidth="1" />

              {/* Dimension Labels */}
              <text x="200" y="20" textAnchor="middle" fill="#0284c7" fontSize="11" fontWeight="bold">空间通透采光 (Openness)</text>
              <text x="340" y="95" textAnchor="start" fill="#d97706" fontSize="11" fontWeight="bold">耐脏低打理 (Maintenance)</text>
              <text x="340" y="235" textAnchor="start" fill="#059669" fontSize="11" fontWeight="bold">造价性价比 (Cost)</text>
              <text x="200" y="310" textAnchor="middle" fill="#7c3aed" fontSize="11" fontWeight="bold">极客工位契合 (Geek)</text>
              <text x="60" y="235" textAnchor="end" fill="#db2777" fontSize="11" fontWeight="bold">睡眠舒缓感 (Sleep)</text>
              <text x="60" y="95" textAnchor="end" fill="#4f46e5" fontSize="11" fontWeight="bold">资产保值率 (Resale)</text>

              {/* Render Active Selected Style Radar Polygon */}
              {(() => {
                const s = STYLES_DATA.find((x) => x.id === selectedStyleId) || STYLES_DATA[0];
                const r = s.radarScores;
                
                const p1 = [200, 160 - (r.openness / 100) * 130];
                const p2 = [200 + (r.maintenance / 100) * 130 * Math.cos(Math.PI / 6), 160 - (r.maintenance / 100) * 130 * Math.sin(Math.PI / 6)];
                const p3 = [200 + (r.costEfficiency / 100) * 130 * Math.cos(Math.PI / 6), 160 + (r.costEfficiency / 100) * 130 * Math.sin(Math.PI / 6)];
                const p4 = [200, 160 + (r.geekSynergy / 100) * 130];
                const p5 = [200 - (r.sleepComfort / 100) * 130 * Math.cos(Math.PI / 6), 160 + (r.sleepComfort / 100) * 130 * Math.sin(Math.PI / 6)];
                const p6 = [200 - (r.resaleValue / 100) * 130 * Math.cos(Math.PI / 6), 160 - (r.resaleValue / 100) * 130 * Math.sin(Math.PI / 6)];

                const pointsStr = `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]} ${p4[0]},${p4[1]} ${p5[0]},${p5[1]} ${p6[0]},${p6[1]}`;

                return (
                  <>
                    <polygon
                      points={pointsStr}
                      fill="rgba(37, 99, 235, 0.18)"
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
