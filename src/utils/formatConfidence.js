/**
 * Format confidence value as percentage string.
 */
export function formatConfidence(confidence, decimals = 1) {
  if (confidence == null) return '-';
  return `${(confidence * 100).toFixed(decimals)}%`;
}

/**
 * Get Tailwind color class based on confidence level.
 */
export function getConfidenceColor(confidence) {
  if (confidence >= 0.8) return 'text-neon-500';
  if (confidence >= 0.5) return 'text-yellow-400';
  return 'text-red-400';
}
