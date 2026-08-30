export interface PropertyMetadata {
  projectName: string;
  contractName: string;
  tenure: string;
  location: string;
  unitNo: string;
  tower: string;
  floor: number;
  carpark: string;
  spaPriceMYR: number;
  loanMYR: number;
  unitType: string;
  unitDirection: string;
  builtUpSqFt: number;
  builtUpSqm: number;
  overallWidthMm: number;
  overallLengthMm: number;
  ceilingHeightM: number;
  clearHeightM: number;
  droppedCeilingHeightM: number;
  orientationSSE: number;
  orientationNNW: number;
  microclimate: {
    sunlight: string;
    monsoonVentilation: string;
    acousticsAndView: string;
  };
}

export interface ZoneData {
  id: string;
  name: string;
  enName: string;
  sqm: number;
  sqft: number;
  dimensionsMm: string;
  clearHeightMm: number;
  description: string;
  coordinates: { x: number; y: number; w: number; h: number }; // Relative 2D floorplan coordinates (0-100)
  ergonomicHighlights: string[];
  mepPoints: string[];
  smartDevices: string[];
}

export interface ErgonomicSpec {
  category: string;
  name: string;
  standardMm: string;
  rationale: string;
  impactOnHealth: string;
  diagramNote: string;
}

export interface MaterialComparisonItem {
  id: string;
  name: string;
  category: string;
  cleanabilityScore: number; // 1-100 (耐脏与易清洁度)
  warmthScore: number;       // 1-100 (触感温度与居家温馨感)
  durabilityScore: number;   // 1-100 (抗刮与耐磨耐用度)
  costScore: number;         // 1-100 (造价性价比)
  bestFor: string;
  antiFingerprint: boolean;
  seamlessJoint: boolean;
  pros: string[];
  cons: string[];
  maintenanceTips: string;
}

export interface HotelLightingLayer {
  layerName: string;
  role: string;
  cctRange: string;
  fixtures: string;
  ugrStandard: string;
  locations: string;
  effect: string;
}

export interface StyleData {
  id: string;
  name: string;
  enName: string;
  tagline: string;
  badge: string;
  themeColor: string;
  accentColor: string;
  bgGradient: string;
  description: string;
  coreVibe: string;
  palette: { name: string; hex: string; role: string }[];
  keyMaterials: { category: string; item: string; spec: string }[];
  lightingStrategy: {
    cct: string;
    mainLight: string;
    ambient: string;
    geekSync: string;
  };
  pros: string[];
  cons: string[];
  radarScores: {
    openness: number;    // 空间通透度 (1-100)
    maintenance: number; // 打理耐脏度 (1-100)
    costEfficiency: number; // 造价性价比 (1-100)
    geekSynergy: number; // 极客工位契合 (1-100)
    sleepComfort: number;// 睡眠舒缓感 (1-100)
    resaleValue: number; // 资产保值率 (1-100)
  };
  roomRenderings: {
    room: string;
    title: string;
    description: string;
    visualStyle: string;
    focalPoints: string[];
    gradientPreview: string;
  }[];
}

export interface SmartScene {
  id: string;
  name: string;
  enName: string;
  icon: string;
  description: string;
  trigger: string;
  actions: {
    zone: string;
    device: string;
    state: string;
    details: string;
  }[];
}

export interface BomCategory {
  id?: string;
  category: string;
  icon: string;
  description: string;
  items: {
    id: string;
    name: string;
    spec: string;
    quantity: string;
    unitPriceMYR: number;
    totalMYR: number;
    recommended: boolean;
    tier: "essential" | "premium" | "ultimate";
  }[];
}

export const PROPERTY_DATA: PropertyMetadata = {
  projectName: "Paragon Gateway",
  contractName: "Suria Paragon Phase 1",
  tenure: "永久地契 (Freehold / Commercial Under HDA)",
  location: "Lot 46048 & Lot 24781, Taman Suria, Johor Bahru, Malaysia",
  unitNo: "A-24-10",
  tower: "Tower A",
  floor: 24,
  carpark: "9-2655 (Level 9 / Accessory Parcel A2358)",
  spaPriceMYR: 581812.00,
  loanMYR: 465449.00,
  unitType: "Type B (Right Unit 右向户型)",
  unitDirection: "南偏东南主朝向 (SSE 165°)",
  builtUpSqFt: 648,
  builtUpSqm: 60.22,
  overallWidthMm: 6900,
  overallLengthMm: 9725,
  ceilingHeightM: 3.00,
  clearHeightM: 2.85,
  droppedCeilingHeightM: 2.70,
  orientationSSE: 165,
  orientationNNW: 345,
  microclimate: {
    sunlight: "彻底避开正西西晒暴晒；上午享柔和朝阳，全天高品质漫射自然光（Diffused Light）。",
    monsoonVentilation: "5~9月西南季风直吹南向阳台，11~3月东北季风形成北侧负压，南北通透对流。",
    acousticsAndView: "背向北侧 Tebrau 主高速，正对南侧低密住宅区（低噪静音）。24楼俯瞰新山市区并远眺新加坡天际线。"
  }
};

export const ERGONOMIC_SPECS: ErgonomicSpec[] = [
  {
    category: "卫浴大平台与镜面",
    name: "悬浮洗手台面高度",
    standardMm: "860 - 880 mm",
    rationale: "依据亚洲成人站姿洗漱重心测算，相比传统 800mm 台面减少弯腰倾角 22°，彻底消除长期刷牙洗脸腰椎酸痛。",
    impactOnHealth: "预防腰肌劳损，洗漱时水滴自然顺流台盆，杜绝流向手臂与地面。",
    diagramNote: "离地悬空 350mm，下方无立柱无卫生死角，方便扫地机出入与脚底站立容差。"
  },
  {
    category: "卫浴大平台与镜面",
    name: "满墙镜柜与视线中心",
    standardMm: "1100 - 1950 mm (视线 1550mm)",
    rationale: "镜柜下沿离台面 250mm，上沿通顶，镜面中心与双眼平齐，前倾洗脸不碰头，照镜无压迫感。",
    impactOnHealth: "双向 45° 侧发光消除眼眶与下颌面部阴影，显色指数 Ra>97，精准护肤与剃须。",
    diagramNote: "镜柜进深黄金 150mm，可收纳电动牙刷、吹风机、香水与护肤品，彻底清空台面杂物。"
  },
  {
    category: "厨房与中岛吧台",
    name: "餐厨中岛吧台高度与腿部容差",
    standardMm: "高度 900 mm / 吧椅 650 mm",
    rationale: "台面与坐垫高差 250mm 为人体工学黄金黄金比例，吧台内缩 250mm 预留膝盖伸入空间。",
    impactOnHealth: "双腿自然垂直放置，手肘 90° 轻松搭在吧台上操作笔记本或享用早餐，久坐不累。",
    diagramNote: "吧台整合弹出式隐藏轨道插座，手机与笔记本边充边用。"
  },
  {
    category: "公区纵深动线",
    name: "入户至客厅主通道净宽",
    standardMm: "950 - 1100 mm",
    rationale: "保留单人快速通过与双人交会避让舒适度，完全不被凸出家具阻碍。",
    impactOnHealth: "开阔心理呼吸感，消除狭长走廊的幽闭压迫感，双手提大件行李或快递畅行无阻。",
    diagramNote: "玄关鞋柜采用 350mm 超薄进深，反弹器无把手设计避免勾衣服。"
  },
  {
    category: "极客工作站 (1+1)",
    name: "双电机升降桌与显示器视距",
    standardMm: "升降 650-1250 mm / 桌面深度 800 mm",
    rationale: "800mm 加深桌面确保 27-34寸 4K 屏幕处于 60-70cm 人眼最佳焦距，视线俯角 15°。",
    impactOnHealth: "坐立交替办公促进下肢血液循环，彻底保护颈椎生理曲度与眼部肌肉。",
    diagramNote: "工位侧面定制 600mm 深度大高柜，下层直通无底板可推入 28寸大行李箱。"
  },
  {
    category: "主卧深睡区",
    name: "悬浮大床与床侧走道通行净宽",
    standardMm: "床高 500 mm / 床侧通道 750 mm+",
    rationale: "500mm 床垫高度让起坐时大腿与小腿呈 90° 自然垂直，起卧毫不费力。",
    impactOnHealth: "夜间起夜步态平稳，床底内缩 150mm 防踢脚，感应地脚夜灯微光引导不刺眼。",
    diagramNote: "满墙衣柜深度 600mm，预留 1000mm 开门与更衣回旋空间。"
  }
];

export const HOTEL_LIGHTING_LAYERS: HotelLightingLayer[] = [
  {
    layerName: "1. 间接反射洗天花光 (Ambient Ceiling Bounce)",
    role: "基础环境漫射",
    cctRange: "3000K 暖白光 (Ra>95)",
    fixtures: "天花隐藏式反光灯槽 (高压/低压 24V COB 柔光灯带，120灯/米)",
    ugrStandard: "完全无可见光源 (UGR=0)",
    locations: "客厅四周天花吊顶、主卧床头反光槽、走廊反光槽",
    effect: "见光不见灯，光线打向天花再均匀漫射向下，宛如清晨阳光透过天窗，层高视觉拉升 15cm。"
  },
  {
    layerName: "2. 深防眩重点射灯 (Accent Downlights)",
    role: "焦点与艺术品打光",
    cctRange: "3000K - 3500K 聚焦光",
    fixtures: "深杯黑光防眩射灯 (遮光角 >38°，光束角 24°/36°，深藏式内嵌)",
    ugrStandard: "UGR < 10 (五星级酒店严苛防眩标准)",
    locations: "中岛台面中心、餐桌焦点、客厅茶几、玄关端景挂画",
    effect: "在房间任意角度抬头均看不到刺眼光源，桌面物品与美食色泽饱满诱人，质感极其高档。"
  },
  {
    layerName: "3. 悬浮地脚与踢脚线漫射 (Floating Toe-Kick & Base)",
    role: "悬浮轻盈感与夜间导引",
    cctRange: "2700K 暖琥珀光",
    fixtures: "嵌入式极窄铝型材斜角微光灯带 (3W/米 低功率温和光)",
    ugrStandard: "柔和漫射 (无眩光)",
    locations: "玄关鞋柜底部、悬浮中岛底圈、浴室悬浮大平台底、主卧床底内缩区",
    effect: "重型柜体与床架在视觉上仿佛完全脱离地面漂浮，夜间起夜自动感应点亮，不惊扰睡意。"
  },
  {
    layerName: "4. 卫浴无影面光与立面洗墙 (Vanity Face & Wall Wash)",
    role: "美妆剃须与石材纹理展现",
    cctRange: "3500K-4000K 高显色纯净光 (Ra>98, R9>90)",
    fixtures: "镜柜上下隐藏洗墙灯 + 镜门内嵌磨砂匀光导光条",
    ugrStandard: "大面积发光面 (柔和无眩光)",
    locations: "卫浴室 1.5m 满墙大镜柜上下及两侧",
    effect: "面部受光均匀无死角，彻底消除眼袋与鼻翼阴影，照镜如明星化妆间，大理石台面纹理细腻展现。"
  }
];

export const MATERIAL_COMPARISONS: MaterialComparisonItem[] = [
  {
    id: "mat-pet",
    name: "纳米抗指纹超哑 PET 肤感板",
    category: "全屋定制柜体门板",
    cleanabilityScore: 98,
    warmthScore: 92,
    durabilityScore: 90,
    costScore: 92,
    bestFor: "玄关鞋柜、满墙大收纳柜、主卧隐形衣柜、中岛侧柜",
    antiFingerprint: true,
    seamlessJoint: true,
    pros: [
      "表面具有纳米疏水疏油层，彻底杜绝手汗与指纹印迹",
      "触感如婴儿皮肤般温润细腻，完全没有传统烤漆的冰冷反光感",
      "激光无缝封边工艺，防潮耐水汽，不起皮不发黄",
      "微纤维抹布轻轻一擦即可去除日常灰尘与污渍"
    ],
    cons: [
      "严禁使用强酸碱钢丝球大力刮擦",
      "需要选择正规进口大厂（如德国雷诺丽特/爱格）以保证耐黄变年限"
    ],
    maintenanceTips: "日常清洁只需用微湿的纯棉抹布顺时针擦拭，油污用中性洗洁精稀释液即可秒清。"
  },
  {
    id: "mat-wood",
    name: "天然温润白橡木/黑胡桃实木木皮饰面",
    category: "特色背景墙与台面隔板",
    cleanabilityScore: 85,
    warmthScore: 99,
    durabilityScore: 88,
    costScore: 80,
    bestFor: "中岛木质挑台、书房升降大板桌、主卧床头背景墙、置物隔板",
    antiFingerprint: true,
    seamlessJoint: false,
    pros: [
      "居家温馨感与自然温度的核心来源，木纹肌理独特无法替代",
      "开放漆哑光保护层保留真实木质触感，冬暖夏凉",
      "与酒店暖光 (2700K-3000K) 配合能产生极高档次的光影漫反射",
      "越用越有质感与岁月温润感"
    ],
    cons: [
      "不可长时间浸水或被水杯底水渍浸泡（需垫杯垫）",
      "造价相对常规三聚氰胺板稍高"
    ],
    maintenanceTips: "避免尖锐金属硬刮，每年可用专用天然木蜡油做一次简单滋润保养。"
  },
  {
    id: "mat-sintered",
    name: "进口超薄耐污岩板 (Sintered Stone)",
    category: "厨房台面、中岛台面与浴室大台面",
    cleanabilityScore: 99,
    warmthScore: 78,
    durabilityScore: 98,
    costScore: 85,
    bestFor: "中岛吧台面、浴室 1.5m 贯穿式大平台、厨房料理台",
    antiFingerprint: true,
    seamlessJoint: false,
    pros: [
      "莫氏硬度 6-7级，耐刮耐磨，可用作直接切菜案板与放置滚烫热锅",
      "零吸水率 (0.02%)，酱油、红酒、咖啡泼溅 24小时不渗透",
      "食品级接触面，防霉抗菌防刮花，寿命长达数十年",
      "哑光细砂面触感温润，反光柔和不刺眼"
    ],
    cons: [
      "边角碰撞需做 45° 倒角防磕碰防护",
      "加工与打孔需要高精水刀切割，师傅手艺要求高"
    ],
    maintenanceTips: "任何油污用抹布加清水即可去除，可使用任何家庭清洁剂。"
  },
  {
    id: "mat-corian",
    name: "可丽耐 (Corian) 一体无缝人造石",
    category: "卫浴大平台一体盆与无缝拐角",
    cleanabilityScore: 96,
    warmthScore: 90,
    durabilityScore: 91,
    costScore: 82,
    bestFor: "卫浴洗手盆无缝一体大平台、转角水吧台",
    antiFingerprint: true,
    seamlessJoint: true,
    pros: [
      "台盆与台面完全无缝熔接热弯一体成型，彻底消灭玻璃胶发霉黑边",
      "触感温润如玉，完全没有天然石材的冰凉感",
      "可修复性极强，即使轻微刮痕经百洁布打磨即可恢复如新",
      "阻燃无毒，防菌性能达医用级"
    ],
    cons: [
      "耐热温度约 150°C，不宜直接放置刚离火的高温热锅（卫浴使用无此顾虑）"
    ],
    maintenanceTips: "日常用海绵擦拭，顽固污渍可用微量肥皂水或去污膏轻易擦除。"
  },
  {
    id: "mat-microcement",
    name: "纳米耐污微水泥 (Nano Microtopping)",
    category: "地面与墙面无缝通铺",
    cleanabilityScore: 88,
    warmthScore: 86,
    durabilityScore: 90,
    costScore: 76,
    bestFor: "全屋公区地面通铺、卫浴干区墙面、电视背景墙",
    antiFingerprint: true,
    seamlessJoint: true,
    pros: [
      "墙地顶一体无缝延伸，彻底消灭瓷砖缝隙，空间视觉放大感极其震撼",
      "表面具有双组份纳米聚氨酯保护层，防水防油防滑",
      "厚度仅 2-3mm，不占用层高，脚感温和无冰凉感"
    ],
    cons: [
      "对地面基层平整度要求极高，施工周期较长需多道工序"
    ],
    maintenanceTips: "日常使用吸尘器与微湿平拖把拖地即可，避免使用强酸性清洁剂。"
  }
];

export interface ConstructionStage {
  stageNumber: number;
  name: string;
  enName: string;
  durationWeeks: string;
  focus: string;
  keyCheckpoints: string[];
}

export interface BiohackingEcology {
  waterFiltrationChain: {
    stage: string;
    location: string;
    device: string;
    spec: string;
    healthBenefit: string;
  }[];
  circadianLightingCurve: {
    timeSlot: string;
    cct: string;
    intensity: string;
    biologicalGoal: string;
  }[];
}

export interface BudgetWeightCategory {
  category: string;
  percentage: number;
  budgetMYR: number;
  itemsSummary: string;
}

export const ZONES_DATA: ZoneData[] = [
  {
    id: "entrance",
    name: "入户玄关",
    enName: "Entrance Foyer",
    sqm: 3.8,
    sqft: 40.9,
    dimensionsMm: "1200 × 3160 mm",
    clearHeightMm: 2700,
    description: "入户垂直收纳鞋塔，靠右墙定制 350mm 进深顶天立地悬浮柜（底部悬空 180mm + 3000K 感应灯带），容量 40+ 双；中间 450mm 高置物台内嵌无线充，保留 850mm 宽敞净过道。",
    coordinates: { x: 50, y: 0, w: 50, h: 16 },
    ergonomicHighlights: [
      "350mm 进深顶天立地悬浮玄关柜（容量 40+ 双鞋）",
      "底部悬空 180mm（常穿鞋无需开门直接踢入，内嵌 3000K 感应灯带）",
      "中间镂空置物台 450mm 高（集成无线充电板与隐形弱电箱检修口）",
      "玄关过道净宽保持 850mm（双手提重物/换鞋畅通无阻）"
    ],
    mepPoints: ["DB配电总箱 1组", "入户照明双控开关", "弱电光纤 Fiber Socket"],
    smartDevices: ["Aqara D200 智能人脸门锁", "人体存在传感器 FP2", "超薄无边框智能开关 H1"]
  },
  {
    id: "kitchen",
    name: "开放式厨房",
    enName: "Open Kitchen",
    sqm: 5.2,
    sqft: 56.0,
    dimensionsMm: "2100 × 2475 mm",
    clearHeightMm: 2650,
    description: "L 型黄金三角动线（洗涤 ➔ 切配 ➔ 烹饪），15mm 哑光岩板耐高温抗刮台面，地柜内嵌台下大单盆与 45cm 洗碗机，吊柜底板嵌入 4000K 手扫料理灯，预留极窄边超白玻璃推拉门轨道。",
    coordinates: { x: 50, y: 16, w: 50, h: 15 },
    ergonomicHighlights: [
      "L 型黄金三角动线（洗涤区 ➔ 切配区 ➔ 烹饪区）",
      "15mm 哑光耐污岩板台面（耐高温、抗刮擦、零吸水率）",
      "地柜内嵌台下大单盆 + 45cm 嵌入式洗碗机",
      "吊柜底板嵌入 4000K 高显色手扫操作灯（消灭切菜暗角）",
      "预留极窄边超白玻璃推拉门轨道（半封闭/全开敞自由切换）"
    ],
    mepPoints: ["厨房水槽上下水 1组", "烟道排气口", "大功率动力插座 3组", "厨下RO电源"],
    smartDevices: ["Aqara 水浸传感器", "烟雾与天然气报警器", "厨下智能净水龙头", "手扫感应柜底线性灯"]
  },
  {
    id: "dining",
    name: "核心餐厅与中岛水吧",
    enName: "Dining & Island Bar",
    sqm: 4.2,
    sqft: 45.2,
    dimensionsMm: "1700 × 2470 mm",
    clearHeightMm: 2700,
    description: "1400×800mm 轻薄岩板餐桌（容纳 4 人用餐）靠厨房一侧延伸 300mm 吧台；侧墙定制 400mm 进深餐边柜塔，上层咖啡水吧，下层预留小厨宝与 RO 直饮出水。",
    coordinates: { x: 50, y: 31, w: 50, h: 19 },
    ergonomicHighlights: [
      "1400×800mm 轻薄岩板餐桌（4 人就餐，侧向延伸 300mm 吧台）",
      "400mm 进深薄型餐边柜水吧塔（咖啡机与日常营养补剂专属台面）",
      "下层预留小厨宝与 1000G RO 直饮水出水系统",
      "餐椅离岛台 800mm 舒适就坐与通行容差"
    ],
    mepPoints: ["岛台预埋升降轨道插座", "吧台下电热水器/RO直饮水点", "吊灯回路"],
    smartDevices: ["智能轨道插座（带电量统计）", "氛围色温吊灯 2700K-5000K", "智能即热饮水机"]
  },
  {
    id: "living",
    name: "景观客厅影音区",
    enName: "Landscape Living & AV",
    sqm: 13.5,
    sqft: 145.3,
    dimensionsMm: "3400 × 3970 mm",
    clearHeightMm: 2750,
    description: "微水泥/哑光木饰面电视墙，2800mm 长度悬浮地台（离地 150mm，管线全预埋）；2200mm 低矮直排皮质沙发（背高≤800mm 保障视线开阔），双眼防眩深杯射灯+极窄磁吸轨道灯。",
    coordinates: { x: 50, y: 50, w: 50, h: 35 },
    ergonomicHighlights: [
      "2800mm 悬浮电视地台（离地 150mm，扫地机畅行，管线内嵌入墙）",
      "2200mm 三人位低矮直排皮质沙发（靠背高度≤800mm，视野无遮挡）",
      "视距 2.5m~2.7m（85 吋电视 40° 黄金沉浸观影视野角）",
      "双眼防眩嵌入式深杯射灯 + 极窄磁吸轨道灯（UGR<10，视感层高最大化）"
    ],
    mepPoints: ["SMATV 电视点位", "15A 空调专用动力点", "5组五孔插座", "沙发侧 USB-C 快充"],
    smartDevices: ["Aqara 空调伴侣 P3", "电动蜂巢帘电机", "全景声电视背景 RGB 同步灯带", "FP2 微动传感器"]
  },
  {
    id: "balcony",
    name: "南向休闲景观阳台",
    enName: "SSE Landscape Balcony",
    sqm: 4.2,
    sqft: 45.2,
    dimensionsMm: "1200 × 3500 mm",
    clearHeightMm: 2850,
    description: "纯粹高空景观休憩空间，地面铺设户外高耐候炭化防腐木地板与鹅卵石收边，配置户外单人休闲椅与轻便圆几，享受南偏东 165° 零西晒温和晨光与城市天际线。",
    coordinates: { x: 50, y: 85, w: 50, h: 15 },
    ergonomicHighlights: [
      "地面铺设高耐候炭化防腐木地板 + 鹅卵石自然收边",
      "单人户外休闲椅 + 轻便小圆几（晨起冥想与晚风品酒）",
      "南偏东 165° 零西晒，全天候柔和漫射自然采光",
      "24 楼高空无遮挡俯瞰新山城市天际线与新加坡远景"
    ],
    mepPoints: ["防水双联插座 1组", "地漏排水平面", "外墙吸顶防水灯"],
    smartDevices: ["太阳能户外微光感应灯", "温湿度气象站传感器", "植物土壤湿度监测仪"]
  },
  {
    id: "study",
    name: "极客多功能书房 (1+1房)",
    enName: "Geek Multi-Function Study",
    sqm: 6.8,
    sqft: 73.2,
    dimensionsMm: "2400 × 2830 mm",
    clearHeightMm: 2700,
    description: "极窄黑框折叠长虹玻璃移门（日常开敞融入公区视觉放大 20%，专注闭合形成隔音舱）；1600×750mm 双电机升降桌 + 加厚双屏悬臂区 + 隐藏理线架；通顶书柜嵌入 900×1900mm 隐藏翻板床（Murphy Bed）。",
    coordinates: { x: 0, y: 17, w: 50, h: 18 },
    ergonomicHighlights: [
      "极窄黑框折叠长虹玻璃移门（日常开敞空间放大20%，闭合声学降噪办公）",
      "1600×750mm 双电机升降桌（加厚双屏悬臂区 + 下方隐藏理线架）",
      "通顶书柜内嵌 900×1900mm 隐藏式翻板床（Murphy Bed，兼顾偶有留宿需求）",
      "工位专属 4000K Ra>95 护眼照明 + 声学吸音毛毡护墙"
    ],
    mepPoints: ["15A 空调动力点", "千兆网络接口 RJ45", "工位 8组高密度抗涌浪插座", "顶面吸顶磁吸轨道"],
    smartDevices: ["智能升降桌联动控制器", "Aqara 智能窗帘控制器", "屏幕挂灯与背光流光溢彩联动", "入座自动亮屏传感器"]
  },
  {
    id: "bedroom",
    name: "主卧室深睡舱",
    enName: "Master Bedroom Suite",
    sqm: 14.2,
    sqft: 152.8,
    dimensionsMm: "3500 × 4050 mm",
    clearHeightMm: 2700,
    description: "居中放置 1800×2000mm King Size 悬浮大床（床底内嵌 2700K 暖光感应起夜灯）；内侧定制 2400mm 宽顶天立地一字型哑光衣柜（深600mm，分长衣/抽屉/大行李箱位）；南向大窗配置双层电动窗帘（纱帘+100%全遮光）。",
    coordinates: { x: 0, y: 61, w: 50, h: 39 },
    ergonomicHighlights: [
      "1800×2000mm King Size 悬浮大床（床底内嵌 2700K 暖光起夜感应灯）",
      "2400mm 宽顶天立地一字型哑光衣柜（进深 600mm，长衣/叠放/行李箱分区）",
      "南向大窗双层电动导轨（高透光纱帘 + 100% 遮光静音布帘）",
      "床侧保留 750mm 舒适更衣与通行通道"
    ],
    mepPoints: ["15A 空调专用点", "床头双侧 USB+Type-C 插座", "满墙衣柜内置 LED 变压器预留"],
    smartDevices: ["Aqara 智能双轨电动窗帘 (纱帘+全遮光)", "睡眠监测雷达", "床底感应起夜小夜灯", "智能温控空调联动"]
  },
  {
    id: "bathroom",
    name: "独立卫浴室 (干湿分离)",
    enName: "Master Bathroom 1",
    sqm: 4.5,
    sqft: 48.4,
    dimensionsMm: "1700 × 2650 mm",
    clearHeightMm: 2550,
    description: "一字型高效动线（台盆区 ➔ 智能马桶区 ➔ 淋浴房）；定制悬空 250mm 浴室柜（无卫生死角）+ 大容量一体式除雾镜柜（内置插座+4000K无影面光）；淋浴房安装 8mm 超白钢化玻璃隔断与恒温防烫花洒。",
    coordinates: { x: 0, y: 35, w: 50, h: 26 },
    ergonomicHighlights: [
      "一字型高效干湿分离动线（台盆区 ➔ 智能马桶区 ➔ 淋浴房）",
      "悬空 250mm 浴室柜（无卫生死角，扫地机畅行）",
      "大容量一体镜柜（防雾发光 + 内置电动牙刷/吹风机插座）",
      "8mm 超白钢化玻璃隔断 + 恒温防烫精铜花洒系统"
    ],
    mepPoints: ["20A 电热水器独立点", "1.5m 镜柜内隐藏防溅插座", "智能马桶电源预留", "干湿分离地漏"],
    smartDevices: ["智能镜面恒温除雾控制器", "智能感应夜间微光地脚灯", "高精度水浸防漏传感器"]
  },
  {
    id: "yard",
    name: "生活阳台 (家政中枢)",
    enName: "Service Yard",
    sqm: 3.8,
    sqft: 40.9,
    dimensionsMm: "1400 × 2710 mm",
    clearHeightMm: 2700,
    description: "西北侧独立封闭家政中枢，定制铝合金防潮高柜上下垂直叠放洗烘套装（洗衣机 + 热泵烘干机）；配置深槽陶瓷家政水槽与扫拖机自动上下水，空调外机区加装消音百叶与防尘金刚网。",
    coordinates: { x: 0, y: 0, w: 50, h: 17 },
    ergonomicHighlights: [
      "定制铝合金防潮高柜垂直叠放洗烘套装（洗衣机 + 热泵烘干机）",
      "深槽陶瓷家政水槽 + 清洁工具充电收纳位",
      "扫拖机器人自动上下水与防溢漏电磁切断阀",
      "空调外机加装消音百叶与防尘金刚网（阻隔外部杂物与震动噪音）"
    ],
    mepPoints: ["洗衣机专用上下水与动力电", "空调外机 3组回路", "扫拖机器人自动排污"],
    smartDevices: ["户外水浸传感器", "漏水自动切断阀", "智能插座电量监测"]
  }
];

export const CONSTRUCTION_ROADMAP: ConstructionStage[] = [
  {
    stageNumber: 1,
    name: "交房验收与缺陷核查",
    enName: "Defect Check & Handover",
    durationWeeks: "第 1 周",
    focus: "空鼓、空开回路测试、门窗密封度、给排水坡度与水压测试",
    keyCheckpoints: [
      "使用红外热成像仪检查窗框与外墙渗水隐患",
      "全屋配电箱回路标注与接地电阻阻抗检测",
      "排水管通水排污测试与地漏防臭封盖检查"
    ]
  },
  {
    stageNumber: 2,
    name: "隐蔽机电与水路管线深化改造",
    enName: "Concealed MEP & Smart Wiring",
    durationWeeks: "第 2-3 周",
    focus: "零火线智能布线、大功率空调回路、工位万兆网线、水循环三道过滤预埋",
    keyCheckpoints: [
      "入户主水表后加装 40μm 大流量前置过滤器预留位",
      "厨房直饮水管暗埋延伸至餐厅水吧台",
      "极客工位与电视背景墙 50mm 穿线管（防外露杂线）",
      "天花双轨电动窗帘 220V 供电线与吸顶 AP 预留"
    ]
  },
  {
    stageNumber: 3,
    name: "泥瓦、天花吊顶与木工基层打底",
    enName: "Civil Works & Framing",
    durationWeeks: "第 4-6 周",
    focus: "全屋轻钢龙骨耐潮吊顶、反光灯槽制作、书房移门暗藏轨道、卫浴防水",
    keyCheckpoints: [
      "全屋天花采用 9mm 耐潮石膏板，回字形无影反光灯槽",
      "卫浴干湿区双层刚柔性防水涂料（闭水试验 48 小时）",
      "书房极窄折叠移门顶轨受力钢梁加固与隐蔽收纳槽制作"
    ]
  },
  {
    stageNumber: 4,
    name: "全屋高定柜体与台面石材安装",
    enName: "Custom Joinery & Stone Surfaces",
    durationWeeks: "第 7-9 周",
    focus: "顶天立地柜体进场、超薄岩板中岛、卫浴大平台一体台面、长虹玻璃移门",
    keyCheckpoints: [
      "纳米抗指纹超哑 PET 门板激光封边与阻尼反弹器调试",
      "1400×800mm 岩板中岛与悬浮电视地台水平校准",
      "卫浴 1.8m 悬浮岩板台面钢架承重测试（承重>150kg）"
    ]
  },
  {
    stageNumber: 5,
    name: "Aqara 智能联调、家具进场与空气治理",
    enName: "Smart Ecosystem & Soft Furnishings",
    durationWeeks: "第 10-11 周",
    focus: "M3 网关 Matter/Thread 场景调试、生物节律光热联动、家具摆放与交付",
    keyCheckpoints: [
      "5 大定制智能自动化场景（晨间唤醒/极客专注/沉浸影音/深睡/离家）端到端联调",
      "24小时生物节律照明算法曲线（4000K -> 3000K -> 2700K）自动执行",
      "直排沙发、1.8m King Size 悬浮大床与人体工学椅进场定位",
      "全屋新风与光触媒空气净化治理，甲醛与 TVOC 达标交付"
    ]
  }
];

export const BIOHACKING_ECOLOGY: BiohackingEcology = {
  waterFiltrationChain: [
    {
      stage: "第一道：入户前置总过滤",
      location: "主供水入户总管（生活阳台/水表井）",
      device: "大流量反冲洗前置过滤器",
      spec: "40 微米食品级 316L 不锈钢滤网，额定流量 4.5T/h",
      healthBenefit: "有效拦截市政管网铁锈、泥沙、红虫，保护全屋涉水家电与涉水龙头寿命。"
    },
    {
      stage: "第二道：厨下+水吧双端直饮",
      location: "厨房水槽下方 ➔ 餐厅餐边柜水吧",
      device: "1000G 大通量反渗透 (RO) 直饮净水机",
      spec: "0.0001 微米 RO 膜，双出水龙头，直连手冲咖啡与即热饮水机",
      healthBenefit: "滤除重金属、抗生素与微塑料，TDS<10，保障日常纯净饮水与咖啡风味萃取。"
    },
    {
      stage: "第三道：卫浴健康洗浴除氯",
      location: "独立卫浴室恒温花洒前端",
      device: "微米级亚硫酸钙除氯除杂滤芯",
      spec: "高吸附 VC 复合滤芯，有效去除余氯 >99%",
      healthBenefit: "避免热水挥发氯气吸入呼吸道，保护头皮屏障与娇嫩肌肤，改善发质干涩。"
    }
  ],
  circadianLightingCurve: [
    {
      timeSlot: "08:00 ~ 16:00 (日间高效期)",
      cct: "4000K 高显色中性白光 (Ra>95)",
      intensity: "80% ~ 100% 照度",
      biologicalGoal: "有效抑制褪黑素分泌，刺激皮质醇正常释放，提升大脑认知效率与工作专注度。"
    },
    {
      timeSlot: "17:00 ~ 20:00 (傍晚过渡期)",
      cct: "3000K 柔和暖白光",
      intensity: "50% ~ 70% 照度",
      biologicalGoal: "温和模拟黄昏自然光谱，平稳过渡情绪，降低交感神经兴奋性，促进身心放松。"
    },
    {
      timeSlot: "20:00 ~ 07:00 (夜间深睡准备)",
      cct: "2700K 琥珀极暖暗光 (低照度地脚漫射)",
      intensity: "15% ~ 30% (起夜 5%)",
      biologicalGoal: "零蓝光刺激，促使大脑松果体正常分泌褪黑素，缩短入睡潜伏期，延长深度睡眠。"
    }
  ]
};

export const BUDGET_WEIGHT_DISTRIBUTION: BudgetWeightCategory[] = [
  {
    category: "全屋高定柜体与木作",
    percentage: 35,
    budgetMYR: 21800,
    itemsSummary: "玄关鞋柜、岩板中岛、悬浮地台、主卧通顶衣柜、书房移门与大件行李箱柜"
  },
  {
    category: "机电、空调与水循环系统",
    percentage: 20,
    budgetMYR: 12500,
    itemsSummary: "3台变频空调、全屋三道净水系统、电热水器、强弱电增补与高阶开关插座"
  },
  {
    category: "Aqara 智能与无主灯照明",
    percentage: 15,
    budgetMYR: 9350,
    itemsSummary: "M3 中枢、FP2 存在雷达、C3 电动窗帘电机、防眩磁吸轨道与生物节律灯带"
  },
  {
    category: "硬装土建与吊顶油漆",
    percentage: 15,
    budgetMYR: 9350,
    itemsSummary: "轻钢龙骨耐潮石膏板平顶、反光灯槽、艺术涂料/微水泥、地砖打底"
  },
  {
    category: "移动家具与软装配饰",
    percentage: 15,
    budgetMYR: 9350,
    itemsSummary: "直排沙发、1.8m King Size 悬浮大床与床垫、岩板餐桌椅、阳台防腐木设施"
  }
];

export const STYLES_DATA: StyleData[] = [
  {
    id: "tech-minimal",
    name: "现代极简科技风",
    enName: "Modern Tech Minimalist",
    tagline: "德系冷暖平衡 · 理性干练 · 空间通透",
    badge: "推荐度最高 / 极客首选",
    themeColor: "#0284c7",
    accentColor: "#38bdf8",
    bgGradient: "from-slate-900 via-slate-800 to-sky-950",
    description: "以纯白、太空冷灰为基底，穿插极细黑砂纹金属线条与超白长虹玻璃。强调收纳的完全隐形与空间的无界延伸，让 648 sq ft 展现出 900 sq ft 的视觉体量。",
    coreVibe: "利落、理性、高效，科技与生活无缝融合，白天通透开阔，夜晚科技感拉满。",
    palette: [
      { name: "太空冷灰 (Space Grey)", hex: "#e2e8f0", role: "大面积墙面乳胶漆与哑光柜体" },
      { name: "纯粹极白 (Pure White)", hex: "#f8fafc", role: "顶面与极简无框隐形门" },
      { name: "黑砂纹阳极氧化铝 (Matte Black)", hex: "#0f172a", role: "极细移门边框、磁吸轨道与五金" },
      { name: "超白长虹玻 (Fluted Glass)", hex: "#cbd5e1", role: "书房隔断与通透采光界面" },
      { name: "冰蓝光效 (Cyber Cyan)", hex: "#38bdf8", role: "智能线性背景呼吸光" }
    ],
    keyMaterials: [
      { category: "全屋柜体", item: "纳米抗指纹超哑 PET 肤感板", spec: "德国雷诺丽特 / 激光封边 / E0级" },
      { category: "台面系统", item: "劳伦白金超薄岩板 / 可丽耐一体台面", spec: "12mm厚度 / 耐磨耐高温零渗透" },
      { category: "特色木作", item: "天然浅白橡木实木木皮", spec: "开放漆工艺 / 温润触感" },
      { category: "卫浴大镜", item: "超薄智能触控除雾大镜柜", spec: "全宽 1500mm / 4000K 无影美妆光" },
      { category: "灯光系统", item: "UGR<10 深防眩射灯 + 线性洗墙灯槽", spec: "RA>97高显色 / 3000K-4000K 智能可调" }
    ],
    lightingStrategy: {
      cct: "3000K - 4000K 智能双色温可调",
      mainLight: "全屋无主灯设计，采用 7mm 极窄内嵌磁吸轨道泛光条 + 防眩深杯射灯（遮光角>38°）",
      ambient: "天花微悬浮洗墙线性灯带，踢脚线离地 20mm 悬浮光效",
      geekSync: "工位与电视背景光支持 Apple HomeKit / Aqara 律动同步"
    },
    pros: [
      "空间视觉放大感最强，648 sq ft 通透感极致",
      "全屋反弹无把手设计，极简耐看且打理省心",
      "极客多屏工位与现代硬朗数码产品完美契合",
      "南向充足漫射光与冷灰白调产生高级质感"
    ],
    cons: [
      "施工对墙面平整度（冲筋打底）与阴阳角收口精度要求极高",
      "需要良好的收纳自律性，物品外露容易破坏极简感"
    ],
    radarScores: {
      openness: 98,
      maintenance: 96,
      costEfficiency: 88,
      geekSynergy: 99,
      sleepComfort: 88,
      resaleValue: 95
    },
    roomRenderings: [
      {
        room: "卫浴大平台与大镜面",
        title: "酒店级 1.5m 贯穿式悬浮大台面与满墙大镜柜",
        description: "无缝岩板大台面由洗手盆延伸跨越至马桶上方，形成 1.5m 整体大理石大平台；上方为通宽触控除雾无框大镜柜，上下透出柔和 3500K 洗墙漫射光。",
        visualStyle: "劳伦白金岩板 + 纯白大镜柜 + 3500K 无影面光",
        focalPoints: ["1.5m 贯穿式悬浮大台面", "满墙超薄除雾镜柜", "一体成型防溅大单盆", "底部悬浮感应地脚灯"],
        gradientPreview: "from-slate-900 via-sky-950 to-slate-800"
      },
      {
        room: "客厅与中岛吧台",
        title: "无界公区与贯穿式大收纳悬浮科技吧台",
        description: "85寸壁画电视无缝贴墙，中岛岩板台面延伸为 2人高脚吧台，地面大砖通铺与超白长虹移门形成纵深通透视线。",
        visualStyle: "冷灰基底 + 黑色线性轨道 + 3500K 柔和洗墙光",
        focalPoints: ["悬浮岩板中岛", "一体式大收纳墙", "极简科技布直排沙发", "极窄磁吸灯带"],
        gradientPreview: "from-slate-800 via-sky-900 to-slate-900"
      },
      {
        room: "极客工作站 (1+1)",
        title: "人体工学高性能双屏极客工位",
        description: "2.0m×0.8m 升降桌，双 32寸 4K 显示器支架悬浮，侧面整面定制 600mm 深度大高柜（下层直通可推入 28寸大行李箱）。",
        visualStyle: "温润实木台面 + 赛博冷蓝背景光 + 4000K 专注桌面照明",
        focalPoints: ["双屏悬浮支架", "Herman Miller 人体工学椅", "行李箱直推高柜", "隐藏式金属走线槽"],
        gradientPreview: "from-cyan-950 via-slate-900 to-blue-950"
      },
      {
        room: "主卧深睡区",
        title: "纯粹极简深睡悬浮主卧",
        description: "1.8m 科技布悬浮床架（床底带低照度柔光感应起夜灯），满墙一字型纯白哑光抗指纹衣柜，南向落地窗配置电动双轨蜂巢帘。",
        visualStyle: "浅灰哑光乳胶漆 + 2700K 暖光洗墙 + 纯白隐形衣柜",
        focalPoints: ["床底悬浮夜灯", "全隐藏空调出风口", "全遮光电动帘", "极简悬浮床头柜"],
        gradientPreview: "from-slate-900 via-indigo-950 to-slate-800"
      }
    ]
  },
  {
    id: "dark-luxury",
    name: "意式暗调高级黑",
    enName: "Italian Dark Luxury & Stealth",
    tagline: "深邃沉稳 · 黑胡桃质感 · 极客私密感",
    badge: "质感天花板 / 尊享奢雅",
    themeColor: "#b45309",
    accentColor: "#f59e0b",
    bgGradient: "from-neutral-950 via-stone-900 to-amber-950",
    description: "以深灰、碳黑与天然黑胡桃木饰面为主调，点缀黑金岩板与深色灰玻。在 2700K 暖琥珀色隐藏灯带的烘托下，呈现顶级私享公寓的神秘沉静与奢雅格调。",
    coreVibe: "内敛、尊贵、极具包容感，宛如私密极客雪茄吧与高定会客厅，夜间开灯氛围感无敌。",
    palette: [
      { name: "碳黑 (Carbon Black)", hex: "#171717", role: "定制柜体框架与金属收口" },
      { name: "黑胡桃木 (Smoked Walnut)", hex: "#3f2d24", role: "背景墙饰面与木作台面" },
      { name: "劳伦黑金岩板 (Nero Marquina)", hex: "#262626", role: "中岛吧台与电视地台" },
      { name: "透光黑灰玻 (Smoked Glass)", hex: "#404040", role: "展示柜门与书房隔断" },
      { name: "琥珀暖光 (Amber Glow)", hex: "#f59e0b", role: "2700K 线性氛围背光" }
    ],
    keyMaterials: [
      { category: "全屋柜体", item: "深灰纳米抗指纹肤感板 + 黑色铝框灰玻", spec: "E0级环保 / 内置感应暖光灯槽" },
      { category: "特色木作", item: "天然黑胡桃实木木皮饰面", spec: "哑光开放漆质感 / 纹理温润" },
      { category: "台面系统", item: "进口劳伦黑金哑光岩板", spec: "细金纹理 / 莫氏硬度6级" },
      { category: "卫浴大镜", item: "灰玻金属窄框智能恒温除雾大镜柜", spec: "1500mm 贯穿式 / 琥珀背光" },
      { category: "灯光系统", item: "黑光深防眩射灯 + 2700K 琥珀灯带", spec: "黑光反射杯 / 见光不见灯" }
    ],
    lightingStrategy: {
      cct: "2700K - 3000K 极暖琥珀色调",
      mainLight: "超窄光束角 15°/24° 黑光射灯，精准点亮艺术品与桌面，背景处于微光暗调",
      ambient: "柜体内部层板嵌入式向下斜角灯带，天花悬浮反光槽",
      geekSync: "工位支持暗夜模式，RGB 呼吸微光与黑胡桃木纹交相辉映"
    },
    pros: [
      "材质质感与档次感极高，拍照与夜间氛围极其震撼",
      "深色背景极度吸收杂光，看电影、打电竞的沉浸感无可比拟",
      "抗污能力极强，日常轻微灰尘不易显眼",
      "保值感强，符合高端国际公寓租客与高净值买家偏好"
    ],
    cons: [
      "白天需要合理的灯光补光，否则公区采光略显沉稳厚重",
      "黑胡桃木与岩板的高定造价比常规乳胶漆稍高约 20-30%"
    ],
    radarScores: {
      openness: 82,
      maintenance: 95,
      costEfficiency: 78,
      geekSynergy: 94,
      sleepComfort: 96,
      resaleValue: 92
    },
    roomRenderings: [
      {
        room: "卫浴大平台与大镜面",
        title: "黑金大理石贯穿大平台与奢华灰玻镜柜",
        description: "整面劳伦黑金岩板悬浮大平台贯穿马桶上方，枪灰色暗装瀑布出水龙头，灰玻边框除雾大镜柜下透出 2700K 琥珀暖光。",
        visualStyle: "黑金岩板 + 枪灰色五金 + 2700K 琥珀洗墙光",
        focalPoints: ["劳伦黑金贯穿大平台", "暗装枪灰入墙龙头", "琥珀氛围大镜柜", "除雾电热毛巾架"],
        gradientPreview: "from-stone-950 via-amber-950 to-neutral-900"
      },
      {
        room: "客厅与中岛吧台",
        title: "黑金岩板中岛与黑胡桃影音空间",
        description: "整面黑胡桃木木饰面电视墙内嵌 85寸大屏，劳伦黑金岩板中岛下透出暖金色微光，搭配焦糖色真皮单人椅。",
        visualStyle: "碳黑基调 + 黑胡桃木纹 + 2700K 琥珀悬浮光",
        focalPoints: ["黑金岩板中岛", "黑胡桃木格栅背景", "焦糖真皮沙发", "隐藏式红酒恒温柜"],
        gradientPreview: "from-stone-950 via-amber-950 to-neutral-900"
      },
      {
        room: "极客工作站 (1+1)",
        title: "暗夜极客作战指挥室",
        description: "胡桃木大板桌面搭配深空灰金属工位，背墙为黑玻手办与数码装备发光展示柜，氛围宛如科技大厂高管独立工位。",
        visualStyle: "深色灰玻 + 琥珀背光 + 暗调哑光工作台",
        focalPoints: ["定制黑胡桃大板台", "灰玻发光外设展柜", "暗调多屏工作站", "静音吸音毛毡墙"],
        gradientPreview: "from-neutral-950 via-zinc-900 to-amber-950"
      },
      {
        room: "主卧深睡区",
        title: "五星级奢雅暗调深睡套房",
        description: "床头采用深灰皮质软包拼接黑胡桃木饰面，两侧垂挂极细黄铜吊灯，营造彻底松弛的睡眠私密包裹感。",
        visualStyle: "深灰软包 + 2700K 柔光床头灯 + 碳黑衣柜",
        focalPoints: ["悬浮皮质大床", "灰玻半透光衣橱", "窗边雪茄观景椅", "全遮光丝绒电动帘"],
        gradientPreview: "from-neutral-950 via-stone-900 to-neutral-900"
      }
    ]
  },
  {
    id: "japandi-wood",
    name: "温暖治愈原木",
    enName: "Japandi & Warm Natural",
    tagline: "日式侘寂 · 白橡原木 · 治愈温润",
    badge: "舒适度最佳 / 温暖明亮",
    themeColor: "#d97706",
    accentColor: "#fde68a",
    bgGradient: "from-amber-950/40 via-stone-900 to-amber-950/30",
    description: "融合北欧极简与日式侘寂的温润精髓。采用大面积暖白乳胶漆、天然浅白橡木与米色棉麻软装，让阳光漫射在整个房间，带来全天候的松弛治愈感。",
    coreVibe: "自然、纯粹、治愈、明亮，归家一瞬间彻底卸下白天的疲惫与紧绷。",
    palette: [
      { name: "暖白/燕麦色 (Warm Cream)", hex: "#fef3c7", role: "墙面乳胶漆与天花" },
      { name: "浅白橡木 (White Oak)", hex: "#d4a373", role: "全屋定制柜体、餐桌与地板" },
      { name: "微水泥米灰 (Warm Microcement)", hex: "#e7e5e4", role: "地面与局部特色背景墙" },
      { name: "棉麻原色 (Natural Linen)", hex: "#f5f5f4", role: "窗帘、布艺沙发与床品" },
      { name: "晨曦暖阳 (Sunrise Amber)", hex: "#fef08a", role: "3000K 柔和漫射环境光" }
    ],
    keyMaterials: [
      { category: "全屋木作", item: "天然浅白橡木木皮 + 暖白抗指纹门板", spec: "圆弧倒角工艺 / 无外露把手" },
      { category: "台面系统", item: "米白色无缝人造石 / 哑光石英石", spec: "食品级防污 / 圆润边角" },
      { category: "卫浴大镜", item: "白橡木边框超大触控除雾镜柜", spec: "1500mm 通体大平台 / 3000K 暖光" },
      { category: "地面工程", item: "浅橡木人字拼 SPC / 暖色微水泥", spec: "无醛耐磨 / 踩踏脚感温润" },
      { category: "灯光系统", item: "超薄无边框防眩筒灯 + 见光不见灯漫射槽", spec: "3000K 暖白光 / 柔和漫射" }
    ],
    lightingStrategy: {
      cct: "3000K 恒定自然暖白光",
      mainLight: "大面积见光不见灯的漫射反射槽，天花如同一整面发光体",
      ambient: "角落配置野口勇 (Isamu Noguchi) 风格和纸落地灯，柔和温暖",
      geekSync: "工位屏幕挂灯色温自动匹配全屋暖光，降低长时间代码用眼疲劳"
    },
    pros: [
      "心理治愈感与生活松弛感拉满，久住极其舒适不易审美疲劳",
      "全天采光漫射极佳，完美呼应南向 SSE 充足自然阳光",
      "造价相对平易近人，材料环保健康指标极高",
      "受大众喜爱度广，未来出租给外企白领或情侣极具吸引力"
    ],
    cons: [
      "浅色棉麻与天然木质需要注意防止咖啡或重油污泼溅",
      "如果数码外设黑色塑料感过重，需要精心挑选银白/木质外壳搭配"
    ],
    radarScores: {
      openness: 94,
      maintenance: 85,
      costEfficiency: 92,
      geekSynergy: 86,
      sleepComfort: 99,
      resaleValue: 94
    },
    roomRenderings: [
      {
        room: "卫浴大平台与大镜面",
        title: "暖白人造石无缝大平台与橡木除雾镜柜",
        description: "米白无缝一体台盆大平台温润如玉，横跨至马桶上方，白橡木边框智能镜柜散发 3000K 治愈暖光，彻底消灭卫生死角。",
        visualStyle: "可丽耐米白一体台 + 白橡木镜柜 + 3000K 柔光",
        focalPoints: ["无缝一体成型大单盆", "贯穿马桶置物大平台", "白橡木暖光镜柜", "防潮抗菌微水泥墙"],
        gradientPreview: "from-amber-900/50 via-stone-800 to-amber-950"
      },
      {
        room: "客厅与中岛吧台",
        title: "暖阳原木公区与水磨石咖啡吧",
        description: "暖白微水泥地面通铺，白橡木中岛台搭配米白棉麻直排羽绒沙发，阳光透过香格里拉帘在木地板上形成光栅斑驳。",
        visualStyle: "浅橡木色 + 暖白乳胶漆 + 3000K 漫反射柔光",
        focalPoints: ["白橡木水磨石中岛", "香格里拉遮光帘", "燕麦色棉麻沙发", "和纸艺术吊灯"],
        gradientPreview: "from-amber-900/50 via-stone-800 to-amber-950"
      },
      {
        room: "极客工作站 (1+1)",
        title: "温润木质极客书房与灵感工位",
        description: "白橡木实木升降桌面配合银白色 MacBook 与铝合金支架，侧面整面原木书架与大容量储物柜，充满自然清新与专注力。",
        visualStyle: "浅木纹理 + 银白铝合金外设 + 3500K 护眼阅读光",
        focalPoints: ["原木电动升降桌", "行李箱专用收纳大柜", "白橡木满墙书架", "绿植与棉麻地毯"],
        gradientPreview: "from-amber-950 via-stone-900 to-amber-900/40"
      },
      {
        room: "主卧深睡区",
        title: "日式侘寂原木低地台深睡空间",
        description: "橡木低矮地台床垫搭配无主灯见光不见灯反光灯槽，床头一侧悬垂日式草编吊灯，伴随微风享受极致婴儿级睡眠。",
        visualStyle: "橡木地台 + 暖白墙面 + 2700K 床底暖光",
        focalPoints: ["原木地台床", "百叶透光窗帘", "棉麻水洗床品", "极简原木衣柜"],
        gradientPreview: "from-stone-900 via-amber-950 to-stone-900"
      }
    ]
  },
  {
    id: "industrial-cyber",
    name: "硬核工业未来感",
    enName: "Industrial Cyber & Futurism",
    tagline: "微水泥原灰 · 不锈钢金属 · 极客未来主义",
    badge: "硬核工程师 / 赛博个性",
    themeColor: "#06b6d4",
    accentColor: "#22d3ee",
    bgGradient: "from-slate-950 via-zinc-900 to-cyan-950",
    description: "专为硬核开发者与极客打造。采用原色微水泥墙地一体化、拉丝不锈钢定制中岛、明装工业黑色磁吸轨道与局部 Cyberpunk 霓虹色彩，彰显不羁的科技探索精神。",
    coreVibe: "硬朗、前沿、充满张力，像极了硅谷顶尖实验室与赛博空间基地。",
    palette: [
      { name: "水泥原灰 (Concrete Grey)", hex: "#71717a", role: "微水泥墙地一体化艺术涂层" },
      { name: "拉丝不锈钢 (Brushed Stainless)", hex: "#94a3b8", role: "中岛台面、橱柜局部与门套" },
      { name: "哑光碳黑 (Matte Black)", hex: "#18181b", role: "工业铝合金型材、明装风管" },
      { name: "赛博电光蓝 (Cyber Electric Blue)", hex: "#06b6d4", role: "RGB 流光电竞与工位背光" },
      { name: "工业警戒橙 (Signal Orange)", hex: "#f97316", role: "局部五金构件与电线装饰点缀" }
    ],
    keyMaterials: [
      { category: "墙面地面", item: "进口工业纳米耐污微水泥", spec: "耐磨抗裂防油污 / 无缝一体通铺" },
      { category: "全屋柜体", item: "深灰金属覆膜板 + 黑色金属冲孔网", spec: "抗指纹涂层 / 工业机械锁扣" },
      { category: "台面系统", item: "304食品级拉丝不锈钢台面 / 岩板", spec: "一体无缝折弯焊接 / 工业机械感" },
      { category: "卫浴大镜", item: "拉丝不锈钢边框超宽除雾大镜柜", spec: "1500mm 贯穿式 / 冷白与赛博蓝光" },
      { category: "灯光系统", item: "明装工业轨道射灯 + 线性 RGB 霓虹光带", spec: "4000K-5000K 冷白专注 + RGB 同步" }
    ],
    lightingStrategy: {
      cct: "4000K 冷白基调 + 局部动态 RGB",
      mainLight: "明装金属黑色轨道射灯，结构外露，光束感极强",
      ambient: "地脚处内嵌赛博蓝/琥珀橙线性光带，模拟未来太空舱引导灯",
      geekSync: "工位与 Razer Chroma / Home Assistant 深度联动，编译成功亮绿，报错亮红"
    },
    pros: [
      "极具个性与视觉冲击力，独一无二的极客科技居住体验",
      "不锈钢与微水泥极其耐磨耐造，不怕刮蹭，越用越有复古工业质感",
      "工位与三屏多设备科技感契合度 100%",
      "无缝一体化微水泥地面，完全没有瓷砖拼缝的清扫烦恼"
    ],
    cons: [
      "整体色调偏冷峻硬朗，对居家温馨感要求高的人群可能需要适应",
      "微水泥施工对基层平整度与施工师傅的手工手艺极其严苛"
    ],
    radarScores: {
      openness: 89,
      maintenance: 92,
      costEfficiency: 84,
      geekSynergy: 99,
      sleepComfort: 82,
      resaleValue: 86
    },
    roomRenderings: [
      {
        room: "卫浴大平台与大镜面",
        title: "微水泥一体大平台与拉丝金属大镜柜",
        description: "微水泥无缝台面延伸至马桶上方，搭配拉丝不锈钢水龙头与防雾大镜柜，赛博蓝微光地脚引导，极具机械未来感。",
        visualStyle: "微水泥原灰 + 拉丝不锈钢 + 4000K 极客光",
        focalPoints: ["微水泥一体贯穿大平台", "拉丝不锈钢暗装龙头", "超宽除雾镜柜", "赛博地脚微光灯"],
        gradientPreview: "from-zinc-900 via-slate-950 to-cyan-950"
      },
      {
        room: "客厅与中岛吧台",
        title: "拉丝不锈钢中岛与微水泥科技客厅",
        description: "一体成型拉丝不锈钢中岛，灰色微水泥墙面，黑色金属工业管线明装走向，搭配黑色科技布模块沙发与超薄大屏。",
        visualStyle: "水泥灰 + 金属不锈钢 + 赛博冷蓝线性光",
        focalPoints: ["不锈钢一体中岛", "微水泥艺术墙面", "明装黑色工业轨道", "金属冲孔收纳柜"],
        gradientPreview: "from-zinc-950 via-slate-900 to-cyan-950"
      },
      {
        room: "极客工作站 (1+1)",
        title: "赛博朋克多屏终极开发工位",
        description: "重型工业铝合金升降桌，三屏环绕支架，背景为黑色金属冲孔板挂载显卡机箱与机械键盘，全套 RGB 代码环境律动。",
        visualStyle: "冲孔金属板 + 三屏曲面 + 赛博 RGB 动态光",
        focalPoints: ["工业升降工作台", "金属冲孔外设墙", "三屏曲面显示阵列", "服务器迷你机柜"],
        gradientPreview: "from-cyan-950 via-zinc-900 to-slate-950"
      },
      {
        room: "主卧深睡区",
        title: "未来太空舱极简深睡舱",
        description: "深灰微水泥床头背景墙，嵌入式暗藏地脚引导灯带，黑色哑光金属悬浮床架与深灰遮光电动帘，科技感与隔音一流。",
        visualStyle: "微水泥灰 + 黑色金属 + 3000K 暗调睡眠光",
        focalPoints: ["金属悬浮静音床", "太空舱暗门衣柜", "声学吸音毛毡板", "智能微气候温控"],
        gradientPreview: "from-slate-950 via-zinc-900 to-blue-950"
      }
    ]
  }
];

export const SMART_SCENES_DATA: SmartScene[] = [
  {
    id: "deep-work",
    name: "沉浸编程模式",
    enName: "Deep Code & Focus",
    icon: "Code",
    description: "书房升降桌自动调整至专注高度，工位照明切换为 4200K 冷白无频闪高显色，百叶窗微调 45° 避免反光，空调恒温 23.5°C。",
    trigger: "按下工位无线开关 / Siri语音: 'Hey Siri, 进入专注模式'",
    actions: [
      { zone: "极客工作站", device: "智能升降桌", state: "升至 74cm", details: "人体工学坐姿预设" },
      { zone: "极客工作站", device: "工位顶灯与屏幕挂灯", state: "色温 4200K / 亮度 90%", details: "Ra>98 高显色无频闪" },
      { zone: "极客工作站", device: "智能电动百叶帘", state: "偏转 45°", details: "消除屏幕反光与眩光" },
      { zone: "全屋公区", device: "Aqara 空调伴侣 P3", state: "制冷 23.5°C / 静音风", details: "保持头脑清醒" },
      { zone: "客厅/玄关", device: "公区照明与音响", state: "调暗至 15% / 屏蔽通知", details: "零打扰免打扰状态" }
    ]
  },
  {
    id: "cinema-av",
    name: "沉浸影音模式",
    enName: "Cinema & AV Time",
    icon: "Tv",
    description: "客厅 85寸电视开启，主灯全灭，电视背景悬浮灯带亮起 20% 柔光保护视力，南向阳台全遮光帘自动闭合，音响切换至杜比全景声。",
    trigger: "电视遥控开启 / 电视功耗检测到>100W",
    actions: [
      { zone: "客厅", device: "客厅无主灯主回路", state: "完全关闭 0%", details: "消除天花杂散反光" },
      { zone: "客厅", device: "电视背景流光溢彩灯", state: "开启 20% 暖琥珀色", details: "缓解暗室大屏视疲劳" },
      { zone: "南向阳台", device: "电动遮光帘", state: "完全闭合 100%", details: "隔绝外部光线与轻微噪音" },
      { zone: "中岛吧台", device: "中岛吧台下悬浮灯", state: "微光 10% 保持动线安全", details: "方便中途起身倒水" }
    ]
  },
  {
    id: "deep-sleep",
    name: "深度睡眠模式",
    enName: "Deep Sleep & Rest",
    icon: "Moon",
    description: "主卧床头双击无线按键，全屋公区机电休眠，主卧空调设置恒温 24°C 与微风循环，电动双轨窗帘全关，智能门锁双重反锁。",
    trigger: "主卧床头无线开关双击 / 手机放入床头无线充",
    actions: [
      { zone: "入户门", device: "Aqara D200 智能门锁", state: "自动布防与反锁", details: "启用夜间安防模式" },
      { zone: "全屋公区", device: "客厅/厨房/书房机电", state: "全部关闭并断开闲置插座", details: "杜绝待机能耗与光污染" },
      { zone: "主卧", device: "智能双轨窗帘", state: "全遮光帘关闭 100%", details: "营造 0 照度全黑深睡环境" },
      { zone: "主卧", device: "卧室空调", state: "睡眠曲线 (24°C -> 25°C)", details: "防止后半夜受凉" },
      { zone: "主卧/卫浴", device: "起夜人体雷达", state: "激活低照度夜灯模式", details: "下床自动亮起床底 5% 微光" }
    ]
  },
  {
    id: "morning-wake",
    name: "晨起自然唤醒",
    enName: "Morning Sunrise Wakeup",
    icon: "Sun",
    description: "早晨设定时间，南向阳台与主卧透光纱帘缓缓开启 70%，柔和晨光洒入，中岛手冲咖啡水吧插座通电加热，开始活力一天。",
    trigger: "工作日早晨 07:30 定时 / 闹钟同步触发",
    actions: [
      { zone: "主卧/阳台", device: "电动透光纱帘", state: "以 5cm/s 慢速开启至 70%", details: "利用 SSE 晨曦自然唤醒" },
      { zone: "中岛吧台", device: "智能轨道插座", state: "通电开机", details: "即热饮水机与咖啡机预热" },
      { zone: "主卧", device: "背景音乐音箱", state: "以 20% 音量播放轻柔播客/爵士", details: "温和唤醒神经" },
      { zone: "卫浴", device: "除雾镜柜与电热毛巾架", state: "启动预热 15分钟", details: "洗漱时即享温热干燥毛巾" }
    ]
  },
  {
    id: "away-home",
    name: "一键离家巡航",
    enName: "Away & Auto Clean",
    icon: "ShieldCheck",
    description: "离家关门后门锁自动上锁，全屋灯光与空调关闭，水路电磁阀防护，扫地机器人自动从生活阳台出发执行全屋深度吸尘拖地。",
    trigger: "出门轻触门锁离家布防键 / 手机离开地理围栏",
    actions: [
      { zone: "入户门", device: "智能门锁与门磁", state: "外出布防 / 摄像头开启", details: "异常开门立即推送告警" },
      { zone: "全屋", device: "全屋照明与空调", state: "一键全关", details: "无遗漏断电节能" },
      { zone: "生活阳台", device: "扫拖一体机器人", state: "从基站出发清扫全屋", details: "人走自动清扫，回家人居洁净" },
      { zone: "厨卫水路", device: "主供水智能水阀", state: "关闭水路安全阀", details: "彻底消除高层漏水隐患" }
    ]
  }
];

export const BOM_DATA: BomCategory[] = [
  {
    id: "civil",
    category: "硬装土建与吊顶工程 (Civil Works & Ceiling)",
    icon: "Hammer",
    description: "全屋全吊顶与隐藏式洗墙灯槽制作、水电点位增补、防开裂冲筋打底工艺。",
    items: [
      {
        id: "cw-1",
        name: "全屋轻钢龙骨耐潮吊顶与反光灯槽制作",
        spec: "轻钢龙骨 + 9mm 耐潮石膏板 + 回字形反光灯槽与隐藏窗帘盒 (60 ㎡)",
        quantity: "60 ㎡",
        unitPriceMYR: 115,
        totalMYR: 6900,
        recommended: true,
        tier: "essential"
      },
      {
        id: "cw-2",
        name: "全屋强弱电开槽增补与电箱升级",
        spec: "增补 18 个插座/开关点位、工位万兆网线布设与 DB 漏保升级",
        quantity: "1 式",
        unitPriceMYR: 3500,
        totalMYR: 3500,
        recommended: true,
        tier: "essential"
      }
    ]
  },
  {
    id: "carpentry",
    category: "全屋高定贯穿式收纳木作 (Custom Storage & Carpentry)",
    icon: "Cabinet",
    description: "从玄关到客厅 9.7m 贯通大收纳柜、悬浮岩板中岛、主卧满墙衣柜、书房大件行李箱高柜。",
    items: [
      {
        id: "cp-1",
        name: "入户全高玄关鞋柜 (纳米抗指纹肤感板)",
        spec: "爱格 E0 级哑光肤感板 + 底部 160mm 悬浮踢脚灯 + 中部 1150mm 置物台",
        quantity: "1 组",
        unitPriceMYR: 3200,
        totalMYR: 3200,
        recommended: true,
        tier: "essential"
      },
      {
        id: "cp-2",
        name: "多功能悬浮岩板中岛吧台一体柜",
        spec: "12mm 进口耐磨岩板台面 + 钢架内承重结构 + 抽屉收纳与嵌入式升降插座 (2000×800mm)",
        quantity: "1 座",
        unitPriceMYR: 4600,
        totalMYR: 4600,
        recommended: true,
        tier: "premium"
      },
      {
        id: "cp-3",
        name: "客厅极简悬浮电视地台柜 (带扫地机避让悬空)",
        spec: "哑光抗指纹肤感/黑胡桃木饰面 (长 3600mm，离地悬空 180mm)",
        quantity: "1 组",
        unitPriceMYR: 2400,
        totalMYR: 2400,
        recommended: true,
        tier: "essential"
      },
      {
        id: "cp-4",
        name: "主卧满墙一字型哑光隐形衣柜",
        spec: "纳米超哑抗指纹门板 + 意大利萨利切铰链 + 顶天立地无把手反弹门 (3300×2700mm)",
        quantity: "1 组",
        unitPriceMYR: 7800,
        totalMYR: 7800,
        recommended: true,
        tier: "essential"
      },
      {
        id: "cp-5",
        name: "极客书房 600mm 深度大件收纳高柜 (行李箱直推)",
        spec: "下层无底板设计（28寸大行李箱直推進出）+ 上层数码外设储物",
        quantity: "1 组",
        unitPriceMYR: 3800,
        totalMYR: 3800,
        recommended: true,
        tier: "premium"
      }
    ]
  },
  {
    id: "bathroom-vanity",
    category: "卫浴大平台与大镜面系统 (Bathroom Vanity & Mirror)",
    icon: "Sparkles",
    description: "1.5m 贯穿式大理石/人造石悬浮大台面、满墙 LED 触控除雾大镜柜、无影洗墙照明与智能马桶。",
    items: [
      {
        id: "bv-1",
        name: "1.5m 贯穿式无缝岩板/可丽耐悬浮大平台 (横跨至马桶上方)",
        spec: "超长定制台面 (1500×550mm) + 一体成型防溅大单盆 + 底部加固钢架",
        quantity: "1 套",
        unitPriceMYR: 3800,
        totalMYR: 3800,
        recommended: true,
        tier: "premium"
      },
      {
        id: "bv-2",
        name: "满墙通宽智能触控除雾无框大镜柜 (1500×850mm)",
        spec: "双面恒温除雾 + 4000K/3000K 无影美妆光 + 内置吹风机插座 + 150mm 超薄储物",
        quantity: "1 套",
        unitPriceMYR: 2400,
        totalMYR: 2400,
        recommended: true,
        tier: "premium"
      },
      {
        id: "bv-3",
        name: "一体化壁挂/落地脚感智能马桶 (泡沫盾防溅)",
        spec: "脚感翻盖翻圈 + 即热恒温清洗 + 离座自动冲水 + 停电应急冲水",
        quantity: "1 套",
        unitPriceMYR: 3200,
        totalMYR: 3200,
        recommended: true,
        tier: "premium"
      },
      {
        id: "bv-4",
        name: "枪灰/哑黑精铜恒温大顶喷增压花洒套装",
        spec: "三功能出水 + 蜂窝水嘴防水垢 + 增压空气注入 + 旋转下出水",
        quantity: "1 套",
        unitPriceMYR: 1600,
        totalMYR: 1600,
        recommended: true,
        tier: "essential"
      }
    ]
  },
  {
    id: "hotel-lighting",
    category: "五星级酒店式照明工程 (Hotel-Grade Architectural Lighting)",
    icon: "Sun",
    description: "全屋见光不见灯反光灯槽、UGR<10深防眩射灯、高显色色温线性洗墙带。",
    items: [
      {
        id: "hl-1",
        name: "UGR<10 五星级酒店专用深防眩射灯 (Ra>97, 遮光角>38°)",
        spec: "7W-10W 智能双色温可调 (2700K-4000K) / 极窄深黑反光杯",
        quantity: "24 盏",
        unitPriceMYR: 95,
        totalMYR: 2280,
        recommended: true,
        tier: "essential"
      },
      {
        id: "hl-2",
        name: "24V 低压 COB 柔光线性洗墙灯带与恒压电源 (无频闪)",
        spec: "天花反光槽、地脚线、柜底、镜柜上下漫射 (120灯/米)",
        quantity: "50 米",
        unitPriceMYR: 45,
        totalMYR: 2250,
        recommended: true,
        tier: "essential"
      }
    ]
  },
  {
    id: "smarthome",
    category: "Aqara / 米家全屋智能生态 (Smart Automation System)",
    icon: "Cpu",
    description: "网关、人脸识别智能锁、人体存在雷达、智能开关、电动窗帘电机与空调温控伴侣。",
    items: [
      {
        id: "sh-1",
        name: "Aqara Hub M3 旗舰网关 (Matter/Thread/Zigbee)",
        spec: "支持本地跨协议局域网自动化与红外遥控中继",
        quantity: "1 台",
        unitPriceMYR: 650,
        totalMYR: 650,
        recommended: true,
        tier: "essential"
      },
      {
        id: "sh-2",
        name: "Aqara D200 旗舰 3D 人脸识别智能门锁",
        spec: "金融级结构光人脸秒开 + HomeKit 钥匙 + 机械防盗应急钥匙",
        quantity: "1 套",
        unitPriceMYR: 1980,
        totalMYR: 1980,
        recommended: true,
        tier: "premium"
      },
      {
        id: "sh-3",
        name: "Aqara H1 Pro 智能墙壁开关 (零火版/超薄微动)",
        spec: "支持单双键、电量计量、转无线开关功能",
        quantity: "8 个",
        unitPriceMYR: 160,
        totalMYR: 1280,
        recommended: true,
        tier: "essential"
      },
      {
        id: "sh-4",
        name: "Aqara FP2 人体微动存在传感器 (毫米波雷达)",
        spec: "多目标定位与多区域划分（玄关、客厅、书房工位、主卧）",
        quantity: "4 台",
        unitPriceMYR: 320,
        totalMYR: 1280,
        recommended: true,
        tier: "premium"
      },
      {
        id: "sh-5",
        name: "Aqara C3 智能电动双轨窗帘电机与超静音定制轨道",
        spec: "主卧双轨 (遮光+纱帘) + 客厅阳台单轨",
        quantity: "3 套",
        unitPriceMYR: 850,
        totalMYR: 2550,
        recommended: true,
        tier: "premium"
      },
      {
        id: "sh-6",
        name: "Aqara 空调伴侣 P3 与温湿度传感器联动套件",
        spec: "客厅、主卧、书房 3 台分体空调红外与温控自动化",
        quantity: "3 套",
        unitPriceMYR: 260,
        totalMYR: 780,
        recommended: true,
        tier: "essential"
      }
    ]
  },
  {
    id: "furniture-av",
    category: "软装家具与极客视听装备 (Furniture & Geek AV)",
    icon: "Monitor",
    description: "升降工作桌、人体工学椅、85寸超薄大屏电视、模块化科技布沙发、1.8m悬浮静音大床与扫拖机器人。",
    items: [
      {
        id: "fa-1",
        name: "极客双电机电动升降工作台 (2000×800mm 黄金进深)",
        spec: "三节静音双电机 + 遇阻反弹 + 4档记忆 + 隐藏式一体金属线槽",
        quantity: "1 张",
        unitPriceMYR: 2600,
        totalMYR: 2600,
        recommended: true,
        tier: "essential"
      },
      {
        id: "fa-2",
        name: "Herman Miller / 保友旗舰人体工学椅",
        spec: "全网透气支撑 + 4D 多维调节头枕腰托 + 铝合金一体底盘",
        quantity: "1 把",
        unitPriceMYR: 3500,
        totalMYR: 3500,
        recommended: true,
        tier: "premium"
      },
      {
        id: "fa-3",
        name: "85寸 4K 144Hz 极窄边框超薄大屏电视",
        spec: "Mini-LED 控光分区 / 杜比视界 / HDMI 2.1 游戏接口",
        quantity: "1 台",
        unitPriceMYR: 6200,
        totalMYR: 6200,
        recommended: true,
        tier: "premium"
      },
      {
        id: "fa-4",
        name: "客厅直排科技布/真皮极简模块沙发 (长2800mm)",
        spec: "高回弹羽绒海绵填充 + 纳米防污防刮耐磨面料",
        quantity: "1 组",
        unitPriceMYR: 3800,
        totalMYR: 3800,
        recommended: true,
        tier: "essential"
      },
      {
        id: "fa-5",
        name: "1.8m 悬浮静音排骨架大床与五星级独立弹簧乳胶床垫",
        spec: "内缩悬浮脚 + 防撞软包床头 + 独立袋装静音弹簧",
        quantity: "1 套",
        unitPriceMYR: 4200,
        totalMYR: 4200,
        recommended: true,
        tier: "essential"
      },
      {
        id: "fa-6",
        name: "全自动上下水基站扫拖一体机器人",
        spec: "自动洗抹布 + 55°C热风烘干 + 自动集尘 + 自动加清洁液",
        quantity: "1 台",
        unitPriceMYR: 3600,
        totalMYR: 3600,
        recommended: true,
        tier: "premium"
      }
    ]
  }
];
