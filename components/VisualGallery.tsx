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
  Copy, 
  ChevronRight,
  Sun, 
  Moon, 
  Zap, 
  Camera, 
  Search, 
  RotateCw, 
  Building2, 
  SlidersHorizontal,
  Lightbulb,
  Cpu,
  CheckCircle2
} from "lucide-react";
import { STYLES_DATA, StyleData, PROPERTY_DATA } from "@/data/projectData";

interface VisualGalleryProps {
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
}

interface MultiViewRoom {
  id: string;
  roomName: string;
  enName: string;
  category: "living" | "bedroom" | "bathroom" | "workstation" | "balcony";
  styleTheme: string;
  themeStyleId: string;
  accentColor: string;
  title: string;
  subtitle: string;
  description: string;
  materials: { name: string; spec: string }[];
  lighting: string;
  focalPoints: string[];
  views: {
    key: "A" | "B" | "C";
    label: string;
    sublabel: string;
    imageUrl: string;
    prompt: string;
    highlight: string;
  }[];
}

const MULTI_VIEW_ROOMS: MultiViewRoom[] = [
  {
    id: "room-living",
    roomName: "客厅极简影音与悬浮中岛",
    enName: "Living & Sintered Stone Island",
    category: "living",
    styleTheme: "现代极简科技风",
    themeStyleId: "modern-minimalist",
    accentColor: "#2563eb",
    title: "1.8m 悬浮岩板中岛与 85 吋巨幕通透公区",
    subtitle: "太空灰微水泥通铺 · 晨光漫射 · 极简无界动线",
    description: "入户玄关与客厅全通透无界相连，1.8m 太空灰岩板中岛延伸为轻食吧台，85寸超薄电视悬浮贴墙，南向景观阳台将晨光均匀漫射于微水泥地面，通透纯粹。",
    materials: [
      { name: "中岛台面", spec: "进口太空灰耐污岩板 (厚度 12mm)" },
      { name: "公区地面", spec: "纳米耐污微水泥 (无缝整体通铺)" },
      { name: "电视背景", spec: "哑光超白肤感护墙板 (内嵌隐形灯带)" },
      { name: "极简沙发", spec: "科技布浅灰直排沙发 (离地悬空 180mm)" }
    ],
    lighting: "3500K 间接洗天花漫射灯槽 + 中岛上方 3000K 防眩聚焦射灯",
    focalPoints: ["1.8m 悬浮中岛", "85寸壁画电视", "无缝微水泥通铺", "见光不见灯吊顶"],
    views: [
      {
        key: "A",
        label: "视角 A: 全景主视角",
        sublabel: "入户俯瞰中岛与客厅巨幕",
        imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
        highlight: "大开间纵深视野，中岛连接客厅沙发，晨光透过南向全景落地窗洒入室内",
        prompt: "Interior architectural photo of a modern minimalist 60 sqm apartment living room, 1.8m floating grey sintered stone kitchen island connected to living zone, 85-inch ultra-thin TV mounted flush on white matte feature wall, seamless micro-cement floor, large floor-to-ceiling balcony window with warm morning sunlight streaming in, soft ambient strip lighting, Hasselblad medium format, ultra-detailed 8k --ar 16:9 --style raw"
      },
      {
        key: "B",
        label: "视角 B: 材质光影特写",
        sublabel: "岩板接缝与悬浮底座微光",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
        highlight: "1.8m 岩板细腻细砂肌理，悬浮底座内嵌 3000K 暖光漫射，触感温润抗指纹",
        prompt: "Macro interior shot of a minimalist 1.8m matte grey sintered stone kitchen island, under-cabinet warm 3000K LED lighting strip casting soft glow on micro-cement floor, subtle marble grain texture details, luxury architectural design, depth of field, architectural digest style, 8k resolution --ar 16:9 --style raw"
      },
      {
        key: "C",
        label: "视角 C: 阳台回看视角",
        sublabel: "由南向阳台回望室内纵深",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
        highlight: "站在阳台推拉门处望向厨房与玄关，开阔通畅的 1.2m 走道动线一览无遗",
        prompt: "Reverse angle interior photo looking from the sunlit balcony into a sleek modern minimalist open-plan apartment, floating kitchen island, living room media unit, warm oak accents, ultra-clean wide walkway, diffused architectural lighting, highly detailed photorealistic render --ar 16:9 --style raw"
      }
    ]
  },
  {
    id: "room-bedroom",
    roomName: "主卧深睡空间",
    enName: "Master Bedroom Suite",
    category: "bedroom",
    styleTheme: "纯粹极简深睡",
    themeStyleId: "modern-minimalist",
    accentColor: "#3b82f6",
    title: "1.8m 悬浮科技布大床与纯白隐形衣柜",
    subtitle: "2700K 暖光洗墙 · 悬浮起夜地脚灯 · 电动全遮光帘",
    description: "专属私密深睡区，1.8m 悬浮大床床底内嵌温和感应地脚灯，西侧为整面 600mm 深度纯白哑光无把手衣柜，南向大窗配置电动双轨静音窗帘，打造极度松弛的沉浸深睡体验。",
    materials: [
      { name: "悬浮大床", spec: "1800×2000mm 科技布静音悬浮床架" },
      { name: "定制衣柜", spec: "整墙超哑抗指纹 PET 肤感板 (反弹器开门)" },
      { name: "床头背景", spec: "浅灰哑光艺术涂料 + 琥珀洗墙灯带" },
      { name: "智能窗帘", spec: "Aqara C3 双轨超静音电动开合帘" }
    ],
    lighting: "2700K 床头斜角防眩洗墙光 + 床底感应起夜微光 (0.5W/m)",
    focalPoints: ["悬浮床底夜灯", "整墙隐形衣柜", "无边框微水泥背景", "全遮光睡眠舱"],
    views: [
      {
        key: "A",
        label: "视角 A: 全景主视角",
        sublabel: "正对 1.8m 悬浮大床与背景墙",
        imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
        highlight: "悬浮床体呈现脱离地面的轻盈感，床头背景墙上方 2700K 暖光柔和洒下",
        prompt: "Photorealistic modern minimalist master bedroom interior, 1.8m floating platform bed with light grey tech fabric upholstery, micro-cement feature wall, concealed 2700K warm LED wall-washer strip light above headboard, floor-to-ceiling floor tiles, architectural interior photography, calm serene ambiance, 8k --ar 16:9 --style raw"
      },
      {
        key: "B",
        label: "视角 B: 材质光影特写",
        sublabel: "床头软包与床底悬浮微光",
        imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
        highlight: "亲肤科技布细腻缝线，床底内缩 150mm 防踢脚结构与微光洗地效果",
        prompt: "Close up interior detail of a floating designer bed in modern bedroom, warm 2700K toe-kick ambient LED light glowing beneath the bed frame, plush linen bedding, matte wall texture, cozy luxury hotel feel, shallow depth of field, 8k resolution --ar 16:9 --style raw"
      },
      {
        key: "C",
        label: "视角 C: 侧角收纳视角",
        sublabel: "门洞望向大床与满墙衣柜",
        imageUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
        highlight: "西墙整面纯白哑光无把手衣柜，预留 1.1m 宽敞更衣回旋走道",
        prompt: "Side angle interior photo of a minimalist modern bedroom, showing full-wall matte white seamless floor-to-ceiling wardrobe with integrated vertical recessed handles, floating king bed on right, warm morning side lighting, clean architectural lines, 8k --ar 16:9 --style raw"
      }
    ]
  },
  {
    id: "room-bathroom",
    roomName: "五星级独立卫浴室",
    enName: "Hotel Suite Bathroom",
    category: "bathroom",
    styleTheme: "意式暗调奢华",
    themeStyleId: "italian-luxury",
    accentColor: "#d97706",
    title: "1.5m 贯穿式黑金大平台与满墙除雾镜柜",
    subtitle: "劳伦黑金岩板 · 暗装枪灰瀑布龙头 · 2700K 琥珀洗墙光",
    description: "打破传统紧凑小卫浴格局，定制整面 1.5m 贯穿式大理石大台面横向延伸至马桶上方，上方配备满墙触控智能除雾大镜柜，搭配暗装枪灰入墙五金与干湿分离超白长虹玻璃门。",
    materials: [
      { name: "贯穿台面", spec: "1500mm 劳伦黑金哑光岩板 (延伸至马桶上方)" },
      { name: "满墙镜柜", spec: "通宽 LED 智能恒温除雾镜门 (双向 45° 侧发光)" },
      { name: "五金龙头", spec: "暗装枪灰拉丝瀑布入墙式冷热龙头" },
      { name: "淋浴隔断", spec: "超白极窄长虹防爆钢化玻璃推拉门" }
    ],
    lighting: "Ra>98 高显色无影美妆面光 + 镜柜上下 2700K 琥珀洗墙灯带",
    focalPoints: ["1.5m 贯穿大台面", "满墙超薄除雾镜柜", "暗装枪灰入墙龙头", "一体成型无缝岩板盆"],
    views: [
      {
        key: "A",
        label: "视角 A: 全景主视角",
        sublabel: "正对 1.5m 贯穿大台面与满墙镜柜",
        imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
        highlight: "1.5m 整体大台面气势恢宏，满墙镜柜上下透出奢华琥珀光，完全消除台面杂乱",
        prompt: "Luxury modern Italian style bathroom interior design, 1.5m continuous black marble countertop seamlessly extending over wall-hung toilet, full-wall frameless LED fogless mirror cabinet, gunmetal concealed waterfall faucet, dark walnut wood wall panels, 2700K amber wash light, high-end 5-star hotel suite style, photorealistic 8k --ar 16:9 --style raw"
      },
      {
        key: "B",
        label: "视角 B: 材质特写",
        sublabel: "枪灰入墙龙头与岩板水波纹",
        imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
        highlight: "暗装入墙龙头金属拉丝质感，流水轻柔抚过黑金大理石一体盆",
        prompt: "Macro interior photography of a gunmetal wall-mounted waterfall faucet over a Laurent black gold marble floating basin, ambient amber 2700K LED lighting reflecting on polished dark stone, water droplets, ultra-detailed texture, luxury bathroom craftsmanship, 8k --ar 16:9 --style raw"
      },
      {
        key: "C",
        label: "视角 C: 淋浴区回看",
        sublabel: "透过超白玻回看干区洗漱台",
        imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
        highlight: "长虹玻璃透光不透影，干湿分区清晰，壁挂马桶上方大平台置物从容",
        prompt: "Interior perspective looking from the frameless glass shower enclosure towards the luxury dark vanity and wall-hung toilet, glowing mirror cabinet, warm amber mood lighting, clean dry-wet separation, hotel suite bathroom rendering, 8k resolution --ar 16:9 --style raw"
      }
    ]
  },
  {
    id: "room-workstation",
    roomName: "极客工作站 (1+1房)",
    enName: "Geek Workstation & Battlestation",
    category: "workstation",
    styleTheme: "现代极简极客风",
    themeStyleId: "modern-minimalist",
    accentColor: "#0284c7",
    title: "2.0m 双电机升降桌与双 32 吋 4K 悬浮屏",
    subtitle: "实木木作大板 · 隐藏式走线槽 · 行李箱直推高柜",
    description: "独立静音研发区，2.0m×0.8m 加深升降大板桌配置双 32 吋屏幕机械臂悬浮，桌面 8 组防涌浪插座与千兆网口，侧面 600mm 深度大收纳柜下层直通，可直接推入 28 吋大行李箱。",
    materials: [
      { name: "升降大板", spec: "2000×800mm 天然白橡木实木直拼大板 (厚 35mm)" },
      { name: "升降系统", spec: "双电机三节正装静音升降桌腿 (载重 120kg)" },
      { name: "大件收纳柜", spec: "600mm 深度通顶柜 (下层无底板推行李箱)" },
      { name: "人体工学椅", spec: "Herman Miller 顶级人体工学网布椅" }
    ],
    lighting: "4000K 护眼专注桌面照明 + 赛博冷蓝背景环境呼吸光 (屏幕挂灯)",
    focalPoints: ["2.0m 升降大板桌", "双屏悬浮机械臂", "行李箱直推高柜", "抗涌浪隐藏走线槽"],
    views: [
      {
        key: "A",
        label: "视角 A: 全景主视角",
        sublabel: "正对 2.0m 极客双屏工位全貌",
        imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
        highlight: "2.0m 宽阔大板桌面，双 32 吋屏幕悬浮空中，桌面零杂线，科技感十足",
        prompt: "High-end minimalist geek home office battlestation, 2.0m solid white oak motorized standing desk, dual 32-inch 4K monitors on floating heavy-duty monitor arms, premium mechanical keyboard, Herman Miller ergonomic chair, clean cable management, ambient cyber blue backlighting, soft natural daylight from side, 8k --ar 16:9 --style raw"
      },
      {
        key: "B",
        label: "视角 B: 材质特写",
        sublabel: "实木桌面倒角与隐藏走线槽",
        imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
        highlight: "天然橡木温润木纹，圆弧倒角防压手肘，铝合金嵌入式毛刷走线盒细节",
        prompt: "Macro photography of a luxury solid white oak standing desk surface, aluminum wire grommet box with clean woven cables, high-end mechanical keyboard with custom keycaps, studio monitor speakers, matte finish wood grain, depth of field, 8k --ar 16:9 --style raw"
      },
      {
        key: "C",
        label: "视角 C: 侧角收纳视角",
        sublabel: "门洞望向工位与行李箱高柜",
        imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
        highlight: "侧面定制 600mm 深度通顶储物柜，底部直通推入 28 吋大行李箱，整洁利落",
        prompt: "Side angle shot of a modern home workstation room in apartment, tall seamless storage cabinets on side with lower open luggage bay, motorized standing desk, clean acoustic wall felt paneling, soft architectural lighting, organized professional developer workspace, 8k --ar 16:9 --style raw"
      }
    ]
  },
  {
    id: "room-balcony",
    roomName: "南向景观阳台 (SSE 165°)",
    enName: "Landscape Sky Balcony",
    category: "balcony",
    styleTheme: "自然治愈微气候",
    themeStyleId: "warm-japandi",
    accentColor: "#059669",
    title: "24F 高空城市天际线与晨曦休闲吧台",
    subtitle: "SSE 165° 晨光斜照 · 零西晒 · 西南季风微气候对流",
    description: "24楼高空南偏东 165° 绝佳朝向，彻底避开正西西晒暴晒。清晨享受柔和日光沐浴，配置高空休闲吧台椅、户外防腐木地板与绿植角，推拉门 10mm 极窄平嵌地轨与客厅无缝相连。",
    materials: [
      { name: "阳台地面", spec: "户外防滑防水木塑地板 (模块化快拆排污)" },
      { name: "高空吧台", spec: "耐候铝合金烤漆高脚吧台 + 防水吧椅" },
      { name: "推拉门轨", spec: "10mm 极窄无障碍平嵌地轨 (步入无绊脚)" },
      { name: "微气候", spec: "太阳能微光感应射灯 + 温湿度环境传感器" }
    ],
    lighting: "晨曦自然漫射光 (08:00 方位 165°/高度 28.5°) + 夜间防水洗墙射灯",
    focalPoints: ["24F 城市天际视野", "SSE 165° 黄金朝向", "10mm 极窄平嵌移门", "户外防腐木地台"],
    views: [
      {
        key: "A",
        label: "视角 A: 全景主视角",
        sublabel: "24F 高空俯瞰新山天际线",
        imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
        highlight: "24楼开阔视野，清晨柔和阳光斜照在阳台吧台上，远眺新山市区与低密洋房",
        prompt: "High-floor luxury apartment balcony interior photography, 24th floor overlooking sunny city skyline, sleek minimalist outdoor bar counter with modern bar stools, composite wood decking, lush potted plants, gentle morning sunlight coming from south-south-east, architectural digest, ultra-sharp 8k --ar 16:9 --style raw"
      },
      {
        key: "B",
        label: "视角 B: 材质特写",
        sublabel: "户外木塑地台与绿植晨光",
        imageUrl: "https://images.unsplash.com/photo-1533779283484-8da797e0d430?auto=format&fit=crop&w=1200&q=80",
        highlight: "木塑地台细腻防滑纹理，晨光在咖啡杯与绿植叶片上留下金色光斑",
        prompt: "Close up detail on modern balcony deck, warm morning sunlight hitting a ceramic coffee cup on black metal railing bar table, potted monstera plant, wood texture, golden hour morning light reflection, high aesthetic, 8k --ar 16:9 --style raw"
      },
      {
        key: "C",
        label: "视角 C: 室内联通视角",
        sublabel: "推拉门开启连通客厅公区",
        imageUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
        highlight: "超窄边框移门完全收起，室内外地面齐平延伸，季风自然对流穿透公区",
        prompt: "Perspective shot from balcony looking seamlessly through open sliding glass doors into the modern apartment living room and kitchen island, flat flush door track, indoor-outdoor seamless flow, bright natural diffused lighting, architectural render, 8k --ar 16:9 --style raw"
      }
    ]
  }
];

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  selectedStyleId,
  setSelectedStyleId
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeViews, setActiveViews] = useState<{ [roomId: string]: "A" | "B" | "C" }>({
    "room-living": "A",
    "room-bedroom": "A",
    "room-bathroom": "A",
    "room-workstation": "A",
    "room-balcony": "A"
  });

  const [activeModalRoom, setActiveModalRoom] = useState<{
    room: MultiViewRoom;
    activeViewKey: "A" | "B" | "C";
  } | null>(null);

  const [copiedPromptKey, setCopiedPromptKey] = useState<string | null>(null);

  const handleCopyPrompt = (prompt: string, key: string) => {
    navigator.clipboard.writeText(prompt);
    setCopiedPromptKey(key);
    setTimeout(() => setCopiedPromptKey(null), 2500);
  };

  const handleViewChange = (roomId: string, viewKey: "A" | "B" | "C", e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveViews((prev) => ({ ...prev, [roomId]: viewKey }));
  };

  const filteredRooms = MULTI_VIEW_ROOMS.filter(
    (r) => activeCategory === "all" || r.category === activeCategory
  );

  return (
    <div className="space-y-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
              3-VIEW AI PHOTOREALISTIC RENDER GALLERY
            </span>
            <span className="text-xs text-slate-500 font-semibold">Paragon Gateway A-24-10 (60.22 ㎡ / Type B)</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
            <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
            全屋 3D / AI 室内效果渲染图集 (3 大视角切换)
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-3xl">
            提供 <strong>[📷 视角 A: 全景视角]</strong>、<strong>[🔍 视角 B: 材质特写]</strong> 与 <strong>[↺ 视角 C: 反向视角]</strong> 多维度沉浸预览真实木纹、岩板、枪灰五金与 2700K 洗墙光影
          </p>
        </div>

        {/* Space Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 border border-slate-200 p-1.5 rounded-2xl text-xs">
          {[
            { id: "all", label: "全部核心空间 (5大分区)" },
            { id: "living", label: "🛋️ 客厅与中岛" },
            { id: "bedroom", label: "🛏️ 主卧深睡" },
            { id: "bathroom", label: "🚿 奢华卫浴" },
            { id: "workstation", label: "💻 极客工位" },
            { id: "balcony", label: "☀️ 景观阳台" }
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

      {/* Multi-View Photorealistic Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRooms.map((room) => {
          const currentViewKey = activeViews[room.id] || "A";
          const currentView = room.views.find((v) => v.key === currentViewKey) || room.views[0];
          const isStyleSelected = selectedStyleId === room.themeStyleId;

          return (
            <div
              key={room.id}
              onClick={() => setActiveModalRoom({ room, activeViewKey: currentViewKey })}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all duration-200 cursor-pointer flex flex-col justify-between group"
            >
              {/* 1. Photorealistic Render Image Hero with Multi-View Tabs */}
              <div className="relative aspect-[16/10] bg-slate-900 overflow-hidden">
                {/* Real High-Resolution Interior Render Image */}
                <img
                  src={currentView.imageUrl}
                  alt={room.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Subtle Gradient Shadow for Top and Bottom Badges */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />

                {/* Top Floating Badges */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                  <span className="bg-white/95 backdrop-blur-md text-[10px] font-black text-slate-900 px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-blue-600" />
                    <span>{room.roomName}</span>
                  </span>
                  <span
                    style={{ backgroundColor: room.accentColor }}
                    className="text-[10px] font-bold text-white px-2.5 py-0.5 rounded-full shadow-sm font-mono"
                  >
                    {room.styleTheme}
                  </span>
                </div>

                {/* Bottom View Switcher Tabs (3 Distinct Perspective Angles) */}
                <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/20">
                    {room.views.map((v) => (
                      <button
                        key={v.key}
                        onClick={(e) => handleViewChange(room.id, v.key, e)}
                        className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center space-x-1 ${
                          currentViewKey === v.key
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-white/80 hover:text-white hover:bg-white/10"
                        }`}
                        title={v.sublabel}
                      >
                        {v.key === "A" && <Camera className="w-2.5 h-2.5" />}
                        {v.key === "B" && <Search className="w-2.5 h-2.5" />}
                        {v.key === "C" && <RotateCw className="w-2.5 h-2.5" />}
                        <span>{v.key}</span>
                      </button>
                    ))}
                  </div>

                  <span className="text-[10px] text-white/90 font-medium bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center space-x-1">
                    <span>{currentView.sublabel}</span>
                    <Maximize2 className="w-2.5 h-2.5 ml-1" />
                  </span>
                </div>
              </div>

              {/* 2. High-Contrast Dark Card Typography */}
              <div className="p-5 bg-white space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold text-blue-600 tracking-wider uppercase">
                      {room.enName}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                      {currentView.label}
                    </span>
                  </div>

                  {/* Title & Subtitle in High-Contrast Slate-900 & Slate-600 */}
                  <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {room.title}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {room.subtitle}
                  </p>

                  <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                    {currentView.highlight}
                  </p>
                </div>

                {/* Material & Lighting Highlights */}
                <div className="space-y-3 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1">
                    {room.focalPoints.map((fp, i) => (
                      <span
                        key={i}
                        className="text-[9px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/80 font-medium"
                      >
                        {fp}
                      </span>
                    ))}
                  </div>

                  {/* Fast Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveModalRoom({ room, activeViewKey: currentViewKey });
                      }}
                      className="w-full py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-all flex items-center justify-center space-x-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>查看 3 视角大图</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedStyleId(room.themeStyleId);
                      }}
                      className={`w-full py-1.5 rounded-xl text-xs font-bold transition-all ${
                        isStyleSelected
                          ? "bg-blue-600 text-white shadow-xs font-semibold"
                          : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                      }`}
                    >
                      {isStyleSelected ? "✓ 当前 3D 风格" : "应用此风格"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fullscreen Multi-View Deep-Dive Modal with Midjourney Prompt & Materials */}
      {activeModalRoom && (
        <div
          onClick={() => setActiveModalRoom(null)}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl space-y-0 max-h-[94vh] flex flex-col"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 font-mono">
                    AI MULTI-VIEW STUDIO
                  </span>
                  <span className="text-xs font-bold text-slate-500">{activeModalRoom.room.roomName}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                  {activeModalRoom.room.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveModalRoom(null)}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-6 space-y-6 overflow-y-auto flex-1">
              {/* Active Hero Image Display */}
              {(() => {
                const currentView =
                  activeModalRoom.room.views.find((v) => v.key === activeModalRoom.activeViewKey) ||
                  activeModalRoom.room.views[0];

                return (
                  <div className="space-y-3">
                    <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-2xl overflow-hidden shadow-md border border-slate-200">
                      <img
                        src={currentView.imageUrl}
                        alt={currentView.label}
                        className="w-full h-full object-cover object-center"
                      />
                      <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-md p-3 rounded-xl border border-white/20 text-white flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold flex items-center space-x-1.5">
                            <Camera className="w-3.5 h-3.5 text-blue-400" />
                            <span>{currentView.label}</span>
                            <span className="text-white/60">·</span>
                            <span className="text-white/90 font-normal">{currentView.sublabel}</span>
                          </div>
                          <div className="text-[11px] text-white/80 mt-0.5">
                            {currentView.highlight}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 3 Views Thumbnail Switcher Tabs */}
                    <div className="grid grid-cols-3 gap-3">
                      {activeModalRoom.room.views.map((view) => {
                        const isViewActive = activeModalRoom.activeViewKey === view.key;
                        return (
                          <button
                            key={view.key}
                            onClick={() =>
                              setActiveModalRoom({
                                room: activeModalRoom.room,
                                activeViewKey: view.key
                              })
                            }
                            className={`p-2 rounded-2xl border transition-all text-left flex items-center space-x-3 ${
                              isViewActive
                                ? "bg-blue-50 border-blue-600 shadow-sm ring-2 ring-blue-500/20"
                                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                            }`}
                          >
                            <img
                              src={view.imageUrl}
                              alt={view.label}
                              className="w-16 h-12 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="overflow-hidden">
                              <div className={`text-xs font-black truncate ${isViewActive ? "text-blue-900" : "text-slate-900"}`}>
                                {view.label}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {view.sublabel}
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Midjourney / Flux Prompt Box (One-Click Copy) */}
              {(() => {
                const currentView =
                  activeModalRoom.room.views.find((v) => v.key === activeModalRoom.activeViewKey) ||
                  activeModalRoom.room.views[0];

                return (
                  <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                          Midjourney v6 / Flux.1 真实渲染提示词 (Photorealistic Prompt)
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopyPrompt(currentView.prompt, currentView.key)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 transition-all shadow-sm"
                      >
                        {copiedPromptKey === currentView.key ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>已成功复制!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制 Prompt</span>
                          </>
                        )}
                      </button>
                    </div>
                    <div className="p-3 bg-black/50 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed break-words border border-slate-800">
                      {currentView.prompt}
                    </div>
                  </div>
                );
              })()}

              {/* Materials & Lighting Detailed Specs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Material Specs */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <Palette className="w-3.5 h-3.5 text-blue-600" />
                    <span>本案物理材质落地清单 (Materials Spec)</span>
                  </h4>
                  <div className="divide-y divide-slate-100 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    {activeModalRoom.room.materials.map((mat, idx) => (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <span className="font-semibold text-slate-800">{mat.name}</span>
                        <span className="text-slate-600 font-mono text-[11px]">{mat.spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lighting Strategy */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                    <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                    <span>光影与灯光氛围策略 (Lighting Strategy)</span>
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {activeModalRoom.room.lighting}
                    </p>
                    <div className="border-t border-slate-200/80 pt-2 flex items-center space-x-2 text-[11px] text-slate-500">
                      <Sun className="w-3.5 h-3.5 text-amber-500" />
                      <span>南偏东 SSE 165° 晨光斜照路径 · 全天高品质漫射无西晒</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setActiveModalRoom(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  关闭
                </button>
                <button
                  onClick={() => {
                    setSelectedStyleId(activeModalRoom.room.themeStyleId);
                    setActiveModalRoom(null);
                  }}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700"
                >
                  在 3D 视口中载入此空间风格
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
