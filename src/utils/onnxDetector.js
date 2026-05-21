import * as ort from 'onnxruntime-web';
import { CLASS_NAMES } from '@/constants/wasteClasses';

// Configure WASM paths (used as fallback if WebGL not available)
ort.env.wasm.wasmPaths = 'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/';
ort.env.wasm.numThreads = navigator.hardwareConcurrency || 4;

const MODEL_URL = '/models/yolo26n_eco.onnx';
const INPUT_SIZE = 640;
const CONF_THRESHOLD = 0.40;
const IOU_THRESHOLD = 0.45;

let session = null;
let isLoading = false;
let loadError = null;
let activeBackend = 'unknown';

/**
 * Load the ONNX model — tries WebGL (GPU) first, falls back to WASM (CPU).
 */
export async function loadModel(onProgress) {
  if (session) return session;
  if (isLoading) {
    while (isLoading) {
      await new Promise((r) => setTimeout(r, 100));
    }
    return session;
  }

  isLoading = true;
  loadError = null;

  try {
    if (onProgress) onProgress('Mengunduh model AI...');

    // Try WebGL (GPU) first — 5-20x faster than WASM
    try {
      session = await ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ['webgl'],
        graphOptimizationLevel: 'all',
      });
      activeBackend = 'webgl';
      console.log('[ONNX] Model loaded with WebGL (GPU) backend');
    } catch {
      // Fallback to WASM (CPU)
      console.warn('[ONNX] WebGL not available, falling back to WASM');
      session = await ort.InferenceSession.create(MODEL_URL, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all',
      });
      activeBackend = 'wasm';
      console.log('[ONNX] Model loaded with WASM (CPU) backend');
    }

    if (onProgress) onProgress('Model siap!');
    console.log('[ONNX] Model loaded successfully');
    console.log('[ONNX] Input names:', session.inputNames);
    console.log('[ONNX] Output names:', session.outputNames);
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
    backend: activeBackend,
  };
}

/**
 * Run inference on a video frame.
 */
export async function detectFrame(video, canvas) {
  if (!session) throw new Error('Model not loaded');

  // 1. Capture & resize frame to INPUT_SIZE x INPUT_SIZE
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

  // 4. Parse ALL outputs and find detections
  const output = results[session.outputNames[0]];
  return parseYoloOutput(output);
}

// ─── OUTPUT PARSING ─────────────────────────────────────────────

let cachedLayout = null;

/**
 * Parse YOLO ONNX output — brute-force tests both tensor layouts
 * on the first frame, then caches the correct one.
 */
function parseYoloOutput(output) {
  const dims = output.dims;
  const data = output.data;

  // Debug: log once
  if (!cachedLayout) {
    console.log('[ONNX] Output dims:', JSON.stringify(dims));
    console.log('[ONNX] Data length:', data.length);
    // Log first 20 raw values to understand the data
    const sample = [];
    for (let i = 0; i < Math.min(20, data.length); i++) {
      sample.push(Number(data[i]).toFixed(4));
    }
    console.log('[ONNX] First 20 values:', sample.join(', '));
  }

  // For 3D tensors: [batch, A, B]
  // For 2D tensors: [A, B]
  const a = dims.length === 3 ? dims[1] : dims[0];
  const b = dims.length === 3 ? dims[2] : dims[1];
  const offset = dims.length === 3 ? 0 : 0; // data starts at 0 regardless

  if (!cachedLayout) {
    // Try both layouts — sigmoid is applied inside tryParseLayout
    const det1 = tryParseLayout(data, a, b, false);
    const det2 = tryParseLayout(data, b, a, true);

    console.log(`[ONNX] Layout 1 (ch=${a}, boxes=${b}): ${det1.length} detections`);
    console.log(`[ONNX] Layout 2 (ch=${b}, boxes=${a}): ${det2.length} detections`);
    if (det1.length > 0) console.log('[ONNX] Layout 1 sample:', JSON.stringify(det1[0]));
    if (det2.length > 0) console.log('[ONNX] Layout 2 sample:', JSON.stringify(det2[0]));

    // Pick layout with more detections (both now have valid 0-1 scores thanks to sigmoid)
    if (det1.length >= det2.length && det1.length > 0) {
      cachedLayout = { channels: a, boxes: b, transposed: false };
      console.log('[ONNX] ✅ Using Layout 1');
      return nms(det1, IOU_THRESHOLD);
    } else if (det2.length > 0) {
      cachedLayout = { channels: b, boxes: a, transposed: true };
      console.log('[ONNX] ✅ Using Layout 2');
      return nms(det2, IOU_THRESHOLD);
    } else {
      console.warn('[ONNX] No detections from either layout');
      cachedLayout = { channels: Math.min(a, b), boxes: Math.max(a, b), transposed: a > b };
      return [];
    }
  }

  // Use cached layout
  const dets = tryParseLayout(data, cachedLayout.channels, cachedLayout.boxes, cachedLayout.transposed);
  return nms(dets, IOU_THRESHOLD);
}

/**
 * Try parsing with specific layout.
 * @param {boolean} transposed - If true, data is [boxes, channels]. If false, [channels, boxes].
 */
function tryParseLayout(data, numChannels, numBoxes, transposed) {
  const numClasses = numChannels - 4;
  if (numClasses <= 0 || numClasses > 200) return [];

  const get = transposed
    ? (b, c) => data[b * numChannels + c]
    : (b, c) => data[c * numBoxes + b];

  const detections = [];

  for (let i = 0; i < numBoxes; i++) {
    // Find max class score — apply sigmoid since ONNX outputs raw logits
    let maxScore = -Infinity;
    let maxClassId = 0;
    for (let c = 0; c < numClasses; c++) {
      const raw = get(i, 4 + c);
      const score = sigmoid(raw);
      if (score > maxScore) {
        maxScore = score;
        maxClassId = c;
      }
    }

    if (maxScore < CONF_THRESHOLD) continue;

    const cx = get(i, 0);
    const cy = get(i, 1);
    const w  = get(i, 2);
    const h  = get(i, 3);

    // Sanity check: box coords should be in 0-INPUT_SIZE range
    if (cx < 0 || cx > INPUT_SIZE * 2 || cy < 0 || cy > INPUT_SIZE * 2) continue;
    if (w <= 0 || h <= 0 || w > INPUT_SIZE * 2 || h > INPUT_SIZE * 2) continue;

    detections.push({
      x1: cx - w / 2,
      y1: cy - h / 2,
      x2: cx + w / 2,
      y2: cy + h / 2,
      confidence: Math.round(maxScore * 10000) / 10000,
      class_id: maxClassId,
      class_name: CLASS_NAMES[maxClassId] || 'UNKNOWN',
    });
  }

  return detections;
}

/**
 * Sigmoid activation — converts raw logits to 0-1 probability.
 */
function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

// ─── NMS ─────────────────────────────────────────────────────────

function nms(detections, iouThreshold) {
  if (detections.length === 0) return [];

  detections.sort((a, b) => b.confidence - a.confidence);

  const keep = [];

  while (detections.length > 0) {
    const best = detections.shift();
    keep.push(best);

    detections = detections.filter((det) => {
      if (det.class_id !== best.class_id) return true;
      return iou(best, det) < iouThreshold;
    });
  }

  return keep;
}

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
