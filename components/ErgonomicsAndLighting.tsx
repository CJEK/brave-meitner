"use client";

import React, { useState } from "react";
import { 
  Ruler, 
  Sun, 
  Eye, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  ShieldCheck, 
  Info,
  Maximize2,
  Moon,
  Zap,
  Layers
} from "lucide-react";
import { ERGONOMIC_SPECS, HOTEL_LIGHTING_LAYERS, ErgonomicSpec, HotelLightingLayer } from "@/data/projectData";

export const ErgonomicsAndLighting: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedCct, setSelectedCct] = useState<number>(3000); // 2700K - 4000K
  const [activeLightingLayer, setActiveLightingLayer] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"ergonomics" | "hotel-lighting" | "bathroom-deepdive">("bathroom-deepdive");

  const categories = ["all", "卫浴大平台与镜面", "厨房与中岛吧台", "极客工作站 (1+1)", "主卧深睡区", "公区纵深动线"];

  const filteredSpecs = activeCategory === "all"
    ? ERGONOMIC_SPECS
    : ERGONOMIC_SPECS.filter((s) => s.category === activeCategory);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Ergonomics & 5-Star Hotel Lighting
            </span>
            <span className="text-xs text-slate-400">人体工学黄金尺寸与五星级酒店照明体系</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1 flex items-center">
            <Ruler className="w-6 h-6 mr-2 text-amber-400" />
            卫浴大平台、人体工学与酒店级灯光深化
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            基于 Type B 648 sq ft 硬性不拆墙格局，以毫米级人体工学与四层酒店光影营造高阶居住质感
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-2xl p-1.5 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab("bathroom-deepdive")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "bathroom-deepdive"
                ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            🚿 卫浴大平台+大镜面深化
          </button>
          <button
            onClick={() => setActiveTab("hotel-lighting")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "hotel-lighting"
                ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            💡 五星级酒店光环境模拟
          </button>
          <button
            onClick={() => setActiveTab("ergonomics")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "ergonomics"
                ? "bg-purple-500 text-slate-950 shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            📐 全屋人体工学黄金尺寸表
          </button>
        </div>
      </div>

      {/* 1. Bathroom Big Vanity & Full Mirror Deep-Dive */}
      {activeTab === "bathroom-deepdive" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/30 bg-slate-900/90 space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                  MASTER BATHROOM MONOLITHIC VANITY SYSTEM
                </span>
                <h3 className="text-xl font-black text-slate-100 mt-0.5">
                  1.5m 贯穿式悬浮大理石大台面 + 满墙触控除雾大镜柜系统
                </h3>
              </div>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full font-bold border border-cyan-500/40">
                零卫生死角 · 五星级酒店套房标准
              </span>
            </div>

            {/* Visual Architectural Diagram of Bathroom Vanity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left SVG Architectural Elevation & Section (7 Columns) */}
              <div className="lg:col-span-7 bg-slate-950/90 p-6 rounded-2xl border border-slate-800 relative flex flex-col items-center justify-center">
                <div className="text-[10px] text-slate-400 font-mono mb-2 w-full flex justify-between">
                  <span>[立面与剖面人体工学详图]</span>
                  <span className="text-cyan-400">总面宽: 1,500 mm / 净高: 2,550 mm</span>
                </div>

                <svg viewBox="0 0 500 340" className="w-full h-auto max-w-[480px]">
                  {/* Background Wall */}
                  <rect x="20" y="20" width="460" height="300" fill="#0f172a" rx="8" />

                  {/* Ceiling Drop & Upper Wash Light */}
                  <rect x="20" y="20" width="460" height="25" fill="#1e293b" />
                  <line x1="40" y1="48" x2="460" y2="48" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2" opacity="0.8" />
                  <text x="250" y="42" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">天花隐藏式 3500K 洗墙漫射柔光槽</text>

                  {/* Full-width Mirror Cabinet (1500mm × 850mm) */}
                  <rect x="40" y="55" width="420" height="110" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" rx="4" />
                  {/* Mirror Surface Glow */}
                  <rect x="44" y="59" width="412" height="102" fill="url(#mirrorGrad)" rx="2" />
                  <text x="250" y="115" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="bold">满墙通宽智能恒温除雾大镜柜 (1500 × 850 mm)</text>
                  <text x="250" y="132" textAnchor="middle" fill="#94a3b8" fontSize="9">双面无影美妆补光 · 内置 150mm 超薄多层储物与吹风机插座</text>

                  {/* Lower Wash Light under Mirror */}
                  <line x1="40" y1="170" x2="460" y2="170" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2" opacity="0.8" />

                  {/* Human Ergonomic Sight Line */}
                  <line x1="20" y1="95" x2="480" y2="95" stroke="#f59e0b" strokeWidth="1" strokeDasharray="2 2" />
                  <text x="30" y="90" fill="#f59e0b" fontSize="8">人眼视线 1550mm</text>

                  {/* Monolithic Floating Countertop (Extending over Toilet) */}
                  {/* Main Sink Zone (Left 900mm) */}
                  <rect x="40" y="195" width="260" height="28" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
                  {/* Seamless Integrated Basin (Under-mount) */}
                  <path d="M 90 200 Q 170 235 250 200 Z" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                  <text x="170" y="215" textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="bold">无缝一体防溅大单盆</text>

                  {/* Extended Ledge over Toilet Tank (Right 600mm) */}
                  <rect x="300" y="195" width="160" height="28" fill="#334155" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
                  <text x="380" y="212" textAnchor="middle" fill="#fde047" fontSize="8" fontWeight="bold">马桶上方延伸大置物台</text>

                  {/* Smart Toilet Illustration (Right) */}
                  <rect x="340" y="230" width="80" height="70" fill="#1e293b" stroke="#64748b" strokeWidth="1.5" rx="6" />
                  <text x="380" y="270" textAnchor="middle" fill="#cbd5e1" fontSize="9">智能马桶</text>

                  {/* Vanity Floating Base Cabinet (Left) */}
                  <rect x="40" y="223" width="260" height="45" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
                  <text x="170" y="250" textAnchor="middle" fill="#94a3b8" fontSize="9">双层防水储物大抽屉</text>

                  {/* Floating Toe Kick Glow */}
                  <line x1="40" y1="272" x2="300" y2="272" stroke="#f59e0b" strokeWidth="2.5" opacity="0.9" />
                  <text x="170" y="295" textAnchor="middle" fill="#f59e0b" fontSize="8">悬空 350mm · 感应地脚悬浮夜灯</text>

                  {/* Dimension Annotations */}
                  <text x="15" y="210" fill="#38bdf8" fontSize="9" fontWeight="bold">870mm</text>
                  <text x="485" y="110" fill="#38bdf8" fontSize="9" fontWeight="bold">850mm</text>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="mirrorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#1e293b" />
                      <stop offset="50%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Right Detailed Engineering Spec Points (5 Columns) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-cyan-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>为什么一定要 1.5m 贯穿式大台面？</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    传统 800mm 独立洗手盆两边常留下 15-20cm 无法清扫的发霉缝隙。<strong>本案将岩板台面直接拉通横跨至马桶水箱上方</strong>，既彻底消灭了卫生死角，又凭空多出 0.8 ㎡ 黄金置物面，香薰、浴巾、随手手机放置极其顺手。
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs">
                    <Sun className="w-4 h-4" />
                    <span>为什么坚持 870mm 黄金人体工学高度？</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    交标 800mm 台面洗脸时人体需弯腰 &gt;45°，水极易沿手臂倒流至手肘并滴落满地。<strong>870mm 高度贴合站姿重心</strong>，前倾 20° 即可舒适捧水洗漱，彻底告别晨起弯腰酸痛。
                  </p>
                </div>

                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>满墙通体除雾镜柜 (1500×850mm)</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    镜面上下内嵌 3500K Ra&gt;98 高显色无影灯，彻底消解面部阴影。内部 150mm 超薄多层分区，容纳洗漱备品与吹风机，让外露台面常年保持空无一物的极致整洁。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Hotel-Grade Architectural Lighting Simulator */}
      {activeTab === "hotel-lighting" && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-amber-500/30 bg-slate-900/90 space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-400 tracking-widest uppercase">
                  5-STAR LUXURY HOTEL LIGHTING SYSTEM
                </span>
                <h3 className="text-xl font-black text-slate-100 mt-0.5">
                  四层递进式见光不见灯照明矩阵
                </h3>
              </div>

              {/* Dynamic CCT Adjuster Slider */}
              <div className="flex items-center space-x-3 bg-slate-950 p-2 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-slate-400">色温 (CCT):</span>
                <input
                  type="range"
                  min="2700"
                  max="4000"
                  step="100"
                  value={selectedCct}
                  onChange={(e) => setSelectedCct(Number(e.target.value))}
                  className="w-32 accent-amber-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-amber-400 bg-slate-900 px-2 py-0.5 rounded-lg border border-amber-500/30">
                  {selectedCct} K
                </span>
              </div>
            </div>

            {/* 4 Lighting Layers Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {HOTEL_LIGHTING_LAYERS.map((layer, idx) => {
                const isActive = activeLightingLayer === idx;
                return (
                  <div
                    key={idx}
                    onClick={() => setActiveLightingLayer(idx)}
                    className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isActive
                        ? "bg-slate-950 border-amber-400 shadow-xl shadow-amber-500/20 scale-[1.02]"
                        : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                          {layer.role}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          LAYER 0{idx + 1}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-100">
                        {layer.layerName}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {layer.effect}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 space-y-1.5 text-[11px]">
                      <div className="text-slate-400">
                        灯具: <strong className="text-slate-200">{layer.fixtures}</strong>
                      </div>
                      <div className="text-amber-400 font-mono">
                        防眩: {layer.ugrStandard}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hotel Lighting Golden Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-400" />
                  严控 UGR &lt; 10 深杯防眩
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  采用黑光深藏反光杯，遮光角 &gt; 38°，正常行走仰头看不见刺眼光源，杜绝任何直射眩光伤害眼睛。
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-cyan-400" />
                  高显色指数 Ra &gt; 97
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  全屋灯光显色指数 Ra&gt;97，R9(饱和红)&gt;90，真实还原实木纹理、食物色泽与皮肤气色，拍照极具高级感。
                </p>
              </div>

              <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-1.5">
                <div className="font-bold text-slate-200 flex items-center">
                  <Moon className="w-4 h-4 mr-1.5 text-purple-400" />
                  2700K 舒缓深睡微光起夜
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  床底与走道踢脚线微光离地 20mm 漫射，夜间起床微波雷达感应点亮 5% 柔光，不起眼不破坏褪黑素分泌。
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Full-House Ergonomics Specification Matrix */}
      {activeTab === "ergonomics" && (
        <div className="space-y-6">
          {/* Category Filter Chips */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <span className="text-slate-500 font-bold uppercase mr-1">分区查看:</span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl font-medium border transition-all ${
                  activeCategory === cat
                    ? "bg-purple-500/20 border-purple-500/50 text-purple-300 shadow-sm"
                    : "bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800"
                }`}
              >
                {cat === "all" ? "全部工学黄金尺寸" : cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSpecs.map((spec, idx) => (
              <div
                key={idx}
                className="glass-panel p-5 rounded-3xl border border-slate-800 bg-slate-900/70 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full font-bold">
                      {spec.category}
                    </span>
                    <span className="text-sm font-mono font-black text-cyan-400">
                      {spec.standardMm}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-100">
                    {spec.name}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {spec.rationale}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-800/80 text-[11px]">
                  <div className="text-emerald-400">
                    <strong>健康工学益处:</strong> {spec.impactOnHealth}
                  </div>
                  <div className="text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 font-mono text-[10px]">
                    💡 施工落地备注: {spec.diagramNote}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
