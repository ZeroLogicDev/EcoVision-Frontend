/**
 * JSDoc type definitions — shared across the codebase.
 * Provides IntelliSense autocomplete without TypeScript.
 */

/**
 * @typedef {Object} Detection
 * @property {number} x1 - Top-left X coordinate
 * @property {number} y1 - Top-left Y coordinate
 * @property {number} x2 - Bottom-right X coordinate
 * @property {number} y2 - Bottom-right Y coordinate
 * @property {number} confidence - Detection confidence (0-1)
 * @property {number} class_id - Class ID from model
 * @property {string} class_name - Class name (e.g., 'trash')
 */

/**
 * @typedef {Object} ScanResult
 * @property {Detection[]} detections
 * @property {number} latency - Inference time in ms
 * @property {string} model - Model used (e.g., 'yolo26m')
 * @property {ScanStats} [stats] - Stats (upload only)
 */

/**
 * @typedef {Object} ScanStats
 * @property {number} count - Number of detections
 * @property {number} avg_confidence - Average confidence
 * @property {string[]} classes - Unique classes found
 */

/**
 * @typedef {Object} ScanHistory
 * @property {string} id - UUID
 * @property {string} user_id - User UUID
 * @property {string} [image_url] - Stored image URL
 * @property {number} detection_count
 * @property {Detection[]} detections - Raw detections JSONB
 * @property {'live'|'upload'} scan_mode
 * @property {number} confidence_avg
 * @property {string} created_at - ISO timestamp
 */

/**
 * @typedef {Object} Profile
 * @property {string} id - User UUID
 * @property {string} email
 * @property {string} full_name
 * @property {string} [avatar_url]
 * @property {number} total_scans
 * @property {string} created_at
 * @property {string} updated_at
 */

export {};
