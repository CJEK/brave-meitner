"use client";

import React, { useEffect, useState } from "react";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Zap, 
  Sun, 
  Clock, 
  Activity, 
  DollarSign, 
  Droplets, 
  Ruler, 
  FileText,
  Camera,
  Compass
} from "lucide-react";
import { 
  PROPERTY_DATA, 
  STYLES_DATA, 
  ZONES_DATA, 
  CONSTRUCTION_ROADMAP, 
  BIOHACKING_ECOLOGY, 
  BUDGET_WEIGHT_DISTRIBUTION 
} from "@/data/projectData";
import { getJohorSunData } from "@/utils/solarCalculator";

interface DecisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedStyleId: string;
}

export const DecisionModal: React.FC<DecisionModalProps> = ({
  isOpen,
  onClose,
  selectedStyleId
}) => {
  const [canvasSnapshot, setCanvasSnapshot] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      try {
        const canvas = document.querySelector("canvas");
        if (canvas) {
          const dataUrl = canvas.toDataURL("image/png");
          if (dataUrl && dataUrl.length > 500) {
            setCanvasSnapshot(dataUrl);
          }
        }
      } catch (err) {
        console.warn("Failed to capture 3D canvas snapshot:", err);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const style = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const morningSolar = getJohorSunData("morning");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header & Actions */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Paragon Gateway A-24-10 全屋自住空间决策终审交付单
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  已核验 1:1 BIM
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Type B · 648 sq.ft (60.22 ㎡) · 柔佛新山永久地契高层
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印/保存 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-200/70 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs text-slate-700 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Property Summary Card */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-blue-50/50 p-4 rounded-2xl border border-blue-200">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">房产代号</div>
              <div className="text-sm font-black text-slate-900 font-mono mt-0.5">{PROPERTY_DATA.unitNo} (Tower A)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">实测建筑面积</div>
              <div className="text-sm font-black text-slate-900 font-mono mt-0.5">{PROPERTY_DATA.builtUpSqm} ㎡ ({PROPERTY_DATA.builtUpSqFt} sqft)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">物理外围轴网</div>
              <div className="text-sm font-black text-slate-900 font-mono mt-0.5">6,900 × 9,725 mm</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">主采光朝向</div>
              <div className="text-sm font-black text-amber-700 font-mono mt-0.5">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* Section 2: 3D / 2.5D Spatial Architecture Master Cover */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>空间方案总图与 1:1 家具轴网实测视图</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">1:1 BIM Architectural Elevation</span>
            </div>

            {canvasSnapshot ? (
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-950 shadow-inner">
                <img
                  src={canvasSnapshot}
                  alt="3D Canvas Snapshot"
                  className="w-full h-full object-contain"
                />
              </div>
            ) : (
              /* High-Resolution Vector BIM Blueprint Cover (Guaranteed 0 blank space) */
              <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-slate-800 bg-[#0f172a] shadow-inner p-4 flex flex-col justify-between select-none">
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center space-x-2 bg-slate-900/90 text-white px-3 py-1 rounded-lg border border-slate-700 text-xs font-bold">
                    <Compass className="w-3.5 h-3.5 text-amber-400" />
                    <span>新山经纬度南偏东 SSE 165° 真实采光轴网</span>
                  </div>
                  <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-mono font-bold shadow-xs">
                    60.22 ㎡ (648 sq.ft)
                  </div>
                </div>

                {/* Vector Mini Isometric Grid Preview */}
                <div className="w-full flex-1 flex items-center justify-center my-2">
                  <div className="grid grid-cols-3 gap-2 w-full max-w-md text-[11px] text-center font-bold">
                    <div className="bg-teal-500/20 border border-teal-500/50 text-teal-300 p-2.5 rounded-xl">
                      生活阳台 (3.8㎡)
                    </div>
                    <div className="bg-pink-500/20 border border-pink-500/50 text-pink-300 p-2.5 rounded-xl">
                      开放厨房 (5.2㎡)
                    </div>
                    <div className="bg-slate-500/20 border border-slate-500/50 text-slate-300 p-2.5 rounded-xl">
                      入户玄关 (3.8㎡)
                    </div>
                    <div className="bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 p-2.5 rounded-xl">
                      独立卫浴 (4.5㎡)
                    </div>
                    <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 p-2.5 rounded-xl col-span-2">
                      多功能中岛吧台 (4.2㎡)
                    </div>
                    <div className="bg-purple-500/20 border border-purple-500/50 text-purple-300 p-2.5 rounded-xl">
                      极客书房 (6.8㎡)
                    </div>
                    <div className="bg-sky-500/20 border border-sky-500/50 text-sky-300 p-2.5 rounded-xl col-span-2">
                      景观客厅 (13.5㎡)
                    </div>
                    <div className="bg-indigo-500/20 border border-indigo-500/50 text-indigo-300 p-2.5 rounded-xl col-span-2">
                      主卧深睡空间 (14.2㎡)
                    </div>
                    <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 p-2.5 rounded-xl">
                      南向阳台 (4.2㎡)
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800">
                  <span>外框物理尺寸: 6,900 mm × 9,725 mm · 净层高 3.0 m</span>
                  <span className="text-emerald-400 font-bold">✓ 9 大功能区 100% 严谨闭环</span>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: 9 Zones Spatial Dimension Breakdown */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Ruler className="w-4 h-4 text-blue-600" />
                <span>9 大功能分区毫米级空间定制与面积总账 (总计 60.22 ㎡)</span>
              </div>
              <span className="text-xs font-mono font-normal text-slate-500">100% 吻合 Type B 购房合同</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-3 gap-2">
              {ZONES_DATA.map((z) => (
                <div key={z.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-slate-900">{z.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono">{z.dimensionsMm}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold text-blue-700">{z.sqm} ㎡</div>
                    <div className="text-[10px] text-slate-400 font-mono">{z.sqft} sqft</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: 5-Stage Construction Execution Roadmap */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>施工落地执行路线图 (5大阶段全景控制表)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {CONSTRUCTION_ROADMAP.map((stage) => (
                <div key={stage.stageNumber} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-mono">
                        阶段 {stage.stageNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 font-bold">{stage.durationWeeks}</span>
                    </div>
                    <div className="font-black text-slate-900 text-xs mt-1.5">{stage.name}</div>
                    <div className="text-[10px] text-slate-600 mt-1 leading-relaxed">{stage.focus}</div>
                  </div>
                  <div className="text-[9px] text-slate-400 border-t border-slate-200 pt-1 font-mono">
                    {stage.keyCheckpoints[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Biohacking & Indoor Ecology */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>健康水循环与室内微生态体系 (新山高湿高热定制)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BIOHACKING_ECOLOGY.waterFiltrationChain.map((stage, idx) => (
                <div key={idx} className="p-3 bg-cyan-50/50 rounded-xl border border-cyan-200 space-y-1">
                  <div className="text-[10px] font-bold text-cyan-700 font-mono">过滤道次 0{idx + 1}</div>
                  <div className="font-black text-slate-900">{stage.stage}</div>
                  <div className="text-[11px] text-slate-600 font-semibold">{stage.device}</div>
                  <p className="text-[10px] text-slate-500 mt-1">{stage.healthBenefit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: 24h Circadian Lighting Curve */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>24 小时生物节律照明色温自适应策略 (Circadian CCT Automation)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {BIOHACKING_ECOLOGY.circadianLightingCurve.map((sched, idx) => (
                <div key={idx} className="p-2.5 bg-amber-50/40 rounded-xl border border-amber-200 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-[10px] text-amber-800">{sched.timeSlot}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">{sched.cct}</span>
                  </div>
                  <div className="font-bold text-slate-900 text-xs">{sched.intensity}</div>
                  <div className="text-[10px] text-slate-500 leading-snug">{sched.biologicalGoal}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Selected Style & Aesthetic Palette */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>已定案室内设计美学风格: {style.name} ({style.enName})</span>
              </div>
              <span className="text-xs font-bold text-blue-600">{style.badge}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {style.keyMaterials.map((mat, i) => (
                <div key={i} className="space-y-0.5">
                  <div className="text-[10px] text-slate-500 font-semibold">{mat.category}</div>
                  <div className="font-bold text-slate-900">{mat.item}</div>
                  <div className="text-[10px] text-blue-600 font-mono">{mat.spec}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Budget Allocation Breakdown (MYR) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>新山本地施工物料总预算科学权重分配模型 (MYR)</span>
              </div>
              <span className="text-xs text-slate-500 font-mono">平米均价约 RM 1,050 / ㎡</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {BUDGET_WEIGHT_DISTRIBUTION.map((item, idx) => (
                <div key={idx} className="p-3 bg-emerald-50/40 rounded-xl border border-emerald-200 flex flex-col justify-between space-y-1">
                  <div>
                    <div className="text-[10px] font-bold text-emerald-700 font-mono">{item.percentage}% 预算占比</div>
                    <div className="font-bold text-slate-900 text-xs mt-1">{item.category}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 border-t border-emerald-100 pt-1 leading-snug">
                    {item.itemsSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>Paragon Gateway Tower A - 24F · 建筑设计与施工终审报告</span>
          <span className="font-mono">Generated for Owner · Freehold Property</span>
        </div>
      </div>
    </div>
  );
};
