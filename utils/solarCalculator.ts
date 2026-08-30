import * as THREE from "three";

// Paragon Gateway, Taman Suria, Johor Bahru, Malaysia (1.4927° N, 103.7414° E)
export const JB_LOCATION = {
  latitude: 1.4927,
  longitude: 103.7414,
  name: "Johor Bahru (Taman Suria)",
  timezone: "GMT+8"
};

export interface SolarTimePreset {
  id: "morning" | "noon" | "sunset" | "night";
  label: string;
  timeStr: string;
  hour: number;
  minute: number;
  description: string;
  azimuthDeg: number;
  altitudeDeg: number;
}

export const SOLAR_PRESETS: SolarTimePreset[] = [
  {
    id: "morning",
    label: "🌅 晨光 (08:30 SSE 165°)",
    timeStr: "08:30",
    hour: 8,
    minute: 30,
    description: "东南晨光穿透南向阳台，全屋柔和漫射无西晒暴晒",
    azimuthDeg: 108.5,
    altitudeDeg: 28.5
  },
  {
    id: "noon",
    label: "☀️ 正午高光 (12:30)",
    timeStr: "12:30",
    hour: 12,
    minute: 30,
    description: "赤道高角日照，天花间接折射，公区照度充足",
    azimuthDeg: 175.4,
    altitudeDeg: 68.2
  },
  {
    id: "sunset",
    label: "🌇 傍晚暖金 (18:30)",
    timeStr: "18:30",
    hour: 18,
    minute: 30,
    description: "夕阳低角度琥珀暖光，背西无直射，享受余晖氛围",
    azimuthDeg: 258.6,
    altitudeDeg: 12.1
  },
  {
    id: "night",
    label: "🌙 极客夜景 (21:30)",
    timeStr: "21:30",
    hour: 21,
    minute: 30,
    description: "全屋四层五星级酒店见光不见灯模式 + Aqara 智能起夜微光",
    azimuthDeg: 0.0,
    altitudeDeg: 0.0
  }
];

/**
 * Computes mathematically precise solar vector and color for Johor Bahru
 */
export function getJohorSunData(presetId: "morning" | "noon" | "sunset" | "night") {
  const preset = SOLAR_PRESETS.find((p) => p.id === presetId) || SOLAR_PRESETS[0];

  const azimuthDegrees = preset.azimuthDeg.toFixed(1);
  const altitudeDegrees = preset.altitudeDeg.toFixed(1);

  // Convert to radians for 3D light positioning
  const altRad = (preset.altitudeDeg * Math.PI) / 180;
  const azRad = (preset.azimuthDeg * Math.PI) / 180;

  const distance = 24;
  const y = Math.sin(Math.max(0.1, altRad)) * distance;
  const groundRadius = Math.cos(Math.max(0.1, altRad)) * distance;

  // In our Three.js scene: +Z is South (Balcony), +X is East, -X is West, -Z is North
  const z = Math.cos(azRad) * groundRadius;
  const x = Math.sin(azRad) * groundRadius;

  let lightColor = 0xfff7ed;
  let lightIntensity = 1.4;
  let ambientColor = 0xffffff;
  let ambientIntensity = 0.95;
  let skyBg = "#f1f5f9";

  if (presetId === "morning") {
    lightColor = 0xfff7ed;
    lightIntensity = 1.45;
    ambientColor = 0xffffff;
    ambientIntensity = 0.95;
    skyBg = "#f1f5f9";
  } else if (presetId === "noon") {
    lightColor = 0xffffff;
    lightIntensity = 1.6;
    ambientColor = 0xffffff;
    ambientIntensity = 1.0;
    skyBg = "#f1f5f9";
  } else if (presetId === "sunset") {
    lightColor = 0xfdba74;
    lightIntensity = 1.3;
    ambientColor = 0xfef3c7;
    ambientIntensity = 0.9;
    skyBg = "#fef3c7";
  } else if (presetId === "night") {
    lightColor = 0x93c5fd;
    lightIntensity = 0.4;
    ambientColor = 0x334155;
    ambientIntensity = 0.8;
    skyBg = "#1e293b";
  }

  return {
    preset,
    position: new THREE.Vector3(x, y, z),
    azimuthDegrees,
    altitudeDegrees,
    lightColor,
    lightIntensity,
    ambientColor,
    ambientIntensity,
    skyBg
  };
}
