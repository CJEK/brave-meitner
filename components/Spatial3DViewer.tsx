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

// 1:1 Standard Coordinate System: Width X [-3.45, +3.45], Depth Z [-4.86, +4.86], Origin (0,0,0) at Center
const ZONE_3D_COORDS: { [key: string]: { x: number; z: number; w: number; d: number; label: string; mep: string[]; smart: string[] } } = {
  "entrance": {
    x: 2.2, z: -4.0, w: 2.3, d: 1.6,
    label: "入户玄关",
    mep: ["⚡ 入户照明双控开关", "⚡ DB 配电箱与弱电光纤"],
    smart: ["🤖 D200 3D人脸门锁", "🤖 入户迎宾微波感应"]
  },
  "kitchen": {
    x: 1.6, z: -2.8, w: 3.3, d: 1.5,
    label: "开放式厨房",
    mep: ["⚡ 20A 烟机灶具专用", "⚡ 厨下 RO 净水动力"],
    smart: ["🤖 烟雾/水浸传感器", "🤖 智能橱柜手扫感应"]
  },
  "dining": {
    x: 1.6, z: -1.0, w: 3.3, d: 1.7,
    label: "多功能中岛吧台",
    mep: ["⚡ 弹出式隐藏轨道插座", "⚡ 吧台电水壶/咖啡机电源"],
    smart: ["🤖 吧台调光色温旋钮", "🤖 中岛氛围悬浮吊灯"]
  },
  "living": {
    x: 1.6, z: 1.6, w: 3.5, d: 3.1,
    label: "客厅极简影音区",
    mep: ["⚡ SMATV 电视点位", "⚡ 15A 空调专用点", "⚡ 5组五孔插座", "⚡ 沙发侧 USB-C 快充"],
    smart: ["🤖 FP2 人体存在毫米波雷达", "🤖 空调伴侣 P3", "🤖 电视背景同步流光溢彩"]
  },
  "balcony": {
    x: 1.6, z: 4.0, w: 3.5, d: 1.5,
    label: "南向景观阳台",
    mep: ["⚡ 防水动力插座", "⚡ 景观洗墙射灯"],
    smart: ["🤖 C3 智能双轨电动帘", "🤖 阳台温湿度传感器"]
  },
  "study": {
    x: -1.6, z: -1.6, w: 3.1, d: 1.5,
    label: "极客工作站 (1+1房)",
    mep: ["⚡ 8组桌面抗涌浪插座", "⚡ 千兆网络接口 RJ45"],
    smart: ["🤖 FP2 极客坐姿姿态识别雷达", "🤖 极客工作模式自动化联动"]
  },
  "bedroom": {
    x: -1.8, z: 2.6, w: 3.1, d: 2.7,
    label: "主卧深睡空间",
    mep: ["⚡ 床头双侧双控+Type-C", "⚡ 15A 空调独立回路"],
    smart: ["🤖 C3 卧室静音电动窗帘", "🤖 FP2 睡眠监测雷达", "🤖 床底起夜感应地脚灯"]
  },
  "bathroom": {
    x: -1.8, z: 0.0, w: 3.1, d: 2.2,
    label: "卫浴室 (大平台+大镜面)",
    mep: ["⚡ 1.5m 镜柜内隐藏防溅插座", "⚡ 智能马桶预留电路", "⚡ 20A 电热水器"],
    smart: ["🤖 镜面触控恒温除雾", "🤖 智能感应翻盖马桶", "🤖 地脚起夜微光感应"]
  },
  "yard": {
    x: -1.8, z: -3.8, w: 3.1, d: 1.9,
    label: "生活阳台与设备平台",
    mep: ["⚡ 洗衣机专用冷水给水与电源", "⚡ 扫地机上下水排污管"],
    smart: ["🤖 扫拖机器人自动上下水基站", "🤖 户外水浸漏水自切阀"]
  }
};

// 3D Anchor Points for Screen-Projected Badges (Anchored to Real Physical Walls & Fixtures)
const MARKER_ANCHORS = [
  { id: "d200-lock", pos: [2.5, 1.4, -4.8], label: "D200 3D人脸锁", type: "smart", icon: "🤖" },
  { id: "smatv", pos: [3.3, 1.4, 1.6], label: "SMATV 电视点", type: "mep", icon: "⚡" },
  { id: "ac-living", pos: [3.3, 2.5, 3.0], label: "15A 空调动力", type: "mep", icon: "⚡" },
  { id: "fp2-living", pos: [1.6, 2.7, 1.6], label: "FP2 存在雷达", type: "smart", icon: "🤖" },
  { id: "desk-power", pos: [-1.6, 1.0, -1.6], label: "8组桌面插座", type: "mep", icon: "⚡" },
  { id: "fp2-study", pos: [-1.6, 2.7, -1.6], label: "FP2 极客坐姿雷达", type: "smart", icon: "🤖" },
  { id: "vanity-power", pos: [-3.3, 1.3, 0.0], label: "1.5m 镜柜隐藏插座", type: "mep", icon: "⚡" },
  { id: "roborock", pos: [-3.0, 0.9, -3.8], label: "扫拖机自动上下水", type: "smart", icon: "🤖" },
  { id: "curtain-c3", pos: [1.6, 2.5, 4.6], label: "C3 南向双轨帘", type: "smart", icon: "🤖" },
  { id: "curtain-bed", pos: [-3.3, 2.5, 3.8], label: "C3 主卧静音帘", type: "smart", icon: "🤖" }
];

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({ selectedStyleId }) => {
  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  
  // Layer Toggles
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showMEP, setShowMEP] = useState<boolean>(true);
  const [showSmartHome, setShowSmartHome] = useState<boolean>(true);
  const [showMicroclimate, setShowMicroclimate] = useState<boolean>(true);
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

  // 1. Initialize Three.js Scene: 6,900 × 9,725 mm Strict Coordinates & Topological Physical Walls
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 560;

    // Architectural Studio Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf1f5f9);

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 16, 16);

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
    controls.maxDistance = 35;
    controls.minDistance = 4;
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controlsRef.current = controls;

    // Set Initial LookAt
    controls.setLookAt(0, 17, 16, 0, 0, 0, false);

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
    sunLight.shadow.camera.left = -10;
    sunLight.shadow.camera.right = 10;
    sunLight.shadow.camera.top = 10;
    sunLight.shadow.camera.bottom = -10;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.6);
    fillLight.position.set(-8, 10, -10);
    scene.add(fillLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0x94a3b8, 0xcbd5e1);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // Base Floor Slab: Exactly 6.90m (Width) × 9.725m (Depth)
    const floorGeometry = new THREE.BoxGeometry(6.90, 0.15, 9.725);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xede8df,
      roughness: 0.4,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.position.y = -0.075;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    const floorEdges = new THREE.EdgesGeometry(floorGeometry);
    const floorLine = new THREE.LineSegments(floorEdges, new THREE.LineBasicMaterial({ color: 0x64748b, linewidth: 2 }));
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
    const createContactShadow = (w: number, d: number, x: number, z: number, opacity = 0.32) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const gradient = ctx.createRadialGradient(32, 32, 4, 32, 32, 30);
        gradient.addColorStop(0, "rgba(51, 65, 85, 0.9)");
        gradient.addColorStop(0.5, "rgba(71, 85, 105, 0.35)");
        gradient.addColorStop(1, "rgba(100, 116, 139, 0)");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(canvas);
      const planeGeom = new THREE.PlaneGeometry(w * 1.12, d * 1.12);
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
    const createFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, color = 0xcbd5e1, edgeColor = 0x475569) => {
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

    // Helper: Create Solid Architectural Partition Wall with Crisp Outlines
    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number, opacity = 1, color = 0xffffff) => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        transparent: opacity < 1,
        opacity
      });
      const wall = new THREE.Mesh(geom, mat);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);

      if (opacity >= 0.8) {
        const edges = new THREE.EdgesGeometry(geom);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x94a3b8 }));
        group.add(line);
      }

      group.position.set(x, y, z);
      return group;
    };

    // =========================================================================
    // 🧱 1:1 REAL ARCHITECTURAL PARTITION WALLS & DOORWAYS (Type B Topology)
    // =========================================================================

    // 1. Perimeter Walls: 6.90m (W) × 9.725m (D) × 2.75m (H)
    const northWallLeft = createWall(3.45, 2.75, 0.18, -1.725, 1.375, -4.86); // Yard side
    const northWallRight = createWall(2.4, 2.75, 0.18, 1.2, 1.375, -4.86);   // Kitchen side (leaving entrance door at x: 2.4~3.45)
    const westWall = createWall(0.18, 2.75, 9.725, -3.45, 1.375, 0);         // Solid west exterior wall
    const eastWall = createWall(0.18, 2.75, 9.725, 3.45, 1.375, 0);          // Solid east party wall
    const southWallBed = createWall(3.45, 2.75, 0.18, -1.725, 1.375, 4.86);  // Bedroom south wall
    scene.add(northWallLeft, northWallRight, westWall, eastWall, southWallBed);

    // 2. 纵向主隔墙 (Longitudinal Spine Wall at X = -0.15m)
    // Separates Left Private Zone (Yard, Bath, Bedroom) from Right Public Zone (Entrance, Kitchen, Living, Balcony)
    const spineWallYard = createWall(0.15, 2.75, 2.36, -0.15, 1.375, -3.68); // Between Yard & Entrance/Kitchen
    const spineWallBathTop = createWall(0.15, 2.75, 0.8, -0.15, 1.375, -0.8); // Bathroom east wall top
    const spineWallBathBottom = createWall(0.15, 2.75, 0.6, -0.15, 1.375, 0.9); // Bathroom east wall bottom (900mm Bath Door opening at z: -0.2)
    const spineWallBed = createWall(0.15, 2.75, 3.66, -0.15, 1.375, 3.03);    // Solid wall between Bedroom & Living/Balcony
    scene.add(spineWallYard, spineWallBathTop, spineWallBathBottom, spineWallBed);

    // 3. 独立封闭卫浴室 (Bathroom Partitions at Z: [-1.2, +1.2], X: [-3.45, -0.15])
    const bathNorthWall = createWall(3.3, 2.75, 0.15, -1.8, 1.375, -1.2);     // Solid wall between Bath & Yard
    const bathSouthWallLeft = createWall(2.0, 2.75, 0.15, -2.45, 1.375, 1.2); // Wall between Bath & Master Bed
    const bathSouthWallRight = createWall(0.4, 2.75, 0.15, -0.35, 1.375, 1.2); // (900mm Master Bed Door opening at x: -1.0)
    scene.add(bathNorthWall, bathSouthWallLeft, bathSouthWallRight);

    // 4. 生活阳台 (Yard Partition at Z: -2.5m)
    const yardSouthWall = createWall(3.3, 2.75, 0.15, -1.8, 1.375, -2.5);
    scene.add(yardSouthWall);

    // 5. 客厅南向阳台推拉门与玻璃栏杆 (Balcony Glass Sliding Doors at Z: 3.2m & Railing at Z: 4.86m)
    const balconySlidingGlass = createWall(3.45, 2.5, 0.05, 1.65, 1.25, 3.2, 0.45, 0x93c5fd);
    const balconyGlassRailing = createWall(3.45, 1.1, 0.06, 1.65, 0.55, 4.86, 0.5, 0x60a5fa);
    scene.add(balconySlidingGlass, balconyGlassRailing);

    // =========================================================================
    // 🛋️ FURNITURE & FIXTURES (Aligned to Real Room Coordinates)
    // =========================================================================

    // --- 1. [右侧动区] 客厅极简影音区 (X: +1.6, Z: +1.6) ---
    const sofa = createFurniture(2.6, 0.75, 1.1, 0.7, 0.45, 1.6, 0xb0b8c4, 0x334155);
    const sofaShadow = createContactShadow(2.8, 1.3, 0.7, 1.6, 0.35);
    const tvStand = createFurniture(3.0, 0.35, 0.45, 3.1, 0.3, 1.6, 0xd1d5db, 0x475569);
    const tvStandShadow = createContactShadow(3.2, 0.6, 3.1, 1.6, 0.3);
    const tvScreen = createFurniture(0.06, 1.4, 2.6, 3.35, 1.45, 1.6, 0x1e293b, 0x0f172a);
    scene.add(sofaShadow, sofa, tvStandShadow, tvStand, tvScreen);

    // --- 2. [右侧动区] 开放式厨房与中岛吧台 (X: +1.6, Z: -2.8 / -1.0) ---
    const kitchenCounter = createFurniture(3.2, 0.95, 0.7, 1.6, 0.55, -2.8, 0xd1d5db, 0x475569);
    const kitchenShadow = createContactShadow(3.4, 0.9, 1.6, -2.8, 0.3);
    const island = createFurniture(2.4, 1.05, 0.9, 1.6, 0.6, -1.0, 0xffffff, 0x475569);
    const islandShadow = createContactShadow(2.6, 1.1, 1.6, -1.0, 0.35);
    const islandWood = createFurniture(0.9, 0.08, 0.9, 2.5, 0.95, -1.0, 0xd4a373, 0x78350f);
    scene.add(kitchenShadow, kitchenCounter, islandShadow, island, islandWood);

    // --- 3. [左侧静区] 极客工作站 (1+1房, X: -1.6, Z: -1.6) ---
    const liftDesk = createFurniture(2.0, 0.08, 0.8, -1.6, 0.95, -1.6, 0xd4a373, 0x78350f);
    const deskShadow = createContactShadow(2.2, 1.0, -1.6, -1.6, 0.32);
    const deskLeg1 = createFurniture(0.12, 0.9, 0.7, -2.4, 0.48, -1.6, 0x475569, 0x1e293b);
    const deskLeg2 = createFurniture(0.12, 0.9, 0.7, -0.8, 0.48, -1.6, 0x475569, 0x1e293b);
    const dualScreen = createFurniture(1.4, 0.6, 0.05, -1.6, 1.45, -1.8, 0x2563eb, 0x1e40af);
    scene.add(deskShadow, liftDesk, deskLeg1, deskLeg2, dualScreen);

    // --- 4. [左侧静区] 独立封闭卫浴室 (1.5m 贯穿大平台, X: -1.8, Z: 0.0) ---
    const vanityLedge = createFurniture(1.5, 0.35, 0.7, -2.6, 0.8, 0.0, 0xffffff, 0x2563eb);
    const mirrorCabinet = createFurniture(1.5, 0.9, 0.12, -2.6, 1.5, -0.5, 0xeff6ff, 0x1d4ed8);
    const toilet = createFurniture(0.5, 0.5, 0.7, -1.1, 0.35, 0.4, 0xffffff, 0x94a3b8);
    scene.add(vanityLedge, mirrorCabinet, toilet);

    // --- 5. [左侧静区] 主卧深睡空间 (X: -1.8, Z: +2.6) ---
    const bedShadow = createContactShadow(2.2, 2.4, -1.8, 2.6, 0.35);
    const bedBase = createFurniture(2.0, 0.4, 2.2, -1.8, 0.28, 2.6, 0xb0b8c4, 0x475569);
    const mattress = createFurniture(1.8, 0.35, 2.0, -1.8, 0.58, 2.6, 0xffffff, 0x94a3b8);
    const headboard = createFurniture(2.2, 1.1, 0.12, -1.8, 0.85, 1.45, 0xd1d5db, 0x475569);
    const wardrobe = createFurniture(0.6, 2.6, 2.4, -3.1, 1.35, 2.6, 0xffffff, 0x94a3b8);
    scene.add(bedShadow, bedBase, mattress, headboard, wardrobe);

    // --- 6. [左侧静区] 生活阳台/家政区 (X: -1.8, Z: -3.8) ---
    const washer = createFurniture(1.0, 1.2, 0.9, -2.7, 0.65, -3.8, 0xe2e8f0, 0x64748b);
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

      // Update Screen Coordinates for 3D Markers
      if (mountRef.current && camera) {
        const rect = mountRef.current.getBoundingClientRect();
        const projected = MARKER_ANCHORS.map((anchor) => {
          const vec = new THREE.Vector3(anchor.pos[0], anchor.pos[1], anchor.pos[2]);
          vec.project(camera);

          const isBehind = vec.z > 1;
          const rawX = ((vec.x + 1) * rect.width) / 2;
          const rawY = ((-vec.y + 1) * rect.height) / 2;

          // Clamped within 3D viewport canvas bounds
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
  }, [viewMode, selectedStyleId, handleCanvasClick]);

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
      // Public Living Room Clear Width Line (3,450 mm)
      dimensionGroupRef.current.add(drawDimLine([-0.15, 0.15, 3.2], [3.45, 0.15, 3.2], 0x3b82f6));
    }
  }, [showDimensions]);

  // 5. Smooth Camera Preset Navigation with CameraControls
  useEffect(() => {
    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (cameraPreset) {
      case "birds-eye":
        ctrl.setLookAt(0, 17, 16, 0, 0, 0, true);
        break;
      case "living":
        ctrl.setLookAt(1.6, 6.0, 7.0, 1.6, 1.2, 1.6, true);
        break;
      case "workstation":
        ctrl.setLookAt(-1.6, 5.5, 4.0, -1.6, 1.2, -1.6, true);
        break;
      case "bedroom":
        ctrl.setLookAt(-1.8, 5.5, 8.0, -1.8, 1.2, 2.6, true);
        break;
      case "balcony":
        ctrl.setLookAt(1.6, 3.5, 2.0, 1.6, 1.2, 4.2, true);
        break;
    }
  }, [cameraPreset]);

  // Scroll Bottom Bar horizontally
  const scrollBottom = (direction: "left" | "right") => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollBy({
        left: direction === "left" ? -240 : 240,
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

        {/* Group 2: SunCalc Real-time Solar Presets */}
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

        {/* Group 3: 4 Layer Switches with High-Contrast Active States */}
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

          {/* Compass & SunCalc Astronomical Inflow Angle Badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md border border-slate-200 p-2.5 rounded-2xl flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-semibold flex items-center justify-end space-x-1">
                <span>新山日照轨迹 (SunCalc)</span>
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

              {/* 3D Projected Screen UI Labels */}
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
                      className="pointer-events-auto cursor-pointer group hover:z-50"
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
            /* 2.5D BIM Vector Floor Plan (Reflecting Type B Real Topology) */
            <div className="w-full flex-1 min-h-[520px] p-6 bg-slate-100 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[560px] aspect-[690/972] bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-md">
                {/* Longitudinal Spine Wall Divider Line in 2.5D */}
                <div className="absolute left-[48%] top-0 bottom-0 w-1 bg-slate-300 pointer-events-none z-0" />

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

          {/* Bottom 9 Zones Selector */}
          <div className="relative p-2.5 bg-white border-t border-slate-200 flex items-center">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollBottom("left")}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 mr-1 z-10 shadow-2xs bg-white border border-slate-200"
              title="向左滚动查看"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Buttons Container */}
            <div
              ref={bottomScrollRef}
              className="flex-1 overflow-x-auto no-scrollbar flex items-center space-x-2 scroll-smooth px-1"
            >
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider pl-1 flex-shrink-0">
                9大功能分区:
              </span>
              {ZONES_DATA.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    setActiveZone(z);
                    const coord = ZONE_3D_COORDS[z.id];
                    if (coord && controlsRef.current) {
                      controlsRef.current.setLookAt(coord.x, 8, coord.z + 6, coord.x, 1.0, coord.z, true);
                    }
                  }}
                  className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    activeZone.id === z.id
                      ? "bg-slate-900 text-white shadow-sm ring-2 ring-blue-500/30"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {z.name} ({z.sqm}㎡)
                </button>
              ))}
            </div>

            {/* Scroll Right Button & Fade Mask */}
            <div className="absolute right-9 top-0 bottom-0 w-12 bg-gradient-to-l from-white via-white/80 to-transparent pointer-events-none" />
            <button
              onClick={() => scrollBottom("right")}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 ml-1 z-10 shadow-2xs bg-white border border-slate-200"
              title="向右滚动查看"
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
