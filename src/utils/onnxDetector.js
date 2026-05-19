import * as ort from 'onnxruntime-web';
import { CLASS_NAMES } from '@/constants/wasteClasses';

// Use WASM backend (works everywhere, no GPU required)
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';

const MODEL_URL = '/models/yolo26n_eco.onnx';
const INPUT_SIZE = 320;
const CONF_THRESHOLD = 0.35;
const IOU_THRESHOLD = 0.45;

let session = null;
let isLoading = false;
let loadError = null;

/**
 * Load the ONNX model — called once, cached globally.
 */
export async function loadModel(onProgress) {
  if (session) return session;
  if (isLoading) {
    // Wait for ongoing load
    while (isLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return session;
  }

  isLoading = true;
  loadError = null;

  try {
    if (onProgress) onProgress('Mengunduh model AI...');

    session = await ort.InferenceSession.create(MODEL_URL, {
      executionProviders: ['wasm'],
      graphOptimizationLevel: 'all',
    });

    if (onProgress) onProgress('Model siap!');
    console.log('[ONNX] Model loaded successfully');
    return session;
  } catch (err) {
    loadError = err;
    console.error('[ONNX] Failed to load model:', err);
    throw err;
  } finally {
    isLoading = false;
  }
}

/**
 * Get model loading status.
 */
export function getModelStatus() {
  return {
    isLoaded: !!session,
    isLoading,
    error: loadError,
  };
}

/**
 * Run inference on a video frame.
 * @param {HTMLVideoElement} video - Live video element
 * @param {HTMLCanvasElement} canvas - Scratch canvas for capture
 * @returns {Array} detections [{x1, y1, x2, y2, confidence, class_id, class_name}]
 */
export async function detectFrame(video, canvas) {
  if (!session) throw new Error('Model not loaded');

  // 1. Capture & resize frame to 320x320
  canvas.width = INPUT_SIZE;
  canvas.height = INPUT_SIZE;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, INPUT_SIZE, INPUT_SIZE);

  // 2. Get pixel data and convert to Float32 NCHW tensor
  const imageData = ctx.getImageData(0, 0, INPUT_SIZE, INPUT_SIZE);
  const { data } = imageData;
  const numPixels = INPUT_SIZE * INPUT_SIZE;

  const float32Data = new Float32Array(3 * numPixels);

  for (let i = 0; i < numPixels; i++) {
    const offset = i * 4; // RGBA
    float32Data[i] = data[offset] / 255.0;                    // R → Channel 0
    float32Data[numPixels + i] = data[offset + 1] / 255.0;    // G → Channel 1
    float32Data[2 * numPixels + i] = data[offset + 2] / 255.0; // B → Channel 2
  }

  const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, INPUT_SIZE, INPUT_SIZE]);

  // 3. Run inference
  const inputName = session.inputNames[0];
  const results = await session.run({ [inputName]: inputTensor });

  // 4. Parse output
  const output = results[session.outputNames[0]];
  return parseYoloOutput(output);
}

/**
 * Parse YOLO output tensor → detections array.
 * YOLOv8/YOLO11 output shape: [1, numClasses + 4, numBoxes]
 * Where first 4 rows = cx, cy, w, h and remaining = class scores.
 */
function parseYoloOutput(output) {
  const [batch, channels, numBoxes] = output.dims;
  const data = output.data;
  const numClasses = channels - 4;

  const detections = [];

  for (let i = 0; i < numBoxes; i++) {
    // Find best class
    let maxScore = 0;
    let maxClassId = 0;
    for (let c = 0; c < numClasses; c++) {
      const score = data[(4 + c) * numBoxes + i];
      if (score > maxScore) {
        maxScore = score;
        maxClassId = c;
      }
    }

    if (maxScore < CONF_THRESHOLD) continue;

    // Get box coordinates (cx, cy, w, h → x1, y1, x2, y2)
    const cx = data[0 * numBoxes + i];
    const cy = data[1 * numBoxes + i];
    const w = data[2 * numBoxes + i];
    const h = data[3 * numBoxes + i];

    detections.push({
      x1: cx - w / 2,
      y1: cy - h / 2,
      x2: cx + w / 2,
      y2: cy + h / 2,
      confidence: maxScore,
      class_id: maxClassId,
      class_name: CLASS_NAMES[maxClassId] || 'UNKNOWN',
    });
  }

  // NMS
  return nms(detections, IOU_THRESHOLD);
}

/**
 * Non-Maximum Suppression — remove overlapping boxes.
 */
function nms(detections, iouThreshold) {
  if (detections.length === 0) return [];

  // Sort by confidence descending
  detections.sort((a, b) => b.confidence - a.confidence);

  const keep = [];

  while (detections.length > 0) {
    const best = detections.shift();
    keep.push(best);

    detections = detections.filter((det) => {
      // Only suppress same class
      if (det.class_id !== best.class_id) return true;
      return iou(best, det) < iouThreshold;
    });
  }

  return keep;
}

/**
 * Intersection over Union.
 */
function iou(a, b) {
  const x1 = Math.max(a.x1, b.x1);
  const y1 = Math.max(a.y1, b.y1);
  const x2 = Math.min(a.x2, b.x2);
  const y2 = Math.min(a.y2, b.y2);

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const areaA = (a.x2 - a.x1) * (a.y2 - a.y1);
  const areaB = (b.x2 - b.x1) * (b.y2 - b.y1);

  return intersection / (areaA + areaB - intersection + 1e-6);
}
