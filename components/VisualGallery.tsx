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
  Zap,
  Ruler,
  Droplets,
  Cpu,
  Wind,
  Compass,
  Building2
} from "lucide-react";
import { STYLES_DATA, StyleData, PROPERTY_DATA } from "@/data/projectData";

interface VisualGalleryProps {
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
}

// 5 Curated 2D Blueprint Schemes based on Type B 60.22 ㎡ (6.90m × 9.725m)
interface BlueprintScheme {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tag: string;
  themeStyleId: string;
  primaryColor: string;
  accentColor: string;
  bgFill: string;
  description: string;
  specs: string[];
  focalPoints: string[];
  mepHighlights: string[];
  palette: { name: string; hex: string }[];
}

const BLUEPRINT_SCHEMES: BlueprintScheme[] = [
  {
    id: "scheme-topology",
    title: "基准建筑物理拓扑 2D 标尺图",
    subtitle: "1+1 房实体墙与动线标尺基准",
    category: "物理拓扑",
    tag: "建筑硬红线",
    themeStyleId: "modern-minimalist",
    primaryColor: "#2563eb",
    accentColor: "#3b82f6",
    bgFill: "#f8fafc",
    description: "严格依据 Paragon Gateway Type B (6.9m × 9.725m) 真实建面 60.22 ㎡ 绘制。以 X = -0.35m 纵向主墙隔离右侧 3.8m 公共动区与左侧 3.1m 私密静区，清晰标定 900mm 卧室与卫浴门洞及通畅主动线。",
    specs: [
      "总宽 6,900 mm × 总深 9,725 mm (648 sq ft)",
      "右侧公区 3.8m (55%) · 左侧私区 3.1m (45%)",
      "纵向主隔墙 X = -0.35m (贯穿南北)",
      "门洞净宽 900mm · 主过道净宽 ≥ 800mm"
    ],
    focalPoints: ["纵向中轴主墙", "900mm 卧室门洞", "900mm 卫浴门洞", "南向全宽阳台移门"],
    mepHighlights: ["DB配电总箱", "SMATV电视点", "生活阳台上下水", "主卧与阳台双轨帘"],
    palette: [
      { name: "建筑骨架", hex: "#1e293b" },
      { name: "标尺基准", hex: "#2563eb" },
      { name: "公区动线", hex: "#3b82f6" },
      { name: "静区地面", hex: "#e2e8f0" }
    ]
  },
  {
    id: "scheme-tech-minimal",
    title: "现代极简科技风 2D 流线图",
    subtitle: "极客工作站与悬浮中岛高能联动",
    category: "极客科技",
    tag: "极客优选",
    themeStyleId: "modern-minimalist",
    primaryColor: "#2563eb",
    accentColor: "#0284c7",
    bgFill: "#f0f9ff",
    description: "太空灰微水泥与哑光纯白打底，配置 2.0m 双电机升降桌、85寸巨幕与 1.8m 岩板悬浮中岛。公区通铺 800×800mm 浅灰大砖，形成开阔畅达的极客研发与影音生活流线。",
    specs: [
      "公区 1.8m 悬浮中岛连接 85寸贴墙大屏",
      "极客工位 2.0m×0.8m 升降桌 + 双32寸屏",
      "大件收纳高柜（可直推 28寸大行李箱）",
      "主卧 1.8m×2.0m 科技布悬浮大床"
    ],
    focalPoints: ["2.0m 升降工位", "1.8m 岩板中岛", "85寸悬浮巨幕", "微水泥极简地台"],
    mepHighlights: ["8组桌面抗涌浪插座", "RJ45千兆网口", "FP2人体雷达", "电视流光溢彩"],
    palette: [
      { name: "太空微水泥", hex: "#94a3b8" },
      { name: "哑光纯白", hex: "#f8fafc" },
      { name: "极客深蓝", hex: "#2563eb" },
      { name: "碳素黑", hex: "#0f172a" }
    ]
  },
  {
    id: "scheme-italian-luxury",
    title: "意式暗调高级黑 2D 光影图",
    subtitle: "劳伦黑金与五星级酒店奢雅卫浴",
    category: "奢雅暗调",
    tag: "酒店级奢华",
    themeStyleId: "italian-luxury",
    primaryColor: "#d97706",
    accentColor: "#f59e0b",
    bgFill: "#fffbeb",
    description: "黑胡桃木纹与劳伦黑金岩板交织，2700K 琥珀洗墙光环绕。卫浴定制 1.5m 贯穿式黑金大理石大平台延伸至马桶上方，搭配暗装枪灰瀑布龙头与满墙通体 LED 触控除雾无框镜柜。",
    specs: [
      "1.5m 贯穿式黑金大理石悬浮大台面",
      "满墙通体除雾镜柜 (上下 3000K 漫射洗墙)",
      "黑胡桃抗指纹哑光高定通顶衣柜",
      "主卧深灰皮质软包床头墙 + 双侧氛围吊灯"
    ],
    focalPoints: ["1.5m 卫浴大台面", "满墙除雾镜柜", "黑胡桃木饰面", "劳伦黑金中岛"],
    mepHighlights: ["镜柜隐藏防溅插座", "20A热水器专线", "暗装瀑布龙头", "低位感应地脚灯"],
    palette: [
      { name: "黑胡桃木", hex: "#1e293b" },
      { name: "劳伦黑金", hex: "#0f172a" },
      { name: "2700K琥珀光", hex: "#d97706" },
      { name: "枪灰色金属", hex: "#475569" }
    ]
  },
  {
    id: "scheme-warm-japandi",
    title: "温暖治愈原木风 2D 水电管线图",
    subtitle: "白橡木质感与全屋 Aqara 智能挂载",
    category: "温馨治愈",
    tag: "居家高舒适",
    themeStyleId: "warm-japandi",
    primaryColor: "#059669",
    accentColor: "#10b981",
    bgFill: "#f0fdf4",
    description: "温润天然白橡木与米白可丽耐营造治愈归家感。全屋水电与 Aqara 智能点位标准挂载：玄关 D200 人脸门锁、卫浴 IP44 隐藏插座、生活阳台扫拖机器人自动上下水管路。",
    specs: [
      "玄关 Aqara D200 3D人脸锁 (门厚 50mm)",
      "卫浴 1.5m 镜柜内隐藏防溅插座 (IP44)",
      "生活阳台扫拖机专用给排水管与防溢自切阀",
      "主卧与阳台 220mm 顶面双轨智能窗帘盒"
    ],
    focalPoints: ["D200 人脸门锁", "自动上下水基站", "C3 双轨静音帘", "温润白橡木柜"],
    mepHighlights: ["洗衣机上下水点", "扫拖机自动排污", "双控无边框开关", "厨下RO净水电源"],
    palette: [
      { name: "天然白橡木", hex: "#d4a373" },
      { name: "暖白可丽耐", hex: "#fef3c7" },
      { name: "治愈柔绿", hex: "#059669" },
      { name: "素雅米灰", hex: "#e2e8f0" }
    ]
  },
  {
    id: "scheme-industrial-cyber",
    title: "硬核工业未来感 2D 微气候日照图",
    subtitle: "SSE 165° 黄金日照与季风微气候推演",
    category: "硬核工业",
    tag: "气候分析",
    themeStyleId: "industrial-loft",
    primaryColor: "#0891b2",
    accentColor: "#06b6d4",
    bgFill: "#ecfeff",
    description: "拉丝不锈钢、清水混凝土与赛博青光效。24F 高层南偏东 SSE 165° 黄金朝向，晨光柔和穿透景观阳台漫射至中岛，全天零西晒，西南季风贯穿北向生活阳台形成自然空气对流。",
    specs: [
      "南向景观阳台 SSE 165° (晨光 08:00 角度 165°)",
      "正午 12:00 高角日照 (68.2° 绝无西晒直射)",
      "西南季风对流 (阳台至北侧生活阳台微风循环)",
      "外机位集中于北侧百叶平台 (隔绝振动噪音)"
    ],
    focalPoints: ["SSE 165° 采光面", "北侧 Yard 散热百叶", "24F 城市天际视野", "拉丝金属岛台"],
    mepHighlights: ["阳台防水动力点", "3组外机独立回路", "微气候气象雷达", "全彩智能泛光"],
    palette: [
      { name: "拉丝不锈钢", hex: "#64748b" },
      { name: "赛博青", hex: "#06b6d4" },
      { name: "日照暖金", hex: "#f59e0b" },
      { name: "清水混凝土", hex: "#334155" }
    ]
  }
];

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  selectedStyleId,
  setSelectedStyleId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeModalScheme, setActiveModalScheme] = useState<BlueprintScheme | null>(null);

  const filteredSchemes = BLUEPRINT_SCHEMES.filter(
    (s) => activeCategory === "all" || s.category === activeCategory
  );

  return (
    <div className="space-y-8">
      {/* Header & Category Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              2D / 3D ARCHITECTURAL BLUEPRINT MATRIX
            </span>
            <span className="text-xs text-slate-500 font-semibold">Paragon Gateway Type B · 60.22 ㎡ (648 sq ft)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            全屋空间渲染画廊与 2D 户型设计方案参考
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            严格基于 <strong>右侧公区 (3.8m 宽) + 左侧私区 (3.1m 宽)</strong> 真实拓扑结构，提供 5 套深度推演的 2D 建筑标尺图、流线图、奢雅光影图、Aqara 智能水电分布图与微气候日照图
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl text-xs">
          {[
            { id: "all", label: "全部 5 套方案" },
            { id: "物理拓扑", label: "📐 基准标尺" },
            { id: "极客科技", label: "💻 极客流线" },
            { id: "奢雅暗调", label: "✨ 意式奢雅" },
            { id: "温馨治愈", label: "🌿 智能水电" },
            { id: "硬核工业", label: "☀️ 微气候日照" }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                activeCategory === cat.id
                  ? "bg-slate-900 text-white shadow-xs font-semibold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Curated 2D Blueprint & Moodboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => {
          const isSelected = selectedStyleId === scheme.themeStyleId;

          return (
            <div
              key={scheme.id}
              onClick={() => setActiveModalScheme(scheme)}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              {/* 1. 2D Floor Plan Blueprint Vector Preview Header (Aspect 16:9) */}
              <div className="aspect-[16/10] bg-slate-50 relative overflow-hidden border-b border-slate-200 p-3 flex flex-col justify-between">
                {/* SVG 2D Floorplan Blueprint Drawing */}
                <div className="absolute inset-0 p-3 flex items-center justify-center pointer-events-none">
                  <svg
                    viewBox="0 0 690 972.5"
                    className="w-full h-full max-h-[190px] drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                  >
                    {/* Floor Slab Base */}
                    <rect x="0" y="0" width="690" height="972.5" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="4" rx="16" />

                    {/* Subtle 600mm Floor Tile Grid */}
                    <pattern id={`grid-${scheme.id}`} width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    </pattern>
                    <rect x="0" y="0" width="690" height="972.5" fill={`url(#grid-${scheme.id})`} />

                    {/* Left Private Zone (3.1m width / 310px, X: 0 to 310) */}
                    {/* Yard */}
                    <rect x="12" y="12" width="298" height="160" fill={scheme.bgFill} stroke="#94a3b8" strokeWidth="3" rx="8" />
                    <text x="160" y="100" fill="#475569" fontSize="28" fontWeight="bold" textAnchor="middle">生活阳台 YARD</text>

                    {/* Study (Geek Workstation) */}
                    <rect x="12" y="180" width="298" height="170" fill={scheme.bgFill} stroke={scheme.primaryColor} strokeWidth="3" rx="8" />
                    <text x="160" y="275" fill={scheme.primaryColor} fontSize="28" fontWeight="bold" textAnchor="middle">极客工位 STUDY</text>

                    {/* Bathroom */}
                    <rect x="12" y="360" width="298" height="240" fill={scheme.bgFill} stroke="#94a3b8" strokeWidth="3" rx="8" />
                    <text x="160" y="490" fill="#475569" fontSize="28" fontWeight="bold" textAnchor="middle">独立卫浴 BATH</text>

                    {/* Master Bedroom */}
                    <rect x="12" y="610" width="298" height="350" fill={scheme.bgFill} stroke={scheme.primaryColor} strokeWidth="3" rx="8" />
                    <text x="160" y="800" fill={scheme.primaryColor} fontSize="30" fontWeight="bold" textAnchor="middle">主卧深睡 BEDROOM</text>

                    {/* Longitudinal Main Spine Wall at X = 310px */}
                    <line x1="310" y1="12" x2="310" y2="960" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

                    {/* Right Public Zone (3.8m width / 380px, X: 310 to 690) */}
                    {/* Foyer */}
                    <rect x="320" y="12" width="358" height="150" fill={scheme.bgFill} stroke="#94a3b8" strokeWidth="3" rx="8" />
                    <text x="500" y="95" fill="#475569" fontSize="28" fontWeight="bold" textAnchor="middle">入户玄关 ENTR</text>

                    {/* Kitchen */}
                    <rect x="320" y="170" width="358" height="150" fill={scheme.bgFill} stroke="#94a3b8" strokeWidth="3" rx="8" />
                    <text x="500" y="255" fill="#475569" fontSize="28" fontWeight="bold" textAnchor="middle">开放厨房 KITCHEN</text>

                    {/* Dining Island */}
                    <rect x="320" y="330" width="358" height="180" fill={scheme.bgFill} stroke="#94a3b8" strokeWidth="3" rx="8" />
                    <text x="500" y="430" fill="#475569" fontSize="28" fontWeight="bold" textAnchor="middle">中岛吧台 DINING</text>

                    {/* Living Room */}
                    <rect x="320" y="520" width="358" height="300" fill={scheme.bgFill} stroke={scheme.primaryColor} strokeWidth="3" rx="8" />
                    <text x="500" y="680" fill={scheme.primaryColor} fontSize="30" fontWeight="bold" textAnchor="middle">客厅影音 LIVING</text>

                    {/* Balcony */}
                    <rect x="320" y="830" width="358" height="130" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="3" rx="8" />
                    <text x="500" y="905" fill="#0369a1" fontSize="26" fontWeight="bold" textAnchor="middle">南向阳台 BALCONY (SSE 165°)</text>

                    {/* Active Accent Highlights */}
                    <circle cx="500" cy="680" r="14" fill={scheme.accentColor} />
                    <circle cx="160" cy="275" r="14" fill={scheme.accentColor} />
                  </svg>
                </div>

                {/* Top Overlay Badges */}
                <div className="relative z-10 flex items-center justify-between">
                  <span className="bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span>{scheme.category}</span>
                  </span>
                  <span
                    style={{ backgroundColor: scheme.primaryColor }}
                    className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full shadow-2xs font-mono"
                  >
                    {scheme.tag}
                  </span>
                </div>

                {/* Bottom Overlay Hint */}
                <div className="relative z-10 flex items-center justify-between text-[10px] text-slate-700 font-semibold bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs">
                  <span>6.9m × 9.725m 标准 1:1.41</span>
                  <div className="flex items-center space-x-1 text-blue-600">
                    <span>展开大图</span>
                    <Maximize2 className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* 2. High-Contrast Card Body (Dark Text on Clean White) */}
              <div className="p-5 bg-white space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold text-blue-600 tracking-wider uppercase">
                      2D BLUEPRINT REF
                    </span>
                    <div className="flex items-center space-x-1">
                      {scheme.palette.map((c, i) => (
                        <span
                          key={i}
                          title={c.name}
                          style={{ backgroundColor: c.hex }}
                          className="w-3 h-3 rounded-full border border-slate-300 shadow-2xs inline-block"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Title & Subtitle in High-Contrast Slate-900 & Slate-700 */}
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                    {scheme.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {scheme.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2.5 line-clamp-3">
                    {scheme.description}
                  </p>
                </div>

                {/* Key Dimensions Specs */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-700">
                    {scheme.specs.slice(0, 4).map((spec, i) => (
                      <div key={i} className="flex items-center space-x-1 truncate bg-slate-50 px-2 py-1 rounded-lg border border-slate-200/70 font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="truncate">{spec}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStyleId(scheme.themeStyleId);
                    }}
                    className={`w-full mt-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white shadow-xs font-semibold"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {isSelected ? "✓ 当前 3D 关联风格" : "切换为此设计模式"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Interactive Deep-Dive Modal */}
      {activeModalScheme && (
        <div
          onClick={() => setActiveModalScheme(null)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-4xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto"
          >
            {/* Modal Header */}
            <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                    2D ARCHITECTURAL SPECIFICATION
                  </span>
                  <span className="text-xs font-bold text-slate-500">{activeModalScheme.category}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mt-1">
                  {activeModalScheme.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalScheme(null)}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Detailed 2D Blueprint Graphic View */}
              <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex items-center justify-center">
                <svg viewBox="0 0 690 972.5" className="w-full max-w-[420px] max-h-[380px] drop-shadow-md">
                  <rect x="0" y="0" width="690" height="972.5" fill="#ede8df" stroke="#334155" strokeWidth="6" rx="16" />

                  {/* Left Private Zone (3.1m width / 310px) */}
                  <rect x="12" y="12" width="298" height="160" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" rx="8" />
                  <text x="160" y="70" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">生活阳台 YARD</text>
                  <text x="160" y="105" fill="#64748b" fontSize="20" textAnchor="middle">3.1m × 1.6m · 洗烘扫拖</text>

                  <rect x="12" y="180" width="298" height="170" fill="#f8fafc" stroke={activeModalScheme.primaryColor} strokeWidth="4" rx="8" />
                  <text x="160" y="245" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">极客工位 STUDY</text>
                  <text x="160" y="280" fill={activeModalScheme.primaryColor} fontSize="20" fontWeight="bold" textAnchor="middle">3.1m × 1.7m · 2.0m 升降桌</text>

                  <rect x="12" y="360" width="298" height="240" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" rx="8" />
                  <text x="160" y="460" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">独立卫浴 BATH</text>
                  <text x="160" y="495" fill="#64748b" fontSize="20" textAnchor="middle">3.1m × 2.5m · 1.5m 贯穿大台面</text>

                  <rect x="12" y="610" width="298" height="350" fill="#f8fafc" stroke={activeModalScheme.primaryColor} strokeWidth="4" rx="8" />
                  <text x="160" y="760" fill="#1e293b" fontSize="28" fontWeight="bold" textAnchor="middle">主卧深睡 BEDROOM</text>
                  <text x="160" y="795" fill={activeModalScheme.primaryColor} fontSize="20" fontWeight="bold" textAnchor="middle">3.1m × 3.8m · 1.8m 大床</text>

                  {/* Main Spine Wall at X = 310px */}
                  <line x1="310" y1="12" x2="310" y2="960" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

                  {/* Right Public Zone (3.8m width / 380px) */}
                  <rect x="320" y="12" width="358" height="150" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" rx="8" />
                  <text x="500" y="70" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">入户玄关 ENTRANCE</text>
                  <text x="500" y="105" fill="#64748b" fontSize="20" textAnchor="middle">3.8m × 1.5m · D200 门锁</text>

                  <rect x="320" y="170" width="358" height="150" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" rx="8" />
                  <text x="500" y="235" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">开放厨房 KITCHEN</text>
                  <text x="500" y="270" fill="#64748b" fontSize="20" textAnchor="middle">3.8m × 1.5m · 20A 电磁灶</text>

                  <rect x="320" y="330" width="358" height="180" fill="#f8fafc" stroke="#94a3b8" strokeWidth="3" rx="8" />
                  <text x="500" y="405" fill="#1e293b" fontSize="26" fontWeight="bold" textAnchor="middle">中岛吧台 DINING</text>
                  <text x="500" y="440" fill="#64748b" fontSize="20" textAnchor="middle">3.8m × 1.8m · 弹出轨道插座</text>

                  <rect x="320" y="520" width="358" height="300" fill="#f8fafc" stroke={activeModalScheme.primaryColor} strokeWidth="4" rx="8" />
                  <text x="500" y="650" fill="#1e293b" fontSize="28" fontWeight="bold" textAnchor="middle">客厅极简影音 LIVING</text>
                  <text x="500" y="685" fill={activeModalScheme.primaryColor} fontSize="20" fontWeight="bold" textAnchor="middle">3.8m × 3.4m · 85寸巨幕</text>

                  <rect x="320" y="830" width="358" height="130" fill="#e0f2fe" stroke="#0284c7" strokeWidth="3" rx="8" />
                  <text x="500" y="885" fill="#0369a1" fontSize="26" fontWeight="bold" textAnchor="middle">南向景观阳台 BALCONY</text>
                  <text x="500" y="915" fill="#0284c7" fontSize="20" fontWeight="bold" textAnchor="middle">3.8m × 1.5m · SSE 165° 黄金朝向</text>
                </svg>
              </div>

              {/* Specs & Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    空间布局与工程落地规范 (Engineering Specs)
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-800 font-medium">
                    {activeModalScheme.specs.map((spec, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    机电与智能挂载点位 (MEP & Smart Points)
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-800 font-medium">
                    {activeModalScheme.mepHighlights.map((mep, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <Zap className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                        <span>{mep}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Material Palette Breakdown */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  本案采用材质配色情绪板 (Color & Material Palette)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {activeModalScheme.palette.map((p, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-2.5">
                      <div style={{ backgroundColor: p.hex }} className="w-6 h-6 rounded-xl border border-slate-300 shadow-2xs flex-shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-slate-900">{p.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{p.hex}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveModalScheme(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setSelectedStyleId(activeModalScheme.themeStyleId);
                    setActiveModalScheme(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                >
                  在 3D 视口中载入此设计
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
