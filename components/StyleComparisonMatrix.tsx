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
  CheckCircle2
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
                {/* Top Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                    isSelected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}>
                    {style.badge}
                  </span>

                  <div className="flex items-center space-x-1 text-xs font-mono font-bold text-blue-600">
                    <Award className="w-3.5 h-3.5" />
                    <span>{score} 分</span>
                  </div>
                </div>

                {/* Style Title & Tagline */}
                <div>
                  <h3 className="text-lg font-black text-slate-900">{style.name}</h3>
                  <div className="text-[11px] font-semibold text-blue-600 font-mono mb-2">
                    {style.enName}
                  </div>
                  <p className="text-xs text-slate-700 font-medium mb-2.5">
                    {style.tagline}
                  </p>
                  <p className="text-[11px] text-slate-500 line-clamp-3 mb-4 leading-relaxed">
                    {style.description}
                  </p>
                </div>

                {/* Palette Swatches */}
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-1.5 font-semibold">
                    核心色系与材质
                  </div>
                  <div className="flex items-center space-x-1.5 mb-4">
                    {style.palette.map((p, idx) => (
                      <div
                        key={idx}
                        style={{ backgroundColor: p.hex }}
                        className="w-6 h-6 rounded-lg border border-slate-300 shadow-2xs flex-shrink-0"
                        title={`${p.name}: ${p.role}`}
                      />
                    ))}
                  </div>

                  {/* Select Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStyleId(style.id);
                    }}
                    className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>已锁定为主推演风格</span>
                      </>
                    ) : (
                      <span>选择此风格推演</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Split-Screen Interactive Comparison Slider */}
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
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  compareRoomIndex === idx
                    ? "bg-slate-900 text-white font-bold shadow-2xs"
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
          <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-blue-700">左侧风格 (A):</span>
            <select
              value={compareStyleA}
              onChange={(e) => setCompareStyleA(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer flex-1"
            >
              {STYLES_DATA.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-800">
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-amber-700">右侧风格 (B):</span>
            <select
              value={compareStyleB}
              onChange={(e) => setCompareStyleB(e.target.value)}
              className="bg-transparent text-xs text-slate-800 font-semibold focus:outline-none cursor-pointer flex-1"
            >
              {STYLES_DATA.map((s) => (
                <option key={s.id} value={s.id} className="bg-white text-slate-800">
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Comparison Canvas Container */}
        <div className="relative w-full h-[440px] rounded-3xl overflow-hidden border border-slate-200 select-none shadow-sm">
          {/* Style B Layer (Right / Background) */}
          <div className={`absolute inset-0 bg-gradient-to-br ${styleB.roomRenderings[compareRoomIndex].gradientPreview} p-8 flex flex-col justify-between text-right`}>
            <div className="flex justify-end">
              <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
                风格 B: {styleB.name}
              </span>
            </div>
            <div className="max-w-md ml-auto bg-white/90 p-5 rounded-2xl border border-slate-200 shadow-lg backdrop-blur-md space-y-2">
              <h4 className="text-lg font-black text-slate-900">
                {styleB.roomRenderings[compareRoomIndex].title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {styleB.roomRenderings[compareRoomIndex].description}
              </p>
              <div className="flex flex-wrap justify-end gap-1.5 pt-2">
                {styleB.roomRenderings[compareRoomIndex].focalPoints.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Style A Layer (Left / Foreground Clipped) */}
          <div
            style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
            className={`absolute inset-0 bg-gradient-to-br ${styleA.roomRenderings[compareRoomIndex].gradientPreview} p-8 flex flex-col justify-between`}
          >
            <div>
              <span className="bg-white/90 text-slate-900 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm backdrop-blur-md">
                风格 A: {styleA.name}
              </span>
            </div>
            <div className="max-w-md bg-white/90 p-5 rounded-2xl border border-slate-200 shadow-lg backdrop-blur-md space-y-2">
              <h4 className="text-lg font-black text-slate-900">
                {styleA.roomRenderings[compareRoomIndex].title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {styleA.roomRenderings[compareRoomIndex].description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-2">
                {styleA.roomRenderings[compareRoomIndex].focalPoints.map((f, i) => (
                  <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-medium">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Divider Line & Handle */}
          <div
            style={{ left: `${sliderPos}%` }}
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-ew-resize flex items-center justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-400 shadow-lg flex items-center justify-center text-slate-800 text-xs font-black">
              ↔
            </div>
          </div>

          {/* Invisible Range Slider for Dragging */}
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

          {/* SVG Radar Chart Visualization (Light Modern) */}
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
                
                // Calculate vertex coordinates based on scores (0-100)
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
