"use client";

import React, { useState } from "react";
import { 
  Calculator, 
  DollarSign, 
  Hammer, 
  Cpu, 
  Sparkles, 
  Monitor, 
  CheckSquare, 
  Square, 
  Download, 
  TrendingUp, 
  ShieldCheck,
  Building,
  RotateCcw
} from "lucide-react";
import { BOM_DATA, PROPERTY_DATA, BomCategory } from "@/data/projectData";

export const BudgetCalculator: React.FC = () => {
  // Store selected item IDs
  const allItemIds = BOM_DATA.flatMap((cat) => cat.items.map((i) => i.id));
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>(allItemIds);
  const [activeTier, setActiveTier] = useState<"essential" | "premium" | "ultimate">("premium");

  // Toggle item selection
  const toggleItem = (id: string) => {
    setSelectedItemIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Switch Tier Preset
  const handleTierChange = (tier: "essential" | "premium" | "ultimate") => {
    setActiveTier(tier);
    if (tier === "essential") {
      const ids = BOM_DATA.flatMap((cat) =>
        cat.items.filter((i) => i.tier === "essential").map((i) => i.id)
      );
      setSelectedItemIds(ids);
    } else if (tier === "premium") {
      const ids = BOM_DATA.flatMap((cat) =>
        cat.items.filter((i) => i.tier === "essential" || i.tier === "premium").map((i) => i.id)
      );
      setSelectedItemIds(ids);
    } else {
      setSelectedItemIds(allItemIds);
    }
  };

  // Calculate Total Cost
  const totalCostMYR = BOM_DATA.reduce((acc, cat) => {
    const catSum = cat.items
      .filter((i) => selectedItemIds.includes(i.id))
      .reduce((sum, item) => sum + item.totalMYR, 0);
    return acc + catSum;
  }, 0);

  const costPerSqFt = Math.round(totalCostMYR / PROPERTY_DATA.builtUpSqFt);
  const costPerSqm = Math.round(totalCostMYR / PROPERTY_DATA.builtUpSqm);
  const spaRatio = ((totalCostMYR / PROPERTY_DATA.spaPriceMYR) * 100).toFixed(1);
  const estimatedMonthlyLoan = Math.round((totalCostMYR * 1.05) / 36);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              新山本地施工行情 (MYR / RM)
            </span>
            <span className="text-xs text-slate-500">Paragon Gateway 648 sq ft</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Calculator className="w-6 h-6 mr-2 text-amber-600" />
            全案落地预算与工程量清单 (BOM)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            涵盖拆改、木作、Aqara 智能、灯光洁具及极客软装，支持按需勾选分项实时动态核算
          </p>
        </div>

        {/* Tier Presets Switcher */}
        <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1.5 gap-1.5">
          <button
            onClick={() => handleTierChange("essential")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTier === "essential"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            基础质感精装 (~RM 45k)
          </button>
          <button
            onClick={() => handleTierChange("premium")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTier === "premium"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            极客科技高配 (~RM 68k) ★推荐
          </button>
          <button
            onClick={() => handleTierChange("ultimate")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTier === "ultimate"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            顶级旗舰高定 (~RM 95k)
          </button>
        </div>
      </div>

      {/* KPI Dashboard Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-amber-50/70 p-5 rounded-3xl border border-amber-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-amber-800 font-bold uppercase tracking-wider">
            装修与软装总预估造价
          </div>
          <div className="text-3xl font-black text-amber-950 font-mono">
            RM {totalCostMYR.toLocaleString()}
          </div>
          <div className="text-[10px] text-amber-700 font-medium">
            包含全部已勾选硬装、高定木作与设备
          </div>
        </div>

        <div className="bg-blue-50/70 p-5 rounded-3xl border border-blue-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-blue-800 font-bold uppercase tracking-wider">
            单位面积平米造价
          </div>
          <div className="text-2xl font-black text-blue-950 font-mono">
            RM {costPerSqFt} <span className="text-xs font-normal text-slate-500">/ sqft</span>
          </div>
          <div className="text-[10px] text-blue-700 font-medium">
            约合 RM {costPerSqm} / ㎡ (60.22 ㎡)
          </div>
        </div>

        <div className="bg-purple-50/70 p-5 rounded-3xl border border-purple-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-purple-800 font-bold uppercase tracking-wider">
            占购房价比例 (SPA RM 58.1万)
          </div>
          <div className="text-2xl font-black text-purple-950 font-mono">
            {spaRatio}%
          </div>
          <div className="text-[10px] text-purple-700 font-medium">
            处于高端公寓 10%~15% 黄金投资自住区间
          </div>
        </div>

        <div className="bg-emerald-50/70 p-5 rounded-3xl border border-emerald-200 shadow-2xs space-y-1">
          <div className="text-[11px] text-emerald-800 font-bold uppercase tracking-wider">
            分期月供参考 (36期分期)
          </div>
          <div className="text-2xl font-black text-emerald-950 font-mono">
            ~RM {estimatedMonthlyLoan.toLocaleString()} <span className="text-xs font-normal text-slate-500">/月</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">
            马币信用卡/装修贷 0%~3% 利率测算
          </div>
        </div>
      </div>

      {/* Category Breakdown & Itemized Checklist */}
      <div className="space-y-6">
        {BOM_DATA.map((cat, catIdx) => {
          const catSelectedItems = cat.items.filter((i) => selectedItemIds.includes(i.id));
          const catSubtotal = catSelectedItems.reduce((s, i) => s + i.totalMYR, 0);

          return (
            <div
              key={catIdx}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-3 gap-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-blue-600">
                    <Hammer className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      {cat.category}
                    </h3>
                    <p className="text-xs text-slate-500">{cat.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs text-slate-500 mr-2 font-medium">分项小计:</span>
                  <span className="text-base font-black text-blue-700 font-mono">
                    RM {catSubtotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Table of Items */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50/50">
                      <th className="py-2.5 px-3 w-10">选择</th>
                      <th className="py-2.5 px-3">项目名称与工艺规格</th>
                      <th className="py-2.5 px-3 w-24">工程量</th>
                      <th className="py-2.5 px-3 w-28 text-right">单价 (RM)</th>
                      <th className="py-2.5 px-3 w-32 text-right">总价 (RM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {cat.items.map((item) => {
                      const isChecked = selectedItemIds.includes(item.id);
                      return (
                        <tr
                          key={item.id}
                          onClick={() => toggleItem(item.id)}
                          className={`hover:bg-slate-50 cursor-pointer transition-all ${
                            isChecked ? "text-slate-800" : "text-slate-400 opacity-60"
                          }`}
                        >
                          <td className="py-3 px-3">
                            <div className="text-blue-600">
                              {isChecked ? (
                                <CheckSquare className="w-4 h-4 text-blue-600" />
                              ) : (
                                <Square className="w-4 h-4 text-slate-400" />
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-bold flex items-center space-x-2">
                              <span className={isChecked ? "text-slate-900" : "text-slate-400"}>{item.name}</span>
                              {item.recommended && (
                                <span className="text-[9px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium border border-blue-200">
                                  标配
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                              {item.spec}
                            </div>
                          </td>
                          <td className="py-3 px-3 font-mono">{item.quantity}</td>
                          <td className="py-3 px-3 text-right font-mono text-slate-700">
                            {item.unitPriceMYR.toLocaleString()}
                          </td>
                          <td className={`py-3 px-3 text-right font-mono font-bold ${
                            isChecked ? "text-slate-900" : "text-slate-400"
                          }`}>
                            RM {item.totalMYR.toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
