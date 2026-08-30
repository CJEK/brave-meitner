"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Eye, 
  Layers, 
  Maximize2, 
  Palette, 
  Filter, 
  Check,
  ChevronRight,
  Sun,
  Moon,
  Zap
} from "lucide-react";
import { STYLES_DATA, StyleData } from "@/data/projectData";

interface VisualGalleryProps {
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
}

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  selectedStyleId,
  setSelectedStyleId
}) => {
  const [filterStyle, setFilterStyle] = useState<string>("all");
  const [filterRoom, setFilterRoom] = useState<string>("all");
  const [activeModalItem, setActiveModalItem] = useState<{
    style: StyleData;
    rendering: StyleData["roomRenderings"][0];
  } | null>(null);

  // Flatten all gallery items
  const allItems = STYLES_DATA.flatMap((style) =>
    style.roomRenderings.map((rendering) => ({
      style,
      rendering,
    }))
  );

  const filteredItems = allItems.filter((item) => {
    const matchStyle = filterStyle === "all" || item.style.id === filterStyle;
    const matchRoom =
      filterRoom === "all" ||
      (filterRoom === "living" && item.rendering.room.includes("客厅")) ||
      (filterRoom === "workstation" && item.rendering.room.includes("工作站")) ||
      (filterRoom === "bedroom" && item.rendering.room.includes("主卧")) ||
      (filterRoom === "bath-balcony" && (item.rendering.room.includes("卫浴") || item.rendering.room.includes("阳台")));
    return matchStyle && matchRoom;
  });

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              HD Visual Design Moodboards
            </span>
            <span className="text-xs text-slate-500">4大风格 × 4大核心生活空间</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            全屋空间渲染画廊与材质情绪板
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            浏览与筛选不同美学体系在客厅中岛、极客工位、深睡主卧与景观阳台的落地渲染图景与材质工艺
          </p>
        </div>

        {/* Style Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl text-xs">
          <button
            onClick={() => setFilterStyle("all")}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              filterStyle === "all" ? "bg-slate-900 text-white shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            全部风格 (16组渲染)
          </button>
          {STYLES_DATA.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStyle(s.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                filterStyle === s.id
                  ? "bg-slate-900 text-white shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* Room Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar text-xs">
        <span className="text-slate-500 font-bold uppercase mr-1">空间筛选:</span>
        {[
          { id: "all", label: "全部空间" },
          { id: "living", label: "🛋️ 客厅与中岛吧台" },
          { id: "workstation", label: "💻 极客工作站 (1+1)" },
          { id: "bedroom", label: "🛏️ 主卧深睡区" },
          { id: "bath-balcony", label: "🚿 卫浴与景观阳台" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterRoom(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl font-medium border transition-all ${
              filterRoom === tab.id
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredItems.map((item, idx) => {
          const isCurrentSelectedStyle = selectedStyleId === item.style.id;

          return (
            <div
              key={idx}
              onClick={() => setActiveModalItem(item)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              {/* Visual Simulated Rendering Hero */}
              <div className={`relative h-56 bg-gradient-to-br ${item.rendering.gradientPreview} p-5 flex flex-col justify-between overflow-hidden`}>
                <div className="absolute inset-0 bg-tech-grid opacity-15" />

                {/* Top Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-white/90 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs">
                    {item.rendering.room}
                  </span>
                  <span
                    style={{ color: item.style.accentColor }}
                    className="text-[10px] font-bold font-mono bg-slate-900/80 text-white px-2 py-0.5 rounded-md"
                  >
                    {item.style.name}
                  </span>
                </div>

                {/* Center Title */}
                <div className="relative z-10 space-y-1">
                  <h4 className="text-base font-black text-white drop-shadow-md group-hover:text-blue-200 transition-colors">
                    {item.rendering.title}
                  </h4>
                  <p className="text-[11px] text-slate-100 font-mono drop-shadow line-clamp-1">
                    {item.rendering.visualStyle}
                  </p>
                </div>

                {/* Hover Click to Expand Indicator */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-white/90 font-medium">
                  <span>点击查看大图与工艺</span>
                  <Maximize2 className="w-3.5 h-3.5 opacity-90 group-hover:scale-110 transition-transform" />
                </div>
              </div>

              {/* Bottom Details Content */}
              <div className="p-4 bg-white space-y-3 flex-1 flex flex-col justify-between">
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {item.rendering.description}
                </p>

                {/* Focal Points Chips */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {item.rendering.focalPoints.map((fp, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200 font-medium"
                      >
                        {fp}
                      </span>
                    ))}
                  </div>

                  {/* Fast Action to Apply this Style */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStyleId(item.style.id);
                    }}
                    className={`w-full py-1.5 rounded-xl text-[11px] font-bold transition-all ${
                      isCurrentSelectedStyle
                        ? "bg-blue-50 text-blue-700 border border-blue-300 font-semibold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isCurrentSelectedStyle ? "✓ 当前主推演风格" : `应用 ${item.style.name}`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Deep-Dive Viewer */}
      {activeModalItem && (
        <div
          onClick={() => setActiveModalItem(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-3xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
          >
            {/* Modal Hero */}
            <div className={`relative h-64 bg-gradient-to-br ${activeModalItem.rendering.gradientPreview} p-8 flex flex-col justify-between`}>
              <div className="flex items-center justify-between">
                <span className="bg-white/95 text-xs font-bold px-3 py-1 rounded-xl text-slate-900 border border-slate-200 shadow-sm">
                  {activeModalItem.style.name} · {activeModalItem.rendering.room}
                </span>
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="w-8 h-8 rounded-full bg-white/90 text-slate-700 hover:text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                <h3 className="text-2xl font-black text-white drop-shadow-md">
                  {activeModalItem.rendering.title}
                </h3>
                <p className="text-xs font-mono text-white/90 drop-shadow">
                  {activeModalItem.rendering.visualStyle}
                </p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  空间设计与生活意境解析
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {activeModalItem.rendering.description}
                </p>
              </div>

              {/* Focal Points Detailed */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  核心高定工艺与设计焦点 (Focal Points)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {activeModalItem.rendering.focalPoints.map((fp, i) => (
                    <div
                      key={i}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-800 font-semibold flex items-center space-x-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                      <span>{fp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Style Materials Matching */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  本案采用材质规格表 (Material Spec)
                </h4>
                <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                  {activeModalItem.style.keyMaterials.map((mat, i) => (
                    <div key={i} className="p-3 flex items-center justify-between">
                      <span className="text-slate-600">{mat.category}: <strong className="text-slate-900">{mat.item}</strong></span>
                      <span className="text-blue-700 font-mono font-semibold">{mat.spec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveModalItem(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setSelectedStyleId(activeModalItem.style.id);
                    setActiveModalItem(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm"
                >
                  确认选定此风格
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
