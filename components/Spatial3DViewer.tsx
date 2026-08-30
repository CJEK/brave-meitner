"use client";

import React, { useState, useEffect, useRef } from "react";
import * as THREE from "three";
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
  ChevronRight,
  ShieldCheck,
  Building2,
  Navigation
} from "lucide-react";
import { ZONES_DATA, STYLES_DATA, PROPERTY_DATA, ZoneData } from "@/data/projectData";

interface Spatial3DViewerProps {
  selectedStyleId: string;
}

// 3D Spatial Bounding Coordinates for all 9 zones on the 16x18m slab
const ZONE_3D_COORDS: { [key: string]: { x: number; z: number; w: number; d: number; label: string; mep: string[]; smart: string[] } } = {
  "zone-foyer": {
    x: -5.0, z: -7.0, w: 3.6, d: 2.8,
    label: "入户玄关",
    mep: ["⚡ 入户双控开关", "⚡ 弱电箱配电总闸"],
    smart: ["🤖 D200 3D人脸锁", "🤖 玄关微波感应"]
  },
  "zone-kitchen": {
    x: -4.8, z: -4.2, w: 4.2, d: 3.2,
    label: "开放式厨房",
    mep: ["⚡ 20A 烟机灶具专用", "⚡ 厨下 RO 净水动力"],
    smart: ["🤖 烟雾/水浸传感器", "🤖 智能橱柜手扫感应"]
  },
  "zone-island": {
    x: -3.2, z: -1.8, w: 4.2, d: 2.2,
    label: "多功能中岛吧台",
    mep: ["⚡ 升降隐藏地插", "⚡ 嵌入式轨道插座"],
    smart: ["🤖 吧台调光旋钮", "🤖 中岛氛围灯带"]
  },
  "zone-living": {
    x: -3.5, z: 2.2, w: 6.2, d: 5.2,
    label: "客厅极简影音区",
    mep: ["⚡ SMATV 电视点位", "⚡ 15A 空调专用点", "⚡ 5组五孔插座", "⚡ 沙发侧 USB-C 快充"],
    smart: ["🤖 FP2 人体存在雷达", "🤖 空调伴侣 P3", "🤖 电视背景同步灯带"]
  },
  "zone-balcony": {
    x: -3.5, z: 6.5, w: 6.2, d: 2.2,
    label: "南向景观阳台",
    mep: ["⚡ 防水动力插座", "⚡ 景观洗墙射灯"],
    smart: ["🤖 电动蜂巢帘电机", "🤖 阳台温湿度传感器"]
  },
  "zone-workstation": {
    x: 4.2, z: 2.2, w: 5.5, d: 5.2,
    label: "极客工作站 (1+1房)",
    mep: ["⚡ 8组升降桌桌面插座", "⚡ 万兆光纤接入点"],
    smart: ["🤖 FP2 坐姿姿态识别", "🤖 极客工作模式联动"]
  },
  "zone-bedroom": {
    x: 4.2, z: -3.5, w: 5.5, d: 5.8,
    label: "主卧深睡空间",
    mep: ["⚡ 床头双侧双控+Type-C", "⚡ 15A 空调独立回路"],
    smart: ["🤖 C3 智能双轨电动帘", "🤖 FP2 睡眠监测雷达"]
  },
  "zone-bathroom": {
    x: 0.5, z: -6.2, w: 3.2, d: 4.0,
    label: "卫浴室 (大平台+大镜面)",
    mep: ["⚡ 镜柜内隐藏防溅插座", "⚡ 智能马桶预留电路", "⚡ 3000W 风暖浴霸"],
    smart: ["🤖 镜面触控恒温除雾", "🤖 地脚起夜微光感应"]
  },
  "zone-yard": {
    x: 4.2, z: -7.5, w: 4.0, d: 2.2,
    label: "生活阳台与设备平台",
    mep: ["⚡ 洗衣机专用冷水给水", "⚡ 扫地机上下水排污管"],
    smart: ["🤖 扫拖机器人自动基站", "🤖 水浸漏水自切阀"]
  }
};

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({ selectedStyleId }) => {
  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room (Zone 4)
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  
  // Layer Toggles (All enabled by default for high visual richness)
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showMEP, setShowMEP] = useState<boolean>(true);
  const [showSmartHome, setShowSmartHome] = useState<boolean>(true);
  const [showMicroclimate, setShowMicroclimate] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "noon" | "night">("morning");

  // Three.js Canvas Container & References
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const highlightMeshRef = useRef<THREE.Mesh | null>(null);
  const highlightBorderRef = useRef<THREE.LineSegments | null>(null);
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const ambientLightRef = useRef<THREE.AmbientLight | null>(null);
  const markerGroupRef = useRef<THREE.Group | null>(null);
  const dimensionGroupRef = useRef<THREE.Group | null>(null);

  // 1. Initialize Three.js Scene
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 540;

    // Clean Architectural Studio Light Grey Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      timeOfDay === "night" ? 0x1e293b : 0xeef2f6
    );

    // Perspective Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 25, 24);
    camera.lookAt(0, 0, 0);

    // High Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Ambient Lighting for Studio Clarity
    const ambientLight = new THREE.AmbientLight(
      timeOfDay === "night" ? 0x64748b : 0xffffff,
      timeOfDay === "night" ? 0.9 : 1.6
    );
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    // SSE 165° Directional Sunlight entering from South (positive Z) angled from East (positive X)
    const sunLight = new THREE.DirectionalLight(
      timeOfDay === "morning" ? 0xfff7ed :
      timeOfDay === "night" ? 0x93c5fd : 0xffffff,
      timeOfDay === "night" ? 0.4 : 2.2
    );
    // Vector pointing from SSE (X: 8, Y: 14, Z: 18) towards interior (0, 0, 0)
    sunLight.position.set(8, 14, 18);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLightRef.current = sunLight;
    scene.add(sunLight);

    // Opposite Soft Fill Light
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.7);
    fillLight.position.set(-10, 12, -12);
    scene.add(fillLight);

    // Architectural Ground Grid (Main: #cbd5e1, Sub: #e2e8f0)
    const gridHelper = new THREE.GridHelper(34, 34, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = -0.02;
    scene.add(gridHelper);

    // Base Floor Slab (648 sq ft = 6.9m × 9.725m in 16x18 aspect)
    const floorGeometry = new THREE.BoxGeometry(16, 0.2, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.35,
      metalness: 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.position.y = -0.1;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // Floor Perimeter Edge Line
    const floorEdges = new THREE.EdgesGeometry(floorGeometry);
    const floorLine = new THREE.LineSegments(floorEdges, new THREE.LineBasicMaterial({ color: 0x94a3b8 }));
    floorLine.position.y = -0.1;
    scene.add(floorLine);

    // Helper: Create Architect-Grade Clean Furniture with Wireframe Border
    const createFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, color = 0xe2e8f0, edgeColor = 0x94a3b8) => {
      const group = new THREE.Group();
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.4,
        metalness: 0.05
      });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);

      // Add crisp architectural outline edge
      const edges = new THREE.EdgesGeometry(geom);
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1.5 }));
      group.add(line);

      group.position.set(x, y, z);
      return group;
    };

    // Helper: Create Architectural White Wall
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
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xcbd5e1 }));
        group.add(line);
      }

      group.position.set(x, y, z);
      return group;
    };

    // --- 1. Living Room & Balcony Furniture (Neutral Light Aesthetic) ---
    // Sofa (Light Soft Grey Linen)
    const sofa = createFurniture(4.5, 0.75, 1.6, -3.5, 0.45, 2.2, 0xd1d5db, 0x64748b);
    // Sofa Cushions
    const cushion1 = createFurniture(1.2, 0.25, 0.6, -4.5, 0.85, 2.2, 0x93c5fd, 0x3b82f6);
    const cushion2 = createFurniture(1.2, 0.25, 0.6, -2.5, 0.85, 2.2, 0xfde68a, 0xd97706);
    // Floating TV Stand & Screen
    const tvStand = createFurniture(5.2, 0.35, 0.6, -3.5, 0.3, -0.4, 0xe2e8f0, 0x94a3b8);
    const tvScreen = createFurniture(4.6, 2.3, 0.08, -3.5, 1.7, -0.6, 0x334155, 0x0f172a);
    // Balcony Glass Railing
    const balconyRailing = createWall(6.2, 1.1, 0.08, -3.5, 0.65, 7.8, 0.4, 0x93c5fd);
    scene.add(sofa, cushion1, cushion2, tvStand, tvScreen, balconyRailing);

    // --- 2. Kitchen & Island (White Sintered Stone + Warm Oak) ---
    // Kitchen L-Counter
    const kitchenCounter = createFurniture(4.0, 1.0, 1.2, -4.8, 0.55, -4.5, 0xe2e8f0, 0x94a3b8);
    // Sintered Stone Island Bar
    const island = createFurniture(3.4, 1.1, 1.4, -3.2, 0.6, -1.8, 0xffffff, 0x94a3b8);
    // Island Wood Extension
    const islandWood = createFurniture(1.2, 0.08, 1.4, -1.0, 1.05, -1.8, 0xe8d5b5, 0xb45309);
    scene.add(kitchenCounter, island, islandWood);

    // --- 3. 1+1 Geek Workstation (2.0m Lifting Desk + Glass Partition) ---
    // Glass Partition
    const studyGlass = createWall(0.08, 2.6, 4.8, 1.2, 1.35, 2.2, 0.35, 0xbfdbfe);
    // Solid Oak Lifting Desk (2.0m x 0.8m)
    const liftDesk = createFurniture(3.4, 0.1, 1.4, 4.2, 1.1, 2.2, 0xe8d5b5, 0xb45309);
    // Metal Desk Legs
    const leg1 = createFurniture(0.18, 1.05, 1.2, 2.8, 0.55, 2.2, 0x64748b, 0x334155);
    const leg2 = createFurniture(0.18, 1.05, 1.2, 5.6, 0.55, 2.2, 0x64748b, 0x334155);
    // Dual Screens (32" Curved & Vertical)
    const screen1 = createFurniture(1.4, 0.8, 0.06, 3.7, 1.75, 2.0, 0x2563eb, 0x1e40af);
    const screen2 = createFurniture(0.8, 1.3, 0.06, 4.9, 1.85, 2.0, 0x2563eb, 0x1e40af);
    scene.add(studyGlass, liftDesk, leg1, leg2, screen1, screen2);

    // --- 4. Master Bedroom (1.8m Floating Bed + Wardrobe) ---
    // Floating Bed Base + Mattress
    const bedBase = createFurniture(3.4, 0.45, 3.6, 4.2, 0.3, -3.5, 0xd1d5db, 0x94a3b8);
    const mattress = createFurniture(3.0, 0.4, 3.2, 4.2, 0.65, -3.5, 0xffffff, 0xcbd5e1);
    const headboard = createFurniture(3.4, 1.3, 0.15, 4.2, 0.85, -5.35, 0xe2e8f0, 0x94a3b8);
    // Full Height Wardrobe (PET Matte White)
    const wardrobe = createFurniture(0.7, 2.6, 4.2, 7.3, 1.35, -3.5, 0xffffff, 0xcbd5e1);
    scene.add(bedBase, mattress, headboard, wardrobe);

    // --- 5. Bathroom 1.5m Vanity Monolithic Platform ---
    const vanityLedge = createFurniture(2.8, 0.35, 1.2, 0.5, 0.9, -6.2, 0xffffff, 0x3b82f6);
    const mirrorCabinet = createFurniture(2.8, 1.1, 0.15, 0.5, 1.7, -6.7, 0xeff6ff, 0x2563eb);
    scene.add(vanityLedge, mirrorCabinet);

    // --- 6. Exterior Walls ---
    const northWall = createWall(16.0, 2.8, 0.2, 0, 1.4, -8.9, 1, 0xffffff);
    const eastWall = createWall(0.2, 2.8, 17.8, 7.9, 1.4, 0, 1, 0xffffff);
    const westWall = createWall(0.2, 2.8, 17.8, -7.9, 1.4, 0, 1, 0xffffff);
    scene.add(northWall, eastWall, westWall);

    // --- 7. Interactive Zone Highlight Floor Mesh & Outline ---
    const highlightGeom = new THREE.PlaneGeometry(1, 1);
    highlightGeom.rotateX(-Math.PI / 2);
    const highlightMat = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      transparent: true,
      opacity: 0.25,
      side: THREE.DoubleSide
    });
    const highlightMesh = new THREE.Mesh(highlightGeom, highlightMat);
    highlightMesh.position.y = 0.05;
    highlightMeshRef.current = highlightMesh;
    scene.add(highlightMesh);

    // Highlight Border
    const borderGeom = new THREE.BufferGeometry();
    const borderMat = new THREE.LineBasicMaterial({ color: 0x2563eb, linewidth: 2 });
    const highlightBorder = new THREE.LineSegments(borderGeom, borderMat);
    highlightBorder.position.y = 0.06;
    highlightBorderRef.current = highlightBorder;
    scene.add(highlightBorder);

    // Dynamic Groups for Markers & Dimensions
    const markerGroup = new THREE.Group();
    markerGroupRef.current = markerGroup;
    scene.add(markerGroup);

    const dimensionGroup = new THREE.Group();
    dimensionGroupRef.current = dimensionGroup;
    scene.add(dimensionGroup);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle pulsing of the active zone highlight
      if (highlightMeshRef.current) {
        highlightMat.opacity = 0.2 + Math.sin(elapsedTime * 3) * 0.08;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 540;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.innerHTML = "";
      }
      renderer.dispose();
    };
  }, [viewMode, selectedStyleId]);

  // 2. Update Highlight Mesh when `activeZone` changes (Fixing Error 1: Mesh ID / Coordinate Misalignment)
  useEffect(() => {
    if (!highlightMeshRef.current || !highlightBorderRef.current) return;
    const coords = ZONE_3D_COORDS[activeZone.id] || ZONE_3D_COORDS["zone-living"];

    // Update Plane Size & Position
    highlightMeshRef.current.scale.set(coords.w, coords.d, 1);
    highlightMeshRef.current.position.set(coords.x, 0.05, coords.z);

    // Update Border Wireframe Box
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
    highlightBorderRef.current.position.set(coords.x, 0.06, coords.z);
  }, [activeZone]);

  // 3. Update Sunlight and Ambience when `timeOfDay` changes (Fixing Error 2: SSE 165° Sunlight Rendering)
  useEffect(() => {
    if (!sunLightRef.current || !ambientLightRef.current || !sceneRef.current) return;

    if (timeOfDay === "morning") {
      // Warm SSE 165° morning sunlight coming through South balcony
      sunLightRef.current.position.set(8, 14, 18);
      sunLightRef.current.color.setHex(0xfff7ed);
      sunLightRef.current.intensity = 2.2;
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.6;
      sceneRef.current.background = new THREE.Color(0xeef2f6);
    } else if (timeOfDay === "noon") {
      // High noon overhead sunlight
      sunLightRef.current.position.set(2, 22, 6);
      sunLightRef.current.color.setHex(0xffffff);
      sunLightRef.current.intensity = 2.4;
      ambientLightRef.current.color.setHex(0xffffff);
      ambientLightRef.current.intensity = 1.7;
      sceneRef.current.background = new THREE.Color(0xf1f5f9);
    } else {
      // Geek night mode with deep blue ambience
      sunLightRef.current.position.set(-6, 12, -8);
      sunLightRef.current.color.setHex(0x93c5fd);
      sunLightRef.current.intensity = 0.5;
      ambientLightRef.current.color.setHex(0x334155);
      ambientLightRef.current.intensity = 0.9;
      sceneRef.current.background = new THREE.Color(0x1e293b);
    }
  }, [timeOfDay]);

  // 4. Update 3D Markers & Dimensions (Fixing Error 3: Layer Toggles and Inspector Linking)
  useEffect(() => {
    if (!markerGroupRef.current || !dimensionGroupRef.current) return;

    // Clear existing markers
    while (markerGroupRef.current.children.length > 0) {
      const obj = markerGroupRef.current.children[0];
      markerGroupRef.current.remove(obj);
    }
    while (dimensionGroupRef.current.children.length > 0) {
      const obj = dimensionGroupRef.current.children[0];
      dimensionGroupRef.current.remove(obj);
    }

    // Helper: Create 3D Floating Pin Marker
    const create3DPin = (x: number, y: number, z: number, colorHex: number, label: string) => {
      const pinGroup = new THREE.Group();
      // Sphere
      const sphereGeom = new THREE.SphereGeometry(0.2, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: colorHex });
      const sphere = new THREE.Mesh(sphereGeom, sphereMat);
      sphere.position.set(0, 0, 0);
      pinGroup.add(sphere);

      // Stem Line down to floor
      const stemGeom = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, -y, 0)
      ]);
      const stemMat = new THREE.LineBasicMaterial({ color: colorHex, opacity: 0.7, transparent: true });
      const stem = new THREE.Line(stemGeom, stemMat);
      pinGroup.add(stem);

      pinGroup.position.set(x, y, z);
      return pinGroup;
    };

    // Render MEP Markers (Amber 0xf59e0b)
    if (showMEP) {
      markerGroupRef.current.add(create3DPin(-3.5, 2.0, -0.4, 0xf59e0b, "SMATV"));
      markerGroupRef.current.add(create3DPin(-5.5, 2.4, 2.2, 0xf59e0b, "15A A/C"));
      markerGroupRef.current.add(create3DPin(-4.8, 1.8, -4.5, 0xf59e0b, "20A Oven"));
      markerGroupRef.current.add(create3DPin(4.2, 1.8, 2.0, 0xf59e0b, "Desk Sockets"));
      markerGroupRef.current.add(create3DPin(0.5, 1.8, -6.5, 0xf59e0b, "Vanity Power"));
    }

    // Render Smart Home Markers (Purple 0xa855f7)
    if (showSmartHome) {
      markerGroupRef.current.add(create3DPin(-5.0, 2.2, -7.0, 0xa855f7, "D200 Lock"));
      markerGroupRef.current.add(create3DPin(-3.5, 2.4, 1.0, 0xa855f7, "FP2 Living"));
      markerGroupRef.current.add(create3DPin(4.2, 2.4, 1.5, 0xa855f7, "FP2 Study"));
      markerGroupRef.current.add(create3DPin(4.2, 2.4, -5.0, 0xa855f7, "C3 Curtain"));
      markerGroupRef.current.add(create3DPin(4.2, 1.5, -7.5, 0xa855f7, "Roborock"));
    }

    // Render Dimensions Measurement Lines (Blue 0x2563eb)
    if (showDimensions) {
      // Helper: Draw dimension line
      const drawDimLine = (p1: [number, number, number], p2: [number, number, number], color = 0x2563eb) => {
        const geom = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...p1),
          new THREE.Vector3(...p2)
        ]);
        const mat = new THREE.LineBasicMaterial({ color, linewidth: 2 });
        return new THREE.Line(geom, mat);
      };

      // Living Room Clear Width Line (3,800 mm)
      dimensionGroupRef.current.add(drawDimLine([-6.6, 0.15, 4.5], [-0.4, 0.15, 4.5], 0x2563eb));
      // Living Room Depth Line (3,600 mm)
      dimensionGroupRef.current.add(drawDimLine([-0.4, 0.15, -0.4], [-0.4, 0.15, 4.5], 0x2563eb));
      // Full Width 6,900 mm Reference Line at Balcony
      dimensionGroupRef.current.add(drawDimLine([-6.6, 0.15, 7.8], [6.6, 0.15, 7.8], 0x059669));
    }
  }, [showMEP, showSmartHome, showDimensions]);

  // Adjust Camera Position on Preset Change
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    
    switch (cameraPreset) {
      case "birds-eye":
        cam.position.set(0, 25, 24);
        cam.lookAt(0, 0, 0);
        break;
      case "living":
        cam.position.set(-3.5, 7, 10);
        cam.lookAt(-3.5, 1.5, 1.0);
        break;
      case "workstation":
        cam.position.set(4.2, 6, 9);
        cam.lookAt(4.2, 1.5, 2.2);
        break;
      case "bedroom":
        cam.position.set(4.2, 6, 2);
        cam.lookAt(4.2, 1.2, -3.5);
        break;
      case "balcony":
        cam.position.set(-3.5, 3.5, 3);
        cam.lookAt(-3.5, 1.5, 8.0);
        break;
    }
  }, [cameraPreset]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Mode & Sun Light Presets */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "3d"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              3D 真实推演 (Three.js)
            </button>
            <button
              onClick={() => setViewMode("2.5d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "2.5d"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              2.5D BIM 交互底图
            </button>
          </div>

          {/* Time of Day Sun Angles */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeOfDay("morning")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium flex items-center space-x-1 ${
                timeOfDay === "morning"
                  ? "bg-amber-100 text-amber-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>🌅 晨光 (SSE 165°)</span>
            </button>
            <button
              onClick={() => setTimeOfDay("noon")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeOfDay === "noon"
                  ? "bg-sky-100 text-sky-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ☀️ 正午高光
            </button>
            <button
              onClick={() => setTimeOfDay("night")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeOfDay === "night"
                  ? "bg-indigo-100 text-indigo-900 font-bold shadow-2xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌙 极客夜景
            </button>
          </div>
        </div>

        {/* Right: Layer Toggles (All active by default) */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showDimensions
                ? "bg-blue-50 border-blue-300 text-blue-700 font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>尺寸标注 {showDimensions ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowMEP(!showMEP)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showMEP
                ? "bg-amber-50 border-amber-300 text-amber-700 font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>交标机电底账 {showMEP ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowSmartHome(!showSmartHome)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showSmartHome
                ? "bg-purple-50 border-purple-300 text-purple-700 font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Aqara 智能点位 {showSmartHome ? "✓" : ""}</span>
          </button>

          <button
            onClick={() => setShowMicroclimate(!showMicroclimate)}
            className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showMicroclimate
                ? "bg-emerald-50 border-emerald-300 text-emerald-700 font-semibold"
                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>微气候流场</span>
          </button>
        </div>
      </div>

      {/* Main 3D Viewport & Side Inspection Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 3D Viewport (8 Columns) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm flex flex-col min-h-[560px]">
          {/* Top Camera Presets Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 shadow-sm">
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

          {/* Compass & Solar Inflow Angle Badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 p-2.5 rounded-2xl flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
              <Sun className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-semibold">日照入射角 (Solar Azimuth)</div>
              <div className="text-xs font-black text-amber-600 font-mono">SSE 165° (直射南向阳台)</div>
            </div>
          </div>

          {/* 3D WebGL Canvas Container */}
          {viewMode === "3d" ? (
            <div ref={mountRef} className="w-full flex-1 h-full min-h-[500px] cursor-grab active:cursor-grabbing bg-[#eef2f6]" />
          ) : (
            /* 2.5D BIM Vector Floor Plan (Architectural Blueprints) */
            <div className="w-full flex-1 min-h-[500px] p-6 bg-slate-50 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[620px] aspect-[4/3] bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-md">
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
                    <div className="absolute bottom-2 left-10 flex items-center space-x-1 text-emerald-700 text-[10px] font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shadow-2xs">
                      <Wind className="w-3 h-3 animate-spin text-emerald-600" />
                      <span>西南季风对流穿堂 (SSE 165° → NNW 345°)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Interactive Zone Selector (Correctly triggers 3D Mesh Highlight at target coords) */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center overflow-x-auto space-x-2 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider pl-2 flex-shrink-0">
              9大功能分区:
            </span>
            {ZONES_DATA.map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZone(z)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeZone.id === z.id
                    ? "bg-slate-900 text-white shadow-sm ring-2 ring-blue-500/30"
                    : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {z.name} ({z.sqm}㎡)
              </button>
            ))}
          </div>
        </div>

        {/* Side Inspector: Deep-Dive Zone Info (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Zone Detail Card (Pure White Modern Card) */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
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

            {/* Spatial Dimensions Specs (3800 × 3600 mm) */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
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
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
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
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 space-y-1.5">
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
          <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-100 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-blue-900 font-bold">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>南向 24 楼高层微气候评估</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              {PROPERTY_DATA.microclimate.sunlight}
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed border-t border-blue-200/60 pt-2">
              {PROPERTY_DATA.microclimate.acousticsAndView}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
