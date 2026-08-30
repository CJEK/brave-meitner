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
  RotateCcw,
  Box
} from "lucide-react";
import { ZONES_DATA, STYLES_DATA, PROPERTY_DATA, ZoneData } from "@/data/projectData";
import { getJohorSunData, SOLAR_PRESETS, JB_LOCATION } from "@/utils/solarCalculator";

// Install THREE for CameraControls
CameraControls.install({ THREE });

interface Spatial3DViewerProps {
  selectedStyleId: string;
}

// 1:1 Standard Coordinate System: Width X [-3.45, +3.45] (6.9m), Depth Z [-4.8625, +4.8625] (9.725m), Origin (0,0,0) at Geometric Center
// Main Longitudinal Spine Wall at X = -0.15m:
// Left Private Axis X in [-3.45, -0.15] (Width = 3.3m, Center X = -1.8m)
// Right Public Axis X in [-0.15, +3.45] (Width = 3.6m, Center X = +1.5m)
const ZONE_3D_COORDS: { [key: string]: { x: number; z: number; w: number; d: number; label: string; mep: string[]; smart: string[] } } = {
  "entrance": {
    x: 1.5, z: -4.03, w: 3.45, d: 1.56,
    label: "入户玄关",
    mep: ["⚡ 入户照明双控开关", "⚡ DB 配电箱与弱电光纤"],
    smart: ["🤖 D200 3D人脸门锁", "🤖 入户迎宾微波感应"]
  },
  "kitchen": {
    x: 1.5, z: -2.8, w: 3.45, d: 1.44,
    label: "开放式厨房",
    mep: ["⚡ 20A 烟机灶具专用", "⚡ 厨下 RO 净水动力"],
    smart: ["🤖 烟雾/水浸传感器", "🤖 智能橱柜手扫感应"]
  },
  "dining": {
    x: 1.5, z: -1.2, w: 3.45, d: 1.75,
    label: "多功能中岛吧台",
    mep: ["⚡ 弹出式隐藏轨道插座", "⚡ 吧台电水壶/咖啡机电源"],
    smart: ["🤖 吧台调光色温旋钮", "🤖 中岛氛围悬浮吊灯"]
  },
  "living": {
    x: 1.5, z: 1.8, w: 3.45, d: 3.75,
    label: "客厅极简影音区",
    mep: ["⚡ SMATV 电视点位", "⚡ 15A 空调专用点", "⚡ 5组五孔插座", "⚡ 沙发侧 USB-C 快充"],
    smart: ["🤖 FP2 人体存在毫米波雷达", "🤖 空调伴侣 P3", "🤖 电视背景同步流光溢彩"]
  },
  "balcony": {
    x: 1.5, z: 4.28, w: 3.45, d: 1.17,
    label: "南向景观阳台",
    mep: ["⚡ 防水动力插座", "⚡ 景观洗墙射灯"],
    smart: ["🤖 C3 智能双轨电动帘", "🤖 阳台温湿度传感器"]
  },
  "yard": {
    x: -2.3, z: -4.03, w: 2.3, d: 1.65,
    label: "生活阳台与设备平台",
    mep: ["⚡ 洗衣机专用冷水给水与电源", "⚡ 扫地机上下水排污管"],
    smart: ["🤖 扫拖机器人自动上下水基站", "🤖 户外水浸漏水自切阀"]
  },
  "bathroom": {
    x: -1.8, z: -0.8, w: 1.8, d: 2.3,
    label: "独立卫浴室",
    mep: ["⚡ 1.5m 镜柜内隐藏防溅插座", "⚡ 智能马桶预留电路", "⚡ 20A 电热水器"],
    smart: ["🤖 镜面触控恒温除雾", "🤖 智能感应翻盖马桶", "🤖 地脚起夜微光感应"]
  },
  "study": {
    x: -1.5, z: 0.8, w: 3.3, d: 2.06,
    label: "极客工作站 (1+1房)",
    mep: ["⚡ 8组桌面抗涌浪插座", "⚡ 千兆网络接口 RJ45"],
    smart: ["🤖 FP2 极客坐姿姿态识别雷达", "🤖 极客工作模式自动化联动"]
  },
  "bedroom": {
    x: -1.8, z: 3.0, w: 3.3, d: 3.94,
    label: "主卧深睡空间",
    mep: ["⚡ 床头双侧双控+Type-C", "⚡ 15A 空调独立回路"],
    smart: ["🤖 C3 卧室静音电动窗帘", "🤖 FP2 睡眠监测雷达", "🤖 床底起夜感应地脚灯"]
  }
};

// 3D Anchor Points (Physically Decoupled with Vertical Elevation & Room Confinement)
const MARKER_ANCHORS = [
  { id: "d200-lock", pos: [2.2, 1.2, -4.0], label: "D200 3D人脸锁", type: "smart", icon: "🤖" },
  { id: "smatv", pos: [3.25, 0.65, 1.8], label: "SMATV 电视点位", type: "mep", icon: "⚡" },
  { id: "ac-living", pos: [3.3, 2.2, 2.8], label: "15A 空调动力", type: "mep", icon: "⚡" },
  { id: "fp2-living", pos: [1.5, 2.6, 1.0], label: "FP2 客厅微动雷达", type: "smart", icon: "🤖" },
  { id: "desk-power", pos: [-1.5, 0.9, 0.8], label: "8组桌面组合插座", type: "mep", icon: "⚡" },
  { id: "fp2-study", pos: [-1.5, 1.5, 0.8], label: "FP2 极客坐姿雷达", type: "smart", icon: "🤖" },
  { id: "vanity-power", pos: [-1.8, 1.35, -0.8], label: "1.5m 镜柜隐藏插座", type: "mep", icon: "⚡" },
  { id: "roborock", pos: [-2.2, 0.3, -3.8], label: "扫拖机自动上下水", type: "smart", icon: "🤖" },
  { id: "curtain-c3", pos: [1.5, 2.6, 4.4], label: "C3 静音双轨电动帘", type: "smart", icon: "🤖" },
  { id: "curtain-bed", pos: [-1.8, 2.6, 4.4], label: "C3 主卧静音帘", type: "smart", icon: "🤖" }
];

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({ selectedStyleId }) => {
  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "iso-2.5d" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  
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

  // 1. Initialize Three.js Scene: 6.9m × 9.725m Rectangular Slab, 0.25m Half-Walls (BIM Cutaway with 900mm Doorways), 1:1 Scaled Furniture
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 560;

    // Architectural Studio Background (#f8fafc)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf8fafc);

    // Perspective Camera: fov 45, near 0.1, far 1000
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 9, 7);

    // WebGL Renderer
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

    // Initialize CameraControls with maxPolarAngle limit
    const controls = new CameraControls(camera, renderer.domElement);
    controls.smoothTime = 0.35;
    controls.draggingSmoothTime = 0.12;
    controls.maxDistance = 24;
    controls.minDistance = 3.5;
    controls.maxPolarAngle = Math.PI / 2.2; // ~81.8 degrees, prevents clipping below ground
    controlsRef.current = controls;

    // Clean 45-degree Isometric Bird's-eye Perspective
    controls.setLookAt(0, 9, 7, 0, 0, 0, false);

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
    // 📐 HIGH-RESOLUTION ARCHITECTURAL BLUEPRINT TEXTURE GENERATOR (6.90m × 9.725m, Aspect 1 : 1.4094)
    // =========================================================================
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2888; // 6900 : 9725 exact aspect ratio (1 : 1.4094)
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

      // 3. Central Spine Wall at X = -0.15m (980px)
      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 12;

      // Outer Perimeter Border
      ctx.strokeRect(8, 8, 2032, 2872);

      // Longitudinal Main Spine Wall (X = -0.15m ~ 980px)
      ctx.beginPath();
      ctx.moveTo(980, 0);
      ctx.lineTo(980, 2888);
      ctx.stroke();

      // Left Private Zone Partitions:
      // Yard / Bath divider (Z = -1.95m ~ 860px)
      ctx.beginPath();
      ctx.moveTo(0, 860);
      ctx.lineTo(980, 860);
      ctx.stroke();

      // Bath / Study divider (Z = 0.35m ~ 1550px)
      ctx.beginPath();
      ctx.moveTo(0, 1550);
      ctx.lineTo(980, 1550);
      ctx.stroke();

      // Study / Bedroom divider (Z = 1.8m ~ 1980px)
      ctx.beginPath();
      ctx.moveTo(0, 1980);
      ctx.lineTo(980, 1980);
      ctx.stroke();

      // Right Public Zone Partitions:
      // Kitchen / Dining divider
      ctx.beginPath();
      ctx.moveTo(980, 460);
      ctx.lineTo(2048, 460);
      ctx.stroke();

      // Dining / Living divider
      ctx.beginPath();
      ctx.moveTo(980, 995);
      ctx.lineTo(2048, 995);
      ctx.stroke();

      // Living / Balcony Sliding Door Line
      ctx.strokeStyle = "#2563eb";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(980, 2450);
      ctx.lineTo(2048, 2450);
      ctx.stroke();
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
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.05 });
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

    // Helper: Create Standard 0.25m (250mm) Architectural Half-Wall (BIM Cutaway Mode, Thickness 0.15m)
    const createHalfWall = (w: number, d: number, x: number, z: number, opacity = 0.95, color = 0xe2e8f0) => {
      const wallHeight = 0.25; // 250mm dwarf wall mode
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, wallHeight, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.8,
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

      // Sits right on top of floor slab (y = wallHeight / 2 = 0.125)
      group.position.set(x, wallHeight / 2, z);
      return group;
    };

    // =========================================================================
    // 🧱 0.25m (250mm) BIM HALF-WALLS WITH 900mm DOORWAY OPENINGS
    // =========================================================================
    // 1. 纵向主墙 (Spine Wall at X = -0.15m, with 900mm Bath Doorway at Z = -0.8m)
    const spineWallNorth = createHalfWall(0.15, 3.86, -0.15, -2.93); // from z: -4.8625 to -1.0
    const spineWallSouth = createHalfWall(0.15, 4.56, -0.15, 2.58);   // from z: 0.3 to 4.8625
    scene.add(spineWallNorth, spineWallSouth);

    // 2. 卫浴室隔墙 (Bath 1: 1.8m W × 2.3m D, center at X: -1.8m, Z: -0.8m)
    const bathNorthWall = createHalfWall(1.8, 0.15, -1.8, -1.95);
    const bathSouthWall = createHalfWall(1.8, 0.15, -1.8, 0.35);
    scene.add(bathNorthWall, bathSouthWall);

    // 3. 主卧北侧隔墙 (Bedroom Wall at Z = 1.8m, with 900mm Bedroom Doorway at X = -0.9m)
    const bedWallLeft = createHalfWall(2.1, 0.15, -2.4, 1.8);  // from x: -3.45 to -1.35
    const bedWallRight = createHalfWall(0.3, 0.15, -0.3, 1.8); // from x: -0.45 to -0.15
    scene.add(bedWallLeft, bedWallRight);

    // 4. 生活阳台隔墙 (Yard Wall at Z = -3.2m, from X = -3.45 to -0.15)
    const yardWall = createHalfWall(3.3, 0.15, -1.8, -3.2);
    scene.add(yardWall);

    // 5. 南向景观阳台玻璃栏杆 (Balcony Glass Railing at Z = 4.86m, from X = -0.15 to 3.45)
    const balconyGlassRailing = createHalfWall(3.6, 0.06, 1.5, 4.86, 0.6, 0x60a5fa);
    scene.add(balconyGlassRailing);

    // =========================================================================
    // 🛋️ CALIBRATED REAL-WORLD 3D FURNITURE (Correct Positions & Zero Black Holes)
    // =========================================================================

    // --- 1. [客厅极简影音区] (东南角, Center X: +1.5m, Z: +1.8m) ---
    // Sofa (West side, facing East TV wall): W=0.85 (X), H=0.45, D=2.4 (Z)
    const sofa = createFurniture(0.85, 0.45, 2.4, 0.55, 0.225, 1.8, 0xe2e8f0, 0x64748b);
    const sofaShadow = createContactShadow(1.0, 2.6, 0.55, 1.8, 0.35);

    // TV Console (backed on East wall at X=3.125, running along Z): W=0.35 (X), H=0.22, D=2.4 (Z)
    const tvStand = createFurniture(0.35, 0.22, 2.4, 3.125, 0.11, 1.8, 0xcbd5e1, 0x475569);
    const tvStandShadow = createContactShadow(0.5, 2.6, 3.125, 1.8, 0.3);

    // 85" Floating TV Screen (flush on East wall at X=3.25, height 1.2m level, neutral matte slate gray):
    const tvScreen = createFurniture(0.04, 0.55, 1.8, 3.25, 0.45, 1.8, 0x64748b, 0x94a3b8);

    // Coffee Table (centered in wide 1.85m aisle between Sofa and TV): W=0.55, H=0.22, D=0.90
    const coffeeTable = createFurniture(0.55, 0.22, 0.9, 1.85, 0.11, 1.8, 0xf1f5f9, 0x94a3b8);
    scene.add(sofaShadow, sofa, tvStandShadow, tvStand, tvScreen, coffeeTable);

    // --- 2. [开放式厨房 & 多功能中岛吧台] (Center X: +1.5m, Z: -2.8m & -1.2m) ---
    // Kitchen Counter along North Wall: W=3.2 (X), H=0.45, D=0.60 (Z) at Z = -2.8m
    const kitchenCounter = createFurniture(3.2, 0.45, 0.6, 1.5, 0.225, -2.8, 0xd1d5db, 0x334155);
    const kitchenShadow = createContactShadow(3.4, 0.8, 1.5, -2.8, 0.3);

    // 1.8m Sintered Stone Island at Z = -1.2m (leaves 900mm passage to kitchen counter!): W=1.8 (X), H=0.55, D=0.85 (Z)
    const island = createFurniture(1.8, 0.55, 0.85, 1.5, 0.275, -1.2, 0xffffff, 0x1e293b);
    const islandShadow = createContactShadow(2.0, 1.05, 1.5, -1.2, 0.35);
    const islandWood = createFurniture(0.75, 0.06, 0.75, 2.1, 0.55, -1.2, 0xd4a373, 0x78350f);
    scene.add(kitchenShadow, kitchenCounter, islandShadow, island, islandWood);

    // --- 3. [独立卫浴室 Bath 1] (1.8m W × 2.3m D, Center X: -1.8m, Z: -0.8m) ---
    // 1.8m Hotel Vanity Platform along West Wall: W=0.55 (X), H=0.25, D=1.8 (Z)
    const vanityLedge = createFurniture(0.55, 0.25, 1.8, -2.425, 0.125, -0.8, 0xffffff, 0x2563eb);
    const mirrorCabinet = createFurniture(0.1, 0.25, 1.8, -2.65, 0.25, -0.8, 0xeff6ff, 0x1d4ed8);
    const toilet = createFurniture(0.55, 0.22, 0.45, -2.425, 0.11, 0.05, 0xffffff, 0x64748b);
    scene.add(vanityLedge, mirrorCabinet, toilet);

    // --- 4. [1+1 极客工作站 Study Area] (Center X: -1.5m, Z: +0.8m) ---
    // 2.0m Lifting Desk: W=1.8 (X), H=0.35, D=0.75 (Z)
    const liftDesk = createFurniture(1.8, 0.06, 0.75, -1.5, 0.35, 0.8, 0xd4a373, 0x78350f);
    const deskShadow = createContactShadow(2.0, 0.95, -1.5, 0.8, 0.35);
    const deskLeg1 = createFurniture(0.08, 0.32, 0.6, -2.25, 0.16, 0.8, 0x334155, 0x0f172a);
    const deskLeg2 = createFurniture(0.08, 0.32, 0.6, -0.75, 0.16, 0.8, 0x334155, 0x0f172a);
    const dualScreen = createFurniture(1.4, 0.35, 0.04, -1.5, 0.45, 0.45, 0x2563eb, 0x1e40af);
    const luggageCabinet = createFurniture(0.55, 0.25, 1.2, -3.125, 0.125, 0.8, 0xf1f5f9, 0x94a3b8);
    scene.add(deskShadow, liftDesk, deskLeg1, deskLeg2, dualScreen, luggageCabinet);

    // --- 5. [主卧深睡空间 Master Bedroom] (西南角, Center X: -1.8m, Z: +3.0m) ---
    // King Bed 1.8m × 2.0m: W=1.8 (X), H=0.35, D=2.0 (Z)
    const bedShadow = createContactShadow(2.0, 2.2, -1.8, 3.0, 0.38);
    const bedBase = createFurniture(1.8, 0.22, 2.0, -1.8, 0.11, 3.0, 0xb0b8c4, 0x1e293b);
    const mattress = createFurniture(1.6, 0.15, 1.9, -1.8, 0.28, 3.0, 0xffffff, 0x64748b);
    const headboard = createFurniture(1.9, 0.25, 0.08, -1.8, 0.25, 1.96, 0xd1d5db, 0x334155);

    // Wardrobe along West Wall: W=0.55 (X), H=0.25 (Half-Wall Slice), D=2.6 (Z)
    const wardrobe = createFurniture(0.55, 0.25, 2.6, -3.125, 0.125, 3.0, 0xffffff, 0x94a3b8);
    scene.add(bedShadow, bedBase, mattress, headboard, wardrobe);

    // --- 6. [生活阳台 / 家政区] (西北角, Center X: -2.3m, Z: -4.0m) ---
    const washer = createFurniture(0.75, 0.25, 0.75, -2.6, 0.125, -4.0, 0xe2e8f0, 0x475569);
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
      // Public Living Room Clear Width Line (3,600 mm)
      dimensionGroupRef.current.add(drawDimLine([-0.15, 0.15, 3.4], [3.45, 0.15, 3.4], 0x3b82f6));
      // Private Bedroom Clear Width Line (3,300 mm)
      dimensionGroupRef.current.add(drawDimLine([-3.45, 0.15, 1.8], [-0.15, 0.15, 1.8], 0x8b5cf6));
    }
  }, [showDimensions]);

  // 5. Smooth Camera Preset Navigation with CameraControls (Clean 45-degree isometric perspective)
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (cameraPreset) {
      case "birds-eye":
        ctrl.setLookAt(0, 9, 7, 0, 0, 0, true);
        break;
      case "iso-2.5d":
        ctrl.setLookAt(8.5, 8.5, 8.5, 0, 0, 0, true);
        break;
      case "living":
        ctrl.setLookAt(1.5, 4.5, 4.2, 1.5, 0.3, 1.8, true);
        break;
      case "workstation":
        ctrl.setLookAt(-1.5, 4.2, 2.8, -1.5, 0.3, 0.8, true);
        break;
      case "bedroom":
        ctrl.setLookAt(-1.8, 4.2, 5.2, -1.8, 0.3, 3.0, true);
        break;
      case "balcony":
        ctrl.setLookAt(1.5, 2.8, 2.2, 1.5, 0.3, 4.28, true);
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
            2.5D 等轴测户型图 (Isometric BIM)
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
        {/* 3D / 2.5D Viewport (8 Columns) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm flex flex-col min-h-[560px]">
          {/* Top Camera Presets Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 font-semibold px-2 py-1 flex items-center">
              <Eye className="w-3 h-3 mr-1 text-blue-600" />
              视角:
            </span>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("birds-eye");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "3d" && cameraPreset === "birds-eye"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              俯瞰全景
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("iso-2.5d");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                viewMode === "3d" && cameraPreset === "iso-2.5d"
                  ? "bg-blue-600 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              45° 等轴测 3D
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("living");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "living"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              客厅影音
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("workstation");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "workstation"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              极客工位
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("bedroom");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "bedroom"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              主卧深睡
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                setCameraPreset("balcony");
              }}
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

          {/* Direct Raycasting / Click Hint Badge */}
          <div className="absolute bottom-16 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm text-[11px] text-slate-700 pointer-events-none">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>点击任意房间即刻高亮检视</span>
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
            /* 2.5D ISOMETRIC ARCHITECTURAL BIM BLUEPRINT (1:1 Exact 6.9m × 9.725m Scale, 52%/48% East/West Split, 900mm Doors with Opening Arcs, 1:1 Furniture Line Art) */
            <div className="w-full flex-1 min-h-[520px] p-6 bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[620px] aspect-[690/972.5] bg-[#ede8df] rounded-3xl border-4 border-slate-300 p-4 shadow-xl overflow-hidden flex flex-col justify-between">
                
                {/* SVG Isometric Architectural Floor Plan */}
                <svg viewBox="0 0 690 972.5" className="w-full h-full">
                  {/* Subtle 600mm Floor Tile Grid */}
                  <pattern id="iso-tile-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                    <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#d1d5db" strokeWidth="1" opacity="0.6" />
                  </pattern>
                  <rect x="0" y="0" width="690" height="972.5" fill="url(#iso-tile-grid)" rx="16" />

                  {/* Outer Architectural Perimeter Wall (200mm) */}
                  <rect x="6" y="6" width="678" height="960.5" fill="none" stroke="#1e293b" strokeWidth="12" rx="14" />

                  {/* Longitudinal Main Spine Wall at X = 330px (150mm thickness, divides West 3.3m & East 3.6m) */}
                  <line x1="330" y1="6" x2="330" y2="966.5" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />

                  {/* ========================================================================= */}
                  {/* 1. [LEFT PRIVATE ZONE] (X: 0 to 330px, Width 3.3m) */}
                  {/* ========================================================================= */}
                  
                  {/* (1) 生活阳台 YARD (Top Left, Z: 0 ~ 166px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[5])} className="cursor-pointer group">
                    <rect
                      x="12" y="12" width="312" height="154"
                      fill={activeZone.id === "yard" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "yard" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* Washer Appliance Line Art */}
                    <rect x="25" y="25" width="70" height="65" fill="#e2e8f0" stroke="#475569" strokeWidth="2" rx="4" />
                    <circle cx="60" cy="57" r="18" fill="none" stroke="#64748b" strokeWidth="2" />
                    {/* Auto Water Station */}
                    <rect x="105" y="25" width="45" height="40" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
                    <text x="127" y="50" fill="#2563eb" fontSize="11" fontWeight="bold" textAnchor="middle">扫拖机</text>
                    <text x="168" y="120" fill="#1e293b" fontSize="17" fontWeight="bold" textAnchor="middle">生活阳台 YARD (3.8㎡)</text>
                  </g>

                  {/* Transverse Wall 1 (Yard / Bath at Y = 170px) */}
                  <line x1="12" y1="170" x2="330" y2="170" stroke="#1e293b" strokeWidth="8" />

                  {/* (2) 独立卫浴室 BATH 1 (Mid-Left 1, Z: 175 ~ 395px, 1.8m × 2.3m, 4.5 ㎡) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[7])} className="cursor-pointer group">
                    <rect
                      x="12" y="175" width="312" height="220"
                      fill={activeZone.id === "bathroom" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "bathroom" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* 1.8m Hotel Vanity Counter */}
                    <rect x="25" y="190" width="140" height="60" fill="#ffffff" stroke="#2563eb" strokeWidth="2" rx="3" />
                    <ellipse cx="95" cy="220" rx="32" ry="20" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                    {/* Smart Toilet */}
                    <rect x="235" y="190" width="55" height="75" fill="#ffffff" stroke="#64748b" strokeWidth="2" rx="16" />
                    {/* Shower Screen */}
                    <line x1="25" y1="290" x2="150" y2="290" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2" />
                    <text x="168" y="340" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">独立卫浴 BATH 1 (4.5㎡)</text>
                  </g>

                  {/* 900mm Bath Door Opening & Swing Arc at Z = 370px */}
                  <path d="M 330 350 A 55 55 0 0 0 275 405" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="330" y1="350" x2="275" y2="405" stroke="#1e293b" strokeWidth="3" />

                  {/* Transverse Wall 2 (Bath / Study at Y = 405px) */}
                  <line x1="12" y1="405" x2="330" y2="405" stroke="#1e293b" strokeWidth="8" />

                  {/* (3) 1+1 极客工作站 STUDY (Mid-Left 2, Z: 410 ~ 595px, 6.8 ㎡) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[6])} className="cursor-pointer group">
                    <rect
                      x="12" y="410" width="312" height="180"
                      fill={activeZone.id === "study" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "study" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* 2.0m Lifting Desk Line Art */}
                    <rect x="55" y="435" width="190" height="70" fill="#fed7aa" stroke="#c2410c" strokeWidth="2" rx="4" />
                    {/* Dual 32" Monitors */}
                    <rect x="75" y="415" width="65" height="12" fill="#0f172a" stroke="#2563eb" strokeWidth="2" rx="2" />
                    <rect x="150" y="415" width="65" height="12" fill="#0f172a" stroke="#2563eb" strokeWidth="2" rx="2" />
                    {/* Ergonomic Chair */}
                    <circle cx="150" cy="535" r="22" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                    <text x="168" y="490" fill="#1e293b" fontSize="17" fontWeight="bold" textAnchor="middle">极客工位 STUDY (6.8㎡)</text>
                  </g>

                  {/* Transverse Wall 3 (Study / Bedroom at Y = 595px) */}
                  <line x1="12" y1="595" x2="245" y2="595" stroke="#1e293b" strokeWidth="8" />
                  <line x1="315" y1="595" x2="330" y2="595" stroke="#1e293b" strokeWidth="8" />

                  {/* (4) 主卧深睡空间 MASTER BEDROOM (Bottom Left, Z: 600 ~ 960px, 14.2 ㎡) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[8])} className="cursor-pointer group">
                    <rect
                      x="12" y="600" width="312" height="360"
                      fill={activeZone.id === "bedroom" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "bedroom" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* King Bed 1.8m × 2.0m Line Art */}
                    <rect x="70" y="650" width="175" height="210" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" rx="6" />
                    {/* Pillows */}
                    <rect x="85" y="660" width="60" height="40" fill="#cbd5e1" rx="4" />
                    <rect x="170" y="660" width="60" height="40" fill="#cbd5e1" rx="4" />
                    {/* Headboard */}
                    <rect x="60" y="635" width="195" height="15" fill="#64748b" rx="2" />
                    {/* Wardrobe along West Wall */}
                    <rect x="18" y="650" width="40" height="260" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5" rx="2" />
                    <text x="38" y="780" fill="#64748b" fontSize="12" fontWeight="bold" transform="rotate(-90 38 780)">通顶定制衣柜 (深600mm)</text>
                    <text x="168" y="900" fill="#1e293b" fontSize="19" fontWeight="bold" textAnchor="middle">主卧深睡 BEDROOM (14.2㎡)</text>
                  </g>

                  {/* 900mm Bedroom Door Opening & Swing Arc at Z = 600px */}
                  <path d="M 330 610 A 65 65 0 0 1 265 675" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="330" y1="610" x2="265" y2="675" stroke="#1e293b" strokeWidth="3" />

                  {/* ========================================================================= */}
                  {/* 2. [RIGHT PUBLIC ZONE] (X: 330px to 690px, Width 3.6m) */}
                  {/* ========================================================================= */}

                  {/* (5) 入户玄关 ENTRANCE FOYER (Top Right, Z: 0 ~ 155px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[0])} className="cursor-pointer group">
                    <rect
                      x="335" y="12" width="343" height="142"
                      fill={activeZone.id === "entrance" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "entrance" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* Shoe Cabinet */}
                    <rect x="580" y="20" width="85" height="40" fill="#e2e8f0" stroke="#475569" strokeWidth="2" rx="3" />
                    {/* D200 Face Lock Icon */}
                    <circle cx="660" cy="40" r="8" fill="#2563eb" />
                    <text x="506" y="95" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">入户玄关 ENTRANCE (3.8㎡)</text>
                  </g>

                  {/* Transverse Wall (Entrance / Kitchen at Y = 158px) */}
                  <line x1="335" y1="158" x2="678" y2="158" stroke="#cbd5e1" strokeWidth="3" strokeDasharray="6 4" />

                  {/* (6) 开放式厨房 OPEN KITCHEN (Mid-Right 1, Z: 160 ~ 310px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[1])} className="cursor-pointer group">
                    <rect
                      x="335" y="162" width="343" height="145"
                      fill={activeZone.id === "kitchen" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "kitchen" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* L-Shape Countertop */}
                    <rect x="345" y="170" width="323" height="50" fill="#ffffff" stroke="#475569" strokeWidth="2" rx="3" />
                    {/* Dual Induction Hob */}
                    <circle cx="420" cy="195" r="14" fill="#334155" />
                    <circle cx="460" cy="195" r="14" fill="#334155" />
                    {/* Kitchen Sink */}
                    <rect x="550" y="180" width="60" height="30" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
                    <text x="506" y="270" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">开放厨房 KITCHEN (5.2㎡)</text>
                  </g>

                  {/* (7) 多功能中岛吧台 DINING ISLAND (Mid-Right 2, Z: 315 ~ 490px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[2])} className="cursor-pointer group">
                    <rect
                      x="335" y="315" width="343" height="175"
                      fill={activeZone.id === "dining" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "dining" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* 1.8m Sintered Stone Island Line Art */}
                    <rect x="406" y="350" width="180" height="90" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" rx="6" />
                    {/* Pop-up Track Socket */}
                    <rect x="417" y="390" width="20" height="10" fill="#f59e0b" rx="2" />
                    {/* Bar Stools */}
                    <circle cx="450" cy="460" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="496" cy="460" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <circle cx="542" cy="460" r="14" fill="#cbd5e1" stroke="#475569" strokeWidth="1.5" />
                    <text x="506" y="405" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">多功能中岛 DINING (4.2㎡)</text>
                  </g>

                  {/* (8) 客厅极简影音区 LIVING & AV (东南角, Mid-Right 3, Z: 495 ~ 825px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[3])} className="cursor-pointer group">
                    <rect
                      x="335" y="495" width="343" height="325"
                      fill={activeZone.id === "living" ? "#dbeafe" : "#f8fafc"}
                      stroke={activeZone.id === "living" ? "#2563eb" : "#94a3b8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* 2.4m Straight Sofa Line Art */}
                    <rect x="355" y="600" width="85" height="180" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" rx="8" />
                    {/* 85" Floating TV Screen on East Wall */}
                    <rect x="660" y="540" width="10" height="200" fill="#64748b" stroke="#94a3b8" strokeWidth="2" rx="2" />
                    {/* Floating TV Stand */}
                    <rect x="640" y="520" width="22" height="240" fill="#e2e8f0" stroke="#475569" strokeWidth="1.5" rx="3" />
                    {/* Coffee Table */}
                    <rect x="475" y="650" width="70" height="80" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" rx="6" />
                    <text x="506" y="570" fill="#1e293b" fontSize="20" fontWeight="bold" textAnchor="middle">客厅极简影音 LIVING (13.5㎡)</text>
                  </g>

                  {/* South Balcony Glass Sliding Door at Z = 825px */}
                  <line x1="335" y1="825" x2="678" y2="825" stroke="#0284c7" strokeWidth="6" />

                  {/* (9) 南向景观阳台 LANDSCAPE BALCONY (Bottom Right, Z: 830 ~ 960px) */}
                  <g onClick={() => setActiveZone(ZONES_DATA[4])} className="cursor-pointer group">
                    <rect
                      x="335" y="830" width="343" height="130"
                      fill={activeZone.id === "balcony" ? "#e0f2fe" : "#f0f9ff"}
                      stroke={activeZone.id === "balcony" ? "#0284c7" : "#38bdf8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    {/* High Bar Table & Chairs */}
                    <rect x="370" y="855" width="180" height="35" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" rx="4" />
                    <circle cx="420" cy="910" r="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="500" cy="910" r="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="506" y="935" fill="#0369a1" fontSize="18" fontWeight="bold" textAnchor="middle">南向阳台 BALCONY (4.2㎡)</text>
                  </g>
                </svg>

                {/* 2.5D Isometric Status Overlay */}
                <div className="absolute top-6 left-6 z-10 flex items-center space-x-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm text-xs font-bold text-slate-800">
                  <Box className="w-4 h-4 text-blue-600" />
                  <span>2.5D 等轴测 BIM 户型图 · 9 大分区 1:1 物理拓扑 (60.22 ㎡)</span>
                </div>
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
                    if (coord && controlsRef.current && viewMode === "3d") {
                      controlsRef.current.setLookAt(coord.x, 4.5, coord.z + 4, coord.x, 0.3, coord.z, true);
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
