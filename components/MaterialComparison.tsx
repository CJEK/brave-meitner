"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  ShieldCheck, 
  Droplets, 
  Coffee, 
  Hand, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  Sliders,
  TrendingUp,
  Award,
  Layers
} from "lucide-react";
import { MATERIAL_COMPARISONS, MaterialComparisonItem } from "@/data/projectData";

export const MaterialComparison: React.FC = () => {
  const [selectedMaterialId, setSelectedMaterialId] = useState<string>("mat-pet");
  const [simulatedStain, setSimulatedStain] = useState<"coffee" | "grease" | "fingerprint" | "scratch">("coffee");

  const activeMat = MATERIAL_COMPARISONS.find((m) => m.id === selectedMaterialId) || MATERIAL_COMPARISONS[0];

  const getStainFeedback = (mat: MaterialComparisonItem, stain: string) => {
    switch (stain) {
      case "coffee":
        return mat.cleanabilityScore > 90
          ? { status: "秒级擦除 (Zero Stain)", text: "0渗透率，微湿抹布轻轻一擦即净，不留任何咖啡色素印迹。", color: "text-emerald-400" }
          : { status: "需及时擦拭 (Wipe in 1 hr)", text: "表面有封闭保护层，建议 1小时内用湿布擦净并垫杯垫。", color: "text-amber-400" };
      case "grease":
        return mat.cleanabilityScore > 90
          ? { status: "抗油防挂壁 (Oil Repellent)", text: "纳米疏油层阻止油分子渗透，加微量洗洁精抹布一抹即光洁如新。", color: "text-emerald-400" }
          : { status: "需温水清洁 (Mild Detergent)", text: "用中性清洁剂配合海绵擦拭，严禁强碱性洗涤剂。", color: "text-amber-400" };
      case "fingerprint":
        return mat.antiFingerprint
          ? { status: "极致抗指纹 (No Fingerprint)", text: "超哑光纳米微观结构，手汗触碰完全无反光印迹，常保高级哑光感。", color: "text-emerald-400" }
          : { status: "轻微指纹隐形", text: "木纹漫反射能够天然隐匿指纹，肉眼不易察觉。", color: "text-cyan-400" };
      case "scratch":
        return mat.durabilityScore > 90
          ? { status: "莫氏高硬度 (Scratch Proof)", text: "日常钥匙、外设金属刮擦毫无痕迹，耐磨年限超 15年。", color: "text-emerald-400" }
          : { status: "天然自愈/可打磨 (Repairable)", text: "轻微划痕可使用专用木蜡油滋润或百洁布局部抛光打磨如新。", color: "text-cyan-400" };
      default:
        return { status: "优良", text: "日常极易打理。", color: "text-slate-300" };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              Warmth & Cleanability Matrix
            </span>
            <span className="text-xs text-slate-400">有温度、极易清洁打理的最新材质体系</span>
          </div>
          <h2 className="text-2xl font-black text-slate-100 mt-1 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-emerald-400" />
            最新装修材料综合对比与清洁耐污测评
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            横向评估抗指纹纳米肤感板、天然木皮、岩板、可丽耐与微水泥的清洁难易度、触感温度与耐用性
          </p>
        </div>
      </div>

      {/* Material Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {MATERIAL_COMPARISONS.map((mat) => {
          const isSelected = selectedMaterialId === mat.id;
          return (
            <div
              key={mat.id}
              onClick={() => setSelectedMaterialId(mat.id)}
              className={`p-4 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900 border-emerald-400 shadow-xl shadow-emerald-500/20 scale-[1.02] ring-1 ring-emerald-500/40"
                  : "glass-card border-slate-800 hover:border-slate-700 hover:bg-slate-900/60"
              }`}
            >
              <div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-mono">
                  {mat.category}
                </span>
                <h3 className="text-sm font-bold text-slate-100 mt-2">
                  {mat.name}
                </h3>
              </div>

              {/* Mini Scores */}
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">易清洁度:</span>
                  <span className="font-mono font-bold text-emerald-400">{mat.cleanabilityScore}分</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">触感温度:</span>
                  <span className="font-mono font-bold text-amber-400">{mat.warmthScore}分</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Material Deep-Dive & Live Stain Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Material Profile & Pros/Cons (7 Columns) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-4 gap-2">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider">
                MATERIAL DEEP-DIVE
              </span>
              <h3 className="text-xl font-black text-slate-100">
                {activeMat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                推荐应用于: <strong className="text-slate-200">{activeMat.bestFor}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              {activeMat.antiFingerprint && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-1 rounded-full font-bold">
                  ✓ 抗指纹
                </span>
              )}
              {activeMat.seamlessJoint && (
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2.5 py-1 rounded-full font-bold">
                  ✓ 无缝拼接
                </span>
              )}
            </div>
          </div>

          {/* 4 Quantitative Score Bars */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400 mb-1">耐脏易打理</div>
              <div className="text-xl font-black text-emerald-400 font-mono">{activeMat.cleanabilityScore} <span className="text-xs font-normal">/100</span></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">触感温度感</div>
              <div className="text-xl font-black text-amber-400 font-mono">{activeMat.warmthScore} <span className="text-xs font-normal">/100</span></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">抗刮耐磨度</div>
              <div className="text-xl font-black text-cyan-400 font-mono">{activeMat.durabilityScore} <span className="text-xs font-normal">/100</span></div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 mb-1">造价性价比</div>
              <div className="text-xl font-black text-purple-400 font-mono">{activeMat.costScore} <span className="text-xs font-normal">/100</span></div>
            </div>
          </div>

          {/* Pros and Cons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-emerald-500/20 space-y-2">
              <div className="font-bold text-emerald-400 flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-1.5" />
                材质核心优势
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {activeMat.pros.map((p, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-emerald-400">✓</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/20 space-y-2">
              <div className="font-bold text-amber-400 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1.5" />
                使用与维护要点
              </div>
              <ul className="space-y-1.5 text-slate-300">
                {activeMat.cons.map((c, i) => (
                  <li key={i} className="flex items-start space-x-1.5">
                    <span className="text-amber-400">!</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Maintenance Advice */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
            <div className="text-slate-400 mb-1 font-bold">💡 保养与清洁秘诀:</div>
            <p className="text-slate-200 leading-relaxed">{activeMat.maintenanceTips}</p>
          </div>
        </div>

        {/* Right: Live Stain & Scratch Interactive Simulator (5 Columns) */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                INTERACTIVE STAIN LAB
              </span>
              <h3 className="text-lg font-black text-slate-100">
                日常污渍与划痕应对测评
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                点击切换污渍场景，查看该材质在极端日常污染下的实际抗污与打理表现
              </p>
            </div>

            {/* Stain Selector Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setSimulatedStain("coffee")}
                className={`p-3 rounded-2xl text-xs font-bold border flex items-center space-x-2 transition-all ${
                  simulatedStain === "coffee"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Coffee className="w-4 h-4" />
                <span>☕ 浓缩咖啡泼溅</span>
              </button>

              <button
                onClick={() => setSimulatedStain("grease")}
                className={`p-3 rounded-2xl text-xs font-bold border flex items-center space-x-2 transition-all ${
                  simulatedStain === "grease"
                    ? "bg-amber-500/20 border-amber-500 text-amber-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>🍳 烹饪厨房重油污</span>
              </button>

              <button
                onClick={() => setSimulatedStain("fingerprint")}
                className={`p-3 rounded-2xl text-xs font-bold border flex items-center space-x-2 transition-all ${
                  simulatedStain === "fingerprint"
                    ? "bg-cyan-500/20 border-cyan-500 text-cyan-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Hand className="w-4 h-4" />
                <span>🖐️ 手汗油性指纹</span>
              </button>

              <button
                onClick={() => setSimulatedStain("scratch")}
                className={`p-3 rounded-2xl text-xs font-bold border flex items-center space-x-2 transition-all ${
                  simulatedStain === "scratch"
                    ? "bg-purple-500/20 border-purple-500 text-purple-300 shadow"
                    : "bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Key className="w-4 h-4" />
                <span>🔑 钥匙与外设刮擦</span>
              </button>
            </div>

            {/* Simulated Result Card */}
            {(() => {
              const res = getStainFeedback(activeMat, simulatedStain);
              return (
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-mono">
                      TEST REPORT
                    </span>
                    <span className={`text-xs font-bold font-mono ${res.color}`}>
                      {res.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-200 leading-relaxed">
                    {res.text}
                  </p>
                </div>
              );
            })()}
          </div>

          <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed">
            🌿 <strong>环保与耐用标准:</strong> 本案全量定制板材均遵循严格的欧洲 E0 / 日本 F4星级低甲醛标准，搭配激光封边工艺，杜绝异味与胶水释放。
          </div>
        </div>
      </div>
    </div>
  );
};
