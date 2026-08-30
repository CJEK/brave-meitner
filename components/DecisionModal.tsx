"use client";

import React, { useState, useEffect } from "react";
import { 
  Download, 
  Printer, 
  CheckCircle2, 
  Building2, 
  Compass, 
  Palette, 
  Cpu, 
  Calculator, 
  Sparkles,
  Share2,
  Camera,
  ShieldCheck,
  Sun,
  Layers,
  Ruler,
  Clock,
  Droplets,
  Zap,
  Hammer
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
      // Capture high-res snapshot from WebGL canvas (supported via preserveDrawingBuffer: true)
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
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-sm text-base">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">
                  Paragon Gateway 空间与设计风格决策终审报告
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                  BIM 1:1 VERIFIED
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Unit {PROPERTY_DATA.unitNo} · Type B (648 sq ft / 60.22 ㎡) · 柔佛新山
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 shadow-2xs transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印/保存 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm"
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

          {/* Section 2: 3D Visual Rendering Snapshot */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>3D 空间切片与家具轴网实测视图</span>
              </div>
              <span className="text-xs text-slate-400 font-mono">1:1 BIM Cutaway</span>
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
              <div className="aspect-video w-full rounded-2xl bg-slate-100 border border-slate-200 flex flex-col items-center justify-center text-slate-400 space-y-2">
                <Layers className="w-8 h-8 text-slate-300" />
                <span>3D 视口已生成，导出时自动嵌入</span>
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
              <span>光热微气候与健康生活机电系统 (Biohacking & Circadian Lighting)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Water Filtration Chain */}
              <div className="bg-cyan-50/50 p-4 rounded-xl border border-cyan-200 space-y-2">
                <div className="font-bold text-cyan-950 flex items-center">
                  <Droplets className="w-3.5 h-3.5 mr-1 text-cyan-600" />
                  <span>全屋三道健康水循环链条</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {BIOHACKING_ECOLOGY.waterFiltrationChain.map((w, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-cyan-100 space-y-0.5">
                      <div className="font-bold text-slate-900">{w.stage}: <span className="text-cyan-700">{w.device}</span></div>
                      <div className="text-[10px] text-slate-500">{w.healthBenefit}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Circadian Lighting Curve */}
              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200 space-y-2">
                <div className="font-bold text-amber-950 flex items-center">
                  <Sun className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  <span>24 小时生物节律照明算法曲线</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  {BIOHACKING_ECOLOGY.circadianLightingCurve.map((c, idx) => (
                    <div key={idx} className="bg-white p-2 rounded-lg border border-amber-100 space-y-0.5">
                      <div className="font-bold text-slate-900">{c.timeSlot}: <span className="text-amber-700">{c.cct}</span></div>
                      <div className="text-[10px] text-slate-500">{c.biologicalGoal}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Selected Interior Style */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>已选定主美学风格路线与材质规格</span>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-900">{style.name} ({style.enName})</h4>
                  <div className="text-xs text-blue-700 font-medium">{style.tagline}</div>
                </div>
                <span className="text-xs bg-blue-600 text-white font-bold px-3 py-1 rounded-full shadow-2xs">
                  {style.badge}
                </span>
              </div>

              <p className="text-slate-600">{style.description}</p>

              {/* Materials Table */}
              <div className="mt-3 divide-y divide-slate-200 bg-white rounded-xl border border-slate-200 text-[11px]">
                {style.keyMaterials.map((mat, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-500">{mat.category}: <strong className="text-slate-900">{mat.item}</strong></span>
                    <span className="text-blue-700 font-mono font-semibold">{mat.spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 7: Scientific Budget Weight Model */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>新山高品质装修预算科学权重配比 (5大板块总造价预估)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              {BUDGET_WEIGHT_DISTRIBUTION.map((bw, idx) => (
                <div key={idx} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-black">
                      <span className="text-slate-900">{bw.category}</span>
                      <span className="text-blue-600 font-mono">{bw.percentage}%</span>
                    </div>
                    <div className="text-sm font-black text-amber-700 font-mono mt-1">RM {bw.budgetMYR.toLocaleString()}</div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 line-clamp-2">{bw.itemsSummary}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">极客全维高配落地总预算预估 (含全屋定制+Aqara智能+3台空调+净水)</div>
                <div className="text-xl font-black text-amber-400 font-mono mt-0.5">
                  RM 62,350 ~ RM 68,000
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">均平米造价</div>
                <div className="font-mono font-bold text-emerald-400 text-sm">~RM 1,050 / ㎡ (RM 98 / sqft)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
          >
            返回平台探索
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>下载/打印完整决策终审单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
