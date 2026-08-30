"use client";

import React, { useState } from "react";
import { 
  Cpu, 
  Code, 
  Tv, 
  Moon, 
  Sun, 
  ShieldCheck, 
  Zap, 
  Play, 
  CheckCircle2, 
  Radio, 
  Power, 
  Sliders, 
  Thermometer, 
  Droplets,
  Wifi
} from "lucide-react";
import { SMART_SCENES_DATA, SmartScene } from "@/data/projectData";

export const SmartHomeSimulator: React.FC = () => {
  const [activeSceneId, setActiveSceneId] = useState<string>("deep-work");
  const activeScene = SMART_SCENES_DATA.find((s) => s.id === activeSceneId) || SMART_SCENES_DATA[0];

  const getSceneIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return <Code className="w-5 h-5 text-blue-600" />;
      case "Tv": return <Tv className="w-5 h-5 text-indigo-600" />;
      case "Moon": return <Moon className="w-5 h-5 text-purple-600" />;
      case "Sun": return <Sun className="w-5 h-5 text-amber-600" />;
      case "ShieldCheck": return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      default: return <Cpu className="w-5 h-5 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Matter / Zigbee 3.0
            </span>
            <span className="text-xs text-slate-500">Aqara / 米家深度联动生态</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Cpu className="w-6 h-6 mr-2 text-purple-600" />
            全屋智能极客自动化情景模拟器
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            点击切换以下 5 大核心生活模式，实时查看传感器触发逻辑、灯光色温、窗帘与机电设备的自动化执行链
          </p>
        </div>

        {/* Live Network & Hub Status */}
        <div className="flex items-center space-x-3 bg-white border border-slate-200 p-3 rounded-2xl shadow-sm">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <div className="text-xs">
            <div className="font-bold text-slate-900">Aqara Hub M3 在线</div>
            <div className="text-[10px] text-slate-500">本地局域网自动化 · 零延迟响应</div>
          </div>
        </div>
      </div>

      {/* 5 Scenario Automation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {SMART_SCENES_DATA.map((scene) => {
          const isActive = activeSceneId === scene.id;
          return (
            <button
              key={scene.id}
              onClick={() => setActiveSceneId(scene.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                isActive
                  ? "bg-purple-50/40 border-purple-500 shadow-md ring-2 ring-purple-500/20 scale-[1.02]"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  {getSceneIcon(scene.icon)}
                </div>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping" />
                )}
              </div>

              <div>
                <h3 className={`text-sm font-black ${isActive ? "text-purple-900" : "text-slate-900"}`}>
                  {scene.name}
                </h3>
                <div className="text-[10px] font-mono text-slate-400 mb-2">
                  {scene.enName}
                </div>
                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {scene.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">联动设备数</span>
                <span className="font-mono font-bold text-purple-700">
                  {scene.actions.length} 项
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Scene Execution Chain Visualizer */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-purple-50 text-purple-600 border border-purple-200">
              {getSceneIcon(activeScene.icon)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-black text-slate-900">
                  {activeScene.name}
                </h3>
                <span className="text-xs font-mono text-purple-700 font-semibold">
                  [{activeScene.enName}]
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                触发条件 (Trigger): <span className="text-slate-800 font-medium">{activeScene.trigger}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 text-xs text-emerald-800 font-mono font-bold">
            <Radio className="w-3.5 h-3.5 text-emerald-600" />
            <span>执行状态: 自动化逻辑已就绪</span>
          </div>
        </div>

        {/* Real-time Automation Flow Step-by-Step */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            执行响应链 (Action Pipeline):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeScene.actions.map((act, idx) => (
              <div
                key={idx}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 hover:border-purple-300 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-semibold border border-purple-200">
                    {act.zone}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-semibold">
                    STEP 0{idx + 1}
                  </span>
                </div>

                <div className="font-bold text-sm text-slate-900">
                  {act.device}
                </div>

                <div className="flex items-center space-x-1.5 text-xs font-mono text-blue-700 font-bold bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                  <span>{act.state}</span>
                </div>

                <p className="text-[11px] text-slate-500">
                  {act.details}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Whole-Condo Smart Hardware Manifest */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-lg font-black text-slate-900 flex items-center">
          <Wifi className="w-5 h-5 mr-2 text-blue-600" />
          全屋核心智能硬件部署点位清单
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Aqara D200 3D人脸门锁</div>
            <div className="text-slate-600 text-[11px]">位置: 入户防盗门</div>
            <div className="text-blue-700 font-mono text-[10px] font-semibold">协议: Apple HomeKit + Zigbee</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Aqara FP2 毫米波人体雷达</div>
            <div className="text-slate-600 text-[11px]">位置: 玄关 / 客厅 / 工位 / 主卧 (共4台)</div>
            <div className="text-blue-700 font-mono text-[10px] font-semibold">协议: Wi-Fi 6 + 多区域微动定位</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">Aqara C3 静音电动窗帘电机</div>
            <div className="text-slate-600 text-[11px]">位置: 主卧双轨 + 客厅单轨 (共3组)</div>
            <div className="text-blue-700 font-mono text-[10px] font-semibold">协议: Zigbee 3.0 / 遇阻即停</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900">扫拖机器人自动上下水基站</div>
            <div className="text-slate-600 text-[11px]">位置: 生活阳台 (Yard) 专用位</div>
            <div className="text-blue-700 font-mono text-[10px] font-semibold">协议: 米家/Roborock 离家自启</div>
          </div>
        </div>
      </div>
    </div>
  );
};
