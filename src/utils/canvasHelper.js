import { getClassConfig, getClassColor } from '@/constants/wasteClasses';

/**
 * Draw bounding boxes on a canvas overlay — multi-class with unique colors.
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {Array} detections - [{x1, y1, x2, y2, confidence, class_name, class_id}]
 * @param {number} videoWidth - Actual video element width
 * @param {number} videoHeight - Actual video element height
 * @param {number} modelWidth - Model input width (e.g., 320 or 640)
 * @param {number} modelHeight - Model input height
 */
export function drawDetections(ctx, detections, videoWidth, videoHeight, modelWidth = 640, modelHeight = 640) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (!detections || detections.length === 0) return;

  const scaleX = videoWidth / modelWidth;
  const scaleY = videoHeight / modelHeight;

  detections.forEach((det) => {
    const x = det.x1 * scaleX;
    const y = det.y1 * scaleY;
    const w = (det.x2 - det.x1) * scaleX;
    const h = (det.y2 - det.y1) * scaleY;
    const confidence = Math.round(det.confidence * 100);

    // Get class-specific color and label
    const classConfig = getClassConfig(det.class_name);
    const color = classConfig.color;
    const label = `${classConfig.nameId} ${confidence}%`;

    // Bounding box
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.shadowColor = `${color}80`;
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, w, h);
    ctx.shadowBlur = 0;

    // Corner accents (futuristic style)
    const cornerLen = Math.min(w, h) * 0.15;
    ctx.lineWidth = 3.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(x, y + cornerLen);
    ctx.lineTo(x, y);
    ctx.lineTo(x + cornerLen, y);
    ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLen, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + cornerLen);
    ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(x, y + h - cornerLen);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x + cornerLen, y + h);
    ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(x + w - cornerLen, y + h);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w, y + h - cornerLen);
    ctx.stroke();

    // Label background
    ctx.font = 'bold 13px Inter, sans-serif';
    const textWidth = ctx.measureText(label).width;
    const labelHeight = 22;
    const labelY = y > labelHeight + 4 ? y - labelHeight - 4 : y + 4;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, labelY, textWidth + 12, labelHeight, 4);
    ctx.fill();

    // Label text
    ctx.fillStyle = '#0a0a0a';
    ctx.fillText(label, x + 6, labelY + 15);
  });
}

/**
 * Clear the canvas overlay.
 */
export function clearCanvas(ctx) {
  if (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }
}
