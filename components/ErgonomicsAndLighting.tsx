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
  const [activeTab, setActiveTab] = useState<"bathroom-deepdive" | "hotel-lighting" | "ergonomics">("bathroom-deepdive");

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
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              Ergonomics & 5-Star Hotel Lighting
            </span>
            <span className="text-xs text-slate-500">人体工学黄金尺寸与五星级酒店照明体系</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Ruler className="w-6 h-6 mr-2 text-blue-600" />
            卫浴大平台、人体工学与酒店级灯光深化
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            基于 Type B 648 sq ft 硬性不拆墙格局，以毫米级人体工学与四层酒店光影营造高阶居住质感
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1.5 gap-1.5 text-xs">
          <button
            onClick={() => setActiveTab("bathroom-deepdive")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "bathroom-deepdive"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            🚿 卫浴大平台+大镜面深化
          </button>
          <button
            onClick={() => setActiveTab("hotel-lighting")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "hotel-lighting"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            💡 五星级酒店光环境模拟
          </button>
          <button
            onClick={() => setActiveTab("ergonomics")}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all ${
              activeTab === "ergonomics"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            📐 全屋人体工学黄金尺寸表
          </button>
        </div>
      </div>

      {/* 1. Bathroom Big Vanity & Full Mirror Deep-Dive */}
      {activeTab === "bathroom-deepdive" && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-blue-600 tracking-widest uppercase font-bold">
                  MASTER BATHROOM MONOLITHIC VANITY SYSTEM
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  1.5m 贯穿式悬浮大理石大台面 + 满墙触控除雾大镜柜系统
                </h3>
              </div>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-bold border border-blue-200">
                零卫生死角 · 五星级酒店套房标准
              </span>
            </div>

            {/* Visual Architectural Diagram of Bathroom Vanity */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Left SVG Architectural Elevation & Section (7 Columns) */}
              <div className="lg:col-span-7 bg-slate-50 p-6 rounded-2xl border border-slate-200 relative flex flex-col items-center justify-center">
                <div className="text-[10px] text-slate-500 font-mono mb-2 w-full flex justify-between">
                  <span>[立面与剖面人体工学详图]</span>
                  <span className="text-blue-700 font-semibold">总面宽: 1,500 mm / 净高: 2,550 mm</span>
                </div>

                
                <div className="relative w-full max-w-[480px] aspect-[5/3] rounded-xl overflow-hidden shadow-sm border border-slate-200">
                  <img 
                    src="https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1000&q=80" 
                    alt="卫浴大平台实景" 
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Ergonomic Annotations */}
                  <div className="absolute inset-0 bg-slate-900/10 pointer-events-none"></div>
                  
                  {/* Eye Level */}
                  <div className="absolute top-[28%] left-0 w-full border-t border-dashed border-amber-500"></div>
                  <div className="absolute top-[28%] left-2 -mt-4 bg-amber-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">视线 1550mm</div>

                  {/* Mirror */}
                  <div className="absolute top-[10%] left-[10%] right-[10%] h-[40%] border-2 border-blue-500/50 rounded-lg flex items-center justify-center bg-blue-900/10 backdrop-blur-[2px]">
                    <div className="bg-white/90 text-slate-900 text-[10px] sm:text-xs font-bold px-2 py-1 rounded shadow-sm">通宽除雾大镜柜 (1500×850)</div>
                  </div>

                  {/* Basin Countertop */}
                  <div className="absolute top-[60%] left-0 w-full border-t border-dashed border-emerald-500"></div>
                  <div className="absolute top-[60%] left-2 -mt-4 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">洗手台 870mm (不弯腰)</div>

                  {/* Socket */}
                  <div className="absolute top-[50%] right-[15%] flex flex-col items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-sm border border-white"></div>
                    <div className="bg-slate-900 text-white text-[8px] px-1 mt-1 rounded">吹风机插座</div>
                  </div>
                </div>

              </div>

              {/* Right Detailed Engineering Spec Points (5 Columns) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-blue-900 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>为什么一定要 1.5m 贯穿式大台面？</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    传统 800mm 独立洗手盆两边常留下 15-20cm 无法清扫的发霉缝隙。<strong>本案将岩板台面直接拉通横跨至马桶水箱上方</strong>，既彻底消灭了卫生死角，又凭空多出 0.8 ㎡ 黄金置物面，香薰、浴巾、随手手机放置极其顺手。
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>为什么坚持 870mm 黄金人体工学高度？</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    交标 800mm 台面洗脸时人体需弯腰 &gt;45°，水极易沿手臂倒流至手肘并滴落满地。<strong>870mm 高度贴合站姿重心</strong>，前倾 20° 即可舒适捧水洗漱，彻底告别晨起弯腰酸痛。
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                  <div className="flex items-center space-x-2 text-purple-900 font-bold text-xs">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>满墙通体除雾镜柜 (1500×850mm)</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
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
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
              <div>
                <span className="text-[10px] font-mono text-amber-600 tracking-widest uppercase font-bold">
                  5-STAR LUXURY HOTEL LIGHTING SYSTEM
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  四层递进式见光不见灯照明矩阵
                </h3>
              </div>

              {/* Dynamic CCT Adjuster Slider */}
              <div className="flex items-center space-x-3 bg-slate-50 p-2 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-600">色温 (CCT):</span>
                <input
                  type="range"
                  min="2700"
                  max="4000"
                  step="100"
                  value={selectedCct}
                  onChange={(e) => setSelectedCct(Number(e.target.value))}
                  className="w-32 accent-amber-500 bg-slate-200 h-2 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
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
                        ? "bg-amber-50/40 border-amber-500 shadow-md ring-2 ring-amber-500/20 scale-[1.02]"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          {layer.role}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          LAYER 0{idx + 1}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900">
                        {layer.layerName}
                      </h4>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {layer.effect}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px]">
                      <div className="text-slate-500">
                        灯具: <strong className="text-slate-800">{layer.fixtures}</strong>
                      </div>
                      <div className="text-amber-700 font-mono font-semibold">
                        防眩: {layer.ugrStandard}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Hotel Lighting Golden Rules */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center">
                  <ShieldCheck className="w-4 h-4 mr-1.5 text-amber-600" />
                  严控 UGR &lt; 10 深杯防眩
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  采用黑光深藏反光杯，遮光角 &gt; 38°，正常行走仰头看不见刺眼光源，杜绝任何直射眩光伤害眼睛。
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center">
                  <Sparkles className="w-4 h-4 mr-1.5 text-blue-600" />
                  高显色指数 Ra &gt; 97
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  全屋灯光显色指数 Ra&gt;97，R9(饱和红)&gt;90，真实还原实木纹理、食物色泽与皮肤气色，拍照极具高级感。
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center">
                  <Moon className="w-4 h-4 mr-1.5 text-purple-600" />
                  2700K 舒缓深睡微光起夜
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
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
                    ? "bg-slate-900 text-white font-semibold shadow-2xs"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-semibold border border-slate-200">
                      {spec.category}
                    </span>
                    <span className="text-sm font-mono font-black text-blue-700">
                      {spec.standardMm}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900">
                    {spec.name}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {spec.rationale}
                  </p>
                </div>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-[11px]">
                  <div className="text-emerald-700 font-medium">
                    <strong>健康工学益处:</strong> {spec.impactOnHealth}
                  </div>
                  <div className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 font-mono text-[10px]">
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
