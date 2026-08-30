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
  ShieldCheck
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

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(
      selectedStyleId === "tech-minimal" ? 0x090d16 :
      selectedStyleId === "dark-luxury" ? 0x080706 :
      selectedStyleId === "japandi-wood" ? 0x12100d : 0x0b0f14
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

    // Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(
      selectedStyleId === "dark-luxury" ? 0xffeedd : 
      selectedStyleId === "japandi-wood" ? 0xfff4e0 : 0xe0f2fe,
      selectedStyleId === "dark-luxury" ? 0.9 : 1.4
    );
    scene.add(ambientLight);

    // Sun light (from SSE: Azimuth ~165°)
    const sunLight = new THREE.DirectionalLight(
      timeOfDay === "morning" ? 0xffedd5 :
      timeOfDay === "sunset" ? 0xfdba74 :
      timeOfDay === "night" ? 0x38bdf8 : 0xffffff,
      timeOfDay === "night" ? 0.3 : 1.8
    );
    sunLight.position.set(12, 18, 16);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    scene.add(sunLight);

    // Accent Cyber / Warm Light
    const accentLight = new THREE.PointLight(
      selectedStyleId === "industrial-cyber" ? 0x06b6d4 :
      selectedStyleId === "dark-luxury" ? 0xf59e0b :
      selectedStyleId === "japandi-wood" ? 0xfef08a : 0x38bdf8,
      1.5,
      20
    );
    accentLight.position.set(2, 4, 2);
    scene.add(accentLight);

    // Grid Floor
    const gridHelper = new THREE.GridHelper(30, 30, 0x334155, 0x1e293b);
    gridHelper.position.y = -0.05;
    scene.add(gridHelper);

    // Base Floor Slab (648 sq ft representation)
    const floorGeometry = new THREE.BoxGeometry(16, 0.2, 18);
    const floorMat = new THREE.MeshStandardMaterial({
      color: selectedStyleId === "dark-luxury" ? 0x1c1917 :
             selectedStyleId === "japandi-wood" ? 0xd4a373 :
             selectedStyleId === "industrial-cyber" ? 0x52525b : 0xe2e8f0,
      roughness: 0.4,
      metalness: selectedStyleId === "industrial-cyber" ? 0.2 : 0.05
    });
    const floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    floorMeshRef.current = floorMesh;
    scene.add(floorMesh);

    // Build 3D Rooms & Furniture
    const roomGroups: { [key: string]: THREE.Group } = {};

    // Helper: Create Wall Box
    const createWall = (w: number, h: number, d: number, x: number, y: number, z: number, color = 0x334155, opacity = 1) => {
      const geom = new THREE.BoxGeometry(w, h, d);
      const mat = new THREE.MeshStandardMaterial({
        color,
        roughness: 0.6,
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
      const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.3 });
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
      selectedStyleId === "dark-luxury" ? 0x78350f : 
      selectedStyleId === "japandi-wood" ? 0xf5f5f4 : 0x1e293b
    );
    livingGroup.add(sofa);
    // TV Stand & Floating 85" TV
    const tvStand = createFurniture(5.5, 0.4, 0.6, -3.5, 0.3, -2.5, 0x0f172a);
    const tvScreen = createFurniture(4.8, 2.4, 0.1, -3.5, 1.8, -2.7, 0x020617);
    livingGroup.add(tvStand, tvScreen);
    // Balcony Railing (Glass)
    const balconyGlass = createWall(7.5, 1.1, 0.1, -3.5, 0.65, 8.8, 0x38bdf8, 0.4);
    livingGroup.add(balconyGlass);
    scene.add(livingGroup);
    roomGroups["living"] = livingGroup;

    // 2. Island & Kitchen Area
    const kitchenGroup = new THREE.Group();
    // Kitchen L-counter
    const kitchenCounter = createFurniture(3.5, 1.0, 1.2, -4.5, 0.6, -6.5, 0x475569);
    // Island Dining Bar
    const island = createFurniture(3.2, 1.1, 1.5, -3.5, 0.65, -3.5, 
      selectedStyleId === "industrial-cyber" ? 0x94a3b8 :
      selectedStyleId === "dark-luxury" ? 0x262626 : 0xf8fafc
    );
    kitchenGroup.add(kitchenCounter, island);
    scene.add(kitchenGroup);
    roomGroups["kitchen"] = kitchenGroup;

    // 3. Geek Workstation (1+1 Study) with Glass Partition
    const studyGroup = new THREE.Group();
    // Glass Partition
    const glassPartition = createWall(0.1, 2.8, 5.0, 1.5, 1.5, 1.5, 0x93c5fd, 0.35);
    // Ergonomic Lifting Desk (2.0m)
    const liftDesk = createFurniture(3.2, 0.1, 1.4, 4.5, 1.1, 1.5, 
      selectedStyleId === "japandi-wood" ? 0xd4a373 : 0x18181b
    );
    const deskLegs = createFurniture(0.2, 1.1, 1.2, 3.2, 0.55, 1.5, 0x0f172a);
    const deskLegs2 = createFurniture(0.2, 1.1, 1.2, 5.8, 0.55, 1.5, 0x0f172a);
    // Dual Screens
    const screen1 = createFurniture(1.4, 0.8, 0.05, 4.0, 1.8, 1.3, 0x0284c7);
    const screen2 = createFurniture(1.4, 0.8, 0.05, 5.2, 1.8, 1.4, 0x0284c7);
    studyGroup.add(glassPartition, liftDesk, deskLegs, deskLegs2, screen1, screen2);
    scene.add(studyGroup);
    roomGroups["study"] = studyGroup;

    // 4. Master Bedroom Area
    const bedroomGroup = new THREE.Group();
    // 1.8m Floating Bed
    const bedBase = createFurniture(3.4, 0.5, 3.6, 4.5, 0.35, -5.5, 0x334155);
    const mattress = createFurniture(3.0, 0.4, 3.2, 4.5, 0.7, -5.5, 0xf8fafc);
    const headboard = createFurniture(3.4, 1.4, 0.2, 4.5, 0.9, -7.3, 
      selectedStyleId === "dark-luxury" ? 0x451a03 : 0x1e293b
    );
    // Wardrobe Full Height
    const wardrobe = createFurniture(0.8, 2.7, 4.5, 7.4, 1.45, -5.0, 0xf1f5f9);
    bedroomGroup.add(bedBase, mattress, headboard, wardrobe);
    scene.add(bedroomGroup);
    roomGroups["bedroom"] = bedroomGroup;

    // 5. Exterior Surrounding Low Walls
    const northWall = createWall(16.2, 2.8, 0.2, 0, 1.5, -8.9, 0x1e293b);
    const eastWall = createWall(0.2, 2.8, 18, 7.9, 1.5, 0, 0x1e293b);
    const westWall = createWall(0.2, 2.8, 18, -7.9, 1.5, 0, 0x1e293b);
    scene.add(northWall, eastWall, westWall);

    roomMeshesRef.current = roomGroups;

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle floating light effect
      if (accentLight) {
        accentLight.intensity = 1.3 + Math.sin(elapsedTime * 2) * 0.3;
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
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Left: View Mode & Time of Day */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            <button
              onClick={() => setViewMode("3d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "3d"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              3D 真实推演 (Three.js)
            </button>
            <button
              onClick={() => setViewMode("2.5d")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === "2.5d"
                  ? "bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              2.5D BIM 交互底图
            </button>
          </div>

          {/* Time of Day Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeOfDay("morning")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeOfDay === "morning" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "text-slate-400"
              }`}
            >
              🌅 晨光 (SSE 165°)
            </button>
            <button
              onClick={() => setTimeOfDay("noon")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeOfDay === "noon" ? "bg-sky-500/20 text-sky-300 border border-sky-500/40" : "text-slate-400"
              }`}
            >
              ☀️ 正午高光
            </button>
            <button
              onClick={() => setTimeOfDay("night")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                timeOfDay === "night" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40" : "text-slate-400"
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
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showDimensions
                ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300"
                : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>尺寸标注</span>
          </button>

          <button
            onClick={() => setShowMEP(!showMEP)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showMEP
                ? "bg-amber-500/15 border-amber-500/40 text-amber-300"
                : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>交标机电底账</span>
          </button>

          <button
            onClick={() => setShowSmartHome(!showSmartHome)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showSmartHome
                ? "bg-purple-500/15 border-purple-500/40 text-purple-300"
                : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Aqara 智能点位</span>
          </button>

          <button
            onClick={() => setShowMicroclimate(!showMicroclimate)}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showMicroclimate
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300"
                : "bg-slate-900/60 border-slate-800 text-slate-500 hover:text-slate-300"
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
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden glass-panel border border-slate-800/80 bg-slate-950 flex flex-col min-h-[540px]">
          {/* Top Camera Presets Overlay */}
          <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-1.5 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-800/80 shadow-lg">
            <span className="text-[10px] text-slate-400 font-semibold px-2 py-1 flex items-center">
              <Eye className="w-3 h-3 mr-1 text-cyan-400" />
              视角:
            </span>
            <button
              onClick={() => setCameraPreset("birds-eye")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "birds-eye"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              俯瞰全景
            </button>
            <button
              onClick={() => setCameraPreset("living")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "living"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              客厅影音
            </button>
            <button
              onClick={() => setCameraPreset("workstation")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "workstation"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              极客工位
            </button>
            <button
              onClick={() => setCameraPreset("bedroom")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "bedroom"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              主卧深睡
            </button>
            <button
              onClick={() => setCameraPreset("balcony")}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                cameraPreset === "balcony"
                  ? "bg-cyan-500 text-slate-950 font-bold"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              24F 阳台视野
            </button>
          </div>

          {/* Compass Orientation Badge */}
          <div className="absolute top-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-2xl flex items-center space-x-2 shadow-lg">
            <div className="w-8 h-8 rounded-full bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 animate-pulse-slow">
              <Compass className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-semibold">主采光朝向</div>
              <div className="text-xs font-black text-cyan-300">SSE 165° (零西晒)</div>
            </div>
          </div>

          {/* 3D WebGL Canvas Container */}
          {viewMode === "3d" ? (
            <div ref={mountRef} className="w-full flex-1 h-full min-h-[500px] cursor-grab active:cursor-grabbing" />
          ) : (
            /* 2.5D BIM Vector Floor Plan Overlay */
            <div className="w-full flex-1 min-h-[500px] p-6 bg-slate-950 relative overflow-hidden flex items-center justify-center">
              <div className="relative w-full max-w-[620px] aspect-[4/3] bg-slate-900/80 rounded-2xl border-2 border-slate-700/80 p-3 shadow-2xl">
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
                      className={`rounded-xl border transition-all duration-200 cursor-pointer p-2 flex flex-col justify-between ${
                        isSelected
                          ? "bg-cyan-500/25 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-[1.02] z-10"
                          : "bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/80 hover:border-slate-600"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[11px] font-bold ${isSelected ? "text-cyan-300" : "text-slate-200"}`}>
                          {zone.name}
                        </span>
                        <span className="text-[9px] text-slate-400 bg-slate-950/60 px-1 rounded">
                          {zone.sqm} ㎡
                        </span>
                      </div>

                      {showDimensions && (
                        <div className="text-[9px] font-mono text-cyan-400/80">
                          {zone.dimensionsMm}
                        </div>
                      )}

                      {showMEP && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <span className="text-[8px] bg-amber-500/20 text-amber-300 px-1 rounded">
                            ⚡ {zone.mepPoints.length} 点位
                          </span>
                        </div>
                      )}

                      {showSmartHome && (
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          <span className="text-[8px] bg-purple-500/20 text-purple-300 px-1 rounded">
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
                    <div className="absolute bottom-2 left-10 flex items-center space-x-1 text-emerald-400 text-[10px] font-semibold bg-emerald-950/80 px-2 py-1 rounded-full border border-emerald-500/30">
                      <Wind className="w-3 h-3 animate-spin" />
                      <span>西南季风对流穿堂 (SSE 165° → NNW 345°)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bottom Interactive Zone Selector Bar */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center overflow-x-auto space-x-2 no-scrollbar">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider pl-2 flex-shrink-0">
              9大功能分区:
            </span>
            {ZONES_DATA.map((z) => (
              <button
                key={z.id}
                onClick={() => setActiveZone(z)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeZone.id === z.id
                    ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                    : "bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800"
                }`}
              >
                {z.name} ({z.sqm}㎡)
              </button>
            ))}
          </div>
        </div>

        {/* Side Inspector: Deep-Dive Zone Info (4 Columns) */}
        <div className="lg:col-span-4 space-y-4">
          {/* Active Zone Detail Card */}
          <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-cyan-400 uppercase tracking-widest font-mono">
                  ZONE INSPECTOR
                </span>
                <h3 className="text-xl font-black text-slate-100 flex items-center">
                  {activeZone.name}
                  <span className="ml-2 text-xs font-normal text-slate-400 font-mono">
                    {activeZone.enName}
                  </span>
                </h3>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-cyan-400 font-mono">
                  {activeZone.sqm} ㎡
                </div>
                <div className="text-[10px] text-slate-400">
                  {activeZone.sqft} sq ft
                </div>
              </div>
            </div>

            {/* Spatial Dimensions Specs */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80 text-xs">
              <div>
                <div className="text-[10px] text-slate-400">净开间进深尺寸</div>
                <div className="font-mono font-bold text-slate-200">{activeZone.dimensionsMm}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-400">吊顶后净高 (Clear Height)</div>
                <div className="font-mono font-bold text-cyan-400">{activeZone.clearHeightMm} mm</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeZone.description}
            </p>

            {/* MEP Handover Points */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-amber-400">
                <Zap className="w-3.5 h-3.5" />
                <span>交付机电底账预埋 (MEP Baseline)</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                {activeZone.mepPoints.map((mep, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                    <span>{mep}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Home Upgrades */}
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-purple-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>Aqara / 米家智能设备规划</span>
              </div>
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-1.5">
                {activeZone.smartDevices.map((dev, idx) => (
                  <div key={idx} className="flex items-start space-x-2 text-xs text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1.5 flex-shrink-0" />
                    <span>{dev}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Microclimate & Environment Card */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-emerald-400 font-bold">
              <Sun className="w-4 h-4" />
              <span>南向 24 楼高层微气候评估</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {PROPERTY_DATA.microclimate.sunlight}
            </p>
            <p className="text-[11px] text-slate-400 leading-relaxed border-t border-slate-800/60 pt-2">
              {PROPERTY_DATA.microclimate.acousticsAndView}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
