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
    const offset = i * 4;
    float32Data[i] = data[offset] / 255.0;
    float32Data[numPixels + i] = data[offset + 1] / 255.0;
    float32Data[2 * numPixels + i] = data[offset + 2] / 255.0;
  }

  const inputTensor = new ort.Tensor('float32', float32Data, [1, 3, INPUT_SIZE, INPUT_SIZE]);

  // 3. Run inference
  const inputName = session.inputNames[0];
  const results = await session.run({ [inputName]: inputTensor });

  // 4. Parse output
  const output = results[session.outputNames[0]];
  return parseOutput(output);
}

/**
 * Parse model output.
 *
 * This model uses NMS-included export format:
 *   Output shape: [1, 300, 6]
 *   Per detection: [x1, y1, x2, y2, confidence, class_id]
 *   - Coordinates are in pixel space (0-640)
 *   - Confidence is already 0-1 (post-sigmoid by model)
 *   - class_id is an integer (0-5)
 *   - 300 = max detections (padded with zeros/low-conf if fewer)
 */
function parseOutput(output) {
  const dims = output.dims;
  const data = output.data;

  console.log('[ONNX] Output dims:', JSON.stringify(dims));

  let numDetections, numValues;

  if (dims.length === 3) {
    // [1, numDetections, 6]
    numDetections = dims[1];
    numValues = dims[2];
  } else if (dims.length === 2) {
    // [numDetections, 6]
    numDetections = dims[0];
    numValues = dims[1];
  } else {
    console.warn('[ONNX] Unexpected dims:', dims);
    return [];
  }

  // NMS-included format: [x1, y1, x2, y2, conf, class_id]
  if (numValues === 6) {
    return parseNMSFormat(data, numDetections);
  }

  // Raw YOLO format: [1, 4+nc, numBoxes] or [1, numBoxes, 4+nc]
  return parseRawYoloFormat(data, dims);
}

/**
 * Parse NMS-included format: [numDetections, 6]
 * Each row: [x1, y1, x2, y2, confidence, class_id]
 */
function parseNMSFormat(data, numDetections) {
  const detections = [];

  for (let i = 0; i < numDetections; i++) {
    const offset = i * 6;
    const x1 = data[offset + 0];
    const y1 = data[offset + 1];
    const x2 = data[offset + 2];
    const y2 = data[offset + 3];
    const confidence = data[offset + 4];
    const classId = Math.round(data[offset + 5]);

    // Skip low confidence (padded/empty detections)
    if (confidence < CONF_THRESHOLD) continue;

    // Skip invalid boxes
    if (x2 <= x1 || y2 <= y1) continue;
    if (x1 < 0 && y1 < 0 && x2 < 0 && y2 < 0) continue;

    detections.push({
      x1: Math.max(0, x1),
      y1: Math.max(0, y1),
      x2: Math.min(INPUT_SIZE, x2),
      y2: Math.min(INPUT_SIZE, y2),
      confidence: Math.round(confidence * 10000) / 10000,
      class_id: classId,
      class_name: CLASS_NAMES[classId] || 'UNKNOWN',
    });
  }

  // Sort by confidence descending
  detections.sort((a, b) => b.confidence - a.confidence);
  return detections;
}

/**
 * Fallback: Parse raw YOLO format [1, 4+nc, numBoxes]
 * (In case model is re-exported without NMS)
 */
function parseRawYoloFormat(data, dims) {
  const a = dims.length === 3 ? dims[1] : dims[0];
  const b = dims.length === 3 ? dims[2] : dims[1];

  // Determine channels vs boxes (channels = smaller dimension)
  const numChannels = Math.min(a, b);
  const numBoxes = Math.max(a, b);
  const transposed = a > b;
  const numClasses = numChannels - 4;

  if (numClasses <= 0) return [];

  const get = transposed
    ? (box, ch) => data[box * numChannels + ch]
    : (box, ch) => data[ch * numBoxes + box];

  const detections = [];

  for (let i = 0; i < numBoxes; i++) {
    let maxScore = -Infinity;
    let maxClassId = 0;
    for (let c = 0; c < numClasses; c++) {
      const raw = get(i, 4 + c);
      const score = 1 / (1 + Math.exp(-raw)); // sigmoid
      if (score > maxScore) {
        maxScore = score;
        maxClassId = c;
      }
    }

    if (maxScore < CONF_THRESHOLD) continue;

    const cx = get(i, 0);
    const cy = get(i, 1);
    const w = get(i, 2);
    const h = get(i, 3);

    if (w <= 0 || h <= 0) continue;

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

  return nms(detections, IOU_THRESHOLD);
}

/**
 * Non-Maximum Suppression (only needed for raw YOLO format).
 */
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
