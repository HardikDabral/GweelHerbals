import { create } from "zustand";

interface ThreeDState {
  is3DEnabled: boolean;
  isWebGLSupported: boolean;
  reducedMotion: boolean;
  enable3D: () => void;
  disable3D: () => void;
  setReducedMotion: (value: boolean) => void;
  checkWebGLSupport: () => boolean;
}

export const use3DStore = create<ThreeDState>((set, get) => ({
  is3DEnabled: false,
  isWebGLSupported: typeof window !== "undefined" && !!window.WebGLRenderingContext,
  reducedMotion: typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  enable3D: () => set({ is3DEnabled: true }),
  disable3D: () => set({ is3DEnabled: false }),
  setReducedMotion: (value) => set({ reducedMotion: value }),
  checkWebGLSupport: () => {
    if (typeof window === "undefined") return false;
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    return !!gl;
  },
}));

