"use client";

import React from "react";
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
  Share2
} from "lucide-react";
import { PROPERTY_DATA, STYLES_DATA, ZONES_DATA } from "@/data/projectData";

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
  if (!isOpen) return null;

  const style = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="glass-panel w-full max-w-4xl rounded-3xl border border-slate-700 bg-slate-950 overflow-hidden shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500 flex items-center justify-center text-slate-950 font-black">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-100">
                  Paragon Gateway 空间与设计风格决策终审报告
                </h3>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-mono">
                  FINAL DECISION
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Unit {PROPERTY_DATA.unitNo} · Type B (648 sq ft / 60.22 ㎡) · 柔佛新山
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700 transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>打印/保存 PDF</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center font-bold text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Printable Report Content */}
        <div className="p-6 sm:p-8 space-y-8 text-slate-200 text-xs leading-relaxed max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Section 1: Property Metadata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] text-slate-400">物业名称</div>
              <div className="font-bold text-slate-100">{PROPERTY_DATA.projectName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">房号与楼层</div>
              <div className="font-bold text-cyan-400">{PROPERTY_DATA.unitNo} (24楼)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">建筑面积</div>
              <div className="font-bold text-slate-100">{PROPERTY_DATA.builtUpSqFt} sq ft ({PROPERTY_DATA.builtUpSqm} ㎡)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400">主采光朝向</div>
              <div className="font-bold text-amber-400">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* Section 2: Selected Interior Style */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-cyan-400 border-b border-slate-800 pb-2">
              <Palette className="w-4 h-4" />
              <span>已选定主美学风格路线</span>
            </div>

            <div className="bg-slate-900/60 p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-slate-100">{style.name} ({style.enName})</h4>
                  <div className="text-xs text-cyan-400">{style.tagline}</div>
                </div>
                <span className="text-xs bg-cyan-500 text-slate-950 font-bold px-3 py-1 rounded-full">
                  {style.badge}
                </span>
              </div>

              <p className="text-slate-300">{style.description}</p>

              {/* Materials Table */}
              <div className="mt-3 divide-y divide-slate-800 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px]">
                {style.keyMaterials.map((mat, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between">
                    <span className="text-slate-400">{mat.category}: <strong className="text-slate-200">{mat.item}</strong></span>
                    <span className="text-cyan-400 font-mono">{mat.spec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Smart Home & Automation Profile */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-purple-400 border-b border-slate-800 pb-2">
              <Cpu className="w-4 h-4" />
              <span>全屋智能家居规划 (Aqara / 米家生态)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-100">极客工位与公区控制</div>
                <div className="text-slate-400 text-[11px]">
                  Aqara Hub M3 旗舰网关 + FP2 人体存在毫米波雷达 (4区域定位) + 智能升降桌联动
                </div>
              </div>
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-1">
                <div className="font-bold text-slate-100">安防与环境健康</div>
                <div className="text-slate-400 text-[11px]">
                  D200 3D人脸门锁 + C3 智能双轨电动帘 + 扫地机器人自动上下水 + 厨下 RO 1000G 直饮
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Budget & Cost Estimation */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-amber-400 border-b border-slate-800 pb-2">
              <Calculator className="w-4 h-4" />
              <span>新山本地装修总预算预估 (MYR / RM)</span>
            </div>

            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">推荐「极客科技高配」落地总造价</div>
                <div className="text-2xl font-black text-amber-300 font-mono mt-0.5">
                  RM 68,000 ~ RM 72,000
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-400">均平米造价</div>
                <div className="font-mono font-bold text-cyan-400">~RM 1,150 / ㎡ (RM 106 / sqft)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-900/90 p-4 border-t border-slate-800 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            返回平台探索
          </button>
          <button
            onClick={handlePrint}
            className="px-6 py-2 rounded-xl text-xs font-bold bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 flex items-center space-x-1.5"
          >
            <Download className="w-4 h-4" />
            <span>下载/打印完整决策单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
