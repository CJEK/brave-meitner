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
  CheckCircle2,
  CheckCheck
} from "lucide-react";
import { STYLES_DATA, StyleData, PROPERTY_DATA } from "@/data/projectData";

interface VisualGalleryProps {
  selectedStyleId: string;
  setSelectedStyleId: (id: string) => void;
}

interface RoomAngleView {
  key: "A" | "B" | "C";
  label: string;
  sublabel: string;
  imageUrl: string;
  highlight: string;
  prompt: string;
}

interface StyleRoomData {
  roomId: "living" | "bedroom" | "bathroom" | "workstation" | "kitchen";
  roomName: string;
  enName: string;
  sqm: number;
  physicalConstraint: string;
  title: string;
  subtitle: string;
  description: string;
  materials: { name: string; spec: string }[];
  lighting: string;
  focalPoints: string[];
  views: RoomAngleView[];
}

// 4 Global Styles × 5 Rooms × 3 Angles Photorealistic Studio Dataset (Strict 60.22 ㎡ 1+1 Physical Constraints)
const ROOM_RENDERINGS_DATABASE: { [styleId: string]: StyleRoomData[] } = {
  // 1. 现代极简科技风 (Modern Minimalist Tech)
  "modern-minimalist": [
    {
      roomId: "bathroom",
      roomName: "独立卫浴室",
      enName: "Compact Luxury Bathroom",
      sqm: 4.2,
      physicalConstraint: "4.2 ㎡ 紧凑干湿分离 · 1.8m 贯穿大台面 · 跨越壁挂马桶上方",
      title: "1.5m 贯穿式岩板大台面直接跨越马桶上方 (含检修口)",
      subtitle: "4.2 ㎡ 空间极致利用 · 满墙除雾大镜柜 · 暗装枪灰瀑布龙头",
      description: "针对 4.2 ㎡ 紧凑卫浴，定制 1.8m 劳伦白金耐污岩板台面横向贯穿，延伸至壁挂马桶上方形成连体平台（含活动检修盖板，杜绝后期维修砸砖）；搭配满墙触控智能除雾镜柜与 10mm 极窄黑框长虹玻璃淋浴隔断。",
      materials: [
        { name: "贯穿大台面", spec: "1500mm 劳伦白金岩板 (含水箱隐形可拆卸检修盖板)" },
        { name: "满墙大镜柜", spec: "通宽 LED 智能恒温除雾镜门 (双向 45° 侧发光，上下 3000K 洗墙)" },
        { name: "暗装五金", spec: "暗装枪灰拉丝瀑布入墙式冷热龙头 (防溅静音出水，精铜主体)" },
        { name: "淋浴隔断", spec: "10mm 超窄黑框超白长虹防爆钢化玻璃推拉门 (干湿严格分离)" }
      ],
      lighting: "Ra>98 高显色无影美妆面光 + 镜柜上下 3000K 纯净洗墙氛围灯带",
      focalPoints: ["1.8m 台面跨越马桶上方", "满墙超薄除雾镜柜", "暗装枪灰瀑布龙头", "10mm极窄长虹玻门"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对 1.8m 贯穿大台面跨越马桶上方",
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
          highlight: "4.2 ㎡ 紧凑卫浴极致收纳，1.8m 白色岩板台面横向无缝延伸跨越壁挂马桶上方形成连体置物台，满墙镜柜透出 3000K 纯净洗墙光",
          prompt: "Photorealistic interior design rendering of a compact 4.2 sqm modern bathroom in a 60 sqm apartment, 1.8m continuous white sintered stone floating countertop seamlessly extending directly ABOVE the wall-hung GEBERIT toilet creating a unified shelf, full-width frameless LED fogless mirror cabinet with top and bottom 3000K soft wash lighting, 10mm ultra-thin black frame reed glass shower partition on the left, concealed gunmetal waterfall faucet, realistic compact spatial proportion, architectural photography, Hasselblad --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "枪灰入墙龙头与岩板水波纹特写",
          imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
          highlight: "暗装枪灰拉丝瀑布入墙式水龙头出水细节，水流轻柔抚过一体成型大单盆，3000K 暖光映衬岩板天然肌理",
          prompt: "Macro interior photography of a concealed gunmetal wall-mounted waterfall faucet flowing water onto a matte white sintered stone basin, warm 3000K LED glow reflecting on stone texture, seamless countertop edge extending over wall-hung toilet, luxury architectural detail, 8k resolution --ar 16:9"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "干湿分离长虹玻璃反看大台面",
          imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
          highlight: "从淋浴湿区透过 10mm 超窄黑框长虹玻璃推拉门回看干区，通体发光除雾镜柜柔和漫射，干湿分离一目了然",
          prompt: "Reverse angle shot looking from inside the wet shower area through 10mm fluted reed glass door towards the compact dry vanity area, frameless illuminated mirror cabinet reflecting subtle warm light, clean minimalist aesthetic, realistic 4.2 sqm bathroom scale --ar 16:9"
        }
      ]
    },
    {
      roomId: "living",
      roomName: "客厅极简影音区",
      enName: "Living & Media Zone",
      sqm: 15.2,
      physicalConstraint: "15.2 ㎡ 公区 · 净开间 3.6m · 2.5m~2.7m 黄金视距",
      title: "85 吋超薄贴墙巨幕与 2.5m 黄金观影视距",
      subtitle: "15.2 ㎡ 紧凑公区 · 2.6m 直排沙发 · 南向阳台晨光漫射",
      description: "85寸壁画电视超薄贴平东墙，搭配 2.6m 直排科技布浅灰沙发，精准形成 2.5m 黄金观影视距（不仰头、视界角 40°）。公区通铺太空灰零吸水岩板，南向景观阳台引入晨曦漫射光。",
      materials: [
        { name: "电视安装", spec: "85吋超薄壁画电视贴平东墙 (厚度≤100mm，中心高 1050mm)" },
        { name: "公区地面", spec: "太空灰纳米耐污零吸水岩板 (全屋整体无缝通铺，厚度 3mm)" },
        { name: "极简沙发", spec: "2600mm 浅灰直排科技布沙发 (深度 900mm，离地悬空 180mm)" },
        { name: "通畅动线", spec: "沙发与中岛间保留 1100mm 宽敞走道，直通南向景观阳台" }
      ],
      lighting: "3500K 隐藏反光槽间接洗天花 + 沙发上方 3000K 深防眩聚焦射灯 (UGR<10)",
      focalPoints: ["85寸贴平东墙巨幕", "2.5m 黄金观影视距", "1.1m 通畅无障碍过道", "零吸水岩板无缝通铺"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "入户俯瞰 15.2 ㎡ 客厅全貌与 85 吋巨幕",
          imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
          highlight: "真实 60.22 ㎡ 户型比例，85 吋电视贴墙安装，沙发至屏幕 2.5m 黄金视距，南向落地窗洒入清晨阳光",
          prompt: "Photorealistic interior render of a 15.2 sqm minimalist living room, 3.8m wall-to-wall distance with a comfortable 2.5m viewing distance, 85-inch flat screen TV flush-mounted on micro-cement feature wall, low-profile straight sofa, adjacent 1.8m floating kitchen island bar on the left, full-height glass sliding door to south balcony on the right with morning sunlight, architectural digest style --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "1.8m 哑光灰岩板中岛与客厅地面微光",
          imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          highlight: "1.8m 哑光灰岩板中岛台与客厅交接处，悬浮地台内嵌 3000K 暖光漫射，触感温润无指纹",
          prompt: "Close-up of a 1.8m matte grey sintered stone kitchen island connecting to living room area, linear ambient LED strip lighting underneath, micro-cement floor texture, ultra-clean line design --ar 16:9"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "由南向阳台回望客厅与中岛动线",
          imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
          highlight: "站在阳台移门处望向公区，开阔通畅的 900mm~1100mm 走道动线与 1.8m 中岛吧台一览无遗",
          prompt: "Interior photo taken from the south balcony door looking back into the open-plan living and dining space of a 60 sqm apartment, clear 900mm walkway, floating media console, natural morning lighting streaming in --ar 16:9"
        }
      ]
    },
    {
      roomId: "bedroom",
      roomName: "主卧深睡区",
      enName: "Master Bedroom Suite",
      sqm: 11.0,
      physicalConstraint: "11.0 ㎡ 私密主卧 · 1.8m 大床 · 0.6m 舒适过道",
      title: "1.8m 悬浮科技布大床与整墙 600mm 隐形衣柜",
      subtitle: "11.0 ㎡ 舒适深睡舱 · 0.6m 更衣动线 · 2700K 暖光洗墙",
      description: "11.0 ㎡ 私密深睡区，1.8m 悬浮大床床底内嵌低照度感应夜灯，床侧保留 600mm 舒适通行与更衣动线。西侧整面 600mm 深哑光无把手衣柜，南向大窗配置电动双轨静音全遮光帘。",
      materials: [
        { name: "悬浮大床", spec: "1800×2000mm 科技布静音悬浮床架 (床底内缩 150mm 防碰脚)" },
        { name: "整墙衣柜", spec: "整墙超哑抗指纹 PET 肤感门板 (顶天立地反弹器开门，进深 600mm)" },
        { name: "床头背景", spec: "浅灰哑光艺术涂料 + 2700K 琥珀洗墙灯带 (Ra>95)" },
        { name: "智能窗帘", spec: "Aqara C3 双轨超静音电动开合帘 (220mm 顶面双轨窗帘盒)" }
      ],
      lighting: "2700K 床头斜角防眩洗墙光 + 床底低照度感应起夜微光 (0.5W/米)",
      focalPoints: ["1.8m 悬浮科技布床", "0.6m 舒适过道", "整墙隐形衣柜", "2700K 琥珀洗墙光"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对 1.8m 悬浮大床与 11.0 ㎡ 卧室全貌",
          imageUrl: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
          highlight: "11.0 ㎡ 真实紧凑卧室尺度，1.8m 悬浮床脱离地面轻盈感，床头上方 2700K 暖光柔和洒下",
          prompt: "Interior photo of an 11.0 sqm master bedroom in a modern 60 sqm apartment, 1.8m floating upholstered bed positioned against a seamless micro-cement headboard with indirect LED strip backlighting, floor-to-ceiling wardrobe with integrated vertical handles on the side, 600mm clear walking space around bed, cozy minimal atmosphere --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "2700K 床头洗墙微光与橡木床头板",
          imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
          highlight: "2700K 暖色线性光带漫射于浅色木饰面与亚麻床品上，悬浮床头板细节精致",
          prompt: "Close-up shot of headboard warm 2700K ambient LED lighting casting soft glow onto light oak wood veneer wall panel and linen bedding, floating bedside shelf details --ar 16:9"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "卧室门口望向 1.8m 大床与电动纱帘窗",
          imageUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
          highlight: "从卧室门口望向大床与大窗，电动双轨纱帘在晨光中透出柔和漫射光，整洁利落",
          prompt: "Wide-angle shot from bedroom doorway looking at the 1.8m floating bed and window with sheer electric curtains, clean storage closet lines, realistic room scale --ar 16:9"
        }
      ]
    },
    {
      roomId: "workstation",
      roomName: "极客工作站 (1+1房)",
      enName: "Geek Workstation Study",
      sqm: 7.8,
      physicalConstraint: "7.8 ㎡ 独立工位 · 2.0m 升降大板 · 直推 28 吋大行李箱高柜",
      title: "2.0m 双电机升降桌与 28 吋行李箱直推高柜",
      subtitle: "7.8 ㎡ 紧凑独立书房 · 隐藏走线槽 · 双 32 吋 4K 悬浮屏",
      description: "7.8 ㎡ 紧凑独立研发区，2.0m×0.8m 加深升降大板桌紧贴隔墙放置，双 32 吋屏幕机械臂悬浮，侧面 600mm 深度大收纳柜下层直通，可直接推入 28 吋大行李箱。",
      materials: [
        { name: "升降大板", spec: "2000×800mm 天然白橡木实木直拼大板 (厚度 35mm，倒角防压手)" },
        { name: "升降系统", spec: "双电机三节正装静音升降桌腿 (载重 120kg，升降 650-1250mm)" },
        { name: "大件收纳柜", spec: "600mm 深度通顶柜 (下层无底板设计，可直推 28寸大行李箱)" },
        { name: "人体工学椅", spec: "Herman Miller 顶级人体工学网布椅 (全方位腰椎动态支撑)" }
      ],
      lighting: "4000K 护眼专注桌面照明 + 赛博冷蓝背景环境呼吸光 (屏幕挂灯)",
      focalPoints: ["2.0m 升降大板桌", "双屏悬浮机械臂", "行李箱直推高柜", "抗涌浪隐藏走线槽"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对 2.0m 升降大板桌与双屏悬浮工位",
          imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
          highlight: "7.8 ㎡ 独立极客书房，2.0m 宽阔双电机升降大板桌，双屏机械臂悬浮，吸音毛毡护墙板极具科技感",
          prompt: "Modern geek home office setup in a 7.8 sqm dedicated nook of a 60 sqm apartment, 2.0m dual-motor standing desk with dual monitors, acoustic felt pegboard wall, cable management tray, warm task lighting, clean tech minimalist aesthetic --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "黑胡桃木升降桌面与机械键盘特写",
          imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
          highlight: "实木桌面温润木纹，客制化机械键盘，嵌入式隐藏电源插座盒与环境氛围微光",
          prompt: "Close-up shot of a 2.0m dark walnut standing desk surface with minimalist mechanical keyboard, desk pad, hidden desk power strip, subtle ambient LED glow --ar 16:9"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "工位椅回望中央过道与中岛吧台",
          imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
          highlight: "坐在人体工学椅上望向中央过道与中岛，开阔通畅，办公与生活场景自然衔接",
          prompt: "Reverse angle shot from the desk chair looking towards the central hallway corridor and island, showing open layout integration without blocking walkways --ar 16:9"
        }
      ]
    },
    {
      roomId: "kitchen",
      roomName: "开放厨房与中岛吧台",
      enName: "Kitchen & Dining Island",
      sqm: 10.2,
      physicalConstraint: "10.2 ㎡ 开放式水吧中岛 · 1.8m 岩板中岛 · 0.9m 环形走道",
      title: "1.8m 太空灰悬浮岩板中岛与一体化水吧",
      subtitle: "10.2 ㎡ 餐厨一体 · 弹出式轨道插座 · 3把高脚吧椅",
      description: "现代开放式中岛整合手冲咖啡水吧、快节奏就餐与笔记本轻办公，台面内缩 250mm 预留舒适放腿空间，两端预留 900mm 宽敞走道，释放公区流畅动线。",
      materials: [
        { name: "中岛台面", spec: "1800×900mm 太空灰耐污哑光岩板 (莫氏硬度6级，可直接切菜)" },
        { name: "智能电源", spec: "岛台侧面弹出式轨道插座 (带功率统计与手机无线充)" },
        { name: "吧椅配套", spec: "650mm 高度极简铝合金真皮坐垫高脚吧椅 (3把)" },
        { name: "橱柜系统", spec: "超白抗指纹肤感门板 + 嵌入式静音抽油烟机" }
      ],
      lighting: "中岛上方 3000K 深防眩聚焦吊灯 + 橱柜底部 4000K 手扫无影料理灯",
      focalPoints: ["1.8m 悬浮中岛", "弹出式轨道插座", "0.9m 环形走道", "手扫感应料理灯"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对 1.8m 悬浮岩板中岛与开放厨房",
          imageUrl: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80",
          highlight: "60.22 ㎡ 真实紧凑餐厨比例，1.8m 岩板中岛开阔大气，双侧保留 900mm 通畅走道，嵌入式电磁灶与大单槽",
          prompt: "Modern open-plan kitchen and 1.8m floating sintered stone island bar in a 60 sqm apartment, L-shaped matte white cabinetry with embedded induction cooktop and sink, 900mm clearance aisle, minimalist high bar stools, architectural interior photography --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "中岛 3把吧椅与电磁灶台面特写",
          imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
          highlight: "现代中岛吧台搭配 3 把高脚吧椅，嵌入式电磁灶台，哑光黑五金与台底暖光氛围",
          prompt: "Close-up of modern kitchen island with 3 bar stools, induction cooktop, matte black fixtures, warm under-counter lighting, 8k --ar 16:9"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "从中岛吧椅回望客厅 85 吋巨幕与南向阳台",
          imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
          highlight: "坐在吧椅上望向客厅 85 吋电视与南向景观阳台，视野极其开阔通透",
          prompt: "View looking from kitchen across dining island into living room and bright balcony in 60 sqm modern flat --ar 16:9"
        }
      ]
    }
  ],

  // 2. 意式暗调高级黑 (Italian Dark Luxury)
  "dark-luxury": [
    {
      roomId: "bathroom",
      roomName: "独立卫浴室",
      enName: "Compact Luxury Bathroom",
      sqm: 4.2,
      physicalConstraint: "4.2 ㎡ 紧凑卫浴 · 1.8m 劳伦黑金大平台 · 跨越壁挂马桶上方",
      title: "劳伦黑金 1.8m 贯穿大平台与奢华灰玻除雾镜柜",
      subtitle: "4.2 ㎡ 空间极致利用 · 暗装枪灰瀑布龙头 · 2700K 琥珀洗墙光",
      description: "整面 1.8m 劳伦黑金岩板悬浮大平台横向延伸跨越壁挂马桶上方，枪灰色暗装瀑布入墙出水龙头，灰玻边框除雾大镜柜下透出 2700K 琥珀暖光，打造五星级套房的私密奢华体验。",
      materials: [
        { name: "贯穿大平台", spec: "1800mm 劳伦黑金哑光岩板 (横向无缝延伸跨越直接位于壁挂马桶上方)" },
        { name: "除雾镜柜", spec: "灰玻金属窄框智能除雾镜柜 (内嵌 2700K 琥珀背光，Ra>98)" },
        { name: "暗装五金", spec: "暗装枪灰拉丝瀑布入墙式水龙头 (精铜铸造，防溅静音)" },
        { name: "马桶系统", spec: "壁挂隐藏式水箱智能感应翻盖马桶 (离地悬空好打理)" }
      ],
      lighting: "2700K 琥珀色立面洗墙光 + 镜门磨砂导光条无眩光面光",
      focalPoints: ["1.8m 黑金台面跨越马桶", "暗装枪灰入墙龙头", "琥珀氛围大镜柜", "壁挂隐藏水箱"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对 1.8m 黑金贯穿大台面跨越马桶上方",
          imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80",
          highlight: "4.2 ㎡ 紧凑空间，黑金大理石与琥珀暖光交织，1.8m 大台面跨越壁挂马桶上方气派非凡",
          prompt: "Photorealistic interior design rendering of a compact 4.2 sqm modern dark luxury bathroom in a 60 sqm apartment, 1.8m continuous black marble floating countertop seamlessly extending directly ABOVE the wall-hung toilet, full-width frameless LED fogless mirror cabinet, 10mm ultra-thin black frame glass shower partition, concealed gunmetal waterfall faucet, realistic spatial scale, 8k --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "枪灰入墙龙头出水与黑金岩板微距",
          imageUrl: "https://images.unsplash.com/photo-1584622781564-1d987f7333c1?auto=format&fit=crop&w=1200&q=80",
          highlight: "暗装枪灰瀑布龙头水流倾泻于黑金大理石一体盆，琥珀色光影交错",
          prompt: "Macro interior photography of a gunmetal wall-mounted waterfall faucet over a Laurent black gold marble floating basin in a 4.2 sqm compact bathroom, ambient amber LED lighting reflecting on stone, water droplets, ultra-detailed texture, luxury interior detail, 8k --ar 16:9 --style raw"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "淋浴间望向干区黑金台面与镜柜",
          imageUrl: "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1200&q=80",
          highlight: "灰玻淋浴隔断阻绝水汽，干区 1.8m 大台面与壁挂马桶一览无遗",
          prompt: "Interior perspective looking from the dark-framed glass shower enclosure towards the luxury dark marble vanity and wall-hung toilet in 4.2 sqm bathroom, glowing amber mirror cabinet, hotel suite bathroom rendering, 8k resolution --ar 16:9 --style raw"
        }
      ]
    },
    {
      roomId: "living",
      roomName: "客厅极简影音区",
      enName: "Living & Media Zone",
      sqm: 15.2,
      physicalConstraint: "15.2 ㎡ 暗调公区 · 净开间 3.6m · 2.5m 观影视距",
      title: "劳伦黑金岩板地台与黑胡桃木饰面巨幕墙",
      subtitle: "15.2 ㎡ 奢雅公区 · 2700K 琥珀洗墙光 · 焦糖真皮沙发",
      description: "整面天然黑胡桃木木饰面电视墙内嵌 85 吋大屏，劳伦黑金岩板地台下透出暖金色 2700K 琥珀微光，搭配焦糖色真皮沙发，营造顶级私享雪茄吧与高定会客沉浸氛围。",
      materials: [
        { name: "背景饰面", spec: "深邃黑胡桃纹理 PET 肤感板 (PUR无缝封边，热带防潮不发霉)" },
        { name: "悬浮地台", spec: "进口劳伦黑金哑光岩板 (细金纹理，莫氏硬度6级)" },
        { name: "奢雅沙发", spec: "焦糖色头层半苯胺真皮沙发 (宽厚扶手，极高包覆感)" },
        { name: "氛围灯光", spec: "黑光深防眩超窄光束角射灯 (UGR<6，见光不见灯)" }
      ],
      lighting: "2700K 琥珀色线性隐藏洗墙光 + 柜体内部向下斜角氛围微光",
      focalPoints: ["劳伦黑金地台", "黑胡桃木背景墙", "焦糖真皮沙发", "2700K 琥珀洗墙光"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对黑胡桃木饰面与黑金地台",
          imageUrl: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
          highlight: "深邃沉稳的暗调美学，2700K 琥珀洗墙光勾勒出黑胡桃木天然肌理，2.5m 黄金观影视距",
          prompt: "Luxury Italian dark style living room interior, 15.2 sqm space for 60.22 sqm apartment, black walnut wood slat feature wall with 85-inch recessed TV, floating Nero Marquina black marble media console, warm 2700K amber under-glow LED lighting, caramel leather sofa, 2.5m viewing distance, moody architectural photography, 8k --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "黑金岩板金丝纹理与琥珀光",
          imageUrl: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
          highlight: "劳伦黑金岩板金色细纹在暖光下熠熠生辉，深色金属收边严丝合缝",
          prompt: "Macro interior shot of Nero Marquina black marble surface with fine gold veining in 15.2 sqm luxury living room, concealed 2700K amber warm LED light bar glowing underneath, luxurious textures, 8k resolution --ar 16:9 --style raw"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "由阳台望向暗调公区全景",
          imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
          highlight: "深色背景极度吸收杂光，看电影与品酒氛围极佳，通透动线丝毫不显压抑",
          prompt: "Reverse angle interior photo looking into a moody dark luxury 15.2 sqm apartment living room from the balcony window, amber warm lighting layers, rich smoked walnut wood finishes, realistic condo scale, 8k --ar 16:9 --style raw"
        }
      ]
    },
    {
      roomId: "bedroom",
      roomName: "主卧深睡区",
      enName: "Master Bedroom Suite",
      sqm: 11.0,
      physicalConstraint: "11.0 ㎡ 暗调主卧 · 1.8m 大床 · 0.6m 通行过道",
      title: "五星级奢雅暗调深睡套房与灰玻衣橱",
      subtitle: "11.0 ㎡ 沉浸私享 · 深灰皮质软包 · 2700K 琥珀吊灯",
      description: "床头采用深灰皮质软包拼接黑胡桃木饰面，两侧垂挂极细黄铜吊灯，西侧为半透光灰玻发光衣橱，营造彻底松弛的睡眠私密包裹感与顶级酒店质感。",
      materials: [
        { name: "床头软包", spec: "深灰意大利纳帕皮质软包 (拼接黑胡桃木饰面)" },
        { name: "发光衣橱", spec: "黑铝窄框透光灰玻门板 (内置 2700K 感应层板灯)" },
        { name: "大床床架", spec: "1800×2000mm 悬浮皮质大床 (床底内嵌隐形地脚灯)" },
        { name: "全遮光帘", spec: "深灰厚质丝绒电动双轨帘 (100% 物理全遮光)" }
      ],
      lighting: "2700K 床头黄铜垂线吊灯 + 灰玻衣橱内层板隐形灯带",
      focalPoints: ["深灰纳帕皮软包", "灰玻发光衣橱", "黄铜极细垂线吊灯", "丝绒全遮光帘"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对深灰软包床头与黑胡桃木墙",
          imageUrl: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80",
          highlight: "11.0 ㎡ 空间深色皮质与黑胡桃木质感交融，两侧琥珀色垂线吊灯营造安详静谧",
          prompt: "Luxury dark modern master bedroom interior, 11.0 sqm space for 60.22 sqm apartment, dark grey leather headboard against smoked walnut wood wall, warm amber 2700K pendant lights, floating king bed, 0.6m walkway, dark glass wardrobe with interior LED illumination, hotel suite aesthetic, 8k --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "纳帕皮纹理与黄铜吊灯微距",
          imageUrl: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
          highlight: "精细皮质缝线与拉丝黄铜灯体细节，光影层次极其温润奢雅",
          prompt: "Macro interior shot of a luxury dark grey leather bed headboard with fine stitching details, glowing brass pendant lamp, dark cozy mood lighting, depth of field, 8k resolution --ar 16:9 --style raw"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "门洞望向大床与灰玻衣橱",
          imageUrl: "https://images.unsplash.com/photo-1540518614846-7ede433c4550?auto=format&fit=crop&w=1200&q=80",
          highlight: "灰玻衣橱内部暖光微透，空间深邃而不压抑，动线开阔",
          prompt: "Side angle view of dark luxury modern 11 sqm bedroom, smoked glass wardrobe with illuminated clothing display, leather platform bed, calm hotel atmosphere, architectural photo, 8k --ar 16:9 --style raw"
        }
      ]
    },
    {
      roomId: "workstation",
      roomName: "极客工作站 (1+1房)",
      enName: "Geek Workstation Study",
      sqm: 7.8,
      physicalConstraint: "7.8 ㎡ 独立工位 · 2.0m 黑胡桃大板 · 灰玻外设展柜",
      title: "暗夜极客作战指挥室与灰玻数码发光展柜",
      subtitle: "7.8 ㎡ 独立研发舱 · 黑胡桃大板台 · 暗调多屏协同",
      description: "黑胡桃木大板桌面搭配深空灰金属工位，背墙为黑玻手办与数码装备发光展示柜，氛围宛如科技大厂高管独立工位与极客指挥室。",
      materials: [
        { name: "实木大板", spec: "2000×800mm 北美黑胡桃实木直拼大板 (天然木纹深邃)" },
        { name: "数码展柜", spec: "黑铝窄框灰玻发光展示柜 (内置 RGBW 智能调光灯槽)" },
        { name: "静音护墙", spec: "深灰阻燃吸音毛毡护墙板 (隔音吸噪，提升通话音质)" },
        { name: "人体工学", spec: "黑色全皮质高阶人体工学椅 (带动态头枕与腰靠)" }
      ],
      lighting: "2700K 琥珀环境背光 + 4000K 屏幕精准挂灯 (支持暗夜模式自动化)",
      focalPoints: ["黑胡桃实木大板", "灰玻发光外设展柜", "暗夜极客作战台", "吸音毛毡护墙"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对黑胡桃大板台与发光展柜",
          imageUrl: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?auto=format&fit=crop&w=1200&q=80",
          highlight: "7.8 ㎡ 紧凑空间，黑胡桃大板与暗调数码装备相得益彰，背墙发光展柜科技感拉满",
          prompt: "Stealth dark luxury developer home office, 7.8 sqm space in 60.22 sqm apartment, 2.0m solid black walnut wood standing desk, dual 32-inch 4K screens, smoked glass display cabinets with subtle amber internal lighting, premium mechanical keyboard, acoustic felt wall, architectural render, 8k --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "黑胡桃实木木纹与铝合金走线盒",
          imageUrl: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80",
          highlight: "黑胡桃木天然行云流水纹理，黑色金属配件严丝合缝",
          prompt: "Close up macro shot of rich black walnut desk surface, custom dark mechanical keyboard, matte black aluminum cable box, ambient warm light reflection, 8k --ar 16:9 --style raw"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "侧角望向工位与大行李箱高柜",
          imageUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1200&q=80",
          highlight: "侧面定制 600mm 深度通顶暗色大储物柜，底部直通推入 28 吋大行李箱",
          prompt: "Side angle of a dark modern 7.8 sqm home workstation, tall seamless dark charcoal cabinets with open bottom luggage slot, black walnut motorized desk, cozy moody lighting, 8k --ar 16:9 --style raw"
        }
      ]
    },
    {
      roomId: "kitchen",
      roomName: "开放厨房与中岛吧台",
      enName: "Kitchen & Dining Island",
      sqm: 10.2,
      physicalConstraint: "10.2 ㎡ 奢雅水吧 · 1.8m 劳伦黑金中岛 · 嵌入式红酒柜",
      title: "劳伦黑金岩板中岛与黑胡桃红酒吧台",
      subtitle: "10.2 ㎡ 社交水吧 · 2700K 琥珀悬浮底座 · 恒温红酒柜",
      description: "整面 1.8m 劳伦黑金岩板中岛下透出暖金色 2700K 微光，侧边整合隐藏式恒温红酒柜与手冲咖啡台，搭配高脚吧椅，尽显奢雅品味与社交魅力。",
      materials: [
        { name: "中岛台面", spec: "1800×900mm 劳伦黑金岩板 (莫氏硬度6级，耐高温防渗透)" },
        { name: "红酒水吧", spec: "嵌入式静音恒温红酒柜 (双温区 5-18°C，可存 18支)" },
        { name: "中岛柜体", spec: "深灰纳米抗指纹肤感板 (激光无缝封边工艺)" },
        { name: "吧椅配置", spec: "焦糖色真皮包裹马鞍皮高脚吧椅 (金属黑漆脚)" }
      ],
      lighting: "中岛上方 2700K 黑光深防眩单头吊灯 + 底圈 2700K 悬浮洗地灯带",
      focalPoints: ["劳伦黑金中岛", "嵌入式恒温红酒柜", "焦糖真皮吧椅", "琥珀洗地灯带"],
      views: [
        {
          key: "A",
          label: "视角 A: 主视角全景",
          sublabel: "正对劳伦黑金中岛与开放厨房",
          imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
          highlight: "60.22 ㎡ 真实紧凑空间，黑金岩板中岛沉稳尊贵，底圈 2700K 暖光悬浮轻盈",
          prompt: "Luxury dark open kitchen in 60.22 sqm apartment, 1.8m Laurent black gold marble island, under-counter amber 2700K warm LED lighting, dark walnut cabinets, caramel leather bar stools, built-in wine cooler, realistic scale, 8k --ar 16:9 --style raw"
        },
        {
          key: "B",
          label: "视角 B: 材质与光影特写",
          sublabel: "黑金岩板金丝与酒杯倒影",
          imageUrl: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
          highlight: "黑金大理石台面水波纹倒影，琥珀色光线烘托出红酒杯晶莹剔透",
          prompt: "Macro close-up of a dark gold veined marble kitchen island counter in compact luxury condo, crystal wine glass with red wine, soft ambient warm lighting reflection, depth of field, 8k --ar 16:9 --style raw"
        },
        {
          key: "C",
          label: "视角 C: 反向/侧角视角",
          sublabel: "从中岛回望客厅影音巨幕",
          imageUrl: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
          highlight: "坐在吧椅上回看黑胡桃木电视巨幕墙，公区纵深通透，氛围感无敌",
          prompt: "Perspective shot from dark luxury kitchen island looking towards living room feature wall in 60.22 sqm condo, cohesive dark warm aesthetic, architectural photography, 8k --ar 16:9 --style raw"
        }
      ]
    }
  ]
};

// Fallback helper
const getStyleRooms = (styleId: string): StyleRoomData[] => {
  if (ROOM_RENDERINGS_DATABASE[styleId]) {
    return ROOM_RENDERINGS_DATABASE[styleId];
  }
  if (styleId === "italian-luxury" || styleId === "dark-luxury") {
    return ROOM_RENDERINGS_DATABASE["dark-luxury"];
  }
  return ROOM_RENDERINGS_DATABASE["modern-minimalist"];
};

export const VisualGallery: React.FC<VisualGalleryProps> = ({
  selectedStyleId,
  setSelectedStyleId
}) => {
  const currentRooms = getStyleRooms(selectedStyleId);
  const [activeRoomId, setActiveRoomId] = useState<"living" | "bedroom" | "bathroom" | "workstation" | "kitchen">("bathroom"); // Default to bathroom to highlight calibrated topology
  const [activeAngleKey, setActiveAngleKey] = useState<"A" | "B" | "C">("A");
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Sync active room if out of bounds
  const currentRoom = currentRooms.find((r) => r.roomId === activeRoomId) || currentRooms[0];
  const currentView = currentRoom.views.find((v) => v.key === activeAngleKey) || currentRoom.views[0];
  const currentStyleObj = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];

  const handleCopyPrompt = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Style Synchronizer & 5 Room Tabs */}
      
      {/* Before / After Handover Slider */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 relative overflow-hidden">
        <h3 className="text-xl font-black text-slate-900 flex items-center">
          <Eye className="w-5 h-5 mr-2 text-blue-600" />
          交付毛坯 (Before) vs 精装落地 (After) 沉浸对比
        </h3>
        <p className="text-xs text-slate-500">拖动滑块，直观感受开发商原装白墙瓷砖与最终定制落地的生活品质差异。</p>
        
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden group border border-slate-200">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="50"
            onChange={(e) => {
              const slider = document.getElementById('before-after-slider');
              if (slider) slider.style.width = `${e.target.value}%`;
              const handle = document.getElementById('before-after-handle');
              if (handle) handle.style.left = `${e.target.value}%`;
            }}
            className="absolute inset-0 z-30 opacity-0 cursor-ew-resize w-full h-full"
          />
          
          {/* After Image (Background) */}
          <div className="absolute inset-0 bg-slate-900">
            <img 
              src={ROOM_RENDERINGS_DATABASE[selectedStyleId][0].views[0].imageUrl} 
              alt="After" 
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4 bg-emerald-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
              AFTER (落地精装)
            </div>
          </div>
          
          {/* Before Image (Clipped Foreground) */}
          <div id="before-after-slider" className="absolute inset-0 bg-slate-200 border-r-2 border-white pointer-events-none" style={{ width: '50%' }}>
            <div className="w-full h-full relative overflow-hidden bg-slate-100 flex items-center justify-center">
              {/* Simulate empty room with CSS/SVG */}
              <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" alt="空毛坯房" className="w-[200%] h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                <Building2 className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-xs font-bold tracking-widest uppercase">Developer Handover</span>
                <span className="text-[10px] mt-1">空荡白墙 · 裸露电箱 · 无氛围光</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-slate-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-md">
              BEFORE (开发商毛坯)
            </div>
          </div>
          
          {/* Slider Handle */}
          <div id="before-after-handle" className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(0,0,0,0.5)] pointer-events-none z-20" style={{ left: '50%' }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-slate-200 flex items-center justify-center text-slate-400">
              <code className="text-xs font-black">↔</code>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 font-mono">
                3-VIEW AI PHOTOREALISTIC RENDER STUDIO
              </span>
              <span className="text-xs text-slate-500 font-semibold">Paragon Gateway A-24-10 (60.22 ㎡ / Type B 紧凑 1+1 房)</span>
            </div>
            <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-blue-600" />
              全屋 3D / AI 室内效果渲染图集 (真实 60.22 ㎡ 物理尺度)
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl leading-relaxed">
              严格约束 60.22 ㎡ 真实物理面积与家具尺度，提供 <strong>[📷 视角 A: 主视角全景]</strong>、<strong>[🔍 视角 B: 材质特写]</strong> 与 <strong>[↺ 视角 C: 反向视角]</strong> 高清实景呈现，拒绝不切实际的大面积豪宅假图
            </p>
          </div>

          {/* Style Selector Synchronizer Pill */}
          <div className="flex items-center space-x-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
            <span className="text-xs text-slate-500 font-bold px-2 flex items-center">
              <Palette className="w-3.5 h-3.5 mr-1 text-blue-600" />
              当前推演风格:
            </span>
            {STYLES_DATA.slice(0, 4).map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStyleId(s.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedStyleId === s.id
                    ? "bg-slate-900 text-white shadow-sm font-semibold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>

        {/* 2. 5 Core Space Navigation Tabs (Prominent & Clickable) */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
          {[
            { id: "bathroom", label: "🚿 独立卫浴室 (4.2㎡)" },
            { id: "living", label: "🛋️ 客厅极简影音区 (15.2㎡)" },
            { id: "bedroom", label: "🛏️ 主卧深睡区 (11.0㎡)" },
            { id: "workstation", label: "💻 极客工作站 1+1 (7.8㎡)" },
            { id: "kitchen", label: "🍳 开放厨房与中岛 (10.2㎡)" }
          ].map((tab) => {
            const isActive = activeRoomId === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveRoomId(tab.id as any);
                  setActiveAngleKey("A"); // reset to primary angle
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-[1.02] ring-2 ring-blue-400/30"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Main Multi-View Render Viewport Studio Card */}
      <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
        {/* Left Col: High-Definition Photorealistic Image Viewport (7 Columns) */}
        <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 flex flex-col justify-between space-y-4">
          {/* Main Rendering Image Container */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10 group cursor-pointer"
               onClick={() => setIsModalOpen(true)}>
            <img
              src={currentView.imageUrl}
              alt={currentView.label}
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {/* Top Room & View Badges (Clear and Unmistakable) */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span className="bg-black/75 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-xl border border-white/20 shadow-md flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>{currentRoom.roomName} ({currentRoom.sqm} ㎡)</span>
              </span>
              <span className="bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-xl shadow-md font-mono">
                {currentView.label}
              </span>
            </div>

            {/* Click to Enlarge Indicator */}
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white/90 text-xs px-2.5 py-1 rounded-lg border border-white/20 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>点击查看 4K 巨幕大图</span>
            </div>
          </div>

          {/* 3 Perspective Switcher Tabs (Angle A, B, C) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {currentRoom.views.map((view) => {
              const isAngleActive = activeAngleKey === view.key;
              return (
                <button
                  key={view.key}
                  onClick={() => setActiveAngleKey(view.key)}
                  className={`p-2.5 rounded-2xl border transition-all text-left flex flex-col justify-between ${
                    isAngleActive
                      ? "bg-blue-600/20 border-blue-500 shadow-md ring-2 ring-blue-500/40 text-white"
                      : "bg-slate-900/80 border-slate-800 hover:bg-slate-800 text-slate-300"
                  }`}
                >
                  <div className="flex items-center space-x-1.5">
                    {view.key === "A" && <Camera className="w-3.5 h-3.5 text-blue-400" />}
                    {view.key === "B" && <Search className="w-3.5 h-3.5 text-amber-400" />}
                    {view.key === "C" && <RotateCw className="w-3.5 h-3.5 text-emerald-400" />}
                    <span className="text-xs font-black">{view.label}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {view.sublabel}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Col: Deep-Dive Specifications & Prompts (5 Columns) - ZERO TEXT TRUNCATION */}
        <div className="lg:col-span-5 p-6 space-y-5 flex flex-col justify-between bg-white">
          <div>
            {/* Active Angle Status */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-widest">
                  {currentRoom.enName} · {currentRoom.physicalConstraint}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-0.5">
                  {currentRoom.title}
                </h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono">
                {currentStyleObj.name}
              </span>
            </div>

            {/* Subtitle & Angle Highlight */}
            <div className="mt-3 space-y-2">
              <div className="text-xs font-bold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-200/80 flex items-start space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span>{currentView.highlight}</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {currentRoom.description}
              </p>
            </div>

            {/* Material Specifications Table - Fully Expanded Text (1:1 with render image) */}
            <div className="mt-4 space-y-2">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Palette className="w-3.5 h-3.5 text-blue-600" />
                <span>本案物理材质落地清单 (Materials Spec 1:1)</span>
              </h4>
              <div className="flex flex-col gap-1.5">
                {currentRoom.materials.map((mat, idx) => (
                  <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-xs text-slate-800 flex flex-wrap items-baseline justify-between gap-1">
                    <span className="font-bold text-slate-900">{mat.name}:</span>
                    <span className="text-slate-600 font-medium">{mat.spec}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting Strategy */}
            <div className="mt-4 space-y-1.5">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
                <span>光影与灯光氛围策略 (Lighting)</span>
              </h4>
              <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/70 text-xs text-amber-950 font-medium leading-relaxed">
                {currentRoom.lighting}
              </div>
            </div>
          </div>

          {/* Midjourney v6 / Flux.1 Prompt Box with One-Click Copy */}
          <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2.5 shadow-sm mt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold text-slate-200">
                  Midjourney v6 紧凑户型 1:1 约束 Prompt
                </span>
              </div>
              <button
                onClick={() => handleCopyPrompt(currentView.prompt)}
                className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1.5 transition-all shadow-sm active:scale-95"
              >
                {copiedPrompt ? (
                  <>
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-300" />
                    <span>已复制!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制 Prompt</span>
                  </>
                )}
              </button>
            </div>
            <div className="p-2.5 bg-black/60 rounded-xl font-mono text-[11px] text-slate-300 leading-relaxed break-words border border-slate-800 max-h-24 overflow-y-auto no-scrollbar">
              {currentView.prompt}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Fullscreen 4K Deep-Dive Modal */}
      {isModalOpen && (
        <div
          onClick={() => setIsModalOpen(false)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full max-w-5xl rounded-3xl border border-slate-200 overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-shrink-0">
              <div>
                <span className="text-xs font-bold text-blue-600 font-mono">
                  4K AI MULTI-VIEW STUDIO · {currentRoom.roomName} ({currentRoom.physicalConstraint})
                </span>
                <h3 className="text-lg font-black text-slate-900">
                  {currentView.label} — {currentView.sublabel}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white text-slate-700 hover:text-slate-950 flex items-center justify-center font-bold text-sm shadow-sm border border-slate-200"
              >
                ✕
              </button>
            </div>

            {/* Modal Image Viewport */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
              <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-black">
                <img
                  src={currentView.imageUrl}
                  alt={currentView.label}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* View Switchers in Modal */}
              <div className="grid grid-cols-3 gap-3">
                {currentRoom.views.map((v) => (
                  <button
                    key={v.key}
                    onClick={() => setActiveAngleKey(v.key)}
                    className={`p-3 rounded-2xl border transition-all text-left flex items-center space-x-3 ${
                      activeAngleKey === v.key
                        ? "bg-blue-50 border-blue-600 shadow-sm ring-2 ring-blue-500/20"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <img src={v.imageUrl} alt={v.label} className="w-16 h-12 rounded-xl object-cover" />
                    <div>
                      <div className="text-xs font-black text-slate-900">{v.label}</div>
                      <div className="text-[10px] text-slate-500">{v.sublabel}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Copy Prompt in Modal */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">
                    Midjourney v6 精准约束 Prompt
                  </span>
                  <button
                    onClick={() => handleCopyPrompt(currentView.prompt)}
                    className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white flex items-center space-x-1"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedPrompt ? "已复制!" : "复制 Prompt"}</span>
                  </button>
                </div>
                <div className="p-3 bg-black/60 rounded-xl font-mono text-xs text-slate-300 leading-relaxed break-words">
                  {currentView.prompt}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
