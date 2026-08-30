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
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-6 my-8">
        {/* Header */}
        <div className="bg-slate-50 p-6 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black shadow-sm">
              PG
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-slate-900">
                  Paragon Gateway 空间与设计风格决策终审报告
                </h3>
                <span className="text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded font-mono font-bold">
                  FINAL DECISION
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
        <div className="p-6 sm:p-8 space-y-8 text-slate-800 text-xs leading-relaxed max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Section 1: Property Metadata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 font-medium">物业名称</div>
              <div className="font-bold text-slate-900 mt-0.5">{PROPERTY_DATA.projectName}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">房号与楼层</div>
              <div className="font-bold text-blue-700 font-mono mt-0.5">{PROPERTY_DATA.unitNo} (24楼)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">建筑面积</div>
              <div className="font-bold text-slate-900 mt-0.5">{PROPERTY_DATA.builtUpSqFt} sq ft ({PROPERTY_DATA.builtUpSqm} ㎡)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">主采光朝向</div>
              <div className="font-bold text-amber-700 mt-0.5">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* Section 2: Selected Interior Style */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Palette className="w-4 h-4 text-blue-600" />
              <span>已选定主美学风格路线</span>
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

          {/* Section 3: Smart Home & Automation Profile */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>全屋智能家居规划 (Aqara / 米家生态)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">极客工位与公区控制</div>
                <div className="text-slate-600 text-[11px]">
                  Aqara Hub M3 旗舰网关 + FP2 人体存在毫米波雷达 (4区域定位) + 智能升降桌联动
                </div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <div className="font-bold text-slate-900">安防与环境健康</div>
                <div className="text-slate-600 text-[11px]">
                  D200 3D人脸门锁 + C3 智能双轨电动帘 + 扫地机器人自动上下水 + 厨下 RO 1000G 直饮
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Budget & Cost Estimation */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>新山本地装修总预算预估 (MYR / RM)</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-500">推荐「极客科技高配」落地总造价</div>
                <div className="text-2xl font-black text-amber-700 font-mono mt-0.5">
                  RM 68,000 ~ RM 72,000
                </div>
              </div>
              <div className="text-right text-xs">
                <div className="text-slate-500">均平米造价</div>
                <div className="font-mono font-bold text-blue-700">~RM 1,150 / ㎡ (RM 106 / sqft)</div>
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
            <span>下载/打印完整决策单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
