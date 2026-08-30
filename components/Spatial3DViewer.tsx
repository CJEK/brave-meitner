"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import CameraControls from "camera-controls";
import { 
  Layers, 
  Maximize2, 
  Eye, 
  Zap, 
  Sun, 
  Wind, 
  Cpu, 
  Ruler, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  Info, 
  ShieldCheck, 
  Building2, 
  MousePointerClick,
  ChevronLeft,
  ChevronRight,
  RotateCcw
} from "lucide-react";
import { ZONES_DATA, STYLES_DATA, PROPERTY_DATA, ZoneData } from "@/data/projectData";
import { getJohorSunData, SOLAR_PRESETS, JB_LOCATION } from "@/utils/solarCalculator";

// Install THREE for CameraControls
CameraControls.install({ THREE });

interface Spatial3DViewerProps {
  selectedStyleId: string;
}

// 1:1 Standard Coordinate System: Width X [-3.45, +3.45] (6.9m), Depth Z [-4.8625, +4.8625] (9.725m), Origin (0,0,0) at Center
// Left Side (Private 3.1m width, X in [-3.45, -0.35], Center X = -1.9m)
// Right Side (Public 3.8m width, X in [-0.35, +3.45], Center X = +1.55m)
const ZONE_3D_COORDS: { [key: string]: { x: number; z: number; w: number; d: number; label: string; mep: string[]; smart: string[] } } = {
  "entrance": {
    x: 1.55, z: -4.1, w: 3.8, d: 1.5,
    label: "入户玄关",
    mep: ["⚡ 入户照明双控开关", "⚡ DB 配电箱与弱电光纤"],
    smart: ["🤖 D200 3D人脸门锁", "🤖 入户迎宾微波感应"]
  },
  "kitchen": {
    x: 1.55, z: -2.55, w: 3.8, d: 1.5,
    label: "开放式厨房",
    mep: ["⚡ 20A 烟机灶具专用", "⚡ 厨下 RO 净水动力"],
    smart: ["🤖 烟雾/水浸传感器", "🤖 智能橱柜手扫感应"]
  },
  "dining": {
    x: 1.55, z: -0.9, w: 3.8, d: 1.8,
    label: "多功能中岛吧台",
    mep: ["⚡ 弹出式隐藏轨道插座", "⚡ 吧台电水壶/咖啡机电源"],
    smart: ["🤖 吧台调光色温旋钮", "🤖 中岛氛围悬浮吊灯"]
  },
  "living": {
    x: 1.55, z: 1.7, w: 3.8, d: 3.4,
    label: "客厅极简影音区",
    mep: ["⚡ SMATV 电视点位", "⚡ 15A 空调专用点", "⚡ 5组五孔插座", "⚡ 沙发侧 USB-C 快充"],
    smart: ["🤖 FP2 人体存在毫米波雷达", "🤖 空调伴侣 P3", "🤖 电视背景同步流光溢彩"]
  },
  "balcony": {
    x: 1.55, z: 4.1, w: 3.8, d: 1.5,
    label: "南向景观阳台",
    mep: ["⚡ 防水动力插座", "⚡ 景观洗墙射灯"],
    smart: ["🤖 C3 智能双轨电动帘", "🤖 阳台温湿度传感器"]
  },
  "yard": {
    x: -1.9, z: -4.0, w: 3.1, d: 1.6,
    label: "生活阳台与设备平台",
    mep: ["⚡ 洗衣机专用冷水给水与电源", "⚡ 扫地机上下水排污管"],
    smart: ["🤖 扫拖机器人自动上下水基站", "🤖 户外水浸漏水自切阀"]
  },
  "study": {
    x: -1.9, z: -2.35, w: 3.1, d: 1.7,
    label: "极客工作站 (1+1房)",
    mep: ["⚡ 8组桌面抗涌浪插座", "⚡ 千兆网络接口 RJ45"],
    smart: ["🤖 FP2 极客坐姿姿态识别雷达", "🤖 极客工作模式自动化联动"]
  },
  "bathroom": {
    x: -1.9, z: -0.25, w: 3.1, d: 2.5,
    label: "卫浴室 (大平台+大镜面)",
    mep: ["⚡ 1.5m 镜柜内隐藏防溅插座", "⚡ 智能马桶预留电路", "⚡ 20A 电热水器"],
    smart: ["🤖 镜面触控恒温除雾", "🤖 智能感应翻盖马桶", "🤖 地脚起夜微光感应"]
  },
  "bedroom": {
    x: -1.9, z: 2.9, w: 3.1, d: 3.8,
    label: "主卧深睡空间",
    mep: ["⚡ 床头双侧双控+Type-C", "⚡ 15A 空调独立回路"],
    smart: ["🤖 C3 卧室静音电动窗帘", "🤖 FP2 睡眠监测雷达", "🤖 床底起夜感应地脚灯"]
  }
};

// 3D Anchor Points (Only rendered when user explicitly turns on the layer switch)
const MARKER_ANCHORS = [
  { id: "d200-lock", pos: [2.8, 0.8, -4.5], label: "D200 3D人脸锁", type: "smart", icon: "🤖" },
  { id: "smatv", pos: [3.3, 0.8, 1.7], label: "SMATV 电视点", type: "mep", icon: "⚡" },
  { id: "ac-living", pos: [3.3, 1.2, 2.8], label: "15A 空调动力", type: "mep", icon: "⚡" },
  { id: "fp2-living", pos: [1.55, 1.4, 1.7], label: "FP2 存在雷达", type: "smart", icon: "🤖" },
  { id: "desk-power", pos: [-1.9, 0.65, -2.35], label: "8组桌面插座", type: "mep", icon: "⚡" },
  { id: "fp2-study", pos: [-1.9, 1.4, -2.35], label: "FP2 极客坐姿雷达", type: "smart", icon: "🤖" },
  { id: "vanity-power", pos: [-3.3, 0.8, -0.25], label: "1.5m 镜柜隐藏插座", type: "mep", icon: "⚡" },
  { id: "roborock", pos: [-2.8, 0.4, -4.0], label: "扫拖机自动上下水", type: "smart", icon: "🤖" },
  { id: "curtain-c3", pos: [1.55, 0.8, 4.6], label: "C3 南向双轨帘", type: "smart", icon: "🤖" },
  { id: "curtain-bed", pos: [-3.3, 0.8, 4.4], label: "C3 主卧静音帘", type: "smart", icon: "🤖" }
];

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({ selectedStyleId }) => {
  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  
  // Layer Toggles - ALL DEFAULT FALSE for a crystal-clean, uncluttered 3D experience
  const [showDimensions, setShowDimensions] = useState<boolean>(false);
  const [showMEP, setShowMEP] = useState<boolean>(false);
  const [showSmartHome, setShowSmartHome] = useState<boolean>(false);
  const [showMicroclimate, setShowMicroclimate] = useState<boolean>(false);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "noon" | "sunset" | "night">("morning");

  // Calculated Real-world Solar Data from SunCalc
  const solarData = getJohorSunData(timeOfDay);

  // Screen Projected 2D Overlay Positions for 3D Markers
  const [projectedMarkers, setProjectedMarkers] = useState<{ id: string; x: number; y: number; label: string; type: string; icon: string; visible: boolean }[]>([]);

  // Three.js References
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<CameraControls | null>(null);
  const highlightMeshRef = useRef<THREE.Mesh | null>(null);
  const highlightBorderRef = useRef<THREE.LineSegments | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const dimensionGroupRef = useRef<THREE.Group | null>(null);
  const clickableZonesRef = useRef<THREE.Mesh[]>([]);
  const bottomScrollRef = useRef<HTMLDivElement>(null);

  // Handle Raycasting Pointer Click
  const handleCanvasClick = useCallback((event: MouseEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;
    const rect = mountRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(clickableZonesRef.current, false);

    if (intersects.length > 0) {
      const hit = intersects[0];
      const zoneId = hit.object.userData.zoneId;
      if (zoneId) {
        const found = ZONES_DATA.find((z) => z.id === zoneId);
        if (found) {
          setActiveZone(found);
        }
      }
    }
  }, []);

  // 1. Initialize Three.js Scene: 6.9m × 9.725m Rectangular Slab, 0.3m Half-Walls (BIM Section Cut), 1:1 Scaled Furniture
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 560;

    // Architectural Studio Background (#f8fafc)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    // Perspective Camera (45 FOV, 0.1 Near plane)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 8.5, 9.5);

    // WebGL Renderer with preserveDrawingBuffer: true
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: "high-performance"
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Initialize CameraControls
    const controls = new CameraControls(camera, renderer.domElement);
    controls.smoothTime = 0.35;
    controls.draggingSmoothTime = 0.12;
    controls.maxDistance = 24;
    controls.minDistance = 3.5;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controlsRef.current = controls;

    // Clean 45-degree Bird's-eye Perspective
    controls.setLookAt(0, 8.5, 9.5, 0, 0, 0, false);

    // Attach Raycasting Click Handler
    const domElem = renderer.domElement;
    domElem.addEventListener("click", handleCanvasClick);

    // Calibrated Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.4);
    sunLight.position.set(6, 12, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 45;
    sunLight.shadow.camera.left = -8;
    sunLight.shadow.camera.right = 8;
    sunLight.shadow.camera.top = 8;
    sunLight.shadow.camera.bottom = -8;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.6);
    fillLight.position.set(-8, 10, -10);
    scene.add(fillLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // =========================================================================
    // 📐 HIGH-RESOLUTION ARCHITECTURAL BLUEPRINT TEXTURE GENERATOR (6.90m × 9.725m)
    // Left side = 3.1m (45% ~ 920px), Right side = 3.8m (55% ~ 1128px)
    // =========================================================================
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2888; // 6900 : 9725 exact aspect ratio (1 : 1.409)
    const ctx = canvas.getContext("2d");
    if (ctx) {
      // 1. Floor Base (Warm Natural Light Oak)
      ctx.fillStyle = "#ede8df";
      ctx.fillRect(0, 0, 2048, 2888);

      // 2. Subtle Floor Tile Grid Lines (600x600mm)
      ctx.strokeStyle = "rgba(148, 163, 184, 0.22)";
      ctx.lineWidth = 2;
      for (let x = 0; x <= 2048; x += 178) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 2888);
        ctx.stroke();
      }
      for (let y = 0; y <= 2888; y += 178) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(2048, y);
        ctx.stroke();
      }

      // 3. Central Spine Wall at X = 45% (920px)
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 12;

      // Outer Perimeter Border
      ctx.strokeRect(8, 8, 2032, 2872);

      // Longitudinal Main Spine Wall (X = -0.35m ~ 920px)
      ctx.beginPath();
      ctx.moveTo(920, 0);
      ctx.lineTo(920, 2888);
      ctx.stroke();

      // Left Private Zone Partitions:
      // Yard / Study divider (Z = -3.2m ~ 500px)
      ctx.beginPath();
      ctx.moveTo(0, 500);
      ctx.lineTo(920, 500);
      ctx.stroke();

      // Study / Bath divider (Z = -1.5m ~ 1000px)
      ctx.beginPath();
      ctx.moveTo(0, 1000);
      ctx.lineTo(920, 1000);
      ctx.stroke();

      // Bath / Bedroom divider (Z = 1.0m ~ 1740px)
      ctx.beginPath();
      ctx.moveTo(0, 1740);
      ctx.lineTo(920, 1740);
      ctx.stroke();

      // Right Public Zone Partitions:
      // Kitchen / Dining divider
      ctx.beginPath();
      ctx.moveTo(920, 480);
      ctx.lineTo(2048, 480);
      ctx.stroke();

      // Dining / Living divider
      ctx.beginPath();
      ctx.moveTo(920, 1000);
      ctx.lineTo(2048, 1000);
      ctx.stroke();

      // Living / Balcony Sliding Door Line
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(920, 2450);
      ctx.lineTo(2048, 2450);
      ctx.stroke();

      // 4. Blueprint Room Labels & Dimension Indicators
      ctx.fillStyle = "#475569";
      ctx.font = "bold 40px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("生活阳台 YARD (3.1×1.6m)", 460, 280);
      ctx.fillText("极客工作站 STUDY (3.1×1.7m)", 460, 770);
      ctx.fillText("独立卫浴 BATH (3.1×2.5m)", 460, 1400);
      ctx.fillText("主卧深睡 BEDROOM (3.1×3.8m)", 460, 2350);

      ctx.fillText("入户玄关 FOYER (3.8×1.5m)", 1484, 250);
      ctx.fillText("开放厨房 KITCHEN (3.8×1.5m)", 1484, 750);
      ctx.fillText("多功能中岛 DINING (3.8×1.8m)", 1484, 1260);
      ctx.fillText("客厅极简影音 LIVING (3.8×3.4m)", 1484, 1850);
      ctx.fillText("景观阳台 BALCONY (3.8×1.5m)", 1484, 2690);
    }

    const blueprintTexture = new THREE.CanvasTexture(canvas);
    blueprintTexture.anisotropy = 8;

    // Base Floor Slab: Exactly 6.90m (Width) × 9.725m (Depth)
    const floorGeometry = new THREE.BoxGeometry(6.90, 0.15, 9.725);
    const floorMat = new THREE.MeshStandardMaterial({
      map: blueprintTexture,
      roughness: 0.35,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.position.y = -0.075;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const floorEdges = new THREE.EdgesGeometry(floorGeometry);
    const floorLine = new THREE.LineSegments(floorEdges, new THREE.LineBasicMaterial({ color: 0x334155, linewidth: 2 }));
    floorLine.position.y = -0.075;
    scene.add(floorLine);

    // Clickable Raycasting Floor Meshes for each zone
    clickableZonesRef.current = [];
    Object.entries(ZONE_3D_COORDS).forEach(([zoneId, coord]) => {
      const planeGeom = new THREE.PlaneGeometry(coord.w, coord.d);
      planeGeom.rotateX(-Math.PI / 2);
      const planeMat = new THREE.MeshBasicMaterial({ visible: false });
      const zoneFloor = new THREE.Mesh(planeGeom, planeMat);
      zoneFloor.position.set(coord.x, 0.01, coord.z);
      zoneFloor.userData = { zoneId };
      scene.add(zoneFloor);
      clickableZonesRef.current.push(zoneFloor);
    });

    // Helper: Soft Contact Shadow Generator
    const createContactShadow = (w: number, d: number, x: number, z: number, opacity = 0.35) => {
      const c = document.createElement("canvas");
      c.width = 64;
      c.height = 64;
      const context = c.getContext("2d");
      if (context) {
        const gradient = context.createRadialGradient(32, 32, 4, 32, 32, 30);
        gradient.addColorStop(0, "rgba(30, 41, 59, 0.95)");
        gradient.addColorStop(0.5, "rgba(51, 65, 85, 0.35)");
        gradient.addColorStop(1, "rgba(100, 116, 139, 0)");
        context.fillStyle = gradient;
        context.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(c);
      const planeGeom = new THREE.PlaneGeometry(w * 1.15, d * 1.15);
      planeGeom.rotateX(-Math.PI / 2);
      const planeMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity,
        depthWrite: false
      });
      const shadowMesh = new THREE.Mesh(planeGeom, planeMat);
      shadowMesh.position.set(x, 0.008, z);
      return shadowMesh;
    };

    // Helper: Create High-Contrast Furniture with Wireframe Edges
    const createFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, color = 0xcbd5e1, edgeColor = 0x334155) => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.05 });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1.5 }));
      group.add(line);

      group.position.set(x, y, z);
      return group;
    };

    // Helper: Create Standard 0.3m (300mm) Architectural Half-Wall (BIM Section Cut)
    const createHalfWall = (w: number, d: number, x: number, z: number, opacity = 0.95, color = 0xe2e8f0) => {
      const wallHeight = 0.3; // 300mm dwarf wall mode
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, wallHeight, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.35,
        metalness: 0.05,
        transparent: opacity < 1,
        opacity
      });
      const wall = new THREE.Mesh(geom, mat);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);

      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x94a3b8, linewidth: 1.5 }));
      group.add(line);

      // Sits right on top of floor plane (y = 0.15)
      group.position.set(x, wallHeight / 2, z);
      return group;
    };

    // =========================================================================
    // 🧱 3 CORE 3D HALF-WALLS (Height = 0.3m / 300mm)
    // =========================================================================
    // 1. 纵向主墙 (Spine Wall at X = -0.35m, 0.15m thickness, 0.3m height)
    const spineWallNorth = createHalfWall(0.15, 4.36, -0.35, -2.68); // North to Bedroom door (z: -4.86 ~ -0.5)
    const spineWallSouth = createHalfWall(0.15, 3.86, -0.35, 2.93);  // Bedroom door to South (z: 1.0 ~ 4.86)
    scene.add(spineWallNorth, spineWallSouth);

    // 2. 横向主卧隔墙 (Bedroom Wall at Z = 1.0m, from X = -3.45 to X = -0.35, 0.3m height)
    const bedWallLeft = createHalfWall(2.0, 0.15, -2.45, 1.0);
    const bedWallRight = createHalfWall(0.2, 0.15, -0.45, 1.0); // 900mm Bedroom doorway opening
    scene.add(bedWallLeft, bedWallRight);

    // 3. 横向卫浴/书房隔墙 (Bathroom / Study Wall at Z = -1.5m, from X = -3.45 to X = -0.35)
    const bathStudyWall = createHalfWall(3.1, 0.15, -1.9, -1.5);
    scene.add(bathStudyWall);

    // 4. 横向生活阳台隔墙 (Yard Wall at Z = -3.2m, from X = -3.45 to X = -0.35)
    const yardStudyWall = createHalfWall(3.1, 0.15, -1.9, -3.2);
    scene.add(yardStudyWall);

    // 5. 南向景观阳台玻璃栏杆 (Balcony Glass Railing at Z = 4.86m, 0.25m height)
    const balconyGlassRailing = createHalfWall(3.8, 0.06, 1.55, 4.86, 0.6, 0x60a5fa);
    scene.add(balconyGlassRailing);

    // =========================================================================
    // 🛋️ REAL-WORLD SCALED FURNITURE (1:1 Metric Scale, Leaves Open Walk Corridors)
    // =========================================================================

    // --- 1. [客厅极简影音区] (X: +1.55, Z: +1.7, 3.8m × 3.4m Room) ---
    // Sofa: 2.6m W × 1.0m D × 0.55m H
    const sofa = createFurniture(2.6, 0.55, 1.0, 0.6, 0.28, 1.7, 0xb0b8c4, 0x1e293b);
    const sofaShadow = createContactShadow(2.8, 1.2, 0.6, 1.7, 0.38);
    // TV Stand: 2.8m W × 0.45m D × 0.25m H
    const tvStand = createFurniture(2.8, 0.25, 0.45, 3.1, 0.125, 1.7, 0xd1d5db, 0x334155);
    const tvStandShadow = createContactShadow(3.0, 0.6, 3.1, 1.7, 0.32);
    const tvScreen = createFurniture(0.06, 0.85, 2.6, 3.38, 0.75, 1.7, 0x0f172a, 0x0284c7);
    scene.add(sofaShadow, sofa, tvStandShadow, tvStand, tvScreen);

    // --- 2. [开放式厨房 & 多功能中岛吧台] (X: +1.55, Z: -2.55 / -0.9) ---
    const kitchenCounter = createFurniture(3.4, 0.55, 0.65, 1.55, 0.28, -2.55, 0xd1d5db, 0x334155);
    const kitchenShadow = createContactShadow(3.6, 0.85, 1.55, -2.55, 0.3);
    // Island: 2.0m W × 0.9m D × 0.65m H
    const island = createFurniture(2.0, 0.65, 0.9, 1.55, 0.33, -0.9, 0xffffff, 0x1e293b);
    const islandShadow = createContactShadow(2.2, 1.1, 1.55, -0.9, 0.38);
    const islandWood = createFurniture(0.8, 0.08, 0.8, 2.3, 0.65, -0.9, 0xd4a373, 0x78350f);
    scene.add(kitchenShadow, kitchenCounter, islandShadow, island, islandWood);

    // --- 3. [极客工作站 1+1 房] (X: -1.9, Z: -2.35, 3.1m × 1.7m Room) ---
    // Lifting Desk: 1.8m W × 0.8m D
    const liftDesk = createFurniture(1.8, 0.06, 0.8, -1.9, 0.55, -2.35, 0xd4a373, 0x78350f);
    const deskShadow = createContactShadow(2.0, 1.0, -1.9, -2.35, 0.35);
    const deskLeg1 = createFurniture(0.1, 0.52, 0.65, -2.6, 0.26, -2.35, 0x334155, 0x0f172a);
    const deskLeg2 = createFurniture(0.1, 0.52, 0.65, -1.2, 0.26, -2.35, 0x334155, 0x0f172a);
    const dualScreen = createFurniture(1.4, 0.45, 0.05, -1.9, 0.85, -2.6, 0x2563eb, 0x1e40af);
    scene.add(deskShadow, liftDesk, deskLeg1, deskLeg2, dualScreen);

    // --- 4. [独立封闭卫浴室] (X: -1.9, Z: -0.25, 3.1m × 2.5m Room) ---
    // 1.5m Hotel Vanity Platform
    const vanityLedge = createFurniture(1.5, 0.25, 0.65, -2.6, 0.45, -0.25, 0xffffff, 0x2563eb);
    const mirrorCabinet = createFurniture(1.5, 0.55, 0.1, -2.6, 0.85, -0.65, 0xeff6ff, 0x1d4ed8);
    const toilet = createFurniture(0.45, 0.35, 0.65, -1.1, 0.18, 0.2, 0xffffff, 0x64748b);
    scene.add(vanityLedge, mirrorCabinet, toilet);

    // --- 5. [主卧深睡空间] (X: -1.9, Z: +2.9, 3.1m × 3.8m Room) ---
    // King Bed: 1.8m W × 2.0m D
    const bedShadow = createContactShadow(2.0, 2.2, -1.9, 2.9, 0.38);
    const bedBase = createFurniture(1.8, 0.3, 2.0, -1.9, 0.15, 2.9, 0xb0b8c4, 0x1e293b);
    const mattress = createFurniture(1.6, 0.2, 1.9, -1.9, 0.35, 2.9, 0xffffff, 0x64748b);
    const headboard = createFurniture(2.0, 0.65, 0.1, -1.9, 0.45, 1.85, 0xd1d5db, 0x334155);
    // Wardrobe: 0.6m W × 1.2m H × 2.6m D along West Wall
    const wardrobe = createFurniture(0.6, 1.2, 2.6, -3.1, 0.6, 3.0, 0xffffff, 0x94a3b8);
    scene.add(bedShadow, bedBase, mattress, headboard, wardrobe);

    // --- 6. [生活阳台 / 家政区] (X: -1.9, Z: -4.0, 3.1m × 1.6m Room) ---
    const washer = createFurniture(0.9, 0.65, 0.8, -2.7, 0.33, -4.0, 0xe2e8f0, 0x475569);
    scene.add(washer);

    // --- 7. Interactive Zone Highlight Floor Mesh & Outline ---
    const highlightGeom = new THREE.PlaneGeometry(1, 1);
    highlightGeom.rotateX(-Math.PI / 2);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.position.y = 0.02;
    highlightMeshRef.current = highlightMesh;
    scene.add(highlightMesh);

    // Highlight Border Wireframe
    const borderGeom = new THREE.BufferGeometry();
    const borderMat = new THREE.LineBasicMaterial({ color: 0x1d4ed8, linewidth: 2.5 });
    const highlightBorder = new THREE.LineSegments(borderGeom, borderMat);
    highlightBorder.position.y = 0.03;
    highlightBorderRef.current = highlightBorder;
    scene.add(highlightBorder);

    // Dimension Group
    const dimensionGroup = new THREE.Group();
    dimensionGroupRef.current = dimensionGroup;
    scene.add(dimensionGroup);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Update CameraControls
      controls.update(delta);

      // Gentle breathing on active highlight mesh
      if (highlightMeshRef.current) {
        highlightMat.opacity = 0.25 + Math.sin(elapsedTime * 3.2) * 0.09;
      }

      // Update Screen Coordinates for 3D Markers (Only if layer toggles are ON)
      if (mountRef.current && camera && (showMEP || showSmartHome)) {
        const rect = mountRef.current.getBoundingClientRect();
        const projected = MARKER_ANCHORS.map((anchor) => {
          const vec = new THREE.Vector3(anchor.pos[0], anchor.pos[1], anchor.pos[2]);
          vec.project(camera);

          const isBehind = vec.z > 1;
          const rawX = ((vec.x + 1) * rect.width) / 2;
          const rawY = ((-vec.y + 1) * rect.height) / 2;

          const x = Math.max(60, Math.min(rect.width - 60, rawX));
          const y = Math.max(35, Math.min(rect.height - 35, rawY));

          return {
            id: anchor.id,
            x,
            y,
            label: anchor.label,
            type: anchor.type,
            icon: anchor.icon,
            visible: !isBehind && rawX >= 10 && rawX <= rect.width - 10 && rawY >= 10 && rawY <= rect.height - 10
          };
        });
        setProjectedMarkers(projected);
      } else {
        setProjectedMarkers([]);
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    // Strict Memory Cleanup on Unmount
    return () => {
      domElem.removeEventListener("click", handleCanvasClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);

      controls.dispose();

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) {
              obj.material.forEach((m) => m.dispose());
            } else {
              obj.material.dispose();
            }
          }
        }
        if (obj instanceof THREE.LineSegments || obj instanceof THREE.Line) {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) obj.material.dispose();
        }
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = "";
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [viewMode, selectedStyleId, handleCanvasClick, showMEP, showSmartHome]);

  // 2. Update Highlight Mesh Position strictly restricted to the selected room's partition walls
  useEffect(() => {
    if (!highlightMeshRef.current || !highlightBorderRef.current) return;
    const coords = ZONE_3D_COORDS[activeZone.id] || ZONE_3D_COORDS["living"];

    highlightMeshRef.current.scale.set(coords.w, coords.d, 1);
    highlightMeshRef.current.position.set(coords.x, 0.02, coords.z);

    const hw = coords.w / 2;
    const hd = coords.d / 2;
    const points = [
      new THREE.Vector3(-hw, 0, -hd), new THREE.Vector3(hw, 0, -hd),
      new THREE.Vector3(hw, 0, -hd), new THREE.Vector3(hw, 0, hd),
      new THREE.Vector3(hw, 0, hd), new THREE.Vector3(-hw, 0, hd),
      new THREE.Vector3(-hw, 0, hd), new THREE.Vector3(-hw, 0, -hd),
    ];
    highlightBorderRef.current.geometry.dispose();
    highlightBorderRef.current.geometry = new THREE.BufferGeometry().setFromPoints(points);
    highlightBorderRef.current.position.set(coords.x, 0.03, coords.z);
  }, [activeZone]);

  // 3. Update Real-world Solar Simulation via SunCalc on `timeOfDay` change
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !sceneRef.current) return;

    const data = getJohorSunData(timeOfDay);
    sunLightRef.current.position.copy(data.position);
    sunLightRef.current.color.setHex(data.lightColor);
    sunLightRef.current.intensity = data.lightIntensity;

    ambientLightRef.current.color.setHex(data.ambientColor);
    ambientLightRef.current.intensity = data.ambientIntensity;
  }, [timeOfDay]);

  // 4. Update 3D Dimension Lines
  useEffect(() => {
    if (!dimensionGroupRef.current) return;

    while (dimensionGroupRef.current.children.length > 0) {
      const obj = dimensionGroupRef.current.children[0];
      dimensionGroupRef.current.remove(obj);
    }

    if (showDimensions) {
      const drawDimLine = (p1: [number, number, number], p2: [number, number, number], color = 0x2563eb) => {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...p1),
          new THREE.Vector3(...p2)
        ]);
        const mat = new THREE.LineBasicMaterial({ color, linewidth: 2.5 });
        return new THREE.Line(geom, mat);
      };

      // 6,900 mm Overall Width Dimension Line
      dimensionGroupRef.current.add(drawDimLine([-3.45, 0.15, 4.95], [3.45, 0.15, 4.95], 0x059669));
      // 9,725 mm Overall Depth Dimension Line
      dimensionGroupRef.current.add(drawDimLine([3.55, 0.15, -4.86], [3.55, 0.15, 4.86], 0x2563eb));
      // Public Living Room Clear Width Line (3,800 mm)
      dimensionGroupRef.current.add(drawDimLine([-0.35, 0.15, 3.4], [3.45, 0.15, 3.4], 0x3b82f6));
      // Private Bedroom Clear Width Line (3,100 mm)
      dimensionGroupRef.current.add(drawDimLine([-3.45, 0.15, 1.0], [-0.35, 0.15, 1.0], 0x8b5cf6));
    }
  }, [showDimensions]);

  // 5. Smooth Camera Preset Navigation with CameraControls
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (cameraPreset) {
      case "birds-eye":
        ctrl.setLookAt(0, 8.5, 9.5, 0, 0, 0, true);
        break;
      case "living":
        ctrl.setLookAt(1.55, 4.5, 5.2, 1.55, 0.5, 1.7, true);
        break;
      case "workstation":
        ctrl.setLookAt(-1.9, 4.2, 2.2, -1.9, 0.5, -2.35, true);
        break;
      case "bedroom":
        ctrl.setLookAt(-1.9, 4.2, 6.2, -1.9, 0.5, 2.9, true);
        break;
      case "balcony":
        ctrl.setLookAt(1.55, 2.8, 2.2, 1.55, 0.5, 4.1, true);
        break;
    }
  }, [cameraPreset]);

  // Scroll Bottom Bar horizontally
  const scrollBottom = (direction: "left" | "right") => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollBy({
        left: direction === "left" ? -260 : 260,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar: 3 Distinct Function Groups */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Group 1: 3D vs 2.5D View Mode */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("3d")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "3d"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            3D 真实推演 (Three.js 1:1)
          </button>
          <button
            onClick={() => setViewMode("2.5d")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              viewMode === "2.5d"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2.5D 户型平面图
          </button>
        </div>

        {/* Group 2: Real-time Solar Presets */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          {SOLAR_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => setTimeOfDay(preset.id)}
              className={`px-2.5 py-1.5 rounded-lg transition-all font-semibold flex items-center space-x-1 ${
                timeOfDay === preset.id
                  ? "bg-amber-100 text-amber-950 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
              title={preset.description}
            >
              <span>{preset.label}</span>
            </button>
          ))}
        </div>

        {/* Group 3: 4 Layer Switches with High-Contrast Active States (Default OFF for Clean Canvas) */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showDimensions
                ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>尺寸标注 {showDimensions ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowMEP(!showMEP)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showMEP
                ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>交标机电 {showMEP ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowSmartHome(!showSmartHome)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showSmartHome
                ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Aqara 智能 {showSmartHome ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowMicroclimate(!showMicroclimate)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              showMicroclimate
                ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>微气候</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Side Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Viewport (8 Columns) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex flex-col min-h-[560px]">
          {/* Top Camera Presets Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 font-semibold px-2 py-1 flex items-center">
              <Eye className="w-3 h-3 mr-1 text-blue-600" />
              视角:
            </span>
            <button
              onClick={() => setCameraPreset("birds-eye")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "birds-eye"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              俯瞰全景
            </button>
            <button
              onClick={() => setCameraPreset("living")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "living"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              客厅影音
            </button>
            <button
              onClick={() => setCameraPreset("workstation")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "workstation"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              极客工位
            </button>
            <button
              onClick={() => setCameraPreset("bedroom")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "bedroom"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              主卧深睡
            </button>
            <button
              onClick={() => setCameraPreset("balcony")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "balcony"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              24F 阳台视野
            </button>
          </div>

          {/* Compass & Solar Altitude Badge (Guaranteed 0° ~ 90°) */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-2xl flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-end space-x-1">
                <span>新山日照实况 ({solarData.preset.timeStr})</span>
              </div>
              <div className="text-xs font-black text-amber-600 font-mono">
                方位 {solarData.azimuthDegrees}° · 高度角 {solarData.altitudeDegrees}°
              </div>
            </div>
          </div>

          {/* Direct 3D Raycasting Hint Badge */}
          <div className="absolute bottom-16 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm text-[11px] text-slate-700 pointer-events-none">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>点击 3D 任意房间即刻拾取</span>
          </div>

          {/* 3D WebGL Canvas Container */}
          {viewMode === "3d" ? (
            <div className="relative w-full flex-1 h-full min-h-[520px] overflow-hidden bg-slate-100">
              <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

              {/* 3D Projected Screen UI Labels (Only rendered if toggles are ON) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                {projectedMarkers.map((marker) => {
                  if (!marker.visible) return null;
                  const isMEP = marker.type === "mep";
                  if (isMEP && !showMEP) return null;
                  if (!isMEP && !showSmartHome) return null;

                  return (
                    <div
                      key={marker.id}
                      style={{
                        position: "absolute",
                        left: `${marker.x}px`,
                        top: `${marker.y}px`,
                        transform: "translate(-50%, -100%)",
                        transition: "left 0.05s linear, top 0.05s linear, z-index 0.2s ease"
                      }}
                      className="pointer-events-auto cursor-pointer group z-10 hover:z-50"
                    >
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold border transition-all duration-200 ease-out whitespace-nowrap group-hover:scale-110 group-hover:shadow-2xl group-hover:z-50 ${
                        isMEP
                          ? "bg-white/95 text-amber-900 border-amber-300 shadow-md group-hover:border-amber-500 group-hover:ring-2 group-hover:ring-amber-400/30"
                          : "bg-white/95 text-purple-900 border-purple-300 shadow-md group-hover:border-purple-500 group-hover:ring-2 group-hover:ring-purple-400/30"
                      }`}>
                        <span className="text-xs">{marker.icon}</span>
                        <span>{marker.label}</span>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-700 mx-auto mt-0.5 shadow-2xs group-hover:bg-blue-600 group-hover:scale-125 transition-all" />
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* 2.5D BIM Vector Floor Plan (Reflecting Type B Real Topology: 45% Left Private, 55% Right Public) */
            <div className="w-full flex-1 min-h-[520px] p-6 bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[560px] aspect-[690/972.5] bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-md">
                {/* Longitudinal Spine Wall Divider Line in 2.5D at X = 45% */}
                <div className="absolute left-[45%] top-0 bottom-0 w-1 bg-slate-300 pointer-events-none z-0" />

                {ZONES_DATA.map((zone) => {
                  const isSelected = activeZone.id === zone.id;
                  return (
                    <div
                      key={zone.id}
                      onClick={() => setActiveZone(zone)}
                      style={{
                        position: "absolute",
                        left: `${zone.coordinates.x}%`,
                        top: `${zone.coordinates.y}%`,
                        width: `${zone.coordinates.w}%`,
                        height: `${zone.coordinates.h}%`,
                      }}
                      className={`rounded-xl border transition-all duration-150 cursor-pointer p-2 flex flex-col justify-between ${
                        isSelected
                          ? "bg-blue-50 border-blue-500 shadow-md scale-[1.02] z-10 text-blue-950 ring-2 ring-blue-400/30"
                          : "bg-slate-50/80 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${isSelected ? "text-blue-700" : "text-slate-800"}`}>
                          {zone.name}
                        </span>
                        <span className="text-[9px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono font-medium">
                          {zone.sqm} ㎡
                        </span>
                      </div>

                      {showDimensions && (
                        <div className="text-[9px] font-mono font-semibold text-slate-500">
                          {zone.dimensionsMm}
                        </div>
                      )}

                      {showMEP && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1 rounded font-medium">
                            ⚡ {zone.mepPoints.length} 点位
                          </span>
                        </div>
                      )}

                      {showSmartHome && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          <span className="text-[8px] bg-purple-50 text-purple-700 border border-purple-200 px-1 rounded font-medium">
                            🤖 {zone.smartDevices.length} 智能
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Southwest Monsoon Microclimate Flow */}
                {showMicroclimate && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="absolute bottom-2 right-4 flex items-center space-x-1 text-emerald-700 text-[10px] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <Wind className="w-3 h-3 animate-spin text-emerald-600" />
                      <span>西南季风对流 (SSE 165° → NNW 345°)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom 9 Zones Selector: Spacious, Non-Squished Flex-Shrink-0 Buttons with Smooth Arrows & Gradient Mask */}
          <div className="relative p-2.5 bg-white border-t border-slate-200 flex items-center">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollBottom("left")}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 mr-2 z-10 shadow-sm bg-white border border-slate-200"
              title="向左滑动"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Buttons Container */}
            <div
              ref={bottomScrollRef}
              className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-2 scroll-smooth px-1"
            >
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex-shrink-0 whitespace-nowrap">
                9大功能分区:
              </span>
              {ZONES_DATA.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    setActiveZone(z);
                    const coord = ZONE_3D_COORDS[z.id];
                    if (coord && controlsRef.current) {
                      controlsRef.current.setLookAt(coord.x, 4.5, coord.z + 4, coord.x, 0.5, coord.z, true);
                    }
                  }}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeZone.id === z.id
                      ? "bg-slate-900 text-white shadow-sm ring-2 ring-blue-500/30"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {z.name} ({z.sqm}㎡)
                </button>
              ))}
            </div>

            {/* Scroll Right Fade Mask */}
            <div className="pointer-events-none absolute right-12 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent" />

            {/* Scroll Right Button */}
            <button
              onClick={() => scrollBottom("right")}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 ml-2 z-10 shadow-sm bg-white border border-slate-200"
              title="向右滑动"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side Inspector: Deep-Dive Zone Info (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Zone Detail Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] text-blue-600 uppercase tracking-widest font-mono font-bold">
                  ZONE INSPECTOR
                </span>
                <h3 className="text-xl font-black text-slate-900 flex items-center mt-0.5">
                  {activeZone.name}
                  <span className="ml-2 text-xs font-normal text-slate-500 font-mono">
                    {activeZone.enName}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-slate-900 font-mono">
                  {activeZone.sqm} ㎡
                </div>
                <div className="text-[10px] text-slate-500">
                  {activeZone.sqft} sq ft
                </div>
              </div>
            </div>

            {/* Spatial Dimensions Specs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200/70 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 font-medium">净开间进深尺寸</div>
                <div className="font-mono font-bold text-slate-900 text-sm mt-0.5">{activeZone.dimensionsMm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">吊顶后净高 (Clear Height)</div>
                <div className="font-mono font-bold text-blue-600 text-sm mt-0.5">{activeZone.clearHeightMm} mm</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {activeZone.description}
            </p>

            {/* MEP Handover Points */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>交付机电底账预埋 (MEP Baseline)</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5">
                {activeZone.mepPoints.map((mep, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    <span>{mep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Home Upgrades */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                <Cpu className="w-3.5 h-3.5 text-purple-500" />
                <span>Aqara / 米家智能设备规划</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 space-y-1.5">
                {activeZone.smartDevices.map((dev, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 flex-shrink-0" />
                    <span>{dev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Microclimate & Environment Card */}
          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>新山经纬度日照实况 ({JB_LOCATION.latitude}°N, {JB_LOCATION.longitude}°E)</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              当前时段: <strong>{solarData.preset.label}</strong>。太阳方位角 <strong>{solarData.azimuthDegrees}°</strong>，高度角 <strong>{solarData.altitudeDegrees}°</strong>。{solarData.preset.description}。
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-blue-200/80 pt-2">
              {PROPERTY_DATA.microclimate.acousticsAndView}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
