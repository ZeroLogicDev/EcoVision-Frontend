import { create } from 'zustand';

/**
 * Detection store — Zustand store for high-frequency detection state.
 * Using Zustand instead of Context to avoid unnecessary re-renders.
 */
export const useDetectionStore = create((set) => ({
  // Connection state
  isConnected: false,
  connectionStatus: 'disconnected', // 'connecting' | 'connected' | 'disconnected' | 'error'

  // Detection data
  detections: [],
  fps: 0,
  latency: 0,
  frameCount: 0,

  // Scanner mode
  isStreaming: false,
  scanMode: 'live', // 'live' | 'upload'

  // AI engine health
  aiStatus: 'unknown', // 'awake' | 'sleeping' | 'error' | 'unknown'

  // Actions
  setConnectionStatus: (status) => set({ connectionStatus: status, isConnected: status === 'connected' }),
  setDetections: (detections) => set({ detections }),
  setFPS: (fps) => set({ fps }),
  setLatency: (latency) => set({ latency }),
  incrementFrameCount: () => set((s) => ({ frameCount: s.frameCount + 1 })),
  setIsStreaming: (isStreaming) => set({ isStreaming }),
  setScanMode: (scanMode) => set({ scanMode }),
  setAiStatus: (aiStatus) => set({ aiStatus }),

  // Reset
  resetDetections: () => set({ detections: [], fps: 0, latency: 0, frameCount: 0 }),
}));
