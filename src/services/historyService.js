import { supabase } from '@/lib/supabaseClient';

/**
 * History service — CRUD on scan_history table.
 */
const historyService = {
  async fetchHistory(userId, { limit = 50, offset = 0 } = {}) {
    const { data, error, count } = await supabase
      .from('scan_history')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return { data, count };
  },

  async saveScan({ userId, imageUrl, detectionCount, detections, scanMode, confidenceAvg }) {
    const { data, error } = await supabase
      .from('scan_history')
      .insert({
        user_id: userId,
        image_url: imageUrl,
        detection_count: detectionCount,
        detections,
        scan_mode: scanMode,
        confidence_avg: confidenceAvg,
      })
      .select()
      .single();

    if (error) throw error;

    // Increment total_scans in profiles
    await supabase.rpc('increment_total_scans', { user_id: userId });

    return data;
  },

  async deleteScan(scanId) {
    const { error } = await supabase
      .from('scan_history')
      .delete()
      .eq('id', scanId);

    if (error) throw error;
  },

  async getStats(userId) {
    const { data, error } = await supabase
      .from('scan_history')
      .select('detection_count, scan_mode, created_at')
      .eq('user_id', userId);

    if (error) throw error;

    return {
      totalScans: data.length,
      totalDetections: data.reduce((sum, s) => sum + (s.detection_count || 0), 0),
      liveScans: data.filter(s => s.scan_mode === 'live').length,
      uploadScans: data.filter(s => s.scan_mode === 'upload').length,
    };
  },
};

export default historyService;
