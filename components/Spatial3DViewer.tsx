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
  Box,
  Play,
  Pause,
  Moon,
  Sunset,
  SunMedium
} from "lucide-react";
import { ZONES_DATA, STYLES_DATA, PROPERTY_DATA, ZoneData } from "@/data/projectData";
import { getJohorSunData, SOLAR_PRESETS, JB_LOCATION } from "@/utils/solarCalculator";

// Install THREE for CameraControls
CameraControls.install({ THREE });

interface Spatial3DViewerProps {
  selectedStyleId: string;
}

// Style Color Palette Mapping for Dynamic 3D / 2.5D Re-skinning
interface StyleThemeConfig {
  floorHex: number;
  floorSvg: string;
  wallHex: number;
  wallSvg: string;
  wallEdgeHex: number;
  wallEdgeSvg: string;
  sofaHex: number;
  sofaSvg: string;
  woodHex: number;
  woodSvg: string;
  accentHex: number;
  accentSvg: string;
  lightAmbient: number;
}

const STYLE_THEMES: { [id: string]: StyleThemeConfig } = {
  "tech-minimal": {
    floorHex: 0xede8df, floorSvg: "#ede8df",
    wallHex: 0xf8fafc, wallSvg: "#f8fafc",
    wallEdgeHex: 0x334155, wallEdgeSvg: "#334155",
    sofaHex: 0xe2e8f0, sofaSvg: "#e2e8f0",
    woodHex: 0xd4a373, woodSvg: "#d4a373",
    accentHex: 0x0284c7, accentSvg: "#0284c7",
    lightAmbient: 0xffffff
  },
  "modern-minimalist": {
    floorHex: 0xede8df, floorSvg: "#ede8df",
    wallHex: 0xf8fafc, wallSvg: "#f8fafc",
    wallEdgeHex: 0x334155, wallEdgeSvg: "#334155",
    sofaHex: 0xe2e8f0, sofaSvg: "#e2e8f0",
    woodHex: 0xd4a373, woodSvg: "#d4a373",
    accentHex: 0x0284c7, accentSvg: "#0284c7",
    lightAmbient: 0xffffff
  },
  "dark-luxury": {
    floorHex: 0x18181b, floorSvg: "#18181b",
    wallHex: 0x27272a, wallSvg: "#27272a",
    wallEdgeHex: 0x09090b, wallEdgeSvg: "#09090b",
    sofaHex: 0x451a03, sofaSvg: "#451a03",
    woodHex: 0x3f2d24, woodSvg: "#3f2d24",
    accentHex: 0xf59e0b, accentSvg: "#f59e0b",
    lightAmbient: 0xfef3c7
  },
  "italian-luxury": {
    floorHex: 0x18181b, floorSvg: "#18181b",
    wallHex: 0x27272a, wallSvg: "#27272a",
    wallEdgeHex: 0x09090b, wallEdgeSvg: "#09090b",
    sofaHex: 0x451a03, sofaSvg: "#451a03",
    woodHex: 0x3f2d24, woodSvg: "#3f2d24",
    accentHex: 0xf59e0b, accentSvg: "#f59e0b",
    lightAmbient: 0xfef3c7
  },
  "japandi-wood": {
    floorHex: 0xfef3c7, floorSvg: "#fef3c7",
    wallHex: 0xfafaf9, wallSvg: "#fafaf9",
    wallEdgeHex: 0x78350f, wallEdgeSvg: "#78350f",
    sofaHex: 0xe7d8c9, sofaSvg: "#e7d8c9",
    woodHex: 0xd4a373, woodSvg: "#d4a373",
    accentHex: 0xfbbf24, accentSvg: "#fbbf24",
    lightAmbient: 0xfffbeb
  },
  "industrial-cyber": {
    floorHex: 0x334155, floorSvg: "#334155",
    wallHex: 0x1e293b, wallSvg: "#1e293b",
    wallEdgeHex: 0x0284c7, wallEdgeSvg: "#0284c7",
    sofaHex: 0x0369a1, sofaSvg: "#0369a1",
    woodHex: 0x94a3b8, woodSvg: "#94a3b8",
    accentHex: 0x06b6d4, accentSvg: "#06b6d4",
    lightAmbient: 0xe0f2fe
  }
};

// 2.5D SVG ViewBox Presets for Smooth Zoom & Focus Transitions
const ZONE_VIEWBOXES: { [key: string]: string } = {
  "birds-eye": "0 0 690 972.5",
  "iso-2.5d": "0 0 690 972.5",
  "all": "0 0 690 972.5",
  "entrance": "300 0 380 180",
  "kitchen": "300 140 380 200",
  "dining": "300 290 380 220",
  "living": "300 470 380 370",
  "balcony": "300 790 380 180",
  "yard": "0 0 350 190",
  "bathroom": "0 160 350 260",
  "study": "0 390 350 230",
  "bedroom": "0 580 350 390"
};

// 1:1 Standard Coordinate System: Width X [-3.45, +3.45] (6.9m), Depth Z [-4.8625, +4.8625] (9.725m), Origin (0,0,0) at Geometric Center
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
  const currentTheme = STYLE_THEMES[selectedStyleId] || STYLE_THEMES["tech-minimal"];
  const currentStyleObj = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "iso-2.5d" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  const [isAutoRotating, setIsAutoRotating] = useState<boolean>(false);
  const [isIsometricPerspective, setIsIsometricPerspective] = useState<boolean>(true);
  const [svgViewBox, setSvgViewBox] = useState<string>("0 0 690 972.5");
  
  // Layer Toggles
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
  const furnitureGroupRef = useRef<THREE.Group | null>(null);
  const clickableZonesRef = useRef<THREE.Mesh[]>([]);
  const bottomScrollRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

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
          if (ZONE_VIEWBOXES[zoneId]) {
            setSvgViewBox(ZONE_VIEWBOXES[zoneId]);
          }
        }
      }
    }
  }, []);

  // 1. Initialize Three.js Scene: 6.9m × 9.725m Rectangular Slab, 0.25m Half-Walls (BIM Cutaway with 900mm Doorways), 1:1 Scaled Furniture
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 560;

    // Architectural Studio Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(selectedStyleId === "dark-luxury" || selectedStyleId === "italian-luxury" ? 0x09090b : 0xf8fafc);

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 9.5, 7.5);

    // WebGL Renderer with graceful fallback
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance"
      });
    } catch (err) {
      console.warn("WebGL Renderer creation failed, falling back to 2.5D mode:", err);
      setViewMode("2.5d");
      return;
    }

    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Initialize CameraControls with maxPolarAngle limit & smooth inertia
    const controls = new CameraControls(camera, renderer.domElement);
    controls.smoothTime = 0.35;
    controls.draggingSmoothTime = 0.12;
    controls.maxDistance = 24;
    controls.minDistance = 3.5;
    controls.maxPolarAngle = Math.PI / 2.15; // prevents clipping below ground
    controlsRef.current = controls;

    // Clean 45-degree Isometric Bird's-eye Perspective
    controls.setLookAt(0, 9.5, 7.5, 0, 0, 0, false);

    // Attach Raycasting Click Handler & Context Lost Handler
    const domElem = renderer.domElement;
    domElem.addEventListener("click", handleCanvasClick);

    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn("WebGL context lost, switching to 2.5D view");
      setViewMode("2.5d");
    };
    domElem.addEventListener("webglcontextlost", handleContextLost);

    // Calibrated Lighting
    const ambientLight = new THREE.AmbientLight(currentTheme.lightAmbient, timeOfDay === "night" ? 0.35 : 0.95);
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(solarData.lightColor, solarData.lightIntensity);
    sunLight.position.copy(solarData.position);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.4);
    fillLight.position.set(-8, 10, -10);
    scene.add(fillLight);

    // Ground Grid
    const gridHelper = new THREE.GridHelper(24, 24, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // High-Resolution Blueprint Texture Canvas
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2888;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = currentTheme.floorSvg;
      ctx.fillRect(0, 0, 2048, 2888);

      ctx.strokeStyle = "rgba(148, 163, 184, 0.25)";
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

      ctx.strokeStyle = currentTheme.wallEdgeSvg;
      ctx.lineWidth = 12;
      ctx.strokeRect(8, 8, 2032, 2872);

      // Central Spine Wall
      ctx.beginPath();
      ctx.moveTo(980, 0);
      ctx.lineTo(980, 2888);
      ctx.stroke();
    }

    const blueprintTexture = new THREE.CanvasTexture(canvas);
    blueprintTexture.anisotropy = 8;

    // Base Floor Slab: Exactly 6.90m (Width) × 9.725m (Depth)
    const floorGeometry = new THREE.BoxGeometry(6.90, 0.15, 9.725);
    const floorMat = new THREE.MeshStandardMaterial({
      map: blueprintTexture,
      roughness: 0.4,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.position.y = -0.075;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Clickable Raycasting Floor Meshes
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
    const createFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, color = currentTheme.sofaHex, edgeColor = currentTheme.wallEdgeHex) => {
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

    // Helper: Create Standard 0.25m Architectural Half-Wall
    const createHalfWall = (w: number, d: number, x: number, z: number, opacity = 0.95, color = currentTheme.wallHex) => {
      const wallHeight = 0.25;
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
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: currentTheme.wallEdgeHex, linewidth: 1.5 }));
      group.add(line);

      group.position.set(x, wallHeight / 2, z);
      return group;
    };

    const furnitureGroup = new THREE.Group();
    furnitureGroupRef.current = furnitureGroup;
    scene.add(furnitureGroup);

    // BIM Half-Walls with 900mm Doorway Openings
    const spineWallNorth = createHalfWall(0.15, 4.21, -0.15, -2.75);
    const spineWallSouth = createHalfWall(0.15, 4.61, -0.15, 2.55);
    const bathNorthWall = createHalfWall(1.8, 0.15, -1.8, -1.95);
    const bathSouthWall = createHalfWall(1.8, 0.15, -1.8, 0.35);
    const bedWallLeft = createHalfWall(2.1, 0.15, -2.4, 1.2);
    const bedWallRight = createHalfWall(0.3, 0.15, -0.3, 1.2);
    const yardWall = createHalfWall(3.3, 0.15, -1.8, -3.2);
    const balconyGlassRailing = createHalfWall(3.6, 0.06, 1.5, 4.86, 0.6, currentTheme.accentHex);
    furnitureGroup.add(spineWallNorth, spineWallSouth, bathNorthWall, bathSouthWall, bedWallLeft, bedWallRight, yardWall, balconyGlassRailing);

    // Furniture: Living, Kitchen, Dining, Study, Bed, Bath
    const sofa = createFurniture(0.85, 0.45, 2.4, 0.55, 0.225, 1.8, currentTheme.sofaHex, currentTheme.wallEdgeHex);
    const sofaShadow = createContactShadow(1.0, 2.6, 0.55, 1.8, 0.35);
    const tvStand = createFurniture(0.35, 0.20, 2.4, 3.125, 0.10, 1.8, currentTheme.woodHex, currentTheme.wallEdgeHex);
    const tvScreen = createFurniture(0.04, 0.40, 1.8, 3.25, 0.35, 1.8, 0x94a3b8, 0xcbd5e1);
    const coffeeTable = createFurniture(0.55, 0.22, 0.9, 1.85, 0.11, 1.8, currentTheme.wallHex, currentTheme.wallEdgeHex);

    const kitchenCounter = createFurniture(3.2, 0.45, 0.6, 1.5, 0.225, -2.8, currentTheme.wallHex, currentTheme.wallEdgeHex);
    const island = createFurniture(1.8, 0.55, 0.85, 1.5, 0.275, -1.2, currentTheme.floorHex, currentTheme.wallEdgeHex);
    const islandWood = createFurniture(0.75, 0.06, 0.75, 2.1, 0.55, -1.2, currentTheme.woodHex, currentTheme.wallEdgeHex);

    const vanityLedge = createFurniture(0.55, 0.25, 1.8, -2.425, 0.125, -0.8, currentTheme.floorHex, currentTheme.accentHex);
    const mirrorCabinet = createFurniture(0.1, 0.25, 1.8, -2.65, 0.25, -0.8, 0xeff6ff, 0x1d4ed8);
    const toilet = createFurniture(0.55, 0.22, 0.45, -2.425, 0.11, 0.05, 0xffffff, 0x64748b);

    const liftDesk = createFurniture(1.8, 0.06, 0.75, -1.5, 0.35, 0.8, currentTheme.woodHex, currentTheme.wallEdgeHex);
    const dualScreen = createFurniture(1.4, 0.35, 0.04, -1.5, 0.45, 0.45, currentTheme.accentHex, 0x1e40af);
    const luggageCabinet = createFurniture(0.55, 0.25, 1.2, -3.125, 0.125, 0.8, currentTheme.wallHex, currentTheme.wallEdgeHex);

    const bedBase = createFurniture(1.8, 0.22, 2.0, -1.8, 0.11, 3.0, currentTheme.sofaHex, currentTheme.wallEdgeHex);
    const mattress = createFurniture(1.6, 0.15, 1.9, -1.8, 0.28, 3.0, 0xffffff, 0x64748b);
    const wardrobe = createFurniture(0.55, 0.25, 2.6, -3.125, 0.125, 3.0, currentTheme.wallHex, currentTheme.wallEdgeHex);

    const washer = createFurniture(0.75, 0.25, 0.75, -2.6, 0.125, -4.0, 0xe2e8f0, 0x475569);

    furnitureGroup.add(
      sofaShadow, sofa, tvStand, tvScreen, coffeeTable,
      kitchenCounter, island, islandWood,
      vanityLedge, mirrorCabinet, toilet,
      liftDesk, dualScreen, luggageCabinet,
      bedBase, mattress, wardrobe, washer
    );

    // Interactive Highlight Mesh & Outline
    const highlightGeom = new THREE.PlaneGeometry(1, 1);
    highlightGeom.rotateX(-Math.PI / 2);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: currentTheme.accentHex,
      transparent: true,
      opacity: 0.32,
      side: THREE.DoubleSide
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.position.y = 0.02;
    highlightMeshRef.current = highlightMesh;
    scene.add(highlightMesh);

    const borderGeom = new THREE.BufferGeometry();
    const borderMat = new THREE.LineBasicMaterial({ color: currentTheme.accentHex, linewidth: 2.5 });
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

      // Auto-rotation if enabled
      if (isAutoRotating && controlsRef.current) {
        controlsRef.current.azimuthAngle += delta * 0.25;
      }

      controls.update(delta);

      if (highlightMeshRef.current) {
        highlightMat.opacity = 0.25 + Math.sin(elapsedTime * 3.2) * 0.09;
      }

      // Update Screen Coordinates for 3D Markers
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

    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 560;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      domElem.removeEventListener("click", handleCanvasClick);
      domElem.removeEventListener("webglcontextlost", handleContextLost);
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
      });

      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = "";
      }
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [viewMode, selectedStyleId, handleCanvasClick, showMEP, showSmartHome, isAutoRotating]);

  // 2. Update Highlight Mesh Position
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

  // 3. Update Real-world Solar Simulation on `timeOfDay` change
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

      dimensionGroupRef.current.add(drawDimLine([-3.45, 0.15, 4.95], [3.45, 0.15, 4.95], 0x059669));
      dimensionGroupRef.current.add(drawDimLine([3.55, 0.15, -4.86], [3.55, 0.15, 4.86], 0x2563eb));
      dimensionGroupRef.current.add(drawDimLine([-0.15, 0.15, 3.4], [3.45, 0.15, 3.4], 0x3b82f6));
      dimensionGroupRef.current.add(drawDimLine([-3.45, 0.15, 1.8], [-0.15, 0.15, 1.8], 0x8b5cf6));
    }
  }, [showDimensions]);

  // 5. Smooth Camera Preset Navigation & SVG ViewBox Focus Transition
  const applyCameraPreset = (preset: "birds-eye" | "iso-2.5d" | "living" | "workstation" | "bedroom" | "balcony") => {
    setCameraPreset(preset);
    if (ZONE_VIEWBOXES[preset]) {
      setSvgViewBox(ZONE_VIEWBOXES[preset]);
    }

    if (!controlsRef.current) return;
    const ctrl = controlsRef.current;

    switch (preset) {
      case "birds-eye":
        ctrl.setLookAt(0, 10, 8, 0, 0, 0, true);
        break;
      case "iso-2.5d":
        ctrl.setLookAt(7.5, 7.5, 7.5, 0, 0, 0, true);
        break;
      case "living":
        ctrl.setLookAt(1.5, 3.4, 3.8, 1.5, 0.3, 1.8, true);
        break;
      case "workstation":
        ctrl.setLookAt(-1.5, 3.0, 2.2, -1.5, 0.3, 0.8, true);
        break;
      case "bedroom":
        ctrl.setLookAt(-1.8, 3.0, 4.5, -1.8, 0.3, 3.0, true);
        break;
      case "balcony":
        ctrl.setLookAt(1.5, 2.0, 3.0, 1.5, 0.3, 4.28, true);
        break;
    }
  };

  const scrollBottom = (direction: "left" | "right") => {
    if (bottomScrollRef.current) {
      bottomScrollRef.current.scrollBy({
        left: direction === "left" ? -260 : 260,
        behavior: "smooth"
      });
    }
  };

  // Time of day lighting filter for 2.5D SVG
  const timeFilterStyle = 
    timeOfDay === "morning"
      ? "drop-shadow(0px 10px 28px rgba(251, 191, 36, 0.35)) saturate(1.15)"
      : timeOfDay === "sunset"
      ? "drop-shadow(0px 10px 28px rgba(249, 115, 22, 0.45)) hue-rotate(-8deg) saturate(1.25)"
      : timeOfDay === "night"
      ? "brightness(0.68) contrast(1.28)"
      : "brightness(1.02) contrast(1.02)";

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Group 1: 3D vs 2.5D Mode Toggle */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setViewMode("3d")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === "3d"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D 真实推演 (Three.js 1:1)</span>
          </button>
          <button
            onClick={() => setViewMode("2.5d")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              viewMode === "2.5d"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>2.5D 等轴测户型图 (Isometric BIM)</span>
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

        {/* Group 3: 4 Layer Switches */}
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
            <span>微气候 {showMicroclimate ? "✓" : ""}</span>
          </button>
        </div>
      </div>

      {/* Main 3D / 2.5D Viewport & Side Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Viewport (8 Columns) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-200 shadow-sm flex flex-col min-h-[580px]">
          {/* Top Camera Presets Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-1.5 bg-white/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <span className="text-[10px] text-slate-500 font-semibold px-2 py-1 flex items-center">
              <Eye className="w-3 h-3 mr-1 text-blue-600" />
              视角:
            </span>
            <button
              onClick={() => {
                setViewMode("3d");
                applyCameraPreset("birds-eye");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "birds-eye"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              俯瞰全景
            </button>
            <button
              onClick={() => {
                setViewMode("3d");
                applyCameraPreset("iso-2.5d");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "iso-2.5d"
                  ? "bg-blue-600 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              45° 等轴测 3D
            </button>
            <button
              onClick={() => {
                applyCameraPreset("living");
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
                applyCameraPreset("workstation");
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
                applyCameraPreset("bedroom");
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
                applyCameraPreset("balcony");
              }}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "balcony"
                  ? "bg-slate-900 text-white font-semibold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              24F 阳台视野
            </button>

            {/* Auto-Rotate 360° Toggle */}
            {viewMode === "3d" && (
              <button
                onClick={() => setIsAutoRotating(!isAutoRotating)}
                className={`ml-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  isAutoRotating
                    ? "bg-amber-500 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="开启/暂停 3D 自动平滑环绕"
              >
                {isAutoRotating ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>{isAutoRotating ? "暂停漫游" : "360° 漫游"}</span>
              </button>
            )}

            {/* 2.5D Isometric 3D Axonometric Tilt Toggle */}
            {viewMode === "2.5d" && (
              <button
                onClick={() => {
                  setIsIsometricPerspective(!isIsometricPerspective);
                  setSvgViewBox("0 0 690 972.5");
                }}
                className={`ml-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 ${
                  isIsometricPerspective
                    ? "bg-blue-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="切换等轴测 3D 透视角度"
              >
                <Layers className="w-3 h-3" />
                <span>{isIsometricPerspective ? "3D 等轴测透视" : "正交俯视平面"}</span>
              </button>
            )}
          </div>

          {/* Compass & Solar Altitude Badge */}
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

          {/* Dynamic Style Vibe Pill */}
          <div className="absolute bottom-16 right-4 z-20 bg-slate-900/90 text-white backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-lg text-[11px] font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>当前风格材质: {currentStyleObj.name}</span>
          </div>

          {/* Click Hint */}
          <div className="absolute bottom-16 left-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 px-3 py-1.5 rounded-xl flex items-center space-x-1.5 shadow-sm text-[11px] text-slate-700 pointer-events-none">
            <MousePointerClick className="w-3.5 h-3.5 text-blue-600 animate-bounce" />
            <span>点击任意房间即刻高亮检视</span>
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
            /* 2.5D ISOMETRIC ARCHITECTURAL BIM BLUEPRINT (Isometric 3D Axonometric Matrix, Style Colors, Dynamic Sunlight Filter) */
            <div className="w-full flex-1 min-h-[520px] p-6 bg-slate-950 relative overflow-hidden flex items-center justify-center perspective-[1200px]">
              
              {/* Dynamic Sunlight / Microclimate Filter Overlay */}
              <div 
                className={`absolute inset-0 pointer-events-none transition-all duration-700 z-10 ${
                  timeOfDay === "morning"
                    ? "bg-gradient-to-t from-amber-500/15 via-amber-200/5 to-transparent"
                    : timeOfDay === "noon"
                    ? "bg-white/10"
                    : timeOfDay === "sunset"
                    ? "bg-gradient-to-t from-orange-600/20 via-amber-600/10 to-purple-950/20"
                    : "bg-slate-950/60"
                }`} 
              />

              <div 
                style={{
                  backgroundColor: currentTheme.floorSvg,
                  transform: isIsometricPerspective ? "rotateX(52deg) rotateZ(-40deg) scale(0.92)" : "none",
                  transformStyle: "preserve-3d",
                  transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)"
                }}
                className="relative w-full max-w-[580px] aspect-[690/972.5] rounded-3xl border-4 border-slate-700/80 p-4 shadow-2xl overflow-hidden flex flex-col justify-between"
              >
                
                {/* SVG Isometric Architectural Floor Plan with Dynamic ViewBox Transition & CSS Variables */}
                <svg 
                  ref={svgRef}
                  viewBox={svgViewBox} 
                  style={{
                    filter: timeFilterStyle,
                    transition: "viewBox 0.6s cubic-bezier(0.4, 0, 0.2, 1), filter 0.5s ease"
                  }}
                  className="w-full h-full select-none"
                >
                  {/* Outer Perimeter Wall */}
                  <rect x="6" y="6" width="678" height="960.5" fill="none" stroke={currentTheme.wallEdgeSvg} strokeWidth="12" rx="14" />

                  {/* Main Spine Wall */}
                  <line x1="330" y1="6" x2="330" y2="966.5" stroke={currentTheme.wallEdgeSvg} strokeWidth="10" strokeLinecap="round" />

                  {/* (1) 生活阳台 YARD */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[5]);
                    setSvgViewBox(ZONE_VIEWBOXES["yard"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="12" y="12" width="312" height="154"
                      fill={activeZone.id === "yard" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "yard" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="25" y="25" width="70" height="65" fill="#e2e8f0" stroke="#475569" strokeWidth="2" rx="4" />
                    <circle cx="60" cy="57" r="18" fill="none" stroke="#64748b" strokeWidth="2" />
                    <rect x="105" y="25" width="45" height="40" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
                    <text x="127" y="50" fill="#2563eb" fontSize="11" fontWeight="bold" textAnchor="middle">扫拖机</text>
                    <text x="168" y="120" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="17" fontWeight="bold" textAnchor="middle">生活阳台 YARD (3.8㎡)</text>
                  </g>

                  <line x1="12" y1="170" x2="330" y2="170" stroke={currentTheme.wallEdgeSvg} strokeWidth="8" />

                  {/* (2) 独立卫浴室 BATH 1 */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[7]);
                    setSvgViewBox(ZONE_VIEWBOXES["bathroom"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="12" y="175" width="312" height="220"
                      fill={activeZone.id === "bathroom" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "bathroom" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="25" y="190" width="140" height="60" fill="#ffffff" stroke={currentTheme.accentSvg} strokeWidth="2" rx="3" />
                    <ellipse cx="95" cy="220" rx="32" ry="20" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" />
                    <rect x="235" y="190" width="55" height="75" fill="#ffffff" stroke="#64748b" strokeWidth="2" rx="16" />
                    <line x1="25" y1="290" x2="150" y2="290" stroke="#38bdf8" strokeWidth="3" strokeDasharray="4 2" />
                    <text x="168" y="340" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="18" fontWeight="bold" textAnchor="middle">独立卫浴 BATH 1 (4.5㎡)</text>
                  </g>

                  {/* 900mm Bath Doorway */}
                  <path d="M 330 350 A 55 55 0 0 0 275 405" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="330" y1="350" x2="275" y2="405" stroke={currentTheme.wallEdgeSvg} strokeWidth="3" />

                  <line x1="12" y1="405" x2="330" y2="405" stroke={currentTheme.wallEdgeSvg} strokeWidth="8" />

                  {/* (3) 极客多功能书房 STUDY */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[6]);
                    setSvgViewBox(ZONE_VIEWBOXES["study"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="12" y="410" width="312" height="180"
                      fill={activeZone.id === "study" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "study" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="55" y="435" width="190" height="70" fill={currentTheme.woodSvg} stroke="#c2410c" strokeWidth="2" rx="4" />
                    <rect x="75" y="415" width="65" height="12" fill="#0f172a" stroke={currentTheme.accentSvg} strokeWidth="2" rx="2" />
                    <rect x="150" y="415" width="65" height="12" fill="#0f172a" stroke={currentTheme.accentSvg} strokeWidth="2" rx="2" />
                    <circle cx="150" cy="535" r="22" fill="#e2e8f0" stroke="#475569" strokeWidth="2" />
                    <text x="168" y="490" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="17" fontWeight="bold" textAnchor="middle">极客工位 STUDY (6.8㎡)</text>
                  </g>

                  <line x1="12" y1="595" x2="245" y2="595" stroke={currentTheme.wallEdgeSvg} strokeWidth="8" />
                  <line x1="315" y1="595" x2="330" y2="595" stroke={currentTheme.wallEdgeSvg} strokeWidth="8" />

                  {/* (4) 主卧深睡空间 BEDROOM */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[8]);
                    setSvgViewBox(ZONE_VIEWBOXES["bedroom"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="12" y="600" width="312" height="360"
                      fill={activeZone.id === "bedroom" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "bedroom" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="70" y="650" width="175" height="210" fill="#ffffff" stroke={currentTheme.wallEdgeSvg} strokeWidth="2.5" rx="6" />
                    <rect x="85" y="660" width="60" height="40" fill={currentTheme.sofaSvg} rx="4" />
                    <rect x="170" y="660" width="60" height="40" fill={currentTheme.sofaSvg} rx="4" />
                    <rect x="18" y="650" width="40" height="260" fill={currentTheme.wallSvg} stroke="#94a3b8" strokeWidth="1.5" rx="2" />
                    <text x="38" y="780" fill="#64748b" fontSize="12" fontWeight="bold" transform="rotate(-90 38 780)">通顶定制衣柜 (深600mm)</text>
                    <text x="168" y="900" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="19" fontWeight="bold" textAnchor="middle">主卧深睡 BEDROOM (14.2㎡)</text>
                  </g>

                  {/* 900mm Bedroom Doorway */}
                  <path d="M 330 610 A 65 65 0 0 1 265 675" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1="330" y1="610" x2="265" y2="675" stroke={currentTheme.wallEdgeSvg} strokeWidth="3" />

                  {/* (5) 入户玄关 ENTRANCE */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[0]);
                    setSvgViewBox(ZONE_VIEWBOXES["entrance"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="335" y="12" width="343" height="142"
                      fill={activeZone.id === "entrance" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "entrance" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="580" y="20" width="85" height="40" fill="#e2e8f0" stroke="#475569" strokeWidth="2" rx="3" />
                    <circle cx="660" cy="40" r="8" fill={currentTheme.accentSvg} />
                    <text x="506" y="95" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="18" fontWeight="bold" textAnchor="middle">入户玄关 ENTRANCE (3.8㎡)</text>
                  </g>

                  {/* (6) 开放式厨房 KITCHEN */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[1]);
                    setSvgViewBox(ZONE_VIEWBOXES["kitchen"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="335" y="162" width="343" height="145"
                      fill={activeZone.id === "kitchen" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "kitchen" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="345" y="170" width="323" height="50" fill="#ffffff" stroke="#475569" strokeWidth="2" rx="3" />
                    <circle cx="420" cy="195" r="14" fill="#334155" />
                    <circle cx="460" cy="195" r="14" fill="#334155" />
                    <rect x="550" y="180" width="60" height="30" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1.5" rx="3" />
                    <text x="506" y="270" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="18" fontWeight="bold" textAnchor="middle">开放厨房 KITCHEN (5.2㎡)</text>
                  </g>

                  {/* (7) 核心餐厅与中岛 DINING */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[2]);
                    setSvgViewBox(ZONE_VIEWBOXES["dining"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="335" y="315" width="343" height="175"
                      fill={activeZone.id === "dining" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "dining" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="406" y="350" width="180" height="90" fill="#ffffff" stroke={currentTheme.wallEdgeSvg} strokeWidth="2.5" rx="6" />
                    <rect x="417" y="390" width="20" height="10" fill={currentTheme.accentSvg} rx="2" />
                    <circle cx="450" cy="460" r="14" fill={currentTheme.sofaSvg} stroke="#475569" strokeWidth="1.5" />
                    <circle cx="496" cy="460" r="14" fill={currentTheme.sofaSvg} stroke="#475569" strokeWidth="1.5" />
                    <circle cx="542" cy="460" r="14" fill={currentTheme.sofaSvg} stroke="#475569" strokeWidth="1.5" />
                    <text x="506" y="405" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="18" fontWeight="bold" textAnchor="middle">核心餐厅 DINING (4.2㎡)</text>
                  </g>

                  {/* (8) 景观客厅 LIVING */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[3]);
                    setSvgViewBox(ZONE_VIEWBOXES["living"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="335" y="495" width="343" height="325"
                      fill={activeZone.id === "living" ? "#dbeafe" : currentTheme.wallSvg}
                      stroke={activeZone.id === "living" ? currentTheme.accentSvg : currentTheme.wallEdgeSvg}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="355" y="600" width="85" height="180" fill={currentTheme.sofaSvg} stroke={currentTheme.wallEdgeSvg} strokeWidth="2.5" rx="8" />
                    <rect x="660" y="540" width="10" height="200" fill="#64748b" stroke="#94a3b8" strokeWidth="2" rx="2" />
                    <rect x="640" y="520" width="22" height="240" fill={currentTheme.woodSvg} stroke="#475569" strokeWidth="1.5" rx="3" />
                    <text x="506" y="570" fill={selectedStyleId === "dark-luxury" ? "#ffffff" : "#1e293b"} fontSize="20" fontWeight="bold" textAnchor="middle">景观客厅 LIVING (13.5㎡)</text>
                  </g>

                  <line x1="335" y1="825" x2="678" y2="825" stroke={currentTheme.accentSvg} strokeWidth="6" />

                  {/* (9) 南向休闲阳台 BALCONY */}
                  <g onClick={() => {
                    setActiveZone(ZONES_DATA[4]);
                    setSvgViewBox(ZONE_VIEWBOXES["balcony"]);
                  }} className="cursor-pointer group">
                    <rect
                      x="335" y="830" width="343" height="130"
                      fill={activeZone.id === "balcony" ? "#e0f2fe" : "#f0f9ff"}
                      stroke={activeZone.id === "balcony" ? "#0284c7" : "#38bdf8"}
                      strokeWidth="2.5" rx="8"
                      className="transition-all"
                    />
                    <rect x="370" y="855" width="180" height="35" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" rx="4" />
                    <circle cx="420" cy="910" r="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
                    <circle cx="500" cy="910" r="14" fill="#bae6fd" stroke="#0284c7" strokeWidth="1.5" />
                    <text x="506" y="935" fill="#0369a1" fontSize="18" fontWeight="bold" textAnchor="middle">南向阳台 BALCONY (4.2㎡)</text>
                  </g>

                  {/* Interactive SVG Layers */}
                  {showDimensions && (
                    <g className="animate-fadeIn">
                      <line x1="12" y1="2" x2="678" y2="2" stroke="#059669" strokeWidth="2.5" />
                      <rect x="290" y="0" width="110" height="20" fill="#ecfdf5" stroke="#059669" rx="4" />
                      <text x="345" y="14" fill="#065f46" fontSize="12" fontWeight="bold" textAnchor="middle">总宽 6,900 mm</text>
                      <line x1="684" y1="12" x2="684" y2="960" stroke="#2563eb" strokeWidth="2.5" />
                      <rect x="630" y="470" width="55" height="22" fill="#eff6ff" stroke="#2563eb" rx="4" transform="rotate(-90 657 481)" />
                      <text x="657" y="485" fill="#1e40af" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 657 485)">总深 9,725 mm</text>
                    </g>
                  )}

                  {showMEP && (
                    <g className="animate-fadeIn">
                      <rect x="580" y="25" width="80" height="22" fill="#fef3c7" stroke="#d97706" rx="6" />
                      <text x="620" y="40" fill="#92400e" fontSize="11" fontWeight="bold" textAnchor="middle">⚡ DB配电总箱</text>
                      <rect x="575" y="525" width="80" height="22" fill="#fef3c7" stroke="#d97706" rx="6" />
                      <text x="615" y="540" fill="#92400e" fontSize="11" fontWeight="bold" textAnchor="middle">⚡ 15A 空调点</text>
                      <rect x="575" y="660" width="80" height="22" fill="#fef3c7" stroke="#d97706" rx="6" />
                      <text x="615" y="675" fill="#92400e" fontSize="11" fontWeight="bold" textAnchor="middle">⚡ SMATV 电视点</text>
                      <rect x="110" y="420" width="85" height="22" fill="#fef3c7" stroke="#d97706" rx="6" />
                      <text x="152" y="435" fill="#92400e" fontSize="11" fontWeight="bold" textAnchor="middle">⚡ 8组桌面插座</text>
                    </g>
                  )}

                  {showSmartHome && (
                    <g className="animate-fadeIn">
                      <rect x="560" y="120" width="95" height="22" fill="#f3e8ff" stroke="#9333ea" rx="6" />
                      <text x="607" y="135" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">🤖 D200人脸锁</text>
                      <rect x="420" y="550" width="90" height="22" fill="#f3e8ff" stroke="#9333ea" rx="6" />
                      <text x="465" y="565" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">🤖 FP2 客厅雷达</text>
                      <rect x="180" y="420" width="90" height="22" fill="#f3e8ff" stroke="#9333ea" rx="6" />
                      <text x="225" y="435" fill="#6b21a8" fontSize="11" fontWeight="bold" textAnchor="middle">🤖 FP2 坐姿雷达</text>
                    </g>
                  )}

                  {showMicroclimate && (
                    <g className="animate-fadeIn">
                      <path d="M 506 960 L 460 750" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 4" opacity="0.8" />
                      <path d="M 420 960 L 380 780" stroke="#f59e0b" strokeWidth="4" strokeDasharray="8 4" opacity="0.8" />
                      <rect x="410" y="770" width="180" height="24" fill="#fef3c7" stroke="#d97706" rx="6" />
                      <text x="500" y="786" fill="#92400e" fontSize="12" fontWeight="bold" textAnchor="middle">☀️ SSE 165° 晨曦漫射</text>
                      <path d="M 506 820 C 506 500, 480 300, 168 160" fill="none" stroke="#10b981" strokeWidth="4" strokeDasharray="6 6" />
                      <polygon points="160,160 175,152 172,168" fill="#10b981" />
                    </g>
                  )}
                </svg>
              </div>
            </div>
          )}

          {/* Bottom 9 Zones Selector: Spacious flex-shrink-0 buttons */}
          <div className="relative p-2.5 bg-white border-t border-slate-200 flex items-center">
            <button
              onClick={() => scrollBottom("left")}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 mr-2 z-10 shadow-sm bg-white border border-slate-200"
              title="向左滑动"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div
              ref={bottomScrollRef}
              className="flex-1 overflow-x-auto scrollbar-hide no-scrollbar flex items-center gap-2 scroll-smooth px-1"
            >
              <button
                onClick={() => {
                  setSvgViewBox("0 0 690 972.5");
                  if (controlsRef.current && viewMode === "3d") {
                    controlsRef.current.setLookAt(0, 9.5, 7.5, 0, 0, 0, true);
                  }
                }}
                className="flex-shrink-0 whitespace-nowrap min-w-max px-3.5 py-2 rounded-2xl text-xs font-black bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all"
              >
                🔍 全屋俯瞰
              </button>
              {ZONES_DATA.map((z) => (
                <button
                  key={z.id}
                  onClick={() => {
                    setActiveZone(z);
                    if (ZONE_VIEWBOXES[z.id]) {
                      setSvgViewBox(ZONE_VIEWBOXES[z.id]);
                    }
                    const coord = ZONE_3D_COORDS[z.id];
                    if (coord && controlsRef.current && viewMode === "3d") {
                      controlsRef.current.setLookAt(coord.x, 4.5, coord.z + 4, coord.x, 0.3, coord.z, true);
                    }
                  }}
                  className={`flex-shrink-0 whitespace-nowrap min-w-max px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    activeZone.id === z.id
                      ? "bg-slate-900 text-white shadow-sm ring-2 ring-blue-500/30"
                      : "bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {z.name} ({z.sqm}㎡)
                </button>
              ))}
            </div>

            <div className="pointer-events-none absolute right-12 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent" />

            <button
              onClick={() => scrollBottom("right")}
              className="p-2 rounded-xl hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-all flex-shrink-0 ml-2 z-10 shadow-sm bg-white border border-slate-200"
              title="向右滑动"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Side Inspector (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
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

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeZone.description}
            </p>

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

          <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>新山经纬度日照实况 ({JB_LOCATION.latitude}°N, {JB_LOCATION.longitude}°E)</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              当前时段: <strong>{solarData.preset.label}</strong>。太阳方位角 <strong>{solarData.azimuthDegrees}°</strong>，高度角 <strong>{solarData.altitudeDegrees}°</strong>。{solarData.preset.description}。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
