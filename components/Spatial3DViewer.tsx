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
  Building2
} from "lucide-react";
import { ZONES_DATA, STYLES_DATA, PROPERTY_DATA, ZoneData } from "@/data/projectData";

interface Spatial3DViewerProps {
  selectedStyleId: string;
}

export const Spatial3DViewer: React.FC<Spatial3DViewerProps> = ({ selectedStyleId }) => {
  const currentStyle = STYLES_DATA.find((s) => s.id === selectedStyleId) || STYLES_DATA[0];
  const [activeZone, setActiveZone] = useState<ZoneData>(ZONES_DATA[3]); // Default to Living Room
  const [viewMode, setViewMode] = useState<"3d" | "2.5d">("3d");
  const [cameraPreset, setCameraPreset] = useState<"birds-eye" | "living" | "workstation" | "bedroom" | "balcony">("birds-eye");
  
  // Layer Toggles
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showMEP, setShowMEP] = useState<boolean>(false);
  const [showSmartHome, setShowSmartHome] = useState<boolean>(true);
  const [showMicroclimate, setShowMicroclimate] = useState<boolean>(true);
  const [timeOfDay, setTimeOfDay] = useState<"morning" | "noon" | "sunset" | "night">("morning");

  // Three.js Canvas Container
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const floorMeshRef = useRef<THREE.Mesh | null>(null);
  const roomMeshesRef = useRef<{ [key: string]: THREE.Group }>({});

  // 3D Scene Initialization
  useEffect(() => {
    if (!mountRef.current || viewMode !== "3d") return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 520;

    // Scene with Studio Light Grey Background
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      timeOfDay === "night" ? 0x1e293b :
      timeOfDay === "sunset" ? 0xfef3c7 :
      0xeef2f6
    );

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 26, 26);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Ambient Lighting for Light Minimalist Studio
    const ambientLight = new THREE.AmbientLight(
      timeOfDay === "night" ? 0x64748b : 
      timeOfDay === "sunset" ? 0xffedd5 : 0xffffff,
      timeOfDay === "night" ? 0.8 : 1.5
    );
    scene.add(ambientLight);

    // Sun light (from SSE: Azimuth ~165°)
    const sunLight = new THREE.DirectionalLight(
      timeOfDay === "morning" ? 0xfff7ed :
      timeOfDay === "sunset" ? 0xfdba74 :
      timeOfDay === "night" ? 0x93c5fd : 0xffffff,
      timeOfDay === "night" ? 0.4 : 1.6
    );
    sunLight.position.set(12, 18, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // Fill Light from opposite side for natural soft shadows
    const fillLight = new THREE.DirectionalLight(0xe2e8f0, 0.6);
    fillLight.position.set(-12, 12, -12);
    scene.add(fillLight);

    // Subtle Accent Light
    const accentLight = new THREE.PointLight(
      selectedStyleId === "dark-luxury" ? 0xf59e0b :
      selectedStyleId === "japandi-wood" ? 0xfbbf24 : 0x3b82f6,
      1.2,
      20
    );
    accentLight.position.set(2, 4, 2);
    scene.add(accentLight);

    // Architectural Light Grid (Main: #cbd5e1, Sub: #e2e8f0)
    const gridHelper = new THREE.GridHelper(32, 32, 0xcbd5e1, 0xe2e8f0);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Base Floor Slab (648 sq ft representation)
    const floorGeometry = new THREE.BoxGeometry(16, 0.2, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: selectedStyleId === "dark-luxury" ? 0x292524 :
             selectedStyleId === "japandi-wood" ? 0xe2cfb5 :
             selectedStyleId === "industrial-cyber" ? 0xd4d4d8 : 0xf1f5f9,
      roughness: 0.3,
      metalness: selectedStyleId === "industrial-cyber" ? 0.1 : 0.02
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMeshRef.current = floorMesh;
    scene.add(floorMesh);

    // Build 3D Rooms & Furniture
    const roomGroups: { [key: string]: THREE.Group } = {};

    // Helper: Create Wall Box
    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number, color = 0xffffff, opacity = 1) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        transparent: opacity < 1,
        opacity
      });
      const wall = new THREE.Mesh(geom, mat);
      wall.position.set(x, y, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      return wall;
    };

    // Helper: Create Furniture Item
    const createFurniture = (w: number, h: number, d: number, x: number, y: number, z: number, color: number) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.35 });
      const item = new THREE.Mesh(geom, mat);
      item.position.set(x, y, z);
      item.castShadow = true;
      item.receiveShadow = true;
      return item;
    };

    // 1. Living Room & Balcony Area
    const livingGroup = new THREE.Group();
    // Sofa
    const sofa = createFurniture(4.5, 0.8, 1.6, -3.5, 0.5, 2, 
      selectedStyleId === "dark-luxury" ? 0x451a03 : 
      selectedStyleId === "japandi-wood" ? 0xd6d3d1 : 0x334155
    );
    livingGroup.add(sofa);
    // TV Stand & Floating 85" TV
    const tvStand = createFurniture(5.5, 0.4, 0.6, -3.5, 0.3, -2.5, 0x1e293b);
    const tvScreen = createFurniture(4.8, 2.4, 0.1, -3.5, 1.8, -2.7, 0x0f172a);
    livingGroup.add(tvStand, tvScreen);
    // Balcony Railing (Glass)
    const balconyGlass = createWall(7.5, 1.1, 0.1, -3.5, 0.65, 8.8, 0x60a5fa, 0.35);
    livingGroup.add(balconyGlass);
    scene.add(livingGroup);
    roomGroups["living"] = livingGroup;

    // 2. Island & Kitchen Area
    const kitchenGroup = new THREE.Group();
    // Kitchen L-counter
    const kitchenCounter = createFurniture(3.5, 1.0, 1.2, -4.5, 0.6, -6.5, 0x94a3b8);
    // Island Dining Bar
    const island = createFurniture(3.2, 1.1, 1.5, -3.5, 0.65, -3.5, 
      selectedStyleId === "industrial-cyber" ? 0xcbd5e1 :
      selectedStyleId === "dark-luxury" ? 0x1c1917 : 0xffffff
    );
    kitchenGroup.add(kitchenCounter, island);
    scene.add(kitchenGroup);
    roomGroups["kitchen"] = kitchenGroup;

    // 3. Geek Workstation (1+1 Study) with Glass Partition
    const studyGroup = new THREE.Group();
    // Glass Partition
    const glassPartition = createWall(0.1, 2.8, 5.0, 1.5, 1.5, 1.5, 0xbfdbfe, 0.3);
    // Ergonomic Lifting Desk (2.0m)
    const liftDesk = createFurniture(3.2, 0.1, 1.4, 4.5, 1.1, 1.5, 
      selectedStyleId === "japandi-wood" ? 0xd4a373 : 0x1e293b
    );
    const deskLegs = createFurniture(0.2, 1.1, 1.2, 3.2, 0.55, 1.5, 0x334155);
    const deskLegs2 = createFurniture(0.2, 1.1, 1.2, 5.8, 0.55, 1.5, 0x334155);
    // Dual Screens
    const screen1 = createFurniture(1.4, 0.8, 0.05, 4.0, 1.8, 1.3, 0x2563eb);
    const screen2 = createFurniture(1.4, 0.8, 0.05, 5.2, 1.8, 1.4, 0x2563eb);
    studyGroup.add(glassPartition, liftDesk, deskLegs, deskLegs2, screen1, screen2);
    scene.add(studyGroup);
    roomGroups["study"] = studyGroup;

    // 4. Master Bedroom Area
    const bedroomGroup = new THREE.Group();
    // 1.8m Floating Bed
    const bedBase = createFurniture(3.4, 0.5, 3.6, 4.5, 0.35, -5.5, 0x64748b);
    const mattress = createFurniture(3.0, 0.4, 3.2, 4.5, 0.7, -5.5, 0xffffff);
    const headboard = createFurniture(3.4, 1.4, 0.2, 4.5, 0.9, -7.3, 
      selectedStyleId === "dark-luxury" ? 0x292524 : 0x475569
    );
    // Wardrobe Full Height
    const wardrobe = createFurniture(0.8, 2.7, 4.5, 7.4, 1.45, -5.0, 0xf8fafc);
    bedroomGroup.add(bedBase, mattress, headboard, wardrobe);
    scene.add(bedroomGroup);
    roomGroups["bedroom"] = bedroomGroup;

    // 5. Exterior Surrounding Clean Walls
    const northWall = createWall(16.2, 2.8, 0.2, 0, 1.5, -8.9, 0xffffff);
    const eastWall = createWall(0.2, 2.8, 18, 7.9, 1.5, 0, 0xffffff);
    const westWall = createWall(0.2, 2.8, 18, -7.9, 1.5, 0, 0xffffff);
    scene.add(northWall, eastWall, westWall);

    roomMeshesRef.current = roomGroups;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle subtle breathing light
      if (accentLight) {
        accentLight.intensity = 1.0 + Math.sin(elapsedTime * 2) * 0.2;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !renderer || !camera) return;
      const newW = mountRef.current.clientWidth;
      const newH = mountRef.current.clientHeight || 520;
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
  }, [viewMode, selectedStyleId, timeOfDay]);

  // Adjust Camera Position according to Preset
  useEffect(() => {
    if (!cameraRef.current) return;
    const cam = cameraRef.current;
    
    switch (cameraPreset) {
      case "birds-eye":
        cam.position.set(0, 24, 24);
        cam.lookAt(0, 0, 0);
        break;
      case "living":
        cam.position.set(-3.5, 7, 10);
        cam.lookAt(-3.5, 1, 0);
        break;
      case "workstation":
        cam.position.set(4.5, 5, 8);
        cam.lookAt(4.5, 1.5, 1.5);
        break;
      case "bedroom":
        cam.position.set(4.5, 6, -1);
        cam.lookAt(4.5, 1, -5.5);
        break;
      case "balcony":
        cam.position.set(-3.5, 3, 4);
        cam.lookAt(-3.5, 2, 14);
        break;
    }
  }, [cameraPreset]);

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Mode & Time of Day */}
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

          {/* Time of Day Switcher */}
          <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeOfDay("morning")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeOfDay === "morning" ? "bg-amber-100 text-amber-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌅 晨光 (SSE 165°)
            </button>
            <button
              onClick={() => setTimeOfDay("noon")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeOfDay === "noon" ? "bg-sky-100 text-sky-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ☀️ 正午高光
            </button>
            <button
              onClick={() => setTimeOfDay("night")}
              className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                timeOfDay === "night" ? "bg-indigo-100 text-indigo-900 font-semibold shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              🌙 极客夜景
            </button>
          </div>
        </div>

        {/* Right: Layer Toggles */}
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
            <span>尺寸标注</span>
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
            <span>交标机电底账</span>
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
            <span>Aqara 智能点位</span>
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
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm flex flex-col min-h-[540px]">
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

          {/* Compass Orientation Badge */}
          <div className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md border border-slate-200 p-2.5 rounded-2xl flex items-center space-x-2.5 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-500 font-semibold">主采光朝向</div>
              <div className="text-xs font-black text-blue-600 font-mono">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* 3D WebGL Canvas Container */}
          {viewMode === "3d" ? (
            <div ref={mountRef} className="w-full flex-1 h-full min-h-[500px] cursor-grab active:cursor-grabbing bg-[#eef2f6]" />
          ) : (
            /* 2.5D BIM Vector Floor Plan Overlay (Light Architectural Paper) */
            <div className="w-full flex-1 min-h-[500px] p-6 bg-slate-50 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[620px] aspect-[4/3] bg-white rounded-2xl border-2 border-slate-300 p-3 shadow-md">
                {/* 9 Interactive Zone Blocks on 2.5D Floor Plan */}
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
                          ? "bg-blue-50 border-blue-500 shadow-md scale-[1.02] z-10 text-blue-950"
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

                {/* Wind Monsoon Flow Animation */}
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

          {/* Bottom Interactive Zone Selector Bar */}
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
                    ? "bg-slate-900 text-white shadow-sm"
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

            {/* Spatial Dimensions Specs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
              <div>
                <div className="text-[10px] text-slate-500 font-medium">净开间进深尺寸</div>
                <div className="font-mono font-bold text-slate-900 mt-0.5">{activeZone.dimensionsMm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-medium">吊顶后净高 (Clear Height)</div>
                <div className="font-mono font-bold text-blue-600 mt-0.5">{activeZone.clearHeightMm} mm</div>
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
