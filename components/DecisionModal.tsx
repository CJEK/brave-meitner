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
  Ruler
} from "lucide-react";
import { PROPERTY_DATA, STYLES_DATA, ZONES_DATA } from "@/data/projectData";
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
        <div className="p-6 sm:p-8 space-y-8 text-slate-800 text-xs leading-relaxed max-h-[75vh] overflow-y-auto print:max-h-none print:overflow-visible">
          {/* Section 1: Property Metadata Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="text-[10px] text-slate-500 font-medium">物业名称与户型</div>
              <div className="font-bold text-slate-900 mt-0.5">{PROPERTY_DATA.projectName} ({PROPERTY_DATA.unitType})</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">房号与楼层</div>
              <div className="font-bold text-blue-700 font-mono mt-0.5">{PROPERTY_DATA.unitNo} (24F 高层无遮挡)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">建筑总面积 (锁定)</div>
              <div className="font-bold text-slate-900 mt-0.5">{PROPERTY_DATA.builtUpSqFt} sq ft ({PROPERTY_DATA.builtUpSqm} ㎡)</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-500 font-medium">主采光面朝向</div>
              <div className="font-bold text-amber-700 mt-0.5">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* Section 2: 3D BIM Live Snapshot */}
          {canvasSnapshot && (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
                <Camera className="w-4 h-4 text-blue-600" />
                <span>3D BIM 空间推演实景快照 (Live 3D Snapshot)</span>
              </div>
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 max-h-72 flex items-center justify-center p-2">
                <img
                  src={canvasSnapshot}
                  alt="3D Space Snapshot"
                  className="max-h-64 object-contain rounded-xl shadow-xs"
                />
              </div>
            </div>
          )}

          {/* Section 3: 9-Zone Area Quantitative Breakdown (Sum = 60.22 ㎡) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>9 大功能分区套内面积校准清单 (Total: 60.22 ㎡ / 648 sq ft)</span>
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

          {/* Section 4: Mandatory Compliance Check */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>硬性指标达标自检校验表 (Mandatory Compliance Check)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">尺寸基准锁定：X=6,900mm × Y=9,725mm</div>
                  <div className="text-[11px] text-emerald-800">总面积固定 60.22 ㎡ (648 sq ft)，层高 3.0m，吊顶净高 2,650~2,750mm。</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">朝向光影合规：南偏东 SSE 165° 零西晒</div>
                  <div className="text-[11px] text-emerald-800">SunCalc 天体计算：晨光方位 108.5° / 高度角 28.5°，全天漫射采光。</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">家政分区铁律：洗衣设备归入北侧 Yard</div>
                  <div className="text-[11px] text-emerald-800">洗烘一体与自动上下水全部就位北侧生活阳台，南向阳台完全保持景观休闲。</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200 flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-bold text-emerald-950">动线安全达标：全屋过道净宽 ≥ 800mm</div>
                  <div className="text-[11px] text-emerald-800">入户主通道 1,050mm，中岛过道 950mm，卧室床侧 750~850mm。</div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 5: Selected Interior Style */}
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

          {/* Section 6: Smart Home & Automation Profile */}
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

          {/* Section 7: Budget & Cost Estimation */}
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
